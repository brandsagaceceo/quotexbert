// SEO data for programmatic pages: cities, services, neighborhoods, contractor leads, and FAQs

export interface CityData {
  slug: string;
  name: string;
  region: string;
  intro: string;
  avgRenovationCost: string;
  costRanges: { type: string; low: string; high: string }[];
  popularServices: string[];
  localInsight: string;
}

export interface ServiceData {
  slug: string;
  name: string;
  city: string;
  intro: string;
  priceRanges: { tier: string; range: string; description: string }[];
  factors: string[];
  faqItems: { question: string; answer: string }[];
  relatedServices: string[];
}

export interface NeighborhoodData {
  slug: string;
  name: string;
  borough: string;
  intro: string;
  renovationDemand: string;
  avgCost: string;
  costRanges: { type: string; low: string; high: string }[];
  commonRenovations: string[];
  localInsight: string;
}

export interface ContractorLeadData {
  slug: string;
  name: string;
  trade: string;
  headline: string;
  intro: string;
  benefits: string[];
  exampleJobs: { title: string; budget: string; description: string }[];
  faqItems: { question: string; answer: string }[];
}

// ─── CITIES ──────────────────────────────────────────────────────────────────

export const CITIES: CityData[] = [
  {
    slug: "toronto",
    name: "Toronto",
    region: "Toronto",
    intro:
      "Toronto homeowners invest heavily in renovation projects to maximize property values in one of Canada's most competitive real estate markets. From Victorian semi-detached homes in the Annex to modern condos downtown, every renovation has unique requirements and costs.",
    avgRenovationCost: "$45,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$12,000", high: "$40,000" },
      { type: "Kitchen Renovation", low: "$20,000", high: "$75,000" },
      { type: "Basement Finishing", low: "$30,000", high: "$80,000" },
      { type: "Home Addition", low: "$80,000", high: "$250,000" },
      { type: "Deck / Outdoor", low: "$8,000", high: "$35,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "basement-finishing",
      "deck-building",
      "painting",
    ],
    localInsight:
      "Toronto contractors are in high demand. Getting multiple quotes through QuoteXbert ensures you receive competitive pricing without sacrificing quality.",
  },
  {
    slug: "north-york",
    name: "North York",
    region: "Toronto",
    intro:
      "North York's diverse housing stock—from post-war bungalows to newer condominium towers along Yonge and Sheppard—drives a wide range of renovation needs. Labour costs here mirror Toronto proper, but material delivery can be slightly faster.",
    avgRenovationCost: "$40,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$11,000", high: "$38,000" },
      { type: "Kitchen Renovation", low: "$18,000", high: "$70,000" },
      { type: "Basement Finishing", low: "$28,000", high: "$75,000" },
      { type: "Home Addition", low: "$75,000", high: "$230,000" },
      { type: "Deck / Outdoor", low: "$7,000", high: "$30,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "basement-finishing",
      "painting",
      "flooring-installation",
    ],
    localInsight:
      "North York bungalows are popular candidates for second-storey additions, which can double living space without requiring a move.",
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    region: "Toronto",
    intro:
      "Scarborough's large detached homes and affordable price point make it one of the GTA's hottest renovation markets. Many homeowners are updating post-war builds with modern kitchens, bathrooms, and finished basements to increase resale value.",
    avgRenovationCost: "$35,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$10,000", high: "$35,000" },
      { type: "Kitchen Renovation", low: "$16,000", high: "$65,000" },
      { type: "Basement Finishing", low: "$25,000", high: "$70,000" },
      { type: "Home Addition", low: "$70,000", high: "$200,000" },
      { type: "Deck / Outdoor", low: "$6,500", high: "$28,000" },
    ],
    popularServices: [
      "basement-finishing",
      "kitchen-renovation",
      "bathroom-renovation",
      "roof-replacement",
      "painting",
    ],
    localInsight:
      "Scarborough has strong contractor availability and slightly lower labour rates than downtown Toronto, helping you stretch your renovation budget.",
  },
  {
    slug: "etobicoke",
    name: "Etobicoke",
    region: "Toronto",
    intro:
      "Etobicoke's mix of lakefront properties, mature suburban streets, and newer developments creates demand for a wide range of renovation services. Proximity to Pearson Airport means swift material delivery, keeping project timelines competitive.",
    avgRenovationCost: "$42,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$11,500", high: "$38,000" },
      { type: "Kitchen Renovation", low: "$19,000", high: "$72,000" },
      { type: "Basement Finishing", low: "$28,000", high: "$75,000" },
      { type: "Home Addition", low: "$78,000", high: "$240,000" },
      { type: "Deck / Outdoor", low: "$7,500", high: "$32,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "deck-building",
      "basement-finishing",
      "flooring-installation",
    ],
    localInsight:
      "Etobicoke waterfront homes often feature premium renovations—expect higher costs for lakefront properties with complex structural requirements.",
  },
  {
    slug: "mississauga",
    name: "Mississauga",
    region: "Peel Region",
    intro:
      "Mississauga is one of Ontario's fastest-growing cities. From starter homes in Meadowvale to luxury builds in Port Credit, renovation spending is booming. The city's modern infrastructure supports efficient project delivery.",
    avgRenovationCost: "$38,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$10,000", high: "$35,000" },
      { type: "Kitchen Renovation", low: "$17,000", high: "$68,000" },
      { type: "Basement Finishing", low: "$27,000", high: "$72,000" },
      { type: "Home Addition", low: "$72,000", high: "$210,000" },
      { type: "Deck / Outdoor", low: "$7,000", high: "$30,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "basement-finishing",
      "bathroom-renovation",
      "deck-building",
      "painting",
    ],
    localInsight:
      "Mississauga homes built in the 1990s and 2000s are prime candidates for kitchen and bathroom updates as they approach the 25–30 year mark.",
  },
  {
    slug: "brampton",
    name: "Brampton",
    region: "Peel Region",
    intro:
      "Brampton's rapidly expanding housing market and large immigrant community drive a high volume of home improvement projects. Detached homes with unfinished basements represent a significant opportunity for cost-effective renovation.",
    avgRenovationCost: "$32,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$9,000", high: "$32,000" },
      { type: "Kitchen Renovation", low: "$15,000", high: "$60,000" },
      { type: "Basement Finishing", low: "$22,000", high: "$65,000" },
      { type: "Home Addition", low: "$65,000", high: "$185,000" },
      { type: "Deck / Outdoor", low: "$6,000", high: "$25,000" },
    ],
    popularServices: [
      "basement-finishing",
      "kitchen-renovation",
      "bathroom-renovation",
      "painting",
      "flooring-installation",
    ],
    localInsight:
      "Brampton basement apartments offer excellent ROI—many homeowners recoup renovation costs within 2–3 years through rental income.",
  },
  {
    slug: "vaughan",
    name: "Vaughan",
    region: "York Region",
    intro:
      "Vaughan's luxury market—particularly Woodbridge and Kleinburg—commands premium renovation finishes. Buyers expect high-end kitchens, spa-inspired bathrooms, and smart home integrations that push renovation budgets upward.",
    avgRenovationCost: "$55,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$14,000", high: "$50,000" },
      { type: "Kitchen Renovation", low: "$25,000", high: "$95,000" },
      { type: "Basement Finishing", low: "$35,000", high: "$95,000" },
      { type: "Home Addition", low: "$90,000", high: "$300,000" },
      { type: "Deck / Outdoor", low: "$10,000", high: "$45,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "basement-finishing",
      "home-addition",
      "deck-building",
    ],
    localInsight:
      "Vaughan homeowners prioritize premium finishes—quartz countertops, custom cabinetry, and heated floors are common project specifications.",
  },
  {
    slug: "markham",
    name: "Markham",
    region: "York Region",
    intro:
      "Markham's tech-savvy homeowners are early adopters of smart home renovations alongside traditional updates. The city's strong real estate values support robust renovation investments across kitchen, bathroom, and outdoor living spaces.",
    avgRenovationCost: "$48,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$12,000", high: "$42,000" },
      { type: "Kitchen Renovation", low: "$22,000", high: "$80,000" },
      { type: "Basement Finishing", low: "$30,000", high: "$80,000" },
      { type: "Home Addition", low: "$80,000", high: "$250,000" },
      { type: "Deck / Outdoor", low: "$9,000", high: "$38,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "basement-finishing",
      "deck-building",
      "flooring-installation",
    ],
    localInsight:
      "Markham's new-build communities often have builder-grade finishes that homeowners upgrade within the first 5–10 years of ownership.",
  },
  {
    slug: "richmond-hill",
    name: "Richmond Hill",
    region: "York Region",
    intro:
      "Richmond Hill sits at the intersection of suburban comfort and luxury living. Renovation demand is driven by growing families upgrading space and downsizers creating turnkey homes before listing on the market.",
    avgRenovationCost: "$46,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$12,000", high: "$40,000" },
      { type: "Kitchen Renovation", low: "$20,000", high: "$78,000" },
      { type: "Basement Finishing", low: "$30,000", high: "$78,000" },
      { type: "Home Addition", low: "$80,000", high: "$245,000" },
      { type: "Deck / Outdoor", low: "$8,500", high: "$36,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "bathroom-renovation",
      "deck-building",
      "basement-finishing",
      "roof-replacement",
    ],
    localInsight:
      "Richmond Hill's strong school districts attract families who prioritize functional upgrades like open-concept kitchens and additional bathrooms.",
  },
  {
    slug: "ajax",
    name: "Ajax",
    region: "Durham Region",
    intro:
      "Ajax is one of Durham Region's fastest-growing communities, with affordable housing attracting first-time buyers eager to personalize their new homes. The town's commuter base supports a thriving local contractor market.",
    avgRenovationCost: "$30,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$8,500", high: "$30,000" },
      { type: "Kitchen Renovation", low: "$14,000", high: "$58,000" },
      { type: "Basement Finishing", low: "$20,000", high: "$60,000" },
      { type: "Home Addition", low: "$60,000", high: "$175,000" },
      { type: "Deck / Outdoor", low: "$5,500", high: "$24,000" },
    ],
    popularServices: [
      "basement-finishing",
      "kitchen-renovation",
      "bathroom-renovation",
      "deck-building",
      "painting",
    ],
    localInsight:
      "Ajax townhome owners frequently upgrade kitchens and bathrooms before resale to compete in Durham Region's active market.",
  },
  {
    slug: "pickering",
    name: "Pickering",
    region: "Durham Region",
    intro:
      "Pickering combines lakefront living with suburban practicality. Its housing stock ranges from 1970s ranch bungalows to new-build semis, each requiring tailored renovation approaches and budgets.",
    avgRenovationCost: "$31,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$8,500", high: "$30,000" },
      { type: "Kitchen Renovation", low: "$14,000", high: "$58,000" },
      { type: "Basement Finishing", low: "$20,000", high: "$60,000" },
      { type: "Home Addition", low: "$60,000", high: "$175,000" },
      { type: "Deck / Outdoor", low: "$5,500", high: "$24,000" },
    ],
    popularServices: [
      "basement-finishing",
      "kitchen-renovation",
      "deck-building",
      "bathroom-renovation",
      "roof-replacement",
    ],
    localInsight:
      "Pickering's waterfront neighbourhood sees high demand for deck and outdoor living renovations given its proximity to Lake Ontario.",
  },
  {
    slug: "whitby",
    name: "Whitby",
    region: "Durham Region",
    intro:
      "Whitby's family-friendly reputation and strong schools attract buyers who invest heavily in home improvements. New subdivisions and mature bungalows exist side by side, creating diverse renovation opportunities.",
    avgRenovationCost: "$32,000",
    costRanges: [
      { type: "Bathroom Renovation", low: "$9,000", high: "$32,000" },
      { type: "Kitchen Renovation", low: "$15,000", high: "$60,000" },
      { type: "Basement Finishing", low: "$22,000", high: "$62,000" },
      { type: "Home Addition", low: "$62,000", high: "$180,000" },
      { type: "Deck / Outdoor", low: "$6,000", high: "$25,000" },
    ],
    popularServices: [
      "kitchen-renovation",
      "basement-finishing",
      "bathroom-renovation",
      "deck-building",
      "flooring-installation",
    ],
    localInsight:
      "Whitby homeowners are quick to add secondary suites and in-law apartments—a strong investment in a market with rising rental demand.",
  },
];

