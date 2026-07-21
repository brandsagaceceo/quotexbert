import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, DollarSign, AlertTriangle, Lightbulb, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Can I Renovate My Bathroom for $10,000 in Ontario? | 2026 Reality Check',
  description:
    'Honest 2026 guide: what a $10,000 bathroom renovation actually gets you in Ontario. Real scope, what to skip, and how to stretch your budget with AI estimates.',
  keywords: [
    'can I renovate my bathroom for $10000',
    'bathroom renovation $10000 Ontario',
    '$10k bathroom renovation what can I get',
    'budget bathroom renovation Ontario 2026',
    'cheap bathroom renovation Toronto',
    'small bathroom renovation budget Ontario',
    'bathroom renovation under $10000 Ontario',
    'how much does a bathroom renovation cost Ontario',
    'bathroom renovation on a budget Canada',
    'affordable bathroom renovation GTA',
  ],
  openGraph: {
    title: 'Can I Renovate My Bathroom for $10,000? | Ontario 2026',
    description: 'What $10,000 actually gets you in an Ontario bathroom renovation — real scope, real prices, real contractor advice.',
    url: 'https://www.quotexbert.com/can-i-renovate-my-bathroom-for-10000-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Renovate My Bathroom for $10,000 in Ontario?',
    description: '2026 reality check — what fits in a $10k bathroom budget and what doesn\'t.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/can-i-renovate-my-bathroom-for-10000-ontario' },
};

const whatFitsAt10k = [
  {
    item: 'Full tub/shower tile surround replacement',
    cost: '$1,800 – $3,200',
    fits: true,
    note: 'Standard 3×5 ft surround, mid-range porcelain tile, Schluter waterproofing included',
  },
  {
    item: 'New vanity + countertop + sink',
    cost: '$600 – $1,800',
    fits: true,
    note: 'Freestanding or wall-mount 36–48 inch vanity, undermount sink, quartz top',
  },
  {
    item: 'New toilet',
    cost: '$250 – $600',
    fits: true,
    note: 'Comfort-height elongated, dual-flush. Toto and Kohler are the Ontario contractor standard',
  },
  {
    item: 'Tile floor (standard bathroom)',
    cost: '$800 – $1,800',
    fits: true,
    note: '12×24 porcelain in a standard 5×8 ft bathroom including Schluter-DITRA uncoupling layer',
  },
  {
    item: 'Light fixture + exhaust fan replacement',
    cost: '$300 – $700',
    fits: true,
    note: 'LED vanity bar + 80–110 CFM exhaust fan. Fan replacement requires an electrician in Ontario',
  },
  {
    item: 'Paint + accessories',
    cost: '$200 – $600',
    fits: true,
    note: 'Moisture-resistant paint, new towel bars, toilet paper holder, mirror',
  },
  {
    item: 'New frameless glass shower enclosure',
    cost: '$2,200 – $4,500',
    fits: false,
    note: 'Custom glass alone runs $1,800+ for supply only. Stretches $10k thin fast — skip or save for later',
  },
  {
    item: 'Moving plumbing walls (drain relocation)',
    cost: '$1,500 – $3,500',
    fits: false,
    note: 'Requires a licensed plumber + opening the floor. Blows the budget on a single task',
  },
  {
    item: 'Radiant heated floor (electric)',
    cost: '$800 – $2,000',
    fits: false,
    note: 'Possible in Durham Region/905 but tight. If you want it, cut elsewhere — not fixtures',
  },
  {
    item: 'Full shower-to-tub or tub-to-shower conversion',
    cost: '$3,500 – $7,000+',
    fits: false,
    note: 'Converting a tub alcove to a walk-in shower requires new framing, a mud bed or foam tray, and waterproofing — tight at $10k total',
  },
];

const budgetBreakdown = [
  { category: 'Tile (floor + walls)', low: 1800, high: 3200, percent: 28 },
  { category: 'Vanity + countertop + sink', low: 600, high: 1800, percent: 18 },
  { category: 'Labor (demo + installation)', low: 2500, high: 4000, percent: 33 },
  { category: 'Toilet', low: 250, high: 600, percent: 7 },
  { category: 'Lighting + electrical', low: 300, high: 700, percent: 7 },
  { category: 'Paint + finishes + accessories', low: 200, high: 600, percent: 7 },
];

const cityReality = [
  { city: 'Toronto (downtown core)', verdict: 'Tight', color: 'amber', note: '$10k is a cosmetic update — tile, vanity, toilet. Full gut is $14k+.' },
  { city: 'Mississauga / Brampton', verdict: 'Possible', color: 'green', note: 'Full cosmetic renovation doable at $10k with a mid-range finish level.' },
  { city: 'Durham Region (Oshawa, Whitby, Ajax)', verdict: 'Yes', color: 'green', note: 'Strong $10k budget. Full renovation of a standard 5-piece at $9,500–$12,000 is common.' },
  { city: 'Hamilton', verdict: 'Yes', color: 'green', note: 'Competitive contractor market. $10k for a full cosmetic renovation is realistic.' },
  { city: 'Ottawa', verdict: 'Possible', color: 'green', note: 'Similar to Mississauga. $10k gets a solid standard renovation.' },
  { city: 'Vaughan / Richmond Hill', verdict: 'Tight', color: 'amber', note: 'Expect $12k–$15k for comparable work to what Durham contractors do at $10k.' },
];

