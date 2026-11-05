/**
 * POST /api/quotes/[id]/revise
 *
 * Creates a new draft version of an existing quote (contractor-initiated).
 * The original quote is marked "superseded". Returns the new draft Quote
 * with: version = original.version + 1, parentQuoteId = original.id,
 * all content and items copied, status = "draft".
 *
 * Legacy body identity fields are ignored; the session supplies the contractor.
 *
 * Guards:
 *  - Contractor must own the quote
 *  - Quote must be sent or revision-requested
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitQuoteSignal } from '@/lib/quote-signals';
import { resolveAuthUser } from '@/lib/server-auth';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { id: true, role: true, isActive: true },
    });
    if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json({ error: 'Active contractor access required' }, { status: 403 });
    }

    // Load the original quote with items
    const original = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: { orderBy: { createdAt: 'asc' } },
        conversation: { select: { id: true, homeownerId: true, contractorId: true, jobId: true } },
      },
    });

    if (!original) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (original.contractorId !== contractor.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!['sent', 'revision_requested'].includes(original.status)) {
      return NextResponse.json(
        { error: 'Only sent or revision-requested quotes can be revised' },
        { status: 403 }
      );
    }
    if (
      original.conversation.contractorId !== contractor.id ||
      original.conversation.jobId !== original.jobId
    ) {
      return NextResponse.json({ error: 'Quote relationship mismatch' }, { status: 403 });
    }

    const completeQuote = await prisma.$transaction(async (tx) => {
      const transition = await tx.quote.updateMany({
        where: {
          id: quoteId,
          contractorId: contractor.id,
          status: original.status,
        },
        data: { status: 'superseded' },
      });
      if (transition.count !== 1) return null;

      return tx.quote.create({
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
          version: (original.version ?? 1) + 1,
          parentQuoteId: original.id,
          revisionNote: original.revisionNote ?? null,
          status: 'draft',
          isEdited: false,
          items: {
            create: original.items.map((item) => ({
              category: item.category,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              notes: item.notes ?? null,
            })),
          },
        },
        include: { items: { orderBy: { createdAt: 'asc' } } },
      });
    });
    if (!completeQuote) {
      return NextResponse.json({ error: 'Quote status changed; refresh and try again.' }, { status: 409 });
    }

    // Phase 6: learning signal — emitted before return (fire-and-forget)
    void emitQuoteSignal({
      event: 'quote_revision_created',
      quoteId: completeQuote.id,
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
