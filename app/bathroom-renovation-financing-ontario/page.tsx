import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, DollarSign, CheckCircle, AlertTriangle, TrendingUp, CreditCard, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation Financing Ontario 2026 | HELOC, Loans & Payment Plans',
  description:
    'Complete guide to financing a bathroom renovation in Ontario. Compare HELOCs, home renovation loans, credit union options, and contractor payment plans. 2026 rates included.',
  keywords: [
    'bathroom renovation financing Ontario',
    'bathroom renovation loan Ontario',
    'HELOC bathroom renovation Canada',
    'how to finance a bathroom renovation Ontario',
    'renovation loan Ontario 2026',
    'bathroom renovation payment plan Ontario',
    'home improvement loan Ontario',
    'bathroom renovation financing options Canada',
    'credit union renovation loan Ontario',
    'bathroom reno financing GTA',
  ],
  openGraph: {
    title: 'Bathroom Renovation Financing Ontario 2026 | QuoteXbert',
    description: 'Compare HELOCs, renovation loans, and contractor payment plans for Ontario bathroom renovations.',
    url: 'https://www.quotexbert.com/bathroom-renovation-financing-ontario',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bathroom Renovation Financing Ontario | QuoteXbert',
    description: 'HELOC vs loan vs contractor payment plan — honest 2026 comparison for Ontario homeowners.',
  },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-financing-ontario' },
};

const financingOptions = [
  {
    name: 'HELOC (Home Equity Line of Credit)',
    rate: 'Prime + 0.5% – 1.0%',
    rateNote: '~6.2% – 6.7% as of July 2026 (BoC prime = 5.7%)',
    bestFor: 'Homeowners with 20%+ equity and an existing mortgage',
    pros: [
      'Lowest available interest rate for most homeowners',
      'Interest-only minimum payments (helpful for cash flow)',
      'Reusable credit — pay down, draw again for future projects',
      'No fixed end date — flexible repayment',
    ],
    cons: [
      'Requires 20%+ home equity and a credit check',
      'Variable rate — rises if Bank of Canada raises prime',
      'Takes 2–6 weeks to set up if you don\'t have one already',
      'Using home equity means your home is collateral',
    ],
    verdict: 'Best choice if you already have a HELOC or have time to set one up. Lowest cost by far.',
    color: 'green',
  },
  {
    name: 'Unsecured Home Renovation Loan',
    rate: '6.99% – 14.99%',
    rateNote: 'Best rates from credit unions; banks run 9–14% typically',
    bestFor: 'Homeowners who don\'t have a HELOC and need fast approval',
    pros: [
      'No home equity required',
      'Fast approval — 1–5 business days',
      'Fixed rate — predictable monthly payments',
      'Doesn\'t use your home as collateral',
    ],
    cons: [
      'Significantly higher rates than a HELOC',
      'Fixed repayment term (typically 2–7 years)',
      'Loan amount capped around $35,000–$50,000 for most lenders',
    ],
    verdict: 'Good choice for mid-range projects ($8k–$25k) when you want speed and predictable payments.',
    color: 'blue',
  },
  {
    name: 'Ontario Credit Union (Meridian, FirstOntario, Libro)',
    rate: '5.99% – 9.99%',
    rateNote: 'Typically 1–4% lower than chartered bank renovation loans',
    bestFor: 'Ontario residents who want better rates than Big 5 banks',
    pros: [
      'Better rates than Big 5 banks on unsecured loans',
      'Member-focused service — more flexible underwriting',
      'Some offer renovation-specific loan products',
      'Meridian and FirstOntario are strong in GTA and Durham Region',
    ],
    cons: [
      'Must become a member (usually free)',
      'In-branch or regional only — no national branches',
      'Slightly slower approval than online lenders',
    ],
    verdict: 'Excellent alternative to big banks — worth a quote from Meridian or FirstOntario before your bank.',
    color: 'blue',
  },
  {
    name: 'Contractor Payment Plan',
    rate: '0% – 29.99% (varies widely)',
    rateNote: 'Promotional 0% plans exist but often require approved credit',
    bestFor: 'Homeowners who want a single-source solution',
    pros: [
      'Convenient — handled during the contracting process',
      'Some contractors offer true 0% for 12–18 months',
      'No separate bank application',
    ],
    cons: [
      'Often financed through third-party lenders at high rates (19–29%)',
      'Read the fine print — deferred interest is common',
      '"Same as cash" plans often have large lump-sum balloon payments',
      'Ties financing to a specific contractor',
    ],
    verdict: 'Acceptable only if it is a genuine 0% plan with no deferred interest. Always read the contract.',
    color: 'amber',
  },
  {
    name: 'Canada Greener Homes Grant (if applicable)',
    rate: 'Free grant — up to $5,600',
    rateNote: 'Requires EnerGuide assessment and energy-efficient upgrades',
    bestFor: 'Bathroom projects that include heat pump, ventilation, or insulation work',
    pros: [
      'Free money — not a loan',
      'Up to $5,600 in grants available for qualifying upgrades',
      'Greener Homes Loan (up to $40,000 at 0% interest) also available',
    ],
    cons: [
      'Only applies to energy-efficiency components (not cosmetic tile/vanity)',
      'Requires a pre- and post-renovation EnerGuide assessment ($300–$600)',
      'Application takes 6–12 weeks for approval',
    ],
    verdict: 'Worth checking if your bathroom project includes ventilation, insulation, or HVAC upgrades.',
    color: 'green',
  },
];

