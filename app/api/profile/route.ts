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

/** Strip old fake placeholder URLs that were saved before BLOB was configured */
function sanitizePhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Old code returned https://images.unsplash.com/photo-{integer}?... — not a valid user photo
  if (/^https:\/\/images\.unsplash\.com\/photo-\d+/.test(url)) return null;
  return url;
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
        profilePhoto: sanitizePhotoUrl(user.contractorProfile.profilePhoto),
        coverPhoto: sanitizePhotoUrl(user.contractorProfile.coverPhoto),
        avgRating,
        reviewCount: reviewsReceived.length,
        completedJobs: user._count?.acceptedLeads ?? 0,
        isActive: user.contractorProfile.isActive,
      }),
      ...(user.homeownerProfile && {
        name: user.homeownerProfile.name,
        city: user.homeownerProfile.city,
        phone: user.homeownerProfile.phone,
        profilePhoto: sanitizePhotoUrl(user.homeownerProfile.profilePhoto),
        coverPhoto: sanitizePhotoUrl(user.homeownerProfile.coverPhoto),
        bio: user.homeownerProfile.bio,
        homeType: user.homeownerProfile.homeType,
        preferredRenovationTypes: JSON.parse(user.homeownerProfile.preferredRenovationTypes || "[]"),
        budgetRange: user.homeownerProfile.budgetRange,
        totalJobs: user._count?.leads ?? 0,
      }),
    };

    console.log(`[API/profile GET] returning — role:${profile.role} profilePhoto:${(profile as any).profilePhoto ?? 'null'} bio:${(profile as any).bio ?? 'null'}`);
    console.log("[API/profile GET] full object:", JSON.stringify({id: (profile as any).id, profilePhoto: (profile as any).profilePhoto, bio: (profile as any).bio}));
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

    console.log("[API/profile PUT] full body:", body);
    console.log(`[API/profile PUT] received — userId:${userId} keys:[${Object.keys(updateData).join(',')}] profilePhoto:${updateData.profilePhoto ?? 'not-sent'} bio:${updateData.bio ?? 'not-sent'}`);

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

    // Derive effective role: user.role may be null for some accounts where the role
    // was not written into the users table but a profile record already exists.
    // In that case, detect role from presence of contractorProfile/homeownerProfile.
    const effectiveRole = user.role
      || (user.contractorProfile ? "contractor" : null)
      || (user.homeownerProfile ? "homeowner" : null);

    if (!effectiveRole) {
      console.error("[API/profile PUT] Cannot determine role for userId:", userId, "user.role:", user.role);
      return NextResponse.json({ error: "User role could not be determined. Please log out and log back in." }, { status: 400 });
    }

    console.log(`[API/profile PUT] effectiveRole:${effectiveRole} (user.role was:${user.role ?? 'null'})`);

    if (effectiveRole === "contractor") {
      const contractorData = {
        companyName: updateData.companyName || user.contractorProfile?.companyName || "Company Name",
        trade: updateData.trade || user.contractorProfile?.trade || "General",
        bio: updateData.bio !== undefined ? updateData.bio : (user.contractorProfile?.bio ?? null),
        city: updateData.city !== undefined ? updateData.city : (user.contractorProfile?.city ?? null),
        serviceRadiusKm: updateData.serviceRadiusKm || user.contractorProfile?.serviceRadiusKm || 25,
        website: updateData.website !== undefined ? updateData.website : (user.contractorProfile?.website ?? null),
        phone: updateData.phone !== undefined ? updateData.phone : (user.contractorProfile?.phone ?? null),
        // Use truthy check: empty string or missing field both fall back to existing DB value
        profilePhoto: updateData.profilePhoto || user.contractorProfile?.profilePhoto || null,
        coverPhoto: updateData.coverPhoto || user.contractorProfile?.coverPhoto || null,
      };

      console.log(`[API/profile PUT] writing contractor — profilePhoto:${contractorData.profilePhoto ?? 'null'} bio:${contractorData.bio ?? 'null'}`);
      console.log("[API/profile PUT] contractorData:", JSON.stringify(contractorData));

      await prisma.contractorProfile.upsert({
        where: { userId: resolvedId },
        update: contractorData,
        create: { userId: resolvedId, ...contractorData },
      });

      // Verify the write actually persisted
      const verify = await prisma.contractorProfile.findUnique({ where: { userId: resolvedId } });
      console.log(`[API/profile PUT] DB verify — profilePhoto:${verify?.profilePhoto ?? 'null'} bio:${verify?.bio ?? 'null'}`);
      console.log("[API/profile PUT] DB verify:", JSON.stringify({profilePhoto: verify?.profilePhoto, bio: verify?.bio}));
    } else if (effectiveRole === "homeowner") {
      const homeownerData = {
        name: updateData.name !== undefined ? updateData.name : (user.homeownerProfile?.name ?? null),
        city: updateData.city !== undefined ? updateData.city : (user.homeownerProfile?.city ?? null),
        phone: updateData.phone !== undefined ? updateData.phone : (user.homeownerProfile?.phone ?? null),
        // Use truthy check: empty string or missing field both fall back to existing DB value
        profilePhoto: updateData.profilePhoto || user.homeownerProfile?.profilePhoto || null,
        coverPhoto: updateData.coverPhoto || user.homeownerProfile?.coverPhoto || null,
        bio: updateData.bio !== undefined ? updateData.bio : (user.homeownerProfile?.bio ?? null),
        homeType: updateData.homeType !== undefined ? updateData.homeType : (user.homeownerProfile?.homeType ?? null),
        preferredRenovationTypes: updateData.preferredRenovationTypes !== undefined
          ? JSON.stringify(updateData.preferredRenovationTypes)
          : (user.homeownerProfile?.preferredRenovationTypes ?? "[]"),
        budgetRange: updateData.budgetRange !== undefined ? updateData.budgetRange : (user.homeownerProfile?.budgetRange ?? null),
      };

      console.log(`[API/profile PUT] writing homeowner — profilePhoto:${homeownerData.profilePhoto ?? 'null'} bio:${homeownerData.bio ?? 'null'}`);

      await prisma.homeownerProfile.upsert({
        where: { userId: resolvedId },
        update: homeownerData,
        create: { userId: resolvedId, ...homeownerData },
      });

      // Verify the write actually persisted
      const verifyHo = await prisma.homeownerProfile.findUnique({ where: { userId: resolvedId } });
      console.log(`[API/profile PUT] DB verify homeowner — profilePhoto:${verifyHo?.profilePhoto ?? 'null'} bio:${verifyHo?.bio ?? 'null'}`);
      console.log("[API/profile PUT] DB verify homeowner:", JSON.stringify({profilePhoto: verifyHo?.profilePhoto, bio: verifyHo?.bio}));
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
