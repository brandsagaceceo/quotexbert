import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createSetupIntent, createOrGetStripeCustomer } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or get Stripe customer
    const stripeCustomerId = await createOrGetStripeCustomer(
      userId,
      user.email,
      user.email,
    );

    // Create setup intent
    const setupIntent = await createSetupIntent(stripeCustomerId);

    // Update billing record with Stripe customer ID
    await prisma.$executeRaw`
      INSERT INTO contractor_billing (id, userId, stripeCustomerId, resetOn)
      VALUES (lower(hex(randomblob(16))), ${userId}, ${stripeCustomerId}, datetime('now', 'start of month', '+1 month'))
      ON CONFLICT(userId) DO UPDATE SET stripeCustomerId = ${stripeCustomerId}
    `;

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: stripeCustomerId,
    });
  } catch (error) {
    console.error("Error creating setup intent:", error);
    return NextResponse.json(
      { error: "Failed to create setup intent" },
      { status: 500 },
    );
  }
}
