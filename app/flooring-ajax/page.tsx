import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Flooring Installation in Ajax | Costs & Contractors | QuoteXbert',
  description: 'Flooring installation in Ajax, Ontario. Hardwood, LVP, tile, laminate & carpet. AI cost estimates and verified flooring contractors. Ajax flooring averages $2,500–$12,000.',
  keywords: ['flooring Ajax', 'Ajax flooring installation', 'hardwood flooring Ajax', 'LVP flooring Ajax', 'flooring contractors Ajax Durham Region'],
  openGraph: { title: 'Flooring Installation in Ajax | QuoteXbert', description: 'AI estimates for all flooring types in Ajax. Average $2,500–$12,000. Verified local contractors.', url: 'https://www.quotexbert.com/flooring-ajax', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Flooring Ajax | QuoteXbert', description: 'Flooring installation estimates for Ajax, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/flooring-ajax' },
};

const flooringTypes = [
  { name: 'Luxury Vinyl Plank (LVP)', cost: '$2,500 – $6,000', desc: 'Most popular choice for Ajax homes. Waterproof, durable, comfortable underfoot. Wide range of realistic wood looks. Best value overall.' },
  { name: 'Engineered Hardwood', cost: '$5,000 – $11,000', desc: 'Real wood top layer with engineered core. Suitable for basements and above grade. Adds warmth and value.' },
  { name: 'Solid Hardwood', cost: '$6,000 – $14,000', desc: 'Premium timeless look. Can be refinished multiple times. Not suitable for below grade. Adds significant resale value.' },
  { name: 'Ceramic / Porcelain Tile', cost: '$3,500 – $9,000', desc: 'Ideal for bathrooms, kitchens, and entryways. Durable and waterproof. Labour-intensive installation affects cost.' },
  { name: 'Laminate Flooring', cost: '$2,200 – $5,500', desc: 'Budget-friendly wood look. Improved moisture resistance in newer products. Good for main floor living areas.' },
  { name: 'Carpet', cost: '$2,000 – $6,000', desc: 'Comfortable and affordable for bedrooms and basements. Wide range of styles and fibres.' },
];

const faqs = [
  { q: 'How much does flooring cost in Ajax?', a: 'Flooring installation in Ajax costs $2,200–$14,000+ depending on material and area. LVP (luxury vinyl plank) is the most popular choice, running $2,500–$6,000 for an average 1,000 sq ft area. Engineered hardwood runs $5,000–$11,000 for the same area.' },
  { q: 'What flooring is best for Ajax homes?', a: "Ajax's housing mix includes older bungalows with concrete slabs and newer two-storey homes. LVP works well on both types — it's waterproof (good for over-grade concrete) and dimensionally stable. Engineered hardwood is excellent for above-grade main floors. Avoid solid hardwood in basements." },
  { q: 'How long does flooring installation take in Ajax?', a: 'Most flooring projects in Ajax take 1–3 days for an average home. Large-format tile work takes longer due to layout and setting time. Hardwood flooring may need 24–48 hours of acclimation before installation.' },
  { q: 'Do I need to move furniture before flooring installation in Ajax?', a: "Yes — most Ajax flooring contractors require that rooms be cleared of furniture before they arrive. Some larger companies offer furniture moving as part of their service for an additional fee. Confirm this with your contractor before scheduling." },
];

export default function FlooringAjaxPage() {
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
            <span className="text-gray-900 font-medium">Flooring Installation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Flooring Installation<br />in Ajax, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get an AI-powered flooring estimate for your Ajax home. Hardwood, LVP, tile, and more.
              Ajax flooring averages <strong>$2,200–$14,000</strong>. Free for homeowners.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Flooring Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Flooring Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Ajax Flooring Types &amp; Costs</h2>
          <p className="text-center text-gray-600 mb-8">Cost comparison for 1,000 sq ft of flooring in Ajax</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flooringTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{type.name}</h3>
                <p className="text-rose-700 font-black text-lg mb-2">{type.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Flooring FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Ajax Flooring Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Ajax flooring contractors. No hidden fees.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free Flooring Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Ajax Hub', href: '/ajax' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Flooring Leads Ajax', href: '/flooring-leads-ajax' },
              { label: 'Durham Region Contractors', href: '/durham-region-contractors' },
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
