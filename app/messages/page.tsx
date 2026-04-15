// LIVE PRODUCTION ROUTE — /messages
// Messaging inbox for both contractors and homeowners.
"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import Chat from "@/components/Chat";
import LiveQuoteBuilder from "@/components/LiveQuoteBuilder";
import type { QuoteCardPayload } from "@/components/QuoteMessageCard";
import QuoteBottomSheet from "@/components/QuoteBottomSheet";
import LoadingState from "@/components/ui/LoadingState";
import { ChatBubbleLeftRightIcon, ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

interface UserInThread {
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
  fromUser: UserInThread;
}

interface Thread {
  id: string;
  unreadCount?: number;
  lead: {
    id: string;
    title: string;
    homeowner: UserInThread;
    contractor?: UserInThread | null;
  };
  messages: Message[];
}

// Phase 2: Quote data shape returned by /api/quotes
interface QuoteResult {
  id: string;
  title: string;
  totalCost: number;
  laborCost: number;
  materialCost: number;
  scope: string;
  status: string;
  version?: number;
  items: Array<{ id: string }>;
}

function getDisplayName(user: UserInThread | null | undefined): string {
  if (!user) return "User";
  return (
    user.contractorProfile?.companyName ||
    user.homeownerProfile?.name ||
    user.name ||
    user.email?.split("@")[0] ||
    "User"
  );
}

function getPhoto(user: UserInThread | null | undefined): string | null {
  if (!user) return null;
  return user.contractorProfile?.profilePhoto || user.homeownerProfile?.profilePhoto || null;
}

function ConvAvatar({ user }: { user: UserInThread | null | undefined }) {
  const photo = getPhoto(user);
  const name = getDisplayName(user);
  if (photo) {
    return <img src={photo} alt={name} className="avatar-img w-11 h-11 rounded-full object-cover flex-shrink-0 shadow-sm" />;
  }
  return (
    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-600 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-sm font-bold text-white">{name.charAt(0).toUpperCase()}</span>
    </div>
  );
}

export default function MessagesPage() {
  const { authUser: user } = useAuth();
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  // selfUserId is the resolved DB primary key for the current user.
  // useAuth returns the Clerk ID, which may differ from the DB id for
  // webhook-created accounts.  The threads API resolves and returns it.
  const [selfUserId, setSelfUserId] = useState<string>("");
  const [threadsError, setThreadsError] = useState<string | null>(null);

  // Phase 2: Quote panel + LiveQuoteBuilder state
  const [showQuoteBuilder, setShowQuoteBuilder] = useState(false);
  const [bridgeConversationId, setBridgeConversationId] = useState<string | null>(null);
  const [bridgeHomeownerId, setBridgeHomeownerId] = useState<string | null>(null);
  const [bridgeContractorId, setBridgeContractorId] = useState<string | null>(null);
  const [bridgeJobId, setBridgeJobId] = useState<string | null>(null);
  const [bridgeLoading, setBridgeLoading] = useState(false);
  const [bridgeError, setBridgeError] = useState<string | null>(null);
  const [latestQuotes, setLatestQuotes] = useState<QuoteResult[]>([]);
  const [isFetchingQuotes, setIsFetchingQuotes] = useState(false);
  const [reviseQuoteId, setReviseQuoteId] = useState<string | undefined>(undefined);
  // editDraftQuoteId: when set, LiveQuoteBuilder loads this existing draft instead of generating new
  const [editDraftQuoteId, setEditDraftQuoteId] = useState<string | undefined>(undefined);
  // showQuoteSheet: controls the bottom sheet for viewing quote details
  const [showQuoteSheet, setShowQuoteSheet] = useState(false);
  // Auto-draft prefill data from CTA in Chat
  const [autoDraftPrefill, setAutoDraftPrefill] = useState<{
    suggestedTitle: string;
    scopeOfWork: string;
    totalCost: number;
    laborCost: number;
    materialCost: number;
    displayPrice: string;
    sourceSnippets?: string[];
  } | null>(null);

  // Phase A: Staleness guard — tracks which thread the in-flight bridge/quote fetch belongs to.
  // If the user switches threads before the async call completes, we discard stale results.
  const currentBridgeThreadIdRef = useRef<string | null>(null);
  // Quote polling — clears when bridge conversation changes or thread is deselected
  const quotePollRef = useRef<NodeJS.Timeout | null>(null);

  // Select a thread and optimistically clear its unread badge
  const selectThread = (thread: Thread) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('[Messages][select-thread]', {
        threadId: thread.id,
        leadId: thread.lead.id,
        homeownerId: thread.lead.homeowner?.id,
        contractorId: thread.lead.contractor?.id,
        selfUserId,
      });
    }
    setSelectedThread(thread);
    if ((thread.unreadCount ?? 0) > 0) {
      setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
    }
  };

  // Reset all messaging state when the authenticated user changes (account switch)
  const prevUserIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (user?.id && prevUserIdRef.current && prevUserIdRef.current !== user.id) {
      // User switched accounts — clear stale state
      if (process.env.NODE_ENV === 'development') {
        console.debug('[Messages][account-switch]', { from: prevUserIdRef.current, to: user.id });
      }
      setSelfUserId("");
      setThreads([]);
      setSelectedThread(null);
      setBridgeConversationId(null);
      setBridgeHomeownerId(null);
      setBridgeContractorId(null);
      setBridgeJobId(null);
      setLatestQuotes([]);
      setSearchTerm("");
    }
    prevUserIdRef.current = user?.id ?? null;
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchThreads();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Auto-select thread from URL parameter (?threadId= or ?leadId=)
  useEffect(() => {
    const threadId = searchParams.get('threadId');
    const leadId = searchParams.get('leadId');

    if (threads.length > 0) {
      const targetThread = threadId
        ? threads.find(thread => thread.id === threadId)
        : leadId
          ? threads.find(thread => thread.lead.id === leadId)
          : null;

      if (targetThread) {
        selectThread(targetThread);
      }
    }
  }, [threads, searchParams]);

  // Phase B: Handle ?conversationId= URL param — legacy notification links.
  // Looks up the Conversation's jobId, then finds the matching Thread.
  // Runs separately from the threadId/leadId effect so it doesn't interfere.
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (!conversationId || threads.length === 0 || selectedThread) return;

    fetch(`/api/conversations/${encodeURIComponent(conversationId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.jobId) return;
        const match = threads.find(t => t.lead.id === data.jobId);
        if (match) selectThread(match);
      })
      .catch(() => { /* non-critical — user lands on /messages without auto-select */ });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threads, searchParams]);

  // Phase 2: Bridge + quotes — runs whenever the selected thread changes.
  // Calls the bridge API to find/create a Conversation for this Thread's lead,
  // then fetches any existing quotes. Only fires when a contractor is assigned.
  useEffect(() => {
    if (!selectedThread) {
      // Clear all bridge + quote state when no thread is selected
      setBridgeConversationId(null);
      setBridgeHomeownerId(null);
      setBridgeContractorId(null);
      setBridgeJobId(null);
      setBridgeError(null);
      setLatestQuotes([]);
      setShowQuoteSheet(false);
      setEditDraftQuoteId(undefined);
      setAutoDraftPrefill(null);
      return;
    }

    if (!selectedThread.lead.contractor?.id) {
      // No contractor assigned yet — bridge not needed
      currentBridgeThreadIdRef.current = null;
      setBridgeConversationId(null);
      setLatestQuotes([]);
      setShowQuoteSheet(false);
      setEditDraftQuoteId(undefined);
      setAutoDraftPrefill(null);
      return;
    }

    // Stamp which thread this fetch belongs to BEFORE the async call fires
    currentBridgeThreadIdRef.current = selectedThread.id;
    // Clear stale quotes from previous thread immediately so no old data shows
    setLatestQuotes([]);
    callBridge(selectedThread.id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedThread?.id]);

  // Phase 2: Call the bridge API — find or create Conversation for this Thread
  const callBridge = async (threadId: string) => {
    setBridgeLoading(true);
    setBridgeError(null);
    try {
      const res = await fetch(`/api/conversations/for-thread?threadId=${encodeURIComponent(threadId)}`);
      // Phase A guard: discard result if thread changed while we were waiting
      if (currentBridgeThreadIdRef.current !== threadId) return;
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBridgeError(data.error || 'Failed to load quote data');
        return;
      }
      const data = await res.json();
      if (currentBridgeThreadIdRef.current !== threadId) return;
      setBridgeConversationId(data.conversationId);
      setBridgeHomeownerId(data.homeownerId);
      setBridgeContractorId(data.contractorId);
      setBridgeJobId(data.jobId);
      // Now fetch any existing quotes for this conversation
      await fetchLatestQuotes(data.conversationId, threadId);
    } catch {
      if (currentBridgeThreadIdRef.current === threadId) {
        setBridgeError('Network error — quote data unavailable');
      }
    } finally {
      if (currentBridgeThreadIdRef.current === threadId) {
        setBridgeLoading(false);
      }
    }
  };

  // Phase 2: Fetch the latest non-superseded quotes for a conversation.
  // expectedThreadId is set by callBridge so we can discard stale results on fast thread switching.
  const fetchLatestQuotes = async (conversationId: string, expectedThreadId?: string) => {
    setIsFetchingQuotes(true);
    try {
      const res = await fetch(`/api/quotes?conversationId=${encodeURIComponent(conversationId)}`);
      // Phase A guard: discard if thread changed
      if (expectedThreadId && currentBridgeThreadIdRef.current !== expectedThreadId) return;
      if (!res.ok) return;
      const data = await res.json();
      if (expectedThreadId && currentBridgeThreadIdRef.current !== expectedThreadId) return;
      // Homeowners only see sent/accepted/revision_requested quotes — drafts are private to contractor
      const isHomeowner = user?.role === 'homeowner';
      const active = (data.quotes as QuoteResult[]).filter(q => {
        if (q.status === 'superseded') return false;
        if (isHomeowner && q.status === 'draft') return false;
        return true;
      });
      setLatestQuotes(active);
    } catch {
      // Non-critical — quote panel simply won't show
    } finally {
      setIsFetchingQuotes(false);
    }
  };

  // Quote polling — re-fetches every 8s when bridge is resolved so homeowner sees sent quotes
  // without needing to navigate away and back to trigger the bridge effect.
  useEffect(() => {
    if (quotePollRef.current) clearInterval(quotePollRef.current);
    if (!bridgeConversationId) return;
    const convId = bridgeConversationId; // capture for closure safety
    quotePollRef.current = setInterval(() => {
      fetchLatestQuotes(convId);
    }, 8000);
    return () => {
      if (quotePollRef.current) clearInterval(quotePollRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bridgeConversationId]);

  // Phase 2 / Phase A: Open the quote builder.
  // If a draft already exists in the panel, open it for editing instead of generating a new one.
  // Guard: prevent double-open and opening while bridge is still resolving.
  const handleGenerateQuote = async () => {
    if (!selectedThread || showQuoteBuilder) return;
    // Reuse existing draft rather than generating a second one
    const existingDraft = latestQuotes.find(q => q.status === 'draft');
    if (existingDraft) {
      setEditDraftQuoteId(existingDraft.id);
      setReviseQuoteId(undefined);
      setShowQuoteBuilder(true);
      return;
    }
    if (!bridgeConversationId) {
      await callBridge(selectedThread.id);
    }
    setEditDraftQuoteId(undefined);
    setReviseQuoteId(undefined);
    setShowQuoteBuilder(true);
  };

  // Phase 2: Homeowner accepts a quote
  const handleQuoteAccept = async (quoteId: string) => {
    if (!selfUserId) return;
    const res = await fetch(`/api/quotes/${quoteId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept', userId: selfUserId }),
    });
    if (res.ok && bridgeConversationId) {
      await fetchLatestQuotes(bridgeConversationId);
    }
  };

  // Phase 2: Homeowner requests changes on a quote
  const handleQuoteRequestChanges = async (quoteId: string, note: string) => {
    if (!selfUserId) return;
    const res = await fetch(`/api/quotes/${quoteId}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'request_changes', note, userId: selfUserId }),
    });
    if (res.ok && bridgeConversationId) {
      await fetchLatestQuotes(bridgeConversationId);
    }
  };

  // Phase 2: Contractor opens revision builder for a quote
  const handleQuoteRevise = (quoteId: string) => {
    setReviseQuoteId(quoteId);
    setShowQuoteBuilder(true);
  };

  const fetchThreads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setThreadsError(null);
      const response = await fetch(`/api/threads?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
        // Store the resolved DB user ID for accurate conversation-partner detection.
        // This handles accounts where User.id (UUID) differs from Clerk ID.
        if (data.selfUserId) {
          setSelfUserId(data.selfUserId);
        }
        // ── TEMP DEBUG: full thread fetch trace ──
        if (process.env.NODE_ENV === 'development') {
          const threadIds = (data.threads || []).map((t: Thread) => t.id);
          console.debug('[Messages][fetchThreads]', {
            clerkUserId: user.id,
            dbSelfUserId: data.selfUserId,
            idMatch: user.id === data.selfUserId,
            threadCount: threadIds.length,
            threadIds,
            role: user.role,
          });
        }
      } else {
        setThreadsError("Failed to load conversations. Please refresh.");
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
      setThreadsError("Network error — please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const deleteThread = async (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the thread
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/threads/${threadId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove thread from local state
        setThreads(prev => prev.filter(thread => thread.id !== threadId));
        // Clear selection if deleted thread was selected
        if (selectedThread?.id === threadId) {
          setSelectedThread(null);
        }
      } else {
        const data = await response.json().catch(() => ({}));
        const msg = data.error || 'Failed to delete conversation.';
        alert(response.status === 403 ? `Not allowed: ${msg}` : msg);
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Network error — please check your connection and try again.');
    }
  };

  const getConversationPartner = (thread: Thread): UserInThread | null | undefined => {
    if (!user) return null;
    // Compare against the resolved DB id (selfUserId) rather than the raw Clerk ID (user.id).
    // For webhook-created users, User.id is a UUID while user.id from useAuth is the Clerk ID.
    if (!selfUserId) return null;
    return thread.lead.homeowner.id === selfUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;
  };

  const getLastMessage = (thread: Thread) => {
    return thread.messages[0] || null;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredThreads = threads.filter(thread => {
    if (!searchTerm) return true;
    const partner = getConversationPartner(thread);
    const partnerName = getDisplayName(partner);
    return (
      thread.lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading || !user) {
    return (
      <LoadingState
        title="Loading messages"
        subtitle="Connecting you to your conversations"
        className="min-h-[calc(100vh-140px)]"
      />
    );
  }

  return (
    <div
      className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex flex-col overflow-hidden"
      style={{
        height: 'calc(100dvh - var(--header-height, 64px) - var(--bottom-nav-height, 72px))',
        minHeight: '400px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col w-full overflow-hidden min-h-0">
        {/* Modern Header */}
        <div className="mb-3 sm:mb-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-slate-700 bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="text-slate-500 mt-1 text-sm sm:text-lg hidden sm:block">Stay connected with your project partners</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Online</span>
            </div>
          </div>
        </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 flex-1 min-h-0 overflow-hidden">
          {/* Conversations List - Modern Sidebar */}
          <div className={`lg:col-span-4 xl:col-span-3 flex-col min-h-0 h-full max-h-full ${selectedThread ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden backdrop-blur-none relative z-10 h-full w-full max-w-full">
              {/* Header with Search */}
              <div className="p-3 sm:p-5 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Conversations</h2>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-600 to-orange-600 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Modern Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Conversations List with Enhanced Scroll */}
              <div className="flex-1 overflow-y-auto bg-white chat-scroll min-h-0 overscroll-contain">
                <style jsx>{`
                  .chat-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #f97316 #f8fafc;
                  }
                  .chat-scroll::-webkit-scrollbar {
                    width: 10px;
                  }
                  .chat-scroll::-webkit-scrollbar-track {
                    background: #f8fafc;
                    border-radius: 12px;
                    margin: 8px 0;
                  }
                  .chat-scroll::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #f97316, #ea580c);
                    border-radius: 12px;
                    border: 2px solid #fed7aa;
                    transition: all 0.3s ease;
                  }
                  .chat-scroll::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #ea580c, #dc2626);
                    transform: scaleX(1.1);
                    border-color: #fdba74;
                  }
                  .chat-scroll::-webkit-scrollbar-thumb:active {
                    background: linear-gradient(to bottom, #dc2626, #b91c1c);
                    border-color: #f97316;
                  }
                  .chat-scroll {
                    position: relative;
                  }
                  .chat-scroll::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 2px;
                    height: 100%;
                    background: linear-gradient(to bottom, rgba(249, 115, 22, 0.1), transparent);
                    pointer-events: none;
                    z-index: 1;
                  }
                `}</style>
                {threadsError ? (
                  <div className="flex items-center justify-center h-48 px-4">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <p className="text-sm font-medium text-slate-700">{threadsError}</p>
                      <button onClick={fetchThreads} className="mt-2 text-xs text-rose-600 hover:underline font-medium">Try again</button>
                    </div>
                  </div>
                ) : filteredThreads.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-slate-500 px-4">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      {threads.length > 0 && searchTerm ? (
                        <>
                          <p className="font-medium text-slate-700">No results for "{searchTerm}"</p>
                          <button onClick={() => setSearchTerm('')} className="text-xs text-rose-600 hover:underline mt-1 font-medium">Clear search</button>
                        </>
                      ) : user?.role === 'homeowner' ? (
                        <>
                          <p className="font-semibold text-slate-800">No conversations yet</p>
                          <p className="text-sm mt-1 text-slate-400 leading-snug">Post a job to connect with<br/>verified local contractors</p>
                          <Link href="/create-lead" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-sm">
                            Post a Job
                          </Link>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-slate-800">No conversations yet</p>
                          <p className="text-sm mt-1 text-slate-400 leading-snug">Accept a job lead to start<br/>messaging homeowners</p>
                          <Link href="/contractor/jobs" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white text-sm font-semibold rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all shadow-sm">
                            Browse Jobs
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredThreads.map((thread) => {
                      const lastMessage = thread.messages[0] || null;
                      const isSelected = selectedThread?.id === thread.id;
                      const myId = selfUserId;
                      const otherUser = thread.lead.homeowner.id === myId
                        ? thread.lead.contractor
                        : thread.lead.homeowner;
                      
                      return (
                        <div
                          key={thread.id}
                          onClick={() => selectThread(thread)}
                          className={`group relative p-3 cursor-pointer rounded-xl transition-all duration-150 active:scale-[0.99] ${
                            isSelected
                              ? 'bg-rose-100 border-l-4 border-rose-600 shadow-md'
                              : (thread.unreadCount ?? 0) > 0
                                ? 'bg-gradient-to-r from-rose-50/90 to-slate-50 border-l-4 border-rose-500 shadow-sm ring-1 ring-rose-100'
                                : 'hover:bg-slate-50 border-l-4 border-transparent'
                          }`}
                        >
                          {/* Delete Button — always visible on mobile, hover-reveal on desktop */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteThread(thread.id, e);
                            }}
                            className="absolute top-3 right-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-7 h-7 rounded-md bg-red-100 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all duration-200 z-20"
                            title="Delete conversation"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div className="flex items-start space-x-3">
                            {/* Avatar with unread dot */}
                            <div className="relative flex-shrink-0">
                              <ConvAvatar user={otherUser} />
                              {(thread.unreadCount ?? 0) > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1.5 bg-rose-600 rounded-full flex items-center justify-center shadow-sm">
                                  <span className="text-[10px] font-bold text-white leading-none">
                                    {(thread.unreadCount ?? 0) > 9 ? '9+' : thread.unreadCount}
                                  </span>
                                </span>
                              )}
                              {(thread.unreadCount ?? 0) > 0 && !isSelected && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-8">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-sm truncate leading-tight ${
                                  (thread.unreadCount ?? 0) > 0
                                    ? 'font-extrabold text-slate-900'
                                    : 'font-medium text-slate-600'
                                }`}>
                                  {getDisplayName(otherUser)}
                                </p>
                                {lastMessage && (
                                  <span className={`text-xs flex-shrink-0 ${
                                    (thread.unreadCount ?? 0) > 0 ? 'text-rose-500 font-semibold' : 'text-slate-400'
                                  }`}>
                                    {formatTime(lastMessage.createdAt)}
                                  </span>
                                )}
                              </div>

                              <p className={`text-xs truncate ${
                                (thread.unreadCount ?? 0) > 0 ? 'text-slate-600 font-medium' : 'text-slate-400'
                              }`}>
                                {thread.lead.title}
                              </p>

                              {lastMessage ? (
                                <p className={`text-xs mt-0.5 line-clamp-1 leading-relaxed ${
                                  (thread.unreadCount ?? 0) > 0
                                    ? 'text-slate-800 font-semibold'
                                    : 'text-slate-400'
                                }`}>
                                  {lastMessage.body}
                                </p>
                              ) : (
                                <p className="text-xs text-slate-400 mt-1 italic">No messages yet</p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modern Chat Area */}
          <div className={`lg:col-span-8 xl:col-span-9 flex-col min-h-0 overflow-hidden ${selectedThread ? 'flex' : 'hidden lg:flex'}`}>
            {selectedThread ? (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 flex flex-col overflow-hidden relative z-10 h-full min-h-0">
                <div className="lg:hidden px-4 py-3">
                  <button
                    onClick={() => setSelectedThread(null)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to conversations
                  </button>
                </div>

                {/* Phase 2: Generate Quote — contractor only, requires contractor assigned to lead */}
                {user?.role === 'contractor' && selectedThread?.lead?.contractor?.id && (
                  <div className="flex-shrink-0 px-4 py-2 border-b border-gray-100 bg-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <DocumentTextIcon className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">Quotes</span>
                      {isFetchingQuotes && (
                        <div className="w-3 h-3 border border-slate-300 border-t-transparent rounded-full animate-spin" />
                      )}
                      {bridgeError && (
                        <span className="text-xs text-red-500">{bridgeError}</span>
                      )}
                    </div>
                    <button
                      onClick={handleGenerateQuote}
                      disabled={bridgeLoading || showQuoteBuilder}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-all shadow-sm"
                    >
                      {bridgeLoading ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L9.09 8.26L2 9.27L7 14.14L5.82 21.02L12 17.77L18.18 21.02L17 14.14L22 9.27L14.91 8.26L12 2Z" />
                        </svg>
                      )}
                      {bridgeLoading ? 'Loading…' : latestQuotes.some(q => q.status === 'draft') ? 'Edit Draft Quote' : 'Generate Quote'}
                    </button>
                  </div>
                )}

                {/* Phase A: Empty quote state — bridge resolved, no quotes yet */}
                {bridgeConversationId && !bridgeLoading && !isFetchingQuotes && latestQuotes.length === 0 && selectedThread?.lead?.contractor?.id && (
                  <div className="flex-shrink-0 border-b border-gray-100 bg-slate-50 px-4 py-2">
                    <p className="text-xs text-slate-400 text-center">
                      {user?.role === 'contractor'
                        ? 'No quotes yet. Generate one to get started.'
                        : 'No quotes yet.'}
                    </p>
                  </div>
                )}

                {/* Quote attachment bar — whole bar is tappable, opens bottom sheet without shifting chat */}
                {latestQuotes.length > 0 && user && (() => {
                  const q = latestQuotes[0];
                  if (!q) return null;
                  const statusMeta: Record<string, { bg: string; text: string; label: string }> = {
                    accepted: { bg: 'bg-green-100', text: 'text-green-700', label: 'Accepted' },
                    sent:     { bg: 'bg-blue-100',  text: 'text-blue-700',  label: 'Sent' },
                    draft:    { bg: 'bg-gray-100',  text: 'text-gray-600',  label: 'Draft' },
                    revision_requested: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Changes Requested' },
                  };
                  const sm = statusMeta[q.status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: q.status };
                  return (
                    <button
                      type="button"
                      onClick={() => setShowQuoteSheet(true)}
                      className="flex-shrink-0 w-full border-b border-rose-100 bg-gradient-to-r from-rose-50/70 to-orange-50/40 hover:from-rose-100/80 hover:to-orange-100/60 active:scale-[0.99] transition-all duration-150 text-left"
                    >
                      <div className="flex items-center gap-3 px-4 py-2.5">
                        {/* Icon pill */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-sm">
                          <DocumentTextIcon className="w-4 h-4 text-white" />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 truncate leading-tight">{q.title}</span>
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${sm.bg} ${sm.text}`}>{sm.label}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">${q.totalCost?.toLocaleString()} total</span>
                        </div>
                        {/* Chevron */}
                        <svg className="w-4 h-4 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  );
                })()}

                {user?.id && selfUserId ? (
                  <Chat
                    thread={selectedThread}
                    currentUserId={selfUserId}
                    onDeleteThread={(threadId) => {
                      setThreads(prev => prev.filter(t => t.id !== threadId));
                      setSelectedThread(null);
                    }}
                    userRole={user?.role}
                    jobTitle={selectedThread?.lead?.title || ""}
                    aiEnhanceEnabled={true}
                    onAutoDraftReview={(draft, displayPrice, sourceSnippets) => {
                      if (!draft) return;
                      // If a draft quote already exists, open it for editing instead
                      const existingDraft = latestQuotes.find(q => q.status === 'draft');
                      if (existingDraft) {
                        setEditDraftQuoteId(existingDraft.id);
                        setReviseQuoteId(undefined);
                        setAutoDraftPrefill(null);
                        setShowQuoteBuilder(true);
                        return;
                      }
                      // Ensure bridge is resolved before opening builder
                      if (!bridgeConversationId && selectedThread) {
                        callBridge(selectedThread.id);
                      }
                      setAutoDraftPrefill({ ...draft, displayPrice, sourceSnippets });
                      setEditDraftQuoteId(undefined);
                      setReviseQuoteId(undefined);
                      setShowQuoteBuilder(true);
                    }}
                    onSendInstantly={async (draft, displayPrice) => {
                      // Send Instantly: generate a quote via existing API, then immediately send it.
                      // Reuses the same backend flow as LiveQuoteBuilder (generate → PUT with status=sent).
                      let convId = bridgeConversationId;
                      let contrId = bridgeContractorId;

                      // Ensure bridge is resolved
                      if (!convId && selectedThread) {
                        try {
                          const res = await fetch(`/api/conversations/for-thread?threadId=${encodeURIComponent(selectedThread.id)}`);
                          if (!res.ok) return false;
                          const data = await res.json();
                          convId = data.conversationId;
                          contrId = data.contractorId;
                          setBridgeConversationId(data.conversationId);
                          setBridgeHomeownerId(data.homeownerId);
                          setBridgeContractorId(data.contractorId);
                          setBridgeJobId(data.jobId);
                        } catch { return false; }
                      }
                      if (!convId || !contrId) return false;

                      try {
                        // Step 1: Generate draft via existing API (reads real thread, applies validation)
                        const genRes = await fetch('/api/quotes/generate', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ conversationId: convId, contractorId: contrId }),
                        });
                        const genData = await genRes.json();
                        if (!genRes.ok || !genData.quote?.id) return false;

                        // Step 2: Send it immediately via existing PUT (same as LiveQuoteBuilder saveQuote('sent'))
                        const sendRes = await fetch(`/api/quotes/${genData.quote.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: genData.quote.title,
                            description: genData.quote.description,
                            scope: genData.quote.scope,
                            laborCost: genData.quote.laborCost,
                            materialCost: genData.quote.materialCost,
                            totalCost: genData.quote.totalCost,
                            items: genData.quote.items,
                            status: 'sent',
                          }),
                        });
                        const sendData = await sendRes.json();
                        if (!sendRes.ok) return false;

                        // Success — update quote panel
                        setAutoDraftPrefill(null);
                        setLatestQuotes(prev => [sendData.quote as QuoteResult, ...prev.filter(q => q.id !== sendData.quote.id)]);
                        if (convId) fetchLatestQuotes(convId);
                        return true;
                      } catch {
                        return false;
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full p-4">
                    <div className="text-center text-slate-500">Loading user information...</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 flex items-center justify-center relative z-10 h-full">
                <div className="text-center px-6">
                  <div className="w-20 h-20 mx-auto mb-5 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  {threads.length === 0 ? (
                    user?.role === 'homeowner' ? (
                      <>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Post a Job, Get Connected</h3>
                        <p className="text-slate-500 max-w-xs mx-auto leading-relaxed text-sm">
                          Describe your project and get quotes from verified contractors in your area.
                        </p>
                        <Link href="/create-lead" className="mt-5 inline-block px-5 py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg text-sm hover:from-rose-700 hover:to-orange-700 transition-all shadow-md">
                          Post Your First Job
                        </Link>
                      </>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Start Winning Jobs</h3>
                        <p className="text-slate-500 max-w-xs mx-auto leading-relaxed text-sm">
                          Accept a lead to open a conversation with the homeowner.
                        </p>
                        <Link href="/contractor/jobs" className="mt-5 inline-block px-5 py-2.5 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-semibold rounded-lg text-sm hover:from-rose-700 hover:to-orange-700 transition-all shadow-md">
                          Browse Available Jobs
                        </Link>
                      </>
                    )
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-slate-700 mb-2">Select a Conversation</h3>
                      <p className="text-slate-500 max-w-sm mx-auto leading-relaxed text-sm">
                        Choose a conversation from the sidebar to start messaging.
                      </p>
                    </>
                  )}
                  <div className="mt-5 flex items-center justify-center space-x-2 text-xs text-slate-400">
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span>Secure &amp; Private</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span>Real-time Updates</span>
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase 2: LiveQuoteBuilder — rendered at page level so its fixed overlay covers the full viewport */}
      {showQuoteBuilder && bridgeConversationId && bridgeContractorId && bridgeHomeownerId && selectedThread && (
        <LiveQuoteBuilder
          conversationId={bridgeConversationId}
          contractorId={bridgeContractorId}
          jobTitle={selectedThread.lead.title}
          jobId={bridgeJobId || selectedThread.lead.id}
          homeownerId={bridgeHomeownerId}
          {...(reviseQuoteId !== undefined ? { reviseQuoteId } : {})}
          {...(editDraftQuoteId !== undefined ? { editDraftQuoteId } : {})}
          autoDraftPrefill={autoDraftPrefill}
          onClose={() => {
            setShowQuoteBuilder(false);
            setReviseQuoteId(undefined);
            setEditDraftQuoteId(undefined);
            setAutoDraftPrefill(null);
          }}
          onQuoteSent={(quote) => {
            setShowQuoteBuilder(false);
            setReviseQuoteId(undefined);
            setEditDraftQuoteId(undefined);
            setAutoDraftPrefill(null);
            // Append/replace latest quote in the panel immediately, then re-fetch for accuracy
            setLatestQuotes(prev => [quote as QuoteResult, ...prev.filter(q => q.id !== quote.id)]);
            if (bridgeConversationId) fetchLatestQuotes(bridgeConversationId);
          }}
        />
      )}

      {/* Quote bottom sheet — rendered at root so it overlays full viewport without shifting chat */}
      {showQuoteSheet && latestQuotes.length > 0 && user && (() => {
        const q = latestQuotes[0];
        if (!q) return null;
        const sheetPayload: QuoteCardPayload = {
          quoteId: q.id,
          title: q.title,
          totalCost: q.totalCost,
          laborCost: q.laborCost,
          materialCost: q.materialCost,
          scope: q.scope,
          itemCount: q.items.length,
          version: q.version ?? 1,
        };
        return (
          <QuoteBottomSheet
            payload={sheetPayload}
            quoteStatus={q.status}
            viewerRole={user.role || 'homeowner'}
            onClose={() => setShowQuoteSheet(false)}
            onAccept={handleQuoteAccept}
            onRequestChanges={handleQuoteRequestChanges}
            onRevise={handleQuoteRevise}
          />
        );
      })()}
    </div>
  );
}
