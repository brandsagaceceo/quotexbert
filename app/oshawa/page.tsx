import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Oshawa | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Oshawa. Durham Region\'s largest city offers renovation rates 15–20% below Toronto. Compare quotes from verified local contractors.',
  keywords: [
    'Oshawa contractors',
    'Oshawa renovation estimates',
    'Oshawa home renovation costs',
    'Durham Region renovation',
    'Oshawa kitchen renovation',
    'Oshawa bathroom renovation',
    'Oshawa basement finishing',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Oshawa | QuoteXbert',
    description: 'Get AI-powered renovation estimates for Oshawa homes. Rates 15–20% below Toronto. Kitchen, bathroom, basement & more.',
    url: 'https://www.quotexbert.com/oshawa',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/oshawa',
  },
};

const oshawaNeighbourhoods = [
  'Lakeview', 'McLaughlin', 'Centennial', 'O\'Neill', 'Eastdale',
  'Farewell', 'Samac', 'Windfields', 'Kedron', 'Pinecrest',
];

const popularProjects = [
  { name: 'Basement Finishing', avgCost: '$22,000 – $52,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Kitchen Renovation', avgCost: '$17,000 – $42,000', duration: '4–8 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$9,500 – $21,000', duration: '2–4 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$8,000 – $15,000', duration: '2–5 days', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$7,000 – $17,000', duration: '1–3 weeks', savings: '~15% below Toronto' },
  { name: 'Flooring Installation', avgCost: '$2,500 – $10,000', duration: '1–2 weeks', savings: '~15% below Toronto' },
];

export default function OshawaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />

        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Oshawa</span>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Oshawa &amp; Durham Region</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Instant Renovation<br />Estimates in Oshawa
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered renovation estimates tailored to Oshawa&apos;s market.
              Contractor rates in Oshawa are typically <strong>15–20% below Toronto core</strong>.
              Know what&apos;s fair — before you call a single contractor.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>150+ Verified Contractors</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>&lt;3 min Estimates</span>
              </div>
            </div>

            <Link
              href="/#get-estimate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              📸 Upload Photos — Get Free Oshawa Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500">Free · No commitment · Takes 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">Popular Renovation Projects in Oshawa</h2>
          <p className="text-center text-gray-600 mb-8">Typical costs for Oshawa — Durham Region rates are lower than Toronto</p>
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

      {/* Neighbourhoods */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Oshawa Neighbourhoods We Serve</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {oshawaNeighbourhoods.map((n) => (
              <span
                key={n}
                className="bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full shadow-sm"
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Why QuoteXbert */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Oshawa Homeowners Use QuoteXbert</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🤖', title: 'AI Estimate in Minutes', desc: 'Upload photos of your project and get an instant, Oshawa-market-calibrated estimate. No waiting for callbacks.' },
              { icon: '✅', title: 'Verified Durham Contractors', desc: 'Every contractor is licensed, insured, and background-checked. QuoteXbert covers Oshawa and all of Durham Region.' },
              { icon: '💰', title: 'Avoid Overpaying', desc: 'Oshawa contractor rates are lower than Toronto — but you still need a benchmark. Know the fair price before you hire.' },
            ].map((item) => (
              <div key={item.title} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-6 border border-rose-100">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/#get-estimate"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base"
          >
            Get a Free Estimate for Your Oshawa Project →
          </Link>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Whitby Renovation Estimates', href: '/renovation-estimates-whitby' },
              { label: 'Ajax Renovation Estimates', href: '/renovation-estimates-ajax' },
              { label: 'Pickering Renovation Estimates', href: '/renovation-estimates-pickering' },
              { label: 'Clarington & Bowmanville', href: '/clarington' },
              { label: 'Contractors in Oshawa', href: '/contractors/oshawa' },
              { label: 'Blog: Oshawa Renovation Leads', href: '/blog/how-oshawa-contractors-can-get-more-renovation-leads' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
