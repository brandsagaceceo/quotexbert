"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, Clock, User } from 'lucide-react';

interface Conversation {
  id: string;
  jobId: string;
  jobTitle: string;
  homeownerName: string;
  homeownerId: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  homeownerPhoto?: string;
}

export default function MessagesTab({ contractorId }: { contractorId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, [contractorId]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/contractor/conversations?contractorId=${contractorId}`);
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <div className="text-5xl mb-4">💬</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h3>
        <p className="text-gray-600 mb-4">
          Once you accept jobs, you'll be able to chat with homeowners here.
        </p>
        <Link 
          href="/contractor/jobs"
          className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          href={`/conversations/${conversation.jobId}`}
          className="block bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all hover:border-rose-300"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {conversation.homeownerPhoto ? (
                <img 
                  src={conversation.homeownerPhoto} 
                  alt={conversation.homeownerName}
                  className="w-14 h-14 rounded-full object-cover border-2 border-rose-200"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                  <User className="h-7 w-7 text-white" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-gray-900 text-lg truncate">{conversation.homeownerName}</h3>
                {conversation.unreadCount > 0 && (
                  <span className="bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-rose-700 truncate">{conversation.jobTitle}</span>
              </div>

              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{conversation.lastMessage}</p>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{formatTime(conversation.lastMessageAt)}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
