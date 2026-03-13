import { FAQItem } from "@/components/seo/FAQSection";

// Reuse the same structure as ContractorLeadData
export interface TradeJobData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  h1: string;
  tradeName: string;
  intro: string;
  howItWorks: { step: string; description: string }[];
  benefits: string[];
  exampleJobs: { title: string; budget: string; location: string }[];
  stats: { label: string; value: string }[];
  faqs: FAQItem[];
}

export const tradeJobPages: TradeJobData[] = [
  {
    slug: "plumbing-jobs-toronto",
    tradeName: "Plumbers",
    metaTitle: "Plumbing Jobs Toronto | Licensed Plumber Work in the GTA",
    metaDescription: "Find plumbing job opportunities in Toronto and the GTA. QuoteXbert connects licensed plumbers with homeowners needing plumbing work. Join free and start winning jobs.",
    keywords: ["plumbing jobs toronto", "plumber work toronto", "plumbing contractor toronto", "toronto plumbing jobs"],
    h1: "Plumbing Jobs in Toronto & the GTA",
    intro: "Toronto homeowners need licensed plumbers every day — bathroom renovations, hot water heater replacements, basement rough-ins, and emergency repairs. QuoteXbert matches your plumbing expertise with the right jobs.",
    howItWorks: [
      { step: "Join as a plumber", description: "List your P1 or P2 licence, WSIB registration, and service areas across the GTA." },
      { step: "Receive plumbing job leads", description: "Get notified of plumbing jobs in your area with photos and full project details." },
      { step: "Win local plumbing work", description: "Submit competitive quotes and grow your plumbing business with verified homeowner reviews." },
    ],
    benefits: [
      "Licensed plumbers only — quality homeowner leads",
      "Emergency plumbing jobs available",
      "Bathroom renovation plumbing — high-value lead type",
      "Basement rough-in and new construction leads",
      "Steady pipeline of replacement jobs (water heaters, toilets, faucets)",
    ],
    exampleJobs: [
      { title: "Bathroom Plumbing Renovation", budget: "$3,500–$6,000", location: "North York, Toronto" },
      { title: "Tankless Water Heater Install", budget: "$2,500–$4,000", location: "Mississauga" },
      { title: "Main Drain Camera + Repair", budget: "$2,000–$4,500", location: "Scarborough, Toronto" },
      { title: "Kitchen Sink Island Plumbing", budget: "$1,500–$2,800", location: "Vaughan" },
    ],
    stats: [
      { label: "Monthly Plumbing Leads", value: "80+" },
      { label: "Avg Plumbing Job", value: "$2,800" },
      { label: "Emergency Leads", value: "Weekly" },
      { label: "Cities Covered", value: "GTA-wide" },
    ],
    faqs: [
      { question: "How do I find plumbing jobs in Toronto?", answer: "Join QuoteXbert as a licensed plumber to receive verified leads from Toronto homeowners. You'll get instant notifications when plumbing jobs post in your service area, with photos and project details." },
      { question: "What plumbing work is most in demand in Toronto?", answer: "Bathroom renovations, hot water heater replacements (both tank and tankless), basement rough-ins, and drain repair are the most in-demand plumbing services." },
    ],
  },
  {
    slug: "electrical-jobs-toronto",
    tradeName: "Electricians",
    metaTitle: "Electrical Jobs Toronto | Licensed Electrician Work in the GTA",
    metaDescription: "Find electrical job opportunities in Toronto and the GTA. QuoteXbert connects licensed electricians with homeowners needing panel upgrades, wiring, and EV charger installation.",
    keywords: ["electrical jobs toronto", "electrician work toronto", "electrician jobs gta", "toronto electrical contractor jobs"],
    h1: "Electrical Jobs in Toronto & the GTA",
    intro: "Toronto needs licensed electricians for panel upgrades, EV charger installations, pot light retrofits, and knob-and-tube rewiring. QuoteXbert delivers verified leads to qualified electricians across the GTA.",
    howItWorks: [
      { step: "Join as a licensed electrician", description: "Register with your ESA master electrician ID, certifications, and service territory." },
      { step: "Get electrical job leads", description: "View homeowner electrical jobs with photos before deciding to quote." },
      { step: "Grow your electrical business", description: "Win jobs, collect reviews, and become the go-to electrician in your area." },
    ],
    benefits: [
      "Panel upgrade leads — consistent high-value work",
      "EV charger installation demand growing 40% YoY",
      "Knob-and-tube rewiring — large project leads",
      "ESA permit work streamlined with QuoteXbert",
      "Both residential and small commercial opportunities",
    ],
    exampleJobs: [
      { title: "100A to 200A Panel Upgrade", budget: "$3,000–$5,000", location: "East York, Toronto" },
      { title: "Level 2 EV Charger (Tesla compatible)", budget: "$900–$1,600", location: "Oakville" },
      { title: "Basement Electrical (15 circuits)", budget: "$4,000–$6,500", location: "Markham" },
      { title: "Full Pot Light Retrofit (24 lights)", budget: "$2,800–$4,200", location: "Etobicoke, Toronto" },
    ],
    stats: [
      { label: "Monthly Electrical Leads", value: "60+" },
      { label: "Avg Electrical Job", value: "$3,200" },
      { label: "EV Charger Leads/Month", value: "20+" },
      { label: "Panel Upgrade Leads/Month", value: "15+" },
    ],
    faqs: [
      { question: "How do I get electrical jobs in Toronto?", answer: "Join QuoteXbert as a licensed electrician to receive verified leads from Toronto homeowners. Panel upgrades, EV charger installations, and knob-and-tube rewiring are the most in-demand electrical services." },
    ],
  },
  {
    slug: "roofing-jobs-toronto",
    tradeName: "Roofers",
    metaTitle: "Roofing Jobs Toronto | Roofing Contractor Work in the GTA",
    metaDescription: "Find roofing job opportunities in Toronto and the GTA. QuoteXbert connects roofing contractors with homeowners needing shingle replacement, flat roofing, and repairs.",
    keywords: ["roofing jobs toronto", "roofer work toronto", "roofing contractor jobs gta", "toronto roofing work"],
    h1: "Roofing Jobs in Toronto & the GTA",
    intro: "Toronto&apos;s climate — with hot summers, heavy snow, and ice storms — creates constant demand for skilled roofers. QuoteXbert connects qualified roofing contractors with homeowners who need their roofs replaced, repaired, or upgraded across the GTA.",
    howItWorks: [
      { step: "Join as a roofing contractor", description: "Create your profile with your roofing specializations, certifications, and service area." },
      { step: "Receive roofing job leads", description: "Get project photos and details before committing to quote." },
      { step: "Win profitable roofing contracts", description: "Build your reputation with verified homeowner reviews and win more work." },
    ],
    benefits: [
      "Asphalt shingles, flat roofing (EPDM, TPO), and metal roofing leads",
      "Emergency storm damage repair leads",
      "Insurance adjuster referral work",
      "New construction and addition roofing",
      "Spring and fall high-season lead surges",
    ],
    exampleJobs: [
      { title: "Full Asphalt Shingle Re-Roof", budget: "$11,000–$17,000", location: "Brampton" },
      { title: "Flat Roof (EPDM) — Toronto Semi", budget: "$8,500–$13,000", location: "Parkdale, Toronto" },
      { title: "Storm Damage Emergency Repair", budget: "$1,500–$4,000", location: "Ajax" },
      { title: "Metal Roof Standing Seam", budget: "$22,000–$38,000", location: "Burlington" },
    ],
    stats: [
      { label: "Monthly Roofing Leads", value: "50+" },
      { label: "Avg Roofing Job", value: "$11,500" },
      { label: "Seasonal Lead Surge", value: "Spring/Fall" },
      { label: "Coverage", value: "GTA-wide" },
    ],
    faqs: [
      { question: "When should I expect the most roofing jobs in Toronto?", answer: "Peak seasons are spring (April–June) and fall (August–October). Emergency repair demand spikes after winter ice storms and late-summer hailstorms. QuoteXbert maintains year-round lead flow for roofers." },
    ],
  },
  {
    slug: "bathroom-renovation-jobs-toronto",
    tradeName: "Bathroom Renovation Contractors",
    metaTitle: "Bathroom Renovation Jobs Toronto | Bathroom Reno Work GTA",
    metaDescription: "Get bathroom renovation job leads in Toronto and the GTA. Join QuoteXbert free and connect with homeowners looking for bathroom renovation contractors.",
    keywords: ["bathroom renovation jobs toronto", "bathroom renovation contractor toronto", "bathroom reno work gta", "bathroom renovation leads"],
    h1: "Bathroom Renovation Jobs in Toronto & the GTA",
    intro: "Bathroom renovations are one of the most in-demand renovation services in Toronto. QuoteXbert delivers verified bathroom renovation leads to contractors who specialize in this high-value trade across the GTA.",
    howItWorks: [
      { step: "Join as a bathroom renovation contractor", description: "Create your profile showcasing your bathroom renovation portfolio and specialization." },
      { step: "Receive bathroom reno leads", description: "Get notified of bathroom projects in your area — from powder room refreshes to full ensuites." },
      { step: "Win bathroom renovation jobs", description: "Submit quotes and build your bathroom renovation reputation with verified reviews." },
    ],
    benefits: [
      "High average job value ($12,000–$40,000)",
      "Frequent repeat and referral customers",
      "Both standard and luxury bathroom leads",
      "Master ensuite, main bath, powder room leads",
      "Condo bathroom renovation leads in Toronto's urban core",
    ],
    exampleJobs: [
      { title: "Full Master Ensuite Renovation", budget: "$22,000–$38,000", location: "Yorkville, Toronto" },
      { title: "Main Bathroom (full reno)", budget: "$12,000–$20,000", location: "Richmond Hill" },
      { title: "Jack-and-Jill Bathroom", budget: "$18,000–$28,000", location: "Mississauga" },
      { title: "Powder Room + Laundry Combo", budget: "$8,000–$14,000", location: "East York, Toronto" },
    ],
    stats: [
      { label: "Monthly Bathroom Leads", value: "80+" },
      { label: "Avg Bathroom Job", value: "$18,000" },
      { label: "Lead Types", value: "All bathroom types" },
      { label: "GTA Coverage", value: "Complete" },
    ],
    faqs: [
      { question: "How many bathroom renovation jobs are posted in Toronto each month?", answer: "QuoteXbert receives 80–120 bathroom renovation lead requests per month across Toronto and the GTA. This includes powder rooms, full bathrooms, master ensuites, and condo bathroom renovations." },
    ],
  },
  {
    slug: "kitchen-renovation-jobs-toronto",
    tradeName: "Kitchen Renovation Contractors",
    metaTitle: "Kitchen Renovation Jobs Toronto | Kitchen Reno Work GTA",
    metaDescription: "Get kitchen renovation job leads in Toronto and the GTA. QuoteXbert connects kitchen contractors with homeowners ready to renovate. Join free today.",
    keywords: ["kitchen renovation jobs toronto", "kitchen contractor jobs toronto", "kitchen reno work gta", "kitchen renovation leads toronto"],
    h1: "Kitchen Renovation Jobs in Toronto & the GTA",
    intro: "Kitchen renovations are Toronto&apos;s highest-value renovation category, averaging $35,000+ per project. QuoteXbert matches skilled kitchen renovation contractors with homeowners ready to invest in their most important room.",
    howItWorks: [
      { step: "Join as a kitchen renovation contractor", description: "Upload your portfolio of completed kitchens and describe your specialty — custom cabinetry, IKEA installs, etc." },
      { step: "Receive kitchen project leads", description: "Get matched with kitchen renovation leads in your service area that match your budget range and style." },
      { step: "Win kitchen renovation contracts", description: "Showcase your portfolio, provide detailed quotes, and build your kitchen renovation brand." },
    ],
    benefits: [
      "Highest average renovation job value — often $30,000–$80,000",
      "Custom, semi-custom, and IKEA kitchen leads",
      "Full gut kitchen renovation leads available",
      "Condo kitchen renovation leads in Toronto",
      "Strong repeat and referral potential — kitchens get noticed",
    ],
    exampleJobs: [
      { title: "Full Custom Kitchen Renovation", budget: "$55,000–$85,000", location: "High Park, Toronto" },
      { title: "Semi-Custom Kitchen + Island", budget: "$32,000–$50,000", location: "Vaughan" },
      { title: "IKEA Kitchen + Quartz Counters", budget: "$18,000–$28,000", location: "Scarborough, Toronto" },
      { title: "Condo Kitchen Full Renovation", budget: "$22,000–$40,000", location: "Liberty Village, Toronto" },
    ],
    stats: [
      { label: "Monthly Kitchen Leads", value: "60+" },
      { label: "Avg Kitchen Job", value: "$38,000" },
      { label: "Budget Range", value: "$15K–$100K+" },
      { label: "GTA Coverage", value: "Complete" },
    ],
    faqs: [
      { question: "What is the highest-paying kitchen renovation segment in Toronto?", answer: "Custom kitchen renovations in Yorkville, Forest Hill, High Park, Vaughan, and Oakville command $50,000–$150,000+ and are the highest-value kitchen renovation leads on QuoteXbert." },
    ],
  },
  {
    slug: "deck-building-jobs-toronto",
    tradeName: "Deck Builders",
    metaTitle: "Deck Building Jobs Toronto | Deck Contractor Work in the GTA",
    metaDescription: "Find deck building job leads in Toronto and the GTA. Join QuoteXbert free and connect with homeowners looking to build decks and outdoor living spaces.",
    keywords: ["deck building jobs toronto", "deck contractor toronto", "deck jobs gta", "deck builder leads toronto"],
    h1: "Deck Building Jobs in Toronto & the GTA",
    intro: "Toronto homeowners invest heavily in outdoor living — composite decks, multi-level structures, pergolas, and complete backyard transformations. QuoteXbert connects skilled deck builders with eager clients across the GTA.",
    howItWorks: [
      { step: "Create your deck builder profile", description: "Upload photos of your best deck projects — composite, wood, multi-level, and pergola work." },
      { step: "Get deck building leads", description: "Receive project inquiries with yard photos so you can assess the job before committing to a quote." },
      { step: "Win deck building contracts", description: "Submit professional quotes and build your outdoor living reputation." },
    ],
    benefits: [
      "Seasonal surge — spring/early summer high demand",
      "Composite deck leads (higher margins)",
      "Multi-level and pergola project leads",
      "Single day to week-long projects available",
      "Strong referral chain from happy homeowners",
    ],
    exampleJobs: [
      { title: "Composite Deck (16x20 ft)", budget: "$18,000–$28,000", location: "Mississauga" },
      { title: "Multi-Level PT Wood Deck", budget: "$20,000–$35,000", location: "North York, Toronto" },
      { title: "Cedar Deck + Pergola", budget: "$22,000–$38,000", location: "Whitby" },
      { title: "Ground-Level Patio + Deck Combo", budget: "$15,000–$24,000", location: "Brampton" },
    ],
    stats: [
      { label: "Monthly Deck Leads", value: "40+" },
      { label: "Avg Deck Job", value: "$18,000" },
      { label: "Peak Season", value: "Apr–July" },
      { label: "Coverage", value: "GTA-wide" },
    ],
    faqs: [
      { question: "When is the best time to get deck building jobs in Toronto?", answer: "Spring (March–June) is the peak season for deck building leads in Toronto. Homeowners start planning in February–March. QuoteXbert deck leads are available year-round, with some homeowners planning fall builds." },
    ],
  },
  {
    slug: "flooring-installation-jobs-toronto",
    tradeName: "Flooring Installers",
    metaTitle: "Flooring Installation Jobs Toronto | Flooring Contractor Work GTA",
    metaDescription: "Find flooring installation job leads in Toronto and the GTA. Join QuoteXbert free and connect with homeowners looking for hardwood, LVP, and tile flooring installers.",
    keywords: ["flooring installation jobs toronto", "flooring contractor toronto", "hardwood flooring jobs gta", "tile flooring jobs toronto"],
    h1: "Flooring Installation Jobs in Toronto & the GTA",
    intro: "Toronto homeowners upgrade their floors more than almost any other renovation. Hardwood, luxury vinyl plank, tile, and carpet — QuoteXbert delivers flooring installation leads to qualified installers across the GTA all year round.",
    howItWorks: [
      { step: "Create your flooring installer profile", description: "List your flooring specializations — hardwood, engineered, LVP, tile — and upload portfolio photos." },
      { step: "Receive flooring leads", description: "Get matched with flooring projects in your area based on your specialty." },
      { step: "Win flooring contracts", description: "Provide accurate quotes and build your reputation with verified homeowner reviews." },
    ],
    benefits: [
      "High-volume lead type — flooring is renovated frequently",
      "Hardwood refinishing and installation leads",
      "Full-home flooring replacement leads",
      "Tile flooring leads (bathroom, kitchen, entryway)",
      "Both supply-and-install and install-only leads",
    ],
    exampleJobs: [
      { title: "Engineered Hardwood (1,400 sqft)", budget: "$11,000–$18,000", location: "Richmond Hill" },
      { title: "LVP Installation (Full Home)", budget: "$7,000–$11,000", location: "Brampton" },
      { title: "Porcelain Main Floor Tile", budget: "$9,000–$16,000", location: "The Beaches, Toronto" },
      { title: "Hardwood Refinishing (3 rooms)", budget: "$3,500–$5,500", location: "East York, Toronto" },
    ],
    stats: [
      { label: "Monthly Flooring Leads", value: "70+" },
      { label: "Avg Flooring Job", value: "$9,500" },
      { label: "Year-Round Demand", value: "All Seasons" },
      { label: "Coverage", value: "GTA-wide" },
    ],
    faqs: [
      { question: "How do flooring installers get more jobs in Toronto?", answer: "Join QuoteXbert to receive verified flooring leads. Build a strong portfolio with before/after photos, collect homeowner reviews, and ensure your profile highlights the flooring types you specialize in for best matching." },
    ],
  },
  {
    slug: "painting-jobs-toronto",
    tradeName: "Painters",
    metaTitle: "Painting Jobs Toronto | Professional Painter Work in the GTA",
    metaDescription: "Find painting job leads in Toronto and the GTA. Join QuoteXbert free and connect with homeowners looking for professional painters for interior and exterior painting.",
    keywords: ["painting jobs toronto", "painter jobs toronto", "painting contractor toronto", "painting leads gta"],
    h1: "Painting Jobs in Toronto & the GTA",
    intro: "Professional painting is one of the most frequently booked home services in Toronto. QuoteXbert delivers high-quality painting leads — interior full-home, exterior, cabinet painting, and specialty finishes — to professional painters across the GTA.",
    howItWorks: [
      { step: "Join as a professional painter", description: "Create your painter profile with your specializations, WSIB status, and portfolio of past work." },
      { step: "Receive painting job leads", description: "Get notified of painting jobs in your area — interior, exterior, commercial, and specialty." },
      { step: "Win painting contracts", description: "Quote competitively and build your painting business with verified customer reviews." },
    ],
    benefits: [
      "High-volume lead type — new every week",
      "Interior, exterior, and cabinet painting leads",
      "Full-home painting contracts available",
      "Condo painting leads in Toronto core",
      "Strong potential for repeat business and referrals",
    ],
    exampleJobs: [
      { title: "Interior Full Home (2,000 sqft)", budget: "$5,500–$8,500", location: "Etobicoke, Toronto" },
      { title: "Exterior + Trim (Detached)", budget: "$5,000–$9,000", location: "Burlington" },
      { title: "Kitchen Cabinet Painting", budget: "$2,000–$4,000", location: "Markham" },
      { title: "Condo Suite Painting (900 sqft)", budget: "$2,500–$4,500", location: "Downtown Toronto" },
    ],
    stats: [
      { label: "Monthly Painting Leads", value: "100+" },
      { label: "Avg Painting Job", value: "$5,200" },
      { label: "Lead Types", value: "Interior + Exterior" },
      { label: "Coverage", value: "GTA-wide" },
    ],
    faqs: [
      { question: "How can painters get more jobs in Toronto?", answer: "Join QuoteXbert to receive verified painting leads. Post before/after photos of your best work, respond to leads quickly (within 2 hours for best conversion), and collect reviews from every completed job." },
    ],
  },
];
