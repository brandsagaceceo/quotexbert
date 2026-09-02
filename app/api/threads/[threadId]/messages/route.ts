import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";
import { resolveAuthUser } from "@/lib/server-auth";

const ACTIVE_ACCEPTANCE_STATUSES = ['accepted', 'quoted', 'selected'];
const ACTIVE_APPLICATION_STATUSES = ['accepted', 'in_progress', 'completed'];

async function getThreadParticipants(threadId: string) {
  return prisma.thread.findUnique({
    where: { id: threadId },
    select: {
      lead: {
        select: {
          homeownerId: true,
          acceptances: {
            where: { status: { in: ACTIVE_ACCEPTANCE_STATUSES } },
            select: { contractorId: true },
          },
          applications: {
            where: { status: { in: ACTIVE_APPLICATION_STATUSES } },
            select: { contractorId: true },
          },
          conversations: { select: { id: true } },
        },
      },
    },
  });
}

async function getConversation(conversationId: string) {
  return prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      jobId: true,
      homeownerId: true,
      contractorId: true,
    },
  });
}

const conversationUserInclude = {
  contractorProfile: { select: { companyName: true, profilePhoto: true } },
  homeownerProfile: { select: { name: true, profilePhoto: true } },
};

function isThreadParticipant(
  thread: Awaited<ReturnType<typeof getThreadParticipants>>,
  userId: string,
) {
  if (!thread) return false;
  const { homeownerId, acceptances, applications } = thread.lead;
  return homeownerId === userId ||
    acceptances.some((acceptance) => acceptance.contractorId === userId) ||
    applications.some((application) => application.contractorId === userId);
}

