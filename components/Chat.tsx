"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMessageNotifications } from "@/lib/hooks/useMessageNotifications";

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
}

function getDisplayName(user: UserProfile | null | undefined): string {
  if (!user) return "Unknown User";
  return user.contractorProfile?.companyName || user.homeownerProfile?.name || user.name || user.email;
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

export default function Chat({ thread, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [hiringContractor, setHiringContractor] = useState(false);
  const [contractorHired, setContractorHired] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  const { notifyNewMessage } = useMessageNotifications({
    enabled: true,
    soundEnabled: true,
    browserNotificationsEnabled: true,
  });

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p className="text-gray-500">Please sign in to view messages</p>
      </div>
    );
  }

  const otherUser =
    thread.lead.homeowner.id === currentUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;

  const isHomeowner = currentUserId === thread.lead.homeowner.id;
  const canHireContractor =
    isHomeowner && thread.lead.contractor && thread.lead.status !== "assigned" && !contractorHired;

  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        const latestMessage = data.messages[data.messages.length - 1];
        if (latestMessage && lastMessageIdRef.current && latestMessage.id !== lastMessageIdRef.current && latestMessage.fromUser.id !== currentUserId) {
          notifyNewMessage(getDisplayName(latestMessage.fromUser), latestMessage.body.substring(0, 120), thread.id);
        }
        if (latestMessage) lastMessageIdRef.current = latestMessage.id;
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [thread.id, currentUserId, notifyNewMessage]);

  const checkTyping = useCallback(async () => {
    try {
      const res = await fetch(`/api/typing-indicators?threadId=${thread.id}&userId=${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setOtherUserTyping(data.typingUsers && data.typingUsers.length > 0);
      }
    } catch { /* non-critical */ }
  }, [thread.id, currentUserId]);

  const sendTyping = useCallback(async (action: "start" | "stop") => {
    try {
      await fetch("/api/typing-indicators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ threadId: thread.id, userId: currentUserId, action }),
      });
    } catch { /* non-critical */ }
  }, [thread.id, currentUserId]);

  const scrollToBottom = useCallback(() => {
    if (shouldScrollToBottom && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [shouldScrollToBottom]);

  useEffect(() => { fetchMessages(); setShouldScrollToBottom(true); }, [fetchMessages]);
  useEffect(() => { if (shouldScrollToBottom) scrollToBottom(); }, [messages, shouldScrollToBottom, scrollToBottom]);
  useEffect(() => {
    const msgInterval = setInterval(fetchMessages, 3000);
    const typingInterval = setInterval(checkTyping, 2000);
    return () => { clearInterval(msgInterval); clearInterval(typingInterval); };
  }, [fetchMessages, checkTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    sendTyping("start");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTyping("stop"), 2000);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !otherUser || sending) return;
    setSending(true);
    sendTyping("stop");
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUserId: currentUserId, toUserId: otherUser.id, message: newMessage.trim() }),
      });
      if (response.ok) { setNewMessage(""); setShouldScrollToBottom(true); await fetchMessages(); }
    } catch (error) {
      console.error("Error sending message:", error);
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

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
          <p className="text-sm text-gray-500">Loading messagesâ€¦</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 py-3.5 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar user={otherUser} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate leading-tight">{getDisplayName(otherUser)}</p>
            <p className="text-xs text-slate-400 truncate">{thread.lead.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {canHireContractor && (
            <button onClick={hireContractor} disabled={hiringContractor}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg disabled:opacity-60 flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {hiringContractor ? <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : "âœ…"}
              {hiringContractor ? "Hiringâ€¦" : "Hire Contractor"}
            </button>
          )}
          {contractorHired && (
            <span className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-200">
              âœ… Hired!
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 min-h-0 space-y-1"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#f97316 #f9fafb" }}
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
                  <span className="text-[10px] mt-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(msg.createdAt)}
                  </span>
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
      <div className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder={`Message ${getDisplayName(otherUser)}â€¦`}
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all placeholder-gray-400"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-10 h-10 flex-shrink-0 bg-gradient-to-br from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg"
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

