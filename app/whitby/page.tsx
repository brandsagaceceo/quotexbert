import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle, Home, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Whitby | QuoteXbert',
  description:
    "Get instant AI-powered home renovation estimates in Whitby, Ontario. Durham Region's fastest-growing city. Compare quotes from verified local contractors for kitchen, bathroom, basement & more.",
  keywords: [
    'Whitby contractors',
    'Whitby renovation estimates',
    'home renovation Whitby Ontario',
    'Whitby kitchen renovation',
    'Whitby bathroom remodel',
    'Whitby basement finishing',
    'Durham Region contractors',
    'Brooklin renovation',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Whitby | QuoteXbert',
    description:
      'AI-powered renovation estimates for Whitby homeowners. Compare quotes from verified Durham Region contractors.',
    url: 'https://www.quotexbert.com/whitby',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Whitby | QuoteXbert',
    description:
      'AI-powered renovation estimates for Whitby homeowners. Compare verified contractor quotes in minutes.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/whitby',
  },
};

const whitbyNeighbourhoods = [
  'Downtown Whitby',
  'Brooklin',
  'Port Whitby',
  'Lynde Creek',
  'Rolling Acres',
  'Blue Grass Meadows',
  'Taunton North',
  'Pringle Creek',
  'Williamsburg',
  'Rossland Park',
  'Fallingbrook',
  'Windsor Dunes',
];

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$18,000 – $45,000', duration: '4–8 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$10,000 – $22,000', duration: '2–4 weeks', savings: '~15% below Toronto' },
  { name: 'Basement Finishing', avgCost: '$23,000 – $55,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$8,000 – $20,000', duration: '1–3 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$8,500 – $16,000', duration: '2–5 days', savings: '~15% below Toronto' },
  { name: 'Flooring Installation', avgCost: '$2,800 – $11,000', duration: '1–2 weeks', savings: '~15% below Toronto' },
];

const homeStyles = [
  { era: '1970s–1980s Backsplits & Sidesplits', desc: 'Common in established neighbourhoods like Rolling Acres and Blue Grass Meadows. These homes often benefit from kitchen updates, main bath renovations, and basement refinishing.' },
  { era: '1990s–2000s Two-Storey Colonials', desc: 'Found throughout Pringle Creek and Williamsburg. Popular upgrades include en-suite bathrooms, updated kitchens, and deck additions.' },
  { era: '2000s–Present New Builds (Brooklin)', desc: 'Brooklin\'s newer homes in Whitby\'s growing north end are popular for basement finishing, custom decks, and landscaping projects.' },
];

const faqs = [
  {
    q: 'How much does a kitchen renovation cost in Whitby?',
    a: 'A kitchen renovation in Whitby typically costs between $18,000 and $45,000, depending on the scope of work, cabinet quality, and countertop choice. Mid-range kitchens run $25,000–$35,000. Whitby rates are approximately 15% below Toronto core pricing.',
  },
  {
    q: 'Do I need a permit for a basement renovation in Whitby?',
    a: 'Yes. Most basement finishing projects in Whitby (and all of Durham Region) require a building permit from the Region of Durham. This includes adding walls, bathrooms, or electrical work. Permits typically cost $500–$2,000. QuoteXbert-connected contractors handle permit applications as part of their service.',
  },
  {
    q: 'How long does a bathroom renovation take in Whitby?',
    a: 'A standard bathroom renovation in Whitby takes 2–4 weeks once work begins. This covers demolition, plumbing, tile work, fixtures, and finishing. Planning and permit approval (if needed) can add 2–4 weeks beforehand.',
  },
  {
    q: 'Are contractors in Whitby cheaper than in Toronto?',
    a: 'Yes — contractor labour rates in Whitby and Durham Region are generally 10–20% below Toronto core. You get access to skilled, insured tradespeople at a lower cost, especially for interior renovations.',
  },
  {
    q: 'How does QuoteXbert work for Whitby homeowners?',
    a: 'Upload photos of your space, describe your project, and QuoteXbert\'s AI generates an instant estimate calibrated to Whitby\'s local market. You can then connect with verified contractors who serve Whitby and Durham Region. The service is free for homeowners.',
  },
];

