import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation in Whitby | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Bathroom renovation in Whitby, Ontario. Bathrooms average $10,000–$30,000. Brooklin & all Whitby neighbourhoods covered. AI estimates + verified local contractors.',
  keywords: [
    'bathroom renovation Whitby',
    'Whitby bathroom remodel',
    'bathroom contractors Whitby Ontario',
    'bathroom renovation cost Whitby',
    'Brooklin bathroom renovation',
    'Durham Region bathroom renovation',
  ],
  openGraph: {
    title: 'Bathroom Renovation in Whitby | 2025 Costs | QuoteXbert',
    description: 'Whitby bathroom renovations: $10,000–$30,000. Brooklin to downtown — AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/bathroom-renovation-whitby',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Bathroom Renovation Whitby | QuoteXbert', description: 'Bathroom renovation cost guide for Whitby. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-whitby' },
};

const bathroomTiers = [
  {
    name: 'Powder Room Refresh',
    cost: '$4,500 – $9,000',
    desc: 'New vanity, toilet, mirror, lighting, tile floor, fresh paint. Popular quick update for Whitby\'s half-baths.',
  },
  {
    name: 'Standard Bathroom',
    cost: '$10,000 – $19,000',
    desc: 'Full renovation: new tile (floor + surround), vanity, toilet, updated fixtures, pot lights. Most common in Whitby.',
  },
  {
    name: 'Master En-Suite',
    cost: '$18,000 – $32,000',
    desc: 'Glass shower, double vanity, heated floors, large-format tile, quality fixtures. Common in Brooklin and newer Whitby developments.',
  },
];

const faqs = [
  {
    q: 'How much does a bathroom renovation cost in Whitby?',
    a: "A standard full bathroom renovation in Whitby costs $10,000–$19,000. A mid-range renovation with new tile, vanity, toilet, and updated fixtures typically runs $12,000–$16,000. Master en-suite renovations with glass shower, double vanity, and heated floors cost $18,000–$32,000. Whitby rates are approximately 14–16% below Toronto core.",
  },
  {
    q: "What's the most popular bathroom renovation in Whitby right now?",
    a: "In Whitby, the most popular bathroom renovation in 2025 is converting a tub-shower combo to a walk-in shower with large-format porcelain tile and frameless glass. This transformation is especially popular in Whitby's 1980s–1990s homes, where the original 4-piece bathroom with a dated tub surround gets modernized to a cleaner, more functional design.",
  },
  {
    q: 'How long does a bathroom renovation take in Whitby?',
    a: "Most bathroom renovations in Whitby take 2.5–4 weeks. A standard bathroom typically takes 2.5–3 weeks. A master en-suite with complex tile work and glass installation can take 4–5 weeks. Permit approval from Town of Whitby Building Services (905-430-4300) typically takes 5–10 business days for bathroom projects.",
  },
  {
    q: 'Are Brooklin bathroom contractors available through QuoteXbert?',
    a: "Yes — QuoteXbert connects homeowners in Brooklin (and all of Whitby) with verified contractors who serve the area. Brooklin's newer housing stock (2010–present) often needs first-time en-suite additions or bathroom upgrades from builder-grade finishes. Contractors familiar with this market are in our network.",
  },
];

export default function BathroomRenovationWhitbyPage() {
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
            <Link href="/whitby" className="hover:text-rose-600">Whitby</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Bathroom Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Bathroom Renovation<br />in Whitby, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Whitby bathroom renovations average <strong>$10,000–$32,000</strong>.
              From Rolling Acres to Brooklin — every Whitby bathroom is different.
              Get your free AI estimate in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Whitby Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Whitby Bathroom Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Whitby Bathroom Renovation Costs</h2>
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Whitby Bathroom Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Whitby Bathroom Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate calibrated to Whitby&apos;s market. Verified bathroom contractors. No commitment.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Whitby Hub', href: '/whitby' },
              { label: 'Kitchen Renovation Whitby', href: '/kitchen-renovation-whitby' },
              { label: 'Deck Builders Whitby', href: '/deck-builders-whitby' },
              { label: 'Bathroom Renovation Oshawa', href: '/bathroom-renovation-oshawa' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
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
