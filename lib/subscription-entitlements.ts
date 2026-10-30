import { TIER_PRICING } from "@/lib/subscription-plans";
import { parseSubscriptionMetadataCategories } from "@/lib/subscription-categories";

export type SubscriptionTier = keyof typeof TIER_PRICING;

export function isSubscriptionTier(value: unknown): value is SubscriptionTier {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(TIER_PRICING, value)
  );
}

export function isSubscriptionPaymentVerified(
  paymentStatus: unknown,
  subscriptionStatus: unknown,
): boolean {
  if (subscriptionStatus === "active") return paymentStatus === "paid";
  return (
    subscriptionStatus === "trialing" &&
    (paymentStatus === "paid" || paymentStatus === "no_payment_required")
  );
}

export function getSubscriptionEntitlements(
  tier: unknown,
  rawCategories: unknown,
): { tier: SubscriptionTier; categories: string[] } | null {
  if (!isSubscriptionTier(tier)) return null;

  const categories = parseSubscriptionMetadataCategories(rawCategories);
  if (
    categories.length === 0 ||
    categories.length > TIER_PRICING[tier].categories
  ) {
    return null;
  }

  return { tier, categories };
}
