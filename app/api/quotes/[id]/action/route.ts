/**
 * POST /api/quotes/[id]/action
 *
 * Homeowner-side quote actions: accept or request_changes.
 * Contractor-side status mutations (draft → sent) live in PUT /api/quotes/[id].
 *
 * Body:
 *   action   "accept" | "request_changes"  (required)
 *   note     string                        (required when action = "request_changes")
 *   userId   string                        (required — homeowner's DB id or Clerk id)
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
    const { action, note, userId } = body;

    if (!action || !userId) {
      return NextResponse.json(
        { error: 'action and userId are required' },
        { status: 400 }
      );
    }

    if (action !== 'accept' && action !== 'request_changes') {
      return NextResponse.json(
        { error: 'action must be "accept" or "request_changes"' },
        { status: 400 }
      );
    }

    if (action === 'request_changes' && (!note || !note.trim())) {
      return NextResponse.json(
        { error: 'note is required when action is request_changes' },
        { status: 400 }
      );
    }

    // Resolve homeowner — support Clerk id and DB id
    const homeowner = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { id: true },
    });
    if (!homeowner) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Load quote and verify the caller is the homeowner for this conversation
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        conversation: {
          select: {
            id: true,
            homeownerId: true,
            contractorId: true,
            job: { select: { title: true } },
          },
        },
        contractor: { select: { id: true, name: true, email: true } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (quote.conversation.homeownerId !== homeowner.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (action === 'accept') {
      // Mark quote accepted
      const updated = await prisma.quote.update({
        where: { id: quoteId },
        data: {
          status: 'accepted',
          acceptedAt: new Date(),
        },
      });

      // Notify the contractor
      await prisma.notification.create({
        data: {
          userId: quote.conversation.contractorId,
          type: 'quote_accepted',
          title: 'Quote Accepted!',
          message: `Your quote for "${quote.conversation.job.title}" was accepted.`,
          relatedId: quoteId,
          relatedType: 'quote',
        },
      }).catch((e: unknown) => console.error('[quote action] notification failed', e));

      // Phase 6: learning signal
      void emitQuoteSignal({
        event: 'quote_accepted',
        quoteId,
        conversationId: quote.conversation.id,
        outcome: 'accepted',
        createdByRole: 'homeowner',
        isAcceptedVersion: true,
      }).catch(() => {});

      return NextResponse.json({ success: true, quote: updated });
    }

    // action === 'request_changes'
    // Store the homeowner's note on the quote (revisionNote) so the contractor
    // can read it when the LiveQuoteBuilder opens in revision mode.
    // Also post a system message so both parties see it inline in chat.
    const updated = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: 'revision_requested',
        revisionNote: note.trim(),
      },
    });

    // Post a system message summarising the change request
    await prisma.conversationMessage.create({
      data: {
        conversationId: quote.conversation.id,
        senderId: homeowner.id,
        senderRole: 'homeowner',
        receiverId: quote.conversation.contractorId,
        receiverRole: 'contractor',
        content: `📝 Change request for quote "${quote.title}": ${note.trim()}`,
        type: 'notification',
      },
    }).catch((e: unknown) => console.error('[quote action] system message failed', e));

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: quote.conversation.id },
      data: { lastMessageAt: new Date() },
    }).catch((e: unknown) => console.error('[quote action] conversation update failed', e));

    // Notify contractor
    await prisma.notification.create({
      data: {
        userId: quote.conversation.contractorId,
        type: 'quote_revision_requested',
        title: 'Changes Requested on Quote',
        message: `The homeowner requested changes on your quote for "${quote.conversation.job.title}": ${note.trim().substring(0, 120)}`,
        relatedId: quoteId,
        relatedType: 'quote',
      },
    }).catch((e: unknown) => console.error('[quote action] notification failed', e));

    // Phase 6: learning signal
    void emitQuoteSignal({
      event: 'quote_revision_requested',
      quoteId,
      conversationId: quote.conversation.id,
      outcome: 'revision_requested',
      createdByRole: 'homeowner',
    }).catch(() => {});

    return NextResponse.json({ success: true, quote: updated });
  } catch (error) {
    console.error('[POST /api/quotes/[id]/action] Error:', error);
    return NextResponse.json({ error: 'Failed to process quote action' }, { status: 500 });
  }
}
