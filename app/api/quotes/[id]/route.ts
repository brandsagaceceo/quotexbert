import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitQuoteSignal } from "@/lib/quote-signals";
import { sendQuoteReceivedEmail } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: true,
        conversation: {
          include: {
            job: true,
            homeowner: true,
            contractor: true
          }
        },
        contractor: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(quote);

  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const quoteId = resolvedParams.id;
    const body = await request.json();

    const {
      title,
      description,
      scope,
      laborCost,
      materialCost,
      totalCost,
      items,
      status
    } = body;

    // Guard: accepted quotes are frozen — prevent accidental overwrites
    const existing = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { status: true },
    });
    if (existing?.status === 'accepted') {
      return NextResponse.json(
        { error: 'Accepted quotes cannot be modified. Create a revision instead.' },
        { status: 403 }
      );
    }

    // Update the quote
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        title,
        description,
        scope,
        laborCost: parseFloat(laborCost || 0),
        materialCost: parseFloat(materialCost || 0),
        totalCost: parseFloat(totalCost || 0),
        status,
        isEdited: true,
        ...(status === "sent" && { sentAt: new Date() }),
        ...(status === "accepted" && { acceptedAt: new Date() }),
        ...(status === "rejected" && { rejectedAt: new Date() })
      },
      include: {
        items: true,
        conversation: {
          include: {
            job: true,
            homeowner: true,
            contractor: true
          }
        }
      }
    });

    // Update quote items if provided
    if (items && Array.isArray(items)) {
      // Delete existing items
      await prisma.quoteItem.deleteMany({
        where: { quoteId }
      });

      // Create new items
      if (items.length > 0) {
        await prisma.quoteItem.createMany({
          data: items.map((item: any) => ({
            quoteId,
            category: item.category || "other",
            description: item.description,
            quantity: parseFloat(item.quantity || 1),
            unitPrice: parseFloat(item.unitPrice || 0),
            totalPrice: parseFloat(item.totalPrice || 0),
            notes: item.notes
          }))
        });
      }
    }

    // Send notification to homeowner if quote was sent
    if (status === "sent") {
      await prisma.notification.create({
        data: {
          userId: updatedQuote.conversation.homeowner.id,
          type: "quote_received",
          title: "New Quote Received",
          message: `You've received a quote for "${updatedQuote.conversation.job.title}" - $${totalCost}`,
          relatedId: quoteId,
          relatedType: "quote",
          // payload.leadId enables NotificationBell to deep-link to /messages?leadId=
          payload: { leadId: updatedQuote.conversation.job.id },
        }
      });

      // Email homeowner — non-fatal if Resend is not configured
      try {
        const contractorName =
          updatedQuote.conversation.contractor?.name ??
          updatedQuote.conversation.contractor?.email ??
          'Your contractor';
        await sendQuoteReceivedEmail({
          homeowner: {
            id: updatedQuote.conversation.homeowner.id,
            email: updatedQuote.conversation.homeowner.email,
            name: updatedQuote.conversation.homeowner.name,
          },
          contractorName,
          jobTitle: updatedQuote.conversation.job.title,
          totalCost: parseFloat(totalCost || 0),
          leadId: updatedQuote.conversation.job.id,
        });
        console.log(`[QUOTE] Quote-received email sent to ${updatedQuote.conversation.homeowner.email}`);
      } catch (emailErr) {
        console.error('[QUOTE] Failed to send quote-received email (non-fatal):', emailErr);
      }
    }
    // Phase 6: learning signal for sent/rejected transitions
    if (status === 'sent' || status === 'rejected') {
      void emitQuoteSignal({
        event: status === 'sent' ? 'quote_sent' : 'quote_rejected',
        quoteId,
        outcome: status === 'rejected' ? 'rejected' : undefined,
        createdByRole: status === 'sent' ? 'contractor' : 'homeowner',
      }).catch(() => {});
    }
    return NextResponse.json({ success: true, quote: updatedQuote });

  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: quoteId } = await params;

    // Only allow deleting draft quotes — never delete sent/accepted quotes
    const existing = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { status: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    if (!['draft', 'revision_requested'].includes(existing.status)) {
      return NextResponse.json(
        { error: "Only draft quotes can be deleted" },
        { status: 403 }
      );
    }

    await prisma.quoteItem.deleteMany({ where: { quoteId } });
    await prisma.quote.delete({ where: { id: quoteId } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
