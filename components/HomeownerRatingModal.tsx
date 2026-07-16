"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface HomeownerRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  homeownerName: string;
  leadId: string;
  onSubmitSuccess?: () => void;
}

const CATEGORY_FIELDS: Array<{ key: string; label: string }> = [
  { key: "communicationRating", label: "Communication" },
  { key: "clarityRating", label: "Clarity of Scope" },
  { key: "responsivenessRating", label: "Responsiveness" },
  { key: "paymentRating", label: "Payment Experience" },
  { key: "accessReadinessRating", label: "Access / Readiness" },
  { key: "professionalismRating", label: "Professionalism" },
];

/**
 * Private contractor -> homeowner "job experience" rating. Never shown publicly —
 * only visible to eligible contractors/admins. Uses neutral, professional wording.
 */
export function HomeownerRatingModal({
  isOpen,
  onClose,
  homeownerName,
  leadId,
  onSubmitSuccess,
}: HomeownerRatingModalProps) {
  const [overallRating, setOverallRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [privateNote, setPrivateNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (overallRating === 0) {
      setError("Please select an overall experience rating");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/homeowner-ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          overallRating,
          ...categories,
          privateNote,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit rating");
      }

      onSubmitSuccess?.();
      onClose();
      setOverallRating(0);
      setCategories({});
      setPrivateNote("");
    } catch (err: any) {
      setError(err.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="min-h-full flex items-center justify-center p-4 py-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90dvh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Homeowner Experience</h2>
            <p className="text-slate-600">
              How was your job experience with <strong>{homeownerName}</strong>?
            </p>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              This private score is based on verified completed projects and is visible only to
              eligible QuoteXbert contractors. It is never shown to the public or to homeowners.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                Overall Experience
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setOverallRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                    aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                  >
                    <svg
                      className={`w-9 h-9 ${
                        star <= (hoveredRating || overallRating)
                          ? "text-amber-400 fill-current"
                          : "text-slate-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">Optional details</p>
              <div className="grid grid-cols-2 gap-3">
                {CATEGORY_FIELDS.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block text-xs text-slate-500 mb-1">{label}</label>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setCategories((prev) => ({ ...prev, [key]: star }))
                          }
                          className="focus:outline-none"
                          aria-label={`${label}: ${star} star${star !== 1 ? "s" : ""}`}
                        >
                          <svg
                            className={`w-4 h-4 ${
                              star <= (categories[key] || 0)
                                ? "text-amber-400 fill-current"
                                : "text-slate-300"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="privateNote" className="block text-sm font-semibold text-slate-700 mb-2">
                Private note (optional)
              </label>
              <textarea
                id="privateNote"
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                rows={3}
                placeholder="Notes for other eligible contractors — keep it professional and factual..."
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                maxLength={500}
              />
              <p className="text-xs text-slate-500 mt-1">{privateNote.length}/500 characters</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-[#800020] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Rating"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
