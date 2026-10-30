import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function reviewerDisplayName(name: string | null | undefined): string {
  return name?.trim().split(/\s+/)[0] || "Homeowner";
}

/**
 * GET /api/reviews/[contractorId]
 * Fetch reviews for a contractor
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { contractorId: string } },
) {
  try {
    const { contractorId } = params;
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    const contractor = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      select: { id: true },
    });
    const where = {
      contractorId: contractor?.id ?? contractorId,
      status: "published",
    };
    const take = limit ? parseInt(limit, 10) : undefined;

    const [reviews, totalReviews, ratingAggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        select: {
          id: true,
          rating: true,
          text: true,
          createdAt: true,
          isVerified: true,
          homeowner: {
            select: {
              name: true,
            },
          },
          lead: {
            select: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        ...(take ? { take } : {}),
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({
        where,
        _avg: { rating: true },
      }),
    ]);

    const safeReviews = reviews.map((review) => ({
      ...review,
      homeowner: {
        name: reviewerDisplayName(review.homeowner?.name),
      },
    }));

    return NextResponse.json({
      success: true,
      reviews: safeReviews,
      averageRating: ratingAggregate._avg.rating ?? 0,
      totalReviews,
    });
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
