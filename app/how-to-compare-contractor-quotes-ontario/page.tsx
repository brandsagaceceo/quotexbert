import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle, XCircle, AlertTriangle, FileText, DollarSign, Search } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How to Compare Contractor Quotes in Ontario | 2026 Guide',
  description:
    'How to compare renovation contractor quotes fairly in Ontario. Line-by-line quote comparison, red flags, what should be included, and how AI estimates help you negotiate.',
  keywords: [
    'how to compare contractor quotes Ontario',
    'comparing renovation quotes Ontario',
    'contractor quote red flags',
    'what should a renovation quote include',
    'how to evaluate contractor bids Ontario',
    'renovation quote comparison guide',
    'contractor quote checklist Ontario',
    'low contractor quote red flag',
    'renovation estimate vs quote Ontario',
    'how to negotiate contractor quotes Ontario',
  ],
  openGraph: {
    title: 'How to Compare Contractor Quotes in Ontario | 2026',
    description: 'Line-by-line quote comparison, red flags to spot, and how AI estimates help Ontario homeowners negotiate fairly.',
    url: 'https://www.quotexbert.com/how-to-compare-contractor-quotes-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Compare Contractor Quotes Ontario | QuoteXbert',
    description: '2026 guide to comparing renovation quotes fairly — what to look for and what to avoid.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/how-to-compare-contractor-quotes-ontario' },
};

const quoteChecklist = [
  { item: 'Full legal business name and address', required: true, why: 'Confirms they are a registered Ontario business — not a fly-by-night operator.' },
  { item: 'HST registration number', required: true, why: 'Any contractor billing over $30,000/year must be HST-registered. No HST number = cash-only operator = no paper trail.' },
  { item: 'WSIB clearance certificate number', required: true, why: 'Confirms the contractor has active workers compensation coverage. Without it, YOU may be liable if a worker is injured on your property.' },
  { item: 'Liability insurance certificate ($2M minimum)', required: true, why: 'Required to cover property damage during work. Ask for the certificate directly — not just a "yes we have insurance."' },
  { item: 'Itemized scope of work (line-by-line)', required: true, why: 'Vague quotes like "bathroom renovation — $14,000" have no enforceability. You need explicit line items for demo, waterproofing, tile, vanity, plumbing, electrical, etc.' },
  { item: 'Materials specified (brand and model)', required: true, why: 'Without material specs, a contractor can use the cheapest available product while billing for mid-range. Specify tile brand, vanity model, and waterproofing system.' },
  { item: 'Start date and completion date', required: true, why: 'Without committed dates, projects drag indefinitely. Get a realistic written schedule.' },
  { item: 'Payment schedule tied to milestones', required: true, why: 'Never pay more than 10–15% upfront. Progress payments should align with completed stages (demo done, rough-in complete, tile set, final walkthrough).' },
  { item: 'Warranty terms (labor and materials)', required: true, why: 'Ontario contractors are obligated under Consumer Protection Act to provide a reasonable warranty. 1 year on labor is standard; ask for it in writing.' },
  { item: 'Permit responsibility stated', required: false, why: 'Who is pulling the plumbing or electrical permit? If the contractor is, confirm it is included in the quoted price.' },
];

const redFlags = [
  {
    flag: 'No written quote — verbal estimate only',
    severity: 'critical',
    explanation: 'A verbal estimate is legally unenforceable. Every legitimate Ontario contractor provides a written quote. Verbal-only means no accountability.',
  },
  {
    flag: 'Quote is dramatically lower than others (30%+ below market)',
    severity: 'high',
    explanation: 'If a $15,000 project is being quoted at $9,500 by one contractor, the scope is almost certainly missing key items — waterproofing, proper subfloor prep, or permit fees. You will pay the difference in change orders.',
  },
  {
    flag: 'Large upfront payment required (50%+ deposit)',
    severity: 'critical',
    explanation: 'Ontario\'s Consumer Protection Act limits upfront deposits for residential renovation contracts. Any contractor requesting 50% or more upfront is a significant fraud risk — especially for jobs over $10,000.',
  },
  {
    flag: 'No HST on the invoice',
    severity: 'high',
    explanation: 'A contractor doing $30,000+ in revenue per year must collect and remit HST. A cash-only contractor who does not charge HST has no registered business, no WSIB, and no accountability.',
  },
  {
    flag: '"We can start tomorrow" urgency pressure',
    severity: 'medium',
    explanation: 'Good contractors are booked out 2–8 weeks in Ontario. Immediate availability sometimes indicates low demand for a reason.',
  },
  {
    flag: 'No fixed price — "cost plus" only',
    severity: 'medium',
    explanation: '"Cost plus" means the contractor charges actual materials plus a markup percentage. Without a fixed price cap, costs can balloon. Acceptable only for very complex projects where scope genuinely cannot be fixed upfront.',
  },
  {
    flag: 'Refuses to provide WSIB and insurance certificates',
    severity: 'critical',
    explanation: 'This is a non-negotiable. Any contractor who won\'t provide these documents should be immediately disqualified. If a worker is injured and there is no WSIB coverage, the homeowner can be held financially responsible.',
  },
];

