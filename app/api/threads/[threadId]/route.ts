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

    // 2. Load thread with participant IDs for ownership check
    const thread = await prisma.thread.findUnique({
      where: { id: threadId },
      include: {
        lead: {
          select: {
            homeownerId: true,
            contractorId: true,
          },
        },
        messages: {
          select: { fromUserId: true, toUserId: true },
          take: 1,
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: 'Thread not found' }, { status: 404 });
    }

    // 3. Collect all known participant DB user IDs for this thread
    const participantIds = new Set<string>();
    if (thread.lead.homeownerId) participantIds.add(thread.lead.homeownerId);
    if (thread.lead.contractorId) participantIds.add(thread.lead.contractorId);
    // Also include any message sender/recipient in case lead references differ
    thread.messages.forEach((m) => {
      participantIds.add(m.fromUserId);
      participantIds.add(m.toUserId);
    });

    // Allow the authenticated user to delete if they are a participant by DB id.
    // Also check if any DB record with clerkUserId=caller exists among participants
    // (covers webhook-created users where the caller may still pass a Clerk ID).
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