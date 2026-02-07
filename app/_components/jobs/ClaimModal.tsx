"use client";

import { useState } from "react";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: (message?: string) => Promise<{ claimed: boolean; reason?: string }>;
  jobTitle: string;
}

export default function ClaimModal({
  isOpen,
  onClose,
  onClaim,
  jobTitle,
}: ClaimModalProps) {
  const [message, setMessage] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [result, setResult] = useState<{
    claimed: boolean;
    reason?: string;
  } | null>(null);

  const handleClaim = async () => {
    setClaiming(true);
    try {
      const claimResult = await onClaim(message || undefined);
      setResult(claimResult);

      if (claimResult.claimed) {
        setTimeout(() => {
          onClose();
          setMessage("");
          setResult(null);
        }, 2000);
      }
    } finally {
      setClaiming(false);
    }
  };

  const handleClose = () => {
    onClose();
    setMessage("");
    setResult(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-full flex items-center justify-center p-4 py-8">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-ink-900">Claim Job</h3>
          <button
            onClick={handleClose}
            className="text-ink-400 hover:text-ink-600 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {result ? (
          <div className="text-center">
            {result.claimed ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-green-900 mb-2">
                    Job Claimed Successfully!
                  </h4>
                  <p className="text-green-700">
                    We&apos;ll connect you with the homeowner soon. Check your
                    email for details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-900 mb-2">
                    Unable to Claim Job
                  </h4>
                  <p className="text-red-700">
                    {result.reason === "ALREADY_CLAIMED"
                      ? "This job has already been claimed by another contractor."
                      : result.reason === "NOT_PUBLISHED"
                        ? "This job is no longer available."
                        : "An error occurred. Please try again."}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-ink-700 mb-4">
                You&apos;re about to claim: <strong>{jobTitle}</strong>
              </p>
              <p className="text-sm text-ink-600 mb-4">
                Once you claim this job, we&apos;ll connect you directly with
                the homeowner.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Message to homeowner (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell the homeowner why you're the right fit for this job..."
                rows={4}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand resize-none"
              />
              <p className="text-xs text-ink-500 mt-1">
                This message will be included in your introduction email.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-ink-300 text-ink-700 rounded-xl hover:bg-ink-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClaim}
                disabled={claiming}
                className="flex-1 px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-50"
              >
                {claiming ? "Claiming..." : "Claim Job"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
