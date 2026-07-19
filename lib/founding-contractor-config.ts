// ============================================================
// FOUNDING CONTRACTOR PROGRAM — Configuration
// Edit this file to update numbers shown across the entire site
// ============================================================

const SPOTS_REMAINING = 42;

export const FOUNDING_CONTRACTOR_CONFIG = {
  /** How many spots remain out of the total */
  spotsRemaining: SPOTS_REMAINING,

  /** Total spots in the founding program */
  spotsTotal: 100,

  /** Program name shown in headings */
  programName: "Founding Contractor Program",

  /** Short urgency line used in the banner */
  bannerSubtitle:
    `Only ${SPOTS_REMAINING} founding contractor spots remain. First month $0.99, then renews at your selected monthly plan price. Cancel anytime.`,

  /** Short social proof line used instead of inflated contractor-count claims */
  foundingJoinLine:
    `Become one of our first founding contractors. Only ${SPOTS_REMAINING} founding contractor spots remain.`,

  /** CTA destination for all founding program buttons */
  ctaHref: "/contractors/join",
} as const;

export const FOUNDING_CONTRACTOR_SPOTS_REMAINING = FOUNDING_CONTRACTOR_CONFIG.spotsRemaining;
export const FOUNDING_OFFER_ENABLED =
  process.env.NEXT_PUBLIC_FOUNDING_OFFER_ENABLED !== "false" &&
  process.env.FOUNDING_OFFER_ENABLED !== "false";

export function isFoundingOfferEnabled(): boolean {
  return FOUNDING_OFFER_ENABLED;
}
