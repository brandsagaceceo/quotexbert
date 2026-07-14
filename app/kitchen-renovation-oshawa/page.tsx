import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitchen Renovation in Oshawa | 2025 Costs & Contractors | QuoteXbert',
  description:
    "Kitchen renovation in Oshawa, Ontario. Durham Region's largest city — kitchens average $17,000–$50,000, 15% below Toronto. AI estimates + verified local contractors. Free for homeowners.",
  keywords: [
    'kitchen renovation Oshawa',
    'Oshawa kitchen remodel',
    'kitchen contractors Oshawa Ontario',
    'kitchen renovation cost Oshawa',
    'Oshawa kitchen renovation 2025',
    'Durham Region kitchen renovation',
  ],
  openGraph: {
    title: 'Kitchen Renovation in Oshawa | Costs & Contractors | QuoteXbert',
    description: "Oshawa kitchen renovations: $17,000–$50,000. AI estimates + verified contractors. 15% below Toronto.",
    url: 'https://www.quotexbert.com/kitchen-renovation-oshawa',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Kitchen Renovation Oshawa | QuoteXbert', description: 'Kitchen renovation cost guide for Oshawa. Free AI estimate in minutes.' },
  alternates: { canonical: 'https://www.quotexbert.com/kitchen-renovation-oshawa' },
};

const kitchenTiers = [
  {
    name: 'Budget Refresh',
    cost: '$17,000 – $26,000',
    desc: 'Cabinet refacing or stock cabinets, laminate countertops, new hardware, backsplash tile, fresh paint, updated appliances. Ideal for Oshawa\'s 1970s–1980s homes where bones are good.',
  },
  {
    name: 'Mid-Range Renovation',
    cost: '$26,000 – $42,000',
    desc: 'Semi-custom cabinets, quartz countertops, LVP flooring, tile backsplash, pot lights, new stainless appliances. The most popular Oshawa kitchen renovation range.',
  },
  {
    name: 'Full Custom Renovation',
    cost: '$42,000 – $65,000+',
    desc: 'Custom cabinetry, premium countertops, engineered hardwood, kitchen island, high-end appliances. Common in Windfields, Kedron, and newer north Oshawa communities.',
  },
];

const oshawaNeighbourhoods = [
  { area: 'Lakeview & Harbour', note: 'Older 1950s–1960s homes — full gut renovations most common' },
  { area: 'McLaughlin & Centennial', note: '1970s–1980s kitchens ripe for mid-range updates' },
  { area: "O'Neill & Eastdale", note: '1960s–1970s character homes — galley kitchens often opened up' },
  { area: 'Samac & Pinecrest', note: '1990s colonials — good bones, often just need cosmetic refresh' },
  { area: 'Windfields & Kedron', note: 'Newer 2000s–2010s builds — first full renovation cycle starting' },
];

