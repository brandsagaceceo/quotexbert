import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/leads/[id]/mark-complete
 *
 * Contractor marks the work as done. Does NOT close the job or unlock reviews —
 * it only notifies the homeowner and asks them to confirm. Reviews/ratings and
 * the final "completed" status only happen after homeowner confirmation
 * (see /api/leads/[id]/confirm-complete).
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
    const { dbUserId: contractorId } = authResult.user;

    const lead = await prisma.lead.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        status: true,
        contractorId: true,
        homeownerId: true,
        contractorCompletedAt: true,
        isSeeded: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Only the contractor formally hired for this job can mark it complete
    if (!lead.contractorId || lead.contractorId !== contractorId) {
      return NextResponse.json(
        { error: "You are not the hired contractor for this job" },
        { status: 403 },
      );
    }

    if (lead.status !== "assigned") {
      // Idempotent: already marked / already confirmed — don't error, just report current state
      if (lead.status === "pending_completion" || lead.status === "completed") {
        return NextResponse.json({
          success: true,
          message: "Job already marked as complete",
          status: lead.status,
        });
      }
      return NextResponse.json(
        { error: "Job must be in progress (assigned) before it can be marked complete" },
        { status: 400 },
      );
    }

    const updated = await prisma.lead.update({
      where: { id },
      data: {
        status: "pending_completion",
        contractorCompletedAt: new Date(),
      },
    });

    // Notify homeowner — one in-app notification, no duplicate email/in-app pair needed here
    if (!lead.isSeeded) {
      await prisma.notification.create({
        data: {
          userId: lead.homeownerId,
          type: "JOB_MARKED_COMPLETE",
          title: "Contractor marked your job as complete",
          message: `Your contractor marked "${lead.title}" as complete. Please confirm to close out the project.`,
          relatedId: lead.id,
          relatedType: "job",
        },
      }).catch((err) => console.error("Failed to create completion notification:", err));
    }

    return NextResponse.json({
      success: true,
      message: "Job marked as complete. Waiting for homeowner confirmation.",
      status: updated.status,
    });
  } catch (error) {
    console.error("Error marking job complete:", error);
    return NextResponse.json({ error: "Failed to mark job complete" }, { status: 500 });
  }
}
