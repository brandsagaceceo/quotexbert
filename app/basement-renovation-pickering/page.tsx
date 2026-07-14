import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Basement Renovation in Pickering | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Basement renovation in Pickering, Ontario. From Bay Ridges to Seaton — $23,000–$65,000. Legal suites & rec rooms. AI estimates + verified local contractors.',
  keywords: [
    'basement renovation Pickering',
    'Pickering basement finishing',
    'basement contractors Pickering Ontario',
    'basement renovation cost Pickering',
    'Seaton basement finishing',
    'Durham Region basement renovation',
  ],
  openGraph: {
    title: 'Basement Renovation in Pickering | 2025 Costs | QuoteXbert',
    description: 'Pickering basement renovations: $23,000–$65,000. Bay Ridges to Seaton — AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/basement-renovation-pickering',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Basement Renovation Pickering | QuoteXbert', description: 'Basement renovation cost guide for Pickering. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/basement-renovation-pickering' },
};

const basementTypes = [
  {
    name: 'Open-Concept Finish',
    cost: '$23,000 – $37,000',
    desc: 'Insulation, drywall, LVP flooring, pot lights, electrical. One open rec room, gym, or family space. Most common Pickering basement project.',
  },
  {
    name: 'With Bedroom & Bathroom',
    cost: '$33,000 – $53,000',
    desc: 'Open-concept finish plus bedroom and 3-piece bathroom. Excellent choice for Pickering\'s growing families needing extra space.',
  },
  {
    name: 'Legal Rental Suite',
    cost: '$44,000 – $67,000+',
    desc: 'Full secondary suite: kitchen, bathroom, separate entrance. Pickering\'s proximity to Toronto makes rental suites highly attractive to tenants.',
  },
];

const pickeringBasementNotes = [
  {
    title: 'Seaton New Builds',
    note: "Seaton homeowners frequently purchase homes with unfinished basements. Basement finishing is the #1 renovation request in Seaton. High ceilings and clean concrete make these basements excellent candidates for fast, efficient finishing.",
  },
  {
    title: 'Bay Ridges & Dunbarton (Older Homes)',
    note: "1960s–1980s Pickering homes near the waterfront often have lower ceilings and older plumbing. Assess ceiling height before planning — you need minimum 1.95m (6'5\") for livable space. These basements can have moisture issues that must be addressed first.",
  },
  {
    title: 'Duffin Heights (Mid-2000s Homes)',
    note: 'These homes frequently have partially finished or builder-started basements. Completing a professional finish is often more cost-effective than starting from scratch — get an assessment before pricing.',
  },
];

const faqs = [
  {
    q: 'How much does basement finishing cost in Pickering?',
    a: "Basement finishing in Pickering costs $23,000–$67,000+ depending on scope. An open-concept finish runs $23,000–$37,000. Adding a bedroom and bathroom brings it to $33,000–$53,000. A legal rental suite with separate entrance runs $44,000–$67,000+. Pickering rates are approximately 12–14% below Toronto core.",
  },
  {
    q: 'How valuable is a finished basement in Pickering?',
    a: "Pickering's proximity to Toronto makes finished basements very valuable. A $40,000 basement finish typically adds $60,000–$80,000 in market value. As a rental suite, it generates $1,600–$2,000/month given Pickering's strong rental demand from Toronto commuters.",
  },
  {
    q: 'What should Seaton homeowners know about basement finishing?',
    a: "Seaton homes have excellent basement finishing potential — typically 750–900 sq ft of high-ceiling, unobstructed space. Most Seaton builders install rough-in plumbing for future bathrooms. Finishing these basements is straightforward and cost-effective. Get an estimate before your Seaton home fully appreciates.",
  },
  {
    q: 'Do I need a permit for a basement renovation in Pickering?',
    a: "Yes. City of Pickering Building Services (905-420-4617) requires permits for basement finishing. This includes framing, electrical, and plumbing work. Permit costs typically run $600–$1,800 for basement projects in Pickering, with a 3–6 week approval timeline.",
  },
];

export default function BasementRenovationPickeringPage() {
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
            <span className="text-gray-900 font-medium">Basement Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Basement Renovation<br />in Pickering, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pickering basement renovations average <strong>$23,000–$67,000+</strong>.
              Seaton&apos;s new builds and Bay Ridges&apos; established homes both offer excellent
              basement renovation opportunities. Free AI estimate in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Pickering Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Pickering Basement Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Pickering Basement Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {basementTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{type.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{type.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Pickering Basement Types &amp; Considerations</h2>
          <div className="space-y-5">
            {pickeringBasementNotes.map((n) => (
              <div key={n.title} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-2">{n.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{n.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Pickering Basement Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Pickering Basement Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate calibrated to Pickering&apos;s market. Verified basement contractors. No commitment.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Pickering Hub', href: '/pickering' },
              { label: 'Kitchen Renovation Pickering', href: '/kitchen-renovation-pickering' },
              { label: 'Bathroom Renovation Pickering', href: '/bathroom-renovation-pickering' },
              { label: 'Basement Renovation Ajax', href: '/basement-renovation-ajax' },
              { label: 'Basement Renovation Whitby', href: '/basement-renovation-whitby' },
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
