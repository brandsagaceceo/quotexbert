import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";

/** Resolve a caller-supplied userId (may be Clerk ID or DB UUID) to the DB User.id */
async function resolveDbUserId(userId: string): Promise<string> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { id: true },
  });
  return user?.id ?? userId; // Fall back to the provided value if not found
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');
  const userId = searchParams.get('userId');

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
  }

  try {
    // Resolve the caller's userId to DB UUID so the self-exclusion filter is
    // consistent regardless of whether a Clerk ID or DB UUID is passed.
    const excludeDbUserId = userId ? await resolveDbUserId(userId) : null;

    const typingIndicators = await prisma.typingIndicator.findMany({
      where: {
        threadId,
        expiresAt: { gt: new Date() },
        ...(excludeDbUserId ? { userId: { not: excludeDbUserId } } : {}),
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
    const { threadId, userId, action } = await request.json();

    if (!threadId || !userId || !action) {
      return NextResponse.json({
        error: 'Thread ID, User ID, and action are required',
      }, { status: 400 });
    }

    // Always store the resolved DB UUID — prevents mixed-format keys
    const dbUserId = await resolveDbUserId(userId);

    if (action === 'start') {
      const expiresAt = new Date(Date.now() + 5000); // 5 seconds — covers 2s poll interval plus network latency
      await prisma.typingIndicator.upsert({
        where: { threadId_userId: { threadId, userId: dbUserId } },
        create: { threadId, userId: dbUserId, expiresAt },
        update: { expiresAt },
      });
    } else if (action === 'stop') {
      // Delete by both old format (Clerk ID) and new format (DB UUID) to
      // clean up any stale rows from the pre-fix era.
      await prisma.typingIndicator.deleteMany({
        where: { threadId, userId: { in: [userId, dbUserId] } },
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