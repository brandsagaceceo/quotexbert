import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contractorProfileSchema } from "@/lib/validation/schemas";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const profile = await prisma.contractorProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error fetching contractor profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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
    const { displayName, ...contractorData } = body;
    const validatedData = contractorProfileSchema.parse(contractorData);

    // Check if user has contractor role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "contractor") {
      return NextResponse.json(
        { error: "Only contractors can update contractor profiles" },
        { status: 403 }
      );
    }

    // Update user displayName if provided
    if (displayName !== undefined) {
      await prisma.user.update({
        where: { id: userId },
        data: { displayName: displayName || null },
      });
    }

    // Build the update/create data object, filtering out undefined values
    const profileData: any = {
      companyName: validatedData.companyName,
      trade: validatedData.trade,
      serviceRadiusKm: validatedData.serviceRadiusKm,
    };

    if (validatedData.bio !== undefined) {
      profileData.bio = validatedData.bio;
    }
    if (validatedData.city !== undefined) {
      profileData.city = validatedData.city;
    }
    if (validatedData.website !== undefined) {
      profileData.website = validatedData.website;
    }
    if (validatedData.phone !== undefined) {
      profileData.phone = validatedData.phone;
    }

    // Update or create profile
    const profile = await prisma.contractorProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData,
      },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error updating contractor profile:", error);
    
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
