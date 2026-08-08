import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import { canWithdrawFromJob } from "@/lib/job-acceptance";

const ACTIVE_QUOTE_STATUSES = new Set(["sent", "revision_requested", "accepted"]);

function parseAcceptedContractors(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const contractorId = authResult.user.dbUserId;
    const resolvedParams = await params;
    const leadId = resolvedParams.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId, isSeeded: false },
      select: {
        id: true,
        title: true,
        homeownerId: true,
        status: true,
        acceptedById: true,
        acceptedContractors: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const acceptance = await prisma.jobAcceptance.findUnique({
      where: {
        leadId_contractorId: {
          leadId,
          contractorId,
        },
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!acceptance || !canWithdrawFromJob(acceptance.status || "", lead.acceptedById, contractorId)) {
      return NextResponse.json(
        { error: "Only pre-selection job interest can be withdrawn" },
        { status: 409 }
      );
    }

    const thread = await prisma.thread.findUnique({
      where: { leadId },
      select: { id: true },
    });

    await prisma.$transaction(async (tx) => {
      await tx.jobAcceptance.update({
        where: { id: acceptance.id },
        data: { status: "withdrawn" },
      });

      await tx.quote.updateMany({
        where: {
          jobId: leadId,
          contractorId,
          status: { in: Array.from(ACTIVE_QUOTE_STATUSES) },
        },
        data: {
          status: "withdrawn",
        },
      });

      const acceptedContractors = parseAcceptedContractors(lead.acceptedContractors);
      const updatedAccepted = acceptedContractors.filter((id) => id !== contractorId);

      const leadUpdate: Record<string, unknown> = {
        acceptedContractors: JSON.stringify(updatedAccepted),
      };

      await tx.lead.update({
        where: { id: leadId },
        data: leadUpdate,
      });

      await tx.notification.create({
        data: {
          userId: lead.homeownerId,
          type: "job_withdrawn",
          title: "Contractor Withdrew From Your Project",
          message: `A contractor withdrew from "${lead.title}". Your project remains active and can receive additional quotes.`,
          relatedId: leadId,
          relatedType: "job",
          payload: {
            leadId,
          },
        },
      });

      if (thread) {
        await tx.message.create({
          data: {
            threadId: thread.id,
            fromUserId: contractorId,
            toUserId: lead.homeownerId,
            body: `I’m withdrawing from your project "${lead.title}" at this time. Thank you for the opportunity.`,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "You have withdrawn from this job.",
    });
  } catch (error) {
    console.error("Error withdrawing from job:", error);
    return NextResponse.json({ error: "Failed to withdraw from job" }, { status: 500 });
  }
}
