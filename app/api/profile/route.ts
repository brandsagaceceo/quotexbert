import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("[API/profile] GET called. userId:", userId);

  if (!userId) {
    console.log("[API/profile] No userId provided");
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    // Fetch user with profile data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contractorProfile: true,
        homeownerProfile: true,
        reviewsReceived: {
          select: {
            rating: true
          }
        },
        _count: {
          select: {
            acceptedLeads: true,
            leads: true
          }
        }
      }
    });

    console.log("[API/profile] DB user:", user);

    if (!user) {
      console.log("[API/profile] User not found in DB");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate average rating for contractors
    let avgRating = 0;
    if (user.reviewsReceived.length > 0) {
      const totalRating = user.reviewsReceived.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / user.reviewsReceived.length;
    }

    // Build unified profile response
    const profile = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      // Contractor-specific data
      ...(user.contractorProfile && {
        companyName: user.contractorProfile.companyName,
        trade: user.contractorProfile.trade,
        bio: user.contractorProfile.bio,
        city: user.contractorProfile.city,
        serviceRadiusKm: user.contractorProfile.serviceRadiusKm,
        website: user.contractorProfile.website,
        phone: user.contractorProfile.phone,
        verified: user.contractorProfile.verified,
        profilePhoto: user.contractorProfile.profilePhoto,
        coverPhoto: user.contractorProfile.coverPhoto,
        avgRating: avgRating,
        reviewCount: user.reviewsReceived.length,
        completedJobs: user._count.acceptedLeads,
        isActive: user.contractorProfile.isActive
      }),
      // Homeowner-specific data
      ...(user.homeownerProfile && {
        name: user.homeownerProfile.name,
        city: user.homeownerProfile.city,
        phone: user.homeownerProfile.phone,
        profilePhoto: user.homeownerProfile.profilePhoto,
        coverPhoto: user.homeownerProfile.coverPhoto,
        totalJobs: user._count.leads
      })
    };

    console.log("[API/profile] Returning profile:", profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[API/profile] Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Update user record
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { contractorProfile: true, homeownerProfile: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update based on user role
    if (user.role === "contractor") {
      const contractorData = {
        companyName: updateData.companyName || user.contractorProfile?.companyName || "Company Name",
        trade: updateData.trade || user.contractorProfile?.trade || "General",
        bio: updateData.bio || user.contractorProfile?.bio,
        city: updateData.city || user.contractorProfile?.city,
        serviceRadiusKm: updateData.serviceRadiusKm || user.contractorProfile?.serviceRadiusKm || 25,
        website: updateData.website || user.contractorProfile?.website,
        phone: updateData.phone || user.contractorProfile?.phone,
        profilePhoto: updateData.profilePhoto !== undefined ? updateData.profilePhoto : user.contractorProfile?.profilePhoto,
        coverPhoto: updateData.coverPhoto !== undefined ? updateData.coverPhoto : user.contractorProfile?.coverPhoto
      };

      await prisma.contractorProfile.upsert({
        where: { userId: userId },
        update: contractorData,
        create: {
          userId: userId,
          ...contractorData
        }
      });
    } else if (user.role === "homeowner") {
      const homeownerData = {
        name: updateData.name || user.homeownerProfile?.name,
        city: updateData.city || user.homeownerProfile?.city,
        phone: updateData.phone || user.homeownerProfile?.phone,
        profilePhoto: updateData.profilePhoto !== undefined ? updateData.profilePhoto : user.homeownerProfile?.profilePhoto,
        coverPhoto: updateData.coverPhoto !== undefined ? updateData.coverPhoto : user.homeownerProfile?.coverPhoto
      };

      await prisma.homeownerProfile.upsert({
        where: { userId: userId },
        update: homeownerData,
        create: {
          userId: userId,
          ...homeownerData
        }
      });
    }

    // Fetch updated profile
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        contractorProfile: true,
        homeownerProfile: true
      }
    });

    return NextResponse.json({
      success: true,
      profile: updatedUser
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}