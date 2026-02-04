import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveSubscription, getSubscriptionFeatures } from "@/lib/subscription-utils";

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

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionPlan: true,
        subscriptionStatus: true,
        selectedCategories: true,
        stripeSubscriptionId: true,
        proOverrideEnabled: true,
        proOverrideTier: true,
        proOverrideExpiresAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get effective subscription (respects manual overrides)
    const effectiveSub = await getEffectiveSubscription(userId);
    const features = await getSubscriptionFeatures(userId);

    return NextResponse.json({
      ...user,
      // Include effective subscription data
      effectiveSubscription: effectiveSub,
      subscriptionFeatures: features.features,
      // For backwards compatibility, override plan/status with effective values
      subscriptionPlan: effectiveSub.tier || user.subscriptionPlan,
      subscriptionStatus: effectiveSub.status || user.subscriptionStatus,
    });
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
