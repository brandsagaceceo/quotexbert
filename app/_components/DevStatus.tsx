"use client";

import { useState, useEffect } from "react";

export default function DevStatus() {
  const [status, setStatus] = useState<"checking" | "up" | "down">("checking");
  const [lastCheck, setLastCheck] = useState<string>("");

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch("/api/health", {
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setStatus("up");
          setLastCheck(new Date(data.ts).toLocaleTimeString());
        } else {
          setStatus("down");
        }
      } catch (error) {
        setStatus("down");
      }
    };

    // Check immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-3 py-1 rounded-full text-xs font-mono shadow-lg border ${
          status === "up"
            ? "bg-green-100 text-green-800 border-green-200"
            : status === "down"
              ? "bg-red-100 text-red-800 border-red-200"
              : "bg-yellow-100 text-yellow-800 border-yellow-200"
        }`}
      >
        Dev: {status === "up" ? "UP" : status === "down" ? "DOWN" : "..."}
        {lastCheck && status === "up" && (
          <span className="ml-1 opacity-60">@ {lastCheck}</span>
        )}
      </div>
    </div>
  );
}
