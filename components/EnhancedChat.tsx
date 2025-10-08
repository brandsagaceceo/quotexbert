"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Message {
  id: string;
  body: string;
  createdAt: string;
  readAt?: string;
  deliveredAt?: string;
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
  currentUserId: string;
}

interface TypingUser {
  userId: string;
  email: string;
}

export default function EnhancedChat({ thread, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const otherUser =
    thread.lead.homeowner.id === currentUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;

  const isHomeowner = currentUserId === thread.lead.homeowner.id;

  // Real-time connection setup
  useEffect(() => {
    setupRealTimeConnection();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [thread.id, currentUserId]);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      sendUserStatus('online');
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      sendUserStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  // Mark messages as read when they come into view
  useEffect(() => {
    const unreadMessages = messages.filter(
      msg => !msg.readAt && msg.fromUser.id !== currentUserId
    );
    
    if (unreadMessages.length > 0) {
      // Mark the latest message as read
      const lastMessage = unreadMessages[unreadMessages.length - 1];
      if (lastMessage) {
        markMessageAsRead(lastMessage.id);
      }
    }
    
    setUnreadCount(unreadMessages.length);
  }, [messages, currentUserId]);

  const setupRealTimeConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(
      `/api/realtime-messaging?userId=${currentUserId}&threadId=${thread.id}`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleRealTimeEvent(data);
      } catch (error) {
        console.error('Error parsing real-time event:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (eventSource.readyState === EventSource.CLOSED) {
          setupRealTimeConnection();
        }
      }, 5000);
    };

    eventSourceRef.current = eventSource;
  };

  const handleRealTimeEvent = (data: any) => {
    switch (data.type) {
      case 'new_message':
        if (data.message.threadId === thread.id) {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.find(msg => msg.id === data.message.id)) {
              return prev;
            }
            return [...prev, data.message];
          });
          setShouldScrollToBottom(true);
        }
        break;

      case 'typing_start':
        if (data.userId !== currentUserId) {
          setTypingUsers(prev => {
            if (!prev.find(user => user.userId === data.userId)) {
              const typingUser = data.userId === otherUser?.id && otherUser
                ? { userId: data.userId, email: otherUser.email }
                : { userId: data.userId, email: 'Unknown User' };
              return [...prev, typingUser];
            }
            return prev;
          });
        }
        break;

      case 'typing_stop':
        setTypingUsers(prev => prev.filter(user => user.userId !== data.userId));
        break;

      case 'message_read':
        setMessages(prev =>
          prev.map(msg =>
            msg.id === data.messageId
              ? { ...msg, readAt: data.timestamp }
              : msg
          )
        );
        break;

      case 'user_online':
      case 'user_offline':
        // Update user online status in UI
        console.log(`User ${data.userId} is ${data.type === 'user_online' ? 'online' : 'offline'}`);
        break;
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
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
    stopTyping();

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
          body: optimisticMessage.body,
          fromUserId: currentUserId,
          toUserId: otherUser.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Replace optimistic message with real one
        setMessages(prev =>
          prev.map(msg =>
            msg.id === optimisticMessage.id
              ? { ...data.message, deliveredAt: new Date().toISOString() }
              : msg
          )
        );

        // Notify real-time system
        await fetch('/api/realtime-messaging', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'new_message',
            userId: currentUserId,
            threadId: thread.id,
            data: { message: data.message }
          })
        });
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
      sendTypingStatus('start');
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 1000);
  }, [isTyping]);

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      sendTypingStatus('stop');
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const sendTypingStatus = async (status: 'start' | 'stop') => {
    try {
      await fetch('/api/realtime-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: `typing_${status}`,
          userId: currentUserId,
          threadId: thread.id
        })
      });
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  };

  const sendUserStatus = async (status: 'online' | 'offline') => {
    try {
      await fetch('/api/realtime-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: `user_${status}`,
          userId: currentUserId
        })
      });
    } catch (error) {
      console.error('Error sending user status:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await fetch('/api/realtime-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'message_read',
          userId: currentUserId,
          threadId: thread.id,
          data: { messageId }
        })
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [thread.id]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = (message: Message) => {
    if (message.fromUser.id !== currentUserId) return null;
    
    if (message.readAt) return "✓✓";
    if (message.deliveredAt) return "✓";
    return "○";
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              {thread.lead.title}
            </h3>
            <p className="text-sm text-gray-600">
              with {otherUser?.email || "Unknown User"}
              {!isOnline && (
                <span className="ml-2 text-red-500">● Offline</span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount} unread
            </span>
          )}
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ maxHeight: "calc(100vh - 200px)" }}
      >
        {messages.map((message) => {
          const isOwn = message.fromUser.id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwn
                    ? "bg-teal-600 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.body}</p>
                <div className={`text-xs mt-1 flex items-center justify-between ${
                  isOwn ? "text-teal-100" : "text-gray-500"
                }`}>
                  <span>{formatTime(message.createdAt)}</span>
                  {isOwn && (
                    <span className="ml-2">{getMessageStatus(message)}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {typingUsers[0]?.email || 'Someone'} is typing...
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-2">
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
            placeholder={isOnline ? "Type your message..." : "You're offline. Check your connection."}
            disabled={!otherUser || !isOnline}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            rows={2}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !otherUser || !isOnline}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
        
        {!isOnline && (
          <div className="mt-2 text-sm text-red-600">
            ⚠️ You're currently offline. Messages will be sent when connection is restored.
          </div>
        )}
      </form>
    </div>
  );
}