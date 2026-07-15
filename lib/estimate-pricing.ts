/**
 * Single source of truth for turning a saved AIEstimate into the price numbers
 * shown/used anywhere in the app (estimate review page, Post to Job Board form,
 * created Lead, contractor job board).
 *
 * Root cause this exists to fix: the homeowner review page and the
 * "Post to Job Board" flow were each computing their own price independently
 * (one showed the original AI range, the other recalculated an average from
 * only the currently-selected line items) — those two numbers could diverge
 * and did not need to. From now on every caller must go through
 * `normalizeEstimatePricing()` instead of recomputing a range/midpoint itself.
 */

export interface NormalizedEstimatePricing {
  /** Original AI low estimate for the whole project — never recalculated. */
  low: number;
  /** Original AI high estimate for the whole project — never recalculated. */
  high: number;
  /**
   * A single suggested number for contexts that need one (e.g. the Lead's
   * `budget` field). Uses the estimate's own `recommendedCost` if present,
   * otherwise the documented fallback rule: the midpoint of low/high,
   * rounded once, here, and reused everywhere — never recalculated per caller.
   */
  recommended: number;
  /** Not currently tracked as a separate figure by the estimator — always null until it is. */
  labor: number | null;
  /** Not currently tracked as a separate figure by the estimator — always null until it is. */
  materials: number | null;
  currency: string;
}

export interface EstimateLikePricing {
  minCost: number;
  maxCost: number;
  /** Optional explicit recommended/midpoint value if the estimate record ever stores one. */
  recommendedCost?: number | null;
}

export function normalizeEstimatePricing(estimate: EstimateLikePricing): NormalizedEstimatePricing {
  const low = Math.round(estimate.minCost);
  const high = Math.round(estimate.maxCost);
  const recommended =
    estimate.recommendedCost != null && Number.isFinite(estimate.recommendedCost)
      ? Math.round(estimate.recommendedCost)
      : Math.round((low + high) / 2);

  return {
    low,
    high,
    recommended,
    labor: null,
    materials: null,
    currency: 'CAD',
  };
}
