import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  try {
    const { threadId } = await params;

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
        select: { id: true, name: true, email: true },
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

    // Send email notification to recipient
    try {
      const { sendNewMessageEmail } = await import('@/lib/email');
      await sendNewMessageEmail(
        {
          id: newMessage.toUser.id,
          email: newMessage.toUser.email,
          name: newMessage.toUser.contractorProfile?.companyName || newMessage.toUser.homeownerProfile?.name || newMessage.toUser.name
        },
        {
          name: senderName
        },
        message.substring(0, 100),
        threadId
      );
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    // Track analytics
    await logEventServer("message_sent", fromUserId, {
      threadId,
      messageId: newMessage.id,
      recipientId: toUserId,
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
