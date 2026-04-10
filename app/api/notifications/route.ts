import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Resolve a Clerk ID or DB UUID to all matching DB user IDs */
async function resolveUserIds(userId: string): Promise<string[]> {
  const matches = await prisma.user.findMany({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { id: true },
  });
  const ids = matches.map((u) => u.id);
  // Always include the raw value as a fallback (e.g. already a DB UUID)
  if (!ids.includes(userId)) ids.push(userId);
  return ids;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userIds = await resolveUserIds(userId);

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: { in: userIds } },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.notification.count({
        where: { userId: { in: userIds }, read: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationId, markAllAsRead } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const userIds = await resolveUserIds(userId);

    if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: { in: userIds },
          read: false,
        },
        data: {
          read: true,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (!notificationId) {
      return NextResponse.json({ error: "Notification ID required" }, { status: 400 });
    }

    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId: { in: userIds },
      },
    });

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });

    return NextResponse.json({ success: true, notification: updatedNotification });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