export default function WhitbyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Whitby</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Whitby &amp; Brooklin</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Instant Renovation<br />Estimates in Whitby
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Whitby is one of Durham Region&apos;s fastest-growing cities. Get AI-powered renovation estimates
              calibrated to Whitby&apos;s local market — where rates are typically{' '}
              <strong>15–20% below Toronto</strong>. Know the fair price before you hire anyone.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Whitby Contractors</span>
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
                📸 Get My Free Whitby Estimate
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
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Popular Renovation Projects in Whitby
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Whitby renovation costs — typically 15% lower than Toronto core
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularProjects.map((project) => (
              <div
                key={project.name}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="w-5 h-5 text-rose-600" />
                  <h3 className="font-bold text-gray-900">{project.name}</h3>
                </div>
                <p className="text-rose-700 font-black text-lg mb-1">{project.avgCost}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {project.duration}
                  </span>
                  <span className="text-green-600 font-semibold text-xs">{project.savings}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/durham-region-renovation-costs"
              className="text-rose-600 hover:text-rose-700 font-semibold text-sm underline"
            >
              View full Durham Region renovation cost guide →
            </Link>
          </div>
        </div>
      </section>

      {/* Whitby Home Styles */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Whitby Home Styles &amp; Renovation Demand
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Whitby&apos;s housing stock spans several decades — each era has common renovation needs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {homeStyles.map((style) => (
              <div
                key={style.era}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Home className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 text-sm">{style.era}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{style.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Neighbourhoods */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Whitby Neighbourhoods We Serve
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {whitbyNeighbourhoods.map((n) => (
              <span
                key={n}
                className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            QuoteXbert connects Whitby homeowners across all neighbourhoods with verified local contractors.
          </p>
        </div>
      </section>

      {/* Why QuoteXbert */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">
            Why Whitby Homeowners Choose QuoteXbert
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '🤖',
                title: 'AI Estimate in Minutes',
                desc: 'Upload photos of your project. Our AI instantly generates a renovation estimate calibrated to Whitby\'s local market — no waiting for contractor callbacks.',
              },
              {
                icon: '✅',
                title: 'Verified Durham Contractors',
                desc: 'Every contractor on QuoteXbert is licensed, insured, and background-checked. We only connect you with pros who actually serve Whitby and Durham Region.',
              },
              {
                icon: '💰',
                title: 'Know the Fair Price',
                desc: 'Whitby contractors charge less than Toronto — but you still need a benchmark. QuoteXbert shows you what\'s fair so you never overpay.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/create-lead"
            className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base"
          >
            Get a Free Estimate for Your Whitby Project →
          </Link>
        </div>
      </section>

      {/* Contractor CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Are You a Contractor in Whitby?</h2>
          <p className="text-gray-300 text-lg mb-6">
            Join QuoteXbert&apos;s Founding Contractor Program. Get exclusive access to homeowner leads in Whitby,
            Brooklin, and all of Durham Region. Limited spots available.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/for-contractors"
              className="bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors"
            >
              Claim My Founding Contractor Spot
            </Link>
            <Link
              href="/durham-region-contractors"
              className="border border-gray-600 text-white font-semibold px-8 py-4 rounded-2xl hover:border-gray-400 transition-colors"
            >
              Learn About Durham Contractor Program
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Whitby Renovation FAQ
          </h2>
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
          <h3 className="text-xl font-black text-gray-900 mb-5">
            More Durham Region Resources
          </h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Oshawa Renovation Estimates', href: '/oshawa' },
              { label: 'Ajax Renovation Estimates', href: '/ajax' },
              { label: 'Pickering Renovation Estimates', href: '/pickering' },
              { label: 'Bowmanville & Clarington', href: '/clarington' },
              { label: 'Deck Builders Whitby', href: '/deck-builders-whitby' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Find Whitby Contractors', href: '/contractor-leads-whitby' },
              { label: 'Renovation Estimates Whitby', href: '/renovation-estimates-whitby' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
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

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'QuoteXbert — Whitby Home Renovation Estimates',
            description:
              'AI-powered home renovation estimates for Whitby, Ontario homeowners. Free quotes from verified Durham Region contractors.',
            url: 'https://www.quotexbert.com/whitby',
            areaServed: {
              '@type': 'City',
              name: 'Whitby',
              containedInPlace: {
                '@type': 'AdministrativeArea',
                name: 'Durham Region, Ontario, Canada',
              },
            },
            serviceType: 'Home Renovation Estimates',
          }),
        }}
      />
    </main>
  );
}
