import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const contractorId = searchParams.get('contractorId');

    if (!contractorId || contractorId !== userId) {
      return NextResponse.json({ error: 'Invalid contractor ID' }, { status: 403 });
    }

    // Fetch conversations where contractor has accepted the job
    const acceptedJobs = await prisma.jobApplication.findMany({
      where: {
        contractorId,
        status: {
          in: ['accepted', 'in_progress', 'completed']
        }
      },
      include: {
        job: {
          include: {
            homeowner: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePhoto: true,
              }
            },
            messages: {
              orderBy: {
                createdAt: 'desc'
              },
              take: 1
            }
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform to conversation format
    const conversations = acceptedJobs
      .filter(app => app.job.messages.length > 0) // Only jobs with messages
      .map(app => ({
        id: `${app.job.id}-${contractorId}`,
        jobId: app.job.id,
        jobTitle: app.job.title,
        homeownerName: app.job.homeowner.name || app.job.homeowner.email.split('@')[0],
        homeownerId: app.job.homeowner.id,
        homeownerPhoto: app.job.homeowner.profilePhoto,
        lastMessage: app.job.messages[0]?.content || 'No messages yet',
        lastMessageAt: app.job.messages[0]?.createdAt.toISOString() || app.updatedAt.toISOString(),
        unreadCount: app.job.messages.filter(m => 
          m.senderId !== contractorId && !m.isRead
        ).length,
      }));

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
