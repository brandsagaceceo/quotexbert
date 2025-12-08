import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get contractor billing info
    const billing = await prisma.contractorBilling.findUnique({
      where: { userId },
    });

    if (!billing) {
      return NextResponse.json({
        availableBalance: 0,
        categories: [],
      });
    }

    return NextResponse.json({
      availableBalance: billing.availableBalance || 0,
      categories: billing.subscribedCategories || [],
      stripeCustomerId: billing.stripeCustomerId,
    });
  } catch (error) {
    console.error("Error fetching payout info:", error);
    return NextResponse.json(
      { error: "Failed to fetch payout info" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get contractor billing
    const billing = await prisma.contractorBilling.findUnique({
      where: { userId },
    });

    if (!billing || (billing.availableBalance || 0) <= 0) {
      return NextResponse.json(
        { error: "No available balance to withdraw" },
        { status: 400 }
      );
    }

    // In a real app, you would integrate with Stripe Connect or similar
    // to transfer funds to the contractor's bank account
    // For now, we'll just reset the balance and log the payout

    await prisma.contractorBilling.update({
      where: { userId },
      data: {
        availableBalance: 0,
      },
    });

    // TODO: Create a payout record in a separate table for tracking
    // TODO: Integrate with Stripe Connect for actual bank transfers

    return NextResponse.json({
      success: true,
      message: "Payout request submitted successfully",
    });
  } catch (error) {
    console.error("Error processing payout:", error);
    return NextResponse.json(
      { error: "Failed to process payout" },
      { status: 500 }
    );
  }
}
