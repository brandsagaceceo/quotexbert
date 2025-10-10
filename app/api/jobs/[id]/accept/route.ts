import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { contractorId } = await request.json();
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 }
      );
    }

    // Ensure demo contractor exists in database
    let demoContractor = await prisma.user.findUnique({
      where: { id: contractorId }
    });

    if (!demoContractor && contractorId === "demo-contractor") {
      demoContractor = await prisma.user.create({
        data: {
          id: "demo-contractor",
          email: "demo-contractor@quotexpert.com",
          role: "contractor",
          name: "Demo Contractor"
        }
      });
    }

    // First get the current lead to access homeownerId and pricing
    const currentLead = await prisma.lead.findUnique({
      where: { id: jobId },
      include: {
        homeowner: true
      }
    });

    if (!currentLead) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if job is already accepted
    if (currentLead.contractorId) {
      return NextResponse.json(
        { error: "Job has already been accepted by another contractor" },
        { status: 409 }
      );
    }

    // Update the lead with contractor assignment
    const updatedLead = await prisma.lead.update({
      where: { id: jobId },
      data: {
        contractorId: contractorId,
        acceptedById: contractorId,
        status: "assigned",
        claimed: true
      }
    });

    // Create conversation between homeowner and contractor
    const conversation = await prisma.conversation.create({
      data: {
        jobId: jobId,
        homeownerId: currentLead.homeownerId,
        contractorId: contractorId,
        status: "active"
      }
    });

    // Create initial system message in the conversation
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: contractorId, // Contractor sends the first message
        senderRole: "contractor",
        receiverId: currentLead.homeownerId,
        receiverRole: "homeowner",
        content: `Hello! I've accepted your project "${updatedLead.title}". I'm looking forward to working with you. Let's discuss the details so I can provide you with an accurate quote.`,
        type: "text"
      }
    });

    // Create notification for homeowner
    await prisma.notification.create({
      data: {
        userId: currentLead.homeownerId,
        type: "JOB_ACCEPTED",
        title: "Contractor Accepted Your Project!",
        message: `A professional contractor has accepted your project: "${updatedLead.title}". Check your messages to start discussing the details.`,
        relatedId: jobId,
        relatedType: "job"
      }
    });

    // Create notification for contractor
    await prisma.notification.create({
      data: {
        userId: contractorId,
        type: "JOB_ACCEPTED",
        title: "Job Accepted Successfully", 
        message: `You've accepted the project: "${updatedLead.title}". The conversation with the homeowner is now open in your Messages tab.`,
        relatedId: jobId,
        relatedType: "job"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Job accepted successfully! Conversation started.",
      lead: updatedLead,
      conversation: conversation,
      budget: currentLead.budget,
      homeowner: {
        name: currentLead.homeowner.name,
        email: currentLead.homeowner.email
      }
    });

  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { error: "Failed to accept job" },
      { status: 500 }
    );
  }
}