export const CITY_SLUGS = CITIES.map((c) => c.slug);

// ─── RENOVATION SERVICES ─────────────────────────────────────────────────────

export const SERVICES: ServiceData[] = [
  {
    slug: "bathroom-renovation",
    name: "Bathroom Renovation",
    city: "Toronto",
    intro:
      "A bathroom renovation in Toronto is one of the most popular home improvement projects—and one of the best for ROI. Whether you're upgrading a powder room or transforming a master ensuite, understanding real Toronto pricing helps you plan with confidence.",
    priceRanges: [
      {
        tier: "Basic Refresh",
        range: "$8,000 – $15,000",
        description:
          "New fixtures, vanity, toilet, tile, and lighting. Keeping the existing layout.",
      },
      {
        tier: "Mid-Range Renovation",
        range: "$15,000 – $28,000",
        description:
          "Full gut and rebuild. New plumbing layout, custom tile work, frameless glass shower.",
      },
      {
        tier: "Luxury Ensuite",
        range: "$28,000 – $60,000+",
        description:
          "Designer fixtures, heated floors, steam shower, custom vanity, smart controls.",
      },
    ],
    factors: [
      "Size of bathroom (sqft)",
      "Fixture and tile selection",
      "Plumbing relocation",
      "Permit requirements for structural changes",
      "Labour rates vary by neighborhood",
      "Waterproofing and moisture barrier quality",
    ],
    faqItems: [
      {
        question: "How much does a bathroom renovation cost in Toronto?",
        answer:
          "In Toronto, bathroom renovations typically range from $8,000 for a basic refresh to $60,000+ for a luxury ensuite. The average mid-range bathroom renovation costs $15,000–$28,000.",
      },
      {
        question: "How long does a bathroom renovation take in Toronto?",
        answer:
          "A typical bathroom renovation takes 2–4 weeks for a mid-range project. More complex renovations involving plumbing relocation or structural changes may take 5–8 weeks.",
      },
      {
        question: "Do I need a permit for a bathroom renovation in Toronto?",
        answer:
          "Cosmetic updates (tile, fixtures, vanity) generally don't require a permit. Moving plumbing or walls requires a building permit from the City of Toronto.",
      },
      {
        question: "What adds the most value to a bathroom renovation?",
        answer:
          "Heated floors, a frameless glass shower, quality tile work, and proper ventilation all have strong ROI in Toronto's real estate market.",
      },
    ],
    relatedServices: [
      "kitchen-renovation",
      "plumbing-repair",
      "flooring-installation",
    ],
  },
  {
    slug: "kitchen-renovation",
    name: "Kitchen Renovation",
    city: "Toronto",
    intro:
      "The kitchen is the heart of a Toronto home—and one of the top ROI renovation projects. From galley kitchens in older Annex homes to open-concept islands in North York builds, understanding accurate pricing helps you plan and budget smarter.",
    priceRanges: [
      {
        tier: "Cosmetic Update",
        range: "$10,000 – $20,000",
        description:
          "Cabinet refacing, new countertops, appliances, backsplash, and paint. Keeping the existing layout.",
      },
      {
        tier: "Mid-Range Renovation",
        range: "$20,000 – $55,000",
        description:
          "New cabinets, countertops, flooring, appliances, and lighting. Minor layout changes.",
      },
      {
        tier: "High-End Kitchen",
        range: "$55,000 – $120,000+",
        description:
          "Custom cabinetry, quartz or stone counters, professional appliances, structural layout changes.",
      },
    ],
    factors: [
      "Kitchen size and layout complexity",
      "Cabinet quality (stock vs. semi-custom vs. custom)",
      "Countertop material (laminate to quartz/marble)",
      "Appliance grade (builder to professional)",
      "Plumbing and electrical upgrades",
      "Island addition or layout changes",
    ],
    faqItems: [
      {
        question: "How much does a kitchen renovation cost in Toronto?",
        answer:
          "Toronto kitchen renovations range from $10,000 for a cosmetic update to $120,000+ for a fully custom kitchen. The average mid-range project costs $20,000–$55,000.",
      },
      {
        question: "How long does a kitchen renovation take?",
        answer:
          "A mid-range kitchen renovation in Toronto typically takes 6–10 weeks from demolition to final inspection, including the lead time for custom cabinetry.",
      },
      {
        question: "What kitchen renovation returns the most value?",
        answer:
          "In Toronto, kitchen renovations return 50–80% of investment at resale. Focus on quality cabinets, durable countertops, and functional layout for best ROI.",
      },
      {
        question: "Do I need a permit to renovate my kitchen in Toronto?",
        answer:
          "Cosmetic work typically doesn't require a permit. Moving load-bearing walls, relocating plumbing, or upgrading electrical panels require permits from the City of Toronto.",
      },
    ],
    relatedServices: [
      "bathroom-renovation",
      "flooring-installation",
      "painting",
    ],
  },
  {
    slug: "basement-finishing",
    name: "Basement Finishing",
    city: "Toronto",
    intro:
      "Finishing a basement in Toronto is one of the most cost-effective ways to add usable square footage. Whether you're creating a family room, home office, gym, or rental suite, the numbers in Toronto and the GTA can be very compelling.",
    priceRanges: [
      {
        tier: "Basic Finishing",
        range: "$30,000 – $45,000",
        description:
          "Framing, insulation, drywall, flooring, basic lighting, and a bathroom rough-in.",
      },
      {
        tier: "Mid-Range Finished Basement",
        range: "$45,000 – $70,000",
        description:
          "Full bathroom, bedroom, rec room, kitchenette/wet bar, pot lights, egress window.",
      },
      {
        tier: "Legal Basement Suite (Rental)",
        range: "$60,000 – $100,000",
        description:
          "Full kitchen, separate entrance, fire separations, sound insulation, permits, and inspections.",
      },
    ],
    factors: [
      "Basement height (standard vs. underpinning required)",
      "Waterproofing and moisture issues",
      "Bathroom addition (rough-in vs. new plumbing)",
      "Separate entrance excavation",
      "Egress windows and fire code compliance",
      "Electrical panel upgrade",
    ],
    faqItems: [
      {
        question: "How much does it cost to finish a basement in Toronto?",
        answer:
          "Finishing a basement in Toronto typically costs $30,000–$100,000 depending on scope. A basic finished space costs $30,000–$45,000 while a legal rental suite runs $60,000–$100,000.",
      },
      {
        question: "Do I need a permit to finish my basement in Toronto?",
        answer:
          "Yes. Any basement finishing in Toronto requires a building permit. Creating a rental suite requires additional inspections for fire safety, egress, and electrical compliance.",
      },
      {
        question: "How long does it take to finish a basement?",
        answer:
          "A standard basement finishing project in Toronto takes 8–16 weeks. Legal rental suites with separate entrances may take 4–6 months due to permit timelines.",
      },
      {
        question: "Is finishing a basement worth it in Toronto?",
        answer:
          "Yes. A finished basement adds 10–15% to a home's resale value and a legal suite can generate $1,500–$2,500/month in rental income in Toronto.",
      },
    ],
    relatedServices: [
      "plumbing-repair",
      "electrical-work",
      "flooring-installation",
    ],
  },
  {
    slug: "deck-building",
    name: "Deck Building",
    city: "Toronto",
    intro:
      "A new deck dramatically expands outdoor living space and adds significant curb appeal and resale value to Toronto homes. Deck costs vary by size, material choice, and site complexity.",
    priceRanges: [
      {
        tier: "Pressure-Treated Deck",
        range: "$8,000 – $18,000",
        description:
          "Standard pressure-treated lumber, ground-level or one step up, basic railing.",
      },
      {
        tier: "Composite Deck",
        range: "$18,000 – $35,000",
        description:
          "Low-maintenance composite decking, aluminum railing, built-in lighting, multi-level.",
      },
      {
        tier: "Premium Hardwood or Custom Deck",
        range: "$35,000 – $60,000+",
        description:
          "Hardwood (Ipe/cedar), custom pergola, outdoor kitchen rough-in, complex multi-level design.",
      },
    ],
    factors: [
      "Deck size and levels",
      "Decking material (PT lumber, composite, hardwood)",
      "Railing type and height requirements",
      "Site slope and foundation needs",
      "Permit requirements (any deck over 60cm height needs permit in Toronto)",
      "Built-in features (lighting, planters, built-in seating)",
    ],
    faqItems: [
      {
        question: "How much does a deck cost in Toronto?",
        answer:
          "A basic pressure-treated deck in Toronto costs $8,000–$18,000. Composite decks range from $18,000–$35,000. Premium hardwood or custom designs run $35,000–$60,000+.",
      },
      {
        question: "Do I need a permit to build a deck in Toronto?",
        answer:
          "Any deck higher than 60 cm (about 24 inches) above grade requires a building permit in Toronto. Your contractor should handle the permit application.",
      },
      {
        question: "What's the best decking material for Toronto's climate?",
        answer:
          "Composite decking is extremely popular in Toronto due to its freeze-thaw resistance. Pressure-treated lumber is the most affordable option. Cedar is a beautiful mid-range choice.",
      },
    ],
    relatedServices: [
      "painting",
      "electrical-work",
      "kitchen-renovation",
    ],
  },
  {
    slug: "roof-replacement",
    name: "Roof Replacement",
    city: "Toronto",
    intro:
      "Toronto's harsh winters and humid summers take a toll on roofing. Knowing when to repair vs. replace—and what a full roof replacement should cost—can save thousands. Here are real Toronto pricing benchmarks.",
    priceRanges: [
      {
        tier: "Standard Asphalt Shingle Roof",
        range: "$6,000 – $14,000",
        description:
          "3-tab or architectural asphalt shingles on a standard Toronto home (1,500–2,000 sqft).",
      },
      {
        tier: "Premium Shingles or Metal Roofing",
        range: "$14,000 – $30,000",
        description:
          "High-performance architectural shingles, metal standing seam, or luxury shingle product.",
      },
      {
        tier: "Flat Roof (EPDM/TPO)",
        range: "$8,000 – $20,000",
        description:
          "Modern flat roof systems for Toronto rowhouses, additions, and commercial properties.",
      },
    ],
    factors: [
      "Roof pitch and complexity (valleys, dormers, skylights)",
      "Total square footage",
      "Number of layers to remove",
      "Decking condition (replacement if damaged)",
      "Flashing, venting, and ice-and-water shield requirements",
      "Permit requirements",
    ],
    faqItems: [
      {
        question: "How much does a new roof cost in Toronto?",
        answer:
          "A standard asphalt shingle roof replacement in Toronto typically costs $6,000–$14,000. Premium materials or complex roofs can range from $14,000–$30,000+.",
      },
      {
        question: "How often should a roof be replaced in Toronto?",
        answer:
          "Asphalt shingles last 20–30 years in Toronto's climate. If your roof is over 20 years old and showing signs of curling, granule loss, or leaks, it's time to replace.",
      },
      {
        question: "Does a new roof increase home value in Toronto?",
        answer:
          "Yes. A new roof is one of the highest-return renovations, recouping 60–70% of cost at resale and removing a major red flag for buyers.",
      },
    ],
    relatedServices: [
      "painting",
      "electrical-work",
      "deck-building",
    ],
  },
  {
    slug: "flooring-installation",
    name: "Flooring Installation",
    city: "Toronto",
    intro:
      "New flooring instantly transforms any space and is one of the most popular renovation upgrades in Toronto. Costs vary significantly by material, square footage, and subfloor preparation needs.",
    priceRanges: [
      {
        tier: "Laminate Flooring",
        range: "$3 – $8 per sqft installed",
        description:
          "Budget-friendly option. Looks like hardwood, easy to maintain, great for basements.",
      },
      {
        tier: "Engineered Hardwood",
        range: "$8 – $15 per sqft installed",
        description:
          "More stable than solid hardwood. Wide plank options popular in Toronto condos.",
      },
      {
        tier: "Solid Hardwood",
        range: "$10 – $20 per sqft installed",
        description:
          "Classic choice for Toronto homes. Can be refinished multiple times.",
      },
      {
        tier: "Porcelain/Ceramic Tile",
        range: "$10 – $25 per sqft installed",
        description:
          "Ideal for kitchens, bathrooms, and entryways. Large-format tiles trend upward in cost.",
      },
    ],
    factors: [
      "Flooring material and quality",
      "Square footage",
      "Subfloor prep and levelling required",
      "Old flooring removal",
      "Stairs and transitions",
      "Heating system compatibility (heated floors)",
    ],
    faqItems: [
      {
        question: "How much does flooring installation cost in Toronto?",
        answer:
          "Flooring in Toronto costs $3–$25 per sqft installed depending on material. A 1,000 sqft main floor with engineered hardwood typically runs $10,000–$18,000 including installation.",
      },
      {
        question: "What is the most popular flooring in Toronto?",
        answer:
          "Engineered hardwood and wide-plank luxury vinyl plank (LVP) are the most popular choices in Toronto. Both offer warmth, durability, and excellent resale appeal.",
      },
    ],
    relatedServices: [
      "basement-finishing",
      "kitchen-renovation",
      "bathroom-renovation",
    ],
  },
  {
    slug: "painting",
    name: "Interior & Exterior Painting",
    city: "Toronto",
    intro:
      "Professional painting is one of the most cost-effective ways to refresh a Toronto home before a sale or just to enjoy a fresh new look. Labour and material costs vary by scope and surface condition.",
    priceRanges: [
      {
        tier: "Single Room Interior",
        range: "$300 – $800",
        description:
          "Two coats, professional prep, prime and paint a standard bedroom or living room.",
      },
      {
        tier: "Full Home Interior",
        range: "$3,500 – $12,000",
        description:
          "All walls, ceilings, and trim for a 1,500–2,500 sqft Toronto home.",
      },
      {
        tier: "Exterior Painting",
        range: "$4,000 – $18,000",
        description:
          "Depending on home size, siding type (stucco vs. wood vs. vinyl), and surface prep needed.",
      },
    ],
    factors: [
      "Number of rooms / square footage",
      "Ceiling height and architectural detail",
      "Surface condition and repair needed",
      "Paint quality (premium vs. standard)",
      "Colour changes (dark to light requires more coats)",
      "Exterior: siding type and condition",
    ],
    faqItems: [
      {
        question: "How much does it cost to paint a house in Toronto?",
        answer:
          "Interior painting for a full Toronto home costs $3,500–$12,000. Exterior painting runs $4,000–$18,000 depending on size and siding conditions.",
      },
      {
        question: "How long does it take to paint a house in Toronto?",
        answer:
          "Interior painting for a full home typically takes 3–7 days. Exterior painting can take 5–10 days depending on weather and prep requirements.",
      },
    ],
    relatedServices: [
      "flooring-installation",
      "basement-finishing",
      "deck-building",
    ],
  },
  {
    slug: "plumbing-repair",
    name: "Plumbing Repair & Upgrade",
    city: "Toronto",
    intro:
      "Plumbing work in Toronto ranges from emergency repairs to full system upgrades. Knowing typical costs helps you evaluate quotes and avoid overpaying for essential work.",
    priceRanges: [
      {
        tier: "Minor Repairs",
        range: "$150 – $500",
        description:
          "Faucet replacement, toilet repair, drain unclogging, minor leak fixes.",
      },
      {
        tier: "Mid-Range Plumbing",
        range: "$1,500 – $6,000",
        description:
          "New bathroom rough-in, water heater replacement, fixture upgrades.",
      },
      {
        tier: "Major Plumbing Work",
        range: "$6,000 – $25,000+",
        description:
          "Full pipe replacement, basement drainage, sewage backup remediation.",
      },
    ],
    factors: [
      "Access difficulty (inside walls, concrete slab)",
      "Pipe material (copper, PVC, old galvanized steel)",
      "Permit requirements",
      "Emergency vs. planned work",
      "Scope of fixtures and connections",
    ],
    faqItems: [
      {
        question: "How much does a plumber charge per hour in Toronto?",
        answer:
          "Licensed plumbers in Toronto typically charge $95–$180/hour. Emergency rates are higher, often $150–$250/hour plus materials.",
      },
      {
        question: "How much does it cost to replace a water heater in Toronto?",
        answer:
          "A new water heater in Toronto (50-gallon gas tank) costs $800–$2,000 installed. Tankless water heaters cost $2,500–$5,000 installed.",
      },
    ],
    relatedServices: [
      "bathroom-renovation",
      "basement-finishing",
      "kitchen-renovation",
    ],
  },
  {
    slug: "electrical-work",
    name: "Electrical Work & Upgrades",
    city: "Toronto",
    intro:
      "Electrical work is regulated in Toronto and requires a licensed electrician for most projects. Understanding costs upfront protects you and ensures your home meets Ontario Electrical Safety Code standards.",
    priceRanges: [
      {
        tier: "Minor Electrical",
        range: "$200 – $1,000",
        description:
          "Outlet additions, light fixture swaps, GFCI upgrades, ceiling fan installation.",
      },
      {
        tier: "Mid-Range Electrical",
        range: "$1,500 – $6,000",
        description:
          "Electrical panel upgrade (100A to 200A), EV charger installation, pot light installation throughout.",
      },
      {
        tier: "Major Rewiring",
        range: "$8,000 – $25,000+",
        description:
          "Full house rewiring (knob-and-tube removal), complete panel upgrade, dedicated circuits.",
      },
    ],
    factors: [
      "Age of home (knob-and-tube wiring adds cost)",
      "Panel capacity and upgrade needs",
      "Number of circuits added",
      "Access (finished vs. open walls)",
      "ESA permit and inspection fees",
    ],
    faqItems: [
      {
        question: "How much does an electrician cost in Toronto?",
        answer:
          "Licensed electricians in Toronto charge $95–$160/hour. Most projects also include material costs and ESA permit fees.",
      },
      {
        question: "How much does a panel upgrade cost in Toronto?",
        answer:
          "Upgrading an electrical panel from 100A to 200A in Toronto costs $2,000–$4,500 including ESA permit and inspection.",
      },
      {
        question: "Do I need a permit for electrical work in Toronto?",
        answer:
          "Any new wiring, panel changes, or addition of circuits requires an ESA permit in Ontario. Licensed electricians handle this as part of their service.",
      },
    ],
    relatedServices: [
      "basement-finishing",
      "kitchen-renovation",
      "bathroom-renovation",
    ],
  },
];

