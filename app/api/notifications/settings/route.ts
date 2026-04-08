import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PREF_SELECT = {
  notifyJobEmail: true,
  notifyJobInApp: true,
  notifyMessageEmail: true,
  notifyMessageInApp: true,
  notifyMarketingEmail: true,
} as const;

const SAFE_DEFAULTS = {
  notifyJobEmail: true,
  notifyJobInApp: true,
  notifyMessageEmail: true,
  notifyMessageInApp: true,
  notifyMarketingEmail: false,
};

/**
 * Find user by DB id first, then fall back to clerkUserId.
 * Legacy accounts have a cuid `id` with Clerk ID stored in `clerkUserId`.
 * New accounts created via /api/user/role use `id = clerkUserId`.
 */
async function findUserForNotifications(userId: string) {
  let user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, ...PREF_SELECT } });
  if (!user) {
    user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { id: true, ...PREF_SELECT } });
    if (user) console.log(`[NOTIFICATION SETTINGS] Resolved user by clerkUserId fallback: ${user.id}`);
  }
  return user;
}

// GET — fetch current user notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await findUserForNotifications(userId);

    // Return safe defaults if user not found — avoids "Unable to load settings" UI error
    if (!user) {
      console.warn(`[NOTIFICATION SETTINGS] User not found for userId: ${userId} — returning defaults`);
      return NextResponse.json(SAFE_DEFAULTS);
    }

    const { id: _id, ...prefs } = user as any;
    return NextResponse.json(prefs);
  } catch (error) {
    console.error("[NOTIFICATION SETTINGS] GET error:", error);
    return NextResponse.json(SAFE_DEFAULTS);
  }
}

// PATCH — update notification preferences
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...prefs } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // Resolve DB id (handles legacy cuid ids vs Clerk ids)
    const user = await findUserForNotifications(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const resolvedId = (user as any).id;

    // Only allow known preference fields
    const allowed = [
      "notifyJobEmail",
      "notifyJobInApp",
      "notifyMessageEmail",
      "notifyMessageInApp",
      "notifyMarketingEmail",
    ] as const;

    const data: Record<string, boolean> = {};
    for (const key of allowed) {
      if (typeof prefs[key] === "boolean") {
        data[key] = prefs[key];
      }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid preferences provided" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: resolvedId },
      data,
      select: PREF_SELECT,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[NOTIFICATION SETTINGS] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
