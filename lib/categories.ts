export interface CategoryConfig {
  id: string;
  name: string;
  group: string;
  monthlyPrice: number;
  description?: string;
}

export interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  categories: CategoryConfig[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "appliances",
    name: "Appliances",
    description: "Installation, repair, and maintenance of home appliances",
    categories: [
      { id: "appliance-installation", name: "Appliance Installation", group: "appliances", monthlyPrice: 25 },
      { id: "appliance-repair", name: "Appliance Repair", group: "appliances", monthlyPrice: 25 },
      { id: "dishwasher-installation", name: "Dishwasher Installation", group: "appliances", monthlyPrice: 25 },
      { id: "bbq-cleaning-repair", name: "BBQ Cleaning & Repair", group: "appliances", monthlyPrice: 15 },
      { id: "gas-fireplace-tuneup", name: "Gas Fireplace Tune-Up", group: "appliances", monthlyPrice: 25 },
      { id: "furnace-tuneup", name: "Furnace Tune-Up", group: "appliances", monthlyPrice: 25 },
      { id: "ac-tuneup", name: "AC Tune-Up", group: "appliances", monthlyPrice: 25 },
      { id: "gas-services", name: "Gas Services", group: "appliances", monthlyPrice: 25 },
      { id: "refrigeration-specialist", name: "Refrigeration Specialist", group: "appliances", monthlyPrice: 25 },
    ]
  },
  {
    id: "cleaning-maintenance",
    name: "Cleaning & Maintenance", 
    description: "Cleaning services and property maintenance",
    categories: [
      { id: "carpet-upholstery-cleaning", name: "Carpet & Upholstery Cleaning", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "duct-cleaning", name: "Duct Cleaning", group: "cleaning-maintenance", monthlyPrice: 25 },
      { id: "dryer-vent-cleaning", name: "Dryer Vent Cleaning", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "tile-grout-cleaning", name: "Tile & Grout Cleaning", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "window-eaves-gutter-cleaning", name: "Window & Eaves/Gutter Cleaning", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "power-washing-stain-seal", name: "Power Washing / Stain & Seal", group: "cleaning-maintenance", monthlyPrice: 25 },
      { id: "deep-cleaning", name: "Deep Cleaning (house / office)", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "seasonal-lawn-maintenance", name: "Seasonal Lawn Maintenance", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "yard-cleanup", name: "Yard Clean-Up", group: "cleaning-maintenance", monthlyPrice: 15 },
      { id: "snow-removal-cleaning", name: "Snow Removal / Snow Cleaning", group: "cleaning-maintenance", monthlyPrice: 15 },
    ]
  },
  {
    id: "construction-renovation",
    name: "Construction & Renovation",
    description: "Major construction, renovation, and building projects",
    categories: [
      { id: "bathroom-renovation", name: "Bathroom Renovation", group: "construction-renovation", monthlyPrice: 49 },
      { id: "kitchen-renovation", name: "Kitchen Renovation", group: "construction-renovation", monthlyPrice: 49 },
      { id: "basement-renovation", name: "Basement Renovation", group: "construction-renovation", monthlyPrice: 49 },
      { id: "drywall-plastering", name: "Drywall & Plastering", group: "construction-renovation", monthlyPrice: 25 },
      { id: "flooring-installation-repair", name: "Flooring Installation / Repair", group: "construction-renovation", monthlyPrice: 49 },
      { id: "countertops-installation", name: "Countertops Installation", group: "construction-renovation", monthlyPrice: 49 },
      { id: "cabinets-millwork", name: "Cabinets & Millwork", group: "construction-renovation", monthlyPrice: 49 },
      { id: "painting-interior-exterior", name: "Painting (Interior / Exterior)", group: "construction-renovation", monthlyPrice: 25 },
      { id: "roofing", name: "Roofing", group: "construction-renovation", monthlyPrice: 49 },
      { id: "siding-repair-installation", name: "Siding Repair / Installation", group: "construction-renovation", monthlyPrice: 49 },
      { id: "masonry-stone-interlock-concrete", name: "Masonry, Stone, Interlock & Concrete", group: "construction-renovation", monthlyPrice: 49 },
      { id: "decks-fences", name: "Decks & Fences", group: "construction-renovation", monthlyPrice: 49 },
      { id: "garage-builds-repairs", name: "Garage Builds & Repairs", group: "construction-renovation", monthlyPrice: 49 },
      { id: "stair-builder-railings", name: "Stair Builder / Railings", group: "construction-renovation", monthlyPrice: 49 },
    ]
  },
  {
    id: "electrical-smart-home",
    name: "Electrical & Smart Home",
    description: "Electrical work and smart home technology installation",
    categories: [
      { id: "electrical-general", name: "Electrical (General)", group: "electrical-smart-home", monthlyPrice: 25 },
      { id: "lighting-installations", name: "Lighting Installations", group: "electrical-smart-home", monthlyPrice: 25 },
      { id: "smart-home-installation", name: "Smart Home Installation", group: "electrical-smart-home", monthlyPrice: 25 },
      { id: "security-systems", name: "Security Systems", group: "electrical-smart-home", monthlyPrice: 25 },
      { id: "home-electronics-setup", name: "Home Electronics Setup", group: "electrical-smart-home", monthlyPrice: 25 },
      { id: "tv-mounting", name: "TV Mounting", group: "electrical-smart-home", monthlyPrice: 15 },
      { id: "window-tinting", name: "Apply Window Tinting", group: "electrical-smart-home", monthlyPrice: 15 },
    ]
  },
  {
    id: "hvac",
    name: "HVAC (Heating, Cooling & Ventilation)",
    description: "Heating, ventilation, and air conditioning services",
    categories: [
      { id: "heating-cooling-hvac", name: "Heating & Cooling (HVAC)", group: "hvac", monthlyPrice: 49 },
      { id: "air-cleaners-humidifiers", name: "Air Cleaners / Humidifiers", group: "hvac", monthlyPrice: 25 },
      { id: "ventilation-exhaust-fans", name: "Ventilation / Exhaust Fans", group: "hvac", monthlyPrice: 25 },
      { id: "insulation", name: "Insulation", group: "hvac", monthlyPrice: 25 },
    ]
  },
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Plumbing installation, repair, and maintenance services",
    categories: [
      { id: "general-plumbing", name: "General Plumbing", group: "plumbing", monthlyPrice: 25 },
      { id: "toilet-repair-installation", name: "Toilet Repair & Installation", group: "plumbing", monthlyPrice: 25 },
      { id: "faucet-fixture-repair", name: "Faucet & Fixture Repair", group: "plumbing", monthlyPrice: 25 },
      { id: "drain-cleaning", name: "Drain Cleaning", group: "plumbing", monthlyPrice: 25 },
      { id: "pipe-repair-replacement", name: "Pipe Repair & Replacement", group: "plumbing", monthlyPrice: 25 },
      { id: "water-heater-services", name: "Water Heater Services", group: "plumbing", monthlyPrice: 49 },
      { id: "sump-pump-services", name: "Sump Pump Services", group: "plumbing", monthlyPrice: 25 },
      { id: "backflow-prevention", name: "Backflow Prevention", group: "plumbing", monthlyPrice: 25 },
      { id: "leak-detection-repair", name: "Leak Detection & Repair", group: "plumbing", monthlyPrice: 25 },
    ]
  },
  {
    id: "exterior-landscaping",
    name: "Exterior & Landscaping",
    description: "Outdoor work, landscaping, and exterior improvements",
    categories: [
      { id: "artificial-turf", name: "Artificial Turf", group: "exterior-landscaping", monthlyPrice: 25 },
      { id: "landscaping-garden-design", name: "Landscaping / Garden Design", group: "exterior-landscaping", monthlyPrice: 79 },
      { id: "lawn-maintenance", name: "Lawn Maintenance", group: "exterior-landscaping", monthlyPrice: 15 },
      { id: "tree-services", name: "Tree Services", group: "exterior-landscaping", monthlyPrice: 25 },
      { id: "paving-driveways", name: "Paving / Driveways", group: "exterior-landscaping", monthlyPrice: 49 },
      { id: "sprinkler-installation-winterization", name: "Sprinkler Installation / Winterization", group: "exterior-landscaping", monthlyPrice: 25 },
      { id: "exterior-caulking", name: "Exterior Caulking", group: "exterior-landscaping", monthlyPrice: 15 },
    ]
  },
  {
    id: "handyman-small-jobs",
    name: "Handyman & Small Jobs",
    description: "General handyman services and small repair jobs",
    categories: [
      { id: "handyman-services", name: "Handyman Services", group: "handyman-small-jobs", monthlyPrice: 15 },
      { id: "furniture-assembly", name: "Furniture Assembly", group: "handyman-small-jobs", monthlyPrice: 15 },
      { id: "mounting-artwork-tvs-furniture", name: "Mounting Artwork, TVs or Furniture", group: "handyman-small-jobs", monthlyPrice: 15 },
      { id: "small-repairs-odd-jobs", name: "Small Repairs / Odd Jobs", group: "handyman-small-jobs", monthlyPrice: 15 },
      { id: "organizing-decluttering-packing", name: "Organizing, Decluttering & Packing", group: "handyman-small-jobs", monthlyPrice: 15 },
    ]
  },
  {
    id: "home-safety-inspection",
    name: "Home Safety & Inspection",
    description: "Safety services, inspections, and security",
    categories: [
      { id: "home-inspector", name: "Home Inspector", group: "home-safety-inspection", monthlyPrice: 25 },
      { id: "accessibility-modifications", name: "Accessibility Modifications", group: "home-safety-inspection", monthlyPrice: 25 },
      { id: "mould-remediation", name: "Mould Remediation", group: "home-safety-inspection", monthlyPrice: 25 },
      { id: "water-sewage-damage-repair", name: "Water & Sewage Damage Repair", group: "home-safety-inspection", monthlyPrice: 25 },
      { id: "pest-control-wasp-treatment", name: "Pest Control & Wasp Treatment", group: "home-safety-inspection", monthlyPrice: 25 },
      { id: "locksmith-services", name: "Locksmith Services", group: "home-safety-inspection", monthlyPrice: 15 },
    ]
  },
  {
    id: "specialty-custom",
    name: "Specialty & Custom",
    description: "Specialized and custom services",
    categories: [
      { id: "architect-interior-designer", name: "Architect / Interior Designer", group: "specialty-custom", monthlyPrice: 79 },
      { id: "acoustic-insulation", name: "Acoustic Insulation", group: "specialty-custom", monthlyPrice: 25 },
      { id: "mirrors-glass", name: "Mirrors & Glass", group: "specialty-custom", monthlyPrice: 25 },
      { id: "upholstery-furniture-repair", name: "Upholstery & Furniture Repair", group: "specialty-custom", monthlyPrice: 25 },
      { id: "pool-spa-hot-tub-services", name: "Pool / Spa / Hot Tub Services", group: "specialty-custom", monthlyPrice: 79 },
    ]
  },
  {
    id: "moving-hauling",
    name: "Moving & Hauling",
    description: "Moving, hauling, demolition, and commercial services",
    categories: [
      { id: "moving-storage", name: "Moving & Storage", group: "moving-hauling", monthlyPrice: 25 },
      { id: "junk-removal", name: "Junk Removal", group: "moving-hauling", monthlyPrice: 25 },
      { id: "demolition-excavation", name: "Demolition & Excavation", group: "moving-hauling", monthlyPrice: 49 },
      { id: "business-services-commercial", name: "Business Services (Commercial Jobs)", group: "moving-hauling", monthlyPrice: 79 },
    ]
  }
];

