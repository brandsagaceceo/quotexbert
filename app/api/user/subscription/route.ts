import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveSubscription, getSubscriptionFeatures } from "@/lib/subscription-utils";
import { getActiveSubscriptionCategories } from "@/lib/subscription-access";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status },
      );
    }
    const userId = authResult.user.dbUserId;

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
    const activeCategories = await getActiveSubscriptionCategories(userId);

    return NextResponse.json({
      ...user,
      activeCategories,
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
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status },
      );
    }

    const body = await request.json();
    const { categories } = body;

    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Update user's selected categories
    await prisma.user.update({
      where: { id: authResult.user.dbUserId },
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
