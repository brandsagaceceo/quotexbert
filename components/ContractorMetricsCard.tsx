"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Star, Clock, CheckCircle, Briefcase, Target, DollarSign, Calendar } from "lucide-react";

interface ContractorMetrics {
  leadsReceived: number;
  jobsAccepted: number;
  jobsCompleted: number;
  avgRating: number;
  reviewCount: number;
  responseTime: string;
  avgResponseTimeHours: number | null;
  conversionRate: number;
  averageJobValue: number;
  leadsLast30Days: number;
  jobsCompletedLast30Days: number;
  recentActivity: {
    acceptancesLast30Days: number;
    reviewsLast30Days: number;
  };
}

interface ContractorMetricsCardProps {
  contractorId: string;
}

export function ContractorMetricsCard({ contractorId }: ContractorMetricsCardProps) {
  const [metrics, setMetrics] = useState<ContractorMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [contractorId]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/contractors/metrics?contractorId=${contractorId}`);
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.metrics);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500">Unable to load metrics</p>
      </div>
    );
  }

  const metricItems = [
    {
      label: "Leads Received",
      value: metrics.leadsReceived,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Jobs Accepted",
      value: metrics.jobsAccepted,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Jobs Completed",
      value: metrics.jobsCompleted,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      icon: Target,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      subtitle: metrics.conversionRate >= 50 ? "Excellent! 🎯" : metrics.conversionRate >= 25 ? "Good progress" : "Room to grow",
    },
    {
      label: "Avg Job Value",
      value: metrics.averageJobValue > 0 
        ? `$${metrics.averageJobValue.toLocaleString()}`
        : "N/A",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Average Rating",
      value: metrics.avgRating > 0 
        ? `⭐ ${metrics.avgRating.toFixed(1)}`
        : "No reviews yet",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      subtitle: metrics.reviewCount > 0 ? `${metrics.reviewCount} review${metrics.reviewCount !== 1 ? 's' : ''}` : null,
    },
    {
      label: "Response Time",
      value: metrics.responseTime,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      subtitle: metrics.avgResponseTimeHours !== null && metrics.avgResponseTimeHours < 24 
        ? "Fast responder! ⚡" 
        : null,
    },
    {
      label: "Leads (30d)",
      value: metrics.leadsLast30Days,
      icon: Calendar,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      subtitle: "Last 30 days",
    },
    {
      label: "Completed (30d)",
      value: metrics.jobsCompletedLast30Days,
      icon: CheckCircle,
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      subtitle: "Last 30 days",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Performance Metrics</h2>
        {metrics.recentActivity.acceptancesLast30Days > 0 && (
          <span className="text-sm text-green-600 font-medium">
            {metrics.recentActivity.acceptancesLast30Days} new job{metrics.recentActivity.acceptancesLast30Days !== 1 ? 's' : ''} this month
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metricItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`${item.bgColor} rounded-lg p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {item.label}
                  </p>
                  <p className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                  )}
                </div>
                <div className={`${item.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional insights */}
      {metrics.recentActivity.reviewsLast30Days > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            🎉 You received {metrics.recentActivity.reviewsLast30Days} new review{metrics.recentActivity.reviewsLast30Days !== 1 ? 's' : ''} this month!
          </p>
        </div>
      )}

      {/* Tips for improvement */}
      {metrics.avgRating === 0 && metrics.jobsCompleted > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            💡 Ask your clients to leave reviews to build trust and improve your ranking!
          </p>
        </div>
      )}

      {metrics.leadsReceived > 0 && metrics.jobsAccepted === 0 && (
        <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            💡 Start accepting jobs to grow your business and build your reputation!
          </p>
        </div>
      )}
    </div>
  );
}
