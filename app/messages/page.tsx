"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Chat from "@/components/Chat";
import { ChatBubbleLeftRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  fromUser: {
    id: string;
    email: string;
  };
}

interface Thread {
  id: string;
  lead: {
    id: string;
    title: string;
    homeowner: { id: string; email: string };
    contractor?: { id: string; email: string };
  };
  messages: Message[];
}

export default function MessagesPage() {
  const { authUser: user } = useAuth();
  const searchParams = useSearchParams();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Set up demo contractor user if not exists
    if (!user && !localStorage.getItem('demo_user')) {
      const demoContractor = {
        id: 'demo-contractor',
        email: 'demo-contractor@quotexpert.com',
        name: 'Demo Contractor',
        role: 'contractor' as const
      };
      localStorage.setItem('demo_user', JSON.stringify(demoContractor));
      window.location.reload();
      return;
    }

    if (user) {
      fetchThreads();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Auto-select thread from URL parameter
  useEffect(() => {
    const threadId = searchParams.get('threadId');
    if (threadId && threads.length > 0) {
      const targetThread = threads.find(thread => thread.id === threadId);
      if (targetThread) {
        setSelectedThread(targetThread);
      }
    }
  }, [threads, searchParams]);

  const fetchThreads = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/threads?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
      }
    } catch (error) {
      console.error('Error fetching threads:', error);
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
        alert('Failed to delete conversation. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting thread:', error);
      alert('Failed to delete conversation. Please try again.');
    }
  };

  const getConversationPartner = (thread: Thread) => {
    if (!user) return null;
    return thread.lead.homeowner.id === user.id
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
    return (
      thread.lead.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading || !user) {
    return (
      <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-[calc(100vh-140px)] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-orange-400 border-t-transparent animate-spin"></div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Loading Messages</h3>
          <p className="text-slate-500">Connecting you to your conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 min-h-[calc(100vh-140px)] flex flex-col">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col">
        {/* Modern Header */}
        <div className="mb-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-gray-800 to-slate-700 bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="text-slate-600 mt-2 text-lg">Stay connected with your project partners</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-600">Online</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 min-h-0">
          {/* Conversations List - Modern Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col min-h-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden backdrop-blur-none relative z-10 h-full">
              {/* Header with Search */}
              <div className="p-6 border-b border-slate-200/50 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-slate-900">Conversations</h2>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-red-400 flex items-center justify-center">
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
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 placeholder-slate-400"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Conversations List with Enhanced Scroll */}
              <div className="flex-1 overflow-y-auto bg-white chat-scroll min-h-0">
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
                {filteredThreads.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-slate-500">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="font-medium">No conversations found</p>
                      <p className="text-sm mt-1 text-slate-400">Start a conversation by accepting a project</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {filteredThreads.map((thread) => {
                      const lastMessage = thread.messages[thread.messages.length - 1];
                      const isSelected = selectedThread?.id === thread.id;
                      const otherUser = thread.lead.homeowner.id === user?.id 
                        ? thread.lead.contractor 
                        : thread.lead.homeowner;
                      
                      return (
                        <div
                          key={thread.id}
                          className={`group relative p-4 cursor-pointer rounded-xl transition-all duration-200 hover:bg-slate-50 ${
                            isSelected 
                              ? 'bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 shadow-sm' 
                              : 'hover:shadow-sm'
                          }`}
                        >
                          {/* Delete Button */}
                          <button
                            onClick={(e) => deleteThread(thread.id, e)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all duration-200 transform hover:scale-105 z-10"
                            title="Delete conversation"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>

                          <div 
                            onClick={() => setSelectedThread(thread)}
                            className="flex items-start space-x-3"
                          >
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center shadow-md">
                                <UserCircleIcon className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {thread.lead.title}
                                </p>
                                {lastMessage && (
                                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                                    {formatTime(lastMessage.createdAt)}
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-xs text-slate-600 font-medium">
                                {otherUser?.email || 'Unknown User'}
                              </p>
                              
                              {lastMessage ? (
                                <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                                  {lastMessage.body}
                                </p>
                              ) : (
                                <p className="text-sm text-slate-400 mt-2 italic">
                                  No messages yet
                                </p>
                              )}
                            </div>
                            
                            {/* Unread indicator */}
                            {lastMessage && Math.random() > 0.7 && (
                              <div className="w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></div>
                            )}
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
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col min-h-0">
            {selectedThread ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex flex-col overflow-hidden relative z-10 h-full">
                <Chat thread={selectedThread} currentUserId={user?.id} />
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex items-center justify-center relative z-10 h-full">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">Welcome to Messages</h3>
                  <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Select a conversation from the sidebar to start messaging with contractors and homeowners
                  </p>
                  <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-slate-400">
                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                    <span>Secure & Private</span>
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
    </div>
  );
}
