/**
 * Centralized Entitlements and Tier Management
 * Single source of truth for subscription tiers, permissions, and access control
 */

import { prisma } from "@/lib/prisma";
import { isGodUser } from "@/lib/god-access";

// Tier definitions - SINGLE SOURCE OF TRUTH
export const TIERS = {
  FREE: 'FREE',
  HANDYMAN: 'HANDYMAN',
  RENOVATION: 'RENOVATION',
  GENERAL: 'GENERAL'
} as const;

export type Tier = typeof TIERS[keyof typeof TIERS];

// Tier configuration with permissions
export const TIER_CONFIG = {
  [TIERS.FREE]: {
    name: 'Free',
    price: 0,
    categoryLimit: 0,
    canBrowseJobs: true,
    canAcceptJobs: false,
    canPickCategories: false,
    canViewAllLeads: false,
    features: ['Browse jobs', 'View pricing']
  },
  [TIERS.HANDYMAN]: {
    name: 'Handyman',
    price: 49,
    categoryLimit: 3,
    canBrowseJobs: true,
    canAcceptJobs: true,
    canPickCategories: true,
    canViewAllLeads: false,
    features: ['3 categories', 'Accept jobs', 'Email notifications', 'Profile visibility']
  },
  [TIERS.RENOVATION]: {
    name: 'Renovation Xbert',
    price: 99,
    categoryLimit: 8,
    canBrowseJobs: true,
    canAcceptJobs: true,
    canPickCategories: true,
    canViewAllLeads: true,
    features: ['8 categories', 'Priority leads', 'Advanced analytics', 'Featured profile']
  },
  [TIERS.GENERAL]: {
    name: 'General Contractor',
    price: 149,
    categoryLimit: 999, // Unlimited
    canBrowseJobs: true,
    canAcceptJobs: true,
    canPickCategories: true,
    canViewAllLeads: true,
    features: ['Unlimited categories', 'All leads', 'Premium support', 'API access']
  }
} as const;

// User entitlements interface
export interface UserEntitlements {
  userId: string;
  email: string;
  tier: Tier;
  isPro: boolean;
  isGod: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  currentPeriodEnd: Date | null;
  proOverride: boolean;
  proOverrideTier: string | null;
  categoryLimit: number;
  selectedCategories: string[];
  canBrowseJobs: boolean;
  canAcceptJobs: boolean;
  canPickCategories: boolean;
  canViewAllLeads: boolean;
  features: string[];
}

/**
 * Get effective tier for a user (with God and Pro override support)
 */
export function getEffectiveTier(
  email: string | null,
  subscriptionPlan: string | null,
  proOverrideTier: string | null
): Tier {
  // God users get highest tier
  if (email && isGodUser(email)) {
    return TIERS.GENERAL;
  }
  
  // Pro override takes precedence
  if (proOverrideTier && proOverrideTier in TIERS) {
    return proOverrideTier as Tier;
  }
  
  // Normalize subscription plan to tier
  if (subscriptionPlan) {
    const normalizedPlan = subscriptionPlan.toUpperCase();
    if (normalizedPlan in TIERS) {
      return normalizedPlan as Tier;
    }
    // Handle lowercase tier names from Stripe metadata
    if (subscriptionPlan.toLowerCase() === 'handyman') return TIERS.HANDYMAN;
    if (subscriptionPlan.toLowerCase() === 'renovation') return TIERS.RENOVATION;
    if (subscriptionPlan.toLowerCase() === 'general') return TIERS.GENERAL;
  }
  
  return TIERS.FREE;
}

/**
 * Check if user has Pro access (any paid tier)
 */
export function isPro(user: { subscriptionStatus?: string | null; subscriptionPlan?: string | null; proOverride?: boolean; email?: string | null }): boolean {
  if (user.email && isGodUser(user.email)) return true;
  if (user.proOverride) return true;
  if (user.subscriptionStatus === 'active' && user.subscriptionPlan) return true;
  return false;
}

/**
 * Get full entitlements for a user
 */
export async function getUserEntitlements(userId: string): Promise<UserEntitlements | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionCurrentPeriodEnd: true,
        proOverride: true,
        proOverrideTier: true,
        selectedCategories: true
      }
    });

    if (!user) return null;

    const effectiveTier = getEffectiveTier(user.email, user.subscriptionPlan, user.proOverrideTier);
    const tierConfig = TIER_CONFIG[effectiveTier];
    const isGod = isGodUser(user.email);
    const hasProAccess = isPro(user);

    // Parse selected categories
    let categories: string[] = [];
    if (user.selectedCategories) {
      try {
        categories = JSON.parse(user.selectedCategories);
      } catch (e) {
        console.error('Failed to parse selected categories:', e);
      }
    }

    return {
      userId: user.id,
      email: user.email,
      tier: effectiveTier,
      isPro: hasProAccess,
      isGod,
      stripeCustomerId: user.stripeCustomerId,
      stripeSubscriptionId: user.stripeSubscriptionId,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionPlan: user.subscriptionPlan,
      currentPeriodEnd: user.subscriptionCurrentPeriodEnd,
      proOverride: user.proOverride || false,
      proOverrideTier: user.proOverrideTier,
      categoryLimit: tierConfig.categoryLimit,
      selectedCategories: categories,
      canBrowseJobs: tierConfig.canBrowseJobs,
      canAcceptJobs: isGod || tierConfig.canAcceptJobs,
      canPickCategories: isGod || tierConfig.canPickCategories,
      canViewAllLeads: isGod || tierConfig.canViewAllLeads,
      features: tierConfig.features
    };
  } catch (error) {
    console.error('[ENTITLEMENTS] Error fetching user entitlements:', error);
    return null;
  }
}

/**
 * Check if user can pick categories
 */
export function canPickCategories(tier: Tier): boolean {
  return TIER_CONFIG[tier].canPickCategories;
}

/**
 * Check if user can accept jobs
 */
export function canAcceptJobs(user: { email?: string | null; subscriptionStatus?: string | null }): boolean {
  if (user.email && isGodUser(user.email)) return true;
  return user.subscriptionStatus === 'active';
}

/**
 * Get category limit for tier
 */
export function getCategoryLimit(tier: Tier): number {
  return TIER_CONFIG[tier].categoryLimit;
}

/**
 * Validate selected categories against tier limit
 */
export function validateCategories(selectedCategories: string[], tier: Tier): { valid: boolean; error?: string } {
  const limit = getCategoryLimit(tier);
  
  if (limit === 0) {
    return { valid: false, error: 'Your tier does not allow category selection. Please upgrade.' };
  }
  
  if (selectedCategories.length > limit && limit !== 999) {
    return { valid: false, error: `Your tier allows up to ${limit} categories. You selected ${selectedCategories.length}.` };
  }
  
  return { valid: true };
}

/**
 * Get tier by price (for Stripe callback)
 */
export function getTierByPrice(priceInCents: number): Tier | null {
  const priceInDollars = priceInCents / 100;
  
  for (const [tierKey, config] of Object.entries(TIER_CONFIG)) {
    if (config.price === priceInDollars) {
      return tierKey as Tier;
    }
  }
  
  return null;
}

/**
 * Check if user needs to select categories
 */
export async function needsCategorySelection(userId: string): Promise<boolean> {
  try {
    const entitlements = await getUserEntitlements(userId);
    if (!entitlements) return false;
    
    // If user can pick categories but hasn't selected any
    if (entitlements.canPickCategories && entitlements.selectedCategories.length === 0) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('[ENTITLEMENTS] Error checking category selection:', error);
    return false;
  }
}
