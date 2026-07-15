import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Wrench, DollarSign, TrendingDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Durham Region Renovation Costs 2025 | Complete Price Guide | QuoteXbert',
  description:
    'Complete guide to renovation costs in Durham Region, Ontario. Kitchen, bathroom, basement, deck, roofing & more. Durham rates are 15–20% below Toronto. Updated 2025 pricing.',
  keywords: [
    'Durham Region renovation costs',
    'renovation costs Durham Ontario 2025',
    'how much does renovation cost Durham Region',
    'kitchen renovation cost Durham',
    'bathroom renovation cost Durham',
    'basement finishing cost Durham',
    'roof replacement cost Durham Region',
    'deck building cost Durham',
  ],
  openGraph: {
    title: 'Durham Region Renovation Costs 2025 | QuoteXbert',
    description: 'Complete 2025 renovation cost guide for Durham Region. Kitchen, bathroom, basement & more — all 15–20% below Toronto.',
    url: 'https://www.quotexbert.com/durham-region-renovation-costs',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durham Region Renovation Costs 2025 | QuoteXbert',
    description: '2025 renovation cost guide for Durham Region, Ontario. Accurate local pricing.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/durham-region-renovation-costs',
  },
};

const renovationCosts = [
  {
    type: 'Kitchen Renovation',
    basic: '$15,000 – $25,000',
    midRange: '$25,000 – $40,000',
    highEnd: '$40,000 – $65,000+',
    torontoComparison: '$20,000 – $80,000+',
    details: 'Includes cabinets, countertops, backsplash, flooring, appliances, and labour. Mid-range kitchen in Durham Region averages $28,000–$35,000.',
  },
  {
    type: 'Bathroom Renovation',
    basic: '$8,500 – $14,000',
    midRange: '$14,000 – $20,000',
    highEnd: '$20,000 – $35,000+',
    torontoComparison: '$12,000 – $40,000+',
    details: 'Full gut and rebuild with new tile, vanity, toilet, tub/shower, lighting, and plumbing fixtures. Powder rooms start at $5,000.',
  },
  {
    type: 'Basement Finishing',
    basic: '$18,000 – $28,000',
    midRange: '$28,000 – $45,000',
    highEnd: '$45,000 – $70,000+',
    torontoComparison: '$30,000 – $90,000+',
    details: 'Open-concept finish with one bathroom. Adding a second bedroom, kitchen, or separate entrance increases cost significantly. Legal rental suites start at $35,000.',
  },
  {
    type: 'Deck Construction',
    basic: '$6,500 – $10,000',
    midRange: '$10,000 – $18,000',
    highEnd: '$18,000 – $35,000+',
    torontoComparison: '$8,000 – $40,000+',
    details: 'Pressure-treated wood deck at basic end; composite or cedar mid-range; multi-level or multi-feature decks at high end. Size and material drive cost.',
  },
  {
    type: 'Roof Replacement',
    basic: '$7,000 – $10,000',
    midRange: '$10,000 – $15,000',
    highEnd: '$15,000 – $25,000+',
    torontoComparison: '$8,000 – $28,000+',
    details: 'Standard asphalt shingles at basic; architectural shingles mid-range; metal or other premium roofing at high end. 2,000 sq ft home averages $10,000–$14,000.',
  },
  {
    type: 'Flooring Installation',
    basic: '$2,200 – $5,000',
    midRange: '$5,000 – $9,000',
    highEnd: '$9,000 – $18,000+',
    torontoComparison: '$3,000 – $20,000+',
    details: 'Laminate or LVP at basic; engineered hardwood mid-range; solid hardwood or premium tile at high end. Cost based on average 1,000 sq ft of flooring.',
  },
  {
    type: 'Interior Painting',
    basic: '$1,500 – $3,000',
    midRange: '$3,000 – $5,500',
    highEnd: '$5,500 – $9,000+',
    torontoComparison: '$2,000 – $10,000+',
    details: 'Full home interior painting including ceilings, trim, and doors. Cost scales with ceiling height, surface prep, and finish quality.',
  },
  {
    type: 'Window Replacement',
    basic: '$4,000 – $7,000',
    midRange: '$7,000 – $12,000',
    highEnd: '$12,000 – $22,000+',
    torontoComparison: '$5,000 – $25,000+',
    details: 'Vinyl windows at basic; fibreglass or hybrid frames mid-range; triple-pane premium at high end. Based on replacing 10 windows in an average home.',
  },
];

