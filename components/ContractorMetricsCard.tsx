"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Star, Clock, CheckCircle, Briefcase, Target, DollarSign, Calendar, ChevronDown } from "lucide-react";

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
  const [error, setError] = useState(false);
  const [noProfile, setNoProfile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, [contractorId]);

  const fetchMetrics = async () => {
    setError(false);
    setNoProfile(false);
    setLoading(true);
    try {
      const response = await fetch(`/api/contractors/metrics?contractorId=${contractorId}`);
      const data = await response.json();

      if (response.status === 404) {
        // Contractor hasn't completed their profile yet — not an error
        setNoProfile(true);
      } else if (data.success) {
        setMetrics(data.metrics);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
      setError(true);
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
    if (noProfile) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-400">Complete your contractor profile to see performance metrics.</p>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-500 text-sm">{error ? "Could not load metrics" : "No data yet"}</p>
          {error && (
            <button onClick={fetchMetrics} className="text-xs text-rose-600 hover:underline font-medium">
              Retry
            </button>
          )}
        </div>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Compact header row — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-rose-500" />
            My Stats
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {metrics.leadsReceived} leads
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-green-500" />
            {metrics.jobsAccepted} accepted
          </span>
          {metrics.avgRating > 0 && (
            <span className="text-xs text-gray-500">
              ⭐ {metrics.avgRating.toFixed(1)}
            </span>
          )}
          {metrics.recentActivity.acceptancesLast30Days > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {metrics.recentActivity.acceptancesLast30Days} new this month
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Expanded detail grid */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 pb-4 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {metricItems.slice(0, 5).map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`${item.bgColor} rounded-lg p-3 border border-gray-100`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <p className="text-xs font-medium text-gray-500">{item.label}</p>
                  </div>
                  <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
                  {item.subtitle && (
                    <p className="text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
