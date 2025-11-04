"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  fromUser: {
    id: string;
    email: string;
  };
  toUser: {
    id: string;
    email: string;
  };
}

interface Thread {
  id: string;
  lead: {
    id: string;
    title: string;
    status?: string;
    homeowner: { id: string; email: string };
    contractor?: { id: string; email: string } | null;
  };
}

interface ChatProps {
  thread: Thread;
  currentUserId: string | undefined;
}

export default function EnhancedChat({ thread, currentUserId }: ChatProps) {
  // Early return if no currentUserId
  if (!currentUserId) {
    return (
      <div className="bg-white rounded-lg border h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get other user from lead participants or messages
  const [otherUser, setOtherUser] = useState<{ id: string; email: string } | null>(null);

  const isHomeowner = currentUserId === thread.lead.homeowner.id;

  // Initialize otherUser immediately from thread data
  useEffect(() => {
    console.log('Initializing other user from thread...');
    console.log('Current user ID:', currentUserId);
    console.log('Thread lead:', thread.lead);
    
    const threadOtherUser = thread.lead.homeowner.id === currentUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;
    
    console.log('Calculated other user:', threadOtherUser);
    
    if (threadOtherUser && !otherUser) {
      console.log('Setting other user from thread:', threadOtherUser);
      setOtherUser(threadOtherUser);
    }
  }, [currentUserId, thread.lead, otherUser]);

  // Debug otherUser changes
  useEffect(() => {
    console.log('Other user changed:', otherUser);
  }, [otherUser]);

  // Simplified polling mechanism to prevent glitching
  useEffect(() => {
    fetchMessages();
    
    // Simple consistent polling every 3 seconds
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [thread.id]);

  // Simple polling speed reset when user is active
  const resetPollingSpeed = useCallback(() => {
    // Just maintain normal polling, no speed changes to prevent glitching
    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages();
      }, 3000);
    }
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchMessages(); // Immediately fetch when back online
      resetPollingSpeed();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [resetPollingSpeed]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Auto-scroll and new message detection
  useEffect(() => {
    // Only auto-scroll when there are new messages (not on initial load)
    if (messages.length > lastMessageCount && lastMessageCount > 0 && shouldScrollToBottom) {
      scrollToBottom();
      
      // New message arrived - show notification if not from current user
      const newestMessage = messages[messages.length - 1];
      if (newestMessage && newestMessage.fromUser.id !== currentUserId) {
        // Flash the title or show notification
        document.title = `💬 New message - QuotexBert`;
        setTimeout(() => {
          document.title = 'QuotexBert';
        }, 3000);
      }
    }
    
    setLastMessageCount(messages.length);
  }, [messages, shouldScrollToBottom, lastMessageCount, currentUserId]);

  // Simplified typing indicator to reduce glitching
  const simulateTypingIndicator = useCallback(() => {
    if (Math.random() > 0.9) { // Reduced to 10% chance to show typing
      setShowTypingIndicator(true);
      setTimeout(() => {
        setShowTypingIndicator(false);
      }, 3000); // Fixed 3 seconds duration
    }
  }, []);

  const fetchMessages = async () => {
    console.log('Fetching messages for thread:', thread.id, 'currentUserId:', currentUserId);
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        console.log('Received messages:', data.messages.length);
        setMessages(data.messages);
        
        // Only determine other user from messages if not already set
        if (data.messages.length > 0 && !otherUser) {
          console.log('Determining other user from messages...');
          console.log('Current user ID:', currentUserId);
          
          // Find a message where the sender is not the current user
          const otherMessage = data.messages.find((msg: Message) => 
            msg.fromUser.id !== currentUserId
          );
          
          if (otherMessage) {
            console.log('Found other user from message sender:', otherMessage.fromUser);
            setOtherUser({
              id: otherMessage.fromUser.id,
              email: otherMessage.fromUser.email
            });
          } else {
            // If all messages are from current user, get the recipient
            const firstMessage = data.messages[0];
            if (firstMessage && firstMessage.toUser.id !== currentUserId) {
              console.log('Found other user from message recipient:', firstMessage.toUser);
              setOtherUser({
                id: firstMessage.toUser.id,
                email: firstMessage.toUser.email
              });
            }
          }
        }
        
        // Simulate typing indicator occasionally
        if (data.messages.length > lastMessageCount) {
          setTimeout(simulateTypingIndicator, 1000 + Math.random() * 3000);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending || !otherUser) return;

    setSending(true);
    resetPollingSpeed(); // Speed up polling after sending

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      body: newMessage.trim(),
      createdAt: new Date().toISOString(),
      fromUser: { id: currentUserId, email: 'You' },
      toUser: { id: otherUser.id, email: otherUser.email }
    };

    // Optimistic update
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage("");
    setShouldScrollToBottom(true);

    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: optimisticMessage.body,
          fromUserId: currentUserId,
          toUserId: otherUser.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Replace optimistic message with real one
        setMessages(prev =>
          prev.map(msg =>
            msg.id === optimisticMessage.id ? data.message : msg
          )
        );
      } else {
        // Remove optimistic message on error
        setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
        setNewMessage(optimisticMessage.body);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      setNewMessage(optimisticMessage.body);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = useCallback((value: string) => {
    setNewMessage(value);

    if (!isTyping && value.trim()) {
      setIsTyping(true);
      resetPollingSpeed(); // Speed up polling when typing
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 1000);
  }, [isTyping, resetPollingSpeed]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleScroll = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      const isNearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 100;
      setIsAtBottom(isNearBottom);
      setShowScrollButton(!isNearBottom && messages.length > 5);
      setShouldScrollToBottom(isNearBottom);
    }
  }, [messages.length]);

  // Add scroll listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return formatTime(timestamp);
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageTime.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 to-white relative">
      {/* Enhanced Chat Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl text-gray-900 mb-1">
              {thread.lead.title}
            </h3>
            <div className="flex items-center space-x-3 text-gray-600">
              <span className="text-sm font-medium">
                with {otherUser?.email || "Unknown User"}
              </span>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-red-500'}`}></div>
                <span className="text-xs font-semibold">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center space-x-2">
            {isTyping && (
              <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full shadow-lg font-medium">
                Typing...
              </span>
            )}
            {sending && (
              <span className="text-xs bg-gradient-to-r from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-full shadow-lg font-medium">
                Sending...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-br from-slate-50/50 to-white/50"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {messages.map((message, index) => {
          const isOwn = message.fromUser.id === currentUserId;
          const showAvatar = index === 0 || messages[index - 1]?.fromUser.id !== message.fromUser.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                showAvatar ? "mt-4" : "mt-1"
              }`}
            >
              <div className={`max-w-xs lg:max-w-md flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2`}>
                {/* Avatar */}
                {showAvatar && !isOwn && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {message.fromUser.email.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Message bubble */}
                <div
                  className={`px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${
                    isOwn
                      ? "bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 text-white"
                      : "bg-white/90 backdrop-blur-sm border border-gray-200/50 text-gray-900"
                  } ${showAvatar ? "" : isOwn ? "mr-12" : "ml-12"}`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.body}</p>
                  <div className={`text-xs mt-2 flex items-center justify-between ${
                    isOwn ? "text-teal-100" : "text-gray-500"
                  }`}>
                    <span>{formatMessageTime(message.createdAt)}</span>
                    {isOwn && (
                      <span className="ml-2 text-lg">
                        {message.id.startsWith('temp-') ? '○' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Enhanced Typing Indicator */}
        {showTypingIndicator && otherUser && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-sm font-semibold">
                {otherUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm">
                <div className="flex space-x-1 items-center">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <div className="absolute bottom-20 right-6 z-10">
          <button
            onClick={scrollToBottom}
            className="bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            aria-label="Scroll to bottom"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Enhanced Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={sendMessage} className="space-y-2">
          <div className="flex space-x-3 items-end">
            <div className="flex-1">
              <textarea
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(e);
                  }
                }}
                placeholder={isOnline ? "Type your message..." : "You're offline. Messages will be sent when connection is restored."}
                disabled={!otherUser || !isOnline}
                className="w-full resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all duration-200"
                rows={2}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1 flex justify-between">
                <span>{newMessage.length}/1000</span>
                {!isOnline && (
                  <span className="text-red-600">⚠️ Offline</span>
                )}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!newMessage.trim() || sending || !otherUser || !isOnline}
              onClick={() => {
                console.log('Send button clicked');
                console.log('newMessage:', newMessage);
                console.log('sending:', sending);
                console.log('otherUser:', otherUser);
                console.log('isOnline:', isOnline);
                console.log('disabled conditions:', {
                  noMessage: !newMessage.trim(),
                  sending: sending,
                  noOtherUser: !otherUser,
                  offline: !isOnline
                });
              }}
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
            >
              {sending ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending</span>
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}