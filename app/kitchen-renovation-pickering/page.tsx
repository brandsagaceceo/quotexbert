import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kitchen Renovation in Pickering | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Kitchen renovation in Pickering, Ontario. Borders Toronto — kitchens average $18,000–$55,000. Seaton & Bay Ridges specialists. AI estimates + verified local contractors.',
  keywords: [
    'kitchen renovation Pickering',
    'Pickering kitchen remodel',
    'kitchen contractors Pickering Ontario',
    'kitchen renovation cost Pickering',
    'Seaton kitchen renovation',
    'Durham Region kitchen renovation',
  ],
  openGraph: {
    title: 'Kitchen Renovation in Pickering | Costs & Contractors | QuoteXbert',
    description: 'Pickering kitchen renovations: $18,000–$55,000. Bay Ridges to Seaton — AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/kitchen-renovation-pickering',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Kitchen Renovation Pickering | QuoteXbert', description: 'Kitchen renovation cost guide for Pickering. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/kitchen-renovation-pickering' },
};

const kitchenTiers = [
  {
    name: 'Cosmetic Refresh',
    cost: '$18,000 – $28,000',
    desc: "Cabinet reface or stock replacement, quartz or laminate countertops, new backsplash and hardware. Popular for Bay Ridges and Liverpool's older homes.",
  },
  {
    name: 'Mid-Range Renovation',
    cost: '$28,000 – $45,000',
    desc: 'Semi-custom cabinets, quartz countertops, LVP flooring, pot lights, stainless appliances, new backsplash. Most popular for Pickering\'s suburban homes.',
  },
  {
    name: 'Full Custom Renovation',
    cost: '$45,000 – $70,000+',
    desc: 'Custom cabinetry, premium countertops, engineered hardwood, smart appliances. Common in Duffin Heights and newer Seaton-adjacent developments.',
  },
];

const pickeringAreas = [
  { area: 'Bay Ridges & Dunbarton', note: "1960s–1980s lakefront-adjacent homes — full kitchen renovations most impactful given age of housing" },
  { area: 'Liverpool & Highbush', note: '1980s–1990s two-storey colonials — mid-range renovations common; open-concept conversions popular' },
  { area: 'Amberlea & Rougemount', note: '1990s–2000s family homes — first major kitchen refresh cycle; quartz countertop and appliance upgrades most requested' },
  { area: 'Duffin Heights', note: '2005–2015 homes coming up for renovation — cabinetry refreshes, island additions, under-cabinet lighting popular' },
  { area: 'Seaton (new development)', note: 'Brand-new builds — basements most in demand; kitchen upgrades typically 5–10 years post-possession' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Pickering in 2025?',
    a: "A kitchen renovation in Pickering costs $18,000–$70,000+ depending on scope. Because Pickering borders Toronto (Scarborough), contractor rates here are 12–15% below Toronto core — slightly less of a discount than Oshawa or Bowmanville but still significant. The most common mid-range kitchen project (semi-custom cabinets, quartz countertops, new flooring) averages $30,000–$43,000.",
  },
  {
    q: 'Are kitchen contractors from Toronto serving Pickering?',
    a: "Yes — many Toronto-area contractors serve Pickering due to its proximity to Scarborough. You'll have access to both Pickering-based contractors and those who travel from the east end of Toronto. This competition generally benefits homeowners with more quotes to compare.",
  },
  {
    q: 'What is unique about kitchen renovation in Pickering vs other Durham cities?',
    a: "Pickering has a broader mix of housing types than other Durham cities — from 1960s bungalows in Bay Ridges to brand-new Seaton townhomes. This means kitchen renovation needs vary significantly by neighbourhood. Bay Ridges homeowners often need full gut renovations; newer Duffin Heights homes typically need targeted upgrades. Always describe your neighbourhood when getting estimates.",
  },
  {
    q: 'Do I need a permit for a kitchen renovation in Pickering?',
    a: "In the City of Pickering, permits are required for kitchen renovations involving structural changes (walls, openings), plumbing relocation, or electrical panel upgrades. Contact Pickering Building Services at 905-420-4617. Cosmetic work (cabinets, countertops, appliances, flooring) generally doesn't require a permit.",
  },
];

export default function KitchenRenovationPickeringPage() {
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
            <span className="text-gray-900 font-medium">Kitchen Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Kitchen Renovation<br />in Pickering, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pickering borders Toronto — giving you access to skilled contractors at
              Durham Region rates, roughly <strong>12–15% below Toronto core</strong>.
              From Bay Ridges bungalows to Duffin Heights colonials — every Pickering kitchen is different.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Pickering Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Pickering Kitchen Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Pickering Kitchen Renovation Costs</h2>
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
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Kitchen Renovation by Pickering Neighbourhood</h2>
          <div className="space-y-4">
            {pickeringAreas.map((a) => (
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Pickering Kitchen Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Pickering Kitchen Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate calibrated to Pickering&apos;s market. Verified kitchen contractors. No commitment.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Pickering Hub', href: '/pickering' },
              { label: 'Bathroom Renovation Pickering', href: '/bathroom-renovation-pickering' },
              { label: 'Roof Replacement Pickering', href: '/roof-replacement-pickering' },
              { label: 'Basement Renovation Pickering', href: '/basement-renovation-pickering' },
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
