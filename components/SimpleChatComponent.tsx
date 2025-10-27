"use client";

import { useState, useEffect, useRef } from "react";

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
    homeowner: { id: string; email: string };
    contractor?: { id: string; email: string } | null;
  };
}

interface ChatProps {
  thread: Thread;
  currentUserId: string | undefined;
}

export default function SimpleChatComponent({ thread, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<{ id: string; email: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        
        // Determine other user from messages
        if (data.messages.length > 0) {
          const otherMessage = data.messages.find((msg: Message) => 
            msg.fromUser.id !== currentUserId
          );
          
          if (otherMessage) {
            setOtherUser({
              id: otherMessage.fromUser.id,
              email: otherMessage.fromUser.email
            });
          } else {
            // All messages from current user, get recipient
            const firstMessage = data.messages[0];
            if (firstMessage && firstMessage.toUser.id !== currentUserId) {
              setOtherUser({
                id: firstMessage.toUser.id,
                email: firstMessage.toUser.email
              });
            }
          }
        }
        
        // Fallback to thread lead if no other user found
        if (!otherUser) {
          const threadOtherUser = thread.lead.homeowner.id === currentUserId
            ? thread.lead.contractor
            : thread.lead.homeowner;
          
          if (threadOtherUser) {
            setOtherUser(threadOtherUser);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending || !otherUser) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: newMessage.trim(),
          fromUserId: currentUserId,
          toUserId: otherUser.id
        }),
      });

      if (response.ok) {
        setNewMessage("");
        // Refresh messages after sending
        await fetchMessages();
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial load and periodic refresh
  useEffect(() => {
    fetchMessages();
    
    // Simple polling every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    
    return () => clearInterval(interval);
  }, [thread.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border h-[600px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-2"></div>
          <p>Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-4 rounded-t-lg">
        <h3 className="text-lg font-semibold">{thread.lead.title}</h3>
        <p className="text-teal-100 text-sm">
          with {otherUser?.email || "Loading..."}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isFromCurrentUser = message.fromUser.id === currentUserId;
            
            return (
              <div
                key={message.id}
                className={`flex ${isFromCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isFromCurrentUser
                      ? "bg-teal-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.body}</p>
                  <p className={`text-xs mt-1 ${
                    isFromCurrentUser ? "text-teal-200" : "text-gray-500"
                  }`}>
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={!otherUser}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100"
            maxLength={1000}
          />
          
          <button
            type="submit"
            disabled={!newMessage.trim() || sending || !otherUser}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}