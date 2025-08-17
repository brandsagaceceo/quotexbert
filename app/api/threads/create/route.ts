import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, userId } = body;

    if (!leadId) {
      return NextResponse.json({ error: "Lead ID required" }, { status: 400 });
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
    await logEventServer("thread_created", userId, {
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
