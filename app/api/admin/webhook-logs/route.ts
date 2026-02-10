import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = ['brandsagaceo@gmail.com', 'quotexbert@gmail.com'];

export async function GET(request: NextRequest) {
  try {
    // Check authorization header or implement your own auth check
    // For now, we'll just return the data (should add proper auth)
    
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
