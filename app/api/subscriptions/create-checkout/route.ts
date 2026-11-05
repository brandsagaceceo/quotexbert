import { NextResponse } from "next/server";
import { stripe, getOrCreateFoundingOfferCoupon, isFoundingOfferEnabled, FOUNDING_OFFER_FIRST_MONTH_CENTS } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { isGodUser } from "@/lib/god-access";
import { ALL_CATEGORIES } from "@/lib/categories";
import { normalizeSubscriptionCategoryList } from "@/lib/subscription-categories";
import { resolveAuthUser } from "@/lib/server-auth";
import { isSubscriptionTier } from "@/lib/subscription-entitlements";
import { TIER_PRICING } from "@/lib/subscription-plans";
import {
  resolveOwnedStripeCustomerId,
  StripeCustomerOwnershipError,
  type StripeCustomerReference,
} from "@/lib/stripe-customer-ownership";

export async function POST(req: Request) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status },
      );
    }

    const { tier, selectedCategories } = await req.json();

    // Read affiliate referral code from cookie (set by ReferralTracker)
    const cookieHeader = req.headers.get('cookie') || '';
    const refMatch = cookieHeader.match(/qxb_ref=([^;]+)/);
    const referralCodeFromCookie = refMatch?.[1] ? decodeURIComponent(refMatch[1]) : null;

    if (!tier) {
      console.error('[API] Missing required fields');
      return NextResponse.json(
        { success: false, error: "Subscription tier is required" },
        { status: 400 }
      );
    }

    // Validate tier
    if (!isSubscriptionTier(tier)) {
      console.error('[API] Invalid tier:', tier);
      return NextResponse.json(
        { success: false, error: "Invalid subscription tier" },
        { status: 400 }
      );
    }

    const tierConfig = TIER_PRICING[tier];
    const normalizedSelectedCategories = normalizeSubscriptionCategoryList(selectedCategories);

    if (selectedCategories && normalizedSelectedCategories.length === 0) {
      return NextResponse.json(
        { success: false, error: "Select at least one valid category" },
        { status: 400 }
      );
    }

    if (normalizedSelectedCategories.length > tierConfig.categories) {
      return NextResponse.json(
        { success: false, error: `Your selected plan includes up to ${tierConfig.categories} categories` },
        { status: 400 }
      );
    }

    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      include: { billing: true }
    });

    if (!contractor) {
      return NextResponse.json(
        { success: false, error: "Contractor not found" },
        { status: 404 }
      );
    }
    if (contractor.role !== "contractor" || !contractor.isActive) {
      return NextResponse.json(
        { success: false, error: "An active contractor account is required" },
        { status: 403 }
      );
    }

    // Use the DB primary key for all operations
    const dbUserId = contractor.id;

    const existingCustomerIds = [
      contractor.stripeCustomerId,
      contractor.billing?.stripeCustomerId,
    ].filter((customerId): customerId is string => Boolean(customerId));
    if (new Set(existingCustomerIds).size > 1) {
      return NextResponse.json(
        { success: false, error: "Conflicting Stripe customer records require support" },
        { status: 409 }
      );
    }

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
      const categoriesToActivate = normalizedSelectedCategories.length > 0
        ? normalizedSelectedCategories
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

    // ── FOUNDING CONTRACTOR OFFER ELIGIBILITY ──────────────────────────────────
    // Only offered to contractors who have NEVER had a ContractorSubscription
    // record (any category, any status) — i.e. genuinely first-time subscribers.
    // This intentionally excludes anyone reactivating/upgrading an existing or
    // past subscription, per the "do not apply to existing subscriptions" rule.
    let foundingOfferApplied = false;
    let foundingCouponId: string | null = null;
    if (isFoundingOfferEnabled()) {
      const priorSubscriptionCount = await prisma.contractorSubscription.count({
        where: { contractorId: dbUserId },
      });
      if (priorSubscriptionCount === 0) {
        try {
          foundingCouponId = await getOrCreateFoundingOfferCoupon(tier, tierConfig.price);
          foundingOfferApplied = true;
        } catch (couponErr) {
          console.error('[API] Failed to prepare founding offer coupon (continuing at regular price):', couponErr);
          foundingOfferApplied = false;
        }
      }
    }
    // ── END FOUNDING CONTRACTOR OFFER ELIGIBILITY ──────────────────────────────

    let customerId: string;
    try {
      customerId = await resolveOwnedStripeCustomerId({
        userId: dbUserId,
        email: contractor.email,
        name: contractor.name,
        userStripeCustomerId: contractor.stripeCustomerId,
        billingStripeCustomerId: contractor.billing?.stripeCustomerId ?? null,
        retrieveCustomer: async (
          id,
        ): Promise<StripeCustomerReference> => {
          const customer = await stripe.customers.retrieve(id);
          if ("deleted" in customer && customer.deleted) {
            return { id: customer.id, deleted: true, metadata: {} };
          }
          return { id: customer.id, metadata: customer.metadata };
        },
        createCustomer: async (params): Promise<StripeCustomerReference> => {
          const customer = await stripe.customers.create({
            ...params,
            metadata: { ...params.metadata, role: "contractor" },
          });
          return { id: customer.id, metadata: customer.metadata };
        },
      });
    } catch (error) {
      if (error instanceof StripeCustomerOwnershipError) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 409 }
        );
      }
      throw error;
    }

    if (contractor.billing?.stripeCustomerId !== customerId) {
      if (contractor.billing) {
        await prisma.contractorBilling.update({
          where: { id: contractor.billing.id },
          data: { stripeCustomerId: customerId }
        });
      } else {
        await prisma.contractorBilling.create({
          data: { userId: dbUserId, stripeCustomerId: customerId }
        });
      }
    }

    // Create Stripe Checkout session
    // selectedCategories is embedded in metadata so the webhook can activate
    // categories even if the client-side localStorage flow fails (tab closed, etc.).
    // Stripe metadata values are capped at 500 chars; JSON of ≤10 short IDs is well within that.
    const selectedCategoriesJson = normalizedSelectedCategories.length > 0
      ? JSON.stringify(normalizedSelectedCategories)
      : '';

    const promotionStart = new Date().toISOString();

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
            // Always the tier's normal recurring price — the founding offer
            // discounts the FIRST invoice only via a "duration: once" coupon
            // below; it never changes this recurring price itself, so every
            // invoice after the first bills at the regular tier price.
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
      ...(foundingOfferApplied && foundingCouponId
        ? { discounts: [{ coupon: foundingCouponId }] }
        : {}),
      success_url: `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/contractor/subscriptions?success=true&tier=${tier}&session_id={CHECKOUT_SESSION_ID}${foundingOfferApplied ? '&founding=1' : ''}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"}/contractor/subscriptions?canceled=true`,
      metadata: {
        contractorId: dbUserId,
        tier: tier,
        categories: tierConfig.categories.toString(),
        selectedCategories: selectedCategoriesJson,
        // Founding-offer audit trail (item 1 requirement) — enough to reconstruct
        // exactly what was promised/charged without re-deriving it from Stripe.
        foundingOfferApplied: foundingOfferApplied ? "true" : "false",
        regularPriceCents: tierConfig.price.toString(),
        firstChargeCents: foundingOfferApplied ? FOUNDING_OFFER_FIRST_MONTH_CENTS.toString() : tierConfig.price.toString(),
        firstRenewalAmountCents: tierConfig.price.toString(),
        promotionStart: foundingOfferApplied ? promotionStart : "",
      }
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      foundingOfferApplied,
    });

  } catch (error) {
    console.error("[API] Error creating checkout session:", error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to create checkout session" 
      },
      { status: 500 }
    );
  }
}
