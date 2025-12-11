import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get or create subscription record
    let subscription = await prisma.visualizerSubscription.findUnique({
      where: { userId }
    });

    if (!subscription) {
      // Create new subscription record for user
      subscription = await prisma.visualizerSubscription.create({
        data: {
          userId,
          isPaid: false,
          monthlyGenerationsUsed: 0,
          lastResetDate: new Date(),
          freeMonthlyLimit: 10
        }
      });
    }

    // Check if we need to reset monthly counter
    const now = new Date();
    const lastReset = new Date(subscription.lastResetDate);
    const daysSinceReset = Math.floor((now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceReset >= 30) {
      // Reset the counter
      subscription = await prisma.visualizerSubscription.update({
        where: { userId },
        data: {
          monthlyGenerationsUsed: 0,
          lastResetDate: now
        }
      });
    }

    const isPaidSubscriber = subscription.isPaid;
    const generationsUsed = subscription.monthlyGenerationsUsed;
    const generationsRemaining = isPaidSubscriber 
      ? 999999 // Unlimited for paid
      : Math.max(0, subscription.freeMonthlyLimit - generationsUsed);
    const isAllowed = isPaidSubscriber || generationsRemaining > 0;

    // Calculate next reset date
    const resetDate = new Date(subscription.lastResetDate);
    resetDate.setDate(resetDate.getDate() + 30);

    return NextResponse.json({
      success: true,
      data: {
        isAllowed,
        generationsUsed,
        generationsRemaining,
        isPaidSubscriber,
        resetDate,
        message: isAllowed 
          ? null 
          : "You've reached your free generation limit. Upgrade to continue!"
      }
    });

  } catch (error) {
    console.error("Error checking visualizer usage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check usage" },
      { status: 500 }
    );
  }
}
