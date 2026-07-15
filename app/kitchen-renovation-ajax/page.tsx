import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitchen Renovation in Ajax | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Kitchen renovation in Ajax, Ontario. Family-friendly Durham Region city — kitchens average $17,000–$48,000. AI estimates + verified local contractors. Free for homeowners.',
  keywords: [
    'kitchen renovation Ajax',
    'Ajax kitchen remodel',
    'kitchen contractors Ajax Ontario',
    'kitchen renovation cost Ajax',
    'Durham Region kitchen renovation',
  ],
  openGraph: {
    title: 'Kitchen Renovation in Ajax | Costs & Contractors | QuoteXbert',
    description: 'Ajax kitchen renovations: $17,000–$48,000. AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/kitchen-renovation-ajax',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Kitchen Renovation Ajax | QuoteXbert', description: 'Kitchen renovation cost guide for Ajax, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/kitchen-renovation-ajax' },
};

const kitchenTiers = [
  {
    name: 'Practical Refresh',
    cost: '$17,000 – $26,000',
    desc: 'Stock cabinets or refacing, laminate or quartz countertops, updated backsplash, new hardware and fixtures. Great for Ajax\'s older 1980s–1990s homes.',
  },
  {
    name: 'Mid-Range Renovation',
    cost: '$26,000 – $40,000',
    desc: 'Semi-custom cabinets, quartz countertops, tile backsplash, LVP flooring, pot lights, stainless appliances. The most popular choice for Ajax families.',
  },
  {
    name: 'Premium Renovation',
    cost: '$40,000 – $60,000+',
    desc: 'Custom cabinetry, quartz island, engineered hardwood, high-end appliances, open-concept conversion. Found in Ajax\'s larger two-storey family homes.',
  },
];

const ajaxAreas = [
  { area: 'Pickering Village & South Ajax', note: '1980s–1990s two-storey homes — kitchen-dining room walls frequently removed for open-concept' },
  { area: 'Salem & Central Ajax', note: '1990s–2000s semi-detached and detached homes — mid-range cabinet and countertop refreshes popular' },
  { area: 'Northeast Ajax (Riverside Gate, Audley)', note: 'Newer 2005–2015 homes — first major renovation cycle; islands and appliance upgrades most common' },
  { area: 'Westney Heights & Village South', note: 'Mix of townhomes and detached — budget to mid-range renovations; efficient layouts prioritized' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Ajax?',
    a: "A kitchen renovation in Ajax typically costs $17,000–$60,000+. A mid-range renovation — semi-custom cabinets, quartz countertops, tile backsplash, updated flooring, new appliances — averages $27,000–$38,000 in Ajax. The town's rates are roughly 14–16% below Toronto core for comparable work.",
  },
  {
    q: 'Are Ajax kitchen renovations cheaper than Toronto?',
    a: "Yes — kitchen renovation labour rates in Ajax are approximately 14–16% below downtown Toronto. The same mid-range kitchen that costs $40,000 in Toronto typically runs $34,000–$36,000 in Ajax. Material costs are similar across the GTA; the savings come primarily from lower contractor overhead.",
  },
  {
    q: 'How do Ajax kitchen contractors differ from Toronto contractors?',
    a: "Many Ajax kitchen contractors are long-standing local businesses familiar with the town's housing stock — particularly the mix of 1980s–2000s two-storey homes that dominate Ajax's neighbourhoods. They understand local permit requirements (Town of Ajax Building Services, 905-619-2529), typical kitchen layouts, and have established supplier relationships in Durham Region.",
  },
  {
    q: 'What kitchen features are Ajax homeowners requesting most in 2025?',
    a: "Ajax families in 2025 are most commonly requesting: removing the wall between kitchen and dining room for open-concept living, adding a kitchen island with seating, upgrading to quartz countertops, and adding under-cabinet lighting. Two-tone cabinetry (lighter uppers, darker lowers) is increasingly popular.",
  },
];

export default function KitchenRenovationAjaxPage() {
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
            <span className="text-gray-900 font-medium">Kitchen Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Kitchen Renovation<br />in Ajax, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ajax is a family-oriented Durham Region city with strong renovation demand.
              Kitchen costs average <strong>$17,000–$60,000</strong> — significantly below Toronto
              for the same quality. Free AI estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Ajax Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Ajax Kitchen Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Ajax Kitchen Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
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

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Ajax Kitchen Renovation by Area</h2>
          <div className="space-y-4">
            {ajaxAreas.map((a) => (
              <div key={a.area} className="bg-white rounded-xl p-5 border border-slate-200 flex items-start gap-4">
                <Home className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{a.area}</h3>
                  <p className="text-sm text-gray-600">{a.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Kitchen Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Ajax Kitchen Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate for Ajax homeowners. Verified contractors who serve Ajax and Durham Region.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Ajax Hub', href: '/ajax' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
              { label: 'Basement Renovation Ajax', href: '/basement-renovation-ajax' },
              { label: 'Flooring Ajax', href: '/flooring-ajax' },
              { label: 'Kitchen Renovation Oshawa', href: '/kitchen-renovation-oshawa' },
              { label: 'Kitchen Renovation Whitby', href: '/kitchen-renovation-whitby' },
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
