import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Find contractors matching a job category
 * Used for notifications and job recommendations
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, city, zipCode } = body;

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // Find contractors who:
    // 1. Have the category in their selected categories
    // 2. Are active
    // 3. Are verified (optional but preferred)
    const contractors = await prisma.contractorProfile.findMany({
      where: {
        isActive: true,
        // Check if category is in the JSON array
        OR: [
          {
            categories: {
              contains: category,
            },
          },
          // Fallback: match trade field for backwards compatibility
          {
            trade: {
              contains: category,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { verified: "desc" }, // Verified contractors first
        { avgRating: "desc" }, // Then by rating
        { completedJobs: "desc" }, // Then by experience
      ],
      take: 50, // Limit to top 50 matches
    });

    // Parse categories from JSON string for each contractor
    const contractorsWithParsedCategories = contractors.map((contractor) => {
      let parsedCategories: string[] = [];
      try {
        parsedCategories = JSON.parse(contractor.categories || "[]");
      } catch (e) {
        parsedCategories = [];
      }

      return {
        id: contractor.id,
        userId: contractor.userId,
        companyName: contractor.companyName,
        trade: contractor.trade,
        city: contractor.city,
        verified: contractor.verified,
        avgRating: contractor.avgRating,
        completedJobs: contractor.completedJobs,
        categories: parsedCategories,
        serviceRadiusKm: contractor.serviceRadiusKm,
        userEmail: contractor.user.email,
        userName: contractor.user.name,
      };
    });

    // If city/zipCode provided, filter by location match
    let filteredContractors = contractorsWithParsedCategories;
    if (city) {
      filteredContractors = contractorsWithParsedCategories.filter(
        (c) =>
          c.city?.toLowerCase().includes(city.toLowerCase()) ||
          // Within 50km radius - simplified check
          c.serviceRadiusKm >= 50
      );
    }

    return NextResponse.json({
      success: true,
      contractors: filteredContractors,
      count: filteredContractors.length,
    });
  } catch (error) {
    console.error("Error matching contractors:", error);
    return NextResponse.json(
      { error: "Failed to match contractors" },
      { status: 500 }
    );
  }
}
