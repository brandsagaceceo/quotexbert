import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** GET /api/affiliates/dashboard?code=REFERRAL_CODE */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code || !/^[a-zA-Z0-9_-]{4,30}$/.test(code)) {
    return NextResponse.json(
      { success: false, error: "Valid referral code is required" },
      { status: 400 }
    );
  }

  try {
    const affiliate = await prisma.affiliate.findUnique({
      where: { referralCode: code },
      include: {
        commissions: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: "Referral code not found" },
        { status: 404 }
      );
    }

    // Count unique contractors referred (distinct userId in commissions)
    const referredUserIds = [...new Set(affiliate.commissions.map((c) => c.userId))];

    // Aggregate commission totals
    const pendingCommissions = affiliate.commissions
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + c.amount, 0);

    const paidCommissions = affiliate.commissions
      .filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + c.amount, 0);

    // Estimate monthly earnings: commissions earned in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentCommissions = affiliate.commissions
      .filter((c) => new Date(c.createdAt) >= thirtyDaysAgo)
      .reduce((sum, c) => sum + c.amount, 0);

    return NextResponse.json({
      success: true,
      affiliate: {
        referralCode: affiliate.referralCode,
        name: affiliate.name,
        email: affiliate.email,
        payoutPercent: affiliate.payoutPercent,
        createdAt: affiliate.createdAt,
        referralUrl: `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/?ref=${affiliate.referralCode}`,
      },
      stats: {
        totalReferrals: referredUserIds.length,
        totalCommissions: affiliate.commissions.length,
        pendingCommissions: Math.round(pendingCommissions * 100) / 100,
        paidCommissions: Math.round(paidCommissions * 100) / 100,
        estimatedMonthly: Math.round(recentCommissions * 100) / 100,
        totalEarned: Math.round((pendingCommissions + paidCommissions) * 100) / 100,
      },
      recentCommissions: affiliate.commissions.slice(0, 12).map((c) => ({
        id: c.id,
        amount: c.amount,
        rate: c.rate,
        period: c.period,
        status: c.status,
        createdAt: c.createdAt,
      })),
    });
  } catch (error) {
    console.error("[Affiliate Dashboard] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard" },
      { status: 500 }
    );
  }
}
