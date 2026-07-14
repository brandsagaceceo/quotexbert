import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Port Perry | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Port Perry, Ontario. Scugog Township, Durham Region. Verified local contractors for heritage homes, cottages, kitchens & bathrooms.',
  keywords: [
    'Port Perry contractors',
    'Port Perry renovation estimates',
    'home renovation Port Perry Ontario',
    'Scugog renovation',
    'Durham Region renovation Port Perry',
    'heritage home renovation Port Perry',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Port Perry | QuoteXbert',
    description: 'AI renovation estimates for Port Perry, Ontario. Verified local contractors for heritage homes & cottages.',
    url: 'https://www.quotexbert.com/port-perry',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Port Perry | QuoteXbert',
    description: 'Instant AI renovation estimates for Port Perry & Scugog. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/port-perry',
  },
};

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$15,000 – $40,000', duration: '4–8 weeks', savings: 'Competitive local rates' },
  { name: 'Bathroom Remodel', avgCost: '$9,000 – $21,000', duration: '2–4 weeks', savings: 'Competitive local rates' },
  { name: 'Basement Finishing', avgCost: '$20,000 – $50,000', duration: '6–10 weeks', savings: 'Competitive local rates' },
  { name: 'Deck & Patio', avgCost: '$7,000 – $20,000', duration: '1–3 weeks', savings: 'Competitive local rates' },
  { name: 'Heritage Home Restoration', avgCost: '$25,000 – $75,000+', duration: 'Varies', savings: 'Specialized local expertise' },
  { name: 'Roof Replacement', avgCost: '$7,500 – $16,000', duration: '2–4 days', savings: 'Competitive local rates' },
];

const faqs = [
  {
    q: 'Where is Port Perry, Ontario?',
    a: "Port Perry is the main urban centre of the Township of Scugog in Durham Region, Ontario. Located on the western shore of Lake Scugog, it is approximately 60 km northeast of Toronto. Port Perry is known for its charming Victorian downtown, lakefront, and heritage character. It serves as a hub for Scugog Township's rural communities.",
  },
  {
    q: 'What types of renovations are most common in Port Perry?',
    a: "Port Perry's housing mix includes Victorian-era heritage homes in the historic downtown, 1950s–1980s bungalows and splits in older residential areas, and newer subdivisions on the outskirts. Heritage homes often need specialized restoration work. Newer homes commonly need kitchen/bathroom updates, basement finishing, and deck additions.",
  },
  {
    q: 'Are there heritage home renovation contractors in Port Perry?',
    a: 'Yes — QuoteXbert can connect Port Perry homeowners with contractors experienced in heritage and older home renovations. This includes working with older plumbing, knob-and-tube wiring upgrades, older foundations, and period-appropriate finishes. Always disclose the age of your home when requesting an estimate.',
  },
  {
    q: 'How do I get a renovation estimate in Port Perry?',
    a: 'Upload photos of your project on QuoteXbert, describe the scope of work, and receive an instant AI-powered estimate calibrated to Port Perry and Scugog Township market rates. You can then connect with verified local contractors — the service is completely free for homeowners.',
  },
];

export default function PortPerryPage() {
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
            <span className="text-gray-900 font-medium">Port Perry</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Port Perry &amp; Scugog Township</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Renovation Estimates<br />in Port Perry, Ontario
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Port Perry is one of Durham Region&apos;s most beautiful lakefront towns. Whether you&apos;re renovating
              a heritage home, a lakeside cottage, or a newer build, QuoteXbert connects you with qualified local contractors.
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
                📸 Get My Free Port Perry Estimate
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
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Renovation Projects in Port Perry</h2>
          <p className="text-center text-gray-600 mb-8">From heritage restorations to modern kitchen updates</p>
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

      {/* About */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Port Perry &amp; Scugog Township</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">A Heritage Lakefront Town</h3>
              <p className="text-gray-600 leading-relaxed">
                Port Perry sits on the west shore of Lake Scugog and is the urban hub of Scugog Township.
                The town is known for its preserved Victorian downtown, independent shops, and thriving arts scene.
                Nearby communities include Blackstock, Prince Albert, and Caesarea.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Renovation Considerations</h3>
              <p className="text-gray-600 leading-relaxed">
                Many Port Perry homes are older and require specialized knowledge. Heritage homes need
                careful handling of original features, older wiring, and historic materials. Always hire
                contractors familiar with heritage properties when renovating in the historic downtown core.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Port Perry Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready to Renovate in Port Perry?</h2>
          <p className="text-rose-100 text-lg mb-8">
            Get a free AI estimate in minutes. Connect with verified contractors who know Port Perry and Scugog Township.
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
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Whitby', href: '/whitby' },
              { label: 'Ajax', href: '/ajax' },
              { label: 'Uxbridge', href: '/uxbridge' },
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
