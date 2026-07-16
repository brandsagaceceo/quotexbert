import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    // Authenticate the caller — ensures homeownerId matches the session
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: callerDbId } = authResult.user;

    const { applicationId, action, homeownerId } = await request.json();

    if (!applicationId || !action) {
      return NextResponse.json(
        { error: "Application ID and action are required" },
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

    // Verify homeowner owns this job — use the resolved DB id from auth
    if (application.lead.homeownerId !== callerDbId) {
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
      // Accept this contractor and reject all others.
      //
      // Race-safety: two "accept" requests for two different applications on the
      // same job could both pass the plain-read check above before either
      // transaction commits (classic check-then-act TOCTOU race — e.g. a homeowner
      // double-tapping "Select Contractor", or two browser tabs). To make this
      // atomic, the actual mutations below use conditional `updateMany` calls whose
      // WHERE clause re-verifies "still pending" / "still open for assignment" at
      // the database level and inspect the affected row count — if either
      // condition no longer holds by the time this transaction runs, we throw and
      // Prisma rolls back everything, and the caller gets a clear 409 instead of a
      // silently-corrupted double assignment.
      let conflict: "application" | "lead" | null = null;
      let thread: { id: string } | null = null;
      try {
        thread = await prisma.$transaction(async (tx) => {
          // Atomically claim this application — only succeeds if it is still "pending".
          const claimed = await tx.jobApplication.updateMany({
            where: { id: applicationId, status: "pending" },
            data: { status: "accepted" },
          });
          if (claimed.count !== 1) {
            conflict = "application";
            throw new Error("APPLICATION_CONFLICT");
          }

          // Atomically claim the lead — only succeeds if it's still assignable
          // (not already assigned/closed by a concurrent request).
          const claimedLead = await tx.lead.updateMany({
            where: { id: application.leadId, status: { in: ["open", "reviewing"] } },
            data: {
              status: "assigned",
              acceptedById: application.contractorId,
              contractorId: application.contractorId,
            },
          });
          if (claimedLead.count !== 1) {
            conflict = "lead";
            throw new Error("LEAD_CONFLICT");
          }

          // Reject all other pending applications for this job
          await tx.jobApplication.updateMany({
            where: {
              leadId: application.leadId,
              id: { not: applicationId },
              status: "pending"
            },
            data: { status: "rejected" }
          });

          // Create or find the messaging thread for this lead
          return tx.thread.upsert({
            where: { leadId: application.leadId },
            update: {},
            create: { leadId: application.leadId },
          });
        });
      } catch (txError) {
        if (conflict) {
          return NextResponse.json(
            {
              error:
                conflict === "application"
                  ? "This application was already accepted, withdrawn, or rejected by another request. Please refresh and try again."
                  : "This job is no longer available for assignment — it may have just been assigned to another contractor.",
            },
            { status: 409 }
          );
        }
        throw txError;
      }

      return NextResponse.json({
        success: true,
        message: `Contractor ${application.contractor.name} has been selected for this job`,
        threadId: thread!.id,
        redirectUrl: `/messages?threadId=${thread!.id}`,
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