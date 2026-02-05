/**
 * God Access Override System
 * Grants special "Pro MAX" tier access to specific admin/testing emails
 */

const GOD_EMAILS = [
  'brandsagaceo@gmail.com',
  'brandsagaCEO@gmail.com', // Case variations
];

/**
 * Check if an email has God access (admin override)
 */
export function isGodUser(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return GOD_EMAILS.some(godEmail => godEmail.toLowerCase() === normalizedEmail);
}

/**
 * Get effective subscription tier with God override
 * If user is a God user, return highest tier regardless of actual subscription
 */
export function getEffectiveTier(email: string | null | undefined, actualTier: string | null): string {
  if (isGodUser(email)) {
    return 'GENERAL'; // Highest tier: unlimited access to all categories
  }
  return actualTier || 'FREE';
}

/**
 * Check if user can accept any job (God users bypass all restrictions)
 */
export function canAcceptJob(email: string | null | undefined, hasSubscription: boolean = false): boolean {
  if (isGodUser(email)) {
    return true; // God users can accept ANY job
  }
  return hasSubscription;
}

/**
 * Check if user can access a specific lead/category (God users bypass tier gating)
 */
export function canAccessLead(email: string | null | undefined, hasAccess: boolean = false): boolean {
  if (isGodUser(email)) {
    return true; // God users can access ALL leads
  }
  return hasAccess;
}

/**
 * Get subscription features with God override
 */
export function getGodFeatures(email: string | null | undefined) {
  if (isGodUser(email)) {
    return {
      canClaimLeads: true,
      maxLeadsPerMonth: 999,
      canViewAllLeads: true,
      hasPrioritySupport: true,
      canCreatePortfolio: true,
      maxPortfolioItems: 999,
      hasAdvancedAnalytics: true,
      hasAllFeatures: true,
      isGodMode: true,
    };
  }
  return null;
}
