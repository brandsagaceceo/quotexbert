import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId, clerkUserId } = authResult.user;
    const authenticatedIds = new Set([dbUserId, clerkUserId]);
    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get("userId");

    if (!requestedUserId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }
    if (!authenticatedIds.has(requestedUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const dbUserIds = [dbUserId];
    const currentUser = await prisma.user.findUnique({
      where: { id: dbUserId },
      select: { role: true },
    });
    const leadAccess = currentUser?.role === "contractor"
      ? {
          OR: [
            { acceptances: { some: { contractorId: dbUserId, status: { in: ["accepted", "quoted", "selected"] } } } },
            { applications: { some: { contractorId: dbUserId, status: { in: ["accepted", "in_progress", "completed"] } } } },
          ],
        }
      : { homeownerId: dbUserId };

    // The primary DB id is used for conversation partner comparison on the client
    const selfUserId = dbUserId;

    const conversations = await prisma.conversation.findMany({
      where: currentUser?.role === "contractor"
        ? { contractorId: dbUserId }
        : { homeownerId: dbUserId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            homeowner: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
          },
        },
        contractor: {
          include: {
            contractorProfile: { select: { companyName: true, profilePhoto: true } },
            homeownerProfile: { select: { name: true, profilePhoto: true } },
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
            receiver: {
              include: {
                contractorProfile: { select: { companyName: true, profilePhoto: true } },
                homeownerProfile: { select: { name: true, profilePhoto: true } },
              },
            },
          },
        },
        _count: {
          select: {
            messages: { where: { receiverId: dbUserId, readAt: null } },
          },
        },
      },
      orderBy: { lastMessageAt: "desc" },
    });

    const conversationThreads: any[] = conversations.map((conversation) => ({
      id: conversation.id,
      unreadCount: conversation._count.messages,
      createdAt: conversation.createdAt,
      lead: {
        id: conversation.job.id,
        title: conversation.job.title,
        homeowner: conversation.job.homeowner,
        contractor: conversation.contractor,
      },
      messages: conversation.messages.map((message) => ({
        id: message.id,
        body: message.content,
        createdAt: message.createdAt,
        readAt: message.readAt,
        fromUser: message.sender,
        toUser: message.receiver,
      })),
    }));

    // ── TEMP DEBUG: server-side identity trace ──
    if (process.env.NODE_ENV === 'development') {
      console.log('[API/threads][GET]', {
        inputUserId: requestedUserId,
        matchCount: 1,
        dbUserIds,
        selfUserId,
        idMatch: requestedUserId === selfUserId,
      });
    }

    // Get all threads where the user is involved (either as homeowner, contractor, or message participant)
    const legacyThreads = await prisma.thread.findMany({
      where: {
        OR: [
          { lead: { AND: [leadAccess, { conversations: { none: {} } }] } },
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
            // Needed so the client can resolve WHICH contractor a shared multi-
            // contractor thread's latest activity belongs to when the homeowner
            // sent the last message (not just when a contractor sent it).
            toUser: {
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
    const threads = [...conversationThreads, ...legacyThreads];
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