// Flattened list of all categories for easy access
export const ALL_CATEGORIES: CategoryConfig[] = CATEGORY_GROUPS.flatMap(group => group.categories);

// Helper functions
export const getCategoryById = (id: string): CategoryConfig | undefined => {
  return ALL_CATEGORIES.find(cat => cat.id === id);
};

export const getCategoriesByGroup = (groupId: string): CategoryConfig[] => {
  return ALL_CATEGORIES.filter(cat => cat.group === groupId);
};

export const getCategoriesByPrice = (price: number): CategoryConfig[] => {
  return ALL_CATEGORIES.filter(cat => cat.monthlyPrice === price);
};

export const getGroupById = (id: string): CategoryGroup | undefined => {
  return CATEGORY_GROUPS.find(group => group.id === id);
};

// Price tiers
export const PRICE_TIERS = [15, 25, 49, 79];

export const getPriceTierName = (price: number): string => {
  switch (price) {
    case 15: return "Basic";
    case 25: return "Standard";
    case 49: return "Premium";
    case 79: return "Professional";
    default: return "Custom";
  }
};

// ─── Simplified category system ────────────────────────────────────────────
// Single source of truth for UI dropdowns, job posting, and job board filters.
export const SIMPLE_CATEGORIES = [
  "Handyman",
  "Plumbing",
  "Electrical",
  "Painting",
  "Flooring",
  "Landscaping",
  "Cleaning",
  "Renovation",
  "HVAC",
  "Moving",
  "Other",
] as const;

