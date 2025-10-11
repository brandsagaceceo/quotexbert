'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUnreadMessageCount } from '@/lib/hooks/useUnreadMessageCount';
import { UnreadBadge } from '@/app/_components/UnreadBadge';
import { Trash2, Star } from 'lucide-react';
import { ReviewForm } from '@/components/ReviewForm';

interface Conversation {
  id: string;
  jobId: string;
  job: {
    id: string;
    title: string;
    budget: number;
    category: string;
    status: string;
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
  otherParticipant: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: {
      name: string;
    };
  } | null;
  lastMessageAt: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  senderRole: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
}

export default function ConversationsPage() {
  const { authUser, isSignedIn } = useAuth();
  const { markMessagesAsRead, refreshUnreadCount } = useUnreadMessageCount();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (authUser && isSignedIn) {
      fetchConversations();
    }
  }, [authUser, isSignedIn]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations?userId=${authUser?.id}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
        if (data.length > 0 && !selectedConversation) {
          setSelectedConversation(data[0]);
        }
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
        
        // Mark messages as read when viewing them
        await markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !authUser) return;

    setSending(true);
    try {
      const response = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: selectedConversation.id,
          message: newMessage,
          senderId: authUser.id,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        await fetchMessages(selectedConversation.id);
        await fetchConversations(); // Refresh conversations to update last message
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Remove conversation from local state
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // If this was the selected conversation, clear it
        if (selectedConversation?.id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
        
        // Clear delete confirmation
        setDeleteConfirm(null);
        
        // Refresh unread count
        refreshUnreadCount();
      } else {
        console.error('Failed to delete conversation');
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const submitReview = async (reviewData: any) => {
    if (!selectedConversation || !authUser) return;

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId: selectedConversation.contractor.id,
          homeownerId: authUser.id,
          leadId: selectedConversation.jobId,
          ...reviewData
        }),
      });

      if (response.ok) {
        setShowReviewForm(false);
        alert('Review submitted successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Please sign in to view messages.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
        
        {conversations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No conversations yet</h2>
            <p className="text-gray-600">
              Conversations will appear here when you accept jobs or when contractors accept your projects.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="flex h-96">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-4 hover:bg-gray-50 relative ${
                        selectedConversation?.id === conversation.id ? 'bg-red-50' : ''
                      }`}
                    >
                      <div 
                        onClick={() => setSelectedConversation(conversation)}
                        className="cursor-pointer pr-8"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-gray-900 truncate">
                                {conversation.job.title}
                              </h3>
                              <UnreadBadge count={conversation.unreadCount} />
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              with {conversation.otherParticipant.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Budget: ${conversation.job.budget.toLocaleString()}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
                            {conversation.lastMessage && 
                              new Date(conversation.lastMessage.createdAt).toLocaleDateString()
                            }
                          </span>
                        </div>
                        {conversation.lastMessage && (
                          <p className="text-sm text-gray-600 mt-2 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        )}
                      </div>
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(conversation.id);
                        }}
                        className="absolute top-4 right-4 p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete conversation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {selectedConversation.job.title}
                          </h2>
                          <p className="text-sm text-gray-600">
                            Conversation with {selectedConversation.otherParticipant.name}
                          </p>
                        </div>
                        
                        {/* Review Button - Only show for homeowners */}
                        {authUser?.role === 'homeowner' && (
                          <button
                            onClick={() => setShowReviewForm(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                          >
                            <Star className="h-4 w-4" />
                            Leave Review
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderId === authUser?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.senderId === authUser?.id
                                ? 'bg-red-900 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className={`text-xs mt-1 ${
                              message.senderId === authUser?.id ? 'text-red-200' : 'text-gray-500'
                            }`}>
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type your message..."
                          className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={sending}
                        />
                        <button
                          onClick={sendMessage}
                          disabled={sending || !newMessage.trim()}
                          className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Conversation</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteConversation(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Form Modal */}
      {showReviewForm && selectedConversation && (
        <ReviewForm
          contractorId={selectedConversation.contractor.id}
          contractorName={selectedConversation.contractor.name}
          leadId={selectedConversation.jobId}
          onSubmit={submitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}