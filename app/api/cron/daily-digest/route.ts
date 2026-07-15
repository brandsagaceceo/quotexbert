import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isGodUser } from "@/lib/god-access";
import { FOUNDING_CONTRACTOR_CONFIG } from "@/lib/founding-contractor-config";
import { sendContractorDigestEmail, sendHomeownerDigestEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// Single shared digest job — ONE contractor digest + ONE homeowner digest.
// Reuses the existing CRON_SECRET bearer-token auth pattern from
// app/api/cron/contractor-followup/route.ts. Intended to be invoked once
// daily by Vercel Cron (see vercel.json). Cadence (daily vs weekly vs off)
// is governed per-user by User.digestFrequency + last*DigestAt, so a single
// daily invocation safely serves both cadences without a second scheduler.
const DAY_MS = 24 * 60 * 60 * 1000;
const DAILY_TOLERANCE_MS = 20 * 60 * 60 * 1000; // ~20h so a fixed daily cron time doesn't skip a day
const WEEKLY_TOLERANCE_MS = 7 * DAY_MS - 2 * 60 * 60 * 1000; // ~6d22h

function isDue(lastSentAt: Date | null, frequency: string): boolean {
  if (frequency === "off") return false;
  const tolerance = frequency === "weekly" ? WEEKLY_TOLERANCE_MS : DAILY_TOLERANCE_MS;
  if (!lastSentAt) return true;
  return Date.now() - lastSentAt.getTime() >= tolerance;
}

function sinceWindow(lastSentAt: Date | null): Date {
  // First-ever digest for a user: look back 7 days so it isn't empty on day one.
  return lastSentAt ?? new Date(Date.now() - 7 * DAY_MS);
}

async function runContractorDigests() {
  const contractors = await prisma.user.findMany({
    where: { role: "contractor", isActive: true, digestFrequency: { not: "off" } },
    include: {
      contractorProfile: {
        include: { portfolio: { select: { id: true }, take: 1 } },
      },
      subscriptions: { where: { canClaimLeads: true }, select: { category: true } },
    },
  });

  let sent = 0;
  let skippedEmpty = 0;
  let skippedNotDue = 0;
  let failed = 0;

  for (const contractor of contractors) {
    if (!isDue(contractor.lastContractorDigestAt, contractor.digestFrequency)) {
      skippedNotDue++;
      continue;
    }

    try {
      const since = sinceWindow(contractor.lastContractorDigestAt);
      const isGod = isGodUser(contractor.email || "");
      const categories = contractor.subscriptions.map((s) => s.category);
      const contractorCity = (contractor.contractorProfile?.city || "").toLowerCase().trim();

      const candidateJobs = await prisma.lead.findMany({
        where: {
          status: { in: ["open", "reviewing"] },
          published: true,
          isSeeded: false,
          createdAt: { gte: since },
          ...(isGod || categories.length === 0 ? {} : { category: { in: categories } }),
        },
        orderBy: { createdAt: "desc" },
        take: 25,
        select: { id: true, title: true, category: true, zipCode: true, budget: true },
      });

      // Mirror the same partial city-match heuristic used by
      // NotificationService.notifyAllContractors (lib/notifications.ts) —
      // no location data on either side means "don't filter it out".
      const matchedJobs = candidateJobs
        .filter((job) => {
          if (!contractorCity) return true;
          const jobCity = (job.zipCode || "").toLowerCase().trim();
          if (!jobCity) return true;
          return jobCity.includes(contractorCity) || contractorCity.includes(jobCity);
        })
        .slice(0, 10)
        .map((j) => ({ id: j.id, title: j.title, category: j.category, city: j.zipCode || undefined, budget: j.budget || undefined }));

      const unreadMessageCount = await prisma.message.count({
        where: { toUserId: contractor.id, readAt: null },
      });

      // Bounded lookup: latest message per thread where this contractor is the assigned contractor.
      const contractorThreads = await prisma.thread.findMany({
        where: { lead: { contractorId: contractor.id } },
        include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        take: 50,
      });
      const awaitingReplyCount = contractorThreads.filter(
        (t) => t.messages[0] && t.messages[0].fromUserId !== contractor.id
      ).length;

      const profile = contractor.contractorProfile;
      const profileIncomplete = !!profile && (!profile.bio || !profile.profilePhoto || profile.portfolio.length === 0);

      const hasActivity = matchedJobs.length > 0 || unreadMessageCount > 0 || awaitingReplyCount > 0;

      if (hasActivity) {
        const result = await sendContractorDigestEmail({
          contractor: { id: contractor.id, email: contractor.email, name: contractor.name },
          matchedJobs,
          unreadMessageCount,
          awaitingReplyCount,
          profileIncomplete,
          foundingSpotsRemaining: FOUNDING_CONTRACTOR_CONFIG.spotsRemaining > 0 ? FOUNDING_CONTRACTOR_CONFIG.spotsRemaining : null,
        });
        if (result.success) sent++;
        else failed++;
      } else {
        skippedEmpty++;
      }

      // Advance the watermark regardless of send/skip so the next run's
      // "since" window is correctly bounded and we don't re-scan old activity.
      await prisma.user.update({
        where: { id: contractor.id },
        data: { lastContractorDigestAt: new Date() },
      });
    } catch (err) {
      failed++;
      console.error(`[CRON][daily-digest] Contractor digest failed for ${contractor.id}:`, err);
    }
  }

  return { role: "contractor", total: contractors.length, sent, skippedEmpty, skippedNotDue, failed };
}

async function runHomeownerDigests() {
  const homeowners = await prisma.user.findMany({
    where: { role: "homeowner", isActive: true, digestFrequency: { not: "off" } },
  });

  let sent = 0;
  let skippedEmpty = 0;
  let skippedNotDue = 0;
  let failed = 0;

  for (const homeowner of homeowners) {
    if (!isDue(homeowner.lastHomeownerDigestAt, homeowner.digestFrequency)) {
      skippedNotDue++;
      continue;
    }

    try {
      const since = sinceWindow(homeowner.lastHomeownerDigestAt);

      // Threads are strictly homeowner<->contractor per lead, so any message
      // delivered TO the homeowner is inherently FROM their contractor.
      const newContractorResponses = await prisma.message.count({
        where: { toUserId: homeowner.id, createdAt: { gte: since } },
      });
      const unreadMessageCount = await prisma.message.count({
        where: { toUserId: homeowner.id, readAt: null },
      });
      const savedEstimateCount = await prisma.aIEstimate.count({
        where: { homeownerId: homeowner.id, status: "saved" },
      });
      const openJobsAwaitingContractor = await prisma.lead.count({
        where: { homeownerId: homeowner.id, status: "open", contractorId: null },
      });

      const hasActivity = newContractorResponses > 0 || unreadMessageCount > 0 || openJobsAwaitingContractor > 0;

      if (hasActivity) {
        const result = await sendHomeownerDigestEmail({
          homeowner: { id: homeowner.id, email: homeowner.email, name: homeowner.name },
          newContractorResponses,
          unreadMessageCount,
          savedEstimateCount,
          openJobsAwaitingContractor,
        });
        if (result.success) sent++;
        else failed++;
      } else {
        skippedEmpty++;
      }

      await prisma.user.update({
        where: { id: homeowner.id },
        data: { lastHomeownerDigestAt: new Date() },
      });
    } catch (err) {
      failed++;
      console.error(`[CRON][daily-digest] Homeowner digest failed for ${homeowner.id}:`, err);
    }
  }

  return { role: "homeowner", total: homeowners.length, sent, skippedEmpty, skippedNotDue, failed };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [contractorResult, homeownerResult] = await Promise.all([
      runContractorDigests(),
      runHomeownerDigests(),
    ]);

    console.log("[CRON][daily-digest] Complete:", { contractorResult, homeownerResult });

    return NextResponse.json({
      success: true,
      results: [contractorResult, homeownerResult],
    });
  } catch (error) {
    console.error("[CRON][daily-digest] Fatal error:", error);
    return NextResponse.json({ error: "Digest run failed" }, { status: 500 });
  }
}

// Allow manual trigger via GET for testing (matches app/api/cron/contractor-followup pattern)
export async function GET(request: NextRequest) {
  return POST(request);
}
