import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, TrendingUp, DollarSign, Home, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best ROI Renovations in Durham Region | 2025 Guide | QuoteXbert',
  description:
    'Which home renovations give the best return on investment in Durham Region? Kitchen, bathroom, basement, deck, and more — ranked by ROI for Oshawa, Whitby, Ajax, Pickering & Clarington.',
  keywords: [
    'best ROI renovations Durham Region',
    'renovation return on investment Ontario',
    'Durham Region home renovation ROI',
    'best renovation investment Oshawa',
    'kitchen bathroom basement ROI Durham',
    'renovation value add Durham Region',
  ],
  openGraph: {
    title: 'Best ROI Renovations in Durham Region | 2025 | QuoteXbert',
    description: 'Ranked: which renovations give the best ROI in Durham Region. Data-driven guide for Oshawa, Whitby, Ajax, Pickering & Clarington.',
    url: 'https://www.quotexbert.com/best-roi-renovations-durham-region',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Best ROI Renovations Durham Region 2025 | QuoteXbert', description: 'Which Durham Region renovations give the best ROI? Ranked guide.' },
  alternates: { canonical: 'https://www.quotexbert.com/best-roi-renovations-durham-region' },
};

const roiRankings = [
  {
    rank: '1',
    project: 'Adding a Legal Basement Rental Suite',
    roi: '90–130%+ (income-generating)',
    cost: '$42,000 – $70,000',
    why: "Durham Region's rental market is strong. A legal basement suite generates $1,400–$2,000/month in rent. Over 3 years, a $55,000 suite generates $50,000–$72,000 in rental income — effectively paying for itself. Resale value also increases by the full cost of the renovation.",
    cities: 'Best in: Oshawa, Whitby, Ajax, Pickering',
  },
  {
    rank: '2',
    project: 'Minor Kitchen Update',
    roi: '75–95%',
    cost: '$15,000 – $28,000',
    why: "A budget to mid-range kitchen refresh (cabinet reface/replace, new countertops, updated appliances) consistently yields the highest percentage ROI in the GTA and Durham Region. Buyers notice kitchens first. A $22,000 investment in a tired Oshawa kitchen can add $18,000–$22,000 in resale value.",
    cities: 'Best in: All Durham Region cities',
  },
  {
    rank: '3',
    project: 'Basement Finishing (without suite)',
    roi: '65–85%',
    cost: '$22,000 – $45,000',
    why: "Even without a rental suite, finished basements add significant value in Durham Region. Buyers in Oshawa, Whitby, and Ajax place a premium on functional living space. A $35,000 basement finish typically adds $25,000–$38,000 in resale value while dramatically improving daily life.",
    cities: 'Best in: Whitby, Ajax, Pickering (new builds)',
  },
  {
    rank: '4',
    project: 'Bathroom Renovation',
    roi: '55–75%',
    cost: '$9,500 – $25,000',
    why: "Bathroom renovations have strong ROI in Durham Region's family-oriented market. Adding a bathroom to a home with only one full bathroom can return 85–110% of cost. Renovating an existing bathroom typically returns 55–75%. En-suite additions are particularly valuable.",
    cities: 'Best in: All Durham Region cities',
  },
  {
    rank: '5',
    project: 'Deck Construction',
    roi: '60–80%',
    cost: '$8,000 – $22,000',
    why: "Decks are highly valued in Durham Region where outdoor living space is important to family buyers. A well-built composite deck can add $8,000–$15,000 in resale value while delivering daily lifestyle benefits. The ROI is strongest for homes without existing outdoor entertaining space.",
    cities: 'Best in: Whitby, Ajax, Bowmanville, Courtice',
  },
  {
    rank: '6',
    project: 'Mid-Range Kitchen Renovation',
    roi: '60–80%',
    cost: '$28,000 – $50,000',
    why: "Full kitchen renovations have slightly lower ROI percentage than minor updates but deliver stronger absolute value increases. In Durham Region's market, a $40,000 kitchen typically adds $28,000–$36,000 in resale value. The lifestyle benefit to homeowners staying 5+ years makes the full renovation worthwhile.",
    cities: 'Best in: Oshawa, Whitby, Ajax, Pickering',
  },
  {
    rank: '7',
    project: 'Roof Replacement',
    roi: '50–70% (protective)',
    cost: '$8,000 – $20,000',
    why: "Roof replacements are primarily value-protective rather than value-additive. A failing roof dramatically reduces buyer offers and increases time-on-market. A new roof removes a major buyer concern and allows full market pricing. In Durham Region's older housing stock, aging roofs are common.",
    cities: 'Best in: Oshawa, Whitby (older home stock)',
  },
  {
    rank: '8',
    project: 'Window Replacement',
    roi: '50–65% (protective)',
    cost: '$5,000 – $15,000',
    why: "Like roofing, window replacement is primarily protective — it removes a buyer objection rather than adding luxury value. Old, drafty windows in Durham Region's older homes reduce offers and buyer interest. New windows also reduce heating and cooling costs, which has daily tangible value.",
    cities: 'Best in: Oshawa, older Whitby & Ajax homes',
  },
  {
    rank: '9',
    project: 'Flooring Replacement',
    roi: '50–70%',
    cost: '$3,000 – $12,000',
    why: "Fresh flooring is often the highest-impact, lowest-cost renovation. Removing worn carpet and replacing with LVP flooring throughout an Oshawa or Whitby home can cost $5,000–$8,000 and add $5,000–$8,000+ in perceived value. Simple, high-impact, quick.",
    cities: 'Best in: All Durham Region cities',
  },
  {
    rank: '10',
    project: 'Fresh Paint (Interior)',
    roi: '80–120%',
    cost: '$2,500 – $6,500',
    why: "Interior painting has the best dollar-for-dollar ROI of any renovation. Fresh, neutral paint dramatically improves buyer perception and photography. A $4,000 paint job on an Oshawa home typically adds $4,000–$6,000 in offers. It's the single best value renovation in any Durham Region city.",
    cities: 'Best in: All Durham Region cities — especially pre-sale',
  },
];

