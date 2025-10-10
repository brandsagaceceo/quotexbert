import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get conversations where user is either homeowner or contractor
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { homeownerId: userId },
          { contractorId: userId }
        ]
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            category: true,
            status: true
          }
        },
        homeowner: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        contractor: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        messages: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                name: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: {
        lastMessageAt: "desc"
      }
    });

    // Transform conversations to include last message info and unread counts
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conversation) => {
        // Count unread messages in this conversation for the current user
        const unreadCount = await prisma.conversationMessage.count({
          where: {
            conversationId: conversation.id,
            receiverId: userId,
            readAt: null
          }
        });

        return {
          id: conversation.id,
          jobId: conversation.jobId,
          job: conversation.job,
          homeowner: conversation.homeowner,
          contractor: conversation.contractor,
          status: conversation.status,
          lastMessage: conversation.messages[0] || null,
          lastMessageAt: conversation.lastMessageAt,
          unreadCount,
          // Determine other participant for current user
          otherParticipant: userId === conversation.homeownerId ? conversation.contractor : conversation.homeowner
        };
      })
    );

    return NextResponse.json(conversationsWithDetails);

  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message, senderId } = await request.json();

    if (!conversationId || !message || !senderId) {
      return NextResponse.json(
        { error: "Conversation ID, message, and sender ID are required" },
        { status: 400 }
      );
    }

    // Get conversation details
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        homeowner: true,
        contractor: true
      }
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Determine receiver
    const receiverId = senderId === conversation.homeownerId ? 
      conversation.contractorId : conversation.homeownerId;
    
    const senderRole = senderId === conversation.homeownerId ? "homeowner" : "contractor";
    const receiverRole = receiverId === conversation.homeownerId ? "homeowner" : "contractor";

    // Create message
    const newMessage = await prisma.conversationMessage.create({
      data: {
        conversationId: conversationId,
        senderId: senderId,
        senderRole: senderRole,
        receiverId: receiverId,
        receiverRole: receiverRole,
        content: message,
        type: "text"
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

    // Update conversation last message time
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() }
    });

    // Create notification for recipient
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "NEW_MESSAGE",
        title: "New Message",
        message: `You have a new message about ${conversation.homeowner.name || conversation.contractor?.name || "your project"}`,
        relatedId: conversationId,
        relatedType: "conversation"
      }
    });

    return NextResponse.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}