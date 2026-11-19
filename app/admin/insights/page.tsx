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
  aiUsage: {
    requests: number;
    completions: number;
    inputTokens: number;
    cachedInputTokens: number;
    outputTokens: number;
    estimatedCostUsd: number;
    pricedCompletions: number;
    pricingComplete: boolean;
    features: Record<string, number>;
    truncated: boolean;
  };
  integrations: {
    googleAnalytics: {
      tagConfigured: boolean;
      tagManagerConfigured: boolean;
      tagMode: "direct" | "tag-manager" | "none";
      propertyConfigured: boolean;
      credentialsConfigured: boolean;
      metricsConnected: boolean;
      error: string | null;
      metrics: {
        activeUsers: number;
        sessions: number;
        pageViews: number;
        conversions: number;
        trafficSources: Array<{
          sourceMedium: string;
          sessions: number;
          activeUsers: number;
          conversions: number;
        }>;
        landingPages: Array<{
          path: string;
          sessions: number;
          activeUsers: number;
          conversions: number;
        }>;
        blogPages: Array<{
          path: string;
          pageViews: number;
          activeUsers: number;
          conversions: number;
        }>;
      };
    };
    searchConsole: {
      verificationTokenConfigured: boolean;
      propertyConfigured: boolean;
      credentialsConfigured: boolean;
      metricsConnected: boolean;
      error: string | null;
      propertyUrl: string;
      sitemapUrl: string;
      metrics: {
        clicks: number;
        impressions: number;
        ctr: number;
        position: number;
        queries: Array<{
          query: string;
          clicks: number;
          impressions: number;
          ctr: number;
          position: number;
        }>;
      };
    };
  };
}

function eventLabel(event: string) {
  return event.replace(/_/g, " ");
}

