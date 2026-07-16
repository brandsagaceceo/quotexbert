import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leads/[id]/confirm-complete
 *
 * Homeowner confirms the contractor's work is done. This is the ONLY action that:
 *  - moves the job to status "completed"
 *  - unlocks the homeowner -> contractor review
 *  - unlocks the private contractor -> homeowner experience rating
 *  - moves the contractor into "Recently Used Contractors"
 *  - bumps the contractor's completedJobs counter
 *
 * Idempotent — calling it again after completion just returns the current state.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: homeownerId } = authResult.user;

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        contractorId: true,
        homeownerId: true,
        isSeeded: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (lead.homeownerId !== homeownerId) {
      return NextResponse.json(
        { error: "You can only confirm completion for your own jobs" },
        { status: 403 },
      );
    }

    if (lead.status === "completed") {
      return NextResponse.json({
        success: true,
        message: "Job already confirmed as complete",
        status: "completed",
      });
    }

    if (lead.status !== "pending_completion") {
      return NextResponse.json(
        { error: "The contractor must mark the job complete before you can confirm it" },
        { status: 400 },
      );
    }

    const now = new Date();
    const updated = await prisma.$transaction(async (tx) => {
      const updatedLead = await tx.lead.update({
        where: { id },
        data: {
          status: "completed",
          completedAt: now,
          homeownerConfirmedAt: now,
        },
      });

      if (lead.contractorId) {
        await tx.contractorProfile.updateMany({
          where: { userId: lead.contractorId },
          data: { completedJobs: { increment: 1 } },
        });
      }

      return updatedLead;
    });

    // Notify contractor — job is confirmed complete, prompt them to rate the homeowner
    if (!lead.isSeeded && lead.contractorId) {
      await prisma.notification.create({
        data: {
          userId: lead.contractorId,
          type: "JOB_COMPLETION_CONFIRMED",
          title: "Homeowner confirmed job completion",
          message: `"${lead.title}" has been confirmed complete. You can now share a private rating of your experience.`,
          relatedId: lead.id,
          relatedType: "job",
        },
      }).catch((err) => console.error("Failed to create confirmation notification:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Job confirmed complete. You can now leave a review.",
      status: updated.status,
    });
  } catch (error) {
    console.error("Error confirming job completion:", error);
    return NextResponse.json({ error: "Failed to confirm job completion" }, { status: 500 });
  }
}
