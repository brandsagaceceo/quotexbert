import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead } from "@/lib/subscription-access";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { contractorId, message } = await request.json();
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    if (!jobId || !contractorId) {
      return NextResponse.json(
        { error: "Job ID and Contractor ID are required" },
        { status: 400 }
      );
    }

    // Get the lead and check if it exists
    const currentLead = await prisma.lead.findUnique({
      where: { id: jobId },
      include: {
        homeowner: {
          select: { name: true, email: true }
        }
      }
    });

    if (!currentLead) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (currentLead.status !== "open") {
      return NextResponse.json(
        { error: "This job is no longer accepting contractors" },
        { status: 400 }
      );
    }

    if (!currentLead.published) {
      return NextResponse.json(
        { error: "This job is not yet published" },
        { status: 400 }
      );
    }

    // Check if contractor has subscription for this category
    const hasAccess = await canAccessLead(contractorId, currentLead.category);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "You need an active subscription for this category to accept jobs" },
        { status: 403 }
      );
    }

    // Check current accepted contractors
    const currentAcceptedList = JSON.parse(currentLead.acceptedContractors || "[]");
    
    // Check if contractor already accepted
    if (currentAcceptedList.includes(contractorId)) {
      return NextResponse.json(
        { error: "You have already accepted this job" },
        { status: 400 }
      );
    }

    // Check if job has reached maximum acceptances (3 contractors)
    if (currentAcceptedList.length >= 3) {
      return NextResponse.json(
        { error: "This job has reached the maximum number of contractors (3)" },
        { status: 400 }
      );
    }

    // Ensure contractor exists
    let contractor = await prisma.user.findUnique({
      where: { id: contractorId }
    });

    if (!contractor && contractorId === "demo-contractor") {
      contractor = await prisma.user.create({
        data: {
          id: "demo-contractor",
          email: "demo-contractor@quotexpert.com",
          role: "contractor",
          name: "Demo Contractor"
        }
      });
    }

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Create job acceptance record
    const acceptance = await prisma.jobAcceptance.create({
      data: {
        leadId: jobId,
        contractorId,
        message: message || null,
        status: "accepted"
      }
    });

    // Update lead status if this is the first acceptance
    if (currentAcceptedList.length === 0) {
      await prisma.lead.update({
        where: { id: jobId },
        data: { status: "reviewing" }
      });
    }

    // Update acceptedContractors array
    const updatedAccepted = [...currentAcceptedList, contractorId];
    await prisma.lead.update({
      where: { id: jobId },
      data: { 
        acceptedContractors: JSON.stringify(updatedAccepted)
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

    // Create initial message in the conversation
    await prisma.conversationMessage.create({
      data: {
        conversationId: conversation.id,
        senderId: contractorId,
        senderRole: "contractor",
        receiverId: currentLead.homeownerId,
        receiverRole: "homeowner",
        content: `Hello! I've accepted your project "${currentLead.title}". I'm interested in providing you with a quote. Let's discuss the details so I can give you an accurate estimate.`,
        type: "text"
      }
    });

    // Create notification for homeowner
    await prisma.notification.create({
      data: {
        userId: currentLead.homeownerId,
        type: "JOB_ACCEPTED",
        title: "Contractor Accepted Your Project!",
        message: `A professional contractor has accepted your project: "${currentLead.title}". Check your messages to discuss details and receive quotes.`,
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
        message: `You've accepted the project: "${currentLead.title}". You can now send quotes and discuss details with the homeowner through Messages.`,
        relatedId: jobId,
        relatedType: "job"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Job accepted successfully! You can now send quotes through messages.",
      acceptance: {
        id: acceptance.id,
        status: acceptance.status,
        message: acceptance.message,
        createdAt: acceptance.createdAt
      },
      conversation: {
        id: conversation.id
      },
      budget: currentLead.budget,
      spotsRemaining: 3 - updatedAccepted.length
    });

  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { error: "Failed to accept job" },
      { status: 500 }
    );
  }
}