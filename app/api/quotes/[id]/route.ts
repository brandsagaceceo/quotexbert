import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emitQuoteSignal } from "@/lib/quote-signals";
import { sendQuoteReceivedEmail } from "@/lib/email";
import { canSubmitQuote, MAX_ACTIVE_QUOTES_PER_JOB } from "@/lib/quote-limits";
import { markAcceptanceQuoted } from "@/lib/job-acceptance";
import { resolveAuthUser } from "@/lib/server-auth";
import { isHomeownerVisibleQuoteStatus } from "@/lib/quote-lifecycle";

class QuoteDeletionConflictError extends Error {}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;

    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        items: true,
        conversation: {
          select: {
            id: true,
            jobId: true,
            homeownerId: true,
            contractorId: true,
            status: true,
            job: {
              select: {
                id: true,
                title: true,
                description: true,
                budget: true,
                category: true,
                zipCode: true,
                status: true,
              },
            },
            homeowner: { select: { id: true, name: true, email: true } },
            contractor: { select: { id: true, name: true, email: true } },
          },
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

    // PRIVACY: only the owning contractor or the job's homeowner may read a
    // quote's full details — a competing contractor cannot fetch it by id.
    const relationshipsMatch =
      quote.conversation?.jobId === quote.jobId &&
      quote.conversation?.contractorId === quote.contractorId;
    const ownsAsContractor =
      relationshipsMatch &&
      quote.contractorId === dbUserId;
    const ownsAsHomeowner =
      relationshipsMatch &&
      quote.conversation?.homeownerId === dbUserId;
    if (!ownsAsContractor && !ownsAsHomeowner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (
      ownsAsHomeowner &&
      !isHomeownerVisibleQuoteStatus(quote.status)
    ) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
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
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: authResult.status });
    }
    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { role: true, isActive: true },
    });
    if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json({ error: "Active contractor access required" }, { status: 403 });
    }

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
    const requestedStatus =
      typeof status === "string" ? status.toLowerCase() : undefined;

    // Only drafts and homeowner-requested revisions may be edited or sent.
    const existing = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: {
        status: true,
        jobId: true,
        contractorId: true,
        conversation: {
          select: { jobId: true, contractorId: true },
        },
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    // Only the owning contractor may edit/send their own quote.
    if (
      existing.contractorId !== authResult.user.dbUserId ||
      existing.conversation.contractorId !== existing.contractorId ||
      existing.conversation.jobId !== existing.jobId
    ) {
      return NextResponse.json({ error: "You do not have access to this quote." }, { status: 403 });
    }
    if (!["draft", "revision_requested"].includes(existing.status)) {
      return NextResponse.json(
        { error: 'Only draft or revision-requested quotes can be edited. Create a revision instead.' },
        { status: 403 }
      );
    }
    if (!requestedStatus) {
      return NextResponse.json({ error: "A valid quote status is required" }, { status: 400 });
    }
    const allowedStatuses =
      existing.status === "draft" ? ["draft", "sent"] : ["sent"];
    if (!allowedStatuses.includes(requestedStatus)) {
      return NextResponse.json(
        { error: "This quote cannot transition to the requested status" },
        { status: 403 }
      );
    }

    // Require a real amount before a quote can be sent to the homeowner.
    if (requestedStatus === 'sent') {
      const amount = Number(totalCost);
      if (!Number.isFinite(amount) || amount <= 0) {
        return NextResponse.json(
          { error: 'Enter your quote amount before sending.' },
          { status: 400 }
        );
      }
    }

    // Enforce the max active-quote cap when a quote is being submitted to the homeowner.
    // A contractor re-submitting their own already-active quote is never blocked.
    if (requestedStatus === 'sent') {
      const wasActive = existing.status === 'revision_requested';
      if (!wasActive && existing?.jobId && existing?.contractorId) {
        const { allowed, activeCount } = await canSubmitQuote(existing.jobId, existing.contractorId);
        if (!allowed) {
          return NextResponse.json(
            { error: `This project already has ${activeCount} active quotes (max ${MAX_ACTIVE_QUOTES_PER_JOB}). No new quotes can be submitted until a slot opens.` },
            { status: 409 }
          );
        }
      }
    }

    const updatedQuote = await prisma.$transaction(async (tx) => {
      const transition = await tx.quote.updateMany({
        where: { id: quoteId, contractorId: authResult.user.dbUserId, status: existing.status },
        data: {
          title,
          description,
          scope,
          laborCost: parseFloat(laborCost || 0),
          materialCost: parseFloat(materialCost || 0),
          totalCost: parseFloat(totalCost || 0),
          status: requestedStatus,
          isEdited: true,
          ...(requestedStatus === "sent" && { sentAt: new Date() }),
        },
      });
      if (transition.count !== 1) return null;

      if (items && Array.isArray(items)) {
        await tx.quoteItem.deleteMany({ where: { quoteId } });
        if (items.length > 0) {
          await tx.quoteItem.createMany({
            data: items.map((item: any) => ({
              quoteId,
              category: item.category || "other",
              description: item.description,
              quantity: parseFloat(item.quantity || 1),
              unitPrice: parseFloat(item.unitPrice || 0),
              totalPrice: parseFloat(item.totalPrice || 0),
              notes: item.notes,
            })),
          });
        }
      }

      return tx.quote.findUnique({
        where: { id: quoteId },
        include: {
          items: true,
          conversation: {
            include: {
              job: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  budget: true,
                  category: true,
                  zipCode: true,
                  status: true,
                },
              },
              homeowner: { select: { id: true, name: true, email: true } },
              contractor: { select: { id: true, name: true, email: true } },
            },
          },
        },
      });
    });
    if (!updatedQuote) {
      return NextResponse.json({ error: "Quote status changed; refresh and try again." }, { status: 409 });
    }

    // Send notification to homeowner if quote was sent
    if (requestedStatus === "sent") {
      await markAcceptanceQuoted(updatedQuote.jobId, updatedQuote.contractorId);

      await prisma.notification.create({
        data: {
          userId: updatedQuote.conversation.homeowner.id,
          type: "quote_received",
          title: "New Quote Received",
          message: `You've received a quote for "${updatedQuote.conversation.job.title}" - $${totalCost}`,
          relatedId: quoteId,
          relatedType: "quote",
          // payload.leadId enables NotificationBell to deep-link to /messages?leadId=.
          // payload.contractorId identifies WHICH contractor this quote is from —
          // a lead can have multiple contractors sharing one Thread, so leadId
          // alone isn't enough to open the right contractor's conversation.
          payload: { leadId: updatedQuote.conversation.job.id, contractorId: updatedQuote.contractorId },
        }
      });

      // Post a Thread message so this quote send surfaces in the chat list's
      // activity ordering/unread state — mirrors the existing request_changes
      // pattern in /api/quotes/[id]/action. Does not touch the notification/email
      // system above; a plain Message row, non-fatal if it fails.
      try {
        const isRevision = (updatedQuote.version ?? 1) > 1 || !!updatedQuote.parentQuoteId;
        const thread = await prisma.thread.findUnique({
          where: { leadId: updatedQuote.jobId },
          select: { id: true },
        });
        if (thread) {
          await prisma.message.create({
            data: {
              threadId: thread.id,
              fromUserId: updatedQuote.contractorId,
              toUserId: updatedQuote.conversation.homeowner.id,
              body: `📋 ${isRevision ? "Revised quote" : "New quote"}: $${Number(totalCost).toLocaleString()}`,
            },
          });
        }
      } catch (threadMsgErr) {
        console.error('[QUOTE] Failed to post quote-sent thread message (non-fatal):', threadMsgErr);
      }

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
          contractorId: updatedQuote.contractorId,
        });
        console.log(`[QUOTE] Quote-received email sent to ${updatedQuote.conversation.homeowner.email}`);
      } catch (emailErr) {
        console.error('[QUOTE] Failed to send quote-received email (non-fatal):', emailErr);
      }
    }
    // Phase 6: learning signal for sent quotes
    if (requestedStatus === 'sent') {
      void emitQuoteSignal({
        event: 'quote_sent',
        quoteId,
        createdByRole: 'contractor',
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
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: "Your session expired. Please sign in again." }, { status: authResult.status });
    }

    const { id: quoteId } = await params;

    // Only allow deleting draft quotes — never delete sent/accepted quotes
    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { role: true, isActive: true },
    });
    if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json({ error: "Active contractor access required" }, { status: 403 });
    }
    const existing = await prisma.quote.findUnique({
      where: { id: quoteId },
      select: { status: true, contractorId: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    if (existing.contractorId !== authResult.user.dbUserId) {
      return NextResponse.json({ error: "You do not have access to this quote." }, { status: 403 });
    }
    if (!['draft', 'revision_requested'].includes(existing.status)) {
      return NextResponse.json(
        { error: "Only draft quotes can be deleted" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      const current = await tx.quote.updateMany({
        where: {
          id: quoteId,
          contractorId: authResult.user.dbUserId,
          status: existing.status,
        },
        data: { status: existing.status },
      });
      if (current.count !== 1) {
        throw new QuoteDeletionConflictError();
      }

      await tx.quoteItem.deleteMany({ where: { quoteId } });
      const deleted = await tx.quote.deleteMany({
        where: {
          id: quoteId,
          contractorId: authResult.user.dbUserId,
          status: existing.status,
        },
      });
      if (deleted.count !== 1) {
        throw new QuoteDeletionConflictError();
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof QuoteDeletionConflictError) {
      return NextResponse.json(
        { error: "Quote status changed; refresh and try again." },
        { status: 409 }
      );
    }
    console.error("Error deleting quote:", error);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