export type SimpleCategory = (typeof SIMPLE_CATEGORIES)[number];

// Maps detailed category IDs (from CATEGORY_GROUPS) → simple category name.
// Used to normalize old DB values and match jobs ↔ subscriptions.
export const CATEGORY_TO_SIMPLE: Record<string, SimpleCategory> = {
  // Handyman
  "handyman-services": "Handyman",
  "furniture-assembly": "Handyman",
  "mounting-artwork-tvs-furniture": "Handyman",
  "small-repairs-odd-jobs": "Handyman",
  "organizing-decluttering-packing": "Handyman",
  "drywall-plastering": "Handyman",
  "tv-mounting": "Handyman",
  // Plumbing
  "general-plumbing": "Plumbing",
  "toilet-repair-installation": "Plumbing",
  "faucet-fixture-repair": "Plumbing",
  "drain-cleaning": "Plumbing",
  "pipe-repair-replacement": "Plumbing",
  "water-heater-services": "Plumbing",
  "sump-pump-services": "Plumbing",
  "backflow-prevention": "Plumbing",
  "leak-detection-repair": "Plumbing",
  // Electrical
  "electrical-general": "Electrical",
  "lighting-installations": "Electrical",
  "smart-home-installation": "Electrical",
  "security-systems": "Electrical",
  "home-electronics-setup": "Electrical",
  "window-tinting": "Electrical",
  // Painting
  "painting-interior-exterior": "Painting",
  // Flooring
  "flooring-installation-repair": "Flooring",
  "tile-grout-cleaning": "Flooring",
  "countertops-installation": "Flooring",
  // Landscaping
  "landscaping-garden-design": "Landscaping",
  "lawn-maintenance": "Landscaping",
  "tree-services": "Landscaping",
  "artificial-turf": "Landscaping",
  "seasonal-lawn-maintenance": "Landscaping",
  "yard-cleanup": "Landscaping",
  "snow-removal-cleaning": "Landscaping",
  "sprinkler-installation-winterization": "Landscaping",
  "paving-driveways": "Landscaping",
  "exterior-caulking": "Landscaping",
  // Cleaning
  "deep-cleaning": "Cleaning",
  "duct-cleaning": "Cleaning",
  "dryer-vent-cleaning": "Cleaning",
  "window-eaves-gutter-cleaning": "Cleaning",
  "power-washing-stain-seal": "Cleaning",
  "carpet-upholstery-cleaning": "Cleaning",
  // Renovation
  "bathroom-renovation": "Renovation",
  "kitchen-renovation": "Renovation",
  "basement-renovation": "Renovation",
  "cabinets-millwork": "Renovation",
  "roofing": "Renovation",
  "siding-repair-installation": "Renovation",
  "masonry-stone-interlock-concrete": "Renovation",
  "decks-fences": "Renovation",
  "garage-builds-repairs": "Renovation",
  "stair-builder-railings": "Renovation",
  // HVAC
  "heating-cooling-hvac": "HVAC",
  "air-cleaners-humidifiers": "HVAC",
  "ventilation-exhaust-fans": "HVAC",
  "insulation": "HVAC",
  "furnace-tuneup": "HVAC",
  "ac-tuneup": "HVAC",
  "gas-services": "HVAC",
  "gas-fireplace-tuneup": "HVAC",
  // Moving
  "moving-storage": "Moving",
  "junk-removal": "Moving",
  "demolition-excavation": "Moving",
  "business-services-commercial": "Moving",
  // Other
  "appliance-installation": "Other",
  "appliance-repair": "Other",
  "dishwasher-installation": "Other",
  "bbq-cleaning-repair": "Other",
  "refrigeration-specialist": "Other",
  "home-inspector": "Other",
  "accessibility-modifications": "Other",
  "mould-remediation": "Other",
  "water-sewage-damage-repair": "Other",
  "pest-control-wasp-treatment": "Other",
  "locksmith-services": "Other",
  "architect-interior-designer": "Other",
  "acoustic-insulation": "Other",
  "mirrors-glass": "Other",
  "upholstery-furniture-repair": "Other",
  "pool-spa-hot-tub-services": "Other",
};

