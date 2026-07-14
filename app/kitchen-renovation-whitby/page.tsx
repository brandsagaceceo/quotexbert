import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitchen Renovation in Whitby | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Kitchen renovation in Whitby, Ontario. One of Durham Region\'s fastest-growing cities — kitchens average $18,000–$52,000. AI estimates + verified local contractors.',
  keywords: [
    'kitchen renovation Whitby',
    'Whitby kitchen remodel',
    'kitchen contractors Whitby Ontario',
    'kitchen renovation cost Whitby',
    'Brooklin kitchen renovation',
    'Durham Region kitchen renovation',
  ],
  openGraph: {
    title: 'Kitchen Renovation in Whitby | Costs & Contractors | QuoteXbert',
    description: 'Whitby kitchen renovations: $18,000–$52,000. AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/kitchen-renovation-whitby',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Kitchen Renovation Whitby | QuoteXbert', description: 'Kitchen renovation cost guide for Whitby, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/kitchen-renovation-whitby' },
};

const kitchenTiers = [
  {
    name: 'Budget Refresh',
    cost: '$18,000 – $27,000',
    desc: 'Cabinet refacing, laminate countertops, hardware swap, paint, updated fixtures. Best for Whitby\'s 1980s–1990s colonials where layout is solid.',
  },
  {
    name: 'Mid-Range Renovation',
    cost: '$27,000 – $43,000',
    desc: 'Semi-custom Shaker cabinets, quartz countertops, LVP or engineered hardwood flooring, subway backsplash, pot lights. Most popular in Whitby.',
  },
  {
    name: 'Premium Renovation',
    cost: '$43,000 – $68,000+',
    desc: 'Custom cabinetry, waterfall quartz island, built-in appliances, engineered hardwood, open-concept layout. Popular in Brooklin\'s newer executive homes.',
  },
];

const whitbyNeighbourhoods = [
  { area: 'Rolling Acres & Blue Grass Meadows', note: '1980s backsplits and sidesplits — galley kitchens frequently opened to dining areas' },
  { area: 'Pringle Creek & Williamsburg', note: '1990s–2000s colonials — mid-range renovations common; quartz and new cabinets most popular' },
  { area: 'Brooklin (North Whitby)', note: "2010s–present new builds — homeowners' first kitchen refresh; often adding island and upgrading appliances" },
  { area: 'Port Whitby & Downtown', note: 'Mix of older and newer homes near Lake Ontario — full renovations with layout changes more common' },
  { area: 'Lynde Creek & Taunton North', note: '2000s homes coming up for first renovation cycle — quartz countertop upgrades most requested' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Whitby in 2025?',
    a: 'A kitchen renovation in Whitby costs $18,000–$68,000+ depending on scope. The most popular mid-range project (semi-custom Shaker cabinets, quartz countertops, new flooring, updated appliances) averages $30,000–$44,000 in Whitby. Rates are approximately 14–17% below Toronto core.',
  },
  {
    q: 'Are there kitchen contractors in Brooklin, Whitby?',
    a: "Yes — most kitchen renovation contractors who serve Whitby also cover Brooklin, which is part of the Town of Whitby. Brooklin's newer housing stock (post-2010) typically needs first-cycle upgrades: islands added, appliance upgrades, and countertop/backsplash improvements.",
  },
  {
    q: 'What kitchen renovation trends are popular in Whitby right now?',
    a: 'Whitby homeowners currently favour: two-tone cabinetry (white uppers, navy or charcoal lowers), large-format backsplash tile, quartz waterfall islands, built-in pantry systems, and black matte fixtures. Open-concept layout changes (removing kitchen-to-dining walls) remain popular in 1980s–1990s homes.',
  },
  {
    q: 'How do I find a kitchen contractor in Whitby?',
    a: "QuoteXbert connects Whitby homeowners with verified, licensed kitchen contractors who serve the town. Upload photos of your current kitchen, describe the scope, and get a free AI estimate. You'll see verified contractors in the Whitby and Durham Region market who can provide detailed quotes.",
  },
];

export default function KitchenRenovationWhitbyPage() {
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
            <span className="text-gray-900 font-medium">Kitchen Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Kitchen Renovation<br />in Whitby, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Whitby is one of Durham Region&apos;s fastest-growing cities — and its kitchen renovation market reflects that energy.
              From 1980s rolling acres to Brooklin&apos;s new builds, every Whitby kitchen has its season.
              Costs average <strong>$18,000–$68,000</strong>.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Whitby Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Whitby Kitchen Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Whitby Kitchen Renovation Costs</h2>
          <p className="text-center text-gray-600 mb-8">Three levels for Whitby homeowners — including Brooklin</p>
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

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Kitchen Renovation by Whitby Neighbourhood</h2>
          <p className="text-center text-gray-600 mb-8">Each Whitby neighbourhood has distinct housing stock and renovation needs</p>
          <div className="space-y-4">
            {whitbyNeighbourhoods.map((n) => (
              <div key={n.area} className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-4">
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

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Whitby Kitchen Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready to Renovate Your Whitby Kitchen?</h2>
          <p className="text-rose-100 text-lg mb-8">AI estimate calibrated to Whitby&apos;s local market. Verified kitchen contractors. Free for homeowners.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Whitby Hub', href: '/whitby' },
              { label: 'Bathroom Renovation Whitby', href: '/bathroom-renovation-whitby' },
              { label: 'Deck Builders Whitby', href: '/deck-builders-whitby' },
              { label: 'Kitchen Renovation Oshawa', href: '/kitchen-renovation-oshawa' },
              { label: 'Kitchen Renovation Ajax', href: '/kitchen-renovation-ajax' },
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
