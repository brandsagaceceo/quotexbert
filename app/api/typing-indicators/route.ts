import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuthUser } from '@/lib/server-auth';
import { isConversationParticipant, isLegacyThreadParticipant } from '@/lib/messaging-access';

export const dynamic = "force-dynamic";

async function getAccessibleHomeownerId(threadId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: threadId },
    select: { homeownerId: true, contractorId: true },
  });
  if (conversation) {
    return isConversationParticipant(userId, conversation) ? conversation.homeownerId : null;
  }

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    select: {
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
  if (!thread || (thread.lead.conversations.length > 0 && userId !== thread.lead.homeownerId)) {
    return null;
  }
  const contractorIds = [
    ...(thread.lead.contractorId ? [thread.lead.contractorId] : []),
    ...thread.lead.acceptances.map(({ contractorId }) => contractorId),
    ...thread.lead.applications.map(({ contractorId }) => contractorId),
  ];
  return isLegacyThreadParticipant(userId, thread.lead.homeownerId, contractorIds)
    ? thread.lead.homeownerId
    : null;
}

export async function GET(request: NextRequest) {
  const authResult = await resolveAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { dbUserId, clerkUserId } = authResult.user;
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');
  const requestedUserId = searchParams.get('userId');

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
  }
  if (requestedUserId && requestedUserId !== dbUserId && requestedUserId !== clerkUserId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const homeownerId = await getAccessibleHomeownerId(threadId, dbUserId);
    if (!homeownerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const typingIndicators = await prisma.typingIndicator.findMany({
      where: {
        threadId,
        expiresAt: { gt: new Date() },
        userId: dbUserId === homeownerId ? { not: dbUserId } : homeownerId,
      },
      include: {
        user: { select: { id: true, email: true } },
      },
    });

    return NextResponse.json({
      typingUsers: typingIndicators.map(indicator => ({
        userId: indicator.userId,
        email: indicator.user.email,
        startedAt: indicator.startedAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching typing indicators:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId, clerkUserId } = authResult.user;
    const { threadId, userId, action } = await request.json();

    if (!threadId || !userId || !action || !['start', 'stop'].includes(action)) {
      return NextResponse.json({
        error: 'Thread ID, User ID, and action are required',
      }, { status: 400 });
    }

    if (userId !== dbUserId && userId !== clerkUserId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (!await getAccessibleHomeownerId(threadId, dbUserId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (action === 'start') {
      const expiresAt = new Date(Date.now() + 5000); // 5 seconds — covers 2s poll interval plus network latency
      await prisma.typingIndicator.upsert({
        where: { threadId_userId: { threadId, userId: dbUserId } },
        create: { threadId, userId: dbUserId, expiresAt },
        update: { expiresAt },
      });
    } else if (action === 'stop') {
      await prisma.typingIndicator.deleteMany({
        where: { threadId, userId: { in: [dbUserId, clerkUserId] } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error managing typing indicator:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    // Clean up expired typing indicators (called periodically from client)
    await prisma.typingIndicator.deleteMany({
      where: { expiresAt: { lt: new Date() } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cleaning up typing indicators:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}