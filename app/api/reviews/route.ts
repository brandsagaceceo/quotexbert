import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validation/schemas";
import { auth } from "@clerk/nextjs/server";
import { sendReviewReceivedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // If contractorId is not provided, return the most recent reviews across all contractors
    const skip = (page - 1) * limit;
    const where = contractorId ? { contractorId } : {};

    const [reviews, totalCount] = await Promise.all([
      prisma.review.findMany({
        where,
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
        where,
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

    if (lead.status !== "closed" && lead.status !== "completed") {
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

    // Send email notification to contractor about new review
    try {
      const contractor = await prisma.user.findUnique({
        where: { id: validatedData.contractorId },
        select: { 
          email: true, 
          name: true,
          contractorProfile: {
            select: { companyName: true }
          }
        },
      });

      if (contractor?.email) {
        // Create in-app notification for contractor
        await prisma.notification.create({
          data: {
            userId: validatedData.contractorId,
            type: "NEW_REVIEW",
            title: `New ${validatedData.rating}-Star Review Received!`,
            message: `You received a ${validatedData.rating}-star review${validatedData.text ? `: "${validatedData.text.substring(0, 100)}${validatedData.text.length > 100 ? '...' : ''}"` : '.'}`,
            relatedId: review.id,
            relatedType: "review",
          }
        }).catch(err => console.error('Failed to create review notification:', err));

        // Send email notification
        await sendReviewReceivedEmail(
          {
            id: validatedData.contractorId,
            email: contractor.email,
            companyName: contractor.contractorProfile?.companyName || contractor.name || 'Your Company',
          },
          {
            id: review.id,
            rating: validatedData.rating,
            comment: validatedData.text || null,
            reviewerName: user.role === 'homeowner' ? 'A homeowner' : 'A client',
          }
        );
      }
    } catch (emailError) {
      console.error('Failed to send review notification:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
