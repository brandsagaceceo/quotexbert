import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET — fetch current user notification preferences
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        notifyJobEmail: true,
        notifyJobInApp: true,
        notifyMessageEmail: true,
        notifyMessageInApp: true,
        notifyMarketingEmail: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[NOTIFICATION SETTINGS] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
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
      where: { id: userId },
      data,
      select: {
        notifyJobEmail: true,
        notifyJobInApp: true,
        notifyMessageEmail: true,
        notifyMessageInApp: true,
        notifyMarketingEmail: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("[NOTIFICATION SETTINGS] PATCH error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
