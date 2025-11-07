import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canAccessLead } from "@/lib/subscription-access";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { contractorId, message, proposedPrice, estimatedDays } = await request.json();
    const resolvedParams = await params;
    const leadId = resolvedParams.id;

    if (!leadId || !contractorId) {
      return NextResponse.json(
        { error: "Lead ID and Contractor ID are required" },
        { status: 400 }
      );
    }

    // Get the lead and check if it exists and is open for applications
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        applications: true,
        homeowner: {
          select: { name: true, email: true }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    if (lead.status !== "open") {
      return NextResponse.json(
        { error: "This job is no longer accepting applications" },
        { status: 400 }
      );
    }

    if (!lead.published) {
      return NextResponse.json(
        { error: "This job is not yet published" },
        { status: 400 }
      );
    }

    // Check if contractor has subscription for this category
    const hasAccess = await canAccessLead(contractorId, lead.category);
    if (!hasAccess) {
      return NextResponse.json(
        { error: "You need an active subscription for this category to apply" },
        { status: 403 }
      );
    }

    // Check if contractor already applied
    const existingApplication = lead.applications.find(
      app => app.contractorId === contractorId
    );

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 400 }
      );
    }

    // Check if job has reached maximum applications
    const activeApplications = lead.applications.filter(
      app => app.status === "pending"
    );

    if (activeApplications.length >= lead.maxContractors) {
      return NextResponse.json(
        { error: "This job has reached the maximum number of applications" },
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

    // Create the job application
    const application = await prisma.jobApplication.create({
      data: {
        leadId,
        contractorId,
        message: message || null,
        proposedPrice: proposedPrice || null,
        estimatedDays: estimatedDays ? parseInt(estimatedDays) : null,
        status: "pending"
      },
      include: {
        contractor: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: true
          }
        }
      }
    });

    // Update lead status if this is the first application
    if (activeApplications.length === 0) {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: "reviewing" }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully!",
      application: {
        id: application.id,
        status: application.status,
        message: application.message,
        proposedPrice: application.proposedPrice,
        estimatedDays: application.estimatedDays,
        contractor: application.contractor,
        createdAt: application.createdAt
      }
    });

  } catch (error) {
    console.error("Error submitting job application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}

// Get applications for a specific job (for homeowner to view)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const leadId = resolvedParams.id;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 }
      );
    }

    // Get the lead to verify ownership or access
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        applications: {
          include: {
            contractor: {
              select: {
                id: true,
                name: true,
                email: true,
                contractorProfile: {
                  select: {
                    companyName: true,
                    phone: true,
                    trade: true,
                    bio: true,
                    avgRating: true,
                    reviewCount: true
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        homeowner: {
          select: { id: true, name: true }
        }
      }
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // Check if user is the homeowner who posted this job
    if (userId && lead.homeownerId !== userId) {
      return NextResponse.json(
        { error: "You can only view applications for your own jobs" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      applications: lead.applications,
      jobInfo: {
        id: lead.id,
        title: lead.title,
        status: lead.status,
        maxContractors: lead.maxContractors,
        applicationsCount: lead.applications.length
      }
    });

  } catch (error) {
    console.error("Error fetching job applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}