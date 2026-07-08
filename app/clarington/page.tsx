import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Home, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates Clarington | QuoteXbert',
  description: 'Get instant AI-powered home renovation estimates in Clarington. Serving Bowmanville, Newcastle, Courtice, and surrounding Clarington communities. Free quotes from verified local contractors.',
  keywords: [
    'Clarington contractors',
    'Bowmanville renovation',
    'Newcastle renovation quotes',
    'Courtice home repair',
    'Clarington renovation costs',
    'Durham Region contractors',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Clarington | QuoteXbert',
    description: 'Get instant AI-powered renovation estimates for Clarington, Bowmanville, Newcastle, and Courtice. Verified local contractors. Free for homeowners.',
    url: 'https://www.quotexbert.com/clarington',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/clarington',
  },
};

const claringtonCommunities = [
  { name: 'Bowmanville', note: 'Largest community in Clarington' },
  { name: 'Newcastle', note: 'Growing east Clarington town' },
  { name: 'Courtice', note: 'Fast-growing west Clarington suburb' },
  { name: 'Orono', note: 'Rural village north of Bowmanville' },
  { name: 'Enniskillen', note: 'Rural Clarington community' },
  { name: 'Kendal', note: 'Hamlet in northern Clarington' },
];

const popularProjects = [
  { name: 'Basement Finishing', avgCost: '$22,000 – $50,000', duration: '6–10 weeks' },
  { name: 'Kitchen Renovation', avgCost: '$16,000 – $40,000', duration: '4–8 weeks' },
  { name: 'Bathroom Remodel', avgCost: '$9,000 – $20,000', duration: '2–4 weeks' },
  { name: 'Deck & Patio', avgCost: '$6,500 – $16,000', duration: '1–3 weeks' },
  { name: 'Roof Replacement', avgCost: '$7,500 – $14,000', duration: '2–5 days' },
  { name: 'Flooring Installation', avgCost: '$2,200 – $9,000', duration: '1–2 weeks' },
];

export default function ClaringtonPage() {
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
            <span className="text-gray-900 font-medium">Clarington</span>
          </div>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving All Clarington Communities</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Renovation Estimates<br />in Clarington
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered renovation estimates for Bowmanville, Newcastle, Courtice, and all of Clarington.
              Contractor rates in Clarington are <strong>15–20% below Toronto</strong> — know what&apos;s fair before you hire.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Contractors</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>Estimates in &lt;3 min</span>
              </div>
            </div>

            <Link
              href="/#get-estimate"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
            >
              📸 Get Your Free Clarington Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500">Free · No commitment · Takes 2 minutes</p>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Clarington Communities We Serve</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {claringtonCommunities.map((community) => (
              <div key={community.name} className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl p-4 border border-rose-100">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span className="font-bold text-gray-900">{community.name}</span>
                </div>
                <p className="text-sm text-gray-600">{community.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-4 text-center">Popular Renovation Projects in Clarington</h2>
          <p className="text-center text-gray-600 mb-8">Typical costs reflect Clarington&apos;s lower contractor rates vs Toronto</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                </div>
                <p className="text-rose-700 font-black text-lg mb-1">{project.avgCost}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {project.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why QuoteXbert */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Clarington Homeowners Use QuoteXbert</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🤖', title: 'AI-Powered Estimates', desc: 'Upload photos or describe your project — get accurate pricing based on Clarington and Durham Region contractor rates.' },
              { icon: '✅', title: 'Verified Local Contractors', desc: 'Every contractor is background-checked. Connect with pros who actually serve Bowmanville, Newcastle, and Courtice.' },
              { icon: '💰', title: 'Know Fair Price First', desc: 'Clarington rates run 15–20% below Toronto. Know what fair looks like before you get a single quote.' },
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
            Get a Free Estimate for Your Clarington Project →
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
              { label: 'Oshawa Renovation Estimates', href: '/renovation-estimates-oshawa' },
              { label: 'Whitby Renovation Estimates', href: '/renovation-estimates-whitby' },
              { label: 'Ajax Renovation Estimates', href: '/renovation-estimates-ajax' },
              { label: 'Pickering Renovation Estimates', href: '/renovation-estimates-pickering' },
              { label: 'Contractors in Bowmanville', href: '/contractors/bowmanville' },
              { label: 'Blog: Durham Renovation Costs', href: '/blog/how-much-do-renovations-cost-in-durham-region' },
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
