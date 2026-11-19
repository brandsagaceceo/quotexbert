import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { fetchGoogleAdminMetrics } from "@/lib/google-admin-metrics";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS || "brandsagaceo@gmail.com,quotexbert@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const RANGE_DAYS = {
  "1d": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
} as const;

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const caller = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!caller || !ADMIN_EMAILS.includes(caller.email.trim().toLowerCase())) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const range = request.nextUrl.searchParams.get("range") || "7d";
    if (!Object.prototype.hasOwnProperty.call(RANGE_DAYS, range)) {
      return NextResponse.json(
        { error: "Invalid analytics range" },
        { status: 400 },
      );
    }
    const startDate = new Date(
      Date.now() -
        RANGE_DAYS[range as keyof typeof RANGE_DAYS] * 24 * 60 * 60 * 1000,
    );
    const [rows, google] = await Promise.all([
      prisma.analytics.findMany({
        where: { timestamp: { gte: startDate } },
        orderBy: [{ timestamp: "desc" }, { id: "desc" }],
        take: 500,
        select: {
          id: true,
          eventName: true,
          eventData: true,
          timestamp: true,
          userId: true,
        },
      }),
      fetchGoogleAdminMetrics(RANGE_DAYS[range as keyof typeof RANGE_DAYS]),
    ]);

    const eventCounts: Record<string, number> = {};
    const identifiedUsers = new Set<string>();
    const events = rows.map((row) => {
      eventCounts[row.eventName] = (eventCounts[row.eventName] || 0) + 1;
      if (row.userId) identifiedUsers.add(row.userId);
      return {
        id: row.id,
        event: row.eventName,
        timestamp: row.timestamp.toISOString(),
        properties: isRecord(row.eventData) ? row.eventData : {},
        identifiedUser: Boolean(row.userId),
      };
    });
    const site = new URL(
      process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com",
    );

    return NextResponse.json({
      range,
      source: "database",
      generatedAt: new Date().toISOString(),
      totalEvents: rows.length,
      identifiedUsers: identifiedUsers.size,
      eventCounts,
      recentActivity: events.slice(0, 10),
      truncated: rows.length === 500,
      integrations: {
        googleAnalytics: {
          tagConfigured: Boolean(
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim(),
          ),
          propertyConfigured: google.status.analyticsPropertyConfigured,
          credentialsConfigured: google.status.serviceAccountConfigured,
          metricsConnected: google.analytics.connected,
          error: google.analytics.error,
          metrics: {
            activeUsers: google.analytics.activeUsers,
            sessions: google.analytics.sessions,
            pageViews: google.analytics.pageViews,
            conversions: google.analytics.conversions,
          },
        },
        searchConsole: {
          verificationTokenConfigured: Boolean(
            process.env.GOOGLE_SITE_VERIFICATION?.trim(),
          ),
          propertyConfigured: google.status.searchConsolePropertyConfigured,
          credentialsConfigured: google.status.serviceAccountConfigured,
          metricsConnected: google.searchConsole.connected,
          error: google.searchConsole.error,
          propertyUrl: site.origin,
          sitemapUrl: new URL("/sitemap.xml", site).href,
          metrics: {
            clicks: google.searchConsole.clicks,
            impressions: google.searchConsole.impressions,
            ctr: google.searchConsole.ctr,
            position: google.searchConsole.position,
            queries: google.searchConsole.queries,
          },
        },
      },
    });
  } catch (error) {
    console.error(
      "[ADMIN_ANALYTICS] Failed to load stored analytics",
      error instanceof Error ? error.name : "Error",
    );
    return NextResponse.json(
      { error: "Failed to fetch stored analytics" },
      { status: 500 },
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
