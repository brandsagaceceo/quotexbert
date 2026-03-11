/**
 * Job Urgency Utilities
 * Calculate urgency indicators based on job posting time
 */

export type UrgencyLevel = "hot" | "active" | "older";

export interface UrgencyIndicator {
  level: UrgencyLevel;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

/**
 * Calculate urgency level based on job creation time
 * @param createdAt - Job creation timestamp
 * @returns Urgency level
 */
export function calculateUrgency(createdAt: Date | string): UrgencyLevel {
  const now = new Date();
  const jobDate = new Date(createdAt);
  const diffMs = now.getTime() - jobDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 30) {
    return "hot";
  } else if (diffMinutes < 360) { // 6 hours
    return "active";
  } else {
    return "older";
  }
}

/**
 * Get urgency indicator details
 * @param createdAt - Job creation timestamp
 * @returns Urgency indicator with styling
 */
export function getUrgencyIndicator(createdAt: Date | string): UrgencyIndicator {
  const level = calculateUrgency(createdAt);

  const indicators: Record<UrgencyLevel, UrgencyIndicator> = {
    hot: {
      level: "hot",
      label: "Hot Lead",
      emoji: "🔥",
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    active: {
      level: "active",
      label: "Active Lead",
      emoji: "🟡",
      color: "text-yellow-700",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    older: {
      level: "older",
      label: "Older Lead",
      emoji: "⚪",
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
    },
  };

  return indicators[level];
}

/**
 * Format time ago string
 * @param createdAt - Job creation timestamp
 * @returns Human-readable time ago string
 */
export function formatTimeAgo(createdAt: Date | string): string {
  const now = new Date();
  const jobDate = new Date(createdAt);
  const diffMs = now.getTime() - jobDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) {
    return "just now";
  } else if (diffMinutes === 1) {
    return "1 minute ago";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`;
  } else if (diffHours === 1) {
    return "1 hour ago";
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else if (diffDays === 1) {
    return "1 day ago";
  } else {
    return `${diffDays} days ago`;
  }
}
