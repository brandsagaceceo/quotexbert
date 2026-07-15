import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Uxbridge | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Uxbridge, Ontario. Durham Region. Verified contractors for rural homes, kitchens, bathrooms, basements & more.',
  keywords: [
    'Uxbridge contractors',
    'Uxbridge renovation estimates',
    'home renovation Uxbridge Ontario',
    'Durham Region rural renovation',
    'Uxbridge home repair',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Uxbridge | QuoteXbert',
    description: 'AI renovation estimates for Uxbridge, Ontario homeowners. Verified Durham Region contractors.',
    url: 'https://www.quotexbert.com/uxbridge',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Uxbridge | QuoteXbert',
    description: 'Instant AI renovation estimates for Uxbridge, Ontario. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/uxbridge',
  },
};

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$15,000 – $40,000', duration: '4–8 weeks', savings: 'Competitive rural rates' },
  { name: 'Bathroom Remodel', avgCost: '$8,500 – $20,000', duration: '2–4 weeks', savings: 'Competitive rural rates' },
  { name: 'Basement Finishing', avgCost: '$20,000 – $50,000', duration: '6–10 weeks', savings: 'Competitive rural rates' },
  { name: 'Deck & Patio', avgCost: '$8,000 – $22,000', duration: '1–3 weeks', savings: 'Competitive rural rates' },
  { name: 'Septic System Work', avgCost: '$10,000 – $30,000', duration: '1–3 weeks', savings: 'Rural expertise required' },
  { name: 'Roof Replacement', avgCost: '$8,000 – $17,000', duration: '2–5 days', savings: 'Competitive rural rates' },
];

const faqs = [
  {
    q: 'Where is Uxbridge, Ontario?',
    a: 'Uxbridge is a municipality in the Regional Municipality of Durham, Ontario. Located approximately 75 km northeast of Toronto, Uxbridge is known as the "Trail Capital of Canada" for its extensive trail network. The community has a mix of rural and suburban character, with strong equestrian and outdoor recreation culture.',
  },
  {
    q: 'What is unique about renovating in Uxbridge?',
    a: 'Uxbridge homes often sit on larger lots with rural services (well water and septic systems rather than municipal water/sewer). This affects renovation costs and requirements — especially for basement waterproofing, septic-connected plumbing, and foundation work. Contractors serving Uxbridge should be familiar with rural building codes.',
  },
  {
    q: 'How much does it cost to renovate a home in Uxbridge?',
    a: 'Renovation costs in Uxbridge are competitive with broader Durham Region rates, typically 10–20% below Toronto. However, rural homes may have higher costs for certain projects due to access and rural service considerations. A kitchen renovation runs $15,000–$40,000, bathroom renovation $8,500–$20,000.',
  },
  {
    q: 'Do contractors serve Uxbridge from nearby cities?',
    a: 'Yes — contractors from Whitchurch-Stouffville, Markham, Whitby, and Oshawa commonly serve the Uxbridge area. QuoteXbert can connect you with verified contractors who have experience with Durham Region rural properties.',
  },
];

export default function UxbridgePage() {
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
            <span className="text-gray-900 font-medium">Uxbridge</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Uxbridge &amp; Surrounding Area</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Renovation Estimates<br />in Uxbridge, Ontario
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Uxbridge — the Trail Capital of Canada. Whether you&apos;re updating a rural farmhouse, a newer
              subdivision home, or an equestrian estate, QuoteXbert connects you with verified local contractors.
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
                📸 Get My Free Uxbridge Estimate
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
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Projects in Uxbridge</h2>
          <p className="text-center text-gray-600 mb-8">Including rural-specific renovation services</p>
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

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Uxbridge Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Start Your Uxbridge Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate and connect with verified local contractors in minutes.</p>
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
              { label: 'Whitby', href: '/whitby' },
              { label: 'Pickering', href: '/pickering' },
              { label: 'Port Perry', href: '/port-perry' },
              { label: 'Scugog', href: '/scugog' },
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
