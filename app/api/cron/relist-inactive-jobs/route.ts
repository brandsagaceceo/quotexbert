import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyMatchingContractors } from '@/lib/notification-helpers';

export const dynamic = 'force-dynamic';

/**
 * Auto-relist inactive projects.
 *
 * A project that has had NO message activity for 7+ days is automatically
 * re-surfaced so the homeowner never has to recreate it. Existing conversations
 * and quotes are preserved untouched — the job is simply re-opened and matching
 * contractors are re-notified (reusing notifyMatchingContractors).
 *
 * De-duplication (no schema change): relisting bumps the lead's updatedAt, and
 * the candidate query only considers leads whose updatedAt is older than the
 * inactivity window, so a job cannot be relisted more than once per window.
 *
 * Contractor emails are gated behind RELIST_EMAILS_ENABLED so the relist logic
 * can be dry-run in production before broadcasts go live.
 *
 * Scheduled via vercel.json crons. Also callable manually (GET) for testing.
 */
async function runRelist(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const emailsEnabled = process.env.RELIST_EMAILS_ENABLED === 'true';
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Candidate projects: still seeking, published, not seeded, no accepted contractor,
  // untouched for at least the inactivity window, and have an existing message thread.
  const candidates = await prisma.lead.findMany({
    where: {
      published: true,
      isSeeded: false,
      acceptedById: null,
      status: { in: ['open', 'reviewing'] },
      updatedAt: { lt: sevenDaysAgo },
      Thread: { isNot: null },
    },
    select: {
      id: true,
      title: true,
      homeownerId: true,
      Thread: {
        select: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: { createdAt: true },
          },
        },
      },
      acceptances: {
        where: { status: { in: ['accepted', 'quoted', 'selected'] } },
        select: { contractorId: true },
      },
      quotes: {
        where: { status: { in: ['sent', 'revision_requested', 'accepted'] } },
        select: { contractorId: true },
      },
    },
    take: 100,
  });

  let relisted = 0;
  let emailed = 0;

  for (const lead of candidates) {
    const lastMessageAt = lead.Thread?.messages[0]?.createdAt;
    // Skip projects that either have no messages yet (handled by contractor-followup)
    // or whose most recent message is still within the inactivity window.
    if (!lastMessageAt || lastMessageAt >= sevenDaysAgo) continue;

    try {
      // Re-open the project (bumps updatedAt → dedup). Conversations & quotes untouched.
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: 'open', published: true },
      });

      const involvedContractorIds = Array.from(
        new Set([
          ...lead.acceptances.map((acceptance) => acceptance.contractorId),
          ...lead.quotes.map((quote) => quote.contractorId),
        ])
      );

      if (involvedContractorIds.length > 0) {
        await prisma.notification.createMany({
          data: involvedContractorIds.map((contractorId) => ({
            userId: contractorId,
            type: 'job_inactivity_reminder',
            title: 'Homeowner has been inactive',
            message: `No message activity for 7+ days on "${lead.title}". Review the project and withdraw if you no longer plan to participate.`,
            relatedId: lead.id,
            relatedType: 'job',
            payload: {
              action: 'withdraw_from_job',
              leadId: lead.id,
            },
            read: false,
          })),
        });
      }

      await prisma.notification.create({
        data: {
          userId: lead.homeownerId,
          type: 'job_relisted',
          title: 'Your project was re-listed',
          message: `We re-listed "${lead.title}" to reach more contractors. Your existing quotes and conversations are still here.`,
          relatedId: lead.id,
          relatedType: 'job',
          payload: {
            action: 'request_more_quotes',
            leadId: lead.id,
          },
          read: false,
        },
      });

      relisted += 1;

      if (emailsEnabled) {
        await notifyMatchingContractors(lead.id);
        emailed += 1;
      }
    } catch (error) {
      console.error(`[Relist] Failed to relist job ${lead.id}:`, error);
    }
  }

  console.log(`[Relist] Relisted ${relisted} inactive project(s); emailed ${emailed} (emailsEnabled=${emailsEnabled}).`);

  return NextResponse.json({
    success: true,
    candidates: candidates.length,
    relisted,
    emailed,
    emailsEnabled,
    message: 'Inactive project relist check completed',
  });
}

export async function POST(request: NextRequest) {
  try {
    return await runRelist(request);
  } catch (error) {
    console.error('[Relist] Error:', error);
    return NextResponse.json({ error: 'Relist check failed' }, { status: 500 });
  }
}

// Allow manual trigger via GET for testing.
export async function GET(request: NextRequest) {
  return POST(request);
}
