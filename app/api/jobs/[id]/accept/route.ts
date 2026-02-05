import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead } from "@/lib/subscription-access";
import { canAccessLead as canAccessLeadGod } from "@/lib/god-access";

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
    const contractor = await prisma.user.findUnique({
      where: { id: contractorId }
    });

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found. Please sign in." },
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

    // Update acceptedContractors array
    const updatedAccepted = [...currentAcceptedList, contractorId];
    
    // If this is the 3rd contractor, close the job
    const newStatus = updatedAccepted.length >= 3 ? 'closed' : currentAcceptedList.length === 0 ? 'reviewing' : currentLead.status;
    
    await prisma.lead.update({
      where: { id: jobId },
      data: { 
        acceptedContractors: JSON.stringify(updatedAccepted),
        status: newStatus
      }
    });

    // Check if thread already exists for this lead
    let thread = await prisma.thread.findUnique({
      where: { leadId: jobId }
    });

    // Create thread if it doesn't exist
    if (!thread) {
      thread = await prisma.thread.create({
        data: {
          leadId: jobId
        }
      });
    }

    // Create initial messages in the thread for both parties
    
    // Message from contractor to homeowner
    await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: contractorId,
        toUserId: currentLead.homeownerId,
        body: `Hello! I've accepted your project "${currentLead.title}". I'm interested in providing you with a quote. Let's discuss the details so I can give you an accurate estimate.`
      }
    });

    // Welcome message from homeowner to contractor 
    await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: currentLead.homeownerId,
        toUserId: contractorId,
        body: `Thank you for accepting my project! I look forward to discussing the details and receiving your quote for "${currentLead.title}".`
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
      thread: {
        id: thread.id
      },
      budget: currentLead.budget,
      spotsRemaining: 3 - updatedAccepted.length,
      redirectUrl: `/messages?threadId=${thread.id}`
    });

  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { error: "Failed to accept job" },
      { status: 500 }
    );
  }
}