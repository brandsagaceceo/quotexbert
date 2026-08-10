/**
 * GET /api/conversations/for-thread?threadId=...
 *
 * Thread → Conversation bridge.
 *
 * Finds an existing Conversation linked to this Thread's lead, or safely
 * creates one (upsert via the @@unique([jobId, homeownerId, contractorId]) index).
 *
 * The Conversation record is needed to use the Quote APIs, which require
 * conversationId. The Thread/Message schema is NOT changed.
 *
 * Guards:
 *   - Caller must be authenticated (Clerk session)
 *   - Caller must be the homeowner or contractor on the thread's lead
 *   - Lead must have a contractor assigned (no contractor = no Conversation needed)
 *
 * Returns:
 *   { conversationId, jobId, homeownerId, contractorId }
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // 1. Authenticate
  const authResult = await resolveAuthUser();
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { dbUserId } = authResult.user;

  // 2. Validate params
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "threadId is required" }, { status: 400 });
  }

  // 3. Load the thread with lead participant IDs
  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      lead: {
        select: {
          id: true,
          homeownerId: true,
          contractorId: true,
        },
      },
    },
  });

  if (!thread) {
    return NextResponse.json({ error: "Thread not found" }, { status: 404 });
  }

  const { lead } = thread;

  if (!lead.contractorId) {
    return NextResponse.json(
      { error: "No contractor assigned to this lead yet" },
      { status: 400 }
    );
  }

  // 4. Authorise — caller must be the homeowner, the lead's primary contractor
  //    (Lead.contractorId, set for the FIRST contractor to accept the job), OR
  //    another contractor who has legitimately accepted this job.
  //
  //    Root cause fix: the job-fairness system allows up to several contractors
  //    to accept/quote the same job, but Lead.contractorId only ever tracks the
  //    first one to claim it. Contractors #2/#3/etc. were being rejected here
  //    with 403 "Forbidden" whenever they tried to open Generate/Send Quote,
  //    even though they had a valid JobAcceptance on this lead. Fall back to
  //    checking JobAcceptance so every accepted contractor can reach their own
  //    quote conversation, not just the first claimer.
  let resolvedContractorId = lead.contractorId;
  if (dbUserId !== lead.homeownerId && dbUserId !== lead.contractorId) {
    const acceptance = await prisma.jobAcceptance.findUnique({
      where: { leadId_contractorId: { leadId: lead.id, contractorId: dbUserId } },
      select: { status: true },
    });
    const hasValidAcceptance =
      !!acceptance && ["accepted", "quoted", "selected"].includes((acceptance.status || "").toLowerCase());
    if (!hasValidAcceptance) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    // This caller is an accepted contractor other than the lead's primary
    // contractor — the Conversation/Quote must be attributed to THEM, not to
    // whoever happens to be Lead.contractorId.
    resolvedContractorId = dbUserId;
  }

  // 5. Find or create the Conversation using the @@unique index as the upsert key.
  //    prisma.conversation.upsert requires a @unique field — @@unique compound
  //    indexes aren't directly supported as upsert keys in Prisma, so we use
  //    findFirst + create inside a serializable transaction to avoid races.
  try {
    const conversation = await prisma.$transaction(async (tx) => {
      const existing = await tx.conversation.findFirst({
        where: {
          jobId: lead.id,
          homeownerId: lead.homeownerId,
          contractorId: resolvedContractorId!,
        },
        select: { id: true, jobId: true, homeownerId: true, contractorId: true },
      });

      if (existing) return existing;

      return tx.conversation.create({
        data: {
          jobId: lead.id,
          homeownerId: lead.homeownerId,
          contractorId: resolvedContractorId!,
          status: "active",
        },
        select: { id: true, jobId: true, homeownerId: true, contractorId: true },
      });
    });

    return NextResponse.json({
      conversationId: conversation.id,
      jobId: conversation.jobId,
      homeownerId: conversation.homeownerId,
      contractorId: conversation.contractorId,
    });
  } catch (error) {
    console.error("[GET /api/conversations/for-thread] Error:", error);
    return NextResponse.json(
      { error: "Failed to resolve conversation" },
      { status: 500 }
    );
  }
}