/**
 * Normalizes any category value (detailed ID, simple name, or freeform text)
 * to a SimpleCategory. Safe for old DB IDs, new simple names, and raw user input.
 * Falls back to "Handyman" when no match is found.
 */
export function normalizeCategory(category: string): string {
  if (!category) return "Handyman";

  const cleaned = category.trim();
  const lower = cleaned.toLowerCase();

  // Exact match against simple category names (case-insensitive)
  const directMatch = SIMPLE_CATEGORIES.find(s => s.toLowerCase() === lower);
  if (directMatch) return directMatch;

  // Exact match against detailed ID map
  if (CATEGORY_TO_SIMPLE[cleaned]) return CATEGORY_TO_SIMPLE[cleaned];

  // Lowercase-normalized ID map lookup (handles mixed-case IDs)
  const lowerKey = Object.keys(CATEGORY_TO_SIMPLE).find(k => k.toLowerCase() === lower);
  if (lowerKey) {
    const normalized = CATEGORY_TO_SIMPLE[lowerKey];
    if (normalized) return normalized;
  }

  // Keyword detection for partial / freeform text
  if (lower.includes("paint")) return "Painting";
  if (lower.includes("stairs") || lower.includes("hardwood") || lower.includes("tile") || lower.includes("floor")) return "Flooring";
  if (lower.includes("sink") || lower.includes("toilet") || lower.includes("plumb") || lower.includes("drain")) return "Plumbing";
  if (lower.includes("yard") || lower.includes("grass") || lower.includes("lawn") || lower.includes("landscape") || lower.includes("garden")) return "Landscaping";
  if (lower.includes("electric") || lower.includes("wiring") || lower.includes("outlet") || lower.includes("circuit")) return "Electrical";
  if (lower.includes("clean")) return "Cleaning";
  if (lower.includes("hvac") || lower.includes("furnace") || lower.includes("heating") || lower.includes("cooling") || lower.includes("insul")) return "HVAC";
  if (lower.includes("moving") || lower.includes("junk") || lower.includes("haul")) return "Moving";
  if (lower.includes("renovat") || lower.includes("kitchen") || lower.includes("bathroom") || lower.includes("basement") || lower.includes("roof")) return "Renovation";
  if (lower.includes("handyman") || lower.includes("repair") || lower.includes("fix") || lower.includes("odd job")) return "Handyman";

  // Fallback — safe default so no job is ever unreachable
  return "Handyman";
}