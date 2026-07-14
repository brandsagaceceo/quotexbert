import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Basement Renovation in Ajax | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Basement renovation in Ajax, Ontario. Finishing & legal suites — $22,000–$62,000. Ajax families love finished basements. AI estimates + verified local contractors.',
  keywords: [
    'basement renovation Ajax',
    'Ajax basement finishing',
    'basement contractors Ajax Ontario',
    'basement renovation cost Ajax',
    'Ajax basement apartment',
  ],
  openGraph: {
    title: 'Basement Renovation in Ajax | 2025 Costs | QuoteXbert',
    description: 'Ajax basement renovations: $22,000–$62,000. Legal suites, rec rooms & more. AI estimates.',
    url: 'https://www.quotexbert.com/basement-renovation-ajax',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Basement Renovation Ajax | QuoteXbert', description: 'Basement renovation cost guide for Ajax. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/basement-renovation-ajax' },
};

const basementTypes = [
  {
    name: 'Open-Concept Finish',
    cost: '$22,000 – $36,000',
    desc: 'Insulation, drywall, LVP flooring, pot lights, electrical. One open living area — rec room, home gym, or family space.',
  },
  {
    name: 'With Bedroom & Bathroom',
    cost: '$32,000 – $50,000',
    desc: 'Open-concept finish plus one bedroom and 3-piece bathroom. Most popular Ajax basement project for growing families.',
  },
  {
    name: 'Legal Rental Suite',
    cost: '$42,000 – $65,000+',
    desc: 'Secondary suite with kitchen, 3-piece bathroom, and separate entrance. Requires Town of Ajax permit. Generates rental income.',
  },
];

const faqs = [
  {
    q: 'How much does it cost to finish a basement in Ajax?',
    a: 'Finishing a basement in Ajax costs $22,000–$65,000+ depending on scope. An open-concept finish runs $22,000–$36,000. A full finish with bedroom and bathroom costs $32,000–$50,000. A legal rental suite runs $42,000–$65,000+. Ajax rates are approximately 14–16% below Toronto core.',
  },
  {
    q: 'Is Ajax a good city for basement rental suites?',
    a: "Yes. Ajax has a strong rental market — two-bedroom basement suites rent for $1,500–$1,800/month. With a legal suite costing $42,000–$65,000, a well-executed project can break even in 2.5–3.5 years through rental income alone. Ajax's strong family demographics also mean strong demand from people looking for in-law suites.",
  },
  {
    q: 'What is the most popular basement project in Ajax?',
    a: "The most popular Ajax basement renovation is a full finish with a bathroom and at least one bedroom — the $32,000–$50,000 range. This gives families an additional bedroom for guests, a home office, and a 3-piece bathroom that makes the space fully functional. Ajax families with teenagers especially value this configuration.",
  },
  {
    q: 'Do I need a permit for a basement renovation in Ajax?',
    a: "Yes. Town of Ajax Building Services (905-619-2529) requires permits for basement finishing work. This includes framing, electrical, and plumbing. Secondary suite permits require additional approvals. Budget $600–$1,800 for permits and 3–5 weeks for approval.",
  },
];

export default function BasementRenovationAjaxPage() {
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
            <Link href="/ajax" className="hover:text-rose-600">Ajax</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Basement Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Basement Renovation<br />in Ajax, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ajax basement renovations average <strong>$22,000–$65,000+</strong>.
              Ajax families love finished basements for added living space and rental income.
              Free AI estimate in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Ajax Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Ajax Basement Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Ajax Basement Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {basementTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{type.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{type.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Basement Renovation FAQ</h2>
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

      <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Ajax Basement Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Ajax basement contractors. No commitment.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Ajax Hub', href: '/ajax' },
              { label: 'Kitchen Renovation Ajax', href: '/kitchen-renovation-ajax' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
              { label: 'Basement Renovation Whitby', href: '/basement-renovation-whitby' },
              { label: 'Basement Renovation Pickering', href: '/basement-renovation-pickering' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
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