const monthlyPaymentTable = [
  { amount: 8000, heloc: 44, unsecured: 156, creditUnion: 131 },
  { amount: 12000, heloc: 66, unsecured: 234, creditUnion: 196 },
  { amount: 18000, heloc: 99, unsecured: 352, creditUnion: 295 },
  { amount: 25000, heloc: 138, unsecured: 488, creditUnion: 409 },
];

const mistakes = [
  {
    mistake: 'Using a high-interest credit card as "temporary" financing',
    why: 'A $15,000 bathroom renovation on a 19.99% credit card costs $3,000/year in interest if not paid off quickly. This is 5–10x more than a HELOC on the same amount.',
  },
  {
    mistake: 'Not getting an AI estimate before applying for financing',
    why: "Homeowners who don't know the market rate often overborrow. Getting a QuoteXbert estimate first means you're applying for exactly what the project should cost — not 30% more.",
  },
  {
    mistake: 'Accepting contractor financing without comparing alternatives',
    why: 'Contractor-arranged financing frequently runs 19–28% APR through third-party consumer lenders (GreenSky, Financeit). Your bank\'s unsecured renovation loan at 8–10% is almost always cheaper.',
  },
  {
    mistake: 'Underestimating the project and borrowing too little',
    why: 'The most expensive renovation cost is stopping mid-project. Budget 15% contingency on top of your quote. A $12,000 project should have $1,800 in contingency built into the loan.',
  },
];

