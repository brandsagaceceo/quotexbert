import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Scugog | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Scugog Township, Ontario. Serving Port Perry, Blackstock, Prince Albert & surrounding communities. Verified Durham Region contractors.',
  keywords: [
    'Scugog contractors',
    'Scugog Township renovation',
    'Port Perry contractors',
    'home renovation Scugog Ontario',
    'Durham Region rural renovation',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Scugog Township | QuoteXbert',
    description: 'AI renovation estimates for Scugog Township homeowners including Port Perry. Verified local contractors.',
    url: 'https://www.quotexbert.com/scugog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Scugog | QuoteXbert',
    description: 'AI renovation estimates for Scugog Township, Ontario. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/scugog',
  },
};

const scugogCommunities = [
  'Port Perry (urban centre)',
  'Blackstock',
  'Prince Albert',
  'Caesarea',
  'Nestleton Station',
  'Seagrave',
  'Utica',
];

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$15,000 – $40,000', duration: '4–8 weeks' },
  { name: 'Bathroom Remodel', avgCost: '$8,500 – $20,000', duration: '2–4 weeks' },
  { name: 'Basement Finishing', avgCost: '$20,000 – $50,000', duration: '6–10 weeks' },
  { name: 'Deck & Patio', avgCost: '$8,000 – $22,000', duration: '1–3 weeks' },
  { name: 'Roof Replacement', avgCost: '$8,000 – $18,000', duration: '2–5 days' },
  { name: 'Rural Property Work', avgCost: 'Varies', duration: 'Varies' },
];

export default function ScugogPage() {
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
            <span className="text-gray-900 font-medium">Scugog Township</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Scugog Township</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Renovation Estimates<br />in Scugog Township
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Scugog Township — home to Port Perry, lakefront properties, and a mix of rural and village communities.
              Get AI-powered renovation estimates and connect with verified contractors who serve the area.
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
                📸 Get My Free Scugog Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Communities in Scugog Township</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {scugogCommunities.map((c) => (
              <span key={c} className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full">{c}</span>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            QuoteXbert serves all Scugog Township communities. Port Perry is the urban hub — but we connect homeowners across the entire township.
          </p>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Renovation Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                </div>
                <p className="text-rose-700 font-black text-lg mb-1">{project.avgCost}</p>
                <span className="flex items-center gap-1 text-sm text-gray-500"><Clock className="w-3.5 h-3.5" /> {project.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Scugog Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate and connect with verified contractors. Free for homeowners.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors">
              Get My Free AI Estimate →
            </Link>
            <Link href="/for-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">
              Claim Contractor Spot
            </Link>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Port Perry', href: '/port-perry' },
              { label: 'Uxbridge', href: '/uxbridge' },
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