const stretchTips = [
  {
    title: 'Keep the toilet where it is',
    savings: 'Saves $1,500 – $3,500',
    desc: 'Never move the toilet drain unless structurally required. Plumbers charge $150–$200/hr and a drain relocation requires opening the subfloor.',
  },
  {
    title: 'Reuse your existing tub if it is in good condition',
    savings: 'Saves $800 – $2,500',
    desc: 'A refinished or reglazed tub costs $400–$600 and can add 10+ years of life. Only replace if the tub is chipped, cracked, or structurally compromised.',
  },
  {
    title: 'Choose large-format tile over mosaics',
    savings: 'Saves $400 – $1,200 in labor',
    desc: 'Setting 12×24 porcelain tile is 40% faster than mosaic tile. Material cost is similar but labor is far less. Large format also looks more modern.',
  },
  {
    title: 'Stock vanities over custom millwork',
    savings: 'Saves $800 – $3,000',
    desc: 'IKEA GODMORGON, VIGO, and Kohler Reach stock vanities all look premium at $400–$900. Custom millwork starts at $1,500 for a basic box and is rarely worth it at this budget.',
  },
  {
    title: 'Get 3 quotes with an AI estimate baseline',
    savings: 'Saves $500 – $2,000',
    desc: 'Homeowners who get an AI estimate first and show it to contractors during quoting typically save 10–15% off initial quotes. Contractors quote more honestly when you already know the market rate.',
  },
];

