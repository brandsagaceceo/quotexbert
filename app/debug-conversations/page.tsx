'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Conversation {
  id: string;
  status: string;
  job?: {
    title: string;
    budget: number;
  };
  lastMessage?: {
    content: string;
    sender?: {
      email: string;
    };
  };
}

export default function DebugConversations() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for demo user
    const demoUser = localStorage.getItem('demo_user');
    console.log('Demo user from localStorage:', demoUser);
    
    if (demoUser) {
      try {
        const user = JSON.parse(demoUser);
        console.log('Parsed user:', user);
        setAuthUser(user);
        
        // Fetch conversations
        fetchConversations(user.id);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        setError('Error parsing user data');
      }
    } else {
      setError('No demo user found. Please log in first.');
    }
  }, []);

  const fetchConversations = async (userId: string) => {
    try {
      console.log('Fetching conversations for userId:', userId);
      const response = await fetch(`/api/conversations?userId=${userId}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Conversations data:', data);
        setConversations(data);
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        setError(`API Error: ${response.status} - ${errorText}`);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Fetch error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Conversations</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {authUser && (
        <div className="bg-rose-100 border border-blue-400 text-rose-900 px-4 py-3 rounded mb-4">
          <p><strong>Logged in as:</strong> {authUser.name} ({authUser.email})</p>
          <p><strong>Role:</strong> {authUser.role}</p>
          <p><strong>User ID:</strong> {authUser.id}</p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Conversations ({conversations.length})</h2>
        
        {conversations.length === 0 ? (
          <p className="text-gray-500">No conversations found.</p>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div key={conv.id} className="border border-gray-200 rounded p-4">
                <h3 className="font-semibold">{conv.job?.title}</h3>
                <p className="text-sm text-gray-600">Budget: ${conv.job?.budget}</p>
                <p className="text-sm text-gray-600">Status: {conv.status}</p>
                {conv.lastMessage && (
                  <div className="mt-2 p-2 bg-gray-50 rounded">
                    <p className="text-sm"><strong>Last message:</strong> {conv.lastMessage.content}</p>
                    <p className="text-xs text-gray-500">From: {conv.lastMessage.sender?.email}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}