const durhamVsTorontoTable = [
  { city: 'Toronto Core', multiplier: '1.0×', example: '$35,000' },
  { city: 'North York / Etobicoke', multiplier: '0.95×', example: '$33,000' },
  { city: 'Pickering / Ajax', multiplier: '0.87×', example: '$30,000' },
  { city: 'Whitby / Oshawa', multiplier: '0.85×', example: '$29,500' },
  { city: 'Bowmanville / Clarington', multiplier: '0.83×', example: '$29,000' },
  { city: 'Port Perry / Uxbridge', multiplier: '0.82×', example: '$28,500' },
];

const costFactors = [
  { factor: 'Project Scope', desc: 'The bigger and more complex the project, the higher the cost. Adding a bathroom to a basement nearly doubles the basement finishing cost.' },
  { factor: 'Materials & Finishes', desc: 'Builder-grade materials cost significantly less than mid-grade or luxury. The same kitchen can range from $15,000 to $65,000+ based solely on cabinet and countertop choices.' },
  { factor: 'Structural Work', desc: 'Moving load-bearing walls, changing floor plans, or adding exterior openings (doors, windows) adds $5,000–$20,000 to any project.' },
  { factor: 'Permit Costs', desc: 'Building permits in Durham Region typically cost $500–$2,500 for most renovation projects. Factor this into your budget.' },
  { factor: 'Timing & Season', desc: 'Exterior projects (decks, roofing, painting) are most competitive in fall and winter. Interior projects (kitchens, bathrooms) are in demand year-round.' },
  { factor: 'Contractor Type', desc: 'Licensed general contractors cost more than subcontractors — but manage the project, handle permits, and are accountable. Often worth the premium.' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Durham Region in 2025?',
    a: 'A kitchen renovation in Durham Region in 2025 costs between $15,000 and $65,000+ depending on the scope and materials. A mid-range kitchen (new cabinets, quartz countertops, new flooring, fresh paint, new appliances) typically runs $25,000–$38,000 in the Durham Region market.',
  },
  {
    q: 'Why are renovation costs lower in Durham Region than Toronto?',
    a: "Durham Region has lower labour costs primarily due to lower cost of living, lower overhead for contractor businesses, and more competition among contractors. Material costs are similar across the GTA — the difference is in labour. This explains why most projects are 15–20% less expensive in Durham compared to Toronto's urban core.",
  },
  {
    q: 'How much does it cost to finish a basement in Durham Region?',
    a: 'Finishing a basement in Durham Region typically costs $18,000–$70,000 depending on size, scope, and whether a bathroom is included. A 700 sq ft open-concept basement with one 3-piece bathroom runs $28,000–$40,000 in the Durham Region market. Creating a legal rental suite with a separate kitchen adds $10,000–$20,000 to that.',
  },
  {
    q: 'Do renovation costs vary between Durham cities?',
    a: 'Yes, but modestly. Cities closer to Toronto (Pickering, Ajax) tend to have slightly higher contractor rates than cities further east (Oshawa, Whitby, Bowmanville). Rural areas like Uxbridge and Scugog Township may have access challenges that affect cost for certain trades. The overall spread is roughly 5–10% across Durham Region cities.',
  },
  {
    q: 'How do I know if a contractor quote is fair in Durham Region?',
    a: "Get an AI estimate from QuoteXbert first. This gives you a data-driven benchmark for what your project should cost in Durham Region. If a contractor's quote is 20%+ above the estimate, ask them to itemize the costs. There may be valid reasons — or there may not be. Always get at least 2–3 quotes for any major renovation.",
  },
  {
    q: 'What renovations give the best ROI in Durham Region?',
    a: "In Durham Region's market, basement finishing typically delivers the best ROI — especially if converted to a legal rental suite, which can generate $1,500–$2,000/month in rental income. Kitchen renovations typically return 60–80% of cost on resale. Bathroom renovations return 50–70%. Exterior renovations (roofing, windows, siding) protect value rather than add it.",
  },
];

export default function DurhamRegionRenovationCostsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Renovation Costs</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <DollarSign className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">2025 Durham Region Renovation Pricing</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Durham Region<br />Renovation Costs
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              The most comprehensive guide to home renovation costs in Durham Region for 2025.
              Kitchen, bathroom, basement, deck, roofing, and more — with real local pricing data.
              <strong> Durham Region rates are 15–20% below Toronto.</strong>
            </p>

            <div className="pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
              >
                📸 Get My Free AI Estimate
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Durham vs Toronto */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Durham Region vs Toronto: Cost Comparison
          </h2>
          <p className="text-center text-gray-600 mb-8">
            How much you save by renovating in Durham Region vs. Toronto (example: $35,000 kitchen)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="text-left px-4 py-3 font-bold">City / Area</th>
                  <th className="text-center px-4 py-3 font-bold">Cost Multiplier</th>
                  <th className="text-center px-4 py-3 font-bold">Example: $35K Kitchen</th>
                </tr>
              </thead>
              <tbody>
                {durhamVsTorontoTable.map((row, i) => (
                  <tr key={row.city} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.city}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{row.multiplier}</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-700">{row.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            * Approximate figures based on median contractor quotes. Actual costs depend on scope, materials, and contractor.
          </p>
        </div>
      </section>

      {/* Renovation Cost Breakdown */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Durham Region Renovation Costs by Project Type
          </h2>
          <p className="text-center text-gray-600 mb-10">
            2025 price ranges — basic, mid-range, and high-end
          </p>
          <div className="space-y-6">
            {renovationCosts.map((item) => (
              <div key={item.type} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 text-xl mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-rose-600" />
                  {item.type}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Basic</p>
                    <p className="font-black text-gray-900 text-sm">{item.basic}</p>
                  </div>
                  <div className="text-center bg-rose-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Mid-Range</p>
                    <p className="font-black text-rose-700 text-sm">{item.midRange}</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">High-End</p>
                    <p className="font-black text-gray-900 text-sm">{item.highEnd}</p>
                  </div>
                  <div className="text-center bg-amber-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Toronto Range</p>
                    <p className="font-black text-amber-700 text-sm">{item.torontoComparison}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Factors */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            What Affects Renovation Costs in Durham Region
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Six key factors that determine your final project cost
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {costFactors.map((cf) => (
              <div key={cf.factor} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-2">{cf.factor}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{cf.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Get an Accurate Durham Region Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">
            Stop guessing. Upload photos of your project and get an AI-powered estimate calibrated to Durham Region pricing.
            Free for homeowners.
          </p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block text-lg">
            Get My Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Durham Region Renovation Cost FAQ
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'Home Renovation Durham', href: '/durham-region-home-renovation' },
              { label: 'Kitchen Renovation Bowmanville', href: '/kitchen-renovation-bowmanville' },
              { label: 'Bathroom Renovation Courtice', href: '/bathroom-renovation-courtice' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Blog: Renovation Costs Durham', href: '/blog/bathroom-renovation-cost-durham-region' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Durham Region Renovation Costs 2025',
            description: 'Complete guide to home renovation costs in Durham Region, Ontario for 2025.',
            author: { '@type': 'Organization', name: 'QuoteXbert' },
            publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
            url: 'https://www.quotexbert.com/durham-region-renovation-costs',
            dateModified: new Date().toISOString().split('T')[0],
          }),
        }}
      />
    </main>
  );
}
