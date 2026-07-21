import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, DollarSign, Home, CheckCircle, AlertTriangle, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Basement Suite vs Open Concept — Which Adds More Value in Ontario? | 2026',
  description:
    'Honest ROI comparison: legal basement suite vs open-concept finish in Ontario. Cost difference, rental income potential, resale value, and which is right for your home.',
  keywords: [
    'basement suite vs open concept Ontario',
    'legal basement suite ROI Ontario',
    'should I finish my basement as a suite or open concept',
    'basement apartment vs rec room ROI',
    'basement suite worth it Ontario',
    'legal suite vs recreation room Ontario',
    'basement renovation ROI Ontario 2026',
    'open concept basement vs basement apartment',
    'secondary suite ROI Ontario',
    'basement finishing options Ontario',
  ],
  openGraph: {
    title: 'Legal Suite vs Open Concept Basement — ROI Comparison Ontario 2026',
    description: 'Cost vs. value comparison: legal basement suite vs open concept finish in Ontario — for Durham Region, GTA, and beyond.',
    url: 'https://www.quotexbert.com/basement-suite-vs-open-concept-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Basement Suite vs Open Concept Ontario | QuoteXbert',
    description: 'Which basement layout adds more value in Ontario? Honest 2026 ROI comparison.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/basement-suite-vs-open-concept-ontario' },
};

const comparison = [
  {
    factor: 'Initial cost',
    suite: '$55,000 – $90,000',
    openConcept: '$25,000 – $42,000',
    winner: 'open',
    note: 'A legal suite costs $25,000–$50,000 more than an open-concept finish due to kitchen, fire separation, and separate entrance.',
  },
  {
    factor: 'Added home value',
    suite: '$60,000 – $110,000+',
    openConcept: '$30,000 – $55,000',
    winner: 'suite',
    note: 'Legal suites generate significantly more resale value in Ontario because buyers price in the income stream.',
  },
  {
    factor: 'Monthly rental income',
    suite: '$1,200 – $2,400/mo',
    openConcept: '$0',
    winner: 'suite',
    note: 'An open-concept basement generates no income. A legal suite generates $14,400–$28,800/year.',
  },
  {
    factor: 'Payback period',
    suite: '2–4 years (with rental)',
    openConcept: 'Never (no income)',
    winner: 'suite',
    note: 'At $1,600/mo rental income, a $65,000 legal suite pays back in approximately 40 months.',
  },
  {
    factor: 'Permit complexity',
    suite: 'High — building, plumbing, electrical, fire inspection',
    openConcept: 'Moderate — building + electrical',
    winner: 'open',
    note: 'Legal suites require more inspections and longer permit timelines.',
  },
  {
    factor: 'Livability for your family',
    suite: 'Low (separate unit, locked)',
    openConcept: 'High (gym, playroom, office, theater)',
    winner: 'open',
    note: 'Open-concept basements improve daily quality of life. Suites are income-producing but not livable by the homeowner.',
  },
  {
    factor: 'ROI if selling within 3 years',
    suite: '80–110% of cost (if sold quickly, income not realized)',
    openConcept: '100–140% of cost',
    winner: 'open',
    note: 'If you\'re selling soon, the income advantage of a suite is not realized. Open-concept has better short-term resale ROI.',
  },
  {
    factor: 'ROI if holding 5+ years',
    suite: '180–280% of cost (cost + rental income)',
    openConcept: '100–140% of cost',
    winner: 'suite',
    note: 'Over 5+ years, a legal suite consistently out-returns an open-concept finish by a wide margin.',
  },
];

const whoShouldChooseSuite = [
  'You plan to hold the property for 3+ years',
  'You want passive rental income to offset mortgage costs',
  'Your neighbourhood has strong rental demand (Oshawa, Mississauga, Hamilton)',
  'Your home has a walk-out or side entrance that makes a suite more natural',
  'You have family (aging parents, adult children) who might live in the suite',
  'You want to maximize resale value above all else',
];

const whoShouldChooseOpen = [
  'You have young children who will use the space (playroom, homework area)',
  'You plan to sell within 2–3 years',
  'Your neighbourhood has weaker rental demand',
  'Your basement ceiling height is under 6\'5" (legal suite minimum)',
  'Your budget is under $40,000',
  'You want to avoid complex permit processes',
  'The basement is your primary gym, entertainment, or work-from-home space',
];

