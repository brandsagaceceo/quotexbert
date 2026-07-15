import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Newcastle | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Newcastle, Ontario. Part of Clarington, Durham Region. Verified local contractors for kitchen, bathroom, and basement renovations.',
  keywords: [
    'Newcastle Ontario contractors',
    'Newcastle renovation estimates',
    'home renovation Newcastle Ontario',
    'Clarington renovation',
    'Durham Region contractors Newcastle',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Newcastle | QuoteXbert',
    description: 'AI renovation estimates for Newcastle, Ontario homeowners. Verified Clarington contractors. Free.',
    url: 'https://www.quotexbert.com/newcastle',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Newcastle | QuoteXbert',
    description: 'Instant AI renovation estimates for Newcastle, Ontario. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/newcastle',
  },
};

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$15,000 – $38,000', duration: '4–7 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$8,500 – $19,000', duration: '2–3 weeks', savings: '~15% below Toronto' },
  { name: 'Basement Finishing', avgCost: '$20,000 – $48,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$6,500 – $16,000', duration: '1–2 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$7,000 – $14,000', duration: '2–4 days', savings: '~15% below Toronto' },
  { name: 'Painting (Interior)', avgCost: '$1,800 – $6,000', duration: '3–7 days', savings: '~15% below Toronto' },
];

const faqs = [
  {
    q: 'Where is Newcastle, Ontario?',
    a: 'Newcastle is a charming small town located in the Municipality of Clarington, Durham Region, Ontario. It sits east of Oshawa and Bowmanville, approximately 90 km east of Toronto. Newcastle features a historic main street, a mix of older Victorian-era homes, and newer residential developments on its outskirts.',
  },
  {
    q: 'How much does a renovation cost in Newcastle?',
    a: 'Renovation costs in Newcastle, Ontario are generally 15–20% below Toronto core pricing. A kitchen renovation runs $15,000–$38,000, bathroom renovations cost $8,500–$19,000, and basement finishing projects average $20,000–$48,000. Rural communities like Newcastle can sometimes have slightly lower labour rates than larger Durham cities.',
  },
  {
    q: 'Are there contractors who serve Newcastle specifically?',
    a: "Yes — QuoteXbert connects Newcastle homeowners with contractors who serve Clarington and east Durham Region. Many Bowmanville-based contractors operate throughout Clarington including Newcastle, and some contractors are based in Newcastle itself.",
  },
  {
    q: 'What types of renovations are most popular in Newcastle?',
    a: "Newcastle homeowners most commonly pursue kitchen updates, bathroom renovations, and basement finishing. The town's older Victorian and post-war homes often need window replacements, siding updates, and roof replacements. Newer subdivision homes on the outskirts typically need basement finishing and deck construction.",
  },
];

export default function NewcastlePage() {
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
            <Link href="/clarington" className="hover:text-rose-600">Clarington</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Newcastle</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Newcastle &amp; East Clarington</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Renovation Estimates<br />in Newcastle, Ontario
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Newcastle is one of Clarington&apos;s most charming communities — and home renovation costs here are
              significantly lower than the GTA. Get an AI-powered estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Durham Contractors</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>&lt;3 min Estimates</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                📸 Get My Free Newcastle Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Renovation Projects in Newcastle</h2>
          <p className="text-center text-gray-600 mb-8">Local renovation costs for Newcastle, Ontario homeowners</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                </div>
                <p className="text-rose-700 font-black text-lg mb-1">{project.avgCost}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {project.duration}</span>
                  <span className="text-green-600 font-semibold text-xs">{project.savings}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Newcastle */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">About Newcastle, Ontario</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Community Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                Newcastle is a historic small town on the Lake Ontario shoreline within the Municipality of Clarington.
                Known for its walkable downtown, heritage architecture, and strong community spirit, Newcastle has attracted
                families seeking a quieter lifestyle within commuting distance of Oshawa and Toronto.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Housing &amp; Renovation Trends</h3>
              <p className="text-gray-600 leading-relaxed">
                Newcastle features a mix of older Victorian and century homes in its historic core, plus newer subdivisions
                on the north and east edges. Older homes benefit from full kitchen and bathroom renovations, window replacements,
                and roofing. Newer builds commonly need basement finishing and landscaping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Newcastle Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready to Renovate in Newcastle?</h2>
          <p className="text-rose-100 text-lg mb-8">
            Get a free AI-powered estimate in minutes. No calls, no commitments.
            Connect with verified contractors who serve Newcastle and Clarington.
          </p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">
            Get My Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Clarington Hub', href: '/clarington' },
              { label: 'Bowmanville', href: '/bowmanville' },
              { label: 'Courtice', href: '/courtice' },
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
