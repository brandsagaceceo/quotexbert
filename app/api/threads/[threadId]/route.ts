import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuthUser } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    // 1. Authenticate via Clerk session
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }
    const { dbUserId } = authResult.user;

    const { threadId } = await params;
    if (!threadId) {
      return NextResponse.json({ error: 'Thread ID is required' }, { status: 400 });
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: threadId },
      select: { id: true, homeownerId: true, contractorId: true },
    });
    if (conversation) {
      if (dbUserId !== conversation.homeownerId && dbUserId !== conversation.contractorId) {
        return NextResponse.json({ error: 'You are not a participant in this conversation' }, { status: 403 });
      }
      await prisma.conversation.delete({ where: { id: conversation.id } });
      return NextResponse.json({ success: true });
    }

    // 2. Load thread with participant IDs for ownership check
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        lead: {
          select: {
            homeownerId: true,
            contractorId: true,
            conversations: { select: { id: true } },
            acceptances: {
              where: { status: { in: ['accepted', 'quoted', 'selected'] } },
              select: { contractorId: true },
            },
            applications: {
              where: { status: { in: ['accepted', 'in_progress', 'completed'] } },
              select: { contractorId: true },
            },
          },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    if (thread.lead.conversations.length > 0) {
      return NextResponse.json(
        { error: 'Legacy shared threads with isolated conversations are read-only' },
        { status: 409 },
      );
    }

    // 3. Resolve participants from the lead relationship, not message content.
    const participantIds = new Set<string>();
    if (thread.lead.homeownerId) participantIds.add(thread.lead.homeownerId);
    if (thread.lead.contractorId) participantIds.add(thread.lead.contractorId);
    thread.lead.acceptances.forEach(({ contractorId }) => participantIds.add(contractorId));
    thread.lead.applications.forEach(({ contractorId }) => participantIds.add(contractorId));

    const isParticipant = participantIds.has(dbUserId);

    if (!isParticipant) {
      return NextResponse.json(
        { error: 'You are not a participant in this thread' },
        { status: 403 }
      );
    }

    // 4. Cascade delete messages then thread
    await prisma.message.deleteMany({ where: { threadId } });
    await prisma.typingIndicator.deleteMany({ where: { threadId } });
    await prisma.thread.delete({ where: { id: threadId } });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json({ error: 'Failed to delete thread' }, { status: 500 });
  }
}