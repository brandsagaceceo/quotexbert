"use client";

import { useState } from "react";

interface ClaimButtonProps {
  leadId: string;
  trade?: string;
  city?: string;
  onClaimed?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function ClaimLeadButton({
  leadId,
  trade = "general",
  city = "default",
  onClaimed,
  disabled = false,
  className = "",
}: ClaimButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleClaim = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/claim-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          userId: "demo-contractor-1", // TODO: Get from auth
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (onClaimed) onClaimed();
      } else {
        setError(data.error || "Failed to claim lead");
      }
    } catch (err: any) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleClaim}
        disabled={disabled || isLoading}
        className={`
          w-full px-4 py-2 rounded-lg font-medium transition-colors
          ${
            disabled
              ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
              : "bg-[#800020] text-white hover:bg-[#600018] active:bg-[#400010]"
          }
          ${isLoading ? "opacity-75 cursor-wait" : ""}
          ${className}
        `}
      >
        {isLoading ? "Processing..." : "Claim Lead"}
      </button>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
    </div>
  );
}
