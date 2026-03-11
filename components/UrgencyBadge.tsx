"use client";

import { getUrgencyIndicator, formatTimeAgo } from "@/lib/urgency";

interface UrgencyBadgeProps {
  createdAt: Date | string;
  className?: string;
}

export function UrgencyBadge({ createdAt, className = "" }: UrgencyBadgeProps) {
  const urgency = getUrgencyIndicator(createdAt);
  const timeAgo = formatTimeAgo(createdAt);

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${urgency.color} ${urgency.bgColor} ${urgency.borderColor}`}
      >
        <span className="text-base">{urgency.emoji}</span>
        <span>{urgency.label}</span>
      </span>
      <span className="text-xs text-slate-500">Posted {timeAgo}</span>
    </div>
  );
}
