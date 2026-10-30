import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  if (!userId && !email) {
    return NextResponse.json({ error: "User ID or email required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: userId ? { id: userId } : { email: email! },
      include: {
        contractorProfile: true,
        homeownerProfile: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
