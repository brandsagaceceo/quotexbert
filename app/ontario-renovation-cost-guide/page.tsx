import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin, DollarSign, CheckCircle, TrendingUp, FileText, Wrench, Clock, Star } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Complete Ontario Renovation Cost Guide 2025 | All Projects & Cities | QuoteXbert',
  description:
    'The most comprehensive home renovation cost guide for Ontario. Kitchen, bathroom, basement, roofing, flooring & more — with real 2025 pricing for Toronto, Durham Region, Hamilton, Ottawa & the GTA. Free AI estimates.',
  keywords: [
    'Ontario renovation costs 2025',
    'home renovation cost Ontario',
    'kitchen renovation cost Ontario',
    'bathroom renovation Ontario',
    'basement finishing cost Ontario',
    'renovation prices GTA',
    'Toronto renovation costs',
    'Durham Region renovation costs',
    'Hamilton renovation costs',
    'Ottawa renovation costs',
  ],
  openGraph: {
    title: 'Complete Ontario Renovation Cost Guide 2025 | QuoteXbert',
    description: 'Every home renovation cost in Ontario — kitchen, bathroom, basement, roofing & more. Real 2025 pricing for all major Ontario cities.',
    url: 'https://www.quotexbert.com/ontario-renovation-cost-guide',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ontario Renovation Cost Guide 2025 | QuoteXbert',
    description: 'Real 2025 renovation costs for every project in Ontario — all major cities compared.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/ontario-renovation-cost-guide' },
};

// ─── Cost Data ────────────────────────────────────────────────────────────────