export const SERVICE_SLUGS = SERVICES.map((s) => s.slug);

// ─── NEIGHBORHOODS ────────────────────────────────────────────────────────────

export const NEIGHBORHOODS: NeighborhoodData[] = [
  {
    slug: "leslieville",
    name: "Leslieville",
    borough: "East Toronto",
    intro:
      "Leslieville is one of Toronto's most desirable east-end neighborhoods. Its Victorian and Edwardian semis are in constant renovation demand as young families and professionals upgrade character homes for modern living.",
    renovationDemand:
      "Extremely High – Leslieville homes regularly sell over asking after strategic renovations",
    avgCost: "$65,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$22,000", high: "$80,000" },
      { type: "Bathroom Renovation", low: "$14,000", high: "$45,000" },
      { type: "Basement Finishing", low: "$35,000", high: "$85,000" },
      { type: "Full Home Renovation", low: "$120,000", high: "$350,000" },
    ],
    commonRenovations: [
      "Open-concept kitchen/dining",
      "Second-storey additions",
      "Backyard deck and laneway",
      "Victorian character restoration",
      "Basement rental suites",
    ],
    localInsight:
      "Leslieville has a strong design community—homeowners here tend to invest in quality finishes that honour the neighborhood's Victorian character while adding contemporary functionality.",
  },
  {
    slug: "the-beaches",
    name: "The Beaches",
    borough: "East Toronto",
    intro:
      "The Beaches offers lakeside living with a village feel. Its older housing stock—primarily detached homes built before 1950—creates significant renovation opportunity for buyers willing to invest in updates.",
    renovationDemand:
      "High – Premium location drives strong ROI on renovation investment",
    avgCost: "$72,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$25,000", high: "$90,000" },
      { type: "Bathroom Renovation", low: "$15,000", high: "$50,000" },
      { type: "Basement Finishing", low: "$38,000", high: "$90,000" },
      { type: "Full Home Renovation", low: "$150,000", high: "$400,000" },
    ],
    commonRenovations: [
      "Heritage façade restorations",
      "Master ensuite additions",
      "Backyard landscaping and decks",
      "Kitchen modernization",
      "Windows and insulation upgrades",
    ],
    localInsight:
      "The Beaches' proximity to the lake makes moisture management critical—invest in quality waterproofing, windows, and insulation for long-term value.",
  },
  {
    slug: "east-york",
    name: "East York",
    borough: "East York",
    intro:
      "East York is a family-oriented borough with a mix of post-war bungalows and larger detached homes. It's one of the best-value areas for renovation investment in the broader Toronto market.",
    renovationDemand:
      "Very High – Affordable entry prices with strong renovation ROI",
    avgCost: "$45,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$18,000", high: "$65,000" },
      { type: "Bathroom Renovation", low: "$11,000", high: "$38,000" },
      { type: "Basement Finishing", low: "$28,000", high: "$70,000" },
      { type: "Full Home Renovation", low: "$90,000", high: "$250,000" },
    ],
    commonRenovations: [
      "Bungalow-to-two-storey conversions",
      "Basement apartments",
      "Kitchen and bath updates",
      "Exterior cladding and windows",
      "Garage conversions",
    ],
    localInsight:
      "East York bungalows are ideal candidates for second-storey additions—adding a full floor can effectively double the home's living space and value.",
  },
  {
    slug: "liberty-village",
    name: "Liberty Village",
    borough: "West Toronto",
    intro:
      "Liberty Village is a dense urban neighbourhood dominated by condo buildings and loft conversions. Renovation focus here is on maximising compact spaces—smart storage, open concepts, and premium finishes.",
    renovationDemand:
      "High – Condo owners invest heavily to compete in a competitive rental and resale market",
    avgCost: "$35,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$18,000", high: "$55,000" },
      { type: "Bathroom Renovation", low: "$12,000", high: "$40,000" },
      { type: "Full Condo Renovation", low: "$60,000", high: "$180,000" },
    ],
    commonRenovations: [
      "Open-concept kitchen/living",
      "Bathroom modernization",
      "Custom storage solutions",
      "Flooring replacement",
      "Lighting upgrades",
    ],
    localInsight:
      "Condo board approval is required for many renovation projects in Liberty Village. Work with contractors familiar with the condo-specific permitting process.",
  },
  {
    slug: "danforth",
    name: "Danforth Village",
    borough: "East York",
    intro:
      "The Danforth corridor offers great value with a vibrant community culture. Semi-detached homes are common here, and many homeowners are upgrading dated kitchens, bathrooms, and basements.",
    renovationDemand: "High – Strong community with growing property values",
    avgCost: "$50,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$20,000", high: "$70,000" },
      { type: "Bathroom Renovation", low: "$12,000", high: "$40,000" },
      { type: "Basement Finishing", low: "$30,000", high: "$75,000" },
      { type: "Full Home Renovation", low: "$100,000", high: "$275,000" },
    ],
    commonRenovations: [
      "Kitchen gut renovation",
      "Bathroom additions",
      "Basement legal suites",
      "Open-concept main floor",
      "Back addition / bump-out",
    ],
    localInsight:
      "The Danforth corridor has seen rapid appreciation—well-executed renovations here routinely achieve 20–30% premium on resale within 2 years.",
  },
  {
    slug: "high-park",
    name: "High Park",
    borough: "West Toronto",
    intro:
      "High Park's lush green surroundings attract families who invest in creating long-term family homes. Detached houses near the park command premium prices and support significant renovation budgets.",
    renovationDemand:
      "Very High – One of Toronto's top premium residential neighborhoods",
    avgCost: "$80,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$30,000", high: "$110,000" },
      { type: "Bathroom Renovation", low: "$18,000", high: "$60,000" },
      { type: "Basement Finishing", low: "$45,000", high: "$100,000" },
      { type: "Full Home Renovation", low: "$200,000", high: "$600,000" },
    ],
    commonRenovations: [
      "Chef's kitchen creation",
      "Luxury ensuite bathrooms",
      "Home theatre basements",
      "Nanny suite additions",
      "Heritage exterior restoration",
    ],
    localInsight:
      "High Park homeowners prioritize craftsmanship and longevity—premium materials and experienced tradespeople are standard here.",
  },
  {
    slug: "parkdale",
    name: "Parkdale",
    borough: "West Toronto",
    intro:
      "Parkdale is experiencing a renaissance as younger buyers and investors transform older housing stock. The neighbourhood's Victorian architecture creates exciting renovation potential at comparatively accessible price points.",
    renovationDemand:
      "High – Gentrifying neighbourhood with rapid value growth",
    avgCost: "$55,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$20,000", high: "$75,000" },
      { type: "Bathroom Renovation", low: "$13,000", high: "$42,000" },
      { type: "Basement Finishing", low: "$32,000", high: "$80,000" },
      { type: "Full Home Renovation", low: "$120,000", high: "$320,000" },
    ],
    commonRenovations: [
      "Victorian restoration",
      "Rooming house conversions",
      "Kitchen modernization",
      "Electrical and plumbing upgrades",
      "Laneway house development",
    ],
    localInsight:
      "Parkdale is a popular choice for laneway house projects—Toronto's new Laneway Suite bylaw allows additional income suites for eligible properties.",
  },
  {
    slug: "yorkville",
    name: "Yorkville",
    borough: "Midtown Toronto",
    intro:
      "Yorkville is Toronto's most prestigious neighbourhood. Renovations here are defined by luxury finishes, designer brands, and world-class craftsmanship. Budget accordingly—quality is non-negotiable in this market.",
    renovationDemand:
      "Extremely High – Premium market with unlimited renovation ceilings",
    avgCost: "$150,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$60,000", high: "$200,000+" },
      { type: "Bathroom Renovation", low: "$30,000", high: "$100,000+" },
      { type: "Full Condo Renovation", low: "$150,000", high: "$500,000+" },
    ],
    commonRenovations: [
      "Luxury condo transformations",
      "Designer kitchen installations",
      "Spa ensuite bathrooms",
      "Smart home automation",
      "Heritage townhouse restoration",
    ],
    localInsight:
      "Yorkville contractors often work to strict building schedules due to condo board requirements—plan for longer project timelines and book well in advance.",
  },
  {
    slug: "north-york",
    name: "North York",
    borough: "North York",
    intro:
      "North York encompasses everything from high-rise Yonge corridor condos to large suburban homes in Willowdale. It's a hub of renovation activity with strong contractor availability and competitive pricing.",
    renovationDemand: "Very High – Diverse housing stock drives high volume",
    avgCost: "$48,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$20,000", high: "$75,000" },
      { type: "Bathroom Renovation", low: "$12,000", high: "$40,000" },
      { type: "Basement Finishing", low: "$30,000", high: "$78,000" },
      { type: "Full Home Renovation", low: "$100,000", high: "$280,000" },
    ],
    commonRenovations: [
      "Bungalow additions",
      "Condo kitchen and bath updates",
      "Second-unit basement apartments",
      "Open-concept conversions",
      "Landscaping and curb appeal",
    ],
    localInsight:
      "North York's strong transit connections and school districts make renovated homes highly desirable to upsizing families.",
  },
  {
    slug: "scarborough",
    name: "Scarborough",
    borough: "Scarborough",
    intro:
      "Scarborough offers larger homes at more affordable prices than central Toronto. The area attracts families who invest in making their homes long-term spaces, driving steady renovation demand.",
    renovationDemand:
      "High – Affordable entry prices drive renovation investment",
    avgCost: "$38,000",
    costRanges: [
      { type: "Kitchen Renovation", low: "$16,000", high: "$65,000" },
      { type: "Bathroom Renovation", low: "$10,000", high: "$35,000" },
      { type: "Basement Finishing", low: "$25,000", high: "$70,000" },
      { type: "Full Home Renovation", low: "$80,000", high: "$230,000" },
    ],
    commonRenovations: [
      "Basement apartment creation",
      "Kitchen modernization",
      "Bathroom updates",
      "Exterior landscaping",
      "Energy efficiency upgrades",
    ],
    localInsight:
      "Scarborough's large lots and detached homes make them ideal for basement suites and garden suites—one of the highest-ROI renovations in the GTA.",
  },
];

