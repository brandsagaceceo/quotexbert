"use client";

import Link from "next/link";
import { useState } from "react";
import { parseTags } from "@/lib/jobs";

interface JobCardProps {
  lead: {
    id: string;
    createdAt: Date;
    projectType: string;
    description: string;
    estimate: string;
    city?: string | null;
    province?: string | null;
    tags?: string | null;
    affiliateId?: string | null;
    status: string;
    budgetMin?: number | null;
    budgetMax?: number | null;
  };
  isSaved?: boolean;
  onSave?: (leadId: string) => void;
  onApply?: (leadId: string) => void;
}

export default function JobCard({
  lead,
  isSaved = false,
  onSave,
  onApply,
}: JobCardProps) {
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const tags = parseTags(lead.tags);
  const timeAgo = getTimeAgo(lead.createdAt);
  const location = [lead.city, lead.province].filter(Boolean).join(", ");
  const budget = getBudgetRange(lead.budgetMin, lead.budgetMax);

  const handleSave = async () => {
    if (!onSave || saving) return;
    setSaving(true);

    try {
      await onSave(lead.id);

      // Emit Clarity event
      if (typeof window !== "undefined" && (window as any).clarity) {
        (window as any).clarity("event", "job_saved", { leadId: lead.id });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApply = async () => {
    if (!onApply || applying) return;
    setApplying(true);

    try {
      await onApply(lead.id);

      // Emit Clarity event
      if (typeof window !== "undefined" && (window as any).clarity) {
        (window as any).clarity("event", "job_applied", { leadId: lead.id });
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="bg-white border border-ink-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-ink-900">
              {lead.projectType}
            </h3>
            {lead.affiliateId && (
              <span className="px-2 py-1 bg-brand/10 text-brand text-xs font-medium rounded-md">
                Affiliate
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-ink-600 mb-2 flex-wrap">
            <span>{timeAgo}</span>
            {location && <span>{location}</span>}
            {budget && <span className="font-medium text-brand">{budget}</span>}
          </div>
        </div>

        <div className="text-right flex-shrink-0 ml-4">
          <div className="inline-block px-3 py-1.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold text-base rounded-lg shadow-sm">{lead.estimate}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-ink-700 mb-4 line-clamp-3">{lead.description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-ink-100 text-ink-700 text-sm rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link
          href={`/contractor/jobs/${lead.id}`}
          className="text-brand hover:text-brand-dark font-medium transition-colors duration-200"
        >
          View Details →
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2 ${
              isSaved
                ? "bg-brand text-white"
                : "border border-brand text-brand hover:bg-brand hover:text-white"
            }`}
          >
            {saving ? "..." : isSaved ? "Saved" : "Save"}
          </button>

          <button
            onClick={handleApply}
            disabled={applying}
            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2"
          >
            {applying ? "..." : "Apply"}
          </button>
        </div>
      </div>
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
  if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  if (min) return `$${min.toLocaleString()}+`;
  if (max) return `Up to $${max.toLocaleString()}`;
  return null;
}
