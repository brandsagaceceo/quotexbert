import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Robust user lookup that handles both legacy (cuid) and current (clerkId-as-id) schemas.
 * Tries: id â†’ clerkUserId â†’ (never email, that needs auth context)
 */
async function findUserById(userId: string, includeExtended = false) {
  const include = includeExtended
    ? {
        contractorProfile: true,
        homeownerProfile: true,
        reviewsReceived: { select: { rating: true } },
        _count: { select: { acceptedLeads: true, leads: true } },
      }
    : { contractorProfile: true, homeownerProfile: true };

  // Primary lookup by id (works for users created via /api/user/role in current codebase)
  let user = await prisma.user.findUnique({ where: { id: userId }, include } as any);

  // Fallback: some older accounts store Clerk ID in clerkUserId while id is a cuid
  if (!user) {
    user = await prisma.user.findUnique({ where: { clerkUserId: userId }, include } as any);
    if (user) {
      console.log(`[API/profile] Resolved user by clerkUserId fallback: ${user.id}`);
    }
  }

  return user;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("[API/profile] GET called. userId:", userId);

  if (!userId) {
    return NextResponse.json({ error: "User ID required" }, { status: 400 });
  }

  try {
    const user = await findUserById(userId, true) as any;

    if (!user) {
      console.log("[API/profile] User not found in DB for userId:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reviewsReceived = user.reviewsReceived ?? [];
    let avgRating = 0;
    if (reviewsReceived.length > 0) {
      const totalRating = reviewsReceived.reduce((sum: number, r: any) => sum + r.rating, 0);
      avgRating = totalRating / reviewsReceived.length;
    }

    const profile = {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
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
        avgRating,
        reviewCount: reviewsReceived.length,
        completedJobs: user._count?.acceptedLeads ?? 0,
        isActive: user.contractorProfile.isActive,
      }),
      ...(user.homeownerProfile && {
        name: user.homeownerProfile.name,
        city: user.homeownerProfile.city,
        phone: user.homeownerProfile.phone,
        profilePhoto: user.homeownerProfile.profilePhoto,
        coverPhoto: user.homeownerProfile.coverPhoto,
        bio: user.homeownerProfile.bio,
        homeType: user.homeownerProfile.homeType,
        preferredRenovationTypes: JSON.parse(user.homeownerProfile.preferredRenovationTypes || "[]"),
        budgetRange: user.homeownerProfile.budgetRange,
        totalJobs: user._count?.leads ?? 0,
      }),
    };

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

    // Robust lookup with clerkUserId fallback
    const user = await findUserById(userId) as any;

    if (!user) {
      console.error("[API/profile] PUT: user not found for userId:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use the resolved DB id for all subsequent operations
    const resolvedId = user.id;

    if (user.role === "contractor") {
      const contractorData = {
        companyName: updateData.companyName || user.contractorProfile?.companyName || "Company Name",
        trade: updateData.trade || user.contractorProfile?.trade || "General",
        bio: updateData.bio !== undefined ? updateData.bio : (user.contractorProfile?.bio ?? null),
        city: updateData.city !== undefined ? updateData.city : (user.contractorProfile?.city ?? null),
        serviceRadiusKm: updateData.serviceRadiusKm || user.contractorProfile?.serviceRadiusKm || 25,
        website: updateData.website !== undefined ? updateData.website : (user.contractorProfile?.website ?? null),
        phone: updateData.phone !== undefined ? updateData.phone : (user.contractorProfile?.phone ?? null),
        profilePhoto: updateData.profilePhoto !== undefined ? updateData.profilePhoto : (user.contractorProfile?.profilePhoto ?? null),
        coverPhoto: updateData.coverPhoto !== undefined ? updateData.coverPhoto : (user.contractorProfile?.coverPhoto ?? null),
      };

      await prisma.contractorProfile.upsert({
        where: { userId: resolvedId },
        update: contractorData,
        create: { userId: resolvedId, ...contractorData },
      });
    } else if (user.role === "homeowner") {
      const homeownerData = {
        name: updateData.name !== undefined ? updateData.name : (user.homeownerProfile?.name ?? null),
        city: updateData.city !== undefined ? updateData.city : (user.homeownerProfile?.city ?? null),
        phone: updateData.phone !== undefined ? updateData.phone : (user.homeownerProfile?.phone ?? null),
        profilePhoto: updateData.profilePhoto !== undefined ? updateData.profilePhoto : (user.homeownerProfile?.profilePhoto ?? null),
        coverPhoto: updateData.coverPhoto !== undefined ? updateData.coverPhoto : (user.homeownerProfile?.coverPhoto ?? null),
        bio: updateData.bio !== undefined ? updateData.bio : (user.homeownerProfile?.bio ?? null),
        homeType: updateData.homeType !== undefined ? updateData.homeType : (user.homeownerProfile?.homeType ?? null),
        preferredRenovationTypes: updateData.preferredRenovationTypes !== undefined
          ? JSON.stringify(updateData.preferredRenovationTypes)
          : (user.homeownerProfile?.preferredRenovationTypes ?? "[]"),
        budgetRange: updateData.budgetRange !== undefined ? updateData.budgetRange : (user.homeownerProfile?.budgetRange ?? null),
      };

      await prisma.homeownerProfile.upsert({
        where: { userId: resolvedId },
        update: homeownerData,
        create: { userId: resolvedId, ...homeownerData },
      });
    }

    const updatedUser = await prisma.user.findUnique({
      where: { id: resolvedId },
      include: { contractorProfile: true, homeownerProfile: true },
    });

    return NextResponse.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.error("[API/profile] Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