export const NEIGHBORHOOD_SLUGS = NEIGHBORHOODS.map((n) => n.slug);

// ─── CONTRACTOR LEAD TYPES ───────────────────────────────────────────────────

export const CONTRACTOR_LEAD_TYPES: ContractorLeadData[] = [
  {
    slug: "contractor-leads-toronto",
    name: "General Contractor Leads",
    trade: "General Contractor",
    headline: "Get Renovation Leads in Toronto – No More Cold Calls",
    intro:
      "QuoteXbert connects homeowners who are ready to renovate with verified general contractors in Toronto and the GTA. Our AI-powered platform pre-qualifies leads before you ever speak with a homeowner.",
    benefits: [
      "Receive photo-backed, pre-qualified renovation inquiries",
      "Only pay for leads from your service area",
      "Build your reputation with verified reviews",
      "No competing against unlimited contractors—curated matching",
      "Dashboard to track all your leads and projects",
    ],
    exampleJobs: [
      {
        title: "Full Basement Renovation – North York",
        budget: "$55,000–$70,000",
        description:
          "Homeowner needs framing, insulation, drywall, bathroom, kitchenette, and egress window. Photos uploaded.",
      },
      {
        title: "Kitchen Gut Renovation – Scarborough",
        budget: "$25,000–$40,000",
        description:
          "Full kitchen renovation: new cabinets, counters, appliances, and tile. Plans available.",
      },
      {
        title: "Home Addition – Markham",
        budget: "$120,000–$160,000",
        description:
          "2-storey rear addition to a detached home. Permits applied for. Need experienced GC.",
      },
    ],
    faqItems: [
      {
        question: "How does QuoteXbert generate renovation leads?",
        answer:
          "Homeowners upload project photos and describe their renovation. Our AI provides an instant estimate, and the homeowner is connected with matched contractors in their area.",
      },
      {
        question: "Are QuoteXbert leads exclusive?",
        answer:
          "Leads are shared with a small, curated group of qualified contractors to keep competition fair and improve your close rate.",
      },
      {
        question: "What areas does QuoteXbert cover?",
        answer:
          "QuoteXbert covers Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Ajax, Pickering, Whitby, and the broader GTA.",
      },
    ],
  },
  {
    slug: "plumber-leads-toronto",
    name: "Plumber Leads",
    trade: "Plumber",
    headline: "Plumbing Leads in Toronto – Find More Jobs Near You",
    intro:
      "Licensed plumbers in Toronto can access a steady stream of verified plumbing job inquiries through QuoteXbert. From bathroom rough-ins to emergency repairs, we connect you with homeowners ready to hire.",
    benefits: [
      "Receive plumbing-specific job leads instantly",
      "Photo documentation provided by every homeowner",
      "AI-qualified leads—homeowners understand pricing before contacting you",
      "Coverage across Toronto and the GTA",
      "No subscription required to start—pay per lead",
    ],
    exampleJobs: [
      {
        title: "Bathroom Rough-In – Basement Suite – East York",
        budget: "$3,500–$5,500",
        description:
          "New bathroom rough-in for basement suite. City permit already approved.",
      },
      {
        title: "Water Heater Replacement – Mississauga",
        budget: "$1,200–$2,000",
        description: "50-gallon gas water heater replacement. Urgent timeline.",
      },
      {
        title: "Full Plumbing Upgrade – Kitchen Renovation – Etobicoke",
        budget: "$2,500–$4,000",
        description:
          "Kitchen plumbing relocation. Island sink rough-in. Working with GC.",
      },
    ],
    faqItems: [
      {
        question: "What types of plumbing jobs does QuoteXbert list?",
        answer:
          "Bathroom rough-ins, water heater replacements, kitchen plumbing, drain repairs, pipe replacements, basement bathroom additions, and more.",
      },
      {
        question: "Do I need to be licensed to receive leads on QuoteXbert?",
        answer:
          "Yes. All plumbers must be licensed in Ontario (P1 or P2) and carry appropriate insurance to receive leads on QuoteXbert.",
      },
    ],
  },
  {
    slug: "electrician-leads-toronto",
    name: "Electrician Leads",
    trade: "Electrician",
    headline: "Electrical Leads in Toronto – Grow Your Electrical Business",
    intro:
      "Electrical contractors in Toronto and the GTA can find a consistent flow of pre-qualified electrical jobs through QuoteXbert. From panel upgrades to EV chargers and pot light installations, we have jobs waiting.",
    benefits: [
      "Electrical-specific lead matching",
      "Homeowners pre-informed of ESA permit requirements",
      "High-value jobs: panel upgrades, EV charger installs, full rewires",
      "Rating and review system builds your reputation",
      "Coverage across Greater Toronto Area",
    ],
    exampleJobs: [
      {
        title: "200A Panel Upgrade – Scarborough",
        budget: "$2,500–$4,000",
        description:
          "100A to 200A upgrade. Old federal Pacific panel. ESA permit required.",
      },
      {
        title: "EV Charger Installation – Mississauga",
        budget: "$800–$1,500",
        description:
          "Level 2 EV charger in garage. 240V dedicated circuit. EVSE provided by homeowner.",
      },
      {
        title: "Knob-and-Tube Removal – East York",
        budget: "$15,000–$22,000",
        description:
          "Full K&T removal and rewire of 1,800 sqft detached home. Permits required.",
      },
    ],
    faqItems: [
      {
        question: "What types of electrical jobs are available on QuoteXbert?",
        answer:
          "Panel upgrades, EV charger installations, knob-and-tube removal, pot light installations, new circuit additions, kitchen and bathroom electrical work, and whole-home rewiring.",
      },
      {
        question: "Do I need ESA certification to receive leads?",
        answer:
          "Yes. All electricians must hold a valid Certificate of Qualification (309A or 309C) and be ESA authorized to receive electrical leads.",
      },
    ],
  },
  {
    slug: "roofing-leads-toronto",
    name: "Roofing Leads",
    trade: "Roofer",
    headline: "Roofing Leads in Toronto – Never Run Out of Roofing Jobs",
    intro:
      "Toronto's harsh winters create constant demand for roofing repairs and replacements. QuoteXbert connects roofing contractors with homeowners who have uploaded photos and are ready for quotes.",
    benefits: [
      "Photo-documented roofing leads (satellite and uploaded images)",
      "Jobs across GTA: Toronto, Durham, Peel, York regions",
      "Emergency repair leads flagged as urgent",
      "All leads include property size and roof complexity info",
      "Build a verified contractor profile with ratings",
    ],
    exampleJobs: [
      {
        title: "Full Roof Replacement – North York",
        budget: "$9,000–$14,000",
        description:
          "1,800 sqft hip roof. 3 layers of asphalt to remove. Fascia repair needed.",
      },
      {
        title: "Flat Roof Replacement – Leslieville",
        budget: "$7,000–$12,000",
        description:
          "EPDM/TPO replacement on Victorian semi detached. Skylight flashing included.",
      },
      {
        title: "Emergency Repair – Pickering",
        budget: "$600–$1,800",
        description:
          "Storm damage. Missing shingles, flashing failure. Urgent repair needed.",
      },
    ],
    faqItems: [
      {
        question: "How do roofing leads work on QuoteXbert?",
        answer:
          "Homeowners upload photos of their roof and describe the issue. QuoteXbert AI generates an estimate range and connects them with qualified roofing contractors in their area.",
      },
    ],
  },
  {
    slug: "handyman-leads-toronto",
    name: "Handyman Leads",
    trade: "Handyman",
    headline: "Handyman Jobs in Toronto – Fill Your Schedule with Local Work",
    intro:
      "QuoteXbert connects skilled handymen with homeowners who need reliable help with repairs, installations, and small renovation projects across Toronto and the GTA.",
    benefits: [
      "Small to medium jobs—perfect for solo operators",
      "Photo documentation means no surprise scopes",
      "Flexible scheduling—accept or decline any job",
      "Weekly payment on completed jobs",
      "Verified reviews build your local reputation",
    ],
    exampleJobs: [
      {
        title: "TV Mounting & Furniture Assembly – Etobicoke",
        budget: "$150–$250",
        description: "TV mount + IKEA furniture assembly (3 items). Half-day job.",
      },
      {
        title: "Bathroom Tile Repair – Danforth",
        budget: "$400–$700",
        description: "Re-grout full bathroom + replace 4 cracked tiles. Tiles purchased.",
      },
      {
        title: "Fence Repair + Gate Install – Ajax",
        budget: "$600–$1,200",
        description:
          "Backyard cedar fence repair (20 ft) and new gate installation.",
      },
    ],
    faqItems: [
      {
        question: "What types of handyman jobs are listed on QuoteXbert?",
        answer:
          "Repairs, installations, furniture assembly, painting, tile work, minor plumbing, drywall patching, and small renovation tasks.",
      },
    ],
  },
  {
    slug: "general-contractor-leads-toronto",
    name: "General Contractor Leads",
    trade: "General Contractor",
    headline: "GC Leads Toronto – High-Value Renovation Projects Waiting",
    intro:
      "General contractors are in high demand across Toronto and the GTA. QuoteXbert's platform delivers pre-qualified, photo-documented renovation projects to experienced GCs ready to take on full-scope work.",
    benefits: [
      "High-value jobs ($30K–$500K renovation budgets)",
      "Homeowners have pre-approved AI estimates to anchor negotiations",
      "Jobs include full project photos and scope descriptions",
      "Trusted contractor badge after 5+ verified reviews",
      "Priority matching for licensed, insured GCs",
    ],
    exampleJobs: [
      {
        title: "Full Main Floor Renovation – Richmond Hill",
        budget: "$75,000–$110,000",
        description:
          "Kitchen, family room, and powder room gut renovation. Open-concept design. Plans available.",
      },
      {
        title: "Basement Suite + Separate Entrance – Brampton",
        budget: "$70,000–$95,000",
        description:
          "Legal basement suite with separate entrance, kitchen, 1BR/1BA. City permits in progress.",
      },
      {
        title: "Two-Storey Rear Addition – East York",
        budget: "$180,000–$230,000",
        description:
          "Two-storey addition 400 sqft per floor. Permit applied. Structural drawings available.",
      },
    ],
    faqItems: [
      {
        question: "How does QuoteXbert screen homeowners before sending leads?",
        answer:
          "Homeowners provide photo documentation, describe their project scope, and receive an AI estimate before being matched. This filters out low-intent inquiries.",
      },
    ],
  },
  {
    slug: "construction-jobs-toronto",
    name: "Construction Jobs",
    trade: "Construction",
    headline: "Find Construction Work in Toronto – Projects Across the GTA",
    intro:
      "Toronto's construction market is booming. Whether you're a framing crew, finish carpenter, or full-service construction company, QuoteXbert connects you with homeowners who need experienced builders.",
    benefits: [
      "Residential construction jobs from $10K to $500K+",
      "Photo and plan documentation provided",
      "Connected directly with homeowners—no intermediaries",
      "Jobs in Toronto, York, Peel, Durham, and Halton regions",
      "Rating system helps you build a verified track record",
    ],
    exampleJobs: [
      {
        title: "Framing – Second Storey Addition – Vaughan",
        budget: "$35,000–$50,000",
        description: "Framing for 800 sqft second storey addition. Plans stamped by engineer.",
      },
      {
        title: "New Garage Build – Whitby",
        budget: "$40,000–$65,000",
        description:
          "Detached double garage. Permit approved. Requires excavation, foundation, and structure.",
      },
    ],
    faqItems: [
      {
        question: "What size construction jobs are available on QuoteXbert?",
        answer:
          "Jobs range from $10,000 framing sub-contracts to $500,000+ full construction projects. We serve residential, light commercial, and custom home builders.",
      },
    ],
  },
  {
    slug: "renovation-jobs-toronto",
    name: "Renovation Jobs",
    trade: "Renovation",
    headline: "Renovation Jobs in Toronto – Get Consistent Project Flow",
    intro:
      "Toronto's renovation market is one of the most active in Canada. QuoteXbert is where homeowners with real budgets find skilled renovation professionals ready to work.",
    benefits: [
      "Steady volume of renovation inquiries year-round",
      "AI-pre-qualified homeowners understand their budget",
      "Full project photos accompany every lead",
      "Build your business with verified contractor reviews",
      "Local matching—only receive jobs in your service area",
    ],
    exampleJobs: [
      {
        title: "Full Kitchen and Bathroom Renovation – Mississauga",
        budget: "$55,000–$75,000",
        description:
          "Complete kitchen gut and main bath renovation. Permits required. Photos available.",
      },
      {
        title: "Condo Renovation – Liberty Village",
        budget: "$45,000–$65,000",
        description:
          "900 sqft condo full renovation. Kitchen, bathroom, flooring, painting.",
      },
    ],
    faqItems: [
      {
        question: "Is QuoteXbert only for large renovation companies?",
        answer:
          "No. QuoteXbert works for solo operators, small renovation companies, and large contractors alike. Filter for job sizes that fit your capacity.",
      },
    ],
  },
  {
    slug: "home-renovation-leads-gta",
    name: "GTA Home Renovation Leads",
    trade: "Renovation",
    headline: "GTA Home Renovation Leads – Homeowners Ready to Hire Today",
    intro:
      "The Greater Toronto Area has one of Canada's strongest home renovation markets. QuoteXbert delivers pre-qualified leads from homeowners across the GTA who are ready to start their projects.",
    benefits: [
      "Leads from across the GTA—17 cities and regions",
      "Homeowners upload photos before contacting contractors",
      "AI estimate sets realistic budget expectations",
      "No minimum contract—access leads on your schedule",
      "Top-rated contractors receive priority matching",
    ],
    exampleJobs: [
      {
        title: "Basement Finishing – Ajax",
        budget: "$35,000–$50,000",
        description:
          "500 sqft basement finishing with bathroom and rec room. Photos provided.",
      },
      {
        title: "Kitchen Renovation – Markham",
        budget: "$28,000–$45,000",
        description: "New cabinets, counters, and appliances. Open-concept to family room.",
      },
    ],
    faqItems: [
      {
        question: "Which GTA cities does QuoteXbert cover?",
        answer:
          "Toronto, North York, Scarborough, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Ajax, Pickering, Whitby, Oakville, Burlington, Hamilton, and growing.",
      },
    ],
  },
  {
    slug: "find-contractor-work-toronto",
    name: "Find Contractor Work",
    trade: "All Trades",
    headline: "Find Contractor Work in Toronto – Join 500+ Verified Contractors",
    intro:
      "Stop relying on word of mouth to fill your calendar. QuoteXbert's platform gives contractors across all trades a scalable way to find consistent renovation work in Toronto and the GTA.",
    benefits: [
      "Access to hundreds of open renovation jobs",
      "Homeowners are photo-qualified and budget-aware",
      "Build your verified contractor profile with reviews",
      "Respond to leads from any device, anywhere",
      "Dedicated contractor dashboard and analytics",
    ],
    exampleJobs: [
      {
        title: "Exterior Painting – High Park",
        budget: "$6,000–$10,000",
        description:
          "Full exterior paint: 2,200 sqft Victorian detached. Surface prep required.",
      },
      {
        title: "Hardwood Floor Installation – North York",
        budget: "$8,000–$14,000",
        description:
          "1,200 sqft engineered hardwood installation. Subfloor levelling required.",
      },
    ],
    faqItems: [
      {
        question: "Is there a fee to join QuoteXbert as a contractor?",
        answer:
          "QuoteXbert offers a free tier with limited lead access and premium subscription plans for contractors who want unlimited leads and priority matching.",
      },
      {
        question: "How do I get started as a contractor on QuoteXbert?",
        answer:
          "Sign up, complete your contractor profile with your trade, service areas, and certifications, and start receiving matched leads within 24 hours.",
      },
    ],
  },
];

