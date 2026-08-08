import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { sendQuoteReceivedEmail } from '@/lib/email';
import { canSubmitQuote, MAX_ACTIVE_QUOTES_PER_JOB } from '@/lib/quote-limits';
import { markAcceptanceQuoted } from '@/lib/job-acceptance';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    // Verify the quote exists and belongs to the contractor
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        contractorId: userId,
      },
      include: {
        contractor: { select: { name: true, email: true } },
        job: {
          include: {
            homeowner: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    // Enforce the max active-quote cap. A contractor re-sending their own
    // already-active quote is never blocked; a new contractor is blocked once
    // the job already has MAX_ACTIVE_QUOTES_PER_JOB active quotes.
    const alreadyActive = ['sent', 'revision_requested', 'accepted'].includes((quote.status || '').toLowerCase());
    if (!alreadyActive) {
      const { allowed, activeCount } = await canSubmitQuote(quote.jobId, quote.contractorId);
      if (!allowed) {
        return NextResponse.json(
          { error: `This project already has ${activeCount} active quotes (max ${MAX_ACTIVE_QUOTES_PER_JOB}). No new quotes can be submitted until a slot opens.` },
          { status: 409 }
        );
      }
    }

    // Update quote status to sent
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    await markAcceptanceQuoted(quote.jobId, quote.contractorId);

    // Create notification for homeowner
    await prisma.notification.create({
      data: {
        userId: quote.job.homeownerId,
        title: 'New Quote Received',
        message: `You received a quote for ${quote.job.title}`,
        type: 'QUOTE_RECEIVED',
        relatedId: quoteId,
      },
    });

    // Send email notification to homeowner
    try {
      const contractorName = quote.contractor?.name ?? quote.contractor?.email ?? 'Your contractor';
      await sendQuoteReceivedEmail({
        homeowner: {
          id: quote.job.homeownerId,
          email: quote.job.homeowner.email,
          name: quote.job.homeowner.name,
        },
        contractorName,
        jobTitle: quote.job.title,
        totalCost: quote.totalCost ?? 0,
        leadId: quote.job.id,
      });
      console.log('[QUOTE/SEND] Quote-received email sent to', quote.job.homeowner.email);
    } catch (emailError) {
      console.error('[QUOTE/SEND] Failed to send email notification (non-fatal):', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error('Error sending quote:', error);
    return NextResponse.json(
      { error: 'Failed to send quote' },
      { status: 500 }
    );
  }
}