const cityRentalDemand = [
  { city: 'Oshawa', demand: 'Very High', avgRent: '$1,300 – $1,700/mo', vacancyRate: '~1.2%', verdict: 'Excellent for suite' },
  { city: 'Toronto', demand: 'Very High', avgRent: '$1,800 – $2,400/mo', vacancyRate: '~1.5%', verdict: 'Excellent but high cost' },
  { city: 'Mississauga', demand: 'High', avgRent: '$1,500 – $2,000/mo', vacancyRate: '~1.8%', verdict: 'Strong for suite' },
  { city: 'Whitby / Ajax', demand: 'High', avgRent: '$1,400 – $1,800/mo', vacancyRate: '~1.4%', verdict: 'Very good for suite' },
  { city: 'Hamilton', demand: 'High', avgRent: '$1,200 – $1,600/mo', vacancyRate: '~2.1%', verdict: 'Good for suite' },
  { city: 'Barrie', demand: 'Moderate', avgRent: '$1,100 – $1,500/mo', vacancyRate: '~2.8%', verdict: 'Consider open-concept' },
];

const hybridOption = [
  'Create an open-concept main space (rec room/gym) plus one bedroom and bathroom — without a kitchen or separate entrance.',
  'This "in-law suite" configuration costs $40,000–$60,000 and can be converted to a legal suite later for $15,000–$25,000 additional.',
  'It gives you family use now and the option for rental income later.',
  'Ensure you rough-in plumbing for a future kitchen sink during construction — this costs $500–$1,000 now vs. $3,000–$5,000 to add later.',
];

