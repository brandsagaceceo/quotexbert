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
        lead: {
          include: {
            homeowner: {
              select: {
                id: true,
                name: true,
                email: true,
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
    }) as any;

    // Transform to conversation format
    const conversations = acceptedJobs
      .filter((app: any) => app.lead.messages.length > 0)
      .map((app: any) => ({
        id: `${app.lead.id}-${contractorId}`,
        jobId: app.lead.id,
        jobTitle: app.lead.title,
        homeownerName: app.lead.homeowner.name || app.lead.homeowner.email.split('@')[0],
        homeownerId: app.lead.homeowner.id,
        lastMessage: app.lead.messages[0]?.content || 'No messages yet',
        lastMessageAt: app.lead.messages[0]?.createdAt.toISOString() || app.updatedAt.toISOString(),
        unreadCount: app.lead.messages.filter((m: any) => 
          m.senderId !== contractorId && !m.isRead
        ).length,
      }));

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
