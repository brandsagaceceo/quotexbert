import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, DollarSign, TrendingUp, Calculator, Layers, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Much Does It Cost to Finish a Basement in Ontario? | 2026 Guide',
  description:
    'Real 2026 basement finishing costs per square foot in Ontario. Open-concept, with bathroom, legal suite — all project types, all major cities, full cost breakdowns.',
  keywords: [
    'how much does it cost to finish a basement in Ontario',
    'basement finishing cost per square foot Ontario',
    'basement renovation cost Ontario 2026',
    'finish basement cost Ontario',
    'basement finishing cost Toronto',
    'basement finishing cost Durham Region',
    'basement renovation price per square foot Ontario',
    'how much to finish a basement Canada',
    'basement finishing cost breakdown Ontario',
    'legal basement suite cost Ontario',
  ],
  openGraph: {
    title: 'Basement Finishing Cost in Ontario 2026 | Per Square Foot Guide',
    description: 'Real Ontario basement finishing costs — open concept, with bathroom, legal suite. All cities, all project types.',
    url: 'https://www.quotexbert.com/how-much-does-it-cost-to-finish-a-basement-in-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basement Finishing Cost Ontario 2026 | QuoteXbert',
    description: 'How much does it cost to finish a basement in Ontario? Real 2026 per-square-foot pricing.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/how-much-does-it-cost-to-finish-a-basement-in-ontario' },
};

const scopeTiers = [
  {
    name: 'Basic Open-Concept Finish',
    range: '$25,000 – $42,000',
    perSqFt: '$55 – $85/sq ft',
    includes: [
      'Stud walls and framing',
      'Batt insulation (walls and ceiling)',
      'Drywall, tape, and finish',
      'Pot lights throughout',
      'LVP flooring (entire space)',
      'Paint (2 coats)',
      'Basic electrical (panel connection, circuits, outlets)',
      'HVAC extension (ductwork, registers)',
    ],
    notIncludes: ['Bathroom', 'Bedroom walls', 'Wet bar', 'Permits'],
    bestFor: 'Rec room, gym, home office, playroom',
    color: 'blue',
  },
  {
    name: 'With Bedroom & 3-Piece Bathroom',
    range: '$38,000 – $62,000',
    perSqFt: '$80 – $115/sq ft',
    includes: [
      'Everything in Basic Open-Concept',
      'One enclosed bedroom with closet',
      'Full 3-piece bathroom (toilet, shower, vanity)',
      'Plumbing rough-in and fixtures',
      'Egress window in bedroom (if required)',
      'Bathroom tile and waterproofing',
    ],
    notIncludes: ['Kitchen/kitchenette', 'Separate entrance', 'Second bedroom'],
    bestFor: 'In-law suite, teenage retreat, home gym + bathroom',
    color: 'amber',
  },
  {
    name: 'Full Legal Secondary Suite',
    range: '$55,000 – $90,000+',
    perSqFt: '$110 – $175/sq ft',
    includes: [
      'Everything above',
      'Full kitchen or kitchenette',
      'Separate entrance (interior staircase or exterior door)',
      'Soundproofing between floors',
      'Fire separation (fireproofed ceiling/walls)',
      'Dedicated electrical panel or sub-panel',
      'Smoke and CO detectors per code',
      'Egress windows in all bedrooms',
    ],
    notIncludes: ['Furniture', 'Appliances (unless specified)'],
    bestFor: 'Rental income — $1,400–$2,200/month in GTA/Durham',
    color: 'green',
  },
];

const cityCosts = [
  { city: 'Toronto (downtown 416)', openConcept: '$38,000 – $55,000', withBath: '$55,000 – $80,000', legalSuite: '$75,000 – $110,000+', note: 'Premium labor market. Permit processing slowest.' },
  { city: 'Mississauga / Brampton', openConcept: '$30,000 – $48,000', withBath: '$45,000 – $68,000', legalSuite: '$62,000 – $90,000', note: 'Slightly below Toronto core. High demand area.' },
  { city: 'Durham Region (Oshawa, Whitby, Ajax)', openConcept: '$25,000 – $40,000', withBath: '$38,000 – $58,000', legalSuite: '$52,000 – $80,000', note: 'Best value in the GTA. 15–20% below Toronto.' },
  { city: 'Hamilton', openConcept: '$24,000 – $38,000', withBath: '$36,000 – $55,000', legalSuite: '$50,000 – $76,000', note: 'Competitive contractor market. Good value.' },
  { city: 'Vaughan / Richmond Hill', openConcept: '$32,000 – $50,000', withBath: '$48,000 – $72,000', legalSuite: '$65,000 – $95,000', note: 'Premium York Region labor rates.' },
  { city: 'Ottawa', openConcept: '$27,000 – $44,000', withBath: '$42,000 – $62,000', legalSuite: '$57,000 – $84,000', note: 'Mid-range market. Strong secondary suite demand.' },
];

