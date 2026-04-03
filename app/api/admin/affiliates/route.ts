import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all affiliates with summary
// Note: AffiliateCommission table does not exist in schema — returns affiliates only.
export async function GET(request: NextRequest) {
  try {
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
