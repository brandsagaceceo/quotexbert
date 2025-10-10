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

    // Count unread messages where the user is the receiver and readAt is null
    const unreadCount = await prisma.conversationMessage.count({
      where: {
        receiverId: userId,
        readAt: null
      }
    });

    return NextResponse.json({ 
      unreadCount,
      userId 
    });

  } catch (error) {
    console.error("Error fetching unread message count:", error);
    return NextResponse.json(
      { error: "Failed to fetch unread message count" },
      { status: 500 }
    );
  }
}