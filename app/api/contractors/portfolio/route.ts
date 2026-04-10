import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    // Resolve ContractorProfile by looking up the user via both id and clerkUserId.
    // Webhook-created users have id=UUID with clerkUserId=clerkId, so a plain
    // findUnique by userId would miss them when the caller passes the Clerk ID.
    const contractorUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: contractorId }, { clerkUserId: contractorId }],
      },
      include: {
        contractorProfile: true,
      },
    });

    const contractorProfile = contractorUser?.contractorProfile ?? null;

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

    // Resolve contractor via User.id OR User.clerkUserId (webhook-created users have a UUID as id)
    const contractorUser = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      include: { contractorProfile: true },
    });
    const contractorProfile = contractorUser?.contractorProfile ?? null;

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