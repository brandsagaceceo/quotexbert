import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: { contractorId },
      orderBy: { createdAt: "desc" },
    });

    // Parse JSON fields for before/after images
    const formattedItems = portfolioItems.map(item => ({
      ...item,
      beforeImages: (item as any).beforeImages ? JSON.parse((item as any).beforeImages) : [],
      afterImages: (item as any).afterImages ? JSON.parse((item as any).afterImages) : []
    }));

    return NextResponse.json({ portfolioItems: formattedItems });
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
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Get contractor profile
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId },
    });

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    // Create portfolio item
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId: contractorProfile.id,
        title: body.title,
        caption: body.caption || null,
        projectType: body.projectType || "general",
        beforeImages: JSON.stringify(body.beforeImages || []),
        afterImages: JSON.stringify(body.afterImages || []),
        imageUrl: body.imageUrl || null, // Legacy support
      } as any,
    });

    // Format response with parsed JSON
    const formattedItem = {
      ...portfolioItem,
      beforeImages: JSON.parse((portfolioItem as any).beforeImages),
      afterImages: JSON.parse((portfolioItem as any).afterImages)
    };

    return NextResponse.json({ portfolioItem: formattedItem });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