const costBreakdown = [
  { category: 'Framing & insulation', low: 3500, high: 7000, percent: 14 },
  { category: 'Drywall & finishing', low: 4000, high: 8500, percent: 17 },
  { category: 'Electrical (circuits, pot lights, panel)', low: 3500, high: 7000, percent: 14 },
  { category: 'Flooring (LVP or carpet)', low: 3000, high: 6500, percent: 13 },
  { category: 'HVAC extension', low: 2000, high: 4500, percent: 9 },
  { category: 'Paint & finishing', low: 1200, high: 2500, percent: 5 },
  { category: 'Bathroom (if included)', low: 6000, high: 14000, percent: 20 },
  { category: 'Permits & inspections', low: 800, high: 2500, percent: 5 },
  { category: 'Contingency (recommended 15%)', low: 3000, high: 8000, percent: 13 },
];

const roiData = [
  { city: 'Oshawa', avgCost: '$35,000', valueAdded: '$42,000 – $60,000', rentalIncome: '$1,200–$1,600/mo', roi: '120–170%' },
  { city: 'Toronto', avgCost: '$55,000', valueAdded: '$65,000 – $90,000', rentalIncome: '$1,800–$2,400/mo', roi: '118–164%' },
  { city: 'Mississauga', avgCost: '$42,000', valueAdded: '$50,000 – $72,000', rentalIncome: '$1,500–$2,000/mo', roi: '119–171%' },
  { city: 'Hamilton', avgCost: '$30,000', valueAdded: '$36,000 – $52,000', rentalIncome: '$1,100–$1,500/mo', roi: '120–173%' },
];

const faqs = [
  {
    q: 'How much does it cost to finish a basement in Ontario per square foot?',
    a: 'In Ontario (2026), basement finishing costs $55–$175 per square foot depending on scope and city. A basic open-concept finish runs $55–$85/sq ft. Adding a bathroom brings it to $80–$115/sq ft. A full legal secondary suite with kitchen and separate entrance costs $110–$175/sq ft. Durham Region is consistently 15–20% less expensive than Toronto.',
  },
  {
    q: 'How much does a legal basement suite cost in Ontario?',
    a: 'A full legal secondary suite (basement apartment) in Ontario costs $55,000–$90,000 depending on city, existing conditions, and finishes. This includes fire separation, a full kitchen, 3-piece bathroom, egress windows, dedicated electrical, and all required permits. In Toronto, expect $75,000–$110,000+. In Durham Region, $52,000–$80,000 is typical.',
  },
  {
    q: 'What is the cheapest way to finish a basement in Ontario?',
    a: 'The most cost-effective basement finishing focuses on an open-concept layout (no bedroom walls), LVP flooring instead of hardwood, pot lights instead of pendants or sconces, and a builder-grade bathroom if one is needed. Keeping the plumbing stack in its existing location saves $2,000–$4,000. In Durham Region, an efficient open-concept finish can be completed for $25,000–$30,000.',
  },
  {
    q: 'Does finishing a basement add value in Ontario?',
    a: "Yes — consistently. In Ontario, a finished basement typically returns 120–170% of cost in added home value, making it one of the highest-ROI renovations available. A legal rental suite is even stronger: generating $1,200–$2,400/month in rental income while also increasing resale value. The ROI is highest in markets with tight rental inventory (Oshawa, Mississauga, Hamilton).",
  },
  {
    q: 'How long does it take to finish a basement in Ontario?',
    a: 'Construction on a standard basement finish takes 6–10 weeks. A legal secondary suite takes 10–16 weeks. Add 4–8 weeks for permit approval before construction begins. Total project timeline from first meeting to occupancy is typically 3–5 months for a standard finish, 4–6 months for a legal suite.',
  },
  {
    q: 'What permits do I need to finish my basement in Ontario?',
    a: 'Most basement finishing work in Ontario requires a building permit from your municipality, plus electrical and plumbing permits from licensed tradespeople. A legal secondary suite always requires a building permit. Even an open-concept finish with bathroom typically requires permits. See our complete basement permit guide for Ontario rules by project type.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How Much Does It Cost to Finish a Basement in Ontario?',
  url: 'https://www.quotexbert.com/how-much-does-it-cost-to-finish-a-basement-in-ontario',
  publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  },
};

export default function BasementFinishingCostOntarioPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100">Basement Finishing Cost</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Basement Cost Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            How Much Does It Cost to<br className="hidden md:block" /> Finish a Basement in Ontario?
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            Real 2026 pricing for every scope — open-concept, with bathroom, legal suite. Every major Ontario city. Per-square-foot rates, full cost breakdowns, and ROI data.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              <Calculator className="w-5 h-5" /> Get My Free Basement Estimate <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/basement-renovation-calculator" className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">
              Basement Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Numbers */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Open-concept finish', value: '$25K – $42K', sub: 'Durham Region' },
              { label: 'With bathroom', value: '$38K – $62K', sub: 'Province average' },
              { label: 'Legal suite', value: '$55K – $90K+', sub: 'Province average' },
              { label: 'Per square foot', value: '$55 – $175', sub: 'Depends on scope + city' },
            ].map((s, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-4 text-center border border-slate-200">
                <div className="text-xl font-black text-[#800020]">{s.value}</div>
                <div className="text-xs font-bold text-slate-700 mt-1">{s.label}</div>
                <div className="text-xs text-slate-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">3 Types of Basement Finish — Costs & What&apos;s Included</h2>
          <p className="text-slate-600 mb-10 text-lg">Ontario province average. July 2026.</p>
          <div className="space-y-6">
            {scopeTiers.map((tier, i) => (
              <div key={i} className={`rounded-2xl border-2 overflow-hidden ${tier.color === 'green' ? 'border-green-200' : tier.color === 'amber' ? 'border-amber-200' : 'border-blue-200'}`}>
                <div className={`px-6 py-5 flex flex-wrap items-center justify-between gap-3 ${tier.color === 'green' ? 'bg-green-50' : tier.color === 'amber' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                  <div>
                    <h3 className="font-black text-slate-900 text-xl">{tier.name}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Best for: {tier.bestFor}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-[#800020]">{tier.range}</div>
                    <div className="text-sm text-slate-500">{tier.perSqFt}</div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs font-bold text-green-700 uppercase mb-2">Included</div>
                    <ul className="space-y-1">
                      {tier.includes.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-red-600 uppercase mb-2">Not Included</div>
                    <ul className="space-y-1">
                      {tier.notIncludes.map((item, j) => (
                        <li key={j} className="text-sm text-slate-500 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">—</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost by City */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Basement Finishing Cost by Ontario City</h2>
          <p className="text-slate-600 mb-8 text-lg">Labor rates vary significantly. Durham Region is consistently the best value in the GTA.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">City</th>
                  <th className="text-right p-4">Open-Concept</th>
                  <th className="text-right p-4">With Bath</th>
                  <th className="text-right p-4">Legal Suite</th>
                </tr>
              </thead>
              <tbody>
                {cityCosts.map((c, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4">
                      <div className="font-medium">{c.city}</div>
                      <div className="text-xs text-slate-400">{c.note}</div>
                    </td>
                    <td className="p-4 text-right font-medium">{c.openConcept}</td>
                    <td className="p-4 text-right font-medium">{c.withBath}</td>
                    <td className="p-4 text-right font-bold text-[#800020]">{c.legalSuite}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Where the Money Goes</h2>
          <p className="text-slate-600 mb-8 text-lg">Cost breakdown for a typical $45,000 basement with bathroom.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Category</th>
                  <th className="text-right p-4">Low</th>
                  <th className="text-right p-4">High</th>
                  <th className="text-right p-4">Share</th>
                </tr>
              </thead>
              <tbody>
                {costBreakdown.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium">{row.category}</td>
                    <td className="p-4 text-right text-slate-600">${row.low.toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-600">${row.high.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-2 bg-[#800020] rounded-full" style={{ width: `${row.percent}%` }} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 w-8 text-right">{row.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Return on Investment by City</h2>
          <p className="text-slate-600 mb-8 text-lg">Finishing a basement is consistently one of the best ROI renovations in Ontario.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {roiData.map((r, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">{r.city}</h3>
                  <span className="text-xl font-black text-green-700">{r.roi} ROI</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Avg. project cost</span><span className="font-medium">{r.avgCost}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Value added to home</span><span className="font-medium text-green-700">{r.valueAdded}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Rental income (legal suite)</span><span className="font-medium text-blue-700">{r.rentalIncome}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Get a Free AI Estimate for Your Basement</h2>
          <p className="text-lg text-rose-100 mb-8">Tell QuoteXbert about your basement — size, city, scope — and get a market-calibrated estimate in seconds. Then get matched with verified local contractors.</p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Get My Free Basement Estimate <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-slate-200 pb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{faq.q}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-14 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Complete Basement Renovation Series</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/do-i-need-permits-to-finish-my-basement-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Home className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Do I Need Permits to Finish My Basement?</h3>
              <p className="text-sm text-slate-500">Ontario permit rules by project type and municipality</p>
            </Link>
            <Link href="/basement-suite-vs-open-concept-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Layers className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Legal Suite vs. Open Concept — Which Adds More Value?</h3>
              <p className="text-sm text-slate-500">ROI comparison for Ontario homeowners</p>
            </Link>
            <Link href="/basement-renovation-calculator" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <DollarSign className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Free Basement Renovation Calculator</h3>
              <p className="text-sm text-slate-500">Instant estimate by scope, size, and city</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