const costBreakdown = [
  { item: 'Cabinets (stock)', range: '$4,000 – $8,000' },
  { item: 'Cabinets (semi-custom)', range: '$9,000 – $18,000' },
  { item: 'Quartz countertops', range: '$2,800 – $6,500' },
  { item: 'Backsplash tile (installed)', range: '$800 – $2,500' },
  { item: 'LVP flooring (kitchen)', range: '$1,200 – $3,000' },
  { item: 'Appliance package', range: '$2,500 – $7,000' },
  { item: 'Plumbing fixtures', range: '$400 – $1,200' },
  { item: 'Electrical / pot lights', range: '$800 – $2,500' },
  { item: 'Labour (general)', range: '$5,000 – $12,000' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Oshawa in 2025?',
    a: 'A kitchen renovation in Oshawa costs $17,000–$65,000+ depending on scope. The most common mid-range renovation (semi-custom cabinets, quartz countertops, LVP flooring, new appliances) averages $28,000–$40,000. Oshawa rates are approximately 15% below Toronto core — the same renovation costs $35,000–$50,000 in downtown Toronto.',
  },
  {
    q: 'What kitchen styles are popular in Oshawa?',
    a: "Transitional kitchens (a blend of classic and contemporary) are most popular in Oshawa's established neighbourhoods like McLaughlin and Centennial. Newer north Oshawa communities like Windfields and Kedron tend toward cleaner contemporary and Shaker styles. White and grey cabinets remain dominant choices.",
  },
  {
    q: 'Do I need a permit for a kitchen renovation in Oshawa?',
    a: "In Oshawa, a building permit is required for kitchen renovations that involve moving plumbing, upgrading the electrical panel, or making structural changes (removing walls). Cosmetic work — new cabinets, countertops, appliances, flooring — generally doesn't require a permit. Contact Oshawa Building Services at 905-436-3311 to confirm your specific project.",
  },
  {
    q: 'How long does a kitchen renovation take in Oshawa?',
    a: "Most Oshawa kitchen renovations take 4–8 weeks once construction begins. Add 2–4 weeks for planning and material ordering (cabinets have 6–8 week lead times), plus 3–5 weeks if a permit is required. Book contractors early — Oshawa kitchens are in high demand from April through September.",
  },
  {
    q: 'What is the ROI on a kitchen renovation in Oshawa?',
    a: "Kitchen renovations in Oshawa typically return 60–78% of renovation cost on resale in the current market. Given Durham Region's continued price appreciation, a well-executed mid-range kitchen renovation often returns more than the percentage estimate suggests. Oshawa buyers consistently cite updated kitchens as a top purchase motivator.",
  },
];

export default function KitchenRenovationOshawaPage() {
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
            <Link href="/oshawa" className="hover:text-rose-600">Oshawa</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Kitchen Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Kitchen Renovation<br />in Oshawa, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Oshawa is Durham Region&apos;s largest city — and its kitchen renovation market is active.
              Costs average <strong>$17,000–$65,000</strong>, roughly 15% below Toronto for comparable quality.
              Get a free AI estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Oshawa Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Oshawa Kitchen Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Tiers */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Oshawa Kitchen Renovation Costs</h2>
          <p className="text-center text-gray-600 mb-8">Three renovation levels — all at Oshawa&apos;s local market rates</p>
          <div className="grid md:grid-cols-3 gap-6">
            {kitchenTiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-black text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{tier.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Breakdown */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Line-by-Line Cost Breakdown (Oshawa)</h2>
          <p className="text-center text-gray-600 mb-8">What each component costs in Oshawa&apos;s market</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {costBreakdown.map((item) => (
              <div key={item.item} className="bg-white rounded-lg p-4 border border-gray-200 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.item}</span>
                <span className="text-sm font-black text-rose-700 ml-4">{item.range}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">* Oshawa labour rates are approximately 15% below Toronto. Material costs are similar across the GTA.</p>
        </div>
      </section>

      {/* Neighbourhood Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Oshawa Kitchen Renovations by Neighbourhood</h2>
          <p className="text-center text-gray-600 mb-8">Different neighbourhoods have different kitchen renovation needs</p>
          <div className="space-y-4">
            {oshawaNeighbourhoods.map((n) => (
              <div key={n.area} className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-start gap-4">
                <Home className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{n.area}</h3>
                  <p className="text-sm text-gray-600">{n.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Oshawa Kitchen Renovation FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Oshawa Kitchen Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate calibrated to Oshawa&apos;s local market. Verified kitchen contractors who serve Oshawa and Durham Region.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Oshawa Hub', href: '/oshawa' },
              { label: 'Bathroom Renovation Oshawa', href: '/bathroom-renovation-oshawa' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Drywall Oshawa', href: '/drywall-oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Kitchen Renovation Whitby', href: '/kitchen-renovation-whitby' },
              { label: 'Kitchen Renovation Ajax', href: '/kitchen-renovation-ajax' },
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
