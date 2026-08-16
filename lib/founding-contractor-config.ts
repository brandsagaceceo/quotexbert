export const FOUNDING_CONTRACTOR_CONFIG = {
  /** Program name shown in headings */
  programName: "New Contractor Offer",

  /** CTA destination for all founding program buttons */
  ctaHref: "/contractors/join",
} as const;

export const FOUNDING_OFFER_ENABLED =
  process.env.NEXT_PUBLIC_FOUNDING_OFFER_ENABLED !== "false" &&
  process.env.FOUNDING_OFFER_ENABLED !== "false";

/** Homeowner-facing trust signal shown on the project-posting form only. */
export const HOMEOWNER_TRUST_SIGNAL =
  "Post your project now to connect with available professionals.";

export function isFoundingOfferEnabled(): boolean {
  return FOUNDING_OFFER_ENABLED;
}
