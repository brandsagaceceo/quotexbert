import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { portfolioItemSchema } from "@/lib/validation/schemas";
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

    return NextResponse.json({ portfolioItems });
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
    const validatedData = portfolioItemSchema.parse(body);

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
        title: validatedData.title,
        caption: validatedData.caption || null,
        imageUrl: validatedData.imageUrl,
      },
    });

    return NextResponse.json({ portfolioItem });
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}
