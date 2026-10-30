import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId, clerkUserId } = authResult.user;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }
    if (userId !== dbUserId && userId !== clerkUserId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Count unread messages where the user is the receiver and readAt is null
    const unreadCount = await prisma.conversationMessage.count({
      where: {
        receiverId: dbUserId,
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