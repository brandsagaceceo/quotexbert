"use client";

import { useState, useEffect } from "react";
import EnhancedChatSimple from "@/components/EnhancedChatSimple";

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

interface User {
  id: string;
  email: string;
  role: string;
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchThreads();
    }
  }, [currentUserId]);

  const fetchUsers = async () => {
    try {
      // Mock users - in real app this would come from your auth system
      const mockUsers = [
        {
          id: "cmeelabte0000jkis8cwheaxu",
          email: "homeowner@demo.com",
          role: "homeowner",
        },
        {
          id: "cmeelabtm0001jkisp3uamyg2",
          email: "contractor@demo.com",
          role: "contractor",
        },
      ];
      setUsers(mockUsers);
      setCurrentUserId(mockUsers[0]!.id); // Default to homeowner to see hire button
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/threads?userId=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads);
        if (data.threads.length > 0 && !selectedThread) {
          setSelectedThread(data.threads[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentUser = users.find((u) => u.id === currentUserId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-slate-50 to-teal-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-burgundy-600 to-teal-600 bg-clip-text text-transparent">
              Messages
            </h1>
            <p className="text-gray-600 mt-1">Communicate with contractors and homeowners</p>
          </div>

          {/* User Switcher for Demo */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Demo as:</span>
            <select
              value={currentUserId}
              onChange={(e) => {
                setCurrentUserId(e.target.value);
                setSelectedThread(null);
              }}
              className="border rounded px-3 py-1"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Thread List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Conversations</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Viewing as: {currentUser?.email}
                </p>
              </div>

              <div className="divide-y">
                {threads.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No conversations yet
                  </div>
                ) : (
                  threads.map((thread) => {
                    const lastMessage = thread.messages[0];
                    const otherUser =
                      thread.lead.homeowner.id === currentUserId
                        ? thread.lead.contractor
                        : thread.lead.homeowner;

                    return (
                      <div
                        key={thread.id}
                        onClick={() => setSelectedThread(thread)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 ${
                          selectedThread?.id === thread.id
                            ? "bg-blue-50 border-r-2 border-blue-500"
                            : ""
                        }`}
                      >
                        <h3 className="font-medium text-sm truncate">
                          {thread.lead.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          with {otherUser?.email || "Unknown User"}
                        </p>
                        {lastMessage && (
                          <>
                            <p className="text-xs text-gray-600 truncate mt-1">
                              {lastMessage.fromUser.email}: {lastMessage.body}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(
                                lastMessage.createdAt,
                              ).toLocaleDateString()}
                            </p>
                          </>
                        )}
                        {!lastMessage && (
                          <p className="text-xs text-gray-400 mt-1">
                            No messages yet
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            {selectedThread ? (
              <EnhancedChatSimple thread={selectedThread} currentUserId={currentUserId} />
            ) : (
              <div className="bg-white rounded-lg border h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
