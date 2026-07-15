import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitchen Renovation in Bowmanville | Costs & Contractors | QuoteXbert',
  description:
    'Kitchen renovation in Bowmanville, Ontario. Get instant AI cost estimates. Verified local contractors for full kitchen remodels. Bowmanville kitchens average $15,000–$42,000.',
  keywords: [
    'kitchen renovation Bowmanville',
    'Bowmanville kitchen remodel',
    'kitchen contractors Bowmanville',
    'kitchen renovation cost Bowmanville',
    'Clarington kitchen renovation',
  ],
  openGraph: {
    title: 'Kitchen Renovation in Bowmanville | QuoteXbert',
    description: 'AI estimates + verified contractors for kitchen renovations in Bowmanville. Average cost $15,000–$42,000.',
    url: 'https://www.quotexbert.com/kitchen-renovation-bowmanville',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Kitchen Renovation Bowmanville | QuoteXbert', description: 'Kitchen renovation estimates for Bowmanville. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/kitchen-renovation-bowmanville' },
};

const kitchenTiers = [
  { name: 'Budget Refresh', cost: '$15,000 – $22,000', desc: 'Cabinet refacing or new stock cabinets, laminate countertops, updated fixtures, fresh paint, new flooring.' },
  { name: 'Mid-Range Renovation', cost: '$22,000 – $35,000', desc: 'Semi-custom cabinets, quartz countertops, tile backsplash, pot lights, new appliances, LVP flooring.' },
  { name: 'Full Renovation', cost: '$35,000 – $55,000+', desc: 'Custom cabinetry, waterfall island, high-end appliances, heated floors, full electrical and plumbing updates.' },
];

const faqs = [
  { q: 'How much does a kitchen renovation cost in Bowmanville?', a: 'A kitchen renovation in Bowmanville typically costs $15,000–$55,000+ depending on scope and materials. A mid-range renovation with semi-custom cabinets, quartz countertops, and new flooring averages $25,000–$38,000. Bowmanville rates are approximately 15–18% below Toronto core.' },
  { q: 'How long does a kitchen renovation take in Bowmanville?', a: 'Most Bowmanville kitchen renovations take 4–8 weeks from start to completion. Planning, ordering materials, and permit approval (if needed) can add 3–6 weeks before work begins. Your contractor should provide a detailed timeline at the project start.' },
  { q: 'Do I need a permit for a kitchen renovation in Bowmanville?', a: 'You need a permit in Bowmanville (Municipality of Clarington) if your kitchen renovation involves structural changes, moving plumbing, or upgrading electrical panels. Cosmetic changes — new cabinets, countertops, appliances — typically do not require a permit.' },
  { q: 'What is the ROI of a kitchen renovation in Bowmanville?', a: "Kitchen renovations in Bowmanville typically return 60–75% of the renovation cost on home resale. Given Clarington's rising real estate values, a well-done kitchen renovation is one of the highest-ROI investments a Bowmanville homeowner can make." },
];

export default function KitchenRenovationBowmanvillePage() {
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
            <Link href="/bowmanville" className="hover:text-rose-600">Bowmanville</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Kitchen Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Kitchen Renovation<br />in Bowmanville
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get an instant AI-powered kitchen renovation estimate for your Bowmanville home.
              Bowmanville kitchens average <strong>$15,000–$55,000</strong> — approximately 15–18% below Toronto rates.
              Connect with verified local contractors.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Kitchen Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Bowmanville Kitchen Renovation Costs</h2>
          <p className="text-center text-gray-600 mb-8">Three budget levels for Bowmanville kitchen renovations</p>
          <div className="grid md:grid-cols-3 gap-6">
            {kitchenTiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{tier.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">What&apos;s Included in a Bowmanville Kitchen Renovation</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Cabinetry', desc: 'The biggest cost driver. Stock cabinets ($3,000–$8,000), semi-custom ($8,000–$18,000), or custom ($18,000–$35,000+). Most Bowmanville kitchens use semi-custom.' },
              { title: 'Countertops', desc: 'Laminate ($500–$1,500), quartz ($2,500–$6,000), granite ($2,000–$5,000), or butcher block ($1,500–$3,500). Quartz is the most popular mid-range choice.' },
              { title: 'Flooring', desc: 'LVP ($2,000–$4,000), ceramic tile ($2,500–$5,000), or hardwood ($3,500–$7,000) for an average kitchen. LVP is most common in Bowmanville renovations.' },
              { title: 'Appliances', desc: 'New appliance package (fridge, stove, dishwasher) adds $2,500–$8,000+ depending on brand and features.' },
              { title: 'Plumbing & Electrical', desc: 'New sink and faucet ($500–$2,000), under-cabinet lighting ($500–$1,500), pot lights ($1,000–$2,500). Additional electrical for island outlets or hood fans adds cost.' },
              { title: 'Labour', desc: 'General contractor labour for demo, installation, and finishing typically runs $5,000–$15,000 depending on scope. Bowmanville labour is 15–18% below Toronto rates.' },
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Bowmanville Kitchen Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready for Your Bowmanville Kitchen Renovation?</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate and connect with verified Bowmanville kitchen contractors. No fees, no commitments.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Bowmanville Hub', href: '/bowmanville' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Kitchen Renovation Toronto', href: '/toronto-kitchen-renovation' },
              { label: 'Painting Bowmanville', href: '/painting-bowmanville' },
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
