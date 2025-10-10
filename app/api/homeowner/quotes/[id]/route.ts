import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { action, homeownerId } = await request.json();
    const resolvedParams = await params;
    const quoteId = resolvedParams.id;

    if (!quoteId || !action || !homeownerId) {
      return NextResponse.json(
        { error: "Quote ID, action, and homeowner ID are required" },
        { status: 400 }
      );
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the quote and verify ownership
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        job: true,
        contractor: true
      }
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Verify the homeowner owns this job
    if (quote.job.homeownerId !== homeownerId) {
      return NextResponse.json(
        { error: "Unauthorized - not your quote" },
        { status: 403 }
      );
    }

    // Check if quote is already processed
    if (quote.status === "accepted" || quote.status === "rejected") {
      return NextResponse.json(
        { error: `Quote already ${quote.status}` },
        { status: 409 }
      );
    }

    // Update quote status
    const updatedQuote = await prisma.quote.update({
      where: { id: quoteId },
      data: {
        status: action === "accept" ? "accepted" : "rejected",
        acceptedAt: action === "accept" ? new Date() : null,
        rejectedAt: action === "reject" ? new Date() : null
      }
    });

    // Create notification for contractor
    await prisma.notification.create({
      data: {
        userId: quote.contractorId,
        type: action === "accept" ? "QUOTE_ACCEPTED" : "QUOTE_REJECTED",
        title: action === "accept" ? "Quote Accepted!" : "Quote Rejected",
        message: action === "accept" 
          ? `Great news! Your quote for "${quote.job.title}" has been accepted by the homeowner.`
          : `Your quote for "${quote.job.title}" has been rejected by the homeowner.`,
        relatedId: quoteId,
        relatedType: "quote"
      }
    });

    // If accepted, also update the job status
    if (action === "accept") {
      await prisma.lead.update({
        where: { id: quote.jobId },
        data: { 
          status: "in_progress"
        }
      });

      // Create a message in the conversation
      await prisma.conversationMessage.create({
        data: {
          conversationId: quote.conversationId,
          senderId: homeownerId,
          senderRole: "homeowner",
          receiverId: quote.contractorId,
          receiverRole: "contractor",
          content: `Great! I've accepted your quote for $${quote.totalCost.toLocaleString()}. Looking forward to working with you!`,
          type: "text"
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Quote ${action}ed successfully`,
      quote: updatedQuote
    });

  } catch (error) {
    console.error("Error processing quote action:", error);
    return NextResponse.json(
      { error: "Failed to process quote action" },
      { status: 500 }
    );
  }
}