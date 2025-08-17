import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
});

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
