import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { email: true } });
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) return null;
  return user;
}

// Get all lead pricing
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  try {
    // Use raw SQL to fetch lead pricing
    const pricingData = await prisma.$queryRaw`
      SELECT * FROM lead_pricing ORDER BY trade, city
    `;

    return NextResponse.json(pricingData);
  } catch (error) {
    console.error("Error fetching lead pricing:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead pricing" },
      { status: 500 },
    );
  }
}

// Create or update lead pricing
export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  try {
    const body = await request.json();
    const { trade, city = "default", priceCents } = body;

    if (!trade || typeof priceCents !== "number") {
      return NextResponse.json(
        { error: "Trade and priceCents are required" },
        { status: 400 },
      );
    }

    // Use raw SQL to upsert the pricing
    await prisma.$executeRaw`
      INSERT INTO lead_pricing (id, trade, city, priceCents, createdAt, updatedAt)
      VALUES (lower(hex(randomblob(16))), ${trade}, ${city}, ${priceCents}, datetime('now'), datetime('now'))
      ON CONFLICT(trade, city) DO UPDATE SET 
        priceCents = ${priceCents},
        updatedAt = datetime('now')
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating/updating lead pricing:", error);
    return NextResponse.json(
      { error: "Failed to save lead pricing" },
      { status: 500 },
    );
  }
}

// Delete lead pricing
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trade = searchParams.get("trade");
    const city = searchParams.get("city") || "default";

    if (!trade) {
      return NextResponse.json({ error: "Trade is required" }, { status: 400 });
    }

    await prisma.$executeRaw`
      DELETE FROM lead_pricing 
      WHERE trade = ${trade} AND city = ${city}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting lead pricing:", error);
    return NextResponse.json(
      { error: "Failed to delete lead pricing" },
      { status: 500 },
    );
  }
}
