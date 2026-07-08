import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const caller = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ userId: null, message: "User not found" });
    }

    return NextResponse.json({ userId: user.id, email: user.email });

  } catch (error) {
    console.error("[ADMIN] Error looking up user:", error);
    return NextResponse.json(
      { error: "Failed to look up user" },
      { status: 500 }
    );
  }
}
