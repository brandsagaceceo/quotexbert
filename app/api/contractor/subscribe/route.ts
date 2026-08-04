import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

let stripeSingleton: Stripe | null = null;

// Construct Stripe lazily at request time so module import does not crash the build.
function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set in environment variables. Please configure it in your production environment.");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(secretKey, {
      // Use the Stripe library's expected API version literal
      apiVersion: "2025-08-27.basil",
    });
  }
  return stripeSingleton;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { success: false, error: "Payment service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const stripe = getStripe();

    const {
      userId,
      categories,
      billingInterval = "month",
    } = await req.json();

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
      const customerParams: Stripe.CustomerCreateParams = {
        metadata: {
          userId: user.id,
        },
      };

      if (user.email) {
        customerParams.email = user.email;
      }

      if (user.name) {
        customerParams.name = user.name;
      }

      const customer = await stripe.customers.create(customerParams);
      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    // Map category IDs to prices and names
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

    const allCategoryIds = Object.keys(categoryPrices);
    const isAllAccess =
      Array.isArray(categories) &&
      categories.length === allCategoryIds.length &&
      allCategoryIds.every((id) => categories.includes(id));

    const ALL_ACCESS_PRICE = 199;
    const YEARLY_DISCOUNT_MONTHS = 10; // Charge for 10 months on annual billing
    const interval = billingInterval === "year" ? "year" : "month";
    const isYearly = interval === "year";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      line_items: isAllAccess
        ? [
            {
              price_data: {
                currency: "cad",
                product_data: {
                  name: "All Access Pass - All Categories",
                  description: "Subscription for job leads in all categories",
                },
                unit_amount:
                  ALL_ACCESS_PRICE * 100 * (isYearly ? YEARLY_DISCOUNT_MONTHS : 1),
                recurring: {
                  interval,
                },
              },
              quantity: 1,
            },
          ]
        : categories.map((catId: string) => {
            const monthlyPrice = categoryPrices[catId] || 0;
            const baseAmountCents = monthlyPrice * 100;
            const unitAmount = isYearly
              ? baseAmountCents * YEARLY_DISCOUNT_MONTHS
              : baseAmountCents;

            return {
              price_data: {
                currency: "cad",
                product_data: {
                  name: categoryNames[catId] || "Service Category",
                  description: "Subscription for job leads",
                },
                unit_amount: unitAmount,
                recurring: {
                  interval,
                },
              },
              quantity: 1,
            };
          }),
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.quotexbert.com"}/contractor/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://www.quotexbert.com"}/contractor/subscription`,
      metadata: {
        userId,
        categories: JSON.stringify(categories),
        pricingMode: isAllAccess ? "all_access" : "per_category",
        billingInterval: interval,
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
