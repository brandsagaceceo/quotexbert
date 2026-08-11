import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Resolve ALL DB user IDs for this user (handles webhook-created vs /api/user/role-created users).
    const matchingUsers = await prisma.user.findMany({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { id: true },
    });
    const dbUserIds = matchingUsers.map((u) => u.id);
    if (!dbUserIds.includes(userId)) dbUserIds.push(userId);

    // The primary DB id is used for conversation partner comparison on the client
    const selfUserId = matchingUsers[0]?.id || userId;

    // ── TEMP DEBUG: server-side identity trace ──
    if (process.env.NODE_ENV === 'development') {
      console.log('[API/threads][GET]', {
        inputUserId: userId,
        matchCount: matchingUsers.length,
        dbUserIds,
        selfUserId,
        idMatch: userId === selfUserId,
      });
    }

    // Get all threads where the user is involved (either as homeowner, contractor, or message participant)
    const threads = await prisma.thread.findMany({
      where: {
        OR: [
          // User is the homeowner of the lead
          { lead: { homeownerId: { in: dbUserIds } } },
          // User is the contractor of the lead
          { lead: { contractorId: { in: dbUserIds } } },
          // User has sent or received messages in this thread
          {
            messages: {
              some: {
                OR: [
                  { fromUserId: { in: dbUserIds } },
                  { toUserId: { in: dbUserIds } },
                ],
              },
            },
          },
        ],
      },
      include: {
        lead: {
          include: {
            homeowner: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
            contractor: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            fromUser: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                toUserId: { in: dbUserIds },
                readAt: null,
              },
            },
          },
        },
      },
      // Thread.createdAt never changes after creation — sorting by it here would
      // freeze the list in first-accepted order forever. Real activity order is
      // computed below (latest message time, which also captures quote activity
      // once it's posted as a Thread message) and applied via a JS sort instead.
      orderBy: {
        createdAt: "desc",
      },
    });

    // Sort by most recent activity — latest message time if any messages exist
    // (this also reflects quote sends/revisions/acceptances, which post a Thread
    // message), falling back to thread creation time for threads with no messages yet.
    const sorted = [...threads].sort((a, b) => {
      const aTime = a.messages[0]?.createdAt ?? a.createdAt;
      const bTime = b.messages[0]?.createdAt ?? b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    // Attach unreadCount as a top-level field for convenience
    const threadsWithUnread = sorted.map((t) => ({
      ...t,
      unreadCount: t._count.messages,
      _count: undefined,
    }));

    return NextResponse.json({ threads: threadsWithUnread, selfUserId });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}