const comparisonTemplate = [
  { category: 'Demolition & disposal', desc: 'Remove tile, vanity, toilet, tub. Haul and dispose.' },
  { category: 'Subfloor repair', desc: 'Replace any damaged plywood, level subfloor.' },
  { category: 'Waterproofing system', desc: 'Specify brand (Schluter KERDI / Laticrete / RedGard). This is the most important line.' },
  { category: 'Shower base', desc: 'Mortar bed vs. prefab foam tray — specify type.' },
  { category: 'Tile (floor)', desc: 'Sq footage, material spec (tile brand/model if known).' },
  { category: 'Tile (walls/surround)', desc: 'Sq footage, material spec.' },
  { category: 'Grout and setting materials', desc: 'Brand of thinset, grout, and whether modified or unmodified (matters for Schluter).' },
  { category: 'Vanity and countertop', desc: 'Model/SKU or "allowance" — get explicit.' },
  { category: 'Toilet', desc: 'Brand and model or "builder-grade standard."' },
  { category: 'Plumbing rough-in / fixtures', desc: 'What exactly is the plumber doing? New valve? New shower head install?' },
  { category: 'Electrical', desc: 'Exhaust fan swap, GFCI outlets, heated floor wiring if applicable.' },
  { category: 'Glass shower enclosure', desc: 'Frameless vs. semi-frameless — explicit model/SKU or allowance amount.' },
  { category: 'Permits', desc: 'Who pulls which permits and are they included in the quoted price?' },
  { category: 'Cleanup and protection', desc: 'Floor protection, daily cleanup, final debris removal.' },
];

