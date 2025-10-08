import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get('threadId');
  const userId = searchParams.get('userId');

  if (!threadId) {
    return NextResponse.json({ error: 'Thread ID required' }, { status: 400 });
  }

  try {
    // Get current typing indicators for this thread
    // Exclude expired ones (older than 3 seconds)
    const typingIndicators = await prisma.typingIndicator.findMany({
      where: {
        threadId,
        expiresAt: {
          gt: new Date()
        },
        ...(userId ? { userId: { not: userId } } : {}) // Exclude current user
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({
      typingUsers: typingIndicators.map(indicator => ({
        userId: indicator.userId,
        email: indicator.user.email,
        startedAt: indicator.startedAt
      }))
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
        error: 'Thread ID, User ID, and action are required' 
      }, { status: 400 });
    }

    if (action === 'start') {
      // Create or update typing indicator
      const expiresAt = new Date(Date.now() + 3000); // 3 seconds from now
      
      await prisma.typingIndicator.upsert({
        where: {
          threadId_userId: {
            threadId,
            userId
          }
        },
        create: {
          threadId,
          userId,
          expiresAt
        },
        update: {
          expiresAt
        }
      });

    } else if (action === 'stop') {
      // Remove typing indicator
      await prisma.typingIndicator.deleteMany({
        where: {
          threadId,
          userId
        }
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
    // Clean up expired typing indicators
    await prisma.typingIndicator.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cleaning up typing indicators:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}