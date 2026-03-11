import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/contractor-leaderboard
 * Fetch top contractors by performance metrics
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const sortBy = searchParams.get("sortBy") || "rating"; // 'rating' | 'jobs' | 'responseTime'

    // Get all contractor profiles with metrics
    let contractors = await prisma.contractorProfile.findMany({
      where: {
        verified: true,
        user: {
          isActive: true,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            displayName: true,
          },
        },
      },
      take: 100, // Get top 100 first
    });

    // Try to get response time data if it exists
    // Using raw query to handle fields that may not exist pre-migration
    const contractorIds = contractors.map(c => c.userId);
    let responseTimeData: any[] = [];
    
    try {
      responseTimeData = await prisma.$queryRaw<any[]>`
        SELECT 
          "userId",
          "avgResponseTimeMinutes",
          "completedJobs"
        FROM "contractor_profiles"
        WHERE "userId" = ANY(${contractorIds})
        AND "avgResponseTimeMinutes" IS NOT NULL
        ORDER BY "avgResponseTimeMinutes" ASC
      `;
    } catch (error) {
      console.log("Response time fields not available yet");
    }

    // Create map for quick lookup
    const responseTimeMap = new Map(
      responseTimeData.map(rt => [rt.userId, rt])
    );

    // Enrich contractors with response time data
    const enrichedContractors = contractors.map(contractor => ({
      id: contractor.id,
      userId: contractor.userId,
      companyName: contractor.companyName,
      slug: contractor.slug,
      trade: contractor.trade,
      city: contractor.city,
      verified: contractor.verified,
      avgRating: contractor.avgRating,
      reviewCount: contractor.reviewCount,
      completedJobs: responseTimeMap.get(contractor.userId)?.completedJobs || 0,
      avgResponseTimeMinutes: responseTimeMap.get(contractor.userId)?.avgResponseTimeMinutes || null,
      displayName: contractor.user.displayName || contractor.user.name || 'Anonymous',
    }));

    // Sort based on criteria
    let sorted = [...enrichedContractors];
    
    if (sortBy === 'rating') {
      sorted = sorted
        .filter(c => c.reviewCount > 0) // Must have reviews
        .sort((a, b) => {
          if (b.avgRating !== a.avgRating) {
            return b.avgRating - a.avgRating;
          }
          return b.reviewCount - a.reviewCount; // Tiebreaker
        });
    } else if (sortBy === 'jobs') {
      sorted = sorted
        .filter(c => c.completedJobs > 0)
        .sort((a, b) => b.completedJobs - a.completedJobs);
    } else if (sortBy === 'responseTime') {
      sorted = sorted
        .filter(c => c.avgResponseTimeMinutes !== null && c.avgResponseTimeMinutes > 0)
        .sort((a, b) => (a.avgResponseTimeMinutes || Infinity) - (b.avgResponseTimeMinutes || Infinity));
    }

    // Take top N
    const topContractors = sorted.slice(0, Math.min(limit, 50));

    // Add rank
    const leaderboard = topContractors.map((contractor, index) => ({
      rank: index + 1,
      ...contractor,
      responseTimeLabel: contractor.avgResponseTimeMinutes
        ? contractor.avgResponseTimeMinutes < 60
          ? `${contractor.avgResponseTimeMinutes}m`
          : `${Math.round(contractor.avgResponseTimeMinutes / 60)}h`
        : 'N/A',
    }));

    return NextResponse.json({
      success: true,
      leaderboard,
      sortedBy: sortBy,
    });
  } catch (error) {
    console.error("[CONTRACTOR_LEADERBOARD_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
