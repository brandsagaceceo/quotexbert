import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This API endpoint should be called by a cron job every 6 hours
export async function POST(request: NextRequest) {
  try {
    console.log('[AutoFollow-Up] Starting contractor follow-up check...');
    
    // Find jobs posted more than 48 hours ago with no applications
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    
    const jobsWithNoResponses = await prisma.lead.findMany({
      where: {
        createdAt: {
          lte: twoDaysAgo
        },
        status: 'open',
        published: true,
        applications: {
          none: {}
        },
        // Check if we haven't sent a follow-up already
        followUpSent: {
          not: true
        }
      },
      include: {
        homeowner: true
      }
    });

    console.log(`[AutoFollow-Up] Found ${jobsWithNoResponses.length} jobs with no responses`);

    // Send follow-up notifications for jobs with no responses
    for (const job of jobsWithNoResponses) {
      try {
        // Create in-app notification
        await prisma.notification.create({
          data: {
            userId: job.homeownerId,
            type: 'job_no_response',
            title: 'No contractors have responded yet',
            message: `Your job "${job.title}" hasn't received any bids yet. We've reached out to matching contractors in your area.`,
            link: `/homeowner/jobs/${job.id}`,
            read: false
          }
        });

        // Send email notification (if email service is configured)
        // await sendEmail({
        //   to: job.homeowner.email,
        //   subject: 'No responses yet - We\'re working on it',
        //   template: 'job-no-response',
        //   data: { jobTitle: job.title, jobId: job.id }
        // });

        // Mark follow-up as sent
        await prisma.lead.update({
          where: { id: job.id },
          data: { followUpSent: true }
        });

        console.log(`[AutoFollow-Up] Sent no-response notification for job ${job.id}`);
      } catch (error) {
        console.error(`[AutoFollow-Up] Error sending notification for job ${job.id}:`, error);
      }
    }

    // Find jobs where contractors viewed but didn't bid
    const jobsViewedNoBid = await prisma.lead.findMany({
      where: {
        createdAt: {
          lte: twoDaysAgo
        },
        status: 'open',
        published: true,
        viewCount: {
          gt: 0
        },
        applications: {
          none: {}
        },
        // Check if we haven't sent this specific follow-up
        viewedNoBidFollowUpSent: {
          not: true
        }
      },
      include: {
        homeowner: true
      }
    });

    console.log(`[AutoFollow-Up] Found ${jobsViewedNoBid.length} jobs viewed but no bids`);

    // Send follow-up notifications for jobs viewed but no bids
    for (const job of jobsViewedNoBid) {
      try {
        await prisma.notification.create({
          data: {
            userId: job.homeownerId,
            type: 'job_viewed_no_bid',
            title: 'Contractors viewed your job',
            message: `${job.viewCount} contractor${job.viewCount > 1 ? 's' : ''} viewed your job "${job.title}" but haven't bid yet. Try adding more photos or details to get faster quotes.`,
            link: `/homeowner/jobs/${job.id}`,
            read: false
          }
        });

        // Mark this follow-up as sent
        await prisma.lead.update({
          where: { id: job.id },
          data: { viewedNoBidFollowUpSent: true }
        });

        console.log(`[AutoFollow-Up] Sent viewed-no-bid notification for job ${job.id}`);
      } catch (error) {
        console.error(`[AutoFollow-Up] Error sending viewed-no-bid notification for job ${job.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      noResponseJobs: jobsWithNoResponses.length,
      viewedNoBidJobs: jobsViewedNoBid.length,
      message: 'Contractor follow-up check completed'
    });

  } catch (error) {
    console.error('[AutoFollow-Up] Error:', error);
    return NextResponse.json(
      { error: 'Follow-up check failed' },
      { status: 500 }
    );
  }
}

// Allow manual trigger via GET for testing
export async function GET(request: NextRequest) {
  return POST(request);
}
