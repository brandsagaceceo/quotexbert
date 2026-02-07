'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, Camera, Star, Award, Briefcase, MessageCircle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'job_accepted' | 'job_completed' | 'portfolio_added' | 'review_received' | 'profile_verified';
  title: string;
  description: string;
  timestamp: string;
  metadata?: any;
}

interface ActivityTimelineProps {
  userId: string;
  isContractor?: boolean;
}

export default function ActivityTimeline({ userId, isContractor = true }: ActivityTimelineProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity/timeline?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setActivities(data.activities || []);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'job_accepted':
        return <Briefcase className="h-5 w-5 text-blue-600" />;
      case 'job_completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'portfolio_added':
        return <Camera className="h-5 w-5 text-purple-600" />;
      case 'review_received':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'profile_verified':
        return <Award className="h-5 w-5 text-rose-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'job_accepted':
        return 'bg-blue-50 border-blue-200';
      case 'job_completed':
        return 'bg-green-50 border-green-200';
      case 'portfolio_added':
        return 'bg-purple-50 border-purple-200';
      case 'review_received':
        return 'bg-yellow-50 border-yellow-200';
      case 'profile_verified':
        return 'bg-rose-50 border-rose-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Recent Activity</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-rose-700" />
        <h2 className="text-2xl font-bold text-slate-900">Recent Activity</h2>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-slate-50 to-rose-50 rounded-xl border-2 border-dashed border-slate-300">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No Activity Yet</h3>
          <p className="text-slate-600">
            {isContractor 
              ? "Start accepting jobs and building your portfolio to see activity here."
              : "Your project activities will appear here as you work with contractors."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`relative p-4 rounded-lg border-2 ${getActivityColor(activity.type)} transition-all hover:shadow-md`}
            >
              {/* Timeline connector line */}
              {index < activities.length - 1 && (
                <div className="absolute left-6 top-12 bottom-[-16px] w-0.5 bg-gradient-to-b from-slate-300 to-transparent"></div>
              )}

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{activity.title}</h3>
                      <p className="text-base text-slate-700">{activity.description}</p>
                    </div>
                    <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  
                  {/* Optional metadata display */}
                  {activity.metadata && (
                    <div className="mt-2 text-sm text-slate-600">
                      {activity.metadata.location && (
                        <span className="inline-flex items-center gap-1">
                          📍 {activity.metadata.location}
                        </span>
                      )}
                      {activity.metadata.budget && (
                        <span className="inline-flex items-center gap-1 ml-3">
                          💰 {activity.metadata.budget}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
