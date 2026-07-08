import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const adminUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!adminUser || !ADMIN_EMAILS.includes(adminUser.email.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }

    const logs = await prisma.$queryRaw`
      SELECT id, type, "eventId", processed, error, "createdAt"
      FROM stripe_webhook_logs
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;

    return NextResponse.json({ logs });

  } catch (error) {
    console.error("[ADMIN] Error fetching webhook logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhook logs" },
      { status: 500 }
    );
  }
}