const durhamMarketContext = [
  {
    title: "Durham Region's Renovation ROI Advantage",
    content: "Because Durham Region renovation costs are 15–20% below Toronto, the ROI math works more favourably for Durham homeowners. You spend less to renovate, but property appreciation rates mean the added value is similar to Toronto investments.",
  },
  {
    title: 'Rental Income Changes the Equation',
    content: "In Durham Region's rental market, adding a legal basement suite is uniquely valuable. The suite generates passive income that compounds the ROI well beyond any other renovation type. Oshawa, Whitby, and Ajax all have strong rental demand.",
  },
  {
    title: 'The Pre-Sale vs Stay-and-Enjoy Decision',
    content: "If selling in under 2 years: prioritize kitchen, paint, and curb appeal. If staying 5+ years: basement finishing and bathroom renovations deliver both daily quality and future resale value. This distinction significantly affects which renovation has the best ROI for your situation.",
  },
];

const faqs = [
  {
    q: 'Which renovation adds the most value to a home in Durham Region?',
    a: "Adding a legal basement rental suite consistently adds the most total value in Durham Region — both through direct property value increase and ongoing rental income. For homeowners who want to sell within 2 years, a kitchen update and fresh paint give the best immediate ROI. For long-term stays, basement finishing delivers the best combined lifestyle and financial return.",
  },
  {
    q: 'Do renovations in Oshawa have better ROI than Toronto?',
    a: "Because renovation costs in Oshawa are 15–20% lower than Toronto, the ROI percentage on comparable renovations can be higher — you invest less to achieve similar value gains. However, Toronto properties often appreciate faster, which can mean higher absolute dollar returns on Toronto renovations even at higher cost.",
  },
  {
    q: 'What renovation should I avoid in Durham Region?',
    a: "High-end luxury renovations that overshoot the neighbourhood's price ceiling typically have poor ROI. A $100,000 kitchen renovation in a $550,000 Oshawa house won't return its cost. The right renovation level is approximately 5–10% of your home's current value for maximum ROI.",
  },
  {
    q: 'How do I calculate renovation ROI for my Durham Region home?',
    a: "Basic ROI formula: (added market value - renovation cost) ÷ renovation cost × 100. However, for projects like basement suites that generate income, also calculate the payback period: renovation cost ÷ monthly net rental income = months to break even. QuoteXbert can help you get an accurate renovation cost estimate to start this calculation.",
  },
];

export default function BestROIRenovationsDurhamPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Best ROI Renovations</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <TrendingUp className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Ranked by Return on Investment — Durham Region 2025</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Best ROI Renovations<br />in Durham Region
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Which renovations give the best return on investment in Durham Region?
              Ranked by ROI percentage with real cost and value data for Oshawa, Whitby, Ajax, Pickering, and Clarington.
            </p>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Rankings */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Renovations Ranked by ROI — Durham Region 2025</h2>
          <p className="text-center text-gray-600 mb-10">From best to good — based on Durham Region market data</p>
          <div className="space-y-6">
            {roiRankings.map((item) => (
              <div key={item.project} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-rose-600 text-white font-black text-lg rounded-full flex items-center justify-center flex-shrink-0">
                    {item.rank}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-3">
                      <h3 className="font-black text-gray-900 text-lg">{item.project}</h3>
                      <span className="bg-green-100 text-green-800 font-bold text-sm px-3 py-1 rounded-full">{item.roi}</span>
                      <span className="text-rose-700 font-bold text-sm">{item.cost}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-2">{item.why}</p>
                    <p className="text-xs text-gray-500 font-medium">{item.cities}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Context */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Understanding Durham Region&apos;s Renovation Market</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {durhamMarketContext.map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region Renovation ROI FAQ</h2>
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

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Know Your Renovation ROI Before You Start</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate to understand your renovation cost — then calculate your ROI with confidence. Free for Durham Region homeowners.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Kitchen vs Bathroom ROI', href: '/blog/kitchen-vs-bathroom-roi-ontario' },
              { label: 'Should You Finish Your Basement?', href: '/blog/should-you-finish-your-basement' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Basement Renovation Whitby', href: '/basement-renovation-whitby' },
              { label: 'Kitchen Renovation Oshawa', href: '/kitchen-renovation-oshawa' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