const faqs = [
  {
    q: 'Is a legal basement suite worth the extra cost in Ontario?',
    a: 'If you plan to hold the property for 3+ years, yes — a legal suite is almost always worth the extra cost in Ontario. The rental income of $1,200–$2,400/month typically pays back the additional investment within 2–4 years, and the suite adds more resale value than an open-concept finish. The exception is if your neighbourhood has low rental demand or if your basement has structural limitations.',
  },
  {
    q: 'How much more does a legal suite cost than an open-concept basement?',
    a: 'In Ontario, a legal basement suite typically costs $25,000–$50,000 more than an open-concept finish of the same square footage. The premium pays for: a full kitchen or kitchenette, fire separation between floors, an egress window in the bedroom, and a separate entrance. In Durham Region, the premium is closer to $20,000–$35,000 due to lower labor costs.',
  },
  {
    q: 'What is the rental income for a basement suite in Durham Region?',
    a: 'In Durham Region (Oshawa, Whitby, Ajax, Pickering), a one-bedroom legal basement suite typically rents for $1,300–$1,700/month in 2026. A two-bedroom suite rents for $1,600–$2,000/month. Durham has one of the tightest rental markets in Canada — vacancy rates are consistently under 1.5%, making it an excellent market for basement suite investment.',
  },
  {
    q: 'Can I finish my basement as open-concept now and convert to a suite later?',
    a: 'Yes — and this is a popular strategy. If you finish the basement with framing, bathroom, and bedroom now (roughly $40,000–$55,000), you can add a kitchen and separate entrance later for $15,000–$25,000. The key is to rough-in plumbing for the future kitchen during initial construction — this costs $500–$1,000 now versus $3,000–$5,000 later.',
  },
  {
    q: 'Does a legal basement suite increase home value in Ontario?',
    a: 'Yes, significantly. In Ontario real estate, a legal secondary suite (basement apartment) adds $60,000–$110,000+ to a home\'s value, depending on the city and rental market. Buyers actively price in the income stream when purchasing homes with legal suites. A $70,000 suite investment in Oshawa typically adds $85,000–$100,000 in appraised value.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Legal Basement Suite vs Open Concept — Which Adds More Value in Ontario?',
  url: 'https://www.quotexbert.com/basement-suite-vs-open-concept-ontario',
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

export default function BasementSuiteVsOpenConceptPage() {
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
            <span className="text-slate-100">Suite vs Open Concept</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Decision Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Legal Basement Suite vs.<br className="hidden md:block" /> Open Concept — Which Adds More Value?
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            Honest 2026 ROI comparison for Ontario homeowners. We look at cost difference, rental income, resale value, and who should choose each — so you can decide with real numbers.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              <DollarSign className="w-5 h-5" /> Get My Free Basement Estimate <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Summary Verdict */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-black text-slate-900 text-lg mb-1">Open-Concept Wins If...</h3>
              <p className="text-slate-600 text-sm">You&apos;re selling within 3 years, you need the space for family use, or your budget is under $40,000.</p>
              <div className="mt-3 text-sm font-bold text-blue-800">Best ROI: Short-term / family use</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-black text-slate-900 text-lg mb-1">Legal Suite Wins If...</h3>
              <p className="text-slate-600 text-sm">You&apos;re holding 3+ years, you want rental income, or you&apos;re in a high-demand rental market (Oshawa, Whitby, Mississauga).</p>
              <div className="mt-3 text-sm font-bold text-green-800">Best ROI: Long-term / income property</div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Comparison Table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Head-to-Head Comparison</h2>
          <p className="text-slate-600 mb-8 text-lg">8-factor analysis using Ontario 2026 market data.</p>
          <div className="space-y-4">
            {comparison.map((row, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-6 py-3 flex flex-wrap items-center gap-3">
                  <span className="font-bold text-slate-900">{row.factor}</span>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-full ${row.winner === 'suite' ? 'bg-green-200 text-green-800' : row.winner === 'open' ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                    {row.winner === 'suite' ? 'Suite Wins' : row.winner === 'open' ? 'Open Wins' : 'Tie'}
                  </span>
                </div>
                <div className="px-6 py-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-green-700 font-bold mb-1">Legal Suite</div>
                    <div className="font-semibold text-slate-800">{row.suite}</div>
                  </div>
                  <div>
                    <div className="text-xs text-blue-700 font-bold mb-1">Open Concept</div>
                    <div className="font-semibold text-slate-800">{row.openConcept}</div>
                  </div>
                </div>
                <div className="px-6 pb-4 text-sm text-slate-500 italic">{row.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Should Choose What */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-10">Which Is Right for You?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-black text-green-700 text-xl mb-4">Choose a Legal Suite If...</h3>
              <ul className="space-y-3">
                {whoShouldChooseSuite.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-black text-blue-700 text-xl mb-4">Choose Open Concept If...</h3>
              <ul className="space-y-3">
                {whoShouldChooseOpen.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-blue-200">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rental Demand by City */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Rental Demand by Ontario City</h2>
          <p className="text-slate-600 mb-8 text-lg">Suite ROI depends heavily on local rental demand. Here&apos;s the 2026 picture.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityRentalDemand.map((c, i) => (
              <div key={i} className={`p-5 rounded-xl border ${c.demand === 'Very High' ? 'bg-green-50 border-green-200' : c.demand === 'High' ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{c.city}</span>
                  <span className={`text-xs font-black px-2 py-1 rounded-full ${c.demand === 'Very High' ? 'bg-green-200 text-green-800' : c.demand === 'High' ? 'bg-blue-200 text-blue-800' : 'bg-amber-200 text-amber-800'}`}>{c.demand}</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div><strong>Avg rent:</strong> {c.avgRent}</div>
                  <div><strong>Vacancy:</strong> {c.vacancyRate}</div>
                  <div className="font-semibold text-slate-800">{c.verdict}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid Option */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">The Best of Both: The Hybrid Approach</h2>
          <p className="text-slate-600 mb-8 text-lg">Many Ontario homeowners use this strategy to get flexibility without committing fully to either option.</p>
          <div className="bg-white rounded-2xl border border-amber-200 p-8 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <h3 className="font-bold text-slate-900 text-lg">Rough-In for a Suite, Finish as Open-Concept</h3>
            </div>
            <ul className="space-y-3">
              {hybridOption.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-4">Not Sure Which Is Right for Your Home?</h2>
          <p className="text-lg text-rose-100 mb-8">Get a free AI estimate for both options — QuoteXbert will give you market-calibrated pricing for your city and basement size, so you can make a data-driven decision.</p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
            Compare Both Options with AI <ArrowRight className="w-5 h-5" />
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
            <Link href="/how-much-does-it-cost-to-finish-a-basement-in-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <DollarSign className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Basement Finishing Costs Ontario</h3>
              <p className="text-sm text-slate-500">Full per-square-foot pricing by city and scope</p>
            </Link>
            <Link href="/do-i-need-permits-to-finish-my-basement-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Home className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Basement Permits in Ontario</h3>
              <p className="text-sm text-slate-500">What permits you need — by project type</p>
            </Link>
            <Link href="/basement-renovation-calculator" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Users className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Free Basement Calculator</h3>
              <p className="text-sm text-slate-500">Instant AI estimate for your basement project</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
