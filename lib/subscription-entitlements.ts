import { LEGACY_CATEGORY_PRICES, TIER_PRICING } from "@/lib/subscription-plans";
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

export function getCheckoutSubscriptionEntitlements(
  metadata: Record<string, string> | null | undefined,
): { contractorId: string; tier: SubscriptionTier | null; categories: string[]; legacyPerCategory: boolean } | null {
  if (!metadata) return null;
  if (metadata.contractorId || metadata.tier) {
    const entitlements = getSubscriptionEntitlements(metadata.tier, metadata.selectedCategories);
    return metadata.contractorId && entitlements
      ? { contractorId: metadata.contractorId, ...entitlements, legacyPerCategory: false }
      : null;
  }
  if (!metadata.userId || !["per_category", "all_access"].includes(metadata.pricingMode ?? "")) return null;
  let categories: unknown;
  try {
    categories = JSON.parse(metadata.categories ?? "");
  } catch {
    return null;
  }
  if (!Array.isArray(categories) || categories.length === 0 || !categories.every(
    (category): category is string => typeof category === "string" && Object.prototype.hasOwnProperty.call(LEGACY_CATEGORY_PRICES, category),
  )) return null;
  const selected = [...new Set<string>(categories)];
  if (metadata.pricingMode === "all_access" && selected.length !== Object.keys(LEGACY_CATEGORY_PRICES).length) return null;
  return {
    contractorId: metadata.userId,
    tier: null,
    categories: selected,
    legacyPerCategory: metadata.pricingMode === "per_category",
  };
}
