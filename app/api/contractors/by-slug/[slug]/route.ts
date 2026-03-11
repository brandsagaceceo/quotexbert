import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug is required" },
        { status: 400 }
      );
    }

    // Find contractor by slug
    const contractor = await prisma.contractorProfile.findUnique({
      where: {
        slug: slug,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        portfolio: {
          where: {
            isPublic: true,
          },
          orderBy: {
            isPinned: 'desc',
          },
          take: 12,
        },
      },
    });

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Return contractor data
    return NextResponse.json({
      success: true,
      contractor: {
        id: contractor.id,
        userId: contractor.userId,
        companyName: contractor.companyName,
        slug: contractor.slug,
        trade: contractor.trade,
        bio: contractor.bio,
        city: contractor.city,
        serviceRadiusKm: contractor.serviceRadiusKm,
        website: contractor.website,
        phone: contractor.phone,
        verified: contractor.verified,
        avgRating: contractor.avgRating,
        reviewCount: contractor.reviewCount,
        completedJobs: contractor.completedJobs,
        profilePhoto: contractor.profilePhoto,
        coverPhoto: contractor.coverPhoto,
        portfolio: contractor.portfolio,
        userName: contractor.user.name,
        userEmail: contractor.user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching contractor by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractor" },
      { status: 500 }
    );
  }
}
