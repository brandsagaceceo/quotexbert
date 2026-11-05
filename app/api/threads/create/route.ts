import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";
import { resolveAuthUser } from "@/lib/server-auth";
import { isLegacyThreadParticipant } from "@/lib/messaging-access";

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const body = await request.json();
    const { leadId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        homeownerId: true,
        contractorId: true,
        acceptances: {
          where: { status: { in: ["accepted", "quoted", "selected", "in_progress", "completed"] } },
          select: { contractorId: true },
        },
        applications: {
          where: { status: { in: ["accepted", "in_progress", "completed"] } },
          select: { contractorId: true },
        },
      },
    });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const contractorIds = [
      ...(lead.contractorId ? [lead.contractorId] : []),
      ...lead.acceptances.map(({ contractorId }) => contractorId),
      ...lead.applications.map(({ contractorId }) => contractorId),
    ];
    if (!isLegacyThreadParticipant(dbUserId, lead.homeownerId, contractorIds)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if thread already exists
    const existingThread = await prisma.thread.findUnique({
      where: { leadId },
    });

    if (existingThread) {
      return NextResponse.json({ thread: existingThread });
    }

    // Create new thread
    const thread = await prisma.thread.create({
      data: {
        leadId,
      },
      include: {
        lead: {
          include: {
            homeowner: true,
            contractor: true,
          },
        },
      },
    });

    // Track analytics
    await logEventServer("thread_created", dbUserId, {
      threadId: thread.id,
      leadId: thread.leadId,
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("Error creating thread:", error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 },
    );
  }
}
