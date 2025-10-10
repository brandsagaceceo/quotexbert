import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

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

    // Update quote status to sent
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

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
      // TODO: Implement email notification
      console.log('Email notification would be sent to:', quote.job.homeowner.email);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
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
