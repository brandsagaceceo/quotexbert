import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation in Ajax | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Bathroom renovation in Ajax, Ontario. Bathrooms average $9,500–$27,000. AI estimates + verified local contractors. Free for homeowners.',
  keywords: [
    'bathroom renovation Ajax',
    'Ajax bathroom remodel',
    'bathroom contractors Ajax Ontario',
    'bathroom renovation cost Ajax',
    'Durham Region bathroom renovation',
  ],
  openGraph: {
    title: 'Bathroom Renovation in Ajax | 2025 Costs | QuoteXbert',
    description: 'Ajax bathroom renovations: $9,500–$27,000. AI estimates + verified local contractors.',
    url: 'https://www.quotexbert.com/bathroom-renovation-ajax',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Bathroom Renovation Ajax | QuoteXbert', description: 'Bathroom renovation cost guide for Ajax. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-ajax' },
};

const bathroomTiers = [
  {
    name: 'Powder Room',
    cost: '$4,200 – $8,500',
    desc: 'Half-bath update: vanity, toilet, mirror, tile, light fixture. Excellent ROI for Ajax homes.',
  },
  {
    name: 'Standard Bathroom',
    cost: '$9,500 – $18,500',
    desc: 'Full renovation: tile floor and tub surround, new vanity, toilet, fixtures, pot lights. Most popular Ajax bathroom renovation.',
  },
  {
    name: 'Master En-Suite',
    cost: '$16,000 – $27,000',
    desc: 'Glass shower, heated floors, double vanity, quality fixtures. Growing demand in Ajax\'s larger family homes.',
  },
];

const faqs = [
  {
    q: 'How much does a bathroom renovation cost in Ajax?',
    a: 'A standard full bathroom renovation in Ajax costs $9,500–$18,500. A mid-range project with new tile, vanity, toilet, and updated fixtures typically runs $11,500–$15,500. Master en-suites cost $16,000–$27,000. Ajax labour rates are approximately 14–16% below Toronto core.',
  },
  {
    q: 'What type of bathroom work is most popular in Ajax homes?',
    a: "Ajax's housing stock is dominated by 1990s–2000s two-storey family homes. The most popular bathroom renovation request is updating main floor bathrooms and master en-suites with modern tile, new vanities, and converting tub/shower combos to dedicated walk-in showers. Adding a bathroom to a basement is also common in Ajax.",
  },
  {
    q: 'Do I need a permit for a bathroom renovation in Ajax?',
    a: "In Ajax, permits are required for adding new bathrooms, moving plumbing, or structural changes to existing bathroom spaces. Contact Town of Ajax Building Services at 905-619-2529. Cosmetic updates (tile, vanity, fixtures in existing locations) generally don't require permits.",
  },
  {
    q: 'How do I find a reliable bathroom contractor in Ajax?',
    a: "QuoteXbert connects Ajax homeowners with verified, background-checked bathroom contractors. Upload photos of your bathroom, describe what you want changed, and get a free AI estimate calibrated to Ajax's market. You can then connect directly with verified contractors who serve Ajax and Durham Region.",
  },
];

export default function BathroomRenovationAjaxPage() {
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
            <span className="text-gray-900 font-medium">Bathroom Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Bathroom Renovation<br />in Ajax, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ajax bathroom renovations average <strong>$9,500–$27,000</strong>.
              Family-friendly Ajax has strong renovation demand — especially for kitchen and bathroom updates.
              Get your free estimate today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Ajax Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Ajax Bathroom Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Ajax Bathroom Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {bathroomTiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{tier.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Bathroom Renovation FAQ</h2>
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

      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Ready for Your Ajax Bathroom Renovation?</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Ajax bathroom contractors. No fees or commitments.</p>
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
              { label: 'Basement Renovation Ajax', href: '/basement-renovation-ajax' },
              { label: 'Flooring Ajax', href: '/flooring-ajax' },
              { label: 'Bathroom Renovation Oshawa', href: '/bathroom-renovation-oshawa' },
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