function isMigratedLegacyThread(thread: Awaited<ReturnType<typeof getThreadParticipants>>) {
  return !!thread?.lead.conversations.length;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const { threadId } = await params;

    const conversation = await getConversation(threadId);
    if (conversation) {
      if (dbUserId !== conversation.homeownerId && dbUserId !== conversation.contractorId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const conversationMessages = await prisma.conversationMessage.findMany({
        where: { conversationId: conversation.id },
        include: {
          sender: { include: conversationUserInclude },
          receiver: { include: conversationUserInclude },
        },
        orderBy: { createdAt: "asc" },
      });

      return NextResponse.json({
        messages: conversationMessages.map((message) => ({
          id: message.id,
          body: message.content,
          createdAt: message.createdAt,
          readAt: message.readAt,
          fromUser: message.sender,
          toUser: message.receiver,
        })),
      });
    }

    const thread = await getThreadParticipants(threadId);

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    if (isMigratedLegacyThread(thread) && dbUserId !== thread.lead.homeownerId) {
      return NextResponse.json(
        { error: "This legacy shared thread is archived. Use your contractor-specific conversation." },
        { status: 403 },
      );
    }

    if (!isThreadParticipant(thread, dbUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { threadId },
      include: {
        fromUser: {
          include: {
            contractorProfile: { select: { companyName: true, profilePhoto: true } },
            homeownerProfile: { select: { name: true, profilePhoto: true } },
          },
        },
        toUser: {
          include: {
            contractorProfile: { select: { companyName: true, profilePhoto: true } },
            homeownerProfile: { select: { name: true, profilePhoto: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    // Authenticate the caller
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: callerDbId } = authResult.user;

    const { threadId } = await params;
    const body = await request.json();
    const { fromUserId, toUserId, message } = body;

    if (!fromUserId || !toUserId || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Resolve both user IDs to DB UUIDs — callers may pass Clerk IDs for
    // webhook-created accounts where User.id is a UUID and User.clerkUserId
    // holds the Clerk ID.
    const [fromUser, toUser] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: [{ id: fromUserId }, { clerkUserId: fromUserId }] },
        select: {
          id: true, name: true, email: true,
          contractorProfile: { select: { companyName: true } },
          homeownerProfile: { select: { name: true } },
        },
      }),
      prisma.user.findFirst({
        where: { OR: [{ id: toUserId }, { clerkUserId: toUserId }] },
        select: { id: true, name: true, email: true, notifyMessageEmail: true },
      }),
    ]);

    if (!fromUser) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }
    if (!toUser) {
      return NextResponse.json({ error: "Recipient not found" }, { status: 404 });
    }

    const dbFromUserId = fromUser.id;
    const dbToUserId = toUser.id;

    const conversation = await getConversation(threadId);
    if (conversation) {
      if (
        callerDbId !== dbFromUserId ||
        (callerDbId !== conversation.homeownerId && callerDbId !== conversation.contractorId) ||
        (dbToUserId !== conversation.homeownerId && dbToUserId !== conversation.contractorId) ||
        dbFromUserId === dbToUserId
      ) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const newConversationMessage = await prisma.conversationMessage.create({
        data: {
          conversationId: conversation.id,
          senderId: dbFromUserId,
          senderRole: dbFromUserId === conversation.homeownerId ? "homeowner" : "contractor",
          receiverId: dbToUserId,
          receiverRole: dbToUserId === conversation.homeownerId ? "homeowner" : "contractor",
          content: message,
          type: "text",
        },
        include: {
          sender: { include: conversationUserInclude },
          receiver: { include: conversationUserInclude },
        },
      });

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      await prisma.notification.create({
        data: {
          userId: dbToUserId,
          type: "NEW_MESSAGE",
          title: `New message from ${fromUser.contractorProfile?.companyName || fromUser.homeownerProfile?.name || fromUser.name || fromUser.email}`,
          message: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
          payload: {
            messageId: newConversationMessage.id,
            conversationId: conversation.id,
            fromUserId: dbFromUserId,
            contractorId: conversation.contractorId,
          },
          read: false,
        },
      });

      if (toUser.notifyMessageEmail !== false) {
        try {
          const { sendNewMessageEmail } = await import("@/lib/email");
          await sendNewMessageEmail(
            {
              id: newConversationMessage.receiver.id,
              email: newConversationMessage.receiver.email,
              name: newConversationMessage.receiver.contractorProfile?.companyName || newConversationMessage.receiver.homeownerProfile?.name || newConversationMessage.receiver.name,
            },
            {
              id: dbFromUserId,
              name: fromUser.contractorProfile?.companyName || fromUser.homeownerProfile?.name || fromUser.name || fromUser.email,
            },
            message.substring(0, 100),
            conversation.id,
          );
        } catch (emailError) {
          console.error("Failed to send conversation message email:", emailError);
        }
      }

      return NextResponse.json({
        message: {
          id: newConversationMessage.id,
          body: newConversationMessage.content,
          createdAt: newConversationMessage.createdAt,
          readAt: newConversationMessage.readAt,
          fromUser: newConversationMessage.sender,
          toUser: newConversationMessage.receiver,
        },
      });
    }

    const thread = await getThreadParticipants(threadId);
    if (isMigratedLegacyThread(thread)) {
      return NextResponse.json(
        { error: "This legacy shared thread is archived. Select a contractor-specific conversation." },
        { status: 409 },
      );
    }
    if (!thread || !isThreadParticipant(thread, callerDbId) || !isThreadParticipant(thread, dbToUserId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Security: verify the authenticated caller IS the sender
    if (dbFromUserId !== callerDbId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[API/messages][POST] 403 FORBIDDEN', { callerDbId, dbFromUserId, clientFromUserId: fromUserId });
      }
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ── TEMP DEBUG: server-side send trace ──
    if (process.env.NODE_ENV === 'development') {
      console.log('[API/messages][POST]', {
        threadId,
        callerDbId,
        clientFromUserId: fromUserId,
        resolvedFromUserId: dbFromUserId,
        clientToUserId: toUserId,
        resolvedToUserId: dbToUserId,
        callerMatchesSender: dbFromUserId === callerDbId,
      });
    }

    // Prevent self-messaging
    if (dbFromUserId === dbToUserId) {
      return NextResponse.json({ error: "Cannot send message to yourself" }, { status: 400 });
    }

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        threadId,
        fromUserId: dbFromUserId,
        toUserId: dbToUserId,
        body: message,
      },
      include: {
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: { select: { companyName: true, profilePhoto: true } },
            homeownerProfile: { select: { name: true, profilePhoto: true } },
          },
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: { select: { companyName: true, profilePhoto: true } },
            homeownerProfile: { select: { name: true, profilePhoto: true } },
          },
        },
      },
    });

    // Get sender name for notification
    const senderName = fromUser.contractorProfile?.companyName ||
                      fromUser.homeownerProfile?.name ||
                      fromUser.name ||
                      fromUser.email;

    // Create in-app notification for the recipient — never notify the sender
    await prisma.notification.create({
      data: {
        userId: dbToUserId,
        type: "NEW_MESSAGE",
        title: `New message from ${senderName}`,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        payload: {
          messageId: newMessage.id,
          threadId,
          fromUserId: dbFromUserId,
          senderName,
          preview: message.substring(0, 100),
        },
        read: false
      }
    });

    // Send email notification to recipient (skipped if they opted out)
    if (toUser.notifyMessageEmail !== false) {
      try {
        const { sendNewMessageEmail } = await import('@/lib/email');
        await sendNewMessageEmail(
          {
            id: newMessage.toUser.id,
            email: newMessage.toUser.email,
            name: newMessage.toUser.contractorProfile?.companyName || newMessage.toUser.homeownerProfile?.name || newMessage.toUser.name
          },
          {
            name: senderName,
            // Lets the email CTA include &contractorId= so a shared multi-contractor
            // thread opens the right person instead of the thread's primary contractor.
            id: dbFromUserId,
          },
          message.substring(0, 100),
          threadId
        );
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Track analytics — always log resolved DB IDs
    await logEventServer("message_sent", dbFromUserId, {
      threadId,
      messageId: newMessage.id,
      recipientId: dbToUserId,
    });

    return NextResponse.json({ message: newMessage });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/threads/[threadId]/messages
 * Mark all unread messages in a thread as read for a given viewer.
 * Requires an authenticated session. The session user must match viewerUserId.
 * Body: { viewerUserId: string }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

    // Verify authentication
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: callerDbId } = authResult.user;

    const body = await request.json();
    const { viewerUserId } = body as { viewerUserId?: string };

    if (!viewerUserId) {
      return NextResponse.json({ error: "viewerUserId required" }, { status: 400 });
    }

    // Resolve the supplied viewerUserId to a DB UUID
    const viewer = await prisma.user.findFirst({
      where: { OR: [{ id: viewerUserId }, { clerkUserId: viewerUserId }] },
      select: { id: true },
    });
    if (!viewer) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const dbViewerId = viewer.id;

    // Security: the authenticated session must match the viewer being marked as read
    if (dbViewerId !== callerDbId) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[API/messages][PATCH] 403 FORBIDDEN mark-read', { callerDbId, dbViewerId, clientViewerUserId: viewerUserId });
      }
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const conversation = await getConversation(threadId);
    if (conversation) {
      if (dbViewerId !== conversation.homeownerId && dbViewerId !== conversation.contractorId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      await prisma.conversationMessage.updateMany({
        where: { conversationId: conversation.id, receiverId: dbViewerId, readAt: null },
        data: { readAt: new Date() },
      });
      return NextResponse.json({ success: true });
    }

    const legacyThread = await getThreadParticipants(threadId);
    if (legacyThread && isMigratedLegacyThread(legacyThread) && dbViewerId !== legacyThread.lead.homeownerId) {
      return NextResponse.json({ error: "Legacy shared thread access is archived" }, { status: 403 });
    }

    const now = new Date();

    // Mark all messages sent TO this viewer in this thread as read
    const markResult = await prisma.message.updateMany({
      where: {
        threadId,
        toUserId: dbViewerId,
        readAt: null,
      },
      data: { readAt: now },
    });

    // ── TEMP DEBUG: server-side mark-read trace ──
    if (process.env.NODE_ENV === 'development') {
      console.log('[API/messages][PATCH] mark-read', {
        threadId,
        callerDbId,
        dbViewerId,
        messagesMarked: markResult.count,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 },
    );
  }
}
