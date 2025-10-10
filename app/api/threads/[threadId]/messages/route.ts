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
        fromUser: true,
        toUser: true,
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

    // Create the message
    const newMessage = await prisma.message.create({
      data: {
        threadId,
        fromUserId,
        toUserId,
        body: message,
      },
      include: {
        fromUser: true,
        toUser: true,
      },
    });

    // Create notification for the recipient
    await prisma.notification.create({
      data: {
        userId: toUserId,
        type: "new_message",
        title: "New Message",
        message: `You have a new message from ${newMessage.fromUser.email}`,
        payload: {
          messageId: newMessage.id,
          fromUserName: newMessage.fromUser.email,
          preview: message.substring(0, 100),
        }
      }
    });

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
