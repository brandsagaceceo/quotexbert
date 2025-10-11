import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { applicationId, action, homeownerId } = await request.json();

    if (!applicationId || !action || !homeownerId) {
      return NextResponse.json(
        { error: "Application ID, action, and homeowner ID are required" },
        { status: 400 }
      );
    }

    if (!["accept", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'accept' or 'reject'" },
        { status: 400 }
      );
    }

    // Get the application with lead info
    const application = await prisma.jobApplication.findUnique({
      where: { id: applicationId },
      include: {
        lead: {
          include: {
            homeowner: true,
            applications: true
          }
        },
        contractor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Verify homeowner owns this job
    if (application.lead.homeownerId !== homeownerId) {
      return NextResponse.json(
        { error: "You can only manage applications for your own jobs" },
        { status: 403 }
      );
    }

    // Check if application is still pending
    if (application.status !== "pending") {
      return NextResponse.json(
        { error: "This application has already been processed" },
        { status: 400 }
      );
    }

    if (action === "accept") {
      // Accept this contractor and reject all others
      await prisma.$transaction(async (tx) => {
        // Update this application to accepted
        await tx.jobApplication.update({
          where: { id: applicationId },
          data: { status: "accepted" }
        });

        // Reject all other pending applications for this job
        await tx.jobApplication.updateMany({
          where: {
            leadId: application.leadId,
            id: { not: applicationId },
            status: "pending"
          },
          data: { status: "rejected" }
        });

        // Update the lead status and assign the contractor
        await tx.lead.update({
          where: { id: application.leadId },
          data: {
            status: "assigned",
            acceptedById: application.contractorId
          }
        });
      });

      return NextResponse.json({
        success: true,
        message: `Contractor ${application.contractor.name} has been selected for this job`,
        application: {
          id: application.id,
          status: "accepted",
          contractor: application.contractor
        }
      });

    } else if (action === "reject") {
      // Just reject this application
      await prisma.jobApplication.update({
        where: { id: applicationId },
        data: { status: "rejected" }
      });

      // Check if there are any remaining pending applications
      const remainingApplications = await prisma.jobApplication.findMany({
        where: {
          leadId: application.leadId,
          status: "pending"
        }
      });

      // If no more pending applications, set job back to open
      if (remainingApplications.length === 0) {
        await prisma.lead.update({
          where: { id: application.leadId },
          data: { status: "open" }
        });
      }

      return NextResponse.json({
        success: true,
        message: `Application from ${application.contractor.name} has been rejected`,
        application: {
          id: application.id,
          status: "rejected",
          contractor: application.contractor
        }
      });
    }

  } catch (error) {
    console.error("Error managing job application:", error);
    return NextResponse.json(
      { error: "Failed to process application" },
      { status: 500 }
    );
  }
}