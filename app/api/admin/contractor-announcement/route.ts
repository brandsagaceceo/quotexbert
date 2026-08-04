import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  buildContractorAccountWelcomeHtml,
  CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT,
  CONTRACTOR_ACCOUNT_WELCOME_PREHEADER,
  CONTRACTOR_ACCOUNT_WELCOME_SUBJECT,
  buildContractorJobBoardOfferHtml,
  CONTRACTOR_JOB_BOARD_OFFER_ALTERNATIVE_SUBJECT,
  CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN,
  CONTRACTOR_JOB_BOARD_OFFER_PREHEADER,
  CONTRACTOR_JOB_BOARD_OFFER_SUBJECT,
  planContractorJobBoardOfferRecipients,
  sendContractorAccountWelcomeTestEmail,
  sendContractorAnnouncementEmail,
  sendContractorAnnouncementTestEmail,
  sendContractorJobBoardOfferTestEmail,
} from "@/lib/email";
import { isFoundingOfferEnabled } from "@/lib/founding-contractor-config";
import { isUnlimitedTestContractor } from "@/lib/god-access";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const TEST_SEND_EMAILS = new Set([
  'brandsagaceo@gmail.com',
  'quotexbert@gmail.com',
]);

async function authorizeAdmin() {
  const authResult = await auth();
  if (!authResult.userId) {
    return { error: 'Unauthorized', status: 401 as const };
  }

  const caller = await prisma.user.findFirst({
    where: { OR: [{ id: authResult.userId }, { clerkUserId: authResult.userId }] },
    select: { email: true },
  });

  if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
    return { error: 'Admin access required', status: 403 as const };
  }

  return { userId: authResult.userId, adminEmail: caller.email };
}

async function loadCampaignState() {
  const [contractors, alreadySentRecords, availableJobCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'contractor' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        notifyMarketingEmail: true,
        subscriptionStatus: true,
        subscriptions: {
          where: {
            status: { in: ['active', 'trialing'] },
            monthlyPrice: { gt: 0 },
            OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gte: new Date() } }],
          },
          select: {
            status: true,
            monthlyPrice: true,
            currentPeriodEnd: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.emailEvent.findMany({
      where: { type: CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN, status: 'sent' },
      select: { userId: true, to: true },
    }),
    prisma.lead.count({
      where: { status: 'open', published: true, isSeeded: false },
    }),
  ]);

  const alreadySentRecipientKeys = new Set<string>();
  for (const record of alreadySentRecords) {
    if (record.userId) alreadySentRecipientKeys.add(record.userId.toLowerCase());
    if (record.to) alreadySentRecipientKeys.add(record.to.toLowerCase());
  }

  const plan = planContractorJobBoardOfferRecipients(contractors as any, alreadySentRecipientKeys);

  return { contractors, alreadySentRecords, availableJobCount, plan };
}

