import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Resend } from 'resend';
import { buildEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const CAMPAIGN_TYPE = 'job_board_announcement_2026_07';
const BATCH_SIZE = 25;
const BATCH_DELAY_MS = 1200; // ~50 emails/min to stay within Resend limits

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  'https://www.quotexbert.com';

const fromEmail = process.env.MAIL_FROM || 'Quotexbert <no-reply@quotexbert.com>';
const REPLY_TO = 'quotexbert@gmail.com';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildAnnouncementEmail(firstName: string): string {
  const name = firstName && firstName.trim() ? firstName.trim() : 'there';
  return buildEmail('The QuoteXbert Job Board Is Filling Up \u2014 Act Fast', [
    { type: 'tag', content: 'Job Board Update' },
    { type: 'heading', content: `Hi ${escHtml(name)}, the job board is filling up`, rawHtml: true },
    {
      type: 'text',
      content:
        'The QuoteXbert Job Board is starting to fill up with new homeowner projects.',
    },
    {
      type: 'text',
      content:
        'You already created a contractor account, so now is the time to log in, review the available jobs, and act quickly when you find a project that fits your business.',
    },
    {
      type: 'card',
      label: 'Why act now',
      rawHtml: true,
      content:
        '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">New homeowner projects are being posted</li><li style="margin-bottom:6px;">As more contractors join, competition for new jobs will increase</li><li>The best projects go to contractors who respond first</li></ul>',
    },
    {
      type: 'text',
      content:
        'Log in today to check the latest opportunities and secure work before the best projects are taken.',
    },
    { type: 'cta', content: 'View Job Board', href: `${BASE_URL}/contractor/jobs` },
    {
      type: 'text',
      content: `<span style="font-size:12px;color:#64748b;">The QuoteXbert Team &middot; <a href="${BASE_URL}/notifications" style="color:#9f1239;text-decoration:none;">Manage email preferences</a></span>`,
      rawHtml: true,
    },
  ]);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: NextRequest) {
  try {
    // Admin auth
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { email: true },
    });
    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const mode: 'dry' | 'live' = body.mode === 'live' ? 'live' : 'dry';

    // Fetch all active contractors who haven't explicitly opted out of email communications
    const contractors = await prisma.user.findMany({
      where: {
        role: 'contractor',
        isActive: true,
        notifyJobEmail: { not: false },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const recipientCount = contractors.length;

    // Check which ones already received this campaign
    const alreadySentRecords = await prisma.emailEvent.findMany({
      where: {
        type: CAMPAIGN_TYPE,
        status: 'sent',
        userId: { in: contractors.map((c) => c.id) },
      },
      select: { userId: true },
    });
    const alreadySentIds = new Set(alreadySentRecords.map((r) => r.userId));

    const toSend = contractors.filter((c) => !alreadySentIds.has(c.id));
    const skippedCount = recipientCount - toSend.length;

    if (mode === 'dry') {
      return NextResponse.json({
        mode: 'dry',
        recipientCount,
        wouldSend: toSend.length,
        wouldSkip: skippedCount,
        campaignId: CAMPAIGN_TYPE,
        message: 'Dry run complete. No emails sent. Call with mode:"live" to send.',
      });
    }

    // Live send — process in batches
    let sentCount = 0;
    let failedCount = 0;

    if (!resend) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured — cannot send emails' },
        { status: 500 }
      );
    }

    for (let i = 0; i < toSend.length; i += BATCH_SIZE) {
      const batch = toSend.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (contractor) => {
          const firstName = (contractor.name || '').split(' ')[0];
          try {
            await resend.emails.send({
              from: fromEmail,
              replyTo: REPLY_TO,
              to: contractor.email,
              subject: 'The QuoteXbert Job Board Is Filling Up \u2014 Act Fast',
              html: buildAnnouncementEmail(firstName),
            });

            // Log success — do not store email address in userId field
            await prisma.emailEvent.create({
              data: {
                type: CAMPAIGN_TYPE,
                to: contractor.email,
                userId: contractor.id,
                status: 'sent',
              },
            });
            sentCount++;
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Unknown error';
            await prisma.emailEvent.create({
              data: {
                type: CAMPAIGN_TYPE,
                to: contractor.email,
                userId: contractor.id,
                status: 'failed',
                error: errorMsg,
              },
            }).catch(() => {});
            failedCount++;
            console.error(`[CAMPAIGN] Failed for contractor ${contractor.id}:`, errorMsg);
          }
        })
      );

      // Throttle between batches
      if (i + BATCH_SIZE < toSend.length) {
        await sleep(BATCH_DELAY_MS);
      }
    }

    return NextResponse.json({
      mode: 'live',
      campaignId: CAMPAIGN_TYPE,
      recipientCount,
      attempted: toSend.length,
      sent: sentCount,
      skipped: skippedCount,
      failed: failedCount,
    });
  } catch (error) {
    console.error('[CAMPAIGN] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
