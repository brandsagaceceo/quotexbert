import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Subscription tier pricing
const TIER_PRICING = {
  handyman: {
    name: "Handyman",
    price: 4900, // $49 in cents
    categories: 3,
    description: "Access to 3 job categories with unlimited applications"
  },
  renovation: {
    name: "Renovation Xbert",
    price: 9900, // $99 in cents
    categories: 6,
    description: "Access to 6 job categories with priority features"
  },
  general: {
    name: "General Contractor",
    price: 14900, // $149 in cents
    categories: 10,
    description: "Access to ALL categories with premium features"
  }
};

export async function POST(req: Request) {
  try {
    console.log('[API] Create checkout request received');
    const { contractorId, tier, email } = await req.json();
    console.log('[API] Request data:', { contractorId, tier, email });

    if (!contractorId || !tier || !email) {
      console.error('[API] Missing required fields');
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate tier
    if (!TIER_PRICING[tier as keyof typeof TIER_PRICING]) {
      console.error('[API] Invalid tier:', tier);
      return NextResponse.json(
        { success: false, error: "Invalid subscription tier" },
        { status: 400 }
      );
    }

    const tierConfig = TIER_PRICING[tier as keyof typeof TIER_PRICING];

    // Get or create Stripe customer
    const contractor = await prisma.user.findUnique({
      where: { id: contractorId },
      include: { billing: true }
    });

    if (!contractor) {
      return NextResponse.json(
        { success: false, error: "Contractor not found" },
        { status: 404 }
      );
    }

    let customerId = contractor.billing?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        ...(contractor.name && { name: contractor.name }),
        metadata: {
          userId: contractorId,
          role: "contractor"
        }
      });
      customerId = customer.id;

      // Update billing record
      if (contractor.billing) {
        await prisma.contractorBilling.update({
          where: { id: contractor.billing.id },
          data: { stripeCustomerId: customerId }
        });
      } else {
        await prisma.contractorBilling.create({
          data: {
            userId: contractorId,
            stripeCustomerId: customerId
          }
        });
      }
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            recurring: {
              interval: "month"
            },
            unit_amount: tierConfig.price,
            product_data: {
              name: `${tierConfig.name} Plan`,
              description: tierConfig.description,
              metadata: {
                tier: tier,
                categories: tierConfig.categories.toString()
              }
            }
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/contractor/subscriptions?success=true&tier=${tier}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/contractor/subscriptions?canceled=true`,
      metadata: {
        contractorId: contractorId,
        tier: tier,
        categories: tierConfig.categories.toString()
      }
    });

    console.log('[API] Checkout session created successfully:', session.id);
    console.log('[API] Checkout URL:', session.url);
    
    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    console.error("[API] Error creating checkout session:", error);
    console.error("[API] Error details:", error instanceof Error ? error.stack : error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create checkout session" 
      },
      { status: 500 }
    );
  }
}
