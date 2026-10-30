import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

const SELF_SERVICE_ROLES = new Set(["homeowner", "contractor"]);
const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS || "brandsagaceo@gmail.com,quotexbert@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase());

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const role = body?.role;
    if (typeof role !== "string" || !SELF_SERVICE_ROLES.has(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const email =
      clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`;
    const [existingUser, existingByEmail] = await Promise.all([
      prisma.user.findFirst({
        where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      }),
      prisma.user.findUnique({ where: { email } }),
    ]);
    const isProvisionedAdmin =
      existingUser?.role === "admin" ||
      existingByEmail?.role === "admin" ||
      clerkUser.publicMetadata?.role === "admin" ||
      ADMIN_EMAILS.includes(email.toLowerCase());

    if (isProvisionedAdmin) {
      return NextResponse.json(
        { error: "Administrator roles cannot be changed through self-service" },
        { status: 403 },
      );
    }

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    if (existingByEmail) {
      return NextResponse.json(
        { error: "Account requires authenticated role onboarding" },
        { status: 409 },
      );
    }

    // Always bind account creation to the authenticated Clerk identity.
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email,
        role,
      },
    });

    // Create role-specific profile
    if (role === "contractor") {
      await prisma.contractorProfile.create({
        data: {
          userId,
          companyName: "My Company",
          trade: "General",
        },
      });
    } else if (role === "homeowner") {
      await prisma.homeownerProfile.create({
        data: {
          userId,
          name: email.split("@")[0] || "",
        },
      });
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { dbUserId, clerkUserId, email: authenticatedEmail } = authResult.user;
    const requestedUserId = searchParams.get("userId");
    const requestedEmail = searchParams.get("email");
    if (
      (requestedUserId && ![dbUserId, clerkUserId].includes(requestedUserId)) ||
      (requestedEmail && requestedEmail.toLowerCase() !== authenticatedEmail.toLowerCase())
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await prisma.user.findUnique({
      where: { id: dbUserId },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        createdAt: true,
        selectedCategories: true,
        contractorProfile: {
          select: {
            companyName: true,
            trade: true,
            bio: true,
            city: true,
            serviceRadiusKm: true,
            website: true,
            phone: true,
            verified: true,
            avgRating: true,
            reviewCount: true,
            completedJobs: true,
            categories: true,
            isActive: true,
            profilePhoto: true,
            coverPhoto: true,
            businessLogo: true,
          },
        },
        homeownerProfile: {
          select: {
            name: true,
            city: true,
            phone: true,
            profilePhoto: true,
            coverPhoto: true,
            bio: true,
            homeType: true,
            preferredRenovationTypes: true,
            budgetRange: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const effectiveRole = user.role
      || (user.contractorProfile ? "contractor" : null)
      || (user.homeownerProfile ? "homeowner" : null);
    const safeAccount = {
      id: user.id,
      email: user.email,
      name: user.name,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
      selectedCategories: user.selectedCategories,
      ...(effectiveRole === "contractor" &&
        user.contractorProfile && { contractorProfile: user.contractorProfile }),
      ...(effectiveRole === "homeowner" &&
        user.homeownerProfile && { homeownerProfile: user.homeownerProfile }),
    };

    return NextResponse.json({ user: safeAccount });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
