import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/contractor-referral
 * Get contractor referral stats
 */
export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get referral stats (handle model not existing)
    let referrals: any[] = [];
    try {
      referrals = await (prisma as any).contractorReferral?.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' },
      }) || [];
    } catch (err) {
      console.log('[CONTRACTOR_REFERRAL] Model not available');
    }

    const totalReferrals = referrals.length;
    const signedUpCount = referrals.filter((r: any) => r.status === 'signed_up' || r.status === 'active').length;
    const totalRewards = referrals.reduce((sum: number, r: any) => sum + r.rewardEarned, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals,
        signedUpCount,
        totalRewards,
      },
      referrals,
      referralLink: `${process.env.NEXT_PUBLIC_URL || 'https://quotexbert.com'}/join-contractor?ref=${userId}`,
    });
  } catch (error) {
    console.error("[CONTRACTOR_REFERRAL_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/contractor-referral
 * Create a new contractor referral
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { referredEmail } = body;

    if (!referredEmail || !referredEmail.includes('@')) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if already referred
    let existing = null;
    try {
      existing = await (prisma as any).contractorReferral?.findFirst({
        where: {
          referrerId: userId,
          referredEmail: referredEmail.toLowerCase(),
        },
      });
    } catch (err) {
      console.log('[CONTRACTOR_REFERRAL] Model not available');
      return NextResponse.json(
        { error: "Referral system not configured" },
        { status: 501 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "You've already referred this email" },
        { status: 400 }
      );
    }

    // Create referral
    const referral = await (prisma as any).contractorReferral.create({
      data: {
        referrerId: userId,
        referredEmail: referredEmail.toLowerCase(),
        status: 'pending',
      },
    });

    // TODO: Send invitation email

    return NextResponse.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error("[CONTRACTOR_REFERRAL_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
