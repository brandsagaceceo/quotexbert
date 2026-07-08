import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

// GET - List all affiliates with summary
// Note: AffiliateCommission table does not exist in schema — returns affiliates only.
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const caller = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { email: true } });
    if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const affiliates = await prisma.affiliate.findMany({
      orderBy: { referralCode: "asc" },
      select: {
        id: true,
        referralCode: true,
        name: true,
        email: true,
        payoutPercent: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      affiliates: affiliates.map((a) => ({
        code: a.referralCode,
        name: a.name ?? null,
        email: a.email ?? null,
        payoutPercent: a.payoutPercent,
        // Commission tracking not yet implemented
        unpaidTotal: 0,
        paidTotal: 0,
        commissionCount: 0,
      })),
    });
  } catch (error) {
    console.error("[Affiliates] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
