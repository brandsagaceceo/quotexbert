"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

interface AnalyticsEvent {
  id: string;
  event: string;
  timestamp: string;
  properties: Record<string, unknown>;
  identifiedUser: boolean;
}

interface AnalyticsData {
  range: string;
  source: "database";
  generatedAt: string;
  totalEvents: number;
  identifiedUsers: number;
  eventCounts: Record<string, number>;
  recentActivity: AnalyticsEvent[];
  truncated: boolean;
  integrations: {
    googleAnalytics: {
      tagConfigured: boolean;
      metricsConnected: false;
    };
    searchConsole: {
      verificationTokenConfigured: boolean;
      metricsConnected: false;
      propertyUrl: string;
      sitemapUrl: string;
    };
  };
}

function eventLabel(event: string) {
  return event.replace(/_/g, " ");
}

export default function InsightsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch stored analytics");
      }
      setAnalyticsData(data);
    } catch (cause) {
      console.error("[ADMIN_INSIGHTS] Failed to load analytics:", cause);
      setError(
        cause instanceof Error ? cause.message : "Failed to fetch stored analytics",
      );
      setAnalyticsData(null);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    void fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link href="/admin" className="text-sm text-[#800020] hover:underline">
              Back to administration
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Product Analytics
            </h1>
            <p className="mt-2 max-w-3xl text-slate-600">
              Real events stored by QuoteXbert. Google Analytics and Search
              Console metrics remain disconnected until separately authorized.
            </p>
          </div>
          <div className="flex gap-3">
            <select
              aria-label="Analytics period"
              value={timeRange}
              onChange={(event) => setTimeRange(event.target.value)}
              className="rounded border border-slate-300 bg-white px-3 py-2"
            >
              <option value="1d">24 hours</option>
              <option value="7d">7 days</option>
              <option value="30d">30 days</option>
              <option value="90d">90 days</option>
            </select>
            <button
              type="button"
              onClick={() => void fetchAnalytics()}
              disabled={loading}
              className="rounded bg-[#800020] px-4 py-2 font-medium text-white disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800">
            {error}
          </p>
        )}

        {loading && !analyticsData ? (
          <p role="status" className="rounded border bg-white p-6 text-slate-600">
            Loading stored analytics...
          </p>
        ) : analyticsData ? (
          <>
            <section aria-label="Analytics summary" className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard label="Stored events" value={analyticsData.totalEvents.toLocaleString()} detail={analyticsData.range} />
              <MetricCard label="Identified users" value={analyticsData.identifiedUsers.toLocaleString()} detail="Distinct stored user IDs" />
              <MetricCard
                label="Google Analytics tag"
                value={analyticsData.integrations.googleAnalytics.tagConfigured ? "Configured" : "Not configured"}
                detail="Metrics API not connected"
              />
              <MetricCard
                label="Search Console"
                value={analyticsData.integrations.searchConsole.verificationTokenConfigured ? "Verification prepared" : "Not configured"}
                detail="Metrics API not connected"
              />
            </section>

            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">Google connection readiness</h2>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-700">Search property</dt>
                  <dd className="text-slate-600">{analyticsData.integrations.searchConsole.propertyUrl}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Sitemap</dt>
                  <dd className="text-slate-600">{analyticsData.integrations.searchConsole.sitemapUrl}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm text-slate-600">
                Configuration status is reported without exposing tokens or measurement IDs.
                No Google API request is made by this page.
              </p>
            </section>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">Stored event breakdown</h2>
                {Object.keys(analyticsData.eventCounts).length === 0 ? (
                  <p className="mt-4 text-slate-600">No stored events in this period.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {Object.entries(analyticsData.eventCounts)
                      .sort((left, right) => right[1] - left[1])
                      .map(([event, count]) => (
                        <div key={event} className="flex justify-between gap-4 border-b border-slate-100 pb-2">
                          <span className="capitalize text-slate-700">{eventLabel(event)}</span>
                          <span className="font-semibold text-slate-900">{count}</span>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">Recent stored activity</h2>
                {analyticsData.recentActivity.length === 0 ? (
                  <p className="mt-4 text-slate-600">No stored activity in this period.</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {analyticsData.recentActivity.map((event) => (
                      <article key={event.id} className="border-l-2 border-[#800020] pl-4">
                        <p className="font-medium capitalize text-slate-900">{eventLabel(event.event)}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleString("en-CA")}
                          {event.identifiedUser ? " • identified user" : ""}
                        </p>
                        {Object.keys(event.properties).length > 0 && (
                          <p className="mt-1 text-xs text-slate-600">
                            {Object.entries(event.properties)
                              .slice(0, 3)
                              .map(([key, value]) => `${key}: ${String(value).slice(0, 40)}`)
                              .join(" • ")}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <p className="mt-6 text-xs text-slate-500">
              Database snapshot generated {new Date(analyticsData.generatedAt).toLocaleString("en-CA")}.
              {analyticsData.truncated ? " Results are limited to the 500 newest events." : ""}
            </p>
          </>
        ) : null}
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
