import {
  fetchGoogleAdminMetrics,
  getGoogleConnectionStatus,
} from "../lib/google-admin-metrics";

async function main() {
  if (
    process.env.VERCEL_ENV !== "preview" ||
    !process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER?.trim()
  ) {
    console.log(
      "[GOOGLE_PREVIEW] Live reporting check skipped outside a keyless Preview.",
    );
    return;
  }

  const status = getGoogleConnectionStatus();
  if (
    !status.serviceAccountConfigured ||
    !status.analyticsPropertyConfigured ||
    !status.searchConsolePropertyConfigured
  ) {
    throw new Error(
      "[GOOGLE_PREVIEW] Reporting account and both property variables are required.",
    );
  }

  const metrics = await fetchGoogleAdminMetrics(7);
  if (!metrics.analytics.connected || !metrics.searchConsole.connected) {
    throw new Error(
      [
        "[GOOGLE_PREVIEW] Live reporting verification failed.",
        `GA4: ${metrics.analytics.error || (metrics.analytics.connected ? "connected" : "not connected")}`,
        `Search Console: ${metrics.searchConsole.error || (metrics.searchConsole.connected ? "connected" : "not connected")}`,
      ].join(" "),
    );
  }

  console.log(
    "[GOOGLE_PREVIEW] " +
      JSON.stringify({
        verified: true,
        days: 7,
        ga4: {
          activeUsers: metrics.analytics.activeUsers,
          sessions: metrics.analytics.sessions,
          pageViews: metrics.analytics.pageViews,
          conversions: metrics.analytics.conversions,
        },
        searchConsole: {
          clicks: metrics.searchConsole.clicks,
          impressions: metrics.searchConsole.impressions,
          queryCount: metrics.searchConsole.queries.length,
        },
      }),
  );
}

main().catch((error: unknown) => {
  console.error(
    error instanceof Error
      ? error.message
      : "[GOOGLE_PREVIEW] Live reporting verification failed.",
  );
  process.exitCode = 1;
});
