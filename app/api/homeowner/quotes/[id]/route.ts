import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import { acceptQuoteForHomeowner } from "@/lib/quote-lifecycle";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const homeowner = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { id: true, role: true, isActive: true },
    });
    if (!homeowner || homeowner.role !== "homeowner" || !homeowner.isActive) {
      return NextResponse.json({ error: "Active homeowner access required" }, { status: 403 });
    }

    const { action } = await request.json();
    const { id: quoteId } = await params;
    if (!quoteId || !action) {
      return NextResponse.json({ error: "Quote ID and action are required" }, { status: 400 });
    }
    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json({ error: "Action must be 'accept' or 'reject'" }, { status: 400 });
    }

    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        job: { select: { id: true, title: true, homeownerId: true } },
        conversation: { select: { id: true, jobId: true, homeownerId: true, contractorId: true } },
      },
    });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    if (
      quote.job.homeownerId !== homeowner.id ||
      quote.conversation.homeownerId !== homeowner.id ||
      quote.contractorId !== quote.conversation.contractorId ||
      quote.jobId !== quote.job.id ||
      quote.conversation.jobId !== quote.job.id
    ) {
      return NextResponse.json({ error: "Unauthorized - not your quote" }, { status: 403 });
    }
    if (quote.status !== "sent") {
      return NextResponse.json({ error: "Only a sent quote can be actioned" }, { status: 409 });
    }

    let updatedQuote;
    if (action === "accept") {
      updatedQuote = await acceptQuoteForHomeowner({
        quoteId,
        jobId: quote.jobId,
        conversationId: quote.conversation.id,
        homeownerId: homeowner.id,
        contractorId: quote.conversation.contractorId,
      });
      if (!updatedQuote) {
        return NextResponse.json({ error: "This quote or project has already been updated" }, { status: 409 });
      }
    } else {
      const transition = await prisma.quote.updateMany({
        where: {
          id: quoteId,
          jobId: quote.jobId,
          contractorId: quote.conversation.contractorId,
          conversationId: quote.conversation.id,
          status: "sent",
        },
        data: { status: "rejected", rejectedAt: new Date() },
      });
      if (transition.count !== 1) {
        return NextResponse.json({ error: "This quote has already been updated" }, { status: 409 });
      }
      updatedQuote = await prisma.quote.findUnique({ where: { id: quoteId } });
      if (!updatedQuote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }
    }

    await prisma.notification.create({
      data: {
        userId: quote.contractorId,
        type: action === "accept" ? "QUOTE_ACCEPTED" : "QUOTE_REJECTED",
        title: action === "accept" ? "Quote Accepted!" : "Quote Rejected",
        message:
          action === "accept"
            ? `Great news! Your quote for "${quote.job.title}" has been accepted by the homeowner.`
            : `Your quote for "${quote.job.title}" has been rejected by the homeowner.`,
        relatedId: quoteId,
        relatedType: "quote",
      },
    });

    if (action === "accept") {
      await prisma.conversationMessage.create({
        data: {
          conversationId: quote.conversation.id,
          senderId: homeowner.id,
          senderRole: "homeowner",
          receiverId: quote.contractorId,
          receiverRole: "contractor",
          content: `Great! I've accepted your quote for $${quote.totalCost.toLocaleString()}. Looking forward to working with you!`,
          type: "text",
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Quote ${action}ed successfully`,
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Error processing quote action:", error);
    return NextResponse.json({ error: "Failed to process quote action" }, { status: 500 });
  }
}