const faqs = [
  {
    q: 'Can I renovate my bathroom for $10,000 in Ontario in 2026?',
    a: "Yes — but it depends on your city and scope. In Durham Region (Oshawa, Whitby, Ajax), a full cosmetic bathroom renovation (tile floor, tub surround, vanity, toilet, lighting, accessories) regularly completes at $9,500–$12,000. In Toronto's 416 area, $10,000 is tight and typically covers a cosmetic update rather than a full gut. The key is not moving plumbing and reusing the existing tub if possible.",
  },
  {
    q: 'What can I realistically get for $10,000 in a bathroom renovation?',
    a: 'At $10,000 in Ontario (outside Toronto core), you can typically get: new tile floor, new tub/shower tile surround with proper waterproofing (Schluter KERDI), new vanity and countertop, new toilet, updated lighting and exhaust fan, fresh paint, and new accessories. You cannot typically get: a custom frameless glass shower, moved plumbing, or heated floors without cutting elsewhere.',
  },
  {
    q: 'What is the cheapest part of a bathroom renovation to skip?',
    a: "The single biggest way to stretch a bathroom budget is to NOT move the toilet or shower drain. Plumbing drain relocation costs $1,500–$3,500 for a straightforward move and can quickly eat your entire labor budget. The second biggest saving is reusing your existing bathtub (reglazing costs $400–$600 vs. $900–$2,000 for a new tub, plus labor).",
  },
  {
    q: 'How do I know if a contractor quote is fair for a $10,000 bathroom?',
    a: "Get a QuoteXbert AI estimate for your project before calling contractors. The AI estimate gives you a market-calibrated range based on your project type, city, and description. When you have that baseline, you can compare quotes meaningfully. Quotes that are 20% above the AI estimate deserve scrutiny; quotes 20% below may cut corners.",
  },
  {
    q: 'Is $10,000 enough for a master en-suite renovation?',
    a: "Typically not for a full renovation. Master en-suite renovations in Ontario average $17,000–$30,000 due to their larger size, the expectation of premium materials (heated floors, frameless glass, large-format tile, double vanity), and more complex plumbing. A $10,000 budget for an en-suite is enough for a cosmetic refresh — new tile, vanity, and fixtures — but not a full gut renovation.",
  },
  {
    q: 'Should I finance my bathroom renovation or save up?',
    a: "For a $10,000 renovation, many Ontario homeowners use their HELOC (Home Equity Line of Credit) at prime + 0.5–1%, which costs approximately $40–$55/month in interest for a 12-month payback. If you don't have a HELOC, unsecured renovation loans from credit unions (Meridian, FirstOntario) or through the contractor's financing partner typically run 6–12% annually. See our bathroom renovation financing guide for Ontario options.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Can I Renovate My Bathroom for $10,000 in Ontario?',
  description: 'Honest 2026 guide on what a $10,000 bathroom renovation actually buys you in Ontario — by city, scope, and smart budgeting tips.',
  url: 'https://www.quotexbert.com/can-i-renovate-my-bathroom-for-10000-ontario',
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

export default function BathroomRenovation10kPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400 transition-colors">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100">Bathroom Renovation Budget</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Budget Reality Check · 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Can I Renovate My Bathroom<br className="hidden md:block" /> for $10,000 in Ontario?
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            Short answer: <strong>yes, in most Ontario cities outside of Toronto core</strong> — but only if you understand exactly what fits and what doesn&apos;t. This guide tells you the truth.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/create-lead"
              className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg"
            >
              <Calculator className="w-5 h-5" /> Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/bathroom-renovation-calculator"
              className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
            >
              Use Bathroom Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Verdict Banner */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-green-700 mb-1">YES</div>
              <div className="text-sm font-bold text-green-800">Durham / Hamilton / Ottawa</div>
              <div className="text-xs text-green-700 mt-1">Full cosmetic renovation fits at $9,500–$12,000</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-amber-700 mb-1">TIGHT</div>
              <div className="text-sm font-bold text-amber-800">Mississauga / Brampton / Ottawa</div>
              <div className="text-xs text-amber-700 mt-1">Possible with careful scope — keep plumbing in place</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <div className="text-3xl font-black text-red-700 mb-1">STRETCH</div>
              <div className="text-sm font-bold text-red-800">Toronto 416 / Vaughan / Richmond Hill</div>
              <div className="text-xs text-red-700 mt-1">$10k = cosmetic update only. Full gut is $14k+</div>
            </div>
          </div>
        </div>
      </section>

      {/* What Fits / Doesn't Fit */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">What Fits in a $10,000 Bathroom Budget</h2>
          <p className="text-slate-600 mb-10 text-lg">Prices based on Ontario contractor rates, mid-range materials, July 2026.</p>
          <div className="space-y-3">
            {whatFitsAt10k.map((item) => (
              <div
                key={item.item}
                className={`flex items-start gap-4 p-5 rounded-xl border ${item.fits ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
              >
                {item.fits
                  ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  : <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-bold text-slate-900">{item.item}</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${item.fits ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {item.cost}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Budget Breakdown */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">How $10,000 Gets Spent</h2>
          <p className="text-slate-600 mb-10 text-lg">A realistic budget allocation for a standard Ontario bathroom renovation.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4 font-bold">Category</th>
                  <th className="text-right p-4 font-bold">Low</th>
                  <th className="text-right p-4 font-bold">High</th>
                  <th className="text-right p-4 font-bold">Share</th>
                </tr>
              </thead>
              <tbody>
                {budgetBreakdown.map((row, i) => (
                  <tr key={row.category} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium text-slate-800">{row.category}</td>
                    <td className="p-4 text-right text-slate-600">${row.low.toLocaleString()}</td>
                    <td className="p-4 text-right text-slate-600">${row.high.toLocaleString()}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-2 bg-[#800020] rounded-full" style={{ width: `${row.percent}%` }} />
                        </div>
                        <span className="text-sm text-slate-600 font-medium w-8 text-right">{row.percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="p-4">Total</td>
                  <td className="p-4 text-right">$5,650</td>
                  <td className="p-4 text-right">$10,700</td>
                  <td className="p-4 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-3">* Labor (33% share) assumes 1 general contractor coordinating tile, vanity, toilet, and lighting. Plumber for toilet only, electrician for fan only.</p>
        </div>
      </section>

      {/* By City */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">$10,000 Bathroom Budget by Ontario City</h2>
          <p className="text-slate-600 mb-10 text-lg">Labor rates vary significantly across Ontario — here&apos;s the honest picture.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityReality.map((c) => (
              <div key={c.city} className={`p-5 rounded-xl border ${c.color === 'green' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{c.city}</span>
                  <span className={`text-xs font-black uppercase px-2 py-1 rounded-full ${c.color === 'green' ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                    {c.verdict}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{c.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Stretch */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">5 Ways to Make $10,000 Go Further</h2>
          <p className="text-slate-600 mb-10 text-lg">Verified money-saving tactics used by Ontario bathroom contractors.</p>
          <div className="space-y-4">
            {stretchTips.map((tip, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#800020] text-white font-black flex items-center justify-center flex-shrink-0 text-lg">
                  {i + 1}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="font-bold text-slate-900">{tip.title}</h3>
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{tip.savings}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Estimate CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Lightbulb className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Get Your Free AI Estimate Before Calling Contractors</h2>
          <p className="text-lg text-rose-100 mb-8 leading-relaxed">
            QuoteXbert&apos;s AI estimates your specific bathroom project — size, city, finish level — and gives you a market-calibrated price range in seconds. Homeowners who bring this estimate to contractors save an average of 10–15% off initial quotes.
          </p>
          <Link
            href="/create-lead"
            className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg"
          >
            Get My Free Bathroom Estimate <ArrowRight className="w-5 h-5" />
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
          <h2 className="text-2xl font-black text-slate-900 mb-8">Related Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/bathroom-renovation-financing-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <DollarSign className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Renovation Financing Ontario</h3>
              <p className="text-sm text-slate-500">HELOC, loans, and payment plans for Ontario homeowners</p>
            </Link>
            <Link href="/bathroom-renovation-permits-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <AlertTriangle className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Do I Need a Permit for My Bathroom Renovation?</h3>
              <p className="text-sm text-slate-500">Ontario permit rules by project type and municipality</p>
            </Link>
            <Link href="/bathroom-renovation-calculator" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Calculator className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Free Bathroom Renovation Calculator</h3>
              <p className="text-sm text-slate-500">Instant estimate by bathroom type, city, and finish level</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
