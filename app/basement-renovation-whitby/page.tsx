import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Basement Renovation in Whitby | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Basement renovation in Whitby, Ontario. Finishing, legal suites & rec rooms — $23,000–$65,000. Brooklin & all Whitby neighbourhoods. AI estimates + verified local contractors.',
  keywords: [
    'basement renovation Whitby',
    'Whitby basement finishing',
    'basement contractors Whitby Ontario',
    'basement renovation cost Whitby',
    'Whitby basement apartment',
    'Brooklin basement finishing',
  ],
  openGraph: {
    title: 'Basement Renovation in Whitby | 2025 Costs | QuoteXbert',
    description: 'Whitby basement renovations: $23,000–$65,000. Legal suites, rec rooms, home offices. AI estimates.',
    url: 'https://www.quotexbert.com/basement-renovation-whitby',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Basement Renovation Whitby | QuoteXbert', description: 'Basement renovation cost guide for Whitby. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/basement-renovation-whitby' },
};

const basementTypes = [
  {
    name: 'Open-Concept Finish',
    cost: '$23,000 – $38,000',
    desc: 'Insulation, drywall, LVP flooring, pot lights, electrical, paint. One open rec room or office space. Most common in Whitby\'s newer homes.',
  },
  {
    name: 'With Bedroom & Bathroom',
    cost: '$34,000 – $52,000',
    desc: 'Same as open-concept plus one enclosed bedroom and 3-piece bathroom. Adds both living space and future rental value.',
  },
  {
    name: 'Legal Rental Suite',
    cost: '$45,000 – $68,000+',
    desc: 'Full secondary suite with kitchen, bathroom, separate entrance. Requires Town of Whitby permit. Income-generating asset.',
  },
];

const whitbyBasementNotes = [
  {
    title: 'New Builds in Brooklin',
    note: "Brooklin's post-2010 homes have spacious unfinished basements — the most popular Whitby renovation. Typically 700–900 sq ft of high-ceiling space ideal for legal suite or family rec room.",
  },
  {
    title: '1980s–1990s Homes (Rolling Acres, Blue Grass)',
    note: 'These homes have basements that were often partially started by previous owners. Full professional finish with proper insulation and vapour barrier is the most important first step.',
  },
  {
    title: 'Townhomes (Various Areas)',
    note: "Whitby townhomes have basements ranging from 500–700 sq ft. Full finish adds significant value in Whitby's townhome market, especially as a home office or guest suite.",
  },
];

const faqs = [
  {
    q: 'How much does it cost to finish a basement in Whitby?',
    a: "Finishing a basement in Whitby costs $23,000–$68,000+ depending on scope. A straightforward open-concept finish runs $23,000–$38,000. Adding a bathroom and bedroom brings it to $34,000–$52,000. A legal rental suite costs $45,000–$68,000+. Whitby rates are approximately 14–16% below Toronto core.",
  },
  {
    q: 'Is finishing a basement in Whitby worth it?',
    a: "Yes — especially for Brooklin and newer Whitby developments where large unfinished basements represent significant untapped value. A $40,000 basement finish in Whitby typically adds $55,000–$70,000 in market value. As a legal rental suite generating $1,600–$1,900/month, a $55,000 investment breaks even in under 3 years.",
  },
  {
    q: 'Do I need a permit to finish my basement in Whitby?',
    a: "Yes — the Town of Whitby requires building permits for basement finishing work including framing, electrical, plumbing, and secondary suite creation. Contact Town of Whitby Building Services at 905-430-4300. Permit costs typically run $500–$2,000 for basement projects.",
  },
  {
    q: 'How long does a basement renovation take in Whitby?',
    a: 'A standard Whitby basement renovation takes 6–10 weeks for construction. Permit approval from Town of Whitby adds 2–4 weeks before work can begin. A legal rental suite with separate entrance typically takes 10–14 weeks total. Plan ahead — Whitby contractors are busy from May through September.',
  },
];

export default function BasementRenovationWhitbyPage() {
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
            <span className="text-gray-900 font-medium">Basement Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Basement Renovation<br />in Whitby, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Whitby basement renovations average <strong>$23,000–$68,000+</strong>.
              Brooklin&apos;s large new-build basements are among Durham Region&apos;s best opportunities.
              Free AI estimate in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Whitby Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Whitby Basement Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Whitby Basement Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {basementTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3"><Wrench className="w-5 h-5 text-rose-600" /></div>
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
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Whitby Basement Types &amp; Considerations</h2>
          <div className="space-y-5">
            {whitbyBasementNotes.map((n) => (
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Whitby Basement Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Whitby Basement Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Whitby basement contractors. No commitment required.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Whitby Hub', href: '/whitby' },
              { label: 'Kitchen Renovation Whitby', href: '/kitchen-renovation-whitby' },
              { label: 'Bathroom Renovation Whitby', href: '/bathroom-renovation-whitby' },
              { label: 'Basement Renovation Ajax', href: '/basement-renovation-ajax' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Should You Finish Your Basement?', href: '/blog/should-you-finish-your-basement' },
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
