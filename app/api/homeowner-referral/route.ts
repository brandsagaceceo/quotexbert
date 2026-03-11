import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/homeowner-referral
 * Get homeowner referral stats
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

    // Get referral stats
    let referrals: any[] = [];
    try {
      referrals = await (prisma as any).homeownerReferral?.findMany({
        where: { referrerId: userId },
        orderBy: { createdAt: 'desc' },
      }) || [];
    } catch (err) {
      console.log('[HOMEOWNER_REFERRAL] Model not available');
    }

    const totalInvited = referrals.length;
    const estimatesGenerated = referrals.reduce((sum: number, r: any) => sum + r.estimateCount, 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalInvited,
        estimatesGenerated,
      },
      referrals,
      shareLink: `${process.env.NEXT_PUBLIC_URL || 'https://quotexbert.com'}/?ref=${userId}`,
    });
  } catch (error) {
    console.error("[HOMEOWNER_REFERRAL_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/homeowner-referral/track
 * Track when a referred user generates an estimate
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { referrerId } = body;

    if (!referrerId) {
      return NextResponse.json(
        { error: "Referrer ID is required" },
        { status: 400 }
      );
    }

    // Create or update referral
    try {
      const referral = await (prisma as any).homeownerReferral?.create({
        data: {
          referrerId,
          status: 'estimated',
          estimateCount: 1,
        },
      });

      return NextResponse.json({
        success: true,
        referral,
      });
    } catch (err) {
      console.log('[HOMEOWNER_REFERRAL] Model not available');
      return NextResponse.json(
        { error: "Referral system not configured" },
        { status: 501 }
      );
    }
  } catch (error) {
    console.error("[HOMEOWNER_REFERRAL_TRACK]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
