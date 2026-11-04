import { SIMPLE_CATEGORIES } from "@/lib/categories";

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
