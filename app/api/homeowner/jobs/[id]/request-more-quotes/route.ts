import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import { notifyMatchingContractors } from "@/lib/notification-helpers";
import { canRequestMoreQuotes } from "@/lib/job-acceptance";

const QUOTE_STATUSES_TO_EXPIRE = ["sent", "revision_requested", "accepted"];

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const homeownerId = authResult.user.dbUserId;
    const resolvedParams = await params;
    const leadId = resolvedParams.id;

    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        homeownerId,
        isSeeded: false,
      },
      select: {
        id: true,
        title: true,
        status: true,
        acceptedById: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (!canRequestMoreQuotes(lead.status, lead.acceptedById)) {
      return NextResponse.json(
        { error: "Only active projects without a selected contractor can request more quotes" },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "open",
          published: true,
          acceptedById: null,
          contractorId: null,
        },
      });

      // Preserve quote history, but clear active-slot occupancy so new contractors can quote.
      await tx.quote.updateMany({
        where: {
          jobId: leadId,
          status: { in: QUOTE_STATUSES_TO_EXPIRE },
        },
        data: {
          status: "expired",
        },
      });

      await tx.notification.create({
        data: {
          userId: homeownerId,
          type: "job_reopened",
          title: "Project Reopened For More Quotes",
          message: `Your project "${lead.title}" is live again and new contractors can submit quotes.`,
          relatedId: leadId,
          relatedType: "job",
          payload: { leadId },
        },
      });
    });

    await notifyMatchingContractors(leadId);

    return NextResponse.json({
      success: true,
      message: "Your project has been reopened for more quotes.",
    });
  } catch (error) {
    console.error("Error requesting more quotes:", error);
    return NextResponse.json({ error: "Failed to request more quotes" }, { status: 500 });
  }
}