export default function InsightsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
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
        cause instanceof Error
          ? cause.message
          : "Failed to fetch stored analytics",
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
            <Link
              href="/admin"
              className="text-sm text-[#800020] hover:underline"
            >
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
          <p
            role="alert"
            className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-red-800"
          >
            {error}
          </p>
        )}

        {loading && !analyticsData ? (
          <p
            role="status"
            className="rounded border bg-white p-6 text-slate-600"
          >
            Loading stored analytics...
          </p>
        ) : analyticsData ? (
          <>
            <section
              aria-label="Analytics summary"
              className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <MetricCard
                label="Stored events"
                value={analyticsData.totalEvents.toLocaleString()}
                detail={analyticsData.range}
              />
              <MetricCard
                label="Identified users"
                value={analyticsData.identifiedUsers.toLocaleString()}
                detail="Distinct stored user IDs"
              />
              <MetricCard
                label="Google Analytics tag"
                value={
                  analyticsData.integrations.googleAnalytics.tagConfigured
                    ? "Configured"
                    : "Not configured"
                }
                detail={
                  analyticsData.integrations.googleAnalytics.metricsConnected
                    ? "Read-only metrics connected"
                    : "Metrics API not connected"
                }
              />
              <MetricCard
                label="Search Console"
                value={
                  analyticsData.integrations.searchConsole.metricsConnected
                    ? "Connected"
                    : analyticsData.integrations.searchConsole
                          .verificationTokenConfigured
                      ? "Verification prepared"
                      : "Not connected"
                }
                detail={
                  analyticsData.integrations.searchConsole.metricsConnected
                    ? "Read-only metrics connected"
                    : "Metrics API not connected"
                }
              />
            </section>

            <section
              aria-label="AI usage"
              className="mb-8 rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="text-xl font-bold text-slate-900">
                AI usage and cost
              </h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  label="Reserved requests"
                  value={analyticsData.aiUsage.requests.toLocaleString()}
                  detail={analyticsData.range}
                />
                <MetricCard
                  label="Recorded completions"
                  value={analyticsData.aiUsage.completions.toLocaleString()}
                  detail={
                    Object.entries(analyticsData.aiUsage.features)
                      .map(([feature, count]) => `${feature}: ${count}`)
                      .join(" · ") || "No completed AI usage"
                  }
                />
                <MetricCard
                  label="Input tokens"
                  value={analyticsData.aiUsage.inputTokens.toLocaleString()}
                  detail={`${analyticsData.aiUsage.cachedInputTokens.toLocaleString()} cached`}
                />
                <MetricCard
                  label="Output tokens"
                  value={analyticsData.aiUsage.outputTokens.toLocaleString()}
                  detail={analyticsData.range}
                />
                <MetricCard
                  label="AI usage cost"
                  value={
                    analyticsData.aiUsage.pricedCompletions > 0
                      ? new Intl.NumberFormat("en-CA", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 4,
                        }).format(analyticsData.aiUsage.estimatedCostUsd)
                      : "Pricing required"
                  }
                  detail="Estimated from real token usage and configured rates"
                />
              </div>
              {!analyticsData.aiUsage.pricingComplete &&
                analyticsData.aiUsage.completions > 0 && (
                  <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    Some AI completions have no configured token rates. Their
                    real token counts are shown, but no cost is invented.
                  </p>
                )}
              {analyticsData.aiUsage.truncated && (
                <p className="mt-3 text-xs text-slate-500">
                  AI usage is limited to the 1,000 newest completion records in
                  this period.
                </p>
              )}
            </section>

            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-slate-900">
                Google connection readiness
              </h2>
              <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-700">
                    Search property
                  </dt>
                  <dd className="text-slate-600">
                    {analyticsData.integrations.searchConsole.propertyUrl}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">Sitemap</dt>
                  <dd className="text-slate-600">
                    {analyticsData.integrations.searchConsole.sitemapUrl}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">
                    Service account
                  </dt>
                  <dd className="text-slate-600">
                    {analyticsData.integrations.searchConsole
                      .credentialsConfigured
                      ? "Configured"
                      : "Not configured"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">
                    Google properties
                  </dt>
                  <dd className="text-slate-600">
                    Search Console{" "}
                    {analyticsData.integrations.searchConsole.propertyConfigured
                      ? "configured"
                      : "missing"}{" "}
                    · Analytics{" "}
                    {analyticsData.integrations.googleAnalytics
                      .propertyConfigured
                      ? "configured"
                      : "missing"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-700">
                    Website tag mode
                  </dt>
                  <dd className="text-slate-600">
                    {analyticsData.integrations.googleAnalytics.tagMode ===
                    "direct"
                      ? "Direct GA4 tag; duplicate GTM loading is suppressed"
                      : analyticsData.integrations.googleAnalytics.tagMode ===
                          "tag-manager"
                        ? "Google Tag Manager"
                        : "No GA4 website tag configured"}
                  </dd>
                </div>
              </dl>
              {analyticsData.integrations.searchConsole.error && (
                <p
                  role="alert"
                  className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-amber-900"
                >
                  Search Console:{" "}
                  {analyticsData.integrations.searchConsole.error}
                </p>
              )}
              {analyticsData.integrations.googleAnalytics.error && (
                <p
                  role="alert"
                  className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-amber-900"
                >
                  Google Analytics:{" "}
                  {analyticsData.integrations.googleAnalytics.error}
                </p>
              )}
              <p className="mt-4 text-sm text-slate-600">
                Configuration status is reported without exposing tokens or
                measurement IDs. API requests are read-only and run only when
                the service account and property identifiers are configured.
              </p>
            </section>

            {(analyticsData.integrations.googleAnalytics.metricsConnected ||
              analyticsData.integrations.searchConsole.metricsConnected) && (
              <section aria-label="Google metrics" className="mb-8">
                <h2 className="mb-4 text-xl font-bold text-slate-900">
                  Google metrics
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {analyticsData.integrations.googleAnalytics
                    .metricsConnected && (
                    <>
                      <MetricCard
                        label="Website users"
                        value={analyticsData.integrations.googleAnalytics.metrics.activeUsers.toLocaleString()}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Sessions"
                        value={analyticsData.integrations.googleAnalytics.metrics.sessions.toLocaleString()}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Page views"
                        value={analyticsData.integrations.googleAnalytics.metrics.pageViews.toLocaleString()}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Conversions"
                        value={analyticsData.integrations.googleAnalytics.metrics.conversions.toLocaleString()}
                        detail="GA4 key events"
                      />
                    </>
                  )}
                  {analyticsData.integrations.searchConsole
                    .metricsConnected && (
                    <>
                      <MetricCard
                        label="Search clicks"
                        value={analyticsData.integrations.searchConsole.metrics.clicks.toLocaleString()}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Search impressions"
                        value={analyticsData.integrations.searchConsole.metrics.impressions.toLocaleString()}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Search CTR"
                        value={`${(analyticsData.integrations.searchConsole.metrics.ctr * 100).toFixed(1)}%`}
                        detail={analyticsData.range}
                      />
                      <MetricCard
                        label="Average position"
                        value={analyticsData.integrations.searchConsole.metrics.position.toFixed(
                          1,
                        )}
                        detail={analyticsData.range}
                      />
                    </>
                  )}
                </div>
              </section>
            )}

            {analyticsData.integrations.searchConsole.metricsConnected &&
              analyticsData.integrations.searchConsole.metrics.queries.length >
                0 && (
                <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
                  <h2 className="text-xl font-bold text-slate-900">
                    Search queries
                  </h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-slate-600">
                          <th className="py-2 pr-4">Query</th>
                          <th className="py-2 pr-4">Clicks</th>
                          <th className="py-2 pr-4">Impressions</th>
                          <th className="py-2 pr-4">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.integrations.searchConsole.metrics.queries.map(
                          (query) => (
                            <tr
                              key={query.query}
                              className="border-b border-slate-100"
                            >
                              <td className="py-2 pr-4 text-slate-800">
                                {query.query}
                              </td>
                              <td className="py-2 pr-4">{query.clicks}</td>
                              <td className="py-2 pr-4">{query.impressions}</td>
                              <td className="py-2 pr-4">
                                {query.position.toFixed(1)}
                              </td>
                            </tr>
                          ),
                        )}

                        {analyticsData.integrations.googleAnalytics
                          .metricsConnected && (
                          <section
                            aria-label="Google Analytics detail"
                            className="mb-8 grid gap-6 xl:grid-cols-3"
                          >
                            <AnalyticsDimensionTable
                              title="Traffic sources"
                              dimensionLabel="Source / medium"
                              rows={analyticsData.integrations.googleAnalytics.metrics.trafficSources.map(
                                (row) => ({
                                  label: row.sourceMedium,
                                  primary: row.sessions,
                                  secondary: row.activeUsers,
                                  conversions: row.conversions,
                                }),
                              )}
                              primaryLabel="Sessions"
                              secondaryLabel="Users"
                            />
                            <AnalyticsDimensionTable
                              title="Top landing pages"
                              dimensionLabel="Landing page"
                              rows={analyticsData.integrations.googleAnalytics.metrics.landingPages.map(
                                (row) => ({
                                  label: row.path,
                                  primary: row.sessions,
                                  secondary: row.activeUsers,
                                  conversions: row.conversions,
                                }),
                              )}
                              primaryLabel="Sessions"
                              secondaryLabel="Users"
                            />
                            <AnalyticsDimensionTable
                              title="Blog performance"
                              dimensionLabel="Blog page"
                              rows={analyticsData.integrations.googleAnalytics.metrics.blogPages.map(
                                (row) => ({
                                  label: row.path,
                                  primary: row.pageViews,
                                  secondary: row.activeUsers,
                                  conversions: row.conversions,
                                }),
                              )}
                              primaryLabel="Views"
                              secondaryLabel="Users"
                            />
                          </section>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Stored event breakdown
                </h2>
                {Object.keys(analyticsData.eventCounts).length === 0 ? (
                  <p className="mt-4 text-slate-600">
                    No stored events in this period.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {Object.entries(analyticsData.eventCounts)
                      .sort((left, right) => right[1] - left[1])
                      .map(([event, count]) => (
                        <div
                          key={event}
                          className="flex justify-between gap-4 border-b border-slate-100 pb-2"
                        >
                          <span className="capitalize text-slate-700">
                            {eventLabel(event)}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {count}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  Recent stored activity
                </h2>
                {analyticsData.recentActivity.length === 0 ? (
                  <p className="mt-4 text-slate-600">
                    No stored activity in this period.
                  </p>
                ) : (
                  <div className="mt-4 space-y-4">
                    {analyticsData.recentActivity.map((event) => (
                      <article
                        key={event.id}
                        className="border-l-2 border-[#800020] pl-4"
                      >
                        <p className="font-medium capitalize text-slate-900">
                          {eventLabel(event.event)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(event.timestamp).toLocaleString("en-CA")}
                          {event.identifiedUser ? " • identified user" : ""}
                        </p>
                        {Object.keys(event.properties).length > 0 && (
                          <p className="mt-1 text-xs text-slate-600">
                            {Object.entries(event.properties)
                              .slice(0, 3)
                              .map(
                                ([key, value]) =>
                                  `${key}: ${String(value).slice(0, 40)}`,
                              )
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
              Database snapshot generated{" "}
              {new Date(analyticsData.generatedAt).toLocaleString("en-CA")}.
              {analyticsData.truncated
                ? " Results are limited to the 500 newest events."
                : ""}
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

function AnalyticsDimensionTable({
  title,
  dimensionLabel,
  rows,
  primaryLabel,
  secondaryLabel,
}: {
  title: string;
  dimensionLabel: string;
  rows: Array<{
    label: string;
    primary: number;
    secondary: number;
    conversions: number;
  }>;
  primaryLabel: string;
  secondaryLabel: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="text-lg font-bold text-slate-900">{title}</h2>
      {rows.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">
          No Google Analytics rows in this period.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-600">
                <th className="py-2 pr-3">{dimensionLabel}</th>
                <th className="py-2 pr-3">{primaryLabel}</th>
                <th className="py-2 pr-3">{secondaryLabel}</th>
                <th className="py-2">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-slate-100 align-top"
                >
                  <td className="max-w-48 break-words py-2 pr-3 text-slate-800">
                    {row.label}
                  </td>
                  <td className="py-2 pr-3">{row.primary}</td>
                  <td className="py-2 pr-3">{row.secondary}</td>
                  <td className="py-2">{row.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
