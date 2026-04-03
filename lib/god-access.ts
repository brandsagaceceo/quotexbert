/**
 * Unlimited Test Contractor Access
 * Grants full premium contractor access to specific internal testing accounts.
 * These accounts behave like a fully-subscribed contractor — no admin UI, no banners.
 */

// Internal list — do not expose to UI or logs
const UNLIMITED_TEST_EMAILS = [
  'brandsagaceo@gmail.com',
];

/**
 * Returns true if the email belongs to an internal test account that should
 * receive full unlimited premium contractor access without a paid subscription.
 * Never shows admin UI or debug banners for these accounts.
 */
export function isUnlimitedTestContractor(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return UNLIMITED_TEST_EMAILS.some(e => e.toLowerCase() === normalized);
}

/**
 * @deprecated use isUnlimitedTestContractor instead
 */
export function isGodUser(email: string | null | undefined): boolean {
  return isUnlimitedTestContractor(email);
}

/**
 * Get effective subscription tier — unlimited test accounts get highest tier.
 */
export function getEffectiveTier(email: string | null | undefined, actualTier: string | null): string {
  if (isUnlimitedTestContractor(email)) {
    return 'GENERAL'; // Highest tier: access to all categories
  }
  return actualTier || 'FREE';
}

/**
 * Check if user can accept any job (unlimited test contractors bypass subscription gate).
 */
export function canAcceptJob(email: string | null | undefined, hasSubscription: boolean = false): boolean {
  if (isUnlimitedTestContractor(email)) {
    return true;
  }
  return hasSubscription;
}

/**
 * Check if user can access a specific lead/category.
 */
export function canAccessLead(email: string | null | undefined, hasAccess: boolean = false): boolean {
  if (isUnlimitedTestContractor(email)) {
    return true;
  }
  return hasAccess;
}

/**
 * Get subscription feature set for unlimited test contractor accounts.
 */
export function getGodFeatures(email: string | null | undefined) {
  if (isUnlimitedTestContractor(email)) {
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