const faqs = [
  {
    q: 'How many quotes should I get for a bathroom renovation in Ontario?',
    a: 'Get at least 3 quotes for any bathroom renovation over $5,000. Three quotes give you a reliable market range. With 2 quotes, you don\'t know if the cheaper one is low because of quality or because of efficiency. With 4+, the diminishing returns typically don\'t justify the scheduling time.',
  },
  {
    q: 'What is the difference between an estimate and a quote for a renovation?',
    a: 'An estimate is a rough approximation — not a committed price. A quote is a specific, itemized price that a contractor is prepared to honor. Always ask: "Is this a fixed-price quote or an estimate?" and get the answer in writing. In Ontario, "estimate" and "quote" are often used interchangeably, so clarify directly.',
  },
  {
    q: 'Should I always choose the lowest quote for a renovation?',
    a: 'No. The lowest quote is often the most expensive in the long run. Low quotes are frequently the result of missing scope items (permits, waterproofing, proper subfloor prep), which will be added as change orders once work begins. Always compare quotes line-by-line. A quote that is 20% higher but includes WSIB, insurance, proper waterproofing, and a clear payment schedule may be better value.',
  },
  {
    q: 'How does a QuoteXbert AI estimate help me compare contractor quotes?',
    a: 'A QuoteXbert AI estimate gives you a market-calibrated price range for your exact project — based on your city, project type, size, and description. When you receive contractor quotes, you can compare them to the AI estimate range. Quotes significantly above the range deserve scrutiny; quotes significantly below may have missing scope. Many homeowners show the AI estimate to contractors during the quoting process, which leads to more honest pricing.',
  },
  {
    q: 'What should I do if a contractor asks for a large deposit?',
    a: 'Under Ontario\'s Consumer Protection Act, a deposit for a residential renovation contract cannot exceed the lesser of $1,000 or 10% of the contract value for contracts over $50 (i.e., virtually all renovations). A contractor requesting 30–50% upfront is either unfamiliar with Ontario consumer law or is a fraud risk. If a contractor genuinely needs materials upfront, a reasonable compromise is paying the exact materials invoice directly to the supplier.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'How to Compare Contractor Quotes in Ontario',
  url: 'https://www.quotexbert.com/how-to-compare-contractor-quotes-ontario',
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

export default function CompareContractorQuotesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-slate-900 via-[#1e1b21] to-[#2d0008] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(128,0,32,0.15),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-300 mb-8">
            <Link href="/" className="hover:text-amber-400 transition-colors">Home</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <Link href="/guides" className="hover:text-amber-400 transition-colors">Guides</Link>
            <ArrowRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-100">Compare Contractor Quotes</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Homeowner Protection Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            How to Compare<br className="hidden md:block" /> Contractor Quotes in Ontario
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            Most Ontario homeowners compare renovation quotes on price alone. That&apos;s a mistake. This guide shows you how to compare quotes line-by-line, what must be included, and what 7 red flags look like.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              <Search className="w-5 h-5" /> Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quote Checklist */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">What Every Legitimate Ontario Contractor Quote Must Include</h2>
          <p className="text-slate-600 mb-8 text-lg">Use this checklist before signing anything. Missing items are dealbreakers or negotiation points.</p>
          <div className="space-y-3">
            {quoteChecklist.map((item, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border ${item.required ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                <CheckCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${item.required ? 'text-green-600' : 'text-slate-400'}`} />
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-bold text-slate-900">{item.item}</span>
                    {item.required && <span className="text-xs font-black bg-green-200 text-green-800 px-2 py-0.5 rounded-full">REQUIRED</span>}
                  </div>
                  <p className="text-sm text-slate-600">{item.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Red Flags */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">7 Red Flags in Contractor Quotes</h2>
          <p className="text-slate-600 mb-8 text-lg">Spot these before signing — not after.</p>
          <div className="space-y-4">
            {redFlags.map((flag, i) => (
              <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border ${flag.severity === 'critical' ? 'bg-red-50 border-red-200' : flag.severity === 'high' ? 'bg-orange-50 border-orange-200' : 'bg-amber-50 border-amber-200'}`}>
                {flag.severity === 'critical' ? <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" /> : <AlertTriangle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />}
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="font-bold text-slate-900">{flag.flag}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${flag.severity === 'critical' ? 'bg-red-200 text-red-800' : flag.severity === 'high' ? 'bg-orange-200 text-orange-800' : 'bg-amber-200 text-amber-800'}`}>
                      {flag.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{flag.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Template */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Line-by-Line Comparison Template (Bathroom Example)</h2>
          <p className="text-slate-600 mb-8 text-lg">Use this template to create a spreadsheet when comparing multiple bathroom quotes.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Line Item</th>
                  <th className="text-left p-4">What to Look For</th>
                  <th className="text-center p-4">Contractor A</th>
                  <th className="text-center p-4">Contractor B</th>
                  <th className="text-center p-4">Contractor C</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTemplate.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-medium text-slate-800">{row.category}</td>
                    <td className="p-4 text-slate-500 text-xs">{row.desc}</td>
                    <td className="p-4 text-center text-slate-300 text-xs">—</td>
                    <td className="p-4 text-center text-slate-300 text-xs">—</td>
                    <td className="p-4 text-center text-slate-300 text-xs">—</td>
                  </tr>
                ))}
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="p-4">TOTAL</td>
                  <td className="p-4 text-slate-400 text-xs">AI Estimate Benchmark</td>
                  <td className="p-4 text-center">$___</td>
                  <td className="p-4 text-center">$___</td>
                  <td className="p-4 text-center">$___</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-500 mt-3">
            <strong>Tip:</strong> Get a QuoteXbert AI estimate before filling in contractor totals. The AI range gives you a market benchmark — useful for spotting outliers.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <DollarSign className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Know the Market Rate Before You Get Any Quote</h2>
          <p className="text-lg text-rose-100 mb-8 leading-relaxed">
            A QuoteXbert AI estimate tells you what your renovation should cost in your Ontario city. Homeowners who show contractors this estimate report saving 10–15% off initial quotes — simply by knowing the number.
          </p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
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
            <Link href="/can-i-renovate-my-bathroom-for-10000-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <DollarSign className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom for $10,000?</h3>
              <p className="text-sm text-slate-500">Budget reality check for Ontario bathrooms</p>
            </Link>
            <Link href="/bathroom-renovation-permits-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <FileText className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Permits Ontario</h3>
              <p className="text-sm text-slate-500">What your contractor is responsible for including</p>
            </Link>
            <Link href="/second-opinion" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Search className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Get a Second Opinion on Your Quote</h3>
              <p className="text-sm text-slate-500">Already have a quote? Verify it with AI in 60 seconds</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