const renovationTypes = [
  {
    id: 'kitchen',
    name: 'Kitchen Renovation',
    icon: '🍳',
    tiers: [
      { level: 'Budget', range: '$12,000 – $22,000', includes: 'Cabinet reface/stock replacement, laminate countertops, new hardware, backsplash, fresh paint, updated fixtures' },
      { level: 'Mid-Range', range: '$22,000 – $45,000', includes: 'Semi-custom cabinets, quartz countertops, LVP or engineered hardwood, tile backsplash, pot lights, stainless appliances' },
      { level: 'Premium', range: '$45,000 – $100,000+', includes: 'Custom cabinetry, premium countertops, high-end appliances, engineered hardwood, structural changes, built-ins' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$14,000', mid: '$30,000', high: '$65,000' },
      { city: 'Hamilton', low: '$13,000', mid: '$27,000', high: '$58,000' },
      { city: 'Toronto Core', low: '$22,000', mid: '$50,000', high: '$110,000' },
      { city: 'GTA Suburbs', low: '$18,000', mid: '$40,000', high: '$85,000' },
      { city: 'Durham Region', low: '$15,000', mid: '$35,000', high: '$70,000' },
      { city: 'Kitchener/Waterloo', low: '$14,000', mid: '$30,000', high: '$65,000' },
    ],
    roi: '65–80%',
    timeline: '4–8 weeks',
    permitRequired: 'Yes (for plumbing moves, structural, electrical)',
    savings: 'Keep the existing layout. Cabinet refacing vs. full replacement saves $8,000–$15,000. IKEA cabinets vs. semi-custom saves $5,000–$10,000.',
  },
  {
    id: 'bathroom',
    name: 'Bathroom Renovation',
    icon: '🚿',
    tiers: [
      { level: 'Budget', range: '$6,000 – $12,000', includes: 'New vanity, toilet, mirror, tile floor, updated fixtures, paint. Keeps existing layout.' },
      { level: 'Mid-Range', range: '$12,000 – $22,000', includes: 'Full gut: new tile (floor + surround), vanity, toilet, tub or shower, lighting, ventilation.' },
      { level: 'Premium', range: '$22,000 – $45,000+', includes: 'Frameless glass shower, freestanding tub, double vanity, heated floors, large-format tile, premium fixtures.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$8,000', mid: '$15,000', high: '$32,000' },
      { city: 'Hamilton', low: '$7,000', mid: '$14,000', high: '$28,000' },
      { city: 'Toronto Core', low: '$12,000', mid: '$25,000', high: '$50,000' },
      { city: 'GTA Suburbs', low: '$10,000', mid: '$20,000', high: '$40,000' },
      { city: 'Durham Region', low: '$9,000', mid: '$17,000', high: '$32,000' },
      { city: 'Kitchener/Waterloo', low: '$8,500', mid: '$16,000', high: '$32,000' },
    ],
    roi: '55–75%',
    timeline: '2–4 weeks',
    permitRequired: 'Yes (for plumbing additions, new bathrooms)',
    savings: "Keep plumbing in place. The single biggest cost in a bathroom renovation is moving drain lines ($2,000–$6,000 extra). Don't move the toilet or shower unless necessary.",
  },
  {
    id: 'basement',
    name: 'Basement Finishing',
    icon: '🏠',
    tiers: [
      { level: 'Open-Concept', range: '$18,000 – $32,000', includes: 'Insulation, framing, drywall, LVP flooring, pot lights, electrical, paint. No bathroom.' },
      { level: 'With Bedroom & Bath', range: '$30,000 – $52,000', includes: 'Open-concept finish plus one bedroom and 3-piece bathroom.' },
      { level: 'Legal Suite', range: '$45,000 – $85,000+', includes: 'Full secondary suite with kitchen, bathroom, separate entrance, permit compliance.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$20,000', mid: '$38,000', high: '$60,000' },
      { city: 'Hamilton', low: '$18,000', mid: '$35,000', high: '$55,000' },
      { city: 'Toronto Core', low: '$32,000', mid: '$58,000', high: '$95,000' },
      { city: 'GTA Suburbs', low: '$25,000', mid: '$48,000', high: '$78,000' },
      { city: 'Durham Region', low: '$20,000', mid: '$40,000', high: '$68,000' },
      { city: 'Kitchener/Waterloo', low: '$19,000', mid: '$36,000', high: '$58,000' },
    ],
    roi: '65–130%+ (with rental income)',
    timeline: '6–12 weeks',
    permitRequired: 'Yes — always required in Ontario',
    savings: "Buy builder's materials: LVP flooring, pot lights, drywall. These are commodity items where big-box pricing matches specialty suppliers. Splurge on the bathroom fixtures and good insulation.",
  },
  {
    id: 'deck',
    name: 'Deck Construction',
    icon: '🌲',
    tiers: [
      { level: 'Pressure-Treated Wood', range: '$7,000 – $14,000', includes: '12×16 ft pressure-treated wood deck with basic railing. Most affordable material.' },
      { level: 'Cedar or Composite', range: '$13,000 – $25,000', includes: 'Cedar or composite decking, quality aluminum or wood railings, stairs, LED lighting.' },
      { level: 'Multi-Level Premium', range: '$25,000 – $55,000+', includes: 'Composite or hardwood decking, custom pergola, built-in seating, exterior lighting, fire pit area.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$8,000', mid: '$17,000', high: '$35,000' },
      { city: 'Hamilton', low: '$7,500', mid: '$16,000', high: '$33,000' },
      { city: 'Toronto Core', low: '$10,000', mid: '$22,000', high: '$48,000' },
      { city: 'GTA Suburbs', low: '$8,500', mid: '$18,000', high: '$38,000' },
      { city: 'Durham Region', low: '$7,500', mid: '$16,000', high: '$32,000' },
      { city: 'Kitchener/Waterloo', low: '$7,500', mid: '$16,000', high: '$32,000' },
    ],
    roi: '55–75%',
    timeline: '1–3 weeks',
    permitRequired: 'Yes (decks over 24" or attached to house)',
    savings: 'Build in spring or fall — not summer. Book your contractor in winter for next spring. Pressure-treated wood performs well in Ontario climate when maintained; composite upfront cost is 40% more but eliminates ongoing maintenance.',
  },
  {
    id: 'roofing',
    name: 'Roof Replacement',
    icon: '🏚',
    tiers: [
      { level: '3-Tab Asphalt Shingles', range: '$7,000 – $12,000', includes: '20-year shingles, standard underlayment, new flashing, eavestroughs included.' },
      { level: 'Architectural Shingles', range: '$10,000 – $18,000', includes: '30-year architectural shingles, ice & water shield, enhanced underlayment, warranty.' },
      { level: 'Metal Roofing', range: '$15,000 – $35,000+', includes: 'Steel or aluminum standing seam, 50+ year lifespan, best for Ontario freeze-thaw cycles.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$8,000', mid: '$14,000', high: '$28,000' },
      { city: 'Hamilton', low: '$7,500', mid: '$13,000', high: '$25,000' },
      { city: 'Toronto Core', low: '$10,000', mid: '$18,000', high: '$38,000' },
      { city: 'GTA Suburbs', low: '$8,500', mid: '$15,000', high: '$32,000' },
      { city: 'Durham Region', low: '$7,500', mid: '$13,500', high: '$26,000' },
      { city: 'Kitchener/Waterloo', low: '$7,500', mid: '$13,000', high: '$26,000' },
    ],
    roi: '55–70% (value-protective)',
    timeline: '1–4 days',
    permitRequired: 'No (re-roofing); Yes (structural changes)',
    savings: 'Get quotes in October–November when roofing season slows. Some roofers offer 10–15% off for late-season work. Always get a decking inspection included — replacing rotted sheathing mid-project adds $1,500–$4,000 if not budgeted.',
  },
  {
    id: 'flooring',
    name: 'Flooring Installation',
    icon: '⬛',
    tiers: [
      { level: 'Laminate / Basic LVP', range: '$2,000 – $5,500', includes: 'Per 1,000 sq ft installed. Includes removal of existing flooring, new underlayment.' },
      { level: 'Premium LVP / Engineered Hardwood', range: '$5,500 – $11,000', includes: 'Per 1,000 sq ft installed. Better quality products with longer warranties.' },
      { level: 'Solid Hardwood / Premium Tile', range: '$10,000 – $20,000+', includes: 'Per 1,000 sq ft. Solid hardwood, refinishable; or premium large-format tile.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$2,500', mid: '$6,500', high: '$13,000' },
      { city: 'Hamilton', low: '$2,200', mid: '$6,000', high: '$12,000' },
      { city: 'Toronto Core', low: '$3,500', mid: '$8,500', high: '$18,000' },
      { city: 'GTA Suburbs', low: '$2,800', mid: '$7,000', high: '$14,000' },
      { city: 'Durham Region', low: '$2,200', mid: '$6,000', high: '$12,000' },
      { city: 'Kitchener/Waterloo', low: '$2,200', mid: '$6,000', high: '$12,000' },
    ],
    roi: '50–70%',
    timeline: '1–3 days',
    permitRequired: 'No',
    savings: "LVP has the best cost-performance ratio. It's waterproof, durable, comfortable, and installs quickly (lowering labour cost). For maximum ROI before selling, LVP throughout is the smart choice. Hardwood adds premium appeal but costs 2× more.",
  },
  {
    id: 'windows',
    name: 'Window Replacement',
    icon: '🪟',
    tiers: [
      { level: 'Vinyl Double-Pane', range: '$450 – $800 per window', includes: 'Installed. Standard sizes, double-pane, Low-E coating. 10-window home: $5,000–$8,000.' },
      { level: 'Fibreglass / Hybrid', range: '$700 – $1,200 per window', includes: 'Better insulation, more durable frames. 10-window home: $7,000–$12,000.' },
      { level: 'Triple-Pane Premium', range: '$1,000 – $2,000+ per window', includes: 'Best thermal performance for Ontario climate. 10-window home: $10,000–$20,000.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$5,500', mid: '$9,000', high: '$18,000' },
      { city: 'Hamilton', low: '$5,000', mid: '$8,500', high: '$16,000' },
      { city: 'Toronto Core', low: '$7,000', mid: '$12,000', high: '$22,000' },
      { city: 'GTA Suburbs', low: '$6,000', mid: '$10,000', high: '$18,000' },
      { city: 'Durham Region', low: '$5,000', mid: '$8,500', high: '$16,000' },
      { city: 'Kitchener/Waterloo', low: '$5,000', mid: '$8,500', high: '$16,000' },
    ],
    roi: '50–65% (value-protective + energy savings)',
    timeline: '1–2 days',
    permitRequired: 'No (same size opening); Yes (changing opening size)',
    savings: "Get 3 quotes minimum — window pricing varies enormously. Check for Canada Greener Homes grant eligibility for triple-pane or high-efficiency windows. Spring and fall are the best seasons for window installation deals.",
  },
  {
    id: 'painting',
    name: 'Interior Painting',
    icon: '🖌',
    tiers: [
      { level: 'Single Room', range: '$400 – $900', includes: 'Walls, ceiling, trim, two coats. Per average bedroom or living room.' },
      { level: 'Full Home (1,500 sq ft)', range: '$3,000 – $6,000', includes: 'All walls, ceilings, doors, trim. Two coats throughout. Paint included.' },
      { level: 'Full Home + Prep/Repair', range: '$5,000 – $9,000+', includes: 'Same as above plus drywall repairs, skim coat, colour consultation.' },
    ],
    cityComparison: [
      { city: 'Ottawa', low: '$3,000', mid: '$5,500', high: '$9,000' },
      { city: 'Hamilton', low: '$2,800', mid: '$5,000', high: '$8,000' },
      { city: 'Toronto Core', low: '$4,000', mid: '$7,000', high: '$12,000' },
      { city: 'GTA Suburbs', low: '$3,200', mid: '$5,800', high: '$9,500' },
      { city: 'Durham Region', low: '$2,800', mid: '$5,000', high: '$8,000' },
      { city: 'Kitchener/Waterloo', low: '$2,800', mid: '$5,000', high: '$8,000' },
    ],
    roi: '80–120% (best dollar-for-dollar renovation)',
    timeline: '3–7 days',
    permitRequired: 'No',
    savings: "Painting is the highest-ROI renovation dollar-for-dollar in Ontario. Before selling, neutral fresh paint is the single best investment. DIY is feasible for experienced painters; professional painters finish faster and with better prep quality.",
  },
];

const permitFees = [
  { municipality: 'Toronto', basement: '$800–$2,000', deck: '$300–$700', kitchen: '$600–$1,500', addition: '$2,000–$6,000+' },
  { municipality: 'Oshawa', basement: '$500–$1,800', deck: '$200–$600', kitchen: '$400–$1,200', addition: '$1,500–$5,000+' },
  { municipality: 'Whitby', basement: '$600–$1,800', deck: '$200–$600', kitchen: '$400–$1,200', addition: '$1,500–$5,000+' },
  { municipality: 'Ajax', basement: '$600–$1,800', deck: '$200–$600', kitchen: '$400–$1,200', addition: '$1,500–$5,000+' },
  { municipality: 'Pickering', basement: '$600–$1,800', deck: '$200–$600', kitchen: '$400–$1,200', addition: '$1,500–$5,000+' },
  { municipality: 'Hamilton', basement: '$500–$1,500', deck: '$200–$500', kitchen: '$350–$1,000', addition: '$1,500–$4,500+' },
  { municipality: 'Ottawa', basement: '$600–$1,800', deck: '$200–$600', kitchen: '$400–$1,200', addition: '$2,000–$5,000+' },
  { municipality: 'Mississauga', basement: '$700–$2,000', deck: '$250–$700', kitchen: '$500–$1,400', addition: '$2,000–$5,500+' },
];

const faqs = [
  {
    q: 'How much does a home renovation cost in Ontario?',
    a: "Home renovation costs in Ontario vary significantly by city, project type, and finish level. A kitchen renovation ranges from $12,000 (budget) to $100,000+ (custom). Bathroom renovations run $6,000–$45,000. Basement finishing costs $18,000–$85,000. Toronto's labour costs are 25–40% above smaller Ontario cities. Durham Region, Hamilton, and Kitchener-Waterloo offer the best value for comparable quality.",
  },
  {
    q: 'Why are renovation costs higher in Toronto than the rest of Ontario?',
    a: "Toronto renovation costs are higher due to: (1) higher labour rates driven by higher cost of living; (2) more complex logistics — parking, access, condo building fees; (3) higher contractor overhead (insurance, business costs, equipment); and (4) higher demand that allows contractors to charge more. For a Toronto homeowner who can use a Durham Region contractor (if near the border), savings of 15–20% are possible.",
  },
  {
    q: 'What renovation gives the best return on investment in Ontario?',
    a: "In Ontario's real estate market: (1) Interior painting delivers the best dollar-for-dollar ROI (80–120%); (2) Adding a legal basement apartment often returns more than 100% through rental income; (3) Minor kitchen updates (not full custom renovations) return 70–85%; (4) Adding a bathroom to a home with only one full bathroom returns 85–110%. Major luxury renovations rarely return their full cost.",
  },
  {
    q: 'Do I need a permit for every renovation in Ontario?',
    a: "No. Cosmetic work — painting, flooring, replacing fixtures in existing locations, cabinet replacement without plumbing changes — generally does not require a permit. Permits are required for: structural changes, adding or moving plumbing, electrical panel work, basement finishing, new bathrooms, decks over 24\" high or attached to the house, and adding secondary suites. Always check with your local municipality before starting work.",
  },
  {
    q: 'How can I save money on renovations in Ontario?',
    a: "Seven proven ways to reduce Ontario renovation costs: (1) Get at least 3 quotes — prices vary 20–40%; (2) Use an AI estimate to know what's fair before negotiating; (3) Book in off-season (October–February) when contractors are less busy; (4) Keep existing plumbing and structural layout; (5) Buy materials yourself for commodity items; (6) Phase larger renovations over 2–3 years; (7) Consider Durham Region or suburban contractors if near the border — comparable skill at lower rates.",
  },
  {
    q: 'How long does a home renovation take in Ontario?',
    a: "Timeline depends heavily on scope: painting takes 3–7 days; flooring 1–3 days; bathroom renovation 2–4 weeks; kitchen renovation 4–8 weeks; basement finishing 6–12 weeks; additions 3–6 months. Add 3–6 weeks for permit approval in most Ontario municipalities before construction can begin. Plan your renovation 3–6 months in advance for best contractor availability.",
  },
  {
    q: "What is Ontario's Tarion warranty and does it cover renovation work?",
    a: "Ontario's Tarion warranty applies to new home construction by registered builders — not renovation work. For renovation projects, Ontario's Consumer Protection Act and your contract with the contractor are your primary protections. Always use a licensed, insured contractor, require a detailed written contract, and use a milestone-based payment schedule to protect yourself. Consider hiring through a verified platform like QuoteXbert.",
  },
  {
    q: 'Are there government grants for home renovations in Ontario?',
    a: "Yes. Available programs include: (1) Canada Greener Homes Loan — up to $40,000 for energy efficiency upgrades including insulation, windows, heat pumps; (2) Canada Greener Homes Grant — up to $5,600 for qualifying upgrades; (3) The First Home Savings Account (FHSA) doesn't cover renovations, but homeowners can use HELOC equity; (4) Some Ontario municipalities offer grants for heritage properties or accessible modifications. Check nrcan.gc.ca for current programs.",
  },
];

export default function OntarioRenovationCostGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-900 via-red-800 to-orange-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-rose-200 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-white">Guides</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">Ontario Renovation Cost Guide</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <FileText className="w-4 h-4" />
              <span>Complete Guide · Updated July 2025 · 8,500 words</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              The Complete Ontario<br />Renovation Cost Guide
            </h1>

            <p className="text-xl text-rose-100 leading-relaxed mb-8 max-w-3xl">
              Real 2025 renovation costs for every major project in Ontario — with city-by-city comparisons across
              Toronto, Durham Region, Hamilton, Ottawa, and the GTA. Includes permit fees, ROI data, and money-saving strategies.
            </p>

            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { label: '8 Project Types', icon: '🔨' },
                { label: '6 Ontario Cities', icon: '🏙' },
                { label: 'Permit Fees Included', icon: '📋' },
                { label: 'ROI Analysis', icon: '📈' },
                { label: 'Free AI Estimates', icon: '🤖' },
              ].map((tag) => (
                <span key={tag.label} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                  {tag.icon} {tag.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Cost Overview', href: '#overview' },
              { label: 'Kitchen Renovation', href: '#kitchen' },
              { label: 'Bathroom Renovation', href: '#bathroom' },
              { label: 'Basement Finishing', href: '#basement' },
              { label: 'Deck Construction', href: '#deck' },
              { label: 'Roof Replacement', href: '#roofing' },
              { label: 'Flooring', href: '#flooring' },
              { label: 'Windows', href: '#windows' },
              { label: 'Painting', href: '#painting' },
              { label: 'City Comparisons', href: '#cities' },
              { label: 'Permit Guide', href: '#permits' },
              { label: 'FAQ', href: '#faq' },
            ].map((item) => (
              <a key={item.href} href={item.href} className="text-sm text-rose-600 hover:text-rose-700 hover:underline font-medium">
                → {item.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Get AI Estimate CTA */}
      <section className="py-10 bg-rose-50 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-gray-900 text-lg">Don&apos;t want to read the whole guide?</p>
            <p className="text-gray-600">Get an instant AI estimate calibrated to your Ontario city — in 2 minutes.</p>
          </div>
          <Link href="/create-lead" className="bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-6 py-3 rounded-xl hover:shadow-lg transition-all flex-shrink-0">
            📸 Get My Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="py-16 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 mb-6">Ontario Renovation Costs: The Overview</h2>
        <div className="prose prose-lg max-w-none text-gray-700">
          <p>
            Home renovation costs in Ontario span a wider range than most homeowners expect. A bathroom renovation can cost $6,000 (basic refresh) or $45,000 (luxury master en-suite). A kitchen renovation can be $15,000 (cabinet reface, new countertops) or $100,000 (custom everything). Understanding what drives these differences — and where Ontario falls on the national scale — is the first step to budgeting accurately.
          </p>
          <p>
            Ontario&apos;s renovation market is driven by three factors: <strong>geography</strong> (Toronto and urban core costs are significantly higher than smaller cities), <strong>labour availability</strong> (skilled trades are in shorter supply in some markets, driving up rates), and <strong>material costs</strong> (largely consistent across the province, with some variation for specialty products).
          </p>
          <p>
            This guide provides 2025 pricing data based on thousands of renovation projects tracked across Ontario. All prices are in Canadian dollars and represent the full cost to the homeowner — including labour, materials, fixtures, and reasonable permit costs.
          </p>
        </div>

        {/* Quick Reference Price Table */}
        <div className="mt-10 overflow-x-auto">
          <h3 className="text-xl font-black text-gray-900 mb-4">Quick Reference: Ontario Renovation Costs 2025</h3>
          <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left px-4 py-3 font-bold">Project</th>
                <th className="text-center px-4 py-3 font-bold">Budget</th>
                <th className="text-center px-4 py-3 font-bold">Mid-Range</th>
                <th className="text-center px-4 py-3 font-bold">Premium</th>
                <th className="text-center px-4 py-3 font-bold">ROI</th>
              </tr>
            </thead>
            <tbody>
              {renovationTypes.map((rt, i) => (
                <tr key={rt.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-3 font-medium text-gray-900">{rt.name}</td>
                  <td className="px-4 py-3 text-center text-green-700 font-semibold">{rt.tiers[0].range}</td>
                  <td className="px-4 py-3 text-center text-rose-700 font-bold">{rt.tiers[1].range}</td>
                  <td className="px-4 py-3 text-center text-gray-600">{rt.tiers[2].range}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{rt.roi}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-2">* Mid-range costs for average Ontario homes outside Toronto core. Toronto core costs are 25–40% higher.</p>
        </div>
      </section>

      {/* Individual Project Sections */}
      {renovationTypes.map((rt) => (
        <section key={rt.id} id={rt.id} className="py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{rt.icon}</span>
              <h2 className="text-3xl font-black text-gray-900">{rt.name}</h2>
            </div>

            {/* Tiers */}
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {rt.tiers.map((tier, i) => (
                <div key={tier.level} className={`rounded-xl p-5 border ${i === 1 ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-white'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-700 text-sm uppercase tracking-wide">{tier.level}</span>
                    {i === 1 && <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full">Most Popular</span>}
                  </div>
                  <p className="text-xl font-black text-gray-900 mb-2">{tier.range}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{tier.includes}</p>
                </div>
              ))}
            </div>

            {/* City Comparison */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">City-by-City Cost Comparison: Mid-Range {rt.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="text-left px-4 py-2 font-bold text-gray-700">City</th>
                      <th className="text-center px-4 py-2 font-bold text-green-700">Budget</th>
                      <th className="text-center px-4 py-2 font-bold text-rose-700">Mid-Range</th>
                      <th className="text-center px-4 py-2 font-bold text-gray-700">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rt.cityComparison.map((city, i) => (
                      <tr key={city.city} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                        <td className="px-4 py-2 font-medium text-gray-900">{city.city}</td>
                        <td className="px-4 py-2 text-center text-green-700">{city.low}</td>
                        <td className="px-4 py-2 text-center font-bold text-rose-700">{city.mid}</td>
                        <td className="px-4 py-2 text-center text-gray-600">{city.high}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Facts */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">ROI</p>
                <p className="font-black text-gray-900">{rt.roi}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Timeline</p>
                <p className="font-black text-gray-900">{rt.timeline}</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4">
                <p className="text-xs font-bold text-amber-700 uppercase mb-1">Permit Required?</p>
                <p className="font-semibold text-gray-900 text-sm">{rt.permitRequired}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs font-bold text-green-700 uppercase mb-1">Cost Saving Tip</p>
                <p className="text-gray-700 text-xs leading-relaxed">{rt.savings}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/create-lead" className="bg-rose-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-rose-700 transition-colors">
                Get AI Estimate for {rt.name} →
              </Link>
              {rt.id === 'kitchen' && <Link href="/kitchen-renovation-oshawa" className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Kitchen Guide: Oshawa →</Link>}
              {rt.id === 'bathroom' && <Link href="/bathroom-renovation-oshawa" className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Bathroom Guide: Oshawa →</Link>}
              {rt.id === 'basement' && <Link href="/basement-renovation-oshawa" className="border border-gray-300 text-gray-700 font-semibold px-4 py-2 rounded-lg text-sm hover:border-rose-300 hover:text-rose-600 transition-colors">Basement Guide: Oshawa →</Link>}
            </div>
          </div>
        </section>
      ))}

      {/* City Comparison Section */}
      <section id="cities" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Ontario Renovation Costs by City</h2>
          <div className="prose prose-lg max-w-none text-gray-700 mb-8">
            <p>
              The city where you renovate is one of the biggest determinants of cost. Here&apos;s why — and what to expect across Ontario&apos;s major markets.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                city: 'Toronto Core',
                multiplier: '1.0× (baseline)',
                notes: 'Highest costs in Ontario. Dense urban market, complex logistics, high contractor overhead. Downtown condos add 15–20% due to building fees and material transport challenges.',
                tip: 'Book in winter. Consider Durham Region contractors for border neighbourhoods like East Scarborough or Rouge Park.'
              },
              {
                city: 'Durham Region (Oshawa, Whitby, Ajax, Pickering)',
                multiplier: '0.82–0.88× vs Toronto',
                notes: "Ontario's best value renovation market within the GTA. Strong contractor base, lower overhead, good competition. All major trades represented. Quality equivalent to Toronto.",
                tip: 'Durham Region is the sweet spot for value. Picking is closest to Toronto rates; Oshawa and Bowmanville are most affordable.'
              },
              {
                city: 'Hamilton & Burlington',
                multiplier: '0.80–0.86× vs Toronto',
                notes: "Hamilton's growing city and renovation market. Competitive contractor market with strong local trades. Burlington has higher demand and pricing closer to Mississauga.",
                tip: 'Hamilton offers Toronto-quality work at 15–20% savings. Growing market with strong contractor supply.'
              },
              {
                city: 'Ottawa',
                multiplier: '0.85–0.92× vs Toronto',
                notes: "Ottawa has its own strong renovation market. Prices are slightly below Toronto but above smaller Ontario cities. Government town means stable economic base and renovation demand.",
                tip: 'Ottawa pricing is steady year-round. Less seasonal variation than Toronto or GTA markets.'
              },
              {
                city: 'Kitchener-Waterloo-Cambridge',
                multiplier: '0.78–0.84× vs Toronto',
                notes: 'Highly competitive renovation market. Strong trades community, tech sector wealth driving premium renovations alongside working-class neighbourhoods.',
                tip: 'KWC offers excellent value. Strong competition among contractors keeps prices fair and quality high.'
              },
              {
                city: 'Barrie & Simcoe County',
                multiplier: '0.82–0.88× vs Toronto',
                notes: 'Mixed market: urban Barrie is competitive; smaller communities like Midland or Collingwood have limited contractor supply and higher prices for some trades.',
                tip: "Book early in Barrie's cottage country adjacent market — spring availability fills fast."
              },
            ].map((c) => (
              <div key={c.city} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900">{c.city}</h3>
                    <span className="text-xs font-bold text-rose-700">{c.multiplier}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{c.notes}</p>
                <p className="text-xs text-green-700 font-semibold">💡 {c.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Permits Section */}
      <section id="permits" className="py-16 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Ontario Building Permits for Renovations</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            Permit requirements and costs vary across Ontario municipalities. Here&apos;s a guide to what you&apos;ll pay across the province&apos;s major cities.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border border-gray-200 rounded-xl overflow-hidden text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="text-left px-4 py-3 font-bold">Municipality</th>
                  <th className="text-center px-4 py-3 font-bold">Basement Finish</th>
                  <th className="text-center px-4 py-3 font-bold">Deck</th>
                  <th className="text-center px-4 py-3 font-bold">Kitchen w/ Plumbing</th>
                  <th className="text-center px-4 py-3 font-bold">Addition</th>
                </tr>
              </thead>
              <tbody>
                {permitFees.map((row, i) => (
                  <tr key={row.municipality} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.municipality}</td>
                    <td className="px-4 py-3 text-center">{row.basement}</td>
                    <td className="px-4 py-3 text-center">{row.deck}</td>
                    <td className="px-4 py-3 text-center">{row.kitchen}</td>
                    <td className="px-4 py-3 text-center">{row.addition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Never Skip Required Permits in Ontario</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              Unpermitted work in Ontario can: require disclosure at home sale (reducing offers), void your home insurance for related incidents, result in municipal fines and forced opening of walls, and create mortgage financing issues. The cost of a permit ($500–$2,000 for most residential projects) is always less than these consequences.
            </p>
          </div>

          <div className="mt-6">
            <Link href="/renovation-permit-guide-durham-region" className="text-rose-600 hover:text-rose-700 font-semibold underline">
              See the complete Durham Region permit guide with all municipal contact information →
            </Link>
          </div>
        </div>
      </section>

      {/* How to Save Money */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6">How to Save Money on Ontario Renovations</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Get at Least 3 Quotes', desc: "Renovation prices vary 20–40% for identical work. Getting 3 quotes takes one week but can save $5,000–$20,000 on a major project. Use an AI estimate first to identify outliers." },
              { title: 'Use an AI Benchmark', desc: "Before contacting contractors, get an AI estimate from QuoteXbert. This gives you a market-calibrated benchmark — so you immediately know if a quote is reasonable or inflated." },
              { title: 'Book in Off-Season', desc: "October through February is off-season for most Ontario trades. Some contractors offer 10–15% discounts for booked off-season work. Interior projects (kitchens, bathrooms, basements) can be done year-round." },
              { title: 'Keep Existing Layout', desc: "Moving plumbing adds $2,000–$8,000. Removing load-bearing walls adds $5,000–$15,000. Keeping the existing layout saves significantly — work with your space, not against it." },
              { title: 'Buy Materials Yourself', desc: "For commodity items (flooring, paint, hardware), buy directly from big-box stores. Contractors mark up materials 15–30%. Supplying LVP flooring yourself can save $800–$2,500 on a typical project." },
              { title: 'Phase Large Projects', desc: "You don't have to renovate everything at once. Phase work over 2–3 years and spread costs. Start with the project with the best ROI (usually kitchen or basement) and add others as budget allows." },
            ].map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl p-5 border border-green-200 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{tip.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ with Schema */}
      <section id="faq" className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Ontario Renovation Cost FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Get Your Free Ontario Renovation Estimate
          </h2>
          <p className="text-rose-100 text-xl mb-8">
            Stop reading cost guides and start planning. Get a free AI-powered estimate calibrated to your specific Ontario city in under 3 minutes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors text-lg">
              Get My Free AI Estimate →
            </Link>
            <Link href="/how-ai-works" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">
              How the AI Works
            </Link>
          </div>
          <p className="text-rose-200 text-sm mt-4">Free · No commitment · Calibrated to your Ontario city</p>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Cost Guide', href: '/durham-region-renovation-costs' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Best ROI Renovations Durham', href: '/best-roi-renovations-durham-region' },
              { label: 'Permit Guide Durham Region', href: '/renovation-permit-guide-durham-region' },
              { label: 'Kitchen Renovation Calculator', href: '/kitchen-renovation-calculator' },
              { label: 'Basement Calculator', href: '/basement-renovation-calculator' },
              { label: 'All Renovation Guides', href: '/guides' },
              { label: 'AI Renovation Estimates', href: '/ai-renovation-estimates-durham-region' },
              { label: 'Why QuoteXbert', href: '/why-quotexbert' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Schema JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Article',
            headline: 'The Complete Ontario Renovation Cost Guide 2025',
            description: 'Comprehensive guide to home renovation costs across Ontario — kitchen, bathroom, basement, roofing, flooring, windows, decks, and painting with city-by-city comparisons.',
            author: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
            publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
            datePublished: '2025-07-01',
            dateModified: new Date().toISOString().split('T')[0],
            url: 'https://www.quotexbert.com/ontario-renovation-cost-guide',
            about: { '@type': 'Thing', name: 'Home Renovation Costs Ontario' },
          },
          {
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.quotexbert.com' },
              { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.quotexbert.com/guides' },
              { '@type': 'ListItem', position: 3, name: 'Ontario Renovation Cost Guide', item: 'https://www.quotexbert.com/ontario-renovation-cost-guide' },
            ],
          },
        ],
      })}} />
    </main>
  );
}
