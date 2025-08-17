import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

    const body = await request.json();
    const { contractorId, verified } = body;

    if (!contractorId || typeof verified !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Update contractor verification status
    const updatedContractor = await prisma.contractorProfile.update({
      where: { id: contractorId },
      data: { verified },
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({ contractor: updatedContractor });
  } catch (error) {
    console.error("Error updating contractor verification:", error);
    return NextResponse.json(
      { error: "Failed to update verification status" },
      { status: 500 }
    );
  }
}
