import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Roof Replacement in Pickering | Costs & Contractors | QuoteXbert',
  description: 'Roof replacement in Pickering, Ontario. AI cost estimates and verified roofers. Pickering roof replacements average $8,000–$18,000. Asphalt, metal & flat roofing.',
  keywords: ['roof replacement Pickering', 'Pickering roofers', 'roofing contractors Pickering', 'roof repair Pickering', 'roofing cost Pickering Durham Region'],
  openGraph: { title: 'Roof Replacement in Pickering | QuoteXbert', description: 'AI estimates for Pickering roof replacements. Average $8,000–$18,000. Verified local roofers.', url: 'https://www.quotexbert.com/roof-replacement-pickering', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Roof Replacement Pickering | QuoteXbert', description: 'Roof replacement estimates for Pickering, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/roof-replacement-pickering' },
};

const roofingTypes = [
  { name: 'Asphalt Shingles (3-Tab)', cost: '$7,000 – $11,000', desc: '20–25 year lifespan. Most affordable option. Standard in Pickering\'s older 1960s–1980s homes.' },
  { name: 'Architectural Shingles', cost: '$9,000 – $15,000', desc: '30–35 year lifespan. Better wind resistance, more dimensional look. Most popular for mid-range Pickering homes.' },
  { name: 'Metal Roofing', cost: '$14,000 – $28,000', desc: '40–70 year lifespan. Excellent for Ontario\'s climate. Higher upfront cost, lowest lifetime cost.' },
];

const faqs = [
  { q: 'How much does roof replacement cost in Pickering?', a: 'A standard roof replacement in Pickering costs $7,000–$28,000 depending on roof size, slope, and material. A typical 2,000 sq ft Pickering home with architectural shingles runs $9,000–$14,000. Pickering roofing rates are approximately 12–15% below Toronto core.' },
  { q: 'When should I replace my roof in Pickering?', a: 'Replace your Pickering roof when you notice missing or curling shingles, granule loss in gutters, active leaks, or dark staining on interior ceilings. Ontario\'s freeze-thaw cycle accelerates shingle wear. Most Pickering homes built in the 1980s–1990s need roof replacements 30–40 years after original installation.' },
  { q: 'Do I need a permit for a roof replacement in Pickering?', a: 'In Pickering, a building permit is not required for a simple re-roof (replacing existing shingles). However, if structural roof work is involved (replacing decking, changing roof structure), a permit is required. Ask your contractor to confirm.' },
  { q: 'How long does a roof replacement take in Pickering?', a: 'Most Pickering roof replacements take 1–3 days for a standard residential home. Complex roofs with steep pitches, multiple valleys, or skylights may take 3–5 days. Roofing is weather-dependent — avoid scheduling for rainy periods.' },
];

export default function RoofReplacementPickeringPage() {
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
            <Link href="/pickering" className="hover:text-rose-600">Pickering</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Roof Replacement</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Roof Replacement<br />in Pickering, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pickering roof replacements average <strong>$7,000–$28,000</strong>. 
              Asphalt, architectural, and metal roofing from verified Pickering roofers. 
              Get your free AI estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Roofers</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Roof Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Pickering Roofing Options &amp; Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {roofingTypes.map((type) => (
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Pickering Roofing FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Pickering Roof Replaced Right</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Pickering roofers. No surprise costs.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free Roof Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Pickering Hub', href: '/pickering' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Roofing Leads Pickering', href: '/roofing-leads-pickering' },
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
