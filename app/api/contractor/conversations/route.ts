import { NextResponse } from 'next/server';

export const dynamic = "force-dynamic";
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

    if (!contractorId) {
      return NextResponse.json({ error: 'Invalid contractor ID' }, { status: 403 });
    }

    // Resolve all DB user IDs for this contractor (handles both UUID and Clerk ID paths)
    const matchingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { id: contractorId },
          { clerkUserId: contractorId },
          { id: userId },
          { clerkUserId: userId },
        ]
      },
      select: { id: true }
    });
    const contractorDbIds = matchingUsers.map(u => u.id);

    if (contractorDbIds.length === 0) {
      return NextResponse.json({ success: true, conversations: [] });
    }

    // Fetch threads via JobAcceptance (direct accept flow) and JobApplication (application flow)
    const [jobAcceptances, jobApplications] = await Promise.all([
      prisma.jobAcceptance.findMany({
        where: {
          contractorId: { in: contractorDbIds },
          status: { in: ['accepted', 'quoted', 'selected', 'in_progress', 'completed'] }
        },
        include: {
          lead: {
            include: {
              homeowner: { select: { id: true, name: true, email: true } },
              Thread: {
                include: {
                  messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.jobApplication.findMany({
        where: {
          contractorId: { in: contractorDbIds },
          status: { in: ['accepted', 'in_progress', 'completed'] }
        },
        include: {
          lead: {
            include: {
              homeowner: { select: { id: true, name: true, email: true } },
              Thread: {
                include: {
                  messages: { orderBy: { createdAt: 'desc' }, take: 1 }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    ]);

    // Combine sources, deduplicate by lead ID
    const allAccepted: any[] = [...jobAcceptances, ...jobApplications];
    const seenLeadIds = new Set<string>();
    const uniqueAccepted = allAccepted.filter(item => {
      if (seenLeadIds.has(item.lead.id)) return false;
      seenLeadIds.add(item.lead.id);
      return true;
    });

    // Transform to conversation format — only include leads that have a thread with messages
    const conversations = uniqueAccepted
      .filter(item => (item.lead.Thread?.messages?.length ?? 0) > 0)
      .map(item => {
        const thread = item.lead.Thread;
        const lastMsg = thread?.messages?.[0];
        const dbContractorId = item.contractorId;
        return {
          id: `${item.lead.id}-${dbContractorId}`,
          jobId: item.lead.id,
          jobTitle: item.lead.title,
          homeownerName: item.lead.homeowner.name || item.lead.homeowner.email.split('@')[0],
          homeownerId: item.lead.homeowner.id,
          lastMessage: lastMsg?.body || 'No messages yet',
          lastMessageAt: lastMsg?.createdAt?.toISOString() || item.updatedAt.toISOString(),
          unreadCount: 0, // simplified — full unread count available on /messages page
        };
      });

    return NextResponse.json({ success: true, conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}

