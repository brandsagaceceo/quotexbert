"use client";

import { useState, useEffect } from "react";

export default function SimpleDebugPage() {
  const [debugData, setDebugData] = useState<any>({});
  const [currentUserId, setCurrentUserId] = useState(
    "cmeelabtm0001jkisp3uamyg2",
  ); // Default to contractor

  useEffect(() => {
    testEverything();
  }, [currentUserId]);

  const testEverything = async () => {
    const results: any = { timestamp: new Date().toISOString() };

    try {
      // Test 1: Fetch users
      console.log("🧪 Testing users API...");
      const usersRes = await fetch("/api/debug-users");
      results.usersStatus = `${usersRes.status} ${usersRes.statusText}`;
      if (usersRes.ok) {
        results.users = await usersRes.json();
      }

      // Test 2: Fetch threads
      console.log("🧪 Testing threads API...");
      const threadsRes = await fetch(`/api/threads?userId=${currentUserId}`);
      results.threadsStatus = `${threadsRes.status} ${threadsRes.statusText}`;
      if (threadsRes.ok) {
        const threadsData = await threadsRes.json();
        results.threads = threadsData;

        // Test 3: If we have threads, test messages
        if (threadsData.threads && threadsData.threads.length > 0) {
          const firstThreadId = threadsData.threads[0].id;
          console.log("🧪 Testing messages API...");
          const messagesRes = await fetch(
            `/api/threads/${firstThreadId}/messages`,
          );
          results.messagesStatus = `${messagesRes.status} ${messagesRes.statusText}`;
          if (messagesRes.ok) {
            results.messages = await messagesRes.json();
          }
        }
      }
    } catch (error) {
      results.error = error instanceof Error ? error.message : "Unknown error";
    }

    setDebugData(results);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Simple Debug Page
          </h1>
          <p className="text-gray-600">
            Testing the messaging system step by step
          </p>
        </div>

        {/* User Switcher */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">👤 User Switcher</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="user"
                value="cmeelabtm0001jkisp3uamyg2"
                checked={currentUserId === "cmeelabtm0001jkisp3uamyg2"}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="mr-2"
              />
              Contractor (contractor@demo.com)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="user"
                value="cmeelabte0000jkis8cwheaxu"
                checked={currentUserId === "cmeelabte0000jkis8cwheaxu"}
                onChange={(e) => setCurrentUserId(e.target.value)}
                className="mr-2"
              />
              Homeowner (homeowner@demo.com)
            </label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Current User ID:{" "}
            <code className="bg-gray-100 px-1">{currentUserId}</code>
          </p>
        </div>

        {/* Debug Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 Debug Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div
              className={`p-3 rounded ${debugData.usersStatus?.includes("200") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <strong>Users API:</strong>{" "}
              {debugData.usersStatus || "Not tested"}
            </div>
            <div
              className={`p-3 rounded ${debugData.threadsStatus?.includes("200") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <strong>Threads API:</strong>{" "}
              {debugData.threadsStatus || "Not tested"}
            </div>
            <div
              className={`p-3 rounded ${debugData.messagesStatus?.includes("200") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              <strong>Messages API:</strong>{" "}
              {debugData.messagesStatus || "Not tested"}
            </div>
          </div>

          <details className="mb-4">
            <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
              📊 Full Debug Data (Click to expand)
            </summary>
            <pre className="mt-2 bg-gray-50 p-4 rounded text-xs overflow-auto max-h-96 border">
              {JSON.stringify(debugData, null, 2)}
            </pre>
          </details>
        </div>

        {/* Quick Summary */}
        {debugData.threads && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📋 Quick Summary</h2>
            <div className="space-y-2">
              <p>
                <strong>Threads found:</strong>{" "}
                {debugData.threads.threads?.length || 0}
              </p>
              {debugData.threads.threads?.length > 0 && (
                <>
                  <p>
                    <strong>First thread:</strong>{" "}
                    {debugData.threads.threads[0].lead.title}
                  </p>
                  <p>
                    <strong>Messages in first thread:</strong>{" "}
                    {debugData.messages?.messages?.length || 0}
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">🚀 Action Buttons</h2>
          <div className="space-y-2">
            <button
              onClick={() => window.open("/messages", "_blank")}
              className="w-full bg-rose-700 text-white p-3 rounded hover:bg-rose-700"
            >
              📨 Open Full Messages Page
            </button>
            <button
              onClick={() => window.open("/test-messaging", "_blank")}
              className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
            >
              🧪 Open Test Page
            </button>
            <button
              onClick={testEverything}
              className="w-full bg-purple-500 text-white p-3 rounded hover:bg-purple-600"
            >
              🔄 Re-run Tests
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
