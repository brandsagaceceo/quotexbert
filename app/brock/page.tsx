import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Brock Township | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Brock Township, Ontario. Serving Cannington, Sunderland, Beaverton & Brock communities. Verified Durham Region contractors.',
  keywords: [
    'Brock Township contractors',
    'Cannington renovation',
    'Sunderland home repair',
    'Beaverton renovation',
    'home renovation Brock Township Ontario',
    'Durham Region rural renovation',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Brock Township | QuoteXbert',
    description: 'AI renovation estimates for Brock Township, Ontario. Cannington, Sunderland, Beaverton and all Brock communities.',
    url: 'https://www.quotexbert.com/brock',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Brock Township | QuoteXbert',
    description: 'AI renovation estimates for Brock Township, Ontario. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/brock',
  },
};

const brockCommunities = [
  'Cannington (urban centre)',
  'Sunderland',
  'Beaverton',
  'Brock',
  'Sandford',
  'Wilfrid',
  'Vroomanton',
];

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$14,000 – $38,000', duration: '4–7 weeks' },
  { name: 'Bathroom Remodel', avgCost: '$8,000 – $19,000', duration: '2–4 weeks' },
  { name: 'Basement Finishing', avgCost: '$18,000 – $48,000', duration: '6–10 weeks' },
  { name: 'Deck & Patio', avgCost: '$7,000 – $20,000', duration: '1–3 weeks' },
  { name: 'Roof Replacement', avgCost: '$7,500 – $16,000', duration: '2–4 days' },
  { name: 'Siding & Exterior', avgCost: '$8,000 – $25,000', duration: '1–2 weeks' },
];

const faqs = [
  {
    q: 'Where is Brock Township, Ontario?',
    a: 'Brock Township is the northernmost municipality in Durham Region, Ontario. It borders Lake Simcoe to the north and contains the communities of Cannington, Sunderland, Beaverton, and several smaller villages. Brock is a rural municipality with a mix of farmland, lakes, and small-town communities.',
  },
  {
    q: 'What renovation contractors serve Brock Township?',
    a: 'Many contractors from Uxbridge, Whitby, Oshawa, and Barrie serve Brock Township and its communities. QuoteXbert connects Brock homeowners with verified, licensed contractors familiar with rural Durham Region properties. Rural access and service considerations may affect some project costs.',
  },
  {
    q: 'How much does a home renovation cost in Cannington or Sunderland?',
    a: 'Rural Brock Township renovations are generally comparable to broader Durham Region rates or slightly lower due to less contractor competition. Kitchen renovations run $14,000–$38,000, bathroom renovations $8,000–$19,000, and basement finishing $18,000–$48,000. Material costs are similar — labour may be slightly less than urban areas.',
  },
];

export default function BrockPage() {
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
            <span className="text-gray-900 font-medium">Brock Township</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Brock Township &amp; Cannington</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Renovation Estimates<br />in Brock Township
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered renovation estimates for Cannington, Sunderland, Beaverton, and all of Brock Township.
              Free for homeowners. Connect with verified contractors who serve rural Durham Region.
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
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                📸 Get My Free Brock Estimate
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Communities in Brock Township</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {brockCommunities.map((c) => (
              <span key={c} className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Projects */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Popular Renovation Projects in Brock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularProjects.map((project) => (
              <div key={project.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Brock Township Renovation FAQ</h2>
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
      <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Brock Township Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate and connect with verified contractors in Cannington, Sunderland, and all of Brock.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors">
              Get My Free AI Estimate →
            </Link>
            <Link href="/for-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">
              Contractor Sign Up
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
              { label: 'Scugog Township', href: '/scugog' },
              { label: 'Uxbridge', href: '/uxbridge' },
              { label: 'Port Perry', href: '/port-perry' },
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
