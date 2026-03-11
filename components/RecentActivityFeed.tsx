"use client";

import { useState, useEffect } from "react";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface ActivityEvent {
  id: string;
  type: "quote_generated" | "job_posted" | "contractor_joined" | "job_claimed" | "job_completed";
  category?: string;
  city: string;
  estimate?: number;
  timestamp: Date;
}

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

  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      const response = await fetch('/api/activity-feed');
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || generateSampleActivities());
      } else {
        setActivities(generateSampleActivities());
      }
    } catch (error) {
      console.error('Failed to fetch activity feed:', error);
      setActivities(generateSampleActivities());
    }
  };

  const generateSampleActivities = (): ActivityEvent[] => [
      {
        id: "1",
        type: "quote_generated",
        category: "Bathroom renovation",
        city: "Toronto",
        estimate: 5200,
        timestamp: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      },
      {
        id: "2",
        type: "job_posted",
        category: "Kitchen remodel",
        city: "Scarborough",
        estimate: 22800,
        timestamp: new Date(Date.now() - 11 * 60 * 1000), // 11 minutes ago
      },
      {
        id: "3",
        type: "job_claimed",
        category: "Deck construction",
        city: "Mississauga",
        estimate: 12500,
        timestamp: new Date(Date.now() - 18 * 60 * 1000), // 18 minutes ago
      },
      {
        id: "4",
        type: "contractor_joined",
        city: "North York",
        timestamp: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
      },
      {
        id: "5",
        type: "quote_generated",
        category: "Basement finishing",
        city: "Etobicoke",
        estimate: 18500,
        timestamp: new Date(Date.now() - 34 * 60 * 1000), // 34 minutes ago
      },
      {
        id: "6",
        type: "job_completed",
        category: "Flooring installation",
        city: "Brampton",
        estimate: 8900,
        timestamp: new Date(Date.now() - 47 * 60 * 1000), // 47 minutes ago
      },
      {
        id: "7",
        type: "job_posted",
        category: "Roof replacement",
        city: "Vaughan",
        estimate: 15400,
        timestamp: new Date(Date.now() - 58 * 60 * 1000), // 58 minutes ago
      },
      {
        id: "8",
        type: "quote_generated",
        category: "Painting interior",
        city: "Markham",
        estimate: 6700,
        timestamp: new Date(Date.now() - 72 * 60 * 1000), // 1 hour 12 min ago
      },
      {
        id: "9",
        type: "job_claimed",
        category: "Kitchen renovation",
        city: "Richmond Hill",
        estimate: 24300,
        timestamp: new Date(Date.now() - 89 * 60 * 1000), // 1 hour 29 min ago
      },
      {
        id: "10",
        type: "contractor_joined",
        city: "Toronto",
        timestamp: new Date(Date.now() - 105 * 60 * 1000), // 1 hour 45 min ago
      },
      {
        id: "11",
        type: "job_completed",
        category: "Bathroom remodel",
        city: "Scarborough",
        estimate: 9800,
        timestamp: new Date(Date.now() - 128 * 60 * 1000), // 2 hours 8 min ago
      },
      {
        id: "12",
        type: "quote_generated",
        category: "Deck build",
        city: "Mississauga",
        estimate: 11200,
        timestamp: new Date(Date.now() - 145 * 60 * 1000), // 2 hours 25 min ago
      },
    ];

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
        return `${activity.category} quote generated`;
      case "job_posted":
        return `${activity.category} posted`;
      case "contractor_joined":
        return "Contractor joined the platform";
      case "job_claimed":
        return `Contractor accepted ${activity.category}`;
      case "job_completed":
        return `${activity.category} completed`;
      default:
        return "Activity";
    }
  };

  return (
    <div className="w-full">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{title}</h2>
          {description && <p className="text-base md:text-lg text-slate-600">{description}</p>}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
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
