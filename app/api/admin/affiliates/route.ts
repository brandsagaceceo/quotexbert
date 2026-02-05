import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - List all affiliates with summary
export async function GET(request: NextRequest) {
  try {
    const affiliates = await prisma.$queryRaw`
      SELECT 
        a.code,
        COALESCE(SUM(CASE WHEN ac.status = 'unpaid' THEN ac.amount ELSE 0 END), 0) as "unpaidTotal",
        COALESCE(SUM(CASE WHEN ac.status = 'paid' THEN ac.amount ELSE 0 END), 0) as "paidTotal",
        COUNT(ac.id) as "commissionCount"
      FROM "Affiliate" a
      LEFT JOIN "AffiliateCommission" ac ON ac."affiliateId" = a.id
      GROUP BY a.id, a.code
      ORDER BY a.code
    ` as any[];

    return NextResponse.json({
      success: true,
      affiliates: affiliates.map(a => ({
        code: a.code,
        unpaidTotal: parseFloat(a.unpaidTotal) || 0,
        paidTotal: parseFloat(a.paidTotal) || 0,
        commissionCount: parseInt(a.commissionCount) || 0
      }))
    });
  } catch (error) {
    console.error("[Affiliates] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
