import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendQuoteReceivedEmail } from '@/lib/email';
import { canSubmitQuote, MAX_ACTIVE_QUOTES_PER_JOB } from '@/lib/quote-limits';
import { markAcceptanceQuoted } from '@/lib/job-acceptance';
import { resolveAuthUser } from '@/lib/server-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const caller = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { id: true, role: true, isActive: true },
    });
    if (!caller || caller.role !== 'contractor' || !caller.isActive) {
      return NextResponse.json({ error: 'Active contractor access required' }, { status: 403 });
    }
    const dbContractorId = caller.id;

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    // Verify the quote exists and belongs to the contractor
    const quote = await prisma.quote.findFirst({
      where: {
        id: quoteId,
        contractorId: dbContractorId,
      },
      include: {
        contractor: { select: { name: true, email: true } },
        job: {
          select: {
            id: true,
            title: true,
            homeownerId: true,
            homeowner: { select: { id: true, email: true, name: true } },
          },
        },
        conversation: {
          select: {
            id: true,
            jobId: true,
            homeownerId: true,
            contractorId: true,
          },
        },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }
    if (
      quote.conversation.contractorId !== dbContractorId ||
      quote.conversation.jobId !== quote.jobId ||
      quote.conversation.homeownerId !== quote.job.homeownerId
    ) {
      return NextResponse.json({ error: 'Quote relationship mismatch' }, { status: 403 });
    }
    if (!['draft', 'revision_requested'].includes(quote.status)) {
      return NextResponse.json(
        { error: 'Only draft or revision-requested quotes can be sent.' },
        { status: 409 }
      );
    }

    // Revisions of an already-active quote retain their existing slot.
    const alreadyActive = quote.status === 'revision_requested';
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
    // NOTE: lowercase 'sent' — every other status check/comparison in the app
    // (LiveQuoteBuilder UI, canSubmitQuote, isActiveQuoteStatus) is lowercase.
    // The previous 'SENT' here caused this quote to look un-sent in the UI.
    const transition = await prisma.quote.updateMany({
      where: { id: quoteId, contractorId: dbContractorId, status: quote.status },
      data: {
        status: 'sent',
        sentAt: new Date(),
      },
    });
    if (transition.count !== 1) {
      return NextResponse.json(
        { error: 'Quote status changed; refresh and try again.' },
        { status: 409 }
      );
    }
    const updatedQuote = await prisma.quote.findUnique({ where: { id: quoteId } });
    if (!updatedQuote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

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
