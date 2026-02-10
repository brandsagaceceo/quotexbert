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
        fromUser: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: {
              select: { companyName: true }
            },
            homeownerProfile: {
              select: { name: true }
            }
          }
        },
        toUser: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: {
              select: { companyName: true }
            },
            homeownerProfile: {
              select: { name: true }
            }
          }
        },
      },
    });

    // Get sender name for notification
    const senderName = newMessage.fromUser.contractorProfile?.companyName || 
                      newMessage.fromUser.homeownerProfile?.name || 
                      newMessage.fromUser.name || 
                      newMessage.fromUser.email;

    // Create in-app notification for the recipient
    await prisma.notification.create({
      data: {
        userId: toUserId,
        type: "NEW_MESSAGE",
        title: `New message from ${senderName}`,
        message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
        payload: {
          messageId: newMessage.id,
          threadId,
          fromUserId,
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