export const CONTRACTOR_LEAD_SLUGS = CONTRACTOR_LEAD_TYPES.map((c) => c.slug);

// ─── GLOBAL FAQ DATABASE ──────────────────────────────────────────────────────

export const GLOBAL_FAQS = [
  {
    question: "How much does a bathroom renovation cost in Toronto?",
    answer:
      "In Toronto, bathroom renovations typically range from $8,000 for a basic refresh to $60,000+ for a luxury ensuite. The average mid-range bathroom renovation costs $15,000–$28,000.",
  },
  {
    question: "What is the average kitchen remodel price in the GTA?",
    answer:
      "GTA kitchen renovations average $20,000–$55,000 for a mid-range project. Budget cosmetic updates start around $10,000. Custom luxury kitchens run $55,000–$120,000+.",
  },
  {
    question: "How much does it cost to finish a basement in Ontario?",
    answer:
      "Finishing a basement in Ontario (Toronto and GTA) typically costs $30,000–$80,000 for a standard space. Legal rental suites cost $60,000–$100,000 including permits and inspections.",
  },
  {
    question: "Do contractors charge per square foot?",
    answer:
      "Some contractors quote per square foot, especially for flooring and painting. Most major renovation work (kitchens, bathrooms) is quoted as a fixed project price based on scope.",
  },
  {
    question: "How accurate are AI renovation estimates?",
    answer:
      "QuoteXbert's AI estimates are within 15–25% of final contractor quotes for most projects. They're designed to give homeowners a reliable budget range before starting contractor conversations.",
  },
  {
    question: "How do contractors get renovation leads in Toronto?",
    answer:
      "Contractors can join QuoteXbert to receive pre-qualified renovation leads from homeowners across Toronto and the GTA. Leads come with photo documentation and AI-estimated budgets.",
  },
  {
    question: "How long does a kitchen renovation take in Toronto?",
    answer:
      "A mid-range kitchen renovation in Toronto typically takes 6–10 weeks from demolition to final walkthrough, including lead time for custom cabinetry.",
  },
  {
    question: "What renovations add the most value to a Toronto home?",
    answer:
      "In Toronto's market, kitchen renovations, bathroom upgrades, basement finishing, and adding a legal suite consistently deliver the strongest ROI at resale.",
  },
];

// ─── INTERNAL LINKS ───────────────────────────────────────────────────────────

export const INTERNAL_LINKS = {
  estimator: { href: "/", label: "Get a Free AI Estimate" },
  contractorSignup: { href: "/sign-up", label: "Join as a Contractor" },
  jobs: { href: "/jobs", label: "Browse Open Jobs" },
  blog: { href: "/blog", label: "Renovation Cost Guides" },
  cityPages: CITIES.slice(0, 6).map((c) => ({
    href: `/renovation-estimates/${c.slug}`,
    label: `Renovation Costs in ${c.name}`,
  })),
  servicePages: SERVICES.slice(0, 6).map((s) => ({
    href: `/renovation-services/${s.slug}`,
    label: `${s.name} Cost Guide`,
  })),
};
