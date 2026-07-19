import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isFoundingOfferEnabled } from "@/lib/founding-contractor-config";
import { isUnlimitedTestContractor } from "@/lib/god-access";
import { sendContractorOnboardingReminderEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const WELCOME_CAMPAIGN = "contractor_onboarding_offer";
const REMINDER_CAMPAIGN = "contractor_onboarding_offer_reminder";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isFoundingOfferEnabled()) {
      return NextResponse.json({ success: true, sent: 0, skipped: 0, message: "Founding offer disabled" });
    }

    const reminderDueBefore = new Date(Date.now() - 23 * 60 * 60 * 1000);
    const welcomeEvents = await prisma.emailEvent.findMany({
      where: {
        type: WELCOME_CAMPAIGN,
        status: "sent",
        createdAt: { lte: reminderDueBefore },
      },
      select: { userId: true, to: true, createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const event of welcomeEvents) {
      if (!event.userId) {
        skipped++;
        continue;
      }

      const contractor = await prisma.user.findUnique({
        where: { id: event.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
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

      if (!contractor || contractor.role !== "contractor" || isUnlimitedTestContractor(contractor.email)) {
        skipped++;
        continue;
      }

      if (["active", "trialing"].includes(contractor.subscriptionStatus || "") || contractor.subscriptions.length > 0) {
        skipped++;
        continue;
      }

      const alreadyReminded = await prisma.emailEvent.findFirst({
        where: {
          type: REMINDER_CAMPAIGN,
          status: "sent",
          OR: [{ userId: contractor.id }, { to: contractor.email }],
        },
        select: { id: true },
      });

      if (alreadyReminded) {
        skipped++;
        continue;
      }

      const result = await sendContractorOnboardingReminderEmail(contractor);
      if (result.success) sent++;
      else if ((result as any).skipped) skipped++;
      else failed++;
    }

    return NextResponse.json({ success: true, sent, skipped, failed });
  } catch (error) {
    console.error("[CRON][contractor-onboarding-reminder] Error:", error);
    return NextResponse.json({ error: "Contractor onboarding reminder failed" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}