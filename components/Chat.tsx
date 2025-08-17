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
    status?: string;
    homeowner: { id: string; email: string };
    contractor?: { id: string; email: string } | null;
  };
}

interface ChatProps {
  thread: Thread;
  currentUserId: string;
}

export default function Chat({ thread, currentUserId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [hiringContractor, setHiringContractor] = useState(false);
  const [contractorHired, setContractorHired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const otherUser =
    thread.lead.homeowner.id === currentUserId
      ? thread.lead.contractor
      : thread.lead.homeowner;

  const isHomeowner = currentUserId === thread.lead.homeowner.id;
  const canHireContractor =
    isHomeowner &&
    thread.lead.contractor &&
    thread.lead.status !== "assigned" &&
    !contractorHired;

  // Debug logging
  console.log("Chat Debug:", {
    currentUserId,
    homeownerId: thread.lead.homeowner.id,
    isHomeowner,
    contractor: thread.lead.contractor,
    status: thread.lead.status,
    contractorHired,
    canHireContractor,
  });

  const scrollToBottom = () => {
    if (shouldScrollToBottom && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    fetchMessages();
    setShouldScrollToBottom(true);
  }, [thread.id]);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
    }
  }, [messages, shouldScrollToBottom]);

  useEffect(() => {
    // Poll for new messages every 3 seconds
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [thread.id]);

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
    if (!newMessage.trim() || !otherUser) return;

    try {
      const response = await fetch(`/api/threads/${thread.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: currentUserId,
          toUserId: otherUser.id,
          message: newMessage.trim(),
        }),
      });

      if (response.ok) {
        setNewMessage("");
        setShouldScrollToBottom(true); // Force scroll after sending a message
        fetchMessages(); // Refresh messages
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const hireContractor = async () => {
    if (!thread.lead.contractor) return;

    setHiringContractor(true);
    try {
      const response = await fetch(`/api/leads/${thread.lead.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractorId: thread.lead.contractor.id,
        }),
      });

      if (response.ok) {
        setContractorHired(true);
        // Optionally show a success message
      } else {
        console.error("Failed to hire contractor");
      }
    } catch (error) {
      console.error("Error hiring contractor:", error);
    } finally {
      setHiringContractor(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-4">Loading messages...</div>;
  }

  return (
    <div className="border rounded-lg h-[600px] flex flex-col bg-white overflow-hidden">
      <div className="border-b p-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold truncate">
              {thread.lead.title}
            </h2>
            <p className="text-sm text-gray-600 truncate">
              Chat with {otherUser?.email || "Unknown User"}
            </p>
          </div>

          {/* Hire Contractor Button */}
          {canHireContractor && (
            <button
              onClick={hireContractor}
              disabled={hiringContractor}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {hiringContractor ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Hiring...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Hire Contractor</span>
                </>
              )}
            </button>
          )}

          {/* Success Banner */}
          {contractorHired && (
            <div className="px-4 py-2 bg-green-100 text-green-800 rounded-md border border-green-200">
              ✅ Contractor hired! Job removed from board.
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          onScroll={(e) => {
            const container = e.currentTarget;
            const isScrolledToBottom =
              container.scrollHeight - container.scrollTop <=
              container.clientHeight + 10;
            setShouldScrollToBottom(isScrolledToBottom);
          }}
        >
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex w-full ${
                  message.fromUser.id === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div className="flex items-start space-x-2 max-w-[80%] w-auto">
                  {message.fromUser.id !== currentUserId && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium shrink-0">
                      {message.fromUser.email.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-3 py-2 break-words ${
                      message.fromUser.id === currentUserId
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">
                      {message.body}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        message.fromUser.id === currentUserId
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  {message.fromUser.id === currentUserId && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-medium text-white shrink-0">
                      {message.fromUser.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t p-4 shrink-0">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewMessage(e.target.value)
              }
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