const faqs = [
  {
    q: 'What is the best way to finance a bathroom renovation in Ontario?',
    a: 'For most Ontario homeowners with equity, a HELOC (Home Equity Line of Credit) is the lowest-cost financing at prime + 0.5–1% (approximately 6.2–6.7% as of July 2026). If you don\'t have a HELOC, a credit union renovation loan (Meridian, FirstOntario) typically offers 5.99–9.99%, which is better than the Big 5 banks\' standard renovation loan rates.',
  },
  {
    q: 'How much can I borrow for a bathroom renovation in Ontario?',
    a: 'A HELOC allows you to borrow up to 65% of your home\'s value (minus your outstanding mortgage balance). On a $700,000 home with a $400,000 mortgage, your maximum HELOC is approximately $55,000. Unsecured renovation loans typically cap at $25,000–$50,000 depending on your income and credit score.',
  },
  {
    q: 'Are there any government grants for bathroom renovations in Ontario?',
    a: 'The Canada Greener Homes Grant can provide up to $5,600 for eligible energy-efficiency upgrades — but these must be energy-related components (improved ventilation, insulation, heat pump). Purely cosmetic bathroom work (tile, vanity, fixtures) does not qualify. If your bathroom project includes a new ventilation system or exterior wall insulation, it is worth applying.',
  },
  {
    q: 'Is contractor financing a good idea for a bathroom renovation?',
    a: 'It depends entirely on the specific plan. Some contractors partner with lenders offering genuine 0% for 12–18 months (ideal if you can pay it off within the promo period). However, most contractor-arranged financing runs 19–28% APR through consumer lending platforms — significantly worse than a HELOC or credit union loan. Always ask for the exact APR before agreeing.',
  },
  {
    q: 'How long does it take to get approved for a renovation loan in Ontario?',
    a: 'Credit union and online lender unsecured renovation loans typically approve in 1–5 business days. A HELOC takes 2–6 weeks to set up (home appraisal required if you don\'t already have one). If your project is starting in 3+ weeks, explore a HELOC first. If you need funds in a few days, an unsecured loan from Meridian or EQ Bank is faster.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Bathroom Renovation Financing Ontario 2026',
  url: 'https://www.quotexbert.com/bathroom-renovation-financing-ontario',
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

export default function BathroomFinancingPage() {
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
            <span className="text-slate-100">Bathroom Renovation Financing</span>
          </nav>
          <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full mb-4">
            Financing Guide · Ontario 2026
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-tight text-white mb-6">
            Bathroom Renovation<br className="hidden md:block" /> Financing Ontario
          </h1>
          <p className="text-xl text-slate-200 leading-relaxed max-w-3xl mb-8">
            HELOC, renovation loans, credit union options, and contractor payment plans — compared honestly with 2026 rates. Know your cheapest option before you call a contractor.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-[#990024] transition-all text-lg">
              <DollarSign className="w-5 h-5" /> Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/bathroom-renovation-calculator" className="inline-flex items-center gap-2 bg-slate-800 text-white font-semibold px-6 py-4 rounded-xl border border-slate-700 hover:bg-slate-700 transition-all">
              Calculate Bathroom Cost
            </Link>
          </div>
        </div>
      </section>

      {/* Options */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">5 Ways to Finance Your Bathroom Renovation</h2>
          <p className="text-slate-600 mb-10 text-lg">Ranked by typical total cost to the homeowner, lowest to highest.</p>
          <div className="space-y-6">
            {financingOptions.map((opt, i) => (
              <div key={i} className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden ${opt.color === 'green' ? 'border-green-200' : opt.color === 'amber' ? 'border-amber-200' : 'border-blue-200'}`}>
                <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-3 ${opt.color === 'green' ? 'bg-green-50' : opt.color === 'amber' ? 'bg-amber-50' : 'bg-blue-50'}`}>
                  <div>
                    <span className="font-black text-slate-900 text-lg">{opt.name}</span>
                    <div className="text-sm text-slate-600 mt-0.5">{opt.rateNote}</div>
                  </div>
                  <span className={`text-sm font-black px-3 py-1 rounded-full ${opt.color === 'green' ? 'bg-green-200 text-green-800' : opt.color === 'amber' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}>
                    {opt.rate}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-4"><strong>Best for:</strong> {opt.bestFor}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs font-bold text-green-700 uppercase mb-2">Pros</div>
                      <ul className="space-y-1">
                        {opt.pros.map((p, j) => <li key={j} className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-red-600 uppercase mb-2">Cons</div>
                      <ul className="space-y-1">
                        {opt.cons.map((c, j) => <li key={j} className="flex items-start gap-2 text-sm text-slate-700"><AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />{c}</li>)}
                      </ul>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg text-sm font-medium ${opt.color === 'green' ? 'bg-green-100 text-green-800' : opt.color === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    <strong>Verdict:</strong> {opt.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monthly Payment Table */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Monthly Payment Comparison</h2>
          <p className="text-slate-600 mb-8">Interest-only (HELOC) vs. 60-month fixed repayment. July 2026 rates.</p>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="text-left p-4">Loan Amount</th>
                  <th className="text-right p-4">HELOC (interest only)<br /><span className="text-slate-400 font-normal text-xs">~6.5% p.a.</span></th>
                  <th className="text-right p-4">Credit Union Loan<br /><span className="text-slate-400 font-normal text-xs">~7.99% / 60 mo</span></th>
                  <th className="text-right p-4">Bank Unsecured<br /><span className="text-slate-400 font-normal text-xs">~11.99% / 60 mo</span></th>
                </tr>
              </thead>
              <tbody>
                {monthlyPaymentTable.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-4 font-bold">${row.amount.toLocaleString()}</td>
                    <td className="p-4 text-right text-green-700 font-semibold">${row.heloc}/mo</td>
                    <td className="p-4 text-right text-blue-700 font-semibold">${row.creditUnion}/mo</td>
                    <td className="p-4 text-right text-slate-600">${row.unsecured}/mo</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-400 mt-2">Estimates only. Actual rates depend on credit score, income, and lender. HELOC shows interest-only payment; principal repayment separate.</p>
        </div>
      </section>

      {/* Mistakes */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-slate-900 mb-10">4 Financing Mistakes Ontario Homeowners Make</h2>
          <div className="space-y-4">
            {mistakes.map((m, i) => (
              <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{m.mistake}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.why}</p>
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
          <h2 className="text-3xl font-black mb-4">Know Your Budget Before You Borrow</h2>
          <p className="text-lg text-rose-100 mb-8 leading-relaxed">
            Get a free AI estimate of your bathroom renovation before applying for financing. Know what your project should cost — then borrow only that amount, with 15% contingency.
          </p>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-white text-[#800020] font-black px-10 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg">
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
            <Link href="/can-i-renovate-my-bathroom-for-10000-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <DollarSign className="w-8 h-8 text-[#800020] mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Can I Renovate for $10,000?</h3>
              <p className="text-sm text-slate-500">What fits in a $10k bathroom budget in Ontario</p>
            </Link>
            <Link href="/bathroom-renovation-permits-ontario" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <Home className="w-8 h-8 text-amber-500 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Renovation Permits Ontario</h3>
              <p className="text-sm text-slate-500">When you need a permit and when you don&apos;t</p>
            </Link>
            <Link href="/bathroom-renovation-calculator" className="bg-white rounded-xl border border-slate-200 p-5 hover:border-[#800020] hover:shadow-md transition-all group">
              <CreditCard className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-slate-900 group-hover:text-[#800020] mb-1">Bathroom Renovation Calculator</h3>
              <p className="text-sm text-slate-500">Free instant estimate — know what to borrow</p>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
