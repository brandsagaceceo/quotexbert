import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Home, Wrench, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Durham Region | Complete Guide | QuoteXbert',
  description:
    'Complete guide to home renovation in Durham Region, Ontario. Costs, permits, contractors, and neighbourhood-by-neighbourhood renovation advice for Oshawa, Whitby, Ajax, Pickering & all Durham cities.',
  keywords: [
    'home renovation Durham Region Ontario',
    'Durham Region renovation guide',
    'renovation tips Durham Region',
    'home improvement Durham Ontario',
    'Durham Region home renovation costs',
    'best renovations Durham Region',
  ],
  openGraph: {
    title: 'Home Renovation Durham Region | Complete Guide | QuoteXbert',
    description: 'Complete home renovation guide for Durham Region. Costs, tips, permits, and trusted contractors.',
    url: 'https://www.quotexbert.com/home-renovation-durham-region',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Home Renovation Durham Region Guide | QuoteXbert', description: 'Complete guide to home renovation in Durham Region.' },
  alternates: { canonical: 'https://www.quotexbert.com/home-renovation-durham-region' },
};

const renovationSteps = [
  { step: '1', title: 'Define Your Project', desc: 'Be specific about what you want — scope, style, and priorities. Vague requests lead to vague (and inaccurate) quotes.' },
  { step: '2', title: 'Get an AI Estimate', desc: 'Use QuoteXbert to get a free AI estimate calibrated to Durham Region pricing. Know what\'s fair before you start talking to contractors.' },
  { step: '3', title: 'Confirm Permit Requirements', desc: 'Most significant renovations in Durham Region require a building permit. Confirm requirements with your municipality or contractor before starting.' },
  { step: '4', title: 'Get 2–3 Contractor Quotes', desc: 'Never accept the first quote. Compare at least 2–3 quotes from verified contractors. QuoteXbert makes this easy and free.' },
  { step: '5', title: 'Review Contracts Carefully', desc: 'Get everything in writing: scope, timeline, payment schedule, and warranty. Never pay the full amount upfront — standard in Durham Region is 10–25% deposit.' },
  { step: '6', title: 'Manage the Project', desc: 'Stay engaged during construction. Walk through the project at each phase. Speak up immediately if something looks wrong — it\'s easier to fix early.' },
];

const durhamRenovationTips = [
  { tip: 'Factor in Durham\'s Climate', desc: 'Ontario\'s freeze-thaw cycle affects foundations, roofing, and exterior surfaces. Proper insulation and moisture management are critical in Durham Region renovations.' },
  { tip: 'Basement Moisture First', desc: 'Many Durham Region homes have moisture issues in basements. Always address waterproofing before finishing. Test with moisture meter before framing.' },
  { tip: 'Seaton Homes: Finish First', desc: 'New Pickering (Seaton) homes are often sold unfinished. Basement finishing is the #1 project for new Seaton homeowners — get on a contractor\'s schedule early.' },
  { tip: 'Older Homes: Asbestos Check', desc: 'Homes built before 1985 in Durham Region may have asbestos in drywall compound, floor tiles, or pipe insulation. Get a professional inspection before renovating older homes in Oshawa, Whitby, or Ajax.' },
  { tip: 'Permits Protect You', desc: 'Unpermitted work can void home insurance, create problems at resale, and leave you liable for defects. Always permit required work in Durham Region municipalities.' },
  { tip: 'Book Seasonal Trades Early', desc: 'Deck builders, roofers, and exterior painters in Durham Region are booked 6–8 weeks in advance during peak season (May–September). Book early or choose a winter renovation for interior trades.' },
];

const faqs = [
  { q: 'How much should I budget for home renovation in Durham Region?', a: 'As a general rule, homeowners in Durham Region can expect to spend 1–3% of their home\'s value per year on maintenance and renovations. For a project-based budget: kitchen $25,000–$45,000, bathroom $10,000–$22,000, basement finishing $28,000–$55,000. Start with a free QuoteXbert estimate for your specific project.' },
  { q: 'What renovations add the most value in Durham Region?', a: "In Durham Region's market: basement finishing (especially rental suites) adds the most total value and ROI. Kitchen renovations are next — critical for resale. Bathroom renovations add value and appeal. Curb appeal (fresh paint, new front door, landscaping) is high-impact and lower cost. Roof and windows are essential but don't add value above their cost." },
  { q: 'How do I know if a Durham Region contractor is licensed?', a: "In Ontario, general contractors don't require a provincial licence, but tradespeople (electricians, plumbers, HVAC) do. Verify that specialized trades have their Certificate of Qualification (Red Seal or provincial licence). Always ask for proof of general liability insurance and WSIB coverage. QuoteXbert verifies this for all listed contractors." },
  { q: 'Should I renovate before or after selling my Durham Region home?', a: "Renovating before selling in Durham Region is worthwhile for high-impact areas: kitchen, bathrooms, and curb appeal. Major renovations for personal use are less clear — you won't recover 100% of cost at resale. Get an honest assessment from a Durham Region real estate agent before investing heavily to sell." },
];

export default function HomeRenovationDurhamRegionPage() {
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
            <span className="text-gray-900 font-medium">Home Renovation Guide</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Home className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Complete Home Renovation Guide — Durham Region</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Home Renovation<br />in Durham Region
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Everything you need to know about renovating your Durham Region home.
              Costs, permits, contractors, timelines, and tips for every city and every budget.
            </p>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl">
                📸 Get My Free AI Estimate <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">How to Plan a Successful Durham Region Renovation</h2>
          <p className="text-center text-gray-600 mb-10">Six steps every Durham Region homeowner should follow</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renovationSteps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-rose-600 text-white font-black text-lg rounded-full flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Durham Tips */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Durham Region Renovation Tips</h2>
          <p className="text-center text-gray-600 mb-10">Local knowledge that saves you money and headaches</p>
          <div className="grid md:grid-cols-2 gap-5">
            {durhamRenovationTips.map((item) => (
              <div key={item.tip} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.tip}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Durham Region Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate in minutes. Know the fair price. Connect with verified contractors. All free for homeowners.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block text-lg">Get My Free AI Estimate →</Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region Home Renovation FAQ</h2>
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
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'General Contractors Durham', href: '/general-contractors-durham-region' },
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Whitby', href: '/whitby' },
              { label: 'Ajax', href: '/ajax' },
              { label: 'Pickering', href: '/pickering' },
              { label: 'Blog', href: '/blog' },
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
