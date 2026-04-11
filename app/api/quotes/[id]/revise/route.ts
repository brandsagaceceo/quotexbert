/**
 * POST /api/quotes/[id]/revise
 *
 * Creates a new draft version of an existing quote (contractor-initiated).
 * The original quote is marked "superseded". Returns the new draft Quote
 * with: version = original.version + 1, parentQuoteId = original.id,
 * all content and items copied, status = "draft".
 *
 * Body: { contractorId }
 *
 * Guards:
 *  - Contractor must own the quote
 *  - Quote must NOT be "accepted" (accepted quotes are frozen)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitQuoteSignal } from '@/lib/quote-signals';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    const body = await request.json();
    const { contractorId } = body;

    if (!contractorId) {
      return NextResponse.json({ error: 'contractorId is required' }, { status: 400 });
    }

    // Resolve contractor — support both DB id and Clerk id
    const contractor = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      select: { id: true },
    });
    if (!contractor) {
      return NextResponse.json({ error: 'Contractor not found' }, { status: 404 });
    }

    // Load the original quote with items
    const original = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        conversation: { select: { id: true, homeownerId: true } },
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (original.contractorId !== contractor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (original.status === 'accepted') {
      return NextResponse.json(
        { error: 'Accepted quotes cannot be revised' },
        { status: 403 }
      );
    }

    // Atomically: mark original superseded + create new draft version
    const [, newQuote] = await prisma.$transaction([
      prisma.quote.update({
        where: { id: quoteId },
        data: { status: 'superseded' },
      }),
      prisma.quote.create({
        data: {
          conversationId: original.conversationId,
          jobId: original.jobId,
          contractorId: original.contractorId,
          title: original.title,
          description: original.description,
          scope: original.scope,
          laborCost: original.laborCost,
          materialCost: original.materialCost,
          totalCost: original.totalCost,
          aiAnalysis: original.aiAnalysis,
          extractedRequirements: original.extractedRequirements,
          confidenceScore: original.confidenceScore,
          // Versioning fields
          version: (original.version ?? 1) + 1,
          parentQuoteId: original.id,
          revisionNote: original.revisionNote ?? null,
          status: 'draft',
          isEdited: false,
        },
      }),
    ]);

    // Copy line items to the new quote
    if (original.items.length > 0) {
      await prisma.quoteItem.createMany({
        data: original.items.map((item) => ({
          quoteId: newQuote.id,
          category: item.category,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          notes: item.notes ?? undefined,
        })),
      });
    }

    // Return the complete new draft with items
    const completeQuote = await prisma.quote.findUnique({
      where: { id: newQuote.id },
      include: { items: { orderBy: { createdAt: 'asc' } } },
    });

    // Phase 6: learning signal — emitted before return (fire-and-forget)
    void emitQuoteSignal({
      event: 'quote_revision_created',
      quoteId: newQuote.id,
      conversationId: original.conversationId,
      version: (original.version ?? 1) + 1,
      isRevision: true,
      createdByRole: 'contractor',
    }).catch(() => {});

    return NextResponse.json({
      quote: completeQuote,
      // Surface the homeowner's change request note so the builder can display it
      revisionNote: original.revisionNote ?? null,
    });

  } catch (error) {
    console.error('[POST /api/quotes/[id]/revise] Error:', error);
    return NextResponse.json({ error: 'Failed to create revision' }, { status: 500 });
  }
}
