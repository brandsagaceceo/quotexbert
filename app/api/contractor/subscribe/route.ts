import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(req: NextRequest) {
  try {
    const { userId, categories, amount } = await req.json();

    if (!userId || !categories || categories.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });
      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: categories.map((catId: string) => {
        // Map category IDs to prices
        const categoryPrices: Record<string, number> = {
          general: 49,
          plumbing: 39,
          electrical: 39,
          hvac: 39,
          roofing: 39,
          flooring: 29,
          painting: 29,
          kitchen: 49,
          bathroom: 39,
          basement: 39,
          deck: 39,
          landscaping: 29,
        };

        const categoryNames: Record<string, string> = {
          general: "General Contracting",
          plumbing: "Plumbing",
          electrical: "Electrical",
          hvac: "HVAC",
          roofing: "Roofing",
          flooring: "Flooring",
          painting: "Painting",
          kitchen: "Kitchen Remodeling",
          bathroom: "Bathroom Remodeling",
          basement: "Basement Finishing",
          deck: "Decks & Patios",
          landscaping: "Landscaping",
        };

        return {
          price_data: {
            currency: "cad",
            product_data: {
              name: categoryNames[catId] || "Service Category",
              description: "Monthly subscription for job leads",
            },
            unit_amount: (categoryPrices[catId] || 0) * 100, // Convert to cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        };
      }),
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contractor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/contractor/subscription`,
      metadata: {
        userId,
        categories: JSON.stringify(categories),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
