"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useMessageNotifications } from "@/lib/hooks/useMessageNotifications";
import { getAutoDraftQuoteState, type AutoDraftState } from "@/lib/quote-context";

interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  contractorProfile?: { companyName: string; profilePhoto?: string | null } | null;
  homeownerProfile?: { name?: string | null; profilePhoto?: string | null } | null;
}

interface Message {
  id: string;
  body: string;
  createdAt: string;
  readAt?: string | null;
  fromUser: UserProfile;
  toUser: UserProfile;
}

interface Thread {
  id: string;
  lead: {
    id: string;
    title: string;
    status?: string;
    homeowner: UserProfile;
    contractor?: UserProfile | null;
  };
}

interface ChatProps {
  thread: Thread;
  currentUserId?: string;
  onDeleteThread?: (threadId: string) => void;
  // Phase 1 port: AI Reply Assistant
  userRole?: string;
  jobTitle?: string;
  aiEnhanceEnabled?: boolean;
  /** Callback when the auto-draft CTA "Review Quote" button is clicked */
  onAutoDraftReview?: (draft: AutoDraftState['draft'], displayPrice: string, sourceSnippets: string[]) => void;
  /** Callback when the auto-draft CTA "Send Instantly" button is clicked.
   *  Returns a promise that resolves true on success, false on failure. */
  onSendInstantly?: (draft: NonNullable<AutoDraftState['draft']>, displayPrice: string) => Promise<boolean>;
}

