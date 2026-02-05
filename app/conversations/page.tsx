'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
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
  PhotoIcon
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (!user) return;
    
    try {
      const response = await fetch(`/api/conversations?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !imageFile) || !selectedConversation || !user) return;

    setSending(true);
    setSendError(null);
    
    // Optimistic UI - add message immediately
    const optimisticMessage = {
      id: `temp-${Date.now()}`,
      content: newMessage.trim(),
      senderId: user.id,
      senderRole: user.role,
      receiverId: selectedConversation.otherParticipant.id,
      receiverRole: selectedConversation.otherParticipant.id === selectedConversation.homeowner.id ? 'homeowner' : 'contractor',
      createdAt: new Date().toISOString(),
      sender: {
        id: user.id,
        name: user.name || user.email,
        email: user.email
      }
    };
    setMessages(prev => [...prev, optimisticMessage]);
    
    try {
      const response = await fetch(`/api/conversations/${selectedConversation.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConversation.otherParticipant.id,
          content: newMessage.trim()
        })
      });

      if (response.ok) {
        setNewMessage('');
        setImagePreview(null);
        setImageFile(null);
        fetchMessages(selectedConversation.id);
        fetchConversations();
      } else {
        const error = await response.json();
        setSendError(error.error || 'Failed to send message');
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Network error. Please check your connection and try again.');
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
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
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-rose-700" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
            <Link 
              href="/profile"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Profile
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto w-full overflow-hidden">
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Conversations Sidebar */}
            <div className="bg-white border-r border-gray-200 flex flex-col h-full">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">{/* Search */}
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
                            {conv.otherParticipant.name?.[0] || conv.otherParticipant.email[0].toUpperCase()}
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
                  <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-rose-50 to-orange-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-700 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {selectedConversation.otherParticipant.name?.[0] || selectedConversation.otherParticipant.email[0].toUpperCase()}
                          </div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900 text-lg">
                            {selectedConversation.otherParticipant.name || selectedConversation.otherParticipant.email}
                          </h2>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-xs text-gray-600">
                              Active now • {selectedConversation.job.title}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white rounded-xl transition-colors">
                          <PhoneIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-xl transition-colors">
                          <VideoCameraIcon className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-xl transition-colors">
                          <EllipsisVerticalIcon className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user.id;
                      const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex items-end gap-2 ${
isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          {!isOwn && showAvatar && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-700 to-orange-600 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                              {message.sender.name?.[0] || message.sender.email[0].toUpperCase()}
                            </div>
                          )}
                          {!isOwn && !showAvatar && <div className="w-8" />}
                          
                          <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`rounded-2xl px-4 py-3 ${
                                isOwn
                                  ? 'bg-gradient-to-r from-rose-700 to-orange-600 text-white shadow-lg'
                                  : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                              }`}
                            >
                              <p className="break-words leading-relaxed">{message.content}</p>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 px-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-500">
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {isOwn && (
                                <CheckIcon className="w-4 h-4 text-rose-700" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
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

                    <div className="flex items-end gap-2">
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
                        className="touch-target p-3 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <PhotoIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full bg-transparent border-0 focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-500"
                          disabled={sending}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={(!newMessage.trim() && !imageFile) || sending}
                        className="touch-target bg-gradient-to-r from-rose-700 to-orange-600 text-white p-3 rounded-xl font-semibold hover:from-rose-800 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
                      >
                        {sending ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                          <PaperAirplaneIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
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
