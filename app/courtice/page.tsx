import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Courtice | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Courtice, Ontario. Part of Clarington, Courtice is a growing Durham Region community. Verified local contractors for kitchen, bathroom & basement renovations.',
  keywords: [
    'Courtice contractors',
    'Courtice renovation estimates',
    'home renovation Courtice Ontario',
    'Clarington contractors',
    'Courtice home repair',
    'Durham Region renovation',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Courtice | QuoteXbert',
    description: 'AI-powered renovation estimates for Courtice homeowners. Verified Clarington & Durham Region contractors.',
    url: 'https://www.quotexbert.com/courtice',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Courtice | QuoteXbert',
    description: 'Instant AI renovation estimates for Courtice, Ontario. Free, no commitment.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/courtice',
  },
};

const courticeNeighbourhoods = [
  'Courtice Village',
  'Courtice North',
  'Courtice East',
  'Nash Road Area',
  'Tooley Road Corridor',
  'Bloor Street South',
  'Darlington Green',
];

const popularProjects = [
  { name: 'Basement Finishing', avgCost: '$22,000 – $50,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Kitchen Renovation', avgCost: '$16,000 – $40,000', duration: '4–7 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$9,000 – $20,000', duration: '2–4 weeks', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$7,000 – $18,000', duration: '1–3 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$7,500 – $15,000', duration: '2–4 days', savings: '~15% below Toronto' },
  { name: 'Flooring Installation', avgCost: '$2,200 – $9,500', duration: '1–2 weeks', savings: '~15% below Toronto' },
];

const faqs = [
  {
    q: 'Where is Courtice located?',
    a: 'Courtice is the westernmost urban community in the Municipality of Clarington, Durham Region. It sits between Oshawa to the west and Bowmanville to the east, directly north of Lake Ontario. It is a growing family-friendly suburb with strong demand for home renovation services.',
  },
  {
    q: 'How much does a bathroom renovation cost in Courtice?',
    a: 'A standard bathroom renovation in Courtice costs between $9,000 and $20,000. A mid-range full-bathroom renovation including new tile, vanity, toilet, and fixtures typically runs $11,000–$15,000. Courtice rates are approximately 15% below Toronto core.',
  },
  {
    q: 'How do I find a contractor in Courtice?',
    a: 'QuoteXbert connects Courtice homeowners with verified, background-checked contractors who serve Clarington and the broader Durham Region. Upload photos of your project, receive a free AI estimate, then choose from available local contractors — all at no cost to you.',
  },
  {
    q: 'Do I need a permit for a deck in Courtice?',
    a: 'Yes. In Courtice (and all of Clarington), a building permit is required for decks over 24 inches (60 cm) above grade, or attached to the house. The permit typically costs $200–$600 and ensures your deck meets Ontario Building Code setbacks and structural requirements.',
  },
];

export default function CourticePage() {
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
            <span className="text-gray-900 font-medium">Courtice</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Courtice &amp; West Clarington</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Renovation Estimates<br />in Courtice, Ontario
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Courtice is one of Clarington&apos;s fastest-growing communities. Get AI-powered renovation estimates
              calibrated to local market rates — typically <strong>15–20% below Toronto</strong>. Free for homeowners.
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
                📸 Get My Free Courtice Estimate
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
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Renovation Projects in Courtice</h2>
          <p className="text-center text-gray-600 mb-8">Courtice renovation costs — lower than Toronto, full Durham Region quality</p>
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Courtice Communities We Serve</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {courticeNeighbourhoods.map((n) => (
              <span key={n} className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full">{n}</span>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            QuoteXbert serves all of Courtice and the broader Clarington and Durham Region area.
          </p>
        </div>
      </section>

      {/* Why QuoteXbert */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Courtice Homeowners Use QuoteXbert</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🤖', title: 'Instant AI Estimate', desc: 'Upload project photos and get a Courtice-calibrated renovation estimate in minutes — no callbacks, no waiting.' },
              { icon: '✅', title: 'Verified Contractors', desc: 'Every contractor is licensed, insured, and background-checked. We connect you with pros who serve Courtice and Clarington.' },
              { icon: '💰', title: 'Fair Pricing', desc: "Durham Region rates are lower than Toronto's — but you still need a benchmark. QuoteXbert gives you that for free." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base">
            Get a Free Estimate for Your Courtice Project →
          </Link>
        </div>
      </section>

      {/* Contractor CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Are You a Contractor in Courtice?</h2>
          <p className="text-gray-300 text-lg mb-6">
            Join QuoteXbert&apos;s Founding Contractor Program. Get priority access to homeowner leads in Courtice,
            Bowmanville, and all of Clarington. Limited spots available.
          </p>
          <Link href="/for-contractors" className="bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors">
            Claim My Founding Contractor Spot
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Courtice Renovation FAQ</h2>
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

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Clarington Hub', href: '/clarington' },
              { label: 'Bowmanville', href: '/bowmanville' },
              { label: 'Newcastle', href: '/newcastle' },
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Bathroom Renovation Courtice', href: '/bathroom-renovation-courtice' },
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
