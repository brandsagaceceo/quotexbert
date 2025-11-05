import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> }
) {
  try {
    const { threadId } = await params;

    if (!threadId) {
      return NextResponse.json(
        { error: 'Thread ID is required' },
        { status: 400 }
      );
    }

    // First, delete all messages in the thread
    await prisma.message.deleteMany({
      where: {
        threadId: threadId
      }
    });

    // Then delete the thread itself
    await prisma.thread.delete({
      where: {
        id: threadId
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}