import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;
    const { conversationId, userId } = await request.json();

    if (!conversationId || !userId) {
      return NextResponse.json(
        { error: "Conversation ID and User ID are required" },
        { status: 400 }
      );
    }

    const requestedUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { id: true },
    });
    if (!requestedUser || requestedUser.id !== dbUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

    // Mark all unread messages in this conversation as read for this user
    const updateResult = await prisma.conversationMessage.updateMany({
      where: {
        conversationId,
        receiverId: dbUserId,
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