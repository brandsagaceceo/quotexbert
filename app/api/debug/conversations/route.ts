import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export async function GET() {
  // Block entirely in production
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Check if conversations exist
    const conversations = await prisma.conversation.findMany({
      include: {
        job: true,
        homeowner: true,
        contractor: true,
        messages: true
      }
    });

    return NextResponse.json({
      count: conversations.length,
      conversations
    });

  } catch (error) {
    console.error("Error checking conversations:", error);
    return NextResponse.json(
      { error: "Failed to check conversations" },
      { status: 500 }
    );
  }
}