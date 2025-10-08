import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, role } = body;

    if (!id || !email || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        id,
        email,
        role
      }
    });

    // Create role-specific profile
    if (role === "contractor") {
      await prisma.contractorProfile.create({
        data: {
          userId: id,
          companyName: "My Company",
          trade: "General"
        }
      });
    } else if (role === "homeowner") {
      await prisma.homeownerProfile.create({
        data: {
          userId: id,
          name: email.split("@")[0] // Use email prefix as default name
        }
      });
    }

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
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