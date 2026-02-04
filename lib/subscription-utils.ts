import { prisma } from "@/lib/prisma";

export interface EffectiveSubscription {
  tier: string | null;
  status: string | null;
  isOverride: boolean;
  overrideReason?: string | null;
  expiresAt?: Date | null;
}

/**
 * Get the effective subscription for a user
 * Checks manual override first, then falls back to Stripe subscription
 * This is the SINGLE SOURCE OF TRUTH for subscription status
 */
export async function getEffectiveSubscription(userId: string): Promise<EffectiveSubscription> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      // Override fields
      proOverrideEnabled: true,
      proOverrideTier: true,
      proOverrideExpiresAt: true,
      proOverrideReason: true,
      
      // Stripe fields
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
    }
  });

  if (!user) {
    return {
      tier: null,
      status: null,
      isOverride: false
    };
  }

  // Check if manual override is enabled and active
  const isOverrideActive = user.proOverrideEnabled && 
    (!user.proOverrideExpiresAt || user.proOverrideExpiresAt > new Date());

  if (isOverrideActive) {
    return {
      tier: user.proOverrideTier,
      status: 'active', // Overrides are always active when enabled
      isOverride: true,
      overrideReason: user.proOverrideReason,
      expiresAt: user.proOverrideExpiresAt
    };
  }

  // Fall back to Stripe subscription
  return {
    tier: user.subscriptionPlan,
    status: user.subscriptionStatus,
    isOverride: false,
    expiresAt: user.subscriptionCurrentPeriodEnd
  };
}

/**
 * Check if a user has an active Pro subscription (any tier)
 * Respects manual overrides
 */
export async function isPro(userId: string): Promise<boolean> {
  const sub = await getEffectiveSubscription(userId);
  
  if (sub.status !== 'active') {
    return false;
  }

  const proTiers = ['HANDYMAN', 'RENOVATION', 'GENERAL', 'PRO', 'PRO_MAX'];
  return sub.tier ? proTiers.includes(sub.tier.toUpperCase()) : false;
}

/**
 * Check if user has a specific tier or higher
 * Tier hierarchy: FREE < HANDYMAN < RENOVATION < GENERAL
 */
export async function hasTier(userId: string, requiredTier: string): Promise<boolean> {
  const sub = await getEffectiveSubscription(userId);
  
  if (sub.status !== 'active') {
    return false;
  }

  const tierHierarchy: Record<string, number> = {
    'FREE': 0,
    'HANDYMAN': 1,
    'RENOVATION': 2,
    'GENERAL': 3,
    'PRO': 3, // Alias for GENERAL
    'PRO_MAX': 3, // Same as GENERAL (highest)
  };

  const userTierLevel = tierHierarchy[sub.tier?.toUpperCase() || 'FREE'] || 0;
  const requiredTierLevel = tierHierarchy[requiredTier.toUpperCase()] || 0;

  return userTierLevel >= requiredTierLevel;
}

/**
 * Get subscription features based on effective tier
 */
export async function getSubscriptionFeatures(userId: string) {
  const sub = await getEffectiveSubscription(userId);
  
  const tier = sub.tier?.toUpperCase() || 'FREE';
  
  // Define features per tier
  const features: Record<string, any> = {
    'FREE': {
      canClaimLeads: false,
      maxLeadsPerMonth: 0,
      canViewAllLeads: false,
      hasPrioritySupport: false,
      canCreatePortfolio: false,
    },
    'HANDYMAN': {
      canClaimLeads: true,
      maxLeadsPerMonth: 10,
      canViewAllLeads: true,
      hasPrioritySupport: false,
      canCreatePortfolio: true,
      maxPortfolioItems: 10,
    },
    'RENOVATION': {
      canClaimLeads: true,
      maxLeadsPerMonth: 25,
      canViewAllLeads: true,
      hasPrioritySupport: true,
      canCreatePortfolio: true,
      maxPortfolioItems: 25,
    },
    'GENERAL': {
      canClaimLeads: true,
      maxLeadsPerMonth: 999, // Unlimited
      canViewAllLeads: true,
      hasPrioritySupport: true,
      canCreatePortfolio: true,
      maxPortfolioItems: 999, // Unlimited
      hasAdvancedAnalytics: true,
    },
    'PRO': {
      canClaimLeads: true,
      maxLeadsPerMonth: 999,
      canViewAllLeads: true,
      hasPrioritySupport: true,
      canCreatePortfolio: true,
      maxPortfolioItems: 999,
      hasAdvancedAnalytics: true,
    },
    'PRO_MAX': {
      canClaimLeads: true,
      maxLeadsPerMonth: 999,
      canViewAllLeads: true,
      hasPrioritySupport: true,
      canCreatePortfolio: true,
      maxPortfolioItems: 999,
      hasAdvancedAnalytics: true,
      hasAllFeatures: true,
    }
  };

  return {
    ...sub,
    features: features[tier] || features['FREE']
  };
}
