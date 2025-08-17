import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation/schemas";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where: { contractorId },
        include: {
          homeowner: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.review.count({
        where: { contractorId },
      }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
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
    const validatedData = reviewSchema.parse(body);

    // Check if user is a homeowner
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "homeowner") {
      return NextResponse.json(
        { error: "Only homeowners can leave reviews" },
        { status: 403 }
      );
    }

    // Check if lead exists and is closed
    const lead = await prisma.lead.findUnique({
      where: { id: validatedData.leadId },
      select: { 
        status: true, 
        homeownerId: true, 
        contractorId: true 
      },
    });

    if (!lead) {
      return NextResponse.json(
        { error: "Lead not found" },
        { status: 404 }
      );
    }

    if (lead.homeownerId !== userId) {
      return NextResponse.json(
        { error: "You can only review your own jobs" },
        { status: 403 }
      );
    }

    if (lead.status !== "closed") {
      return NextResponse.json(
        { error: "Can only review completed jobs" },
        { status: 400 }
      );
    }

    if (lead.contractorId !== validatedData.contractorId) {
      return NextResponse.json(
        { error: "Contractor mismatch" },
        { status: 400 }
      );
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        leadId_homeownerId: {
          leadId: validatedData.leadId,
          homeownerId: userId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already exists for this job" },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        leadId: validatedData.leadId,
        contractorId: validatedData.contractorId,
        homeownerId: userId,
        rating: validatedData.rating,
        text: validatedData.text || null,
      },
      include: {
        homeowner: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Update contractor's average rating
    const [avgRating, reviewCount] = await Promise.all([
      prisma.review.aggregate({
        where: { contractorId: validatedData.contractorId },
        _avg: { rating: true },
      }),
      prisma.review.count({
        where: { contractorId: validatedData.contractorId },
      }),
    ]);

    await prisma.contractorProfile.update({
      where: { userId: validatedData.contractorId },
      data: {
        avgRating: avgRating._avg.rating || 0,
        reviewCount,
      },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
