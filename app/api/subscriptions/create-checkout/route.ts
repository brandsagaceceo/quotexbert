import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { isGodUser } from "@/lib/god-access";
import { ALL_CATEGORIES } from "@/lib/categories";

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
    const { contractorId, tier, email, selectedCategories } = await req.json();
    console.log('[API] Request data:', { contractorId, tier, email, contractorIdType: typeof contractorId, contractorIdLength: contractorId?.length });

    // Read affiliate referral code from cookie (set by ReferralTracker)
    const cookieHeader = req.headers.get('cookie') || '';
    const refMatch = cookieHeader.match(/qxb_ref=([^;]+)/);
    const referralCodeFromCookie = refMatch?.[1] ? decodeURIComponent(refMatch[1]) : null;

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

    // Get or create Stripe customer (try DB id first, fallback to clerkUserId)
    let contractor = await prisma.user.findUnique({
      where: { id: contractorId },
      include: { billing: true }
    });

    if (!contractor) {
      contractor = await prisma.user.findUnique({
        where: { clerkUserId: contractorId },
        include: { billing: true }
      });
    }

    if (!contractor) {
      console.error('[API] Contractor not found for id:', contractorId);
      // Try email lookup as last resort
      if (email) {
        contractor = await prisma.user.findUnique({
          where: { email },
          include: { billing: true }
        });
        if (contractor) {
          console.log('[API] Found contractor by email fallback:', contractor.id);
        }
      }
    }

    if (!contractor) {
      // Auto-create DB record — user exists in Clerk but hasn't been synced to DB yet
      console.log('[API] No DB record found — creating one for:', email);
      try {
        contractor = await prisma.user.create({
          data: {
            email,
            clerkUserId: contractorId,
            role: 'contractor',
            name: email.split('@')[0],
          },
          include: { billing: true },
        });
        console.log('[API] Created DB record:', contractor.id);
      } catch (createErr) {
        console.error('[API] Failed to create DB record:', createErr);
        return NextResponse.json(
          { success: false, error: 'Account setup incomplete. Please sign out and sign back in.' },
          { status: 404 }
        );
      }
    }

    // Use the DB primary key for all operations
    const dbUserId = contractor.id;

    // ── AFFILIATE ATTRIBUTION ─────────────────────────────────────────────────
    // If a referral code cookie is present and the user hasn't been attributed yet,
    // attach the affiliate before checkout so the webhook can create commissions.
    if (referralCodeFromCookie && !contractor.referredByAffiliateId) {
      try {
        const affiliate = await prisma.affiliate.findUnique({
          where: { referralCode: referralCodeFromCookie },
        });
        if (affiliate) {
          await prisma.user.update({
            where: { id: dbUserId },
            data: { referredByAffiliateId: affiliate.id },
          });
          console.log(`[API] Affiliate ${affiliate.referralCode} attributed to contractor ${dbUserId}`);
        }
      } catch (affiliateErr) {
        console.error('[API] Affiliate attribution error (non-blocking):', affiliateErr);
      }
    }
    // ── END AFFILIATE ATTRIBUTION ─────────────────────────────────────────────

    // ── GOD USER BYPASS ────────────────────────────────────────────────────────
    // Admin/testing accounts skip Stripe entirely — activate subscription directly
    if (isGodUser(contractor.email)) {
      console.log('[API] God user detected — activating subscription without Stripe');
      const categoriesToActivate = selectedCategories && selectedCategories.length > 0
        ? selectedCategories
        : ALL_CATEGORIES.map((c: { id: string }) => c.id);

      const now = new Date();
      const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year for god users

      for (const category of categoriesToActivate) {
        await prisma.contractorSubscription.upsert({
          where: { contractorId_category: { contractorId: dbUserId, category } },
          create: {
            contractorId: dbUserId,
            category,
            status: "active",
            monthlyPrice: 0,
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            canClaimLeads: true,
            canViewLeads: true,
          },
          update: {
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            canClaimLeads: true,
            canViewLeads: true,
          },
        });
      }

      // Update user's subscription plan and categories
      await prisma.user.update({
        where: { id: dbUserId },
        data: {
          subscriptionPlan: tier,
          subscriptionStatus: "active",
          selectedCategories: JSON.stringify(categoriesToActivate),
        },
      });

      const successUrl = `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/contractor/subscriptions?success=true&tier=${tier}&god=1`;
      console.log('[API] God user subscription activated. Redirecting to:', successUrl);
      return NextResponse.json({ success: true, checkoutUrl: successUrl, godMode: true });
    }
    // ── END GOD USER BYPASS ────────────────────────────────────────────────────

    let customerId = contractor.billing?.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: email,
        ...(contractor.name && { name: contractor.name }),
        metadata: {
          userId: dbUserId,
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
            userId: dbUserId,
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
      success_url: `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/contractor/subscriptions?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/contractor/subscriptions?canceled=true`,
      metadata: {
        contractorId: dbUserId,
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
