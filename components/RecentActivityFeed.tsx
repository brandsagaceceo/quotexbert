"use client";

import { useState, useEffect } from "react";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { z } from "zod";

const activityResponse = z.object({
  activities: z.array(z.object({
    id: z.string(),
    type: z.enum(["quote_generated", "job_posted", "contractor_joined", "job_claimed", "job_completed"]),
    category: z.string().nullish(),
    city: z.string(),
    estimate: z.number().finite().nonnegative().nullish(),
    timestamp: z.string().datetime({ offset: true }).transform(value => new Date(value)),
  })),
});
type ActivityEvent = z.infer<typeof activityResponse>["activities"][number];

interface RecentActivityFeedProps {
  maxItems?: number;
  showTitle?: boolean;
  title?: string;
  description?: string;
}

export default function RecentActivityFeed({
  maxItems = 10,
  showTitle = true,
  title = "Recent Activity on QuoteXbert",
  description,
}: RecentActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityData();
  }, [maxItems]);

  const fetchActivityData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/activity-feed?limit=${maxItems}`);
      if (!response.ok) throw new Error(`Activity service returned HTTP ${response.status}`);
      const data = activityResponse.parse(await response.json());
      setActivities(data.activities.slice(0, maxItems));
    } catch (error) {
      console.error('Failed to fetch activity feed:', error);
      setActivities([]);
      setError("Recent activity is currently unavailable. No example activity is shown.");
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes === 1) return "1 minute ago";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "quote_generated":
        return "💰";
      case "job_posted":
        return "🏗️";
      case "contractor_joined":
        return "👷";
      case "job_claimed":
        return "🔥";
      case "job_completed":
        return "✅";
      default:
        return "📋";
    }
  };

  const getActivityText = (activity: ActivityEvent): string => {
    switch (activity.type) {
      case "quote_generated":
        return `${activity.category || "Project"} quote generated`;
      case "job_posted":
        return `${activity.category || "Project"} posted`;
      case "contractor_joined":
        return "Contractor joined the platform";
      case "job_claimed":
        return `Contractor accepted ${activity.category || "a project"}`;
      case "job_completed":
        return `${activity.category || "Project"} completed`;
      default:
        return "Activity";
    }
  };

  return (
    <div role="region" aria-label={title} className="w-full">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{title}</h2>
          {description && <p className="text-base md:text-lg text-slate-600">{description}</p>}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        {loading ? <p role="status" className="p-4 text-slate-600">Loading recent activity...</p>
          : error ? (
            <div role="alert" className="p-4 text-red-800">
              <p>{error}</p>
              <button onClick={fetchActivityData} className="mt-2 font-semibold underline">Try again</button>
            </div>
          ) : activities.length === 0 ? <p className="p-4 text-slate-600">No public activity is available.</p> : null}
        <div className="divide-y divide-slate-100">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="p-4 hover:bg-slate-50 transition-colors duration-150"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-900 mb-2">
                    {getActivityText(activity)}
                  </h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                      <span>{activity.city}</span>
                    </div>
                    
                    {activity.estimate && (
                      <div className="text-sm font-semibold text-rose-700">
                        ${activity.estimate.toLocaleString()} estimate
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span>{formatTimestamp(activity.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
