import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/affiliates/my-dashboard
 * Clerk-authenticated endpoint — finds the affiliate record for the signed-in user
 * by matching their email, then returns real commission stats.
 */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Get the user's email from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      return NextResponse.json({ success: false, error: "No email on account" }, { status: 400 });
    }

    // Find affiliate record by email
    const affiliate = await prisma.affiliate.findUnique({
      where: { email },
      include: {
        commissions: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });

    if (!affiliate) {
      return NextResponse.json({
        success: false,
        notAffiliate: true,
        error: "No affiliate account found for this email. Sign up at /affiliates to get your referral link.",
        signupUrl: "/affiliates",
      }, { status: 404 });
    }

    const referredUserIds = [...new Set(affiliate.commissions.map((c) => c.userId))];
    const pendingCommissions = affiliate.commissions
      .filter((c) => c.status === "pending")
      .reduce((sum, c) => sum + c.amount, 0);
    const paidCommissions = affiliate.commissions
      .filter((c) => c.status === "paid")
      .reduce((sum, c) => sum + c.amount, 0);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const estimatedMonthly = affiliate.commissions
      .filter((c) => new Date(c.createdAt) >= thirtyDaysAgo)
      .reduce((sum, c) => sum + c.amount, 0);

    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com";

    return NextResponse.json({
      success: true,
      affiliate: {
        referralCode: affiliate.referralCode,
        name: affiliate.name,
        email: affiliate.email,
        payoutPercent: affiliate.payoutPercent,
        createdAt: affiliate.createdAt,
        referralUrl: `${baseUrl}/?ref=${affiliate.referralCode}`,
      },
      stats: {
        referralCode: affiliate.referralCode,
        totalReferrals: referredUserIds.length,
        totalCommissions: affiliate.commissions.length,
        pendingCommissions: Math.round(pendingCommissions * 100) / 100,
        paidCommissions: Math.round(paidCommissions * 100) / 100,
        estimatedMonthly: Math.round(estimatedMonthly * 100) / 100,
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
    console.error("[My Affiliate Dashboard] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard" }, { status: 500 });
  }
}
