import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 }
      );
    }

    // Get contractor profile to verify the contractor exists
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId: contractorId }
    });

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: { contractorId: contractorProfile.id },
      orderBy: [
        { createdAt: "desc" }
      ],
    });

    // Parse JSON fields for before/after images
    const formattedItems = portfolioItems.map(item => ({
      ...item,
      beforeImages: item.beforeImages ? JSON.parse(item.beforeImages) : [],
      afterImages: item.afterImages ? JSON.parse(item.afterImages) : [],
      tags: []
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractorId, title, caption, projectType, beforeImages, afterImages } = body;
    
    if (!contractorId || !title) {
      return NextResponse.json(
        { error: "Contractor ID and title are required" },
        { status: 400 }
      );
    }

    // Get contractor profile to verify contractor exists
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId: contractorId },
    });

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    // Create portfolio item with available fields
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId: contractorProfile.id,
        title,
        caption: caption || null,
        projectType: projectType || "general",
        beforeImages: JSON.stringify(beforeImages || []),
        afterImages: JSON.stringify(afterImages || []),
      },
    });

    // Format response with parsed JSON
    const formattedItem = {
      ...portfolioItem,
      beforeImages: JSON.parse(portfolioItem.beforeImages),
      afterImages: JSON.parse(portfolioItem.afterImages),
      tags: []
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}