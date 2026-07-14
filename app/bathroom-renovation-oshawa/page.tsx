import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation in Oshawa | 2025 Costs & Contractors | QuoteXbert',
  description:
    "Bathroom renovation in Oshawa, Ontario. Durham Region's largest city — bathrooms average $9,500–$28,000. 15% below Toronto rates. AI estimates + verified local contractors.",
  keywords: [
    'bathroom renovation Oshawa',
    'Oshawa bathroom remodel',
    'bathroom contractors Oshawa Ontario',
    'bathroom renovation cost Oshawa 2025',
    'Durham Region bathroom renovation',
  ],
  openGraph: {
    title: 'Bathroom Renovation in Oshawa | 2025 Costs | QuoteXbert',
    description: 'Oshawa bathroom renovations: $9,500–$28,000. AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/bathroom-renovation-oshawa',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Bathroom Renovation Oshawa | QuoteXbert', description: 'Bathroom renovation cost guide for Oshawa. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-oshawa' },
};

const bathroomTiers = [
  {
    name: 'Powder Room / Half-Bath',
    cost: '$4,200 – $8,500',
    desc: 'New vanity, toilet, tile floor, mirror, light fixture, and paint. Common quick update in Oshawa\'s older homes.',
  },
  {
    name: 'Standard Full Bathroom',
    cost: '$9,500 – $18,000',
    desc: 'Full gut renovation: new tile floor and tub surround, vanity, toilet, tub or shower, lighting. The most common Oshawa bathroom project.',
  },
  {
    name: 'Master En-Suite',
    cost: '$17,000 – $30,000',
    desc: 'Frameless glass shower, double vanity, heated floors, large-format tile. Popular in Oshawa\'s newer north-end homes.',
  },
];

const oshawaHomeNotes = [
  { era: '1950s–1960s (Lakeview, Harbour)', issue: 'Often have original small bathrooms needing full gut. Plumbing updates likely required. Budget extra for surprises.' },
  { era: '1970s–1980s (McLaughlin, Centennial)', issue: 'Common 4-piece bathrooms that benefit from tile updates, new vanity, and fixture upgrades.' },
  { era: '1990s (Samac, Pinecrest)', issue: '5-piece main baths with garden tubs — often updated by replacing with large walk-in showers.' },
  { era: '2000s+ (Windfields, Kedron)', issue: 'First renovation cycle — luxury vinyl plank floors, glass shower enclosures, and double vanities most popular.' },
];

const faqs = [
  {
    q: 'How much does a bathroom renovation cost in Oshawa?',
    a: 'A standard full bathroom renovation in Oshawa costs between $9,500 and $18,000. A mid-range renovation (new tile floor, tub surround, vanity, toilet, updated lighting and fixtures) typically runs $11,000–$15,000. En-suite renovations with premium finishes cost $17,000–$30,000. Rates are approximately 15% below Toronto core.',
  },
  {
    q: 'What bathroom trends are popular in Oshawa right now?',
    a: 'In 2025, Oshawa homeowners are most commonly requesting: large-format porcelain tiles (600×600mm and up), frameless glass shower enclosures (replacing old tub combos), floating vanities, and rainfall shower heads. Walk-in showers without bathtubs are increasingly popular as Oshawa\'s population skews younger.',
  },
  {
    q: 'How long does a bathroom renovation take in Oshawa?',
    a: 'A standard bathroom renovation in Oshawa takes 2–4 weeks once work begins. Master en-suite projects with complex tile work and custom glass can take 4–6 weeks. Always confirm a detailed schedule with your contractor before signing. Oshawa Building Services (905-436-3311) processes permits in approximately 3–5 business days for straightforward bathroom projects.',
  },
  {
    q: 'Should I add a bathroom to my Oshawa home?',
    a: "Adding a second bathroom to an Oshawa home that only has one full bathroom is typically an excellent investment. In Oshawa's current market, adding a bathroom can return 90–110% of cost in added home value. The investment is especially strong for homes with 3+ bedrooms sharing one bathroom.",
  },
];

export default function BathroomRenovationOshawaPage() {
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
            <span className="text-gray-900 font-medium">Bathroom Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Bathroom Renovation<br />in Oshawa, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Oshawa bathroom renovations cost <strong>$9,500–$30,000</strong> — 15% below Toronto
              for comparable work. Whether you&apos;re updating a 1970s 4-piece or adding an en-suite,
              get a free AI estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Oshawa Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Oshawa Bathroom Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Oshawa Bathroom Renovation Costs</h2>
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

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Bathroom Needs by Oshawa Home Era</h2>
          <div className="space-y-4">
            {oshawaHomeNotes.map((n) => (
              <div key={n.era} className="bg-white rounded-xl p-5 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-1">{n.era}</h3>
                <p className="text-sm text-gray-600">{n.issue}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Oshawa Bathroom Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Oshawa Bathroom Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate for Oshawa homeowners. Verified bathroom contractors who serve Oshawa and Durham Region.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Oshawa Hub', href: '/oshawa' },
              { label: 'Kitchen Renovation Oshawa', href: '/kitchen-renovation-oshawa' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Bathroom Renovation Whitby', href: '/bathroom-renovation-whitby' },
              { label: 'Bathroom Renovation Courtice', href: '/bathroom-renovation-courtice' },
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
