import { SIMPLE_CATEGORIES } from "@/lib/categories";

export const LEGACY_CATEGORY_PRICES: Record<string, number> = {
  general: 49, plumbing: 39, electrical: 39, hvac: 39, roofing: 39,
  flooring: 29, painting: 29, kitchen: 49, bathroom: 39, basement: 39,
  deck: 39, landscaping: 29,
};

export const LEGACY_CATEGORY_NAMES: Record<string, string> = {
  general: "General Contracting", plumbing: "Plumbing", electrical: "Electrical",
  hvac: "HVAC", roofing: "Roofing", flooring: "Flooring", painting: "Painting",
  kitchen: "Kitchen Remodeling", bathroom: "Bathroom Remodeling",
  basement: "Basement Finishing", deck: "Decks & Patios", landscaping: "Landscaping",
};

export const TIER_PRICING = {
  handyman: {
    name: "Handyman",
    price: 4900,
    categories: 3,
    description: "Access to 3 job categories with unlimited applications",
  },
  renovation: {
    name: "Renovation Xbert",
    price: 9900,
    categories: 6,
    description: "Access to 6 job categories with priority features",
  },
  general: {
    name: "General Contractor",
    price: 14900,
    categories: SIMPLE_CATEGORIES.length,
    description: "Access to ALL categories with premium features",
  },
} as const;
