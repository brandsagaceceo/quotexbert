'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMessageNotifications } from '@/lib/hooks/useMessageNotifications';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  VideoCameraIcon,
  PaperClipIcon,
  FaceSmileIcon,
  CheckIcon,
  XMarkIcon,
  PhotoIcon,
  BellIcon,
  SparklesIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

interface Conversation {
  id: string;
  jobId: string;
  job: {
    title: string;
    budget: string;
  };
  homeowner: {
    id: string;
    name: string;
    email: string;
  };
  contractor: {
    id: string;
    name: string;
    email: string;
  };
  status: string;
  lastMessage: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  lastMessageAt: Date;
  unreadCount: number;
  otherParticipant: {
    id: string;
    name: string;
    email: string;
  };
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderRole: string;
  receiverId: string;
  receiverRole: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ConversationsPage() {
  const { authUser: user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [enhancedMessage, setEnhancedMessage] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Initialize message notifications
  const { 
    notifyNewMessage, 
    notificationPermission, 
    requestNotificationPermission 
  } = useMessageNotifications({
    enabled: true,
    soundEnabled: true,
    browserNotificationsEnabled: true
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedConversation.id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) {
      console.log('[Conversations] No user, skipping fetch');
      return;
    }
    
    try {
      console.log('[Conversations] Fetching conversations for user:', user.id);
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('[Conversations] Loaded conversations:', data.length);
        setConversations(data);
      } else {
        const error = await response.json();
        console.error('[Conversations] Failed to fetch conversations:', error);
      }
    } catch (error) {
      console.error('[Conversations] Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        
        // Check for new messages and notify
        if (data.length > previousMessageCount && previousMessageCount > 0 && user) {
          const newMessages = data.slice(previousMessageCount);
          const lastNewMessage = newMessages[newMessages.length - 1];
          
          // Only notify if the new message is from the other person
          if (lastNewMessage && lastNewMessage.senderId !== user.id) {
            const senderName = lastNewMessage.sender?.name || 'Someone';
            const messagePreview = lastNewMessage.content.substring(0, 100);
            notifyNewMessage(senderName, messagePreview, conversationId);
          }
        }
        
        setPreviousMessageCount(data.length);
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || !selectedConversation || !user) {
      console.log('[Conversations] Cannot send - missing requirements:', {
        hasMessage: !!newMessage.trim(),
        hasImage: !!imageFile,
        hasConversation: !!selectedConversation,
        hasUser: !!user
      });
      return;
    }

    setSending(true);
    setSendError(null);
    
    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Determine sender role (homeowner or contractor) based on conversation participants
    const senderRole = user.id === selectedConversation.homeowner.id ? 'homeowner' : 'contractor';
    const receiverRole = selectedConversation.otherParticipant.id === selectedConversation.homeowner.id ? 'homeowner' : 'contractor';
    
    // Optimistic UI - add message immediately
    const optimisticMessage = {
      id: tempId,
      content: messageContent,
      senderId: user.id,
      senderRole: senderRole,
      receiverId: selectedConversation.otherParticipant.id,
      receiverRole: receiverRole,
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name || user.email,
        email: user.email
      }
    };
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    try {
      console.log('[Conversations] Sending message:', {
        conversationId: selectedConversation.id,
        senderId: user.id,
        senderRole: senderRole,
        receiverId: selectedConversation.otherParticipant.id,
        receiverRole: receiverRole,
        content: messageContent
      });

      const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConversation.otherParticipant.id,
          content: messageContent
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('[Conversations] Send message failed:', error);
        setSendError(error.error || 'Failed to send message. Please try again.');
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setNewMessage(messageContent); // Restore message content
      } else {
        const sentMessage = await response.json();
        console.log('[Conversations] Message sent successfully:', sentMessage);
        setImagePreview(null);
        setImageFile(null);
        // Replace optimistic message with real one
        setMessages(prev => prev.map(m => m.id === tempId ? {
          ...sentMessage,
          sender: {
            id: user.id,
            name: user.name || user.email,
            email: user.email
          }
        } : m));
        fetchConversations();
      }
    } catch (error) {
      console.error('[Conversations] Error sending message:', error);
      setSendError('Network error. Please check your connection and try again.');
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== tempId));
      setNewMessage(messageContent); // Restore message content
    } finally {
      setSending(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImagePreview = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const enhanceMessageWithAI = async () => {
    if (!newMessage.trim() || aiEnhancing) return;
    
    setAiEnhancing(true);
    try {
      const response = await fetch('/api/ai/enhance-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newMessage,
          context: selectedConversation?.job.title
        })
      });

      if (response.ok) {
        const data = await response.json();
        setEnhancedMessage(data.enhanced);
      }
    } catch (error) {
      console.error('Error enhancing message:', error);
    } finally {
      setAiEnhancing(false);
    }
  };

  const useEnhancedMessage = () => {
    if (enhancedMessage) {
      setNewMessage(enhancedMessage);
      setEnhancedMessage(null);
    }
  };

  const useQuickReply = (reply: string) => {
    setNewMessage(reply);
    setShowQuickReplies(false);
  };

  const quickReplies = user?.role === 'contractor' ? [
    "Thank you for considering me for this project. I'm confident I can deliver excellent results that meet your expectations.",
    "I'd be happy to provide a detailed quote. Could you share more details about your project requirements?",
    "I have extensive experience with similar projects. When would be a good time to discuss the specifics?",
    "I'm flexible with scheduling and can start as early as next week. Does that timeline work for you?",
    "I appreciate the opportunity. My expertise makes me a great fit for this project. Let's connect soon!",
    "Thank you for reaching out! I'd love to bring your vision to life. What are the next steps?"
  ] : [
    "Thank you for your interest in my project. I'd like to discuss the details further.",
    "Could you provide an estimated timeline for completion?",
    "What would be your estimated quote for this project?",
    "I'd appreciate it if we could schedule a time to discuss this in more detail.",
    "Thank you for your quick response. I look forward to working with you!",
    "Do you have examples of similar projects you've completed?"
  ];

  const filteredConversations = conversations.filter(conv => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      conv.job.title.toLowerCase().includes(search) ||
      conv.otherParticipant.name?.toLowerCase().includes(search) ||
      conv.otherParticipant.email.toLowerCase().includes(search)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-rose-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to view your conversations.</p>
            <Link 
              href="/sign-in" 
              className="inline-block w-full bg-gradient-to-r from-rose-700 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-800 hover:to-orange-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-slate-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-700" />
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notification Permission Banner */}
              {notificationPermission === 'default' && (
                <button
                  onClick={requestNotificationPermission}
                  className="flex items-center gap-2 bg-rose-100 text-rose-800 px-4 py-2 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                >
                  <BellIcon className="w-5 h-5" />
                  Enable Notifications
                </button>
              )}
              
              <Link 
                href="/profile"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Conversations Sidebar */}
            <div className="bg-white border-r border-gray-200 flex flex-col h-full">
              {/* Search */}
              <div className="p-4">{/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="bg-rose-50 rounded-full p-6 mb-4">
                      <ChatBubbleLeftRightIcon className="w-12 h-12 text-rose-700" />
                    </div>
                    <p className="text-gray-900 font-semibold mb-2">No conversations yet</p>
                    <p className="text-sm text-gray-500">
                      {user.role === 'contractor' 
                        ? 'Accept a job to start messaging homeowners'
                        : 'Post a job to start receiving quotes'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => setSelectedConversation(conv)}
                        className={`w-full p-4 text-left hover:bg-orange-50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-orange-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {conv.otherParticipant.name?.[0] || conv.otherParticipant.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conv.otherParticipant.name || conv.otherParticipant.email}
                              </h3>
                              {conv.unreadCount > 0 && (
                                <span className="bg-orange-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  {conv.unreadCount}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-1">
                              {conv.job.title}
                            </p>
                            {conv.lastMessage && (
                              <p className="text-sm text-gray-500 truncate">
                                {conv.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="px-6 py-4 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {/* Profile Picture */}
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white">
                            {selectedConversation.otherParticipant.name?.[0] || selectedConversation.otherParticipant.email?.[0]?.toUpperCase() || '?'}
                          </div>
                          {/* Online Indicator */}
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-3 border-white rounded-full shadow-md"></div>
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900 text-lg">
                            {selectedConversation.otherParticipant.name || selectedConversation.otherParticipant.email}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm text-gray-600">
                              Active now
                            </p>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {selectedConversation.job.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          className="p-2.5 hover:bg-gray-50 rounded-xl transition-all hover:scale-105"
                          title="Call"
                        >
                          <PhoneIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                          className="p-2.5 hover:bg-gray-50 rounded-xl transition-all hover:scale-105"
                          title="Video Call"
                        >
                          <VideoCameraIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button 
                          className="p-2.5 hover:bg-gray-50 rounded-xl transition-all hover:scale-105"
                          title="More Options"
                        >
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-slate-50 via-white to-slate-50">
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user.id;
                      const showAvatar = index === 0 || messages[index - 1]?.senderId !== message.senderId;
                      const isLastInGroup = index === messages.length - 1 || messages[index + 1]?.senderId !== message.senderId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex items-end gap-2.5 animate-fadeIn ${
isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Other person's avatar */}
                          {!isOwn && (
                            <div className="flex-shrink-0">
                              {showAvatar ? (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 via-rose-600 to-orange-500 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                                  {message.sender.name?.[0] || message.sender.email?.[0]?.toUpperCase() || '?'}
                                </div>
                              ) : (
                                <div className="w-9" />
                              )}
                            </div>
                          )}
                          
                          <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                            {/* Show sender name for first message in group */}
                            {!isOwn && showAvatar && (
                              <span className="text-xs text-gray-500 font-medium mb-1 px-2">
                                {message.sender.name || message.sender.email}
                              </span>
                            )}
                            
                            {/* Message Bubble */}
                            <div
                              className={`group relative ${
                                isOwn
                                  ? 'bg-gradient-to-br from-rose-600 to-orange-500 text-white shadow-md hover:shadow-lg'
                                  : 'bg-white text-gray-900 shadow-sm hover:shadow-md border border-gray-100'
                              } px-4 py-2.5 transition-all duration-200 ${
                                isOwn
                                  ? isLastInGroup
                                    ? 'rounded-[20px] rounded-br-md'
                                    : 'rounded-[20px]'
                                  : isLastInGroup
                                    ? 'rounded-[20px] rounded-bl-md'
                                    : 'rounded-[20px]'
                              }`}
                            >
                              <p className="break-words leading-relaxed text-[15px]">{message.content}</p>
                              
                              {/* Timestamp on hover */}
                              <div className={`absolute ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                                <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-900/80 text-white px-2 py-1 rounded-lg">
                                  {new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            
                            {/* Delivery Status */}
                            {isOwn && isLastInGroup && (
                              <div className="flex items-center gap-1 mt-1 px-1">
                                <CheckIcon className="w-3.5 h-3.5 text-rose-600" />
                                <CheckIcon className="w-3.5 h-3.5 text-rose-600 -ml-2" />
                                <span className="text-[11px] text-gray-500 ml-1">Delivered</span>
                              </div>
                            )}
                          </div>

                          {/* Own avatar */}
                          {isOwn && (
                            <div className="flex-shrink-0">
                              {showAvatar ? (
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                                  {user.name?.[0] || user.email?.[0]?.toUpperCase() || '?'}
                                </div>
                              ) : (
                                <div className="w-9" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={sendMessage} className="p-4 bg-white">
                    {/* Error Message */}
                    {sendError && (
                      <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <span className="text-red-600 text-sm flex-1">{sendError}</span>
                        <button
                          type="button"
                          onClick={() => setSendError(null)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {/* AI Enhanced Message Preview */}
                    {enhancedMessage && (
                      <div className="mb-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <SparklesIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-semibold text-purple-900">✨ AI Enhanced Version</span>
                              <button
                                type="button"
                                onClick={() => setEnhancedMessage(null)}
                                className="text-purple-600 hover:text-purple-900 transition-colors"
                              >
                                <XMarkIcon className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">{enhancedMessage}</p>
                            <button
                              type="button"
                              onClick={useEnhancedMessage}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
                            >
                              Use This Version
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-3 relative inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-w-[200px] max-h-[200px] rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={clearImagePreview}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex items-end gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 p-2.5 hover:bg-gray-100 rounded-xl transition-all hover:scale-105 active:scale-95"
                        title="Attach Image"
                      >
                        <PhotoIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="flex-1 bg-gray-50 rounded-[22px] px-5 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500/30 border border-gray-200 transition-all">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            setEnhancedMessage(null);
                          }}
                          placeholder="Type your message..."
                          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-[15px]"
                          disabled={sending}
                        />
                      </div>
                      {/* AI Enhance Button - Only for contractors */}
                      {newMessage.trim() && !enhancedMessage && user?.role === 'contractor' && (
                        <button
                          type="button"
                          onClick={enhanceMessageWithAI}
                          disabled={aiEnhancing}
                          className="flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2.5 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                          title="Enhance with AI"
                        >
                          {aiEnhancing ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          ) : (
                            <SparklesIcon className="w-5 h-5" />
                          )}
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={(!newMessage.trim() && !imageFile) || sending}
                        className="flex-shrink-0 bg-gradient-to-br from-rose-600 to-orange-500 text-white p-3 rounded-xl font-semibold hover:from-rose-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                        title="Send Message"
                      >
                        {sending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Quick Reply Suggestions - Only for contractors */}
                    {showQuickReplies && user?.role === 'contractor' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <LightBulbIcon className="w-4 h-4 text-amber-600" />
                            <span className="text-xs font-semibold text-gray-700">💼 Quick Professional Replies</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowQuickReplies(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                          {quickReplies.slice(0, 6).map((reply, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => useQuickReply(reply)}
                              className="text-left text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-rose-50 hover:to-orange-50 border border-gray-200 hover:border-rose-300 px-4 py-3 rounded-xl transition-all hover:shadow-md group"
                            >
                              <span className="line-clamp-2 group-hover:text-rose-900">{reply}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-full p-8 mb-6 inline-block">
                      <ChatBubbleLeftRightIcon className="w-20 h-20 text-rose-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 max-w-sm mx-auto">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
