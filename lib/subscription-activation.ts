import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getCheckoutSubscriptionEntitlements, isSubscriptionPaymentVerified } from "@/lib/subscription-entitlements";
import { LEGACY_CATEGORY_PRICES } from "@/lib/subscription-plans";

export class SubscriptionActivationError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

export function getSubscriptionBillingPeriod(subscription: Stripe.Subscription) {
  const item = subscription.items.data[0];
  if (!item || !Number.isFinite(item.current_period_start) || !Number.isFinite(item.current_period_end) ||
      item.current_period_end <= item.current_period_start) {
    throw new SubscriptionActivationError("Stripe subscription has no valid billing period", 409);
  }
  return {
    currentPeriodStart: new Date(item.current_period_start * 1000),
    currentPeriodEnd: new Date(item.current_period_end * 1000),
    interval: item.price.recurring?.interval,
  };
}

export async function activateCheckoutSubscription(session: Stripe.Checkout.Session, expectedContractorId?: string) {
  if (session.mode !== "subscription" || session.status !== "complete") {
    throw new SubscriptionActivationError("Checkout is not complete. Review billing before starting another checkout.", 402);
  }
  const entitlements = getCheckoutSubscriptionEntitlements(session.metadata);
  if (!entitlements) {
    throw new SubscriptionActivationError("Checkout has invalid subscription details. Contact support before paying again.", 400);
  }
  if (expectedContractorId && entitlements.contractorId !== expectedContractorId) {
    throw new SubscriptionActivationError("Checkout session does not belong to this contractor", 403);
  }
  const contractor = await prisma.user.findUnique({
    where: { id: entitlements.contractorId },
    include: { billing: true },
  });
  if (!contractor || contractor.role !== "contractor" || !contractor.isActive) {
    throw new SubscriptionActivationError("An active contractor account is required", 403);
  }
  const stripeSubscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const stripeCustomerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
  if (!stripeSubscriptionId || !stripeCustomerId) {
    throw new SubscriptionActivationError("Checkout is missing its subscription or customer", 400);
  }
  const linkedCustomerIds = [contractor.stripeCustomerId, contractor.billing?.stripeCustomerId]
    .filter((id): id is string => Boolean(id));
  if (linkedCustomerIds.length === 0 || new Set(linkedCustomerIds).size > 1 || linkedCustomerIds[0] !== stripeCustomerId) {
    throw new SubscriptionActivationError("Checkout customer does not match this contractor's billing account", 403);
  }
  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
  const subscriptionCustomerId = typeof stripeSubscription.customer === "string"
    ? stripeSubscription.customer : stripeSubscription.customer.id;
  if (subscriptionCustomerId !== stripeCustomerId) {
    throw new SubscriptionActivationError("Checkout customer does not match its subscription", 403);
  }
  if (!["active", "trialing"].includes(stripeSubscription.status)) {
    throw new SubscriptionActivationError("Stripe subscription is not active", 409);
  }
  if (!isSubscriptionPaymentVerified(session.payment_status, stripeSubscription.status)) {
    throw new SubscriptionActivationError("Payment is not confirmed. Review billing before paying again.", 402);
  }
  const { currentPeriodStart, currentPeriodEnd, interval } = getSubscriptionBillingPeriod(stripeSubscription);
  await prisma.$transaction(async transaction => {
    for (const category of entitlements.categories) {
      const monthlyPrice = entitlements.legacyPerCategory ? LEGACY_CATEGORY_PRICES[category] : 0;
      if (monthlyPrice === undefined) throw new SubscriptionActivationError("Invalid legacy subscription category", 400);
      const data = {
        status: "active",
        stripeSubscriptionId,
        stripeCustomerId,
        currentPeriodStart,
        currentPeriodEnd,
        canClaimLeads: true,
        canViewLeads: true,
      };
      await transaction.contractorSubscription.upsert({
        where: { contractorId_category: { contractorId: contractor.id, category } },
        create: {
          contractorId: contractor.id, category,
          monthlyPrice,
          ...data,
        },
        update: data,
      });
    }
    const current = await transaction.user.findUniqueOrThrow({ where: { id: contractor.id }, select: { selectedCategories: true } });
    const stored: unknown = JSON.parse(current.selectedCategories || "[]");
    if (!Array.isArray(stored) || !stored.every((category): category is string => typeof category === "string")) {
      throw new SubscriptionActivationError("Account category data needs support before activation.", 409);
    }
    const categories = [...new Set([...stored, ...entitlements.categories])];
    await transaction.user.update({
      where: { id: contractor.id },
      data: {
        selectedCategories: JSON.stringify(categories),
        stripeCustomerId,
        stripeSubscriptionId,
        subscriptionStatus: stripeSubscription.status,
        subscriptionCurrentPeriodEnd: currentPeriodEnd,
        ...(interval ? { subscriptionInterval: interval } : {}),
        ...(entitlements.tier ? { subscriptionPlan: entitlements.tier.toUpperCase() } : {}),
      },
    });
  });
  return { ...entitlements, currentPeriodEnd };
}
