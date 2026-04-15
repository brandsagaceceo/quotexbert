import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { analyzeQuote } from '@/lib/quote-analysis';

/**
 * POST /api/quotes/[id]/analyze
 *
 * Runs the AI "Is this quote fair?" analysis for a homeowner.
 * Auth: must be the homeowner on the linked job.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quoteId = params.id;

    // Verify caller owns the homeowner role on this quote's job
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { job: { select: { homeownerId: true } } },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.job) {
      // Look up caller by clerkUserId (the correct schema field).
      // Also accept id === userId for legacy accounts where User.id was set to the Clerk ID.
      const caller = await prisma.user.findFirst({
        where: { OR: [{ clerkUserId: userId }, { id: userId }] },
        select: { id: true },
      });

      const isHomeowner = caller
        ? quote.job.homeownerId === caller.id
        : quote.job.homeownerId === userId; // legacy: homeownerId may equal the raw Clerk ID

      if (!isHomeowner) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const analysis = await analyzeQuote(quoteId);
    return NextResponse.json(analysis);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[quotes/analyze] Unhandled error:', err);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
