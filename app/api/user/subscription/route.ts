import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user subscription data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        selectedCategories: true,
        stripeSubscriptionId: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscription data" },
      { status: 500 }
    );
  }
}

// Update selected categories
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, categories } = body;

    if (!userId || !Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Update user's selected categories
    await prisma.user.update({
      where: { id: userId },
      data: {
        selectedCategories: JSON.stringify(categories)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update categories" },
      { status: 500 }
    );
  }
}
