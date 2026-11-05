import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailNotification } from "@/lib/email-notifications";
import { updateContractorResponseTime } from "@/lib/responseTime";
import { resolveAuthUser } from "@/lib/server-auth";
import { isConversationMessagePair } from "@/lib/messaging-access";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { homeownerId: true, contractorId: true },
    });
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    if (dbUserId !== conversation.homeownerId && dbUserId !== conversation.contractorId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all messages for this exact conversation
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
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const resolvedParams = await params;
    const conversationId = resolvedParams.id;
    const body = await request.json();
    
    const { senderId, receiverId, content, type = 'text' } = body;

    if (!senderId || !receiverId || typeof content !== "string" || !content) {
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

    const [requestedSender, requestedReceiver] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: [{ id: senderId }, { clerkUserId: senderId }] },
        select: { id: true },
      }),
      prisma.user.findFirst({
        where: { OR: [{ id: receiverId }, { clerkUserId: receiverId }] },
        select: { id: true },
      }),
    ]);

    // Verify the requested sender maps to the session identity and both
    // participants belong to this exact contractor-specific conversation.
    if (!requestedSender || requestedSender.id !== dbUserId || !requestedReceiver ||
        !isConversationMessagePair(dbUserId, requestedReceiver.id, conversation)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Determine roles
    const senderRole = dbUserId === conversation.homeownerId ? 'homeowner' : 'contractor';
    const receiverRole = requestedReceiver.id === conversation.homeownerId ? 'homeowner' : 'contractor';

    // Create message
    const message = await prisma.conversationMessage.create({
      data: {
        conversationId,
        senderId: dbUserId,
        senderRole,
        receiverId: requestedReceiver.id,
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

    // Fetch receiver notification preferences (default true if not found)
    const receiverPrefs = await prisma.user.findUnique({
      where: { id: requestedReceiver.id },
      select: { notifyMessageInApp: true, notifyMessageEmail: true }
    }).catch(() => null);

    // Create in-app notification for receiver (skipped if opted out)
    if (receiverPrefs?.notifyMessageInApp !== false) {
      try {
        await prisma.notification.create({
          data: {
            userId: requestedReceiver.id,
            type: 'NEW_MESSAGE',
            title: `New message from ${message.sender.name || 'User'}`,
            message: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
            payload: {
              conversationId,
              messageId: message.id,
              senderId: dbUserId,
              senderName: message.sender.name || message.sender.email
            },
            read: false
          }
        });
      } catch (notificationError) {
        console.error('Failed to create in-app notification:', notificationError);
      }
    }

    // Send email notification to receiver (skipped if opted out)
    if (receiverPrefs?.notifyMessageEmail !== false) {
      try {
        const conversationUrl = `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/messages/${conversationId}`;
        
        await sendEmailNotification({
          type: 'message_received',
          toEmail: message.receiver.email || '',
          data: {
            recipientId: requestedReceiver.id,
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
    }

    // Update contractor response time metrics if contractor sent the message
    if (senderRole === 'contractor') {
      try {
        // Run asynchronously without blocking the response
        updateContractorResponseTime(dbUserId).catch(err => {
          console.error('Error updating contractor response time:', err);
        });
      } catch (responseTimeError) {
        console.error('Failed to trigger response time update:', responseTimeError);
        // Don't fail the request if this fails
      }
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