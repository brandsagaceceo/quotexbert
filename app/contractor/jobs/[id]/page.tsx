"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLeadById, parseTags } from "@/lib/jobs";
import { saveInterestAction, claimLeadAction } from "../actions";
import ClaimModal from "@/app/_components/jobs/ClaimModal";

interface Lead {
  id: string;
  createdAt: Date;
  projectType: string;
  description: string;
  estimate: string;
  postalCode: string;
  city?: string | null;
  province?: string | null;
  tags?: string | null;
  affiliateId?: string | null;
  status: string;
  budgetMin?: number | null;
  budgetMax?: number | null;
  claimedById?: string | null;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);

  const loadLead = async () => {
    try {
      const leadData = await getLeadById(params.id as string);
      if (!leadData) {
        router.push("/contractor/jobs");
        return;
      }

      // Use type assertion since the data structure differs from the local interface
      setLead(leadData as any);
    } catch (error) {
      console.error("Error loading lead:", error);
      router.push("/contractor/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!lead) return;

    try {
      await saveInterestAction(lead.id, "SAVED");
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleApply = async () => {
    if (!lead) return;

    try {
      await saveInterestAction(lead.id, "APPLIED");
      setHasApplied(true);
    } catch (error) {
      console.error("Error applying to job:", error);
    }
  };

  const handleClaim = async (message?: string) => {
    if (!lead) return { claimed: false, reason: "LEAD_NOT_FOUND" };

    const result = await claimLeadAction(lead.id, message);

    if (result.claimed) {
      setLead((prev) =>
        prev
          ? { ...prev, status: "CLAIMED", claimedById: "demo-contractor-123" }
          : null,
      );
    }

    return result;
  };

  useEffect(() => {
    loadLead();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-ink-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-ink-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-ink-200 rounded w-2/3 mb-8"></div>
            <div className="h-32 bg-ink-200 rounded mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-ink-900 mb-2">
            Job not found
          </h2>
          <p className="text-ink-600 mb-4">
            This job may have been removed or is no longer available.
          </p>
          <Link
            href="/contractor/jobs"
            className="px-4 py-2 bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors duration-200"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  const tags = parseTags(lead.tags);
  const timeAgo = getTimeAgo(lead.createdAt);
  const location = [lead.city, lead.province].filter(Boolean).join(", ");
  const budget = getBudgetRange(lead.budgetMin, lead.budgetMax);
  const isCurrentUserClaimed = lead.claimedById === "demo-contractor-123"; // Mock check
  const isClaimedByOther = lead.status === "CLAIMED" && !isCurrentUserClaimed;

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/contractor/jobs"
            className="text-brand hover:text-brand-dark font-medium transition-colors duration-200 mb-4 inline-block"
          >
            ← Back to Job Board
          </Link>
        </div>

        {/* Status Banner */}
        {isCurrentUserClaimed && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
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
                <h3 className="font-semibold text-green-900">
                  You claimed this job
                </h3>
                <p className="text-green-700 text-sm">
                  We&apos;ll connect you with the homeowner soon. Check your
                  email for details.
                </p>
              </div>
            </div>
          </div>
        )}

        {isClaimedByOther && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 19c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900">
                  Job Already Claimed
                </h3>
                <p className="text-yellow-700 text-sm">
                  This job has been claimed by another contractor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-ink-900">
                  {lead.projectType}
                </h1>
                {lead.affiliateId && (
                  <span className="px-3 py-1 bg-brand/10 text-brand text-sm font-medium rounded-md">
                    Affiliate Lead
                  </span>
                )}
              </div>

              <div className="flex items-center gap-6 text-ink-600 mb-4">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {timeAgo}
                </span>
                {location && (
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {location}
                  </span>
                )}
                <span className="text-sm text-ink-500">
                  Postal: {lead.postalCode}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-brand mb-2">
                {lead.estimate}
              </div>
              {budget && <div className="text-ink-600">{budget}</div>}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-ink-100 text-ink-700 rounded-md font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ink-900 mb-4">
              Project Description
            </h2>
            <div className="prose prose-ink max-w-none">
              <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">
                {lead.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          {!isClaimedByOther && (
            <div className="flex items-center gap-4 pt-6 border-t border-ink-200">
              <button
                onClick={handleSave}
                className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                  isSaved
                    ? "bg-brand text-white"
                    : "border border-brand text-brand hover:bg-brand hover:text-white"
                }`}
              >
                {isSaved ? "Saved" : "Save Job"}
              </button>

              {!isCurrentUserClaimed && (
                <>
                  <button
                    onClick={handleApply}
                    className={`px-6 py-3 rounded-xl font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
                      hasApplied
                        ? "bg-green-600 text-white"
                        : "bg-ink-600 hover:bg-ink-700 text-white"
                    }`}
                  >
                    {hasApplied ? "Applied" : "Apply"}
                  </button>

                  {lead.status === "PUBLISHED" && (
                    <button
                      onClick={() => setShowClaimModal(true)}
                      className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2"
                    >
                      Claim Job
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onClaim={handleClaim}
        jobTitle={lead.projectType}
      />
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks}w ago`;
}

function getBudgetRange(
  min?: number | null,
  max?: number | null,
): string | null {
  if (!min && !max) return null;
  if (min && max)
    return `Budget: $${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `Budget: $${min.toLocaleString()}+`;
  if (max) return `Budget: Up to $${max.toLocaleString()}`;
  return null;
}
