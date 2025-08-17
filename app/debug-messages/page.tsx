"use client";

import { useState, useEffect } from "react";

export default function DebugMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Test with contractor ID
  const contractorId = "cmeelabtm0001jkisp3uamyg2";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log("🔍 Fetching threads for contractor:", contractorId);

      const response = await fetch(`/api/threads?userId=${contractorId}`);
      const data = await response.json();

      console.log("📋 Threads response:", data);

      if (response.ok) {
        setThreads(data.threads || []);

        if (data.threads && data.threads.length > 0) {
          const firstThread = data.threads[0];
          console.log("📧 First thread:", firstThread);

          // Fetch messages for first thread
          const messagesResponse = await fetch(
            `/api/threads/${firstThread.id}/messages`,
          );
          const messagesData = await messagesResponse.json();

          console.log("💬 Messages response:", messagesData);

          if (messagesResponse.ok) {
            setMessages(messagesData.messages || []);
          }
        }
      } else {
        setError(`API Error: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error("❌ Error:", err);
      setError(
        `Fetch Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Messages</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Messages</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Status</h2>
        <p>Contractor ID: {contractorId}</p>
        {error && <p className="text-red-600">Error: {error}</p>}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Threads ({threads.length})
        </h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(threads, null, 2)}</pre>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Messages ({messages.length})
        </h2>
        <div className="bg-gray-100 p-4 rounded">
          <pre>{JSON.stringify(messages, null, 2)}</pre>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={fetchData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
}