function getDisplayName(user: UserProfile | null | undefined): string {
  if (!user) return "User";
  return (
    user.contractorProfile?.companyName ||
    user.homeownerProfile?.name ||
    user.name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

function getProfilePhoto(user: UserProfile | null | undefined): string | null {
  if (!user) return null;
  return user.contractorProfile?.profilePhoto || user.homeownerProfile?.profilePhoto || null;
}

function Avatar({ user, size = "sm" }: { user: UserProfile | null | undefined; size?: "sm" | "md" }) {
  const photo = getProfilePhoto(user);
  const name = getDisplayName(user);
  const initial = name.charAt(0).toUpperCase();
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";

  if (photo) {
    return (
      <img src={photo} alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0 ring-2 ring-white shadow-sm`}
      />
    );
  }
  return (
    <div className={`${sizeClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 ring-2 ring-white bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-sm`}>
      {initial}
    </div>
  );
}

export default function Chat({ thread, currentUserId, onDeleteThread, userRole, jobTitle, aiEnhanceEnabled, onAutoDraftReview, onSendInstantly }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [hiringContractor, setHiringContractor] = useState(false);
  const [contractorHired, setContractorHired] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  // Phase 1: AI Reply Assistant
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [enhancedMessage, setEnhancedMessage] = useState<string | null>(null);
  const [aiEnhanceError, setAiEnhanceError] = useState<string | null>(null);
  // AI hint chip — shown once per session until dismissed
  const [aiHintDismissed, setAiHintDismissed] = useState(false);
  // Auto-draft CTA state
  const [autoDraftState, setAutoDraftState] = useState<AutoDraftState | null>(null);
  const [autoDraftDismissed, setAutoDraftDismissed] = useState(false);
  const [instantSending, setInstantSending] = useState(false);
  const [instantSendSuccess, setInstantSendSuccess] = useState(false);
  const [instantSendError, setInstantSendError] = useState<string | null>(null);
  const lastAutoDraftVersionRef = useRef<string>('');
  const isSendingRef = useRef(false); // blocks interval fetchMessages during optimistic send
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);
  const hasMarkedReadRef = useRef(false);
  const isFirstRenderRef = useRef(true);

  const { notifyNewMessage } = useMessageNotifications({
    enabled: true,
    soundEnabled: true,
    browserNotificationsEnabled: true,
  });

  // Keep a stable ref so fetchMessages doesn't need notifyNewMessage in its deps
  const notifyNewMessageRef = useRef(notifyNewMessage);
  useEffect(() => { notifyNewMessageRef.current = notifyNewMessage; });
  // Hydrate AI hint dismissed state from sessionStorage (once per mount)
  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('aiHintDismissed') === '1') {
      setAiHintDismissed(true);
    }
  }, []);

  // Derive identity values unconditionally (before any early return) so hook
  // count stays constant across renders.  previousIds start with "user_" when
  // User.id was set to an old Clerk ID — this is expected for users whose Clerk
  // workspace was reset.  The value is still the canonical DB primary key.
  const otherUser =
    currentUserId && thread.lead.homeowner.id === currentUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;

  const isHomeowner = !!currentUserId && currentUserId === thread.lead.homeowner.id;
  const canHireContractor =
    isHomeowner && thread.lead.contractor && thread.lead.status !== "assigned" && !contractorHired;
  // Self-user profile — used for optimistic message rendering (mirrors otherUser logic)
  const selfUser = isHomeowner ? thread.lead.homeowner : (thread.lead.contractor ?? thread.lead.homeowner);

  const fetchMessages = useCallback(async () => {
    if (isSendingRef.current) return; // skip during optimistic send window
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        const latestMessage = data.messages[data.messages.length - 1];
        if (latestMessage && lastMessageIdRef.current && latestMessage.id !== lastMessageIdRef.current && latestMessage.fromUser.id !== currentUserId) {
          notifyNewMessageRef.current(getDisplayName(latestMessage.fromUser), latestMessage.body.substring(0, 120), thread.id);
        }
        if (latestMessage) lastMessageIdRef.current = latestMessage.id;
        // ── TEMP DEBUG: trace every message's ownership ──
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Chat][fetchMessages]', {
            threadId: thread.id,
            currentUserId,
            messageCount: data.messages.length,
            messages: data.messages.map((m: Message) => ({
              id: m.id,
              fromUserId: m.fromUser.id,
              toUserId: m.toUser.id,
              isMine: m.fromUser.id === currentUserId,
              bodySnippet: m.body.substring(0, 40),
            })),
          });
        }
        // Only update state if messages actually changed (avoid unnecessary re-renders)
        setMessages((prev) => {
          if (prev.length === data.messages.length && prev[prev.length - 1]?.id === latestMessage?.id) return prev;
          return data.messages;
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [thread.id, currentUserId]);

  const checkTyping = useCallback(async () => {
    try {
      const res = await fetch(`/api/typing-indicators?threadId=${thread.id}&userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        const isTyping = data.typingUsers && data.typingUsers.length > 0;
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Chat][typing-check]', {
            threadId: thread.id,
            excludeSelf: currentUserId,
            typingUsers: data.typingUsers,
            isTyping,
          });
        }
        setOtherUserTyping(isTyping);
      }
    } catch { /* non-critical */ }
  }, [thread.id, currentUserId]);

  const sendTyping = useCallback(async (action: "start" | "stop") => {
    try {
      if (process.env.NODE_ENV === 'development' && action === 'start') {
        console.debug('[Chat][typing]', { action, threadId: thread.id, userId: currentUserId });
      }
      await fetch("/api/typing-indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: thread.id, userId: currentUserId, action }),
      });
    } catch { /* non-critical */ }
  }, [thread.id, currentUserId]);

  const shouldScrollRef = useRef(shouldScrollToBottom);
  useEffect(() => { shouldScrollRef.current = shouldScrollToBottom; }, [shouldScrollToBottom]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (shouldScrollRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior, block: "end" });
    }
  }, []);

  // Mark messages as read when user opens/views this thread (once per mount)
  const markMessagesRead = useCallback(async () => {
    if (!currentUserId || hasMarkedReadRef.current) return;
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Chat][mark-read]', { threadId: thread.id, viewerUserId: currentUserId });
    }
    try {
      const res = await fetch(`/api/threads/${thread.id}/messages`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewerUserId: currentUserId }),
      });
      if (process.env.NODE_ENV === 'development') {
        const readResult = await res.clone().json().catch(() => ({}));
        console.debug('[Chat][mark-read-result]', { threadId: thread.id, status: res.status, ok: res.ok, result: readResult });
      }
      if (res.ok) hasMarkedReadRef.current = true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Chat][mark-read-error]', { threadId: thread.id, error: err });
      }
    }
  }, [thread.id, currentUserId]);

  const handleDeleteThread = async () => {
    if (deleting) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/threads/${thread.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteThread?.(thread.id);
      } else {
        const data = await res.json().catch(() => ({}));
        setDeleteError(res.status === 403 ? data.error || 'Not allowed' : (data.error || 'Failed to delete'));
      }
    } catch {
      setDeleteError('Network error — please try again.');
    } finally {
      setDeleting(false);
      if (!deleteError) setShowDeleteConfirm(false);
    }
  };

  useEffect(() => { fetchMessages(); setShouldScrollToBottom(true); }, [fetchMessages]);
  // Reset mark-read tracker when thread changes so new threads get marked read
  useEffect(() => { hasMarkedReadRef.current = false; }, [thread.id]);
  useEffect(() => {
    if (shouldScrollToBottom) {
      const behavior: ScrollBehavior = isFirstRenderRef.current ? "instant" : "smooth";
      isFirstRenderRef.current = false;
      scrollToBottom(behavior);
    }
  }, [messages, shouldScrollToBottom, scrollToBottom]);
  useEffect(() => {
    markMessagesRead();
    const msgInterval = setInterval(fetchMessages, 3000);
    const typingInterval = setInterval(checkTyping, 2000);
    return () => {
      clearInterval(msgInterval);
      clearInterval(typingInterval);
      // Clear any active typing indicator so the other user doesn't see a stale "typing…" after unmount
      sendTyping("stop");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [fetchMessages, checkTyping, markMessagesRead]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    sendTyping("start");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping("stop"), 2000);
  };

  // ── Auto-draft detection: re-evaluate whenever messages change ───────────
  useEffect(() => {
    if (userRole !== 'contractor' || !onAutoDraftReview || messages.length < 2) {
      setAutoDraftState(null);
      return;
    }
    const msgInputs = messages.map(m => ({
      id: m.id,
      body: m.body,
      fromUserId: m.fromUser.id,
      senderRole: m.fromUser.id === currentUserId ? 'contractor' : 'homeowner',
      createdAt: m.createdAt,
    }));
    const state = getAutoDraftQuoteState(msgInputs, 'contractor', currentUserId);
    setAutoDraftState(state);
    // Reset dismissal when conversation materially changes (new price discussed)
    if (state.contextVersion && state.contextVersion !== lastAutoDraftVersionRef.current) {
      if (lastAutoDraftVersionRef.current !== '') {
        setAutoDraftDismissed(false);
      }
      lastAutoDraftVersionRef.current = state.contextVersion;
    }
  }, [messages, userRole, currentUserId, onAutoDraftReview]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser || sending) return;
    const messageText = newMessage.trim();
    const sendPayload = { fromUserId: currentUserId, toUserId: otherUser.id, message: messageText };
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Chat][send]', {
        threadId: thread.id,
        payload: sendPayload,
        homeownerId: thread.lead.homeowner.id,
        contractorId: thread.lead.contractor?.id,
        isHomeowner: currentUserId === thread.lead.homeowner.id,
      });
    }
    // Insert optimistic message immediately — replaced by server data after confirm
    const optimistic: Message = {
      id: `opt-${Date.now()}`,
      body: messageText,
      createdAt: new Date().toISOString(),
      readAt: null,
      fromUser: selfUser,
      toUser: otherUser as typeof selfUser,
    };
    setMessages(prev => [...prev, optimistic]);
    setNewMessage('');
    setShouldScrollToBottom(true);
    setSending(true);
    setSendError(null);
    isSendingRef.current = true; // prevent interval fetch from removing optimistic
    sendTyping("stop");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendPayload),
      });
      if (response.ok) {
        const sendResult = await response.json();
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Chat][send-ok]', {
            messageId: sendResult.message?.id,
            storedFrom: sendResult.message?.fromUser?.id,
            storedTo: sendResult.message?.toUser?.id,
          });
        }
        // Replace optimistic with confirmed server data.
        // Keep isSendingRef = true until fetchMessages completes to prevent
        // the polling interval from racing and causing a duplicate flash.
        await fetchMessages();
        isSendingRef.current = false;
      } else {
        isSendingRef.current = false;
        const errData = await response.json().catch(() => ({}));
        if (process.env.NODE_ENV === 'development') {
          console.debug('[Chat][send-fail]', { status: response.status, error: errData });
        }
        // Roll back optimistic message and restore input
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        setNewMessage(messageText);
        setSendError(errData.error || "Failed to send. Please try again.");
      }
    } catch (error) {
      isSendingRef.current = false;
      console.error("Error sending message:", error);
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setNewMessage(messageText);
      setSendError("Network error — please check your connection.");
    } finally {
      setSending(false);
    }
  };

  const hireContractor = async () => {
    if (!thread.lead.contractor) return;
    setHiringContractor(true);
    try {
      const response = await fetch(`/api/leads/${thread.lead.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorId: thread.lead.contractor.id }),
      });
      if (response.ok) setContractorHired(true);
    } catch (error) { console.error("Error hiring contractor:", error); }
    finally { setHiringContractor(false); }
  };

  // Phase 1: AI Reply Assistant handler
  const handleAiEnhance = async () => {
    if (!newMessage.trim() || aiEnhancing || !userRole) return;
    setAiEnhancing(true);
    setAiEnhanceError(null);
    setEnhancedMessage(null);
    try {
      const res = await fetch("/api/ai/enhance-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage.trim(),
          role: userRole,
          jobTitle: jobTitle || "",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.improvedMessage) {
          setEnhancedMessage(data.improvedMessage);
        } else {
          setAiEnhanceError("AI returned an empty response. Try again.");
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        setAiEnhanceError(errData.error || "AI enhance failed. Try again.");
      }
    } catch {
      setAiEnhanceError("Network error — AI enhance unavailable.");
    } finally {
      setAiEnhancing(false);
    }
  };

  // Dismiss the AI hint chip and persist for this browser session
  const dismissAiHint = () => {
    setAiHintDismissed(true);
    if (typeof window !== 'undefined') sessionStorage.setItem('aiHintDismissed', '1');
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Guard: parent should prevent rendering without currentUserId, but catch it safely.
  // Placed AFTER all hooks to satisfy React Rules of Hooks.
  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-gray-500">Please sign in to view messages</p>
      </div>
    );
  }

  const formatDateSeparator = (ts: string) => {
    const d = new Date(ts);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
  };

  // Build list with date separators
  const items: Array<{ type: "sep"; date: string; key: string } | { type: "msg"; msg: Message }> = [];
  let lastDate = "";
  for (const msg of messages) {
    const dateStr = new Date(msg.createdAt).toDateString();
    if (dateStr !== lastDate) {
      items.push({ type: "sep", date: msg.createdAt, key: `sep-${msg.id}` });
      lastDate = dateStr;
    }
    items.push({ type: "msg", msg });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          {isHomeowner && otherUser?.contractorProfile ? (
            <Link href={`/contractors/profile/${otherUser.id}`} className="flex items-center gap-3 min-w-0 group">
              <Avatar user={otherUser} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight group-hover:text-rose-700 transition-colors">{getDisplayName(otherUser)}</p>
                <p className="text-xs text-rose-500 font-medium">View Profile →</p>
              </div>
            </Link>
          ) : (
            <>
              <Avatar user={otherUser} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{getDisplayName(otherUser)}</p>
                <p className="text-xs text-slate-400 truncate">{thread.lead.title}</p>
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Delete chat */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete chat"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-red-600 font-medium hidden sm:block">Delete?</span>
              <button onClick={handleDeleteThread} disabled={deleting}
                className="px-2.5 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60 transition-colors"
              >{deleting ? '…' : 'Yes'}</button>
              <button onClick={() => { setShowDeleteConfirm(false); setDeleteError(null); }}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >No</button>
              {deleteError && <span className="text-[10px] text-red-500 max-w-[120px] truncate">{deleteError}</span>}
            </div>
          )}
          {canHireContractor && (
            <button onClick={hireContractor} disabled={hiringContractor}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg disabled:opacity-60 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {hiringContractor ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "✓"}
              {hiringContractor ? "Hiring..." : "Hire Contractor"}
            </button>
          )}
          {contractorHired && (
            <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
              ✓ Hired!
            </span>
          )}
        </div>
      </div>

      {/* Messages — single primary scroll container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 pt-4 min-h-0 space-y-1 overscroll-contain"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#f97316 #f9fafb",
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          WebkitOverflowScrolling: 'touch',
        }}
        onScroll={(e) => {
          const el = e.currentTarget;
          setShouldScrollToBottom(el.scrollHeight - el.scrollTop <= el.clientHeight + 80);
        }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Start the conversation</p>
            <p className="text-xs text-gray-400 mt-1">Say hello to {getDisplayName(otherUser)}</p>
          </div>
        ) : (
          items.map((item, idx) => {
            if (item.type === "sep") {
              return (
                <div key={item.key} className="flex items-center gap-3 my-5">
                  <hr className="flex-1 border-gray-100" />
                  <span className="text-[11px] text-gray-400 font-medium px-2 whitespace-nowrap">{formatDateSeparator(item.date)}</span>
                  <hr className="flex-1 border-gray-100" />
                </div>
              );
            }
            const { msg } = item;
            const isMine = msg.fromUser.id === currentUserId;
            const nextItem = items[idx + 1];
            const showAvatar = !nextItem || nextItem.type === "sep" || (nextItem.type === "msg" && nextItem.msg.fromUser.id !== msg.fromUser.id);
            // Show "Seen" only under the last outgoing message that has been read by recipient
            const isLastOutgoing = isMine && (!items.slice(idx + 1).some(i => i.type === "msg" && i.msg.fromUser.id === currentUserId));
            const seenByRecipient = isLastOutgoing && !!msg.readAt;
            return (
              <div key={msg.id} className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"} group`}>
                <div className={`w-8 flex-shrink-0 ${showAvatar ? "" : "invisible"}`}>
                  <Avatar user={msg.fromUser} size="sm" />
                </div>
                  <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[72%]`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words whitespace-pre-wrap shadow-sm ${
                    isMine
                      ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}>
                    {msg.body}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] text-gray-400 transition-opacity ${seenByRecipient ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                    {seenByRecipient && (
                      <span className="text-[10px] text-rose-400 font-semibold flex items-center gap-0.5">
                        <svg className="w-3 h-3" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
                        </svg>
                        Seen
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex items-end gap-2">
            <Avatar user={otherUser} size="sm" />
            <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
              {[0, 150, 300].map((delay) => (
                <div key={delay} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="flex-shrink-0 px-3 py-2.5 border-t border-gray-100 bg-white"
        style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))' }}
      >
        {/* Auto-draft CTA — contractor only, shown when price detected in conversation */}
        {autoDraftState?.shouldSuggestDraft && !autoDraftDismissed && !instantSendSuccess && (onAutoDraftReview || onSendInstantly) && (
          <div className="mb-2 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-orange-50 px-3 py-2.5">
            <div className="flex items-center gap-2 mb-1">
              <svg className="w-4 h-4 text-rose-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-semibold text-rose-800">Draft quote ready</span>
              {autoDraftState.displayPrice && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded-full">
                  {autoDraftState.displayPrice}
                </span>
              )}
            </div>
            <p className="text-[11px] text-rose-700/80 leading-snug">
              Based on your conversation · Using {autoDraftState.displayPrice} from chat
            </p>
            {/* Source snippet(s) */}
            {autoDraftState.sourceSnippets.length > 0 && (
              <div className="mt-1 space-y-0.5">
                {autoDraftState.sourceSnippets.map((s, i) => (
                  <p key={i} className="text-[10px] text-rose-600/70 italic truncate">&ldquo;{s}&rdquo;</p>
                ))}
              </div>
            )}
            {/* Instant send error */}
            {instantSendError && (
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-red-600">
                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-4v2h2V5H9z" clipRule="evenodd" />
                </svg>
                <span>{instantSendError}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-2">
              {onAutoDraftReview && (
                <button
                  type="button"
                  disabled={instantSending}
                  onClick={() => {
                    if (autoDraftState.draft && autoDraftState.displayPrice) {
                      onAutoDraftReview(autoDraftState.draft, autoDraftState.displayPrice, autoDraftState.sourceSnippets);
                    }
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-rose-700 text-xs font-semibold rounded-lg border border-rose-300 transition-colors disabled:opacity-50"
                >
                  Review Quote
                </button>
              )}
              {onSendInstantly && (
                <button
                  type="button"
                  disabled={instantSending}
                  onClick={async () => {
                    if (!autoDraftState.draft || !autoDraftState.displayPrice) return;
                    setInstantSending(true);
                    setInstantSendError(null);
                    try {
                      const ok = await onSendInstantly(autoDraftState.draft, autoDraftState.displayPrice);
                      if (ok) {
                        setInstantSendSuccess(true);
                        setAutoDraftDismissed(true);
                      } else {
                        setInstantSendError('Failed to send. Try Review Quote instead.');
                      }
                    } catch {
                      setInstantSendError('Network error. Try again.');
                    } finally {
                      setInstantSending(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                >
                  {instantSending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Instantly
                    </>
                  )}
                </button>
              )}
              <button
                type="button"
                disabled={instantSending}
                onClick={() => setAutoDraftDismissed(true)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-500 text-xs font-semibold rounded-lg border border-slate-200 transition-colors disabled:opacity-50"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Send Instantly success state — compact, auto-fading */}
        {instantSendSuccess && (
          <div className="mb-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs font-semibold text-green-800">Quote sent successfully!</span>
          </div>
        )}

        {sendError && (
          <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4h2V9H9zm0-4v2h2V5H9z" clipRule="evenodd" />
            </svg>
            <span className="flex-1">{sendError}</span>
            <button onClick={() => setSendError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
          </div>
        )}

        {/* AI Reply Assistant — error banner */}
        {aiEnhanceError && (
          <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="flex-1">{aiEnhanceError}</span>
            <button onClick={() => setAiEnhanceError(null)} className="ml-auto text-amber-500 hover:text-amber-700">✕</button>
          </div>
        )}

        {/* AI Reply Assistant — preview banner (scrollable on mobile) */}
        {enhancedMessage && (
          <div className="mb-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5" style={{ maxHeight: '50dvh' }}>
            <div className="flex items-center gap-1.5 mb-1.5 flex-shrink-0">
              <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" />
              </svg>
              <span className="text-[11px] font-semibold text-violet-700 uppercase tracking-wide">AI Suggestion</span>
            </div>
            <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(50dvh - 80px)' }}>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{enhancedMessage}</p>
            </div>
            <div className="flex items-center gap-2 mt-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setNewMessage(enhancedMessage);
                  setEnhancedMessage(null);
                }}
                className="px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Insert into Message
              </button>
              <button
                type="button"
                onClick={() => setEnhancedMessage(null)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              handleInputChange(e);
              // Clear any stale AI preview when the user edits the message
              if (enhancedMessage) setEnhancedMessage(null);
            }}
            onFocus={() => {
              setShouldScrollToBottom(true);
              // Delay accounts for iOS keyboard animation (~300ms)
              setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' }), 320);
            }}
            placeholder={`Message ${getDisplayName(otherUser)}...`}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all placeholder-gray-400"
            style={{ fontSize: '16px' }}
          />
          {/* AI sparkle button — always visible when AI is enabled.
               One-time session hint chip explains what it does. */}
          {aiEnhanceEnabled && (
            <div className="relative flex-shrink-0">
              {/* One-time discoverable hint — shows until dismissed, stored per session */}
              {!aiHintDismissed && (
                <div className="absolute bottom-full right-0 mb-2 z-20 pointer-events-auto">
                  <div className="relative bg-violet-700 text-white rounded-2xl rounded-br-sm px-3 py-2 shadow-lg w-44">
                    <p className="text-[11px] font-semibold leading-tight">AI can help draft replies</p>
                    <p className="text-[10px] text-violet-200 mt-0.5 leading-tight">Tap ✦ to improve your message</p>
                    <button
                      type="button"
                      onClick={dismissAiHint}
                      aria-label="Dismiss AI hint"
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-violet-900 hover:bg-black text-white rounded-full flex items-center justify-center text-[9px] leading-none transition-colors"
                    >✕</button>
                    {/* Downward arrow pointing toward the button */}
                    <div className="absolute -bottom-1.5 right-3.5 w-3 h-3 bg-violet-700 rotate-45 rounded-sm" />
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={handleAiEnhance}
                disabled={aiEnhancing || !newMessage.trim()}
                title={newMessage.trim() ? 'Improve with AI' : 'Type a message to use AI assist'}
                className="w-10 h-10 bg-violet-100 hover:bg-violet-200 active:bg-violet-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-violet-600 rounded-full flex items-center justify-center transition-all duration-150"
              >
                {aiEnhancing ? (
                  <div className="w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" />
                  </svg>
                )}
              </button>
            </div>
          )}
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 active:from-rose-700 active:to-orange-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all duration-150 shadow-md hover:shadow-lg"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4 translate-x-px" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

