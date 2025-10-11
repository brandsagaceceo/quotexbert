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