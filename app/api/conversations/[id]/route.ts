import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { resolveAuthUser } from '@/lib/server-auth';

const prisma = new PrismaClient();

/**
 * GET /api/conversations/[id]
 * Returns the jobId for a conversation — used by /messages to resolve ?conversationId= URL params.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await resolveAuthUser();
  if ('error' in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }
  const { dbUserId } = authResult.user;

  const resolvedParams = await params;
  const conversationId = resolvedParams.id;

  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { id: true, jobId: true, homeownerId: true, contractorId: true },
    });

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Only participants can look up this conversation
    if (dbUserId !== conversation.homeownerId && dbUserId !== conversation.contractorId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      jobId: conversation.jobId,
      homeownerId: conversation.homeownerId,
      contractorId: conversation.contractorId,
    });
  } catch (error) {
    console.error('[GET /api/conversations/[id]] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;

    // First delete all messages in the conversation
    await prisma.conversationMessage.deleteMany({
      where: {
        conversationId: conversationId
      }
    });

    // Then delete the conversation itself
    await prisma.conversation.delete({
      where: {
        id: conversationId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}