function buildPreviewHtml(summary: Awaited<ReturnType<typeof loadCampaignState>>) {
  const firstRecipient = summary.plan.recipients[0];
  const previewHtml = buildContractorJobBoardOfferHtml({
    firstName: firstRecipient?.name?.split(' ')[0] || 'there',
    availableJobCount: summary.availableJobCount,
    unsubscribeUserId: firstRecipient?.id || 'preview',
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN} preview</title>
  <style>
    body { margin: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #111827; }
    .wrap { max-width: 1180px; margin: 0 auto; padding: 32px 16px 64px; }
    .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06); }
    .header { background: linear-gradient(135deg, #800020 0%, #9f1239 60%, #ea580c 100%); color: #fff; padding: 24px 28px; }
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); padding: 24px 28px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 18px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: .08em; color: #64748b; font-weight: 800; margin-bottom: 8px; }
    .value { font-size: 28px; font-weight: 900; color: #111827; }
    .note { margin: 0 28px 24px; padding: 16px 18px; border-radius: 14px; background: #fff7ed; border: 1px solid #fed7aa; color: #9a3412; }
    .email-wrap { padding: 0 28px 28px; }
    .email-frame { width: 100%; min-height: 1400px; border: 1px solid #e2e8f0; border-radius: 16px; background: white; }
    .footer { padding: 0 28px 28px; color: #64748b; font-size: 13px; }
    code { background: #e2e8f0; padding: 2px 6px; border-radius: 6px; }
    @media (max-width: 720px) {
      .wrap { padding: 16px 10px 40px; }
      .header, .grid, .note, .email-wrap, .footer { padding-left: 16px; padding-right: 16px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="panel">
      <div class="header">
        <div style="font-size: 30px; font-weight: 900; letter-spacing: -0.03em;">QuoteXbert campaign preview</div>
        <div style="margin-top: 6px; font-size: 14px; color: #fce7f3;">${CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN}</div>
      </div>
      <div class="grid">
        <div class="card"><div class="label">Eligible recipients</div><div class="value">${summary.plan.counts.eligible}</div></div>
        <div class="card"><div class="label">Already sent</div><div class="value">${summary.alreadySentRecords.length}</div></div>
        <div class="card"><div class="label">Live job count used</div><div class="value">${summary.availableJobCount}</div></div>
        <div class="card"><div class="label">$0.99 offer verified</div><div class="value">${isFoundingOfferEnabled() ? 'Yes' : 'No'}</div></div>
      </div>
      <div class="note">Google sign-up method is not reliably stored in the current database or Clerk metadata, so this campaign targets all eligible unpaid contractors instead of guessing by provider.</div>
      <div class="grid" style="padding-top: 0;">
        <div class="card"><div class="label">Excluded - inactive</div><div class="value">${summary.plan.counts.inactive}</div></div>
        <div class="card"><div class="label">Excluded - paid</div><div class="value">${summary.plan.counts.activePaidSubscription}</div></div>
        <div class="card"><div class="label">Excluded - opted out</div><div class="value">${summary.plan.counts.marketingOptOut}</div></div>
        <div class="card"><div class="label">Excluded - duplicates</div><div class="value">${summary.plan.counts.duplicateCampaignRecipient}</div></div>
      </div>
      <div class="email-wrap">
        <iframe class="email-frame" title="${CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN} email preview" src="data:text/html;charset=utf-8,${encodeURIComponent(previewHtml)}"></iframe>
      </div>
      <div class="footer">
        <div><code>${CONTRACTOR_JOB_BOARD_OFFER_ALTERNATIVE_SUBJECT}</code></div>
        <div><code>${CONTRACTOR_JOB_BOARD_OFFER_PREHEADER}</code></div>
        <div><code>${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/jobs</code></div>
        <div><code>${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/subscriptions</code></div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildContractorWelcomePreviewHtml(internalUser: { id: string; name: string | null }) {
  const previewHtml = buildContractorAccountWelcomeHtml({
    firstName: internalUser.name?.split(' ')[0] || 'there',
    unsubscribeUserId: internalUser.id,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT} preview</title>
  <style>
    body { margin: 0; background: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #111827; }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 28px 16px 64px; }
    .panel { background: #fff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06); }
    .header { background: linear-gradient(135deg, #800020 0%, #9f1239 60%, #ea580c 100%); color: #fff; padding: 24px 28px; }
    .meta { padding: 18px 28px 0; color: #475569; font-size: 14px; }
    .meta code { background: #e2e8f0; padding: 2px 6px; border-radius: 6px; }
    .email-wrap { padding: 18px 28px 28px; }
    .email-frame { width: 100%; min-height: 1250px; border: 1px solid #e2e8f0; border-radius: 16px; background: #fff; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="panel">
      <div class="header">
        <div style="font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">QuoteXbert contractor welcome preview</div>
        <div style="margin-top: 6px; font-size: 14px; color: #fde7f3;">${CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT}</div>
      </div>
      <div class="meta">
        <div><code>${CONTRACTOR_ACCOUNT_WELCOME_SUBJECT}</code></div>
        <div style="margin-top:6px;"><code>${CONTRACTOR_ACCOUNT_WELCOME_PREHEADER}</code></div>
        <div style="margin-top:6px;"><code>${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/jobs</code></div>
        <div style="margin-top:6px;"><code>${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/profile/edit</code></div>
      </div>
      <div class="email-wrap">
        <iframe class="email-frame" title="${CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT} preview" src="data:text/html;charset=utf-8,${encodeURIComponent(previewHtml)}"></iframe>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function runLegacyAnnouncement(body: any) {
  const dryRun = Boolean(body?.dryRun);

  if (body?.testEmail) {
    const testEmail = String(body.testEmail).trim();
    const isPaid = Boolean(body?.isPaid);
    const result = await sendContractorAnnouncementTestEmail({ testEmail, isPaid });
    if (result.success) {
      return NextResponse.json({
        testSent: true,
        to: testEmail,
        isPaid,
        message: "[TEST] email sent — no campaign state modified",
      });
    }
    return NextResponse.json(
      { error: "Test email failed", detail: String((result as any).error ?? "unknown") },
      { status: 500 }
    );
  }

  const contractors = await prisma.user.findMany({
    where: {
      role: "contractor",
      isActive: true,
      notifyJobEmail: { not: false },
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

  const seen = new Set<string>();
  const unique = contractors.filter((c) => {
    if (!c.email) return false;
    const key = c.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
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
}

async function runJobBoardOfferVariant(request: NextRequest, body: any) {
  const summary = await loadCampaignState();
  const dryRun = Boolean(body?.dryRun || body?.mode === 'dry-run');

  if (request.method === 'GET' || body?.preview === true || new URL(request.url).searchParams.get('preview') === 'true') {
    return new NextResponse(buildPreviewHtml(summary), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

  if (body?.testEmail) {
    const testEmail = String(body.testEmail).trim().toLowerCase();
    if (!TEST_SEND_EMAILS.has(testEmail)) {
      return NextResponse.json({ error: 'Test email must be one of the approved internal addresses' }, { status: 400 });
    }

    const internalUser = await prisma.user.findFirst({
      where: { email: testEmail },
      select: { id: true, name: true },
    });

    if (!internalUser) {
      return NextResponse.json({ error: 'Internal test user not found for that email' }, { status: 404 });
    }

    const result = await sendContractorJobBoardOfferTestEmail({
      testEmail,
      firstName: internalUser.name?.split(' ')[0] || testEmail.split('@')[0],
      availableJobCount: summary.availableJobCount,
      unsubscribeUserId: internalUser.id,
    });

    if (result.success) {
      return NextResponse.json({
        testSent: true,
        to: testEmail,
        campaignId: CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN,
        offerVerified: isFoundingOfferEnabled(),
        liveJobCountUsed: true,
        liveJobCount: summary.availableJobCount,
        message: "[TEST] email sent — no campaign state modified",
      });
    }

    return NextResponse.json(
      { error: "Test email failed", detail: String((result as any).error ?? "unknown") },
      { status: 500 }
    );
  }

  if (body?.mode === 'live') {
    return NextResponse.json({ error: 'Live send is disabled for this variant' }, { status: 403 });
  }

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      campaignId: CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN,
      subject: CONTRACTOR_JOB_BOARD_OFFER_SUBJECT,
      alternativeSubject: CONTRACTOR_JOB_BOARD_OFFER_ALTERNATIVE_SUBJECT,
      preheader: CONTRACTOR_JOB_BOARD_OFFER_PREHEADER,
      offerVerified: isFoundingOfferEnabled(),
      liveJobCountUsed: true,
      liveJobCount: summary.availableJobCount,
      eligibleRecipientCount: summary.plan.counts.eligible,
      alreadySentRecipientCount: summary.alreadySentRecords.length,
      excludedCounts: summary.plan.counts,
      message: "No emails sent — dry run only",
    });
  }

  return NextResponse.json({
    success: true,
    campaignId: CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN,
    subject: CONTRACTOR_JOB_BOARD_OFFER_SUBJECT,
    alternativeSubject: CONTRACTOR_JOB_BOARD_OFFER_ALTERNATIVE_SUBJECT,
    preheader: CONTRACTOR_JOB_BOARD_OFFER_PREHEADER,
    offerVerified: isFoundingOfferEnabled(),
    liveJobCountUsed: true,
    liveJobCount: summary.availableJobCount,
    eligibleRecipientCount: summary.plan.counts.eligible,
    alreadySentRecipientCount: summary.alreadySentRecords.length,
    excludedCounts: summary.plan.counts,
    message: 'Preview/test mode only — live send not run',
  });
}

async function runContractorWelcomePhase1Variant(request: NextRequest, body: any) {
  const dryRun = Boolean(body?.dryRun || body?.mode === 'dry-run');
  const internalUser = await prisma.user.findFirst({
    where: { email: { in: Array.from(TEST_SEND_EMAILS) } },
    select: { id: true, name: true },
    orderBy: { createdAt: 'asc' },
  });

  if (!internalUser) {
    return NextResponse.json({ error: 'Internal test user not found for preview/test send' }, { status: 404 });
  }

  if (request.method === 'GET' || body?.preview === true || new URL(request.url).searchParams.get('preview') === 'true') {
    return new NextResponse(buildContractorWelcomePreviewHtml(internalUser), {
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
    });
  }

  if (body?.testEmail) {
    const testEmail = String(body.testEmail).trim().toLowerCase();
    if (!TEST_SEND_EMAILS.has(testEmail)) {
      return NextResponse.json({ error: 'Test email must be one of the approved internal addresses' }, { status: 400 });
    }

    const internalRecipient = await prisma.user.findFirst({
      where: { email: testEmail },
      select: { id: true, name: true },
    });

    if (!internalRecipient) {
      return NextResponse.json({ error: 'Internal test user not found for that email' }, { status: 404 });
    }

    const result = await sendContractorAccountWelcomeTestEmail({
      testEmail,
      firstName: internalRecipient.name?.split(' ')[0] || testEmail.split('@')[0],
      unsubscribeUserId: internalRecipient.id,
    });

    if (result.success) {
      return NextResponse.json({
        testSent: true,
        to: testEmail,
        variant: CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT,
        subject: CONTRACTOR_ACCOUNT_WELCOME_SUBJECT,
        preheader: CONTRACTOR_ACCOUNT_WELCOME_PREHEADER,
        message: '[TEST] contractor welcome email sent — no campaign state modified',
      });
    }

    return NextResponse.json(
      { error: 'Test email failed', detail: String((result as any).error ?? 'unknown') },
      { status: 500 }
    );
  }

  if (body?.mode === 'live') {
    return NextResponse.json({ error: 'Live send is disabled for this variant' }, { status: 403 });
  }

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      variant: CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT,
      subject: CONTRACTOR_ACCOUNT_WELCOME_SUBJECT,
      preheader: CONTRACTOR_ACCOUNT_WELCOME_PREHEADER,
      ctaJobBoard: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/jobs`,
      ctaProfile: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/profile/edit`,
      message: 'No emails sent — dry run only',
    });
  }

  return NextResponse.json({
    success: true,
    variant: CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT,
    subject: CONTRACTOR_ACCOUNT_WELCOME_SUBJECT,
    preheader: CONTRACTOR_ACCOUNT_WELCOME_PREHEADER,
    message: 'Preview/test mode only — live send not run',
  });
}

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
    const admin = await authorizeAdmin();
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const cronAuthorized = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
    if (!cronAuthorized && 'error' in admin) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const body = await request.json().catch(() => ({}));
    const variant = String(body?.variant || '').trim().toLowerCase();
    const isLegacyLiveAttempt = !variant && !Boolean(body?.dryRun) && !Boolean(body?.testEmail);

    if (isLegacyLiveAttempt && body?.confirmLive !== 'SEND_LIVE_EMAILS') {
      return NextResponse.json(
        {
          error: 'Live mode requires explicit confirmation',
          required: 'confirmLive=SEND_LIVE_EMAILS',
        },
        { status: 400 }
      );
    }

    if (variant === CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT) {
      return runContractorWelcomePhase1Variant(request, body);
    }

    if (variant === CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN) {
      return runJobBoardOfferVariant(request, body);
    }

    return runLegacyAnnouncement(body);
  } catch (error) {
    console.error("[ADMIN][contractor-announcement] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await authorizeAdmin();
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get('authorization');
    const cronAuthorized = Boolean(cronSecret && authHeader === `Bearer ${cronSecret}`);
    if (!cronAuthorized && 'error' in admin) {
      return NextResponse.json({ error: admin.error }, { status: admin.status });
    }

    const variant = String(new URL(request.url).searchParams.get('variant') || '').trim().toLowerCase();
    if (variant === CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT) {
      return runContractorWelcomePhase1Variant(request, { variant, preview: true, mode: 'dry-run' });
    }

    if (variant === CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN) {
      return runJobBoardOfferVariant(request, { variant, preview: true, mode: 'dry-run' });
    }

    return NextResponse.json({
      ok: true,
      message: 'Legacy contractor announcement route is unchanged. To preview the new offer variant, call with variant=contractor-job-board-99-cent-offer-2026.',
    });
  } catch (error) {
    console.error("[ADMIN][contractor-announcement][GET] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
