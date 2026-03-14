export interface GTACity {
  slug: string;
  name: string;
  region: string;
  population: string;
  avgHome: string;
  laborPremium: number; // % on top of Toronto baseline
  description: string;
  nearestCity: string;
}

export const GTA_CITIES: GTACity[] = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "City of Toronto",
    population: "2.9M",
    avgHome: "$1.1M",
    laborPremium: 0,
    description:
      "Toronto is Ontario's largest city and the heart of the GTA renovation market. Contractor labour costs are highest here, reflecting high demand and cost of living.",
    nearestCity: "Toronto",
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    region: "City of Toronto (East)",
    population: "630K",
    avgHome: "$920K",
    laborPremium: -5,
    description:
      "Scarborough is a large east-end Toronto district with a diverse housing stock — semis, detached, and split-levels from the 1960s–1980s. Renovation prices are 5–10% below downtown Toronto.",
    nearestCity: "Toronto",
  },
  {
    slug: "north-york",
    name: "North York",
    region: "City of Toronto (North)",
    population: "650K",
    avgHome: "$1.0M",
    laborPremium: -3,
    description:
      "North York has a mix of older detached homes and modern condos. Renovation demand is high and contractor pricing is close to Toronto core rates.",
    nearestCity: "Toronto",
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    region: "City of Toronto (West)",
    population: "360K",
    avgHome: "$980K",
    laborPremium: -4,
    description:
      "Etobicoke is a wesern Toronto district with large mid-century homes. Popular for basement finishing and kitchen renovations in 1960s–1970s bungalows.",
    nearestCity: "Toronto",
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    region: "Peel Region",
    population: "720K",
    avgHome: "$930K",
    laborPremium: -8,
    description:
      "Mississauga is Canada's sixth-largest city and a major GTA renovation hub. Contractor competition is strong here, often resulting in better pricing than Toronto proper.",
    nearestCity: "Toronto",
  },
  {
    slug: "brampton",
    name: "Brampton",
    region: "Peel Region",
    population: "600K",
    avgHome: "$850K",
    laborPremium: -10,
    description:
      "Brampton has a large stock of 1990s–2010s suburban homes with growing demand for renovation. Labour rates are 10–15% lower than Toronto core.",
    nearestCity: "Toronto",
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    region: "York Region",
    population: "340K",
    avgHome: "$1.05M",
    laborPremium: -5,
    description:
      "Vaughan has many luxury and semi-luxury homes built in the 2000s–2010s. Kitchen and bathroom renovations are common as owners upgrade builder finishes.",
    nearestCity: "Toronto",
  },
  {
    slug: "markham",
    name: "Markham",
    region: "York Region",
    population: "370K",
    avgHome: "$1.1M",
    laborPremium: -5,
    description:
      "Markham is York Region's largest city with a high concentration of newer detached homes. Renovation demand is strong for kitchen upgrades, basement finishing, and additions.",
    nearestCity: "Toronto",
  },
  {
    slug: "richmond-hill",
    name: "Richmond Hill",
    region: "York Region",
    population: "220K",
    avgHome: "$1.08M",
    laborPremium: -6,
    description:
      "Richmond Hill has a mix of 1990s–2010s suburban homes and newer developments. Basement finishing and kitchen renovations are common.",
    nearestCity: "Toronto",
  },
  {
    slug: "oshawa",
    name: "Oshawa",
    region: "Durham Region",
    population: "170K",
    avgHome: "$650K",
    laborPremium: -15,
    description:
      "Oshawa is Durham Region's largest city with lower home prices and renovation costs. Labour rates are 15–20% below Toronto, making it one of the GTA's most affordable renovation markets.",
    nearestCity: "Toronto",
  },
  {
    slug: "ajax",
    name: "Ajax",
    region: "Durham Region",
    population: "130K",
    avgHome: "$820K",
    laborPremium: -12,
    description:
      "Ajax has a large stock of 1990s–2000s suburban homes with growing renovation demand. Lower contractor overhead means competitive pricing versus Toronto.",
    nearestCity: "Toronto",
  },
  {
    slug: "pickering",
    name: "Pickering",
    region: "Durham Region",
    population: "100K",
    avgHome: "$810K",
    laborPremium: -12,
    description:
      "Pickering sits on the Toronto–Durham border with a mix of older and newer housing stock. Growing renovation activity driven by aging 1980s–1990s homes.",
    nearestCity: "Toronto",
  },
  {
    slug: "whitby",
    name: "Whitby",
    region: "Durham Region",
    population: "145K",
    avgHome: "$780K",
    laborPremium: -13,
    description:
      "Whitby is a rapidly growing Durham community. Renovation pricing competitive — typically 12–15% below Toronto core rates for equivalent work.",
    nearestCity: "Toronto",
  },
  {
    slug: "bowmanville",
    name: "Bowmanville",
    region: "Durham Region (Clarington)",
    population: "45K",
    avgHome: "$640K",
    laborPremium: -18,
    description:
      "Bowmanville is a growing community in Clarington with lower renovation costs than the western GTA. First-time buyers frequently renovate after purchase.",
    nearestCity: "Oshawa",
  },
  {
    slug: "oakville",
    name: "Oakville",
    region: "Halton Region",
    population: "230K",
    avgHome: "$1.3M",
    laborPremium: 5,
    description:
      "Oakville is one of Canada's most affluent communities with high home values and premium renovation expectations. Contractors here command slightly above-Toronto rates for quality finishes.",
    nearestCity: "Toronto",
  },
  {
    slug: "burlington",
    name: "Burlington",
    region: "Halton Region",
    population: "200K",
    avgHome: "$1.1M",
    laborPremium: 0,
    description:
      "Burlington sits at the western end of the GTA with strong renovation demand. Labour rates are comparable to Toronto, with growing demand for kitchen and basement projects in older 1970s–1990s homes.",
    nearestCity: "Toronto",
  },
  {
    slug: "milton",
    name: "Milton",
    region: "Halton Region",
    population: "140K",
    avgHome: "$950K",
    laborPremium: -7,
    description:
      "Milton is one of Canada's fastest-growing communities. Many homeowners are upgrading builder-grade finishes in newer homes, making kitchen and bathroom renovations especially common.",
    nearestCity: "Toronto",
  },
  {
    slug: "newmarket",
    name: "Newmarket",
    region: "York Region",
    population: "90K",
    avgHome: "$920K",
    laborPremium: -8,
    description:
      "Newmarket is a York Region hub with a mix of older and newer housing stock. Renovation pricing is about 8–10% below Toronto, making it a value market for homeowners.",
    nearestCity: "Toronto",
  },
  {
    slug: "aurora",
    name: "Aurora",
    region: "York Region",
    population: "65K",
    avgHome: "$1.05M",
    laborPremium: -6,
    description:
      "Aurora is an affluent York Region community with high renovation standards. Many homes are 1990s–2010s detached houses due for kitchen and bathroom upgrades.",
    nearestCity: "Toronto",
  },
  {
    slug: "thornhill",
    name: "Thornhill",
    region: "York Region",
    population: "130K",
    avgHome: "$1.15M",
    laborPremium: -4,
    description:
      "Thornhill straddles Vaughan and Markham and has a dense concentration of 1980s–2000s detached homes. Contractor availability is strong and pricing is close to Toronto rates.",
    nearestCity: "Toronto",
  },
  {
    slug: "stouffville",
    name: "Stouffville",
    region: "York Region",
    population: "50K",
    avgHome: "$1.0M",
    laborPremium: -8,
    description:
      "Stouffville (Whitchurch-Stouffville) is a fast-growing York Region community where many new homeowners are finishing basements and upgrading kitchens in newer builds.",
    nearestCity: "Toronto",
  },
  {
    slug: "caledon",
    name: "Caledon",
    region: "Peel Region",
    population: "75K",
    avgHome: "$1.1M",
    laborPremium: -5,
    description:
      "Caledon is a large rural-suburban Peel community with estate homes and growing renovation demand. Contractor travel time can add to costs compared to denser GTA areas.",
    nearestCity: "Toronto",
  },
];

