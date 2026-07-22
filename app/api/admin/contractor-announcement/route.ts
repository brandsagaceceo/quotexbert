import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContractorAnnouncementEmail } from "@/lib/email";
import { isUnlimitedTestContractor } from "@/lib/god-access";

export const dynamic = "force-dynamic";
// Allow up to 60s — 27 contractors × ~1s per Resend call
export const maxDuration = 60;

/**
 * POST /api/admin/contractor-announcement
 *
 * Sends the general contractor announcement to all active contractors.
 * Paid contractors receive the membership-active block.
 * Unpaid contractors receive the upgrade CTA block.
 *
 * Requires Authorization: Bearer <CRON_SECRET> header.
 *
 * Supports dry-run mode: pass { dryRun: true } in the JSON body
 * to get counts without sending any emails.
 *
 * Does NOT modify any sending logic, database queries, or notification
 * routes used for new-job alerts.
 */
export async function POST(request: NextRequest) {
  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const dryRun = Boolean(body?.dryRun);

    // ── Query: all active contractors who have not explicitly opted out ───────
    const contractors = await prisma.user.findMany({
      where: {
        role: "contractor",
        isActive: true,
        notifyJobEmail: { not: false }, // respects general opt-out; notifyMarketingEmail defaults to false so unusable as filter
      },
      select: {
        id: true,
        email: true,
        name: true,
        subscriptionStatus: true,
        subscriptions: {
          where: {
            status: { in: ["active", "trialing"] },
            monthlyPrice: { gt: 0 },
            OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gte: new Date() } }],
          },
          select: { id: true },
          take: 1,
        },
      },
    });

    // ── Deduplicate by lowercase email ────────────────────────────────────────
    const seen = new Set<string>();
    const unique = contractors.filter((c) => {
      if (!c.email) return false;
      const k = c.email.toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    let sent = 0;
    let skippedPaid = 0;
    let skippedUnpaid = 0;
    let skippedDedup = 0;
    let skippedInternal = 0;
    let failed = 0;

    for (const contractor of unique) {
      if (isUnlimitedTestContractor(contractor.email)) {
        skippedInternal++;
        continue;
      }

      const isPaid =
        ["active", "trialing"].includes(contractor.subscriptionStatus || "") ||
        contractor.subscriptions.length > 0;

      if (dryRun) {
        // Count only — never send
        if (isPaid) skippedPaid++;
        else skippedUnpaid++;
        continue;
      }

      const result = await sendContractorAnnouncementEmail({
        id: contractor.id,
        email: contractor.email,
        name: contractor.name,
        isPaid,
      });

      if (result.success) {
        sent++;
      } else if ((result as any).skipped) {
        if ((result as any).reason === "already_sent") skippedDedup++;
        else if ((result as any).reason === "internal_bypass_account") skippedInternal++;
        else if (isPaid) skippedPaid++;
        else skippedUnpaid++;
      } else {
        failed++;
      }
    }

    if (dryRun) {
      return NextResponse.json({
        dryRun: true,
        eligible: unique.length - skippedInternal,
        paid: skippedPaid,
        unpaid: skippedUnpaid,
        internal: skippedInternal,
        message: "No emails sent — dry run only",
      });
    }

    return NextResponse.json({
      success: true,
      sent,
      skippedDedup,
      skippedInternal,
      failed,
      total: unique.length,
    });
  } catch (error) {
    console.error("[ADMIN][contractor-announcement] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
