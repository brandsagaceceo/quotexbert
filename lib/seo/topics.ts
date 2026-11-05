export interface SeoTopic {
  id: string;
  query: string;
  titleBrief: string;
  city: string;
  category: string;
  focus: string;
  internalLinks: string[];
}

export const APPROVED_SEO_TOPICS: readonly SeoTopic[] = [
  {
    id: "whitby-kitchen-cabinet-replacement",
    query: "kitchen cabinet replacement cost in Whitby",
    titleBrief:
      "Planning and budgeting for kitchen cabinet replacement in Whitby",
    city: "Whitby",
    category: "Kitchen",
    focus:
      "Compare replacing cabinet doors, refacing, and full cabinet replacement without making unsupported price claims.",
    internalLinks: ["/kitchen-renovation-calculator", "/blog", "/contractors"],
  },
  {
    id: "bowmanville-deck-repair",
    query: "deck repair costs in Bowmanville",
    titleBrief:
      "How Bowmanville homeowners can scope and compare deck repair quotes",
    city: "Bowmanville",
    category: "Outdoor",
    focus:
      "Inspection, repair-versus-rebuild decisions, material selection, and quote comparison.",
    internalLinks: ["/deck-calculator", "/blog", "/contractors"],
  },
  {
    id: "ontario-basement-flooring",
    query: "best flooring for Ontario basements",
    titleBrief:
      "Choosing basement flooring for Ontario moisture and temperature conditions",
    city: "Ontario",
    category: "Flooring",
    focus:
      "Subfloor moisture checks, resilient flooring choices, installation trade-offs, and when to pause for water remediation.",
    internalLinks: [
      "/flooring-calculator",
      "/basement-renovation-calculator",
      "/blog",
    ],
  },
  {
    id: "ajax-bathroom-renovation-planning",
    query: "bathroom renovation planning in Ajax",
    titleBrief:
      "A practical bathroom renovation planning checklist for Ajax homeowners",
    city: "Ajax",
    category: "Bathroom",
    focus:
      "Scope, sequencing, fixture decisions, access, contingency planning, and contractor quote questions.",
    internalLinks: ["/bathroom-renovation-calculator", "/blog", "/contractors"],
  },
  {
    id: "oshawa-basement-moisture-inspection",
    query: "basement renovation moisture checks in Oshawa",
    titleBrief:
      "What to check for basement moisture before renovating in Oshawa",
    city: "Oshawa",
    category: "Basement",
    focus:
      "Practical pre-renovation inspection, drainage observations, and deciding when to consult a qualified specialist.",
    internalLinks: [
      "/basement-renovation-calculator",
      "/basement-renovation-oshawa",
      "/blog",
    ],
  },
  {
    id: "durham-renovation-quote-comparison",
    query: "how to compare renovation quotes in Durham Region",
    titleBrief:
      "How to compare renovation quotes in Durham Region without comparing only totals",
    city: "Durham Region",
    category: "Contractor Tips",
    focus:
      "Scope alignment, allowances, exclusions, schedule assumptions, insurance questions, and change orders.",
    internalLinks: ["/durham-region-contractors", "/blog", "/create-lead"],
  },
  {
    id: "ontario-basement-subfloor",
    query: "basement subfloor options for Ontario homes",
    titleBrief:
      "Basement subfloor options for Ontario homes: moisture, comfort, and height",
    city: "Ontario",
    category: "Flooring",
    focus:
      "Compare common subfloor approaches, moisture testing, ceiling-height impacts, and installation questions.",
    internalLinks: [
      "/flooring-calculator",
      "/basement-renovation-calculator",
      "/blog",
    ],
  },
  {
    id: "pickering-bathroom-ventilation",
    query: "bathroom ventilation upgrades in Pickering renovations",
    titleBrief:
      "Bathroom ventilation planning for Pickering renovation projects",
    city: "Pickering",
    category: "Bathroom",
    focus:
      "Fan sizing considerations, duct routing questions, humidity control, and when electrical or mechanical permits may apply.",
    internalLinks: [
      "/bathroom-renovation-calculator",
      "/bathroom-renovation-pickering",
      "/blog",
    ],
  },
  {
    id: "clarington-deck-repair-materials",
    query: "deck repair material choices in Clarington",
    titleBrief:
      "Choosing materials for deck repairs in Clarington's changing seasons",
    city: "Clarington",
    category: "Outdoor",
    focus:
      "Wood and composite repair considerations, fasteners, drainage, maintenance, and matching existing surfaces.",
    internalLinks: ["/deck-calculator", "/clarington", "/blog"],
  },
  {
    id: "toronto-kitchen-cabinet-refacing",
    query: "kitchen cabinet refacing versus replacement in Toronto",
    titleBrief:
      "Cabinet refacing versus replacement: a Toronto homeowner decision guide",
    city: "Toronto",
    category: "Kitchen",
    focus:
      "Cabinet-box condition, layout changes, door and hardware options, disruption, and quote scope.",
    internalLinks: [
      "/kitchen-renovation-calculator",
      "/ontario-renovation-cost-guide",
      "/blog",
    ],
  },
  {
    id: "durham-basement-permit-preparation",
    query: "basement renovation permit preparation in Durham Region",
    titleBrief:
      "Preparing for a basement renovation permit conversation in Durham Region",
    city: "Durham Region",
    category: "Permits",
    focus:
      "Questions to ask the local building department and contractor before work begins; avoid asserting jurisdiction-specific rules without a source.",
    internalLinks: [
      "/durham-region-renovation-costs",
      "/basement-renovation-calculator",
      "/blog",
    ],
  },
  {
    id: "oshawa-kitchen-work-sequencing",
    query: "kitchen renovation work sequence in Oshawa",
    titleBrief:
      "A homeowner's guide to kitchen renovation sequencing in Oshawa",
    city: "Oshawa",
    category: "Kitchen",
    focus:
      "Plan selection, demolition, rough-ins, cabinets, counters, finishes, lead times, and decisions that affect scheduling.",
    internalLinks: [
      "/kitchen-renovation-calculator",
      "/kitchen-renovation-oshawa",
      "/blog",
    ],
  },
];
