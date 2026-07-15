import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation in Courtice | Costs & Contractors | QuoteXbert',
  description:
    'Bathroom renovation in Courtice, Ontario. AI-powered cost estimates and verified contractors. Courtice bathrooms average $8,500–$22,000. Free for homeowners.',
  keywords: ['bathroom renovation Courtice', 'Courtice bathroom remodel', 'bathroom contractors Courtice', 'Clarington bathroom renovation', 'bathroom renovation cost Courtice'],
  openGraph: { title: 'Bathroom Renovation in Courtice | QuoteXbert', description: 'AI estimates + verified contractors for bathroom renovations in Courtice. Average $8,500–$22,000.', url: 'https://www.quotexbert.com/bathroom-renovation-courtice', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Bathroom Renovation Courtice | QuoteXbert', description: 'Bathroom renovation estimates for Courtice. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-courtice' },
};

const bathroomTiers = [
  { name: 'Powder Room Update', cost: '$4,500 – $9,000', desc: 'Vanity, toilet, tile floor, mirror, light fixture, paint. Basic powder room or half-bath refresh.' },
  { name: 'Standard Bathroom', cost: '$9,000 – $16,000', desc: 'Full gut of existing bathroom. New tub or shower, tile surround, vanity, toilet, lighting, and ventilation.' },
  { name: 'Master En-Suite', cost: '$16,000 – $28,000+', desc: 'Large-format tile, frameless glass shower, freestanding tub, double vanity, heated floors, and premium fixtures.' },
];

const faqs = [
  { q: 'How much does a bathroom renovation cost in Courtice?', a: 'A standard bathroom renovation in Courtice costs between $9,000 and $22,000. A mid-range full-bathroom renovation with new tile, vanity, toilet, tub/shower surround, and lighting typically runs $11,000–$16,000. En-suite renovations with premium finishes run $18,000–$28,000+.' },
  { q: 'How long does a bathroom renovation take in Courtice?', a: 'Most bathroom renovations in Courtice take 2–4 weeks. A standard bathroom typically takes 2.5–3 weeks. A master en-suite with complex tile work or structural changes can take 4–6 weeks. Always confirm a timeline with your contractor before work begins.' },
  { q: 'Do I need a permit for a bathroom renovation in Courtice?', a: "A permit is required in Courtice (Municipality of Clarington) for plumbing changes (moving drain lines or supply pipes), structural changes, or adding a new bathroom. Replacing existing fixtures in the same location typically doesn't require a permit. Ask your contractor." },
  { q: 'What is the most cost-effective bathroom renovation in Courtice?', a: "The highest-ROI bathroom renovation in Courtice is typically a mid-range full bathroom update: new tile floor and tub surround, updated vanity, new toilet, and modern lighting. This $10,000–$14,000 investment can add $15,000–$20,000+ to your home's resale value in Courtice's growing market." },
];

export default function BathroomRenovationCourticePage() {
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
            <Link href="/courtice" className="hover:text-rose-600">Courtice</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Bathroom Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Bathroom Renovation<br />in Courtice
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get an instant AI estimate for your Courtice bathroom renovation.
              Standard bathrooms average <strong>$9,000–$22,000</strong>. En-suites from <strong>$16,000–$28,000+</strong>.
              All 15% below Toronto rates.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Bathroom Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Courtice Bathroom Renovation Costs</h2>
          <p className="text-center text-gray-600 mb-8">Three levels of bathroom renovation for Courtice homeowners</p>
          <div className="grid md:grid-cols-3 gap-6">
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

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">What&apos;s Included in a Courtice Bathroom Renovation</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Demo & Prep', desc: 'Removal of existing tile, fixtures, and drywall. Inspection for moisture damage or mold before new work begins.' },
              { title: 'Tile Work', desc: 'Floor tile and tub/shower surround tile. Labour-intensive but transformative. Large-format tiles add cost.' },
              { title: 'Plumbing Fixtures', desc: 'Toilet ($300–$1,500), vanity/sink ($400–$2,500), tub or shower system ($500–$4,000+). Fixture quality significantly affects cost.' },
              { title: 'Vanity & Cabinetry', desc: 'Single vanity ($400–$2,000), floating vanity ($800–$3,500), double vanity ($1,200–$5,000+). Storage solutions included.' },
              { title: 'Lighting & Electrical', desc: 'Vanity lighting ($200–$800), exhaust fan upgrade ($150–$500), pot lights ($150 each installed). GFCI outlets required near water.' },
              { title: 'Accessories & Finishing', desc: 'Mirror, towel bars, toilet paper holder, paint, and trim. Often overlooked but adds up to $500–$1,500.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Courtice Bathroom Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready for Your Courtice Bathroom Renovation?</h2>
          <p className="text-rose-100 text-lg mb-8">Upload photos and get a free AI estimate in minutes. No contractor calls needed until you know the price.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Courtice Hub', href: '/courtice' },
              { label: 'Clarington Hub', href: '/clarington' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
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
