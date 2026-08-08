import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead } from "@/lib/subscription-access";
import { isGodUser } from "@/lib/god-access";
import { sendJobAcceptedEmail } from "@/lib/email";
import { countPendingAcceptedLeads, MAX_PENDING_ACCEPTED_LEADS_PER_CONTRACTOR } from "@/lib/job-acceptance";
import { resolveAuthUser } from "@/lib/server-auth";

function parseAcceptedContractors(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contractorId = authResult.user.dbUserId;
    const { message } = await request.json();
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    // Get the lead and check if it exists
    const currentLead = await prisma.lead.findUnique({
      where: { id: jobId, isSeeded: false },
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

    // Allow acceptance when status is open, claimed, or reviewing (up to 3 contractors)
    const acceptableStatuses = ['open', 'claimed', 'reviewing'];
    if (!acceptableStatuses.includes(currentLead.status)) {
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

    const contractor = await prisma.user.findUnique({
      where: { id: contractorId }
    });

    if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json(
        { error: "Active contractor access required" },
        { status: 403 }
      );
    }

    // God users bypass subscription checks
    const isGod = isGodUser(contractor.email || "");
    
    // Use the authenticated DB id for all subsequent operations.
    const dbContractorId = contractor.id;
    
    if (!isGod) {
      // Check if contractor has subscription for this category (only for non-god users)
      const hasAccess = await canAccessLead(dbContractorId, currentLead.category);
      if (!hasAccess) {
        return NextResponse.json(
          { error: "You need an active subscription for this category to accept jobs" },
          { status: 403 }
        );
      }
    }

    // Check current accepted contractors
    const currentAcceptedList = parseAcceptedContractors(currentLead.acceptedContractors);
    
    // Check if contractor already accepted
    if (currentAcceptedList.includes(dbContractorId)) {
      return NextResponse.json(
        { error: "You have already accepted this job" },
        { status: 400 }
      );
    }

    const pendingAcceptedLeads = await countPendingAcceptedLeads(dbContractorId);
    if (pendingAcceptedLeads >= MAX_PENDING_ACCEPTED_LEADS_PER_CONTRACTOR) {
      return NextResponse.json(
        {
          error:
            "You already have 3 pending accepted leads without submitted quotes. Submit a quote or withdraw from one of them to accept another job.",
        },
        { status: 400 }
      );
    }

    // Check if this is the first claim
    const isFirstClaim = !currentLead.claimed && currentAcceptedList.length === 0;

    const existingAcceptance = await prisma.jobAcceptance.findUnique({
      where: {
        leadId_contractorId: {
          leadId: jobId,
          contractorId: dbContractorId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (existingAcceptance && ['accepted', 'quoted', 'selected'].includes((existingAcceptance.status || '').toLowerCase())) {
      return NextResponse.json(
        { error: 'You have already accepted this job' },
        { status: 400 }
      );
    }

    // Create job acceptance record (contractor already verified above)
    const acceptance = existingAcceptance
      ? await prisma.jobAcceptance.update({
          where: { id: existingAcceptance.id },
          data: {
            message: message || null,
            status: 'accepted',
            quoteAmount: null,
            estimatedDays: null,
          },
        })
      : await prisma.jobAcceptance.create({
          data: {
            leadId: jobId,
            contractorId: dbContractorId,
            message: message || null,
            status: "accepted"
          }
        });

    // Update acceptedContractors array
    const updatedAccepted = [...currentAcceptedList, dbContractorId];
    
    // Accepting interest should never close the board listing.
    let newStatus = currentLead.status;
    if (newStatus === 'open' || newStatus === 'claimed') {
      newStatus = 'reviewing';
    }
    
    // Prepare update data
    const leadUpdateData: any = {
      acceptedContractors: JSON.stringify(updatedAccepted),
      claimed: true,
      status: newStatus
    };

    // If this is the first claim, set claiming fields
    if (isFirstClaim) {
      leadUpdateData.claimedBy = dbContractorId;
      leadUpdateData.claimedAt = new Date();
      // Also set contractorId so the Thread's lead.contractor relation is populated,
      // which lets the homeowner see who accepted their job in Messages.
      leadUpdateData.contractorId = dbContractorId;
    }
    
    await prisma.lead.update({
      where: { id: jobId },
      data: leadUpdateData
    });

    // Get or create thread for this lead (upsert prevents race if two contractors accept simultaneously)
    const thread = await prisma.thread.upsert({
      where: { leadId: jobId },
      update: {},
      create: { leadId: jobId },
    });

    // Create initial messages in the thread for both parties
    
    // Message from contractor to homeowner
    await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: dbContractorId,
        toUserId: currentLead.homeownerId,
        body: `Hello! I've accepted your project "${currentLead.title}". I'm interested in providing you with a quote. Let's discuss the details so I can give you an accurate estimate.`
      }
    });

    // Welcome message from homeowner to contractor 
    await prisma.message.create({
      data: {
        threadId: thread.id,
        fromUserId: currentLead.homeownerId,
        toUserId: dbContractorId,
        body: `Thank you for accepting my project! I look forward to discussing the details and receiving your quote for "${currentLead.title}".`
      }
    });

    // Create notification for homeowner — includes threadId so Alerts page deep-links to /messages
    await prisma.notification.create({
      data: {
        userId: currentLead.homeownerId,
        type: "JOB_ACCEPTED",
        title: "Contractor Accepted Your Project!",
        message: `A professional contractor has accepted your project: "${currentLead.title}". Check your messages to discuss details and receive quotes.`,
        relatedId: jobId,
        relatedType: "job",
        payload: {
          threadId: thread.id,
          jobId,
          jobTitle: currentLead.title,
        }
      }
    });

    // Send email notification to homeowner using new email template
    try {
      // Get contractor details for email
      const contractorProfile = await prisma.contractorProfile.findUnique({
        where: { userId: dbContractorId },
        select: { companyName: true, trade: true }
      });

      await sendJobAcceptedEmail(
        {
          id: currentLead.homeownerId,
          name: currentLead.homeowner.name || 'Homeowner',
          email: currentLead.homeowner.email,
        },
        {
          name: contractor.name || contractor.email,
          companyName: contractorProfile?.companyName || contractor.name || contractor.email,
        },
        {
          id: currentLead.id,
          title: currentLead.title,
          category: currentLead.category,
        }
      );
    } catch (emailError) {
      console.error('Failed to send job accepted email to homeowner:', emailError);
      // Don't fail the request if email fails
    }

    // NOTE: We intentionally do NOT create a notification for the contractor here.
    // The actor should not receive an in-app alert for their own action — the UI
    // (redirect to /messages and success toast) is sufficient feedback.

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
      pendingAcceptedLeads: pendingAcceptedLeads + 1,
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