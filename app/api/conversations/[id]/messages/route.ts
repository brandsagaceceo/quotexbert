import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/email-notifications";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;

    // Get all messages for this conversation
    const messages = await prisma.conversationMessage.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(messages);

  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;
    const body = await request.json();
    
    const { senderId, receiverId, content, type = 'text' } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: senderId, receiverId, content" },
        { status: 400 }
      );
    }

    // Get conversation to validate and determine roles
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        homeowner: true,
        contractor: true,
        job: true
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Verify sender is part of conversation
    if (senderId !== conversation.homeownerId && senderId !== conversation.contractorId) {
      return NextResponse.json(
        { error: "Sender not part of this conversation" },
        { status: 403 }
      );
    }

    // Determine roles
    const senderRole = senderId === conversation.homeownerId ? 'homeowner' : 'contractor';
    const receiverRole = receiverId === conversation.homeownerId ? 'homeowner' : 'contractor';

    // Create message
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId,
        senderId,
        senderRole,
        receiverId,
        receiverRole,
        content,
        type
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        receiver: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Create in-app notification for receiver
    try {
      await prisma.notification.create({
        data: {
          userId: receiverId,
          type: 'NEW_MESSAGE',
          title: `New message from ${message.sender.name || 'User'}`,
          message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          payload: {
            conversationId,
            messageId: message.id,
            senderId,
            senderName: message.sender.name || message.sender.email
          },
          read: false
        }
      });
    } catch (notificationError) {
      console.error('Failed to create in-app notification:', notificationError);
    }

    // Send email notification to receiver
    try {
      const conversationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://quotexbert.com'}/messages/${conversationId}`;
      
      await sendEmailNotification({
        type: 'message_received',
        toEmail: message.receiver.email || '',
        data: {
          recipientId: receiverId,
          recipientName: message.receiver.name || null,
          senderName: message.sender.name || message.sender.email,
          jobTitle: conversation.job?.title || 'Job Conversation',
          messagePreview: content.substring(0, 100),
          conversationId,
          conversationUrl
        }
      });
      console.log(`📧 Email notification sent to ${message.receiver.email}`);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(message, { status: 201 });

  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}