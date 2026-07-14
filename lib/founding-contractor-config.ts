// ============================================================
// FOUNDING CONTRACTOR PROGRAM — Configuration
// Edit this file to update numbers shown across the entire site
// ============================================================

export const FOUNDING_CONTRACTOR_CONFIG = {
  /** How many spots remain out of the total */
  spotsRemaining: 45,

  /** Total spots in the founding program */
  spotsTotal: 100,

  /** Program name shown in headings */
  programName: "Founding Contractor Program",

  /** Short urgency line used in the banner */
  bannerSubtitle:
    "Only 45 contractor spots remain for our discounted founding memberships.",

  /** CTA destination for all founding program buttons */
  ctaHref: "/contractors/join",
} as const;
