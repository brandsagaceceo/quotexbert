"use client";

import { useEffect, useState } from "react";

interface AnalyticsEvent {
  event: string;
  timestamp: string;
  properties: Record<string, any>;
  person?: {
    id: string;
    properties: Record<string, any>;
  };
}

interface AnalyticsData {
  totalEvents: number;
  uniqueUsers: number;
  events: AnalyticsEvent[];
  eventCounts: Record<string, number>;
  recentActivity: AnalyticsEvent[];
}

const EVENT_DESCRIPTIONS = {
  estimate_created: "Estimate Created",
  estimate_viewed: "Estimate Viewed", 
  thread_created: "Thread Started",
  message_sent: "Message Sent",
  lead_accepted: "Lead Accepted",
  contract_created: "Contract Created",
  contract_sent: "Contract Sent",
  contract_accepted: "Contract Accepted",
  contract_pdf_generated: "Contract PDF Generated",
  payment_completed: "Payment Completed",
};

export default function InsightsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📊 Product Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow border">
              <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">📊 Product Analytics</h1>
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
            <button 
              onClick={fetchAnalytics}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalRevenue = analyticsData?.events
    .filter(e => e.event === "payment_completed")
    .reduce((sum, e) => sum + (e.properties.amountCents || 0), 0) || 0;

  const conversionEvents = analyticsData?.events.filter(e => 
    ["estimate_created", "lead_accepted", "contract_accepted", "payment_completed"].includes(e.event)
  ) || [];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">📊 Product Analytics</h1>
        
        <div className="flex items-center gap-4">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="1d">Today</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
          </select>
          
          <button 
            onClick={fetchAnalytics}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded border"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData?.totalEvents.toLocaleString()}</div>
          <p className="text-xs text-gray-500">All tracked events</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-2xl font-bold">{analyticsData?.uniqueUsers}</div>
          <p className="text-xs text-gray-500">Unique users tracked</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
            <span className="text-2xl">💵</span>
          </div>
          <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
          <p className="text-xs text-gray-500">Total payments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Conversions</h3>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-2xl font-bold">{conversionEvents.length}</div>
          <p className="text-xs text-gray-500">Estimates → Payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Event Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-2">Event Breakdown</h2>
          <p className="text-gray-600 mb-4">Most frequent user actions</p>
          
          <div className="space-y-4">
            {Object.entries(analyticsData?.eventCounts || {})
              .sort(([,a], [,b]) => b - a)
              .slice(0, 10)
              .map(([event, count]) => {
                const description = EVENT_DESCRIPTIONS[event as keyof typeof EVENT_DESCRIPTIONS] || event;
                
                return (
                  <div key={event} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{description}</span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="text-xl font-bold mb-2">Recent Activity</h2>
          <p className="text-gray-600 mb-4">Latest user events</p>
          
          <div className="space-y-4">
            {analyticsData?.recentActivity.slice(0, 10).map((event, index) => {
              const description = EVENT_DESCRIPTIONS[event.event as keyof typeof EVENT_DESCRIPTIONS] || event.event;
              const timestamp = new Date(event.timestamp).toLocaleString();
              
              return (
                <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                  <p className="text-sm font-medium">{description}</p>
                  <p className="text-xs text-gray-500">{timestamp}</p>
                  {Object.keys(event.properties).length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {Object.entries(event.properties).slice(0, 3).map(([key, value]) => (
                        <span key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {key}: {String(value).slice(0, 20)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
