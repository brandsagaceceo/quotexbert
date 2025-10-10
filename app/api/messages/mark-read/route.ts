import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "Conversation ID and User ID are required" },
        { status: 400 }
      );
    }

    // Mark all unread messages in this conversation as read for this user
    const updateResult = await prisma.conversationMessage.updateMany({
      where: {
        conversationId,
        receiverId: userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true,
      markedAsRead: updateResult.count
    });

  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  }
}