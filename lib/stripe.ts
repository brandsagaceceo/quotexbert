import Stripe from "stripe";
import { isFoundingOfferEnabled } from "@/lib/founding-contractor-config";

export { isFoundingOfferEnabled } from "@/lib/founding-contractor-config";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables. Please configure it in your production environment.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

// Subscription pricing configuration
export const SUBSCRIPTION_PLANS = {
  basic: {
    name: 'Basic Plan',
    description: 'Perfect for new contractors',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      'Access to 10 leads per month',
      'Basic profile listing',
      'Customer messaging',
      'Portfolio showcase (5 photos)',
      'Email support'
    ],
    limits: {
      monthlyLeads: 10,
      portfolioPhotos: 5
    }
  },
  professional: {
    name: 'Professional Plan', 
    description: 'For growing contractors',
    monthlyPrice: 59,
    yearlyPrice: 590,
    features: [
      'Access to 25 leads per month',
      'Priority profile listing',
      'Customer messaging',
      'Portfolio showcase (15 photos)',
      'Phone + email support',
      'Advanced analytics'
    ],
    limits: {
      monthlyLeads: 25,
      portfolioPhotos: 15
    }
  },
  premium: {
    name: 'Premium Plan',
    description: 'For established contractors',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      'Unlimited leads access',
      'Featured profile listing',
      'Customer messaging',
      'Unlimited portfolio photos',
      'Priority phone + email support',
      'Advanced analytics',
      'Lead bidding priority'
    ],
    limits: {
      monthlyLeads: -1, // -1 means unlimited
      portfolioPhotos: -1
    }
  }
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;

// ─────────────────────────────────────────────────────────────────────────────
// FOUNDING CONTRACTOR OFFER — "First month $0.99, then renews at the regular
// tier price." Implemented as a Stripe Coupon with `duration: "once"`, which
// Stripe applies ONLY to the very first invoice of a subscription — every
// invoice after that automatically bills the subscription's normal recurring
// price with zero extra code. This intentionally avoids creating a second,
// permanent $0.99 recurring Price (which would keep charging $0.99 forever).
//
// Coupons are created via the Stripe API at runtime (idempotent, deterministic
// ID per tier) so nothing needs to be pre-created by hand in the Stripe
// Dashboard. If a coupon with that ID already exists, it is reused as-is.
// ─────────────────────────────────────────────────────────────────────────────

/** Cents charged for the discounted first month. */
export const FOUNDING_OFFER_FIRST_MONTH_CENTS = 99; // $0.99

/**
 * Returns (creating if necessary) a Stripe Coupon ID that discounts exactly one
 * invoice down to $0.99 for the given tier's regular monthly price. Safe to call
 * on every checkout — Stripe coupon IDs are deterministic per tier/price so the
 * same coupon is reused instead of creating duplicates.
 */
export async function getOrCreateFoundingOfferCoupon(
  tierKey: string,
  regularPriceCents: number,
): Promise<string> {
  const couponId = `founding-${tierKey}-099`;
  const amountOff = regularPriceCents - FOUNDING_OFFER_FIRST_MONTH_CENTS;

  if (amountOff <= 0) {
    throw new Error(
      `Founding offer misconfigured for tier "${tierKey}": regular price (${regularPriceCents}c) must exceed $0.99`,
    );
  }

  try {
    await stripe.coupons.retrieve(couponId);
    return couponId;
  } catch {
    // Not found — create it. Race-safe: if a concurrent request creates it
    // first, Stripe returns a "resource_already_exists" error which we swallow.
    try {
      await stripe.coupons.create({
        id: couponId,
        name: "Founding Contractor — First Month $0.99",
        amount_off: amountOff,
        currency: "cad",
        duration: "once",
      });
    } catch (createErr: any) {
      if (createErr?.code !== "resource_already_exists") {
        throw createErr;
      }
    }
    return couponId;
  }
}


// Platform fee configuration
export const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee
export const STRIPE_FEE_PERCENTAGE = 0.029; // 2.9% + $0.30
export const STRIPE_FEE_FIXED = 0.30;

export function calculatePaymentFees(amount: number) {
  const stripeFee = Math.round((amount * STRIPE_FEE_PERCENTAGE + STRIPE_FEE_FIXED) * 100) / 100;
  const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE * 100) / 100;
  const contractorAmount = Math.round((amount - stripeFee - platformFee) * 100) / 100;

  return {
    totalAmount: amount,
    stripeFee,
    platformFee,
    contractorAmount
  };
}

/**
 * Create or retrieve a Stripe customer for a user
 */
export async function createOrGetStripeCustomer(
  userId: string,
  email: string,
  name?: string,
): Promise<string> {
  try {
    // Search for existing customer by email first
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]!.id;
    }

    // Create new customer
    const customerData: {
      email: string;
      metadata: { userId: string };
      name?: string;
    } = {
      email,
      metadata: { userId },
    };

    if (name) {
      customerData.name = name;
    }

    const customer = await stripe.customers.create(customerData);

    return customer.id;
  } catch (error) {
    console.error("Error creating/getting Stripe customer:", error);
    throw error;
  }
}

/**
 * Create a payment intent for lead claiming
 */
export async function createPaymentIntent(
  customerId: string,
  amountCents: number,
  leadId: string,
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "cad",
      customer: customerId,
      confirmation_method: "automatic",
      confirm: true,
      off_session: true, // Indicates this is for an off-session payment
      metadata: {
        leadId,
        type: "lead_claim",
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

/**
 * Create a setup intent for saving payment methods
 */
export async function createSetupIntent(
  customerId: string,
): Promise<Stripe.SetupIntent> {
  try {
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    return setupIntent;
  } catch (error) {
    console.error("Error creating setup intent:", error);
    throw error;
  }
}

/**
 * Get customer's payment methods
 */
export async function getCustomerPaymentMethods(
  customerId: string,
): Promise<Stripe.PaymentMethod[]> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    return paymentMethods.data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
}

/**
 * Format amount in cents to currency string
 */
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amountCents / 100);
}

/**
 * Helper function to get plan details
 */
export function getPlanDetails(planId: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[planId];
}

/**
 * Helper function to check if user has access to a feature
 */
export function hasFeatureAccess(
  plan: SubscriptionPlan | null,
  feature: 'leads' | 'portfolio' | 'analytics' | 'priority_support'
): boolean {
  if (!plan) return false;
  
  const planDetails = SUBSCRIPTION_PLANS[plan];
  
  switch (feature) {
    case 'leads':
      return true; // All plans have lead access
    case 'portfolio':
      return true; // All plans have portfolio access
    case 'analytics':
      return plan === 'professional' || plan === 'premium';
    case 'priority_support':
      return plan === 'premium';
    default:
      return false;
  }
}

/**
 * Create a subscription checkout session
 */
export async function createSubscriptionCheckout(
  customerId: string,
  planId: SubscriptionPlan,
  interval: 'month' | 'year',
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    const plan = SUBSCRIPTION_PLANS[planId];
    const price = interval === 'month' ? plan.monthlyPrice : plan.yearlyPrice;
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            recurring: {
              interval: interval,
            },
            unit_amount: price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        planId,
        interval,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating subscription checkout:', error);
    throw error;
  }
}

/**
 * Create a customer portal session for subscription management
 */
export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}