// Map slug → city for fast lookup
export const CITY_MAP: Record<string, GTACity> = Object.fromEntries(
  GTA_CITIES.map((c) => [c.slug, c])
);

// ─── Renovation types ─────────────────────────────────────────────────────────

export interface RenovationType {
  slug: string;
  name: string;
  baseSlug: string; // matches lib/seo/renovation-cost-data.ts slug prefix (Toronto)
  emoji: string;
  range: { low: string; high: string; avg: string };
  avgSqft?: string;
  metaVerb: string;
  heroImage: string;
}

export const RENOVATION_TYPES: RenovationType[] = [
  {
    slug: "kitchen-renovation",
    name: "Kitchen Renovation",
    baseSlug: "kitchen-renovation-cost-toronto",
    emoji: "🍳",
    range: { low: "$15,000", high: "$80,000+", avg: "$35,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop",
  },
  {
    slug: "bathroom-renovation",
    name: "Bathroom Renovation",
    baseSlug: "bathroom-renovation-cost-toronto",
    emoji: "🚿",
    range: { low: "$8,000", high: "$40,000", avg: "$18,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=600&fit=crop",
  },
  {
    slug: "basement-finishing",
    name: "Basement Finishing",
    baseSlug: "basement-finishing-cost-toronto",
    emoji: "🏠",
    range: { low: "$25,000", high: "$75,000+", avg: "$45,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&h=600&fit=crop",
  },
  {
    slug: "roof-replacement",
    name: "Roof Replacement",
    baseSlug: "roof-replacement-cost-toronto",
    emoji: "🏗️",
    range: { low: "$7,000", high: "$20,000+", avg: "$11,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
  },
  {
    slug: "flooring-installation",
    name: "Flooring Installation",
    baseSlug: "flooring-installation-cost-toronto",
    emoji: "🪵",
    range: { low: "$3/sqft", high: "$15+/sqft", avg: "$7/sqft" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop",
  },
  {
    slug: "deck-building",
    name: "Deck Building",
    baseSlug: "deck-building-cost-toronto",
    emoji: "🪑",
    range: { low: "$8,000", high: "$35,000+", avg: "$18,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=600&fit=crop",
  },
  {
    slug: "house-painting",
    name: "House Painting",
    baseSlug: "painting-cost-toronto",
    emoji: "🎨",
    range: { low: "$2,500", high: "$10,000", avg: "$5,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&h=600&fit=crop",
  },
  {
    slug: "home-renovation",
    name: "Home Renovation",
    baseSlug: "home-renovation-cost-toronto",
    emoji: "🔨",
    range: { low: "$5,000", high: "$250,000+", avg: "$50,000" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=600&fit=crop",
  },
  {
    slug: "plumbing-repair",
    name: "Plumbing Repair",
    baseSlug: "plumbing-repair-cost-toronto",
    emoji: "🔧",
    range: { low: "$150", high: "$8,000+", avg: "$900" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1558618047-f4e60b60bc62?w=1200&h=600&fit=crop",
  },
  {
    slug: "electrical-work",
    name: "Electrical Work",
    baseSlug: "electrical-work-cost-toronto",
    emoji: "⚡",
    range: { low: "$200", high: "$15,000+", avg: "$1,800" },
    metaVerb: "Cost",
    heroImage:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop",
  },
];

// Map slug → type for fast lookup
export const RENO_TYPE_MAP: Record<string, RenovationType> = Object.fromEntries(
  RENOVATION_TYPES.map((r) => [r.slug, r])
);

/**
 * Adjust a cost string by a labor premium percentage.
 * e.g. "$15,000" with -10 → "$13,500"
 */
export function adjustCost(costStr: string, premiumPct: number): string {
  if (premiumPct === 0) return costStr;
  // Handle per-sqft strings like "$3/sqft"
  if (costStr.includes("/sqft")) {
    const match = costStr.match(/\$([0-9,]+)/);
    if (!match || !match[1]) return costStr;
    const num = parseInt(match[1].replace(/,/g, ""));
    const adjusted = Math.round(num * (1 + premiumPct / 100));
    return `$${adjusted}/sqft`;
  }
  const hasPlus = costStr.includes("+");
  const match = costStr.match(/\$([0-9,]+)/);
  if (!match || !match[1]) return costStr;
  const num = parseInt(match[1].replace(/,/g, ""));
  const adjusted = Math.round((num * (1 + premiumPct / 100)) / 50) * 50; // round to nearest 50
  return `$${adjusted.toLocaleString()}${hasPlus ? "+" : ""}`;
}
