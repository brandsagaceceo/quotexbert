import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

const ADMIN_EMAILS = ['brandsagaceo@gmail.com', 'quotexbert@gmail.com'];

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email from Clerk
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true }
    });

    if (!user || !ADMIN_EMAILS.includes(user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get last 20 webhook events from StripeEvent table (if exists)
    // Fallback to checking Transaction table for recent activity
    let recentEvents: any[] = [];
    let lastWebhookTime: string | null = null;

    try {
      // Try to get webhook events (you may need to add a StripeWebhookLog table)
      const events = await prisma.$queryRaw<Array<{type: string, createdAt: Date}>>`
        SELECT "type", "createdAt"
        FROM "StripeWebhookLog"
        ORDER BY "createdAt" DESC
        LIMIT 20
      `;
      recentEvents = events;
      if (events.length > 0) {
        lastWebhookTime = events[0].createdAt.toISOString();
      }
    } catch (error) {
      // Table doesn't exist yet, try Transaction table as fallback
      try {
        const transactions = await prisma.transaction.findMany({
          where: { type: 'SUBSCRIPTION_PAYMENT' },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: { createdAt: true }
        });
        
        if (transactions.length > 0) {
          lastWebhookTime = transactions[0].createdAt.toISOString();
          recentEvents = transactions.map(t => ({
            type: 'invoice.payment_succeeded (inferred)',
            createdAt: t.createdAt.toISOString()
          }));
        }
      } catch (fallbackError) {
        console.error('Could not query transaction fallback:', fallbackError);
      }
    }

    return NextResponse.json({
      recentEvents,
      lastWebhookTime,
      webhookEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://quotexbert.com'}/api/webhooks/stripe`
    });
  } catch (error) {
    console.error('Webhook health check error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
