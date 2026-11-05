import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Find contractor by slug
    const contractor = await prisma.contractorProfile.findUnique({
      where: {
        slug: slug,
      },
      include: {
        portfolio: {
          where: {
            isPublic: true,
          },
          orderBy: {
            isPinned: "desc",
          },
          take: 12,
          select: {
            id: true,
            title: true,
            description: true,
            caption: true,
            projectType: true,
            beforeImages: true,
            afterImages: true,
            imageUrl: true,
            projectCost: true,
            duration: true,
            materials: true,
            location: true,
            clientStory: true,
            isPublic: true,
            isPinned: true,
            tags: true,
            createdAt: true,
          },
        },
      },
    });

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }

    // Return contractor data
    return NextResponse.json({
      success: true,
      contractor: {
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
      },
    });
  } catch (error) {
    console.error("Error fetching contractor by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractor" },
      { status: 500 },
    );
  }
}
