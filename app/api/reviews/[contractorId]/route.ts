import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/reviews/[contractorId]
 * Fetch reviews for a contractor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { contractorId: string } }
) {
  try {
    const { contractorId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    // Fetch reviews
    const queryOptions: any = {
      where: {
        contractorId,
        status: "published",
      },
      include: {
        homeowner: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    if (limit) {
      queryOptions.take = parseInt(limit);
    }

    const reviews = await prisma.review.findMany(queryOptions);

    // Calculate average rating
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return NextResponse.json({
      success: true,
      reviews,
      averageRating,
      totalReviews: reviews.length,
    });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
