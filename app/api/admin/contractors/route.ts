import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all contractor profiles
    const contractors = await prisma.contractorProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { verified: "asc" }, // Unverified first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ contractors });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractors" },
      { status: 500 }
    );
  }
}
