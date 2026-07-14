import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Clock, Wrench, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Durham Region Renovation Estimates | AI-Powered Quotes | QuoteXbert',
  description:
    'Get instant AI-powered renovation estimates across all Durham Region cities. Serving Oshawa, Whitby, Ajax, Pickering, Bowmanville, Courtice, Newcastle & more. Free for homeowners.',
  keywords: [
    'Durham Region renovation estimates',
    'renovation quotes Durham Region Ontario',
    'home renovation estimate Durham',
    'Oshawa renovation estimate',
    'Whitby renovation estimate',
    'Ajax renovation estimate',
    'Pickering renovation estimate',
    'Bowmanville renovation estimate',
    'AI renovation estimates Durham',
  ],
  openGraph: {
    title: 'Durham Region Renovation Estimates | QuoteXbert',
    description:
      'Instant AI-powered home renovation estimates across all Durham Region cities. Free for homeowners.',
    url: 'https://www.quotexbert.com/durham-region-renovation-estimates',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Durham Region Renovation Estimates | QuoteXbert',
    description: 'AI renovation estimates for all Durham Region cities. Free, instant, no commitment.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/durham-region-renovation-estimates',
  },
};

const durhamCities = [
  { name: 'Oshawa', slug: '/oshawa', pop: '170,000+', note: 'Durham\'s largest city — 15–20% below Toronto rates' },
  { name: 'Whitby', slug: '/whitby', pop: '140,000+', note: 'Fast-growing — mix of 1980s and newer homes' },
  { name: 'Ajax', slug: '/ajax', pop: '120,000+', note: 'Family-friendly — popular for basement finishing' },
  { name: 'Pickering', slug: '/pickering', pop: '95,000+', note: 'Borders Toronto — Seaton growth area' },
  { name: 'Bowmanville', slug: '/bowmanville', pop: '45,000+', note: 'Historic Clarington hub — growing fast' },
  { name: 'Clarington', slug: '/clarington', pop: '105,000+', note: 'Encompasses Bowmanville, Courtice, Newcastle' },
  { name: 'Courtice', slug: '/courtice', pop: '25,000+', note: 'West Clarington suburb — young families' },
  { name: 'Newcastle', slug: '/newcastle', pop: '8,000+', note: 'Historic lakefront town east of Bowmanville' },
  { name: 'Port Perry', slug: '/port-perry', pop: '10,000+', note: 'Scugog Township hub — heritage homes & cottages' },
  { name: 'Uxbridge', slug: '/uxbridge', pop: '22,000+', note: 'Trail Capital — rural character, horse country' },
  { name: 'Scugog Township', slug: '/scugog', pop: '22,000+', note: 'Lake Scugog — rural & cottage properties' },
  { name: 'Brock Township', slug: '/brock', pop: '13,000+', note: 'North Durham — Cannington, Sunderland, Beaverton' },
];

const renovationTypes = [
  { name: 'Kitchen Renovation', priceRange: '$15,000 – $50,000' },
  { name: 'Bathroom Remodel', priceRange: '$8,500 – $25,000' },
  { name: 'Basement Finishing', priceRange: '$18,000 – $60,000' },
  { name: 'Deck & Patio', priceRange: '$6,500 – $25,000' },
  { name: 'Roof Replacement', priceRange: '$7,000 – $20,000' },
  { name: 'Flooring', priceRange: '$2,200 – $12,000' },
  { name: 'Painting (Interior)', priceRange: '$1,500 – $7,000' },
  { name: 'Window Replacement', priceRange: '$4,000 – $15,000' },
];

const faqs = [
  {
    q: 'How do I get a renovation estimate in Durham Region?',
    a: 'Upload photos of your project on QuoteXbert, describe the scope of work, and our AI instantly generates an estimate calibrated to Durham Region market rates. You can then connect directly with verified local contractors — completely free for homeowners.',
  },
  {
    q: 'Are renovation costs in Durham Region lower than Toronto?',
    a: 'Yes. Renovation contractor rates across Durham Region are typically 15–20% below Toronto core. This is consistent across all Durham cities including Oshawa, Whitby, Ajax, and Pickering. Renovating in Durham gives you access to skilled, vetted tradespeople at a lower cost.',
  },
  {
    q: 'Which Durham Region cities does QuoteXbert serve?',
    a: 'QuoteXbert serves all Durham Region municipalities: Oshawa, Whitby, Ajax, Pickering, Clarington (Bowmanville, Courtice, Newcastle), Brock (Cannington, Sunderland), Scugog (Port Perry), and Uxbridge. We cover the entire Region.',
  },
  {
    q: 'How accurate are AI renovation estimates?',
    a: 'AI estimates are not quotes — they are informed benchmarks based on project type, size, scope, and local market data. Most homeowners find the estimate within 10–20% of actual contractor bids, making it a useful tool to know if quotes are reasonable. Always get multiple contractor quotes before committing.',
  },
  {
    q: 'Is QuoteXbert really free for homeowners?',
    a: "Yes — QuoteXbert is completely free for homeowners. You get an instant AI estimate and can connect with verified contractors at no cost. We operate a contractor subscription model, so homeowners never pay to use the platform.",
  },
];

export default function DurhamRegionRenovationEstimatesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/durham-region" className="hover:text-rose-600">Durham Region</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Renovation Estimates</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving All 12 Durham Region Municipalities</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Durham Region<br />Renovation Estimates
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Get instant AI-powered renovation estimates for any project in Durham Region.
              Covering Oshawa, Whitby, Ajax, Pickering, Clarington, and every community in between.
              <strong> Rates 15–20% below Toronto.</strong> Free for homeowners.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100+ Verified Durham Contractors</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>&lt;3 min Estimates</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
              >
                📸 Get My Free AI Estimate
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            How Durham Region AI Estimates Work
          </h2>
          <p className="text-center text-gray-600 mb-10">Three steps to know what your renovation should cost</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '📸', title: 'Upload Project Photos', desc: 'Take photos of the space you want to renovate. The more detail, the more accurate the estimate.' },
              { step: '2', icon: '🤖', title: 'AI Analyses Your Project', desc: 'Our AI analyses your photos against Durham Region\'s local pricing database to generate a calibrated estimate instantly.' },
              { step: '3', icon: '✅', title: 'Connect with Contractors', desc: 'Compare the estimate against real contractor quotes. Connect directly with verified, licensed Durham Region contractors.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-rose-600 text-white font-black text-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Durham Cities */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Get Estimates for Any Durham Region City
          </h2>
          <p className="text-center text-gray-600 mb-10">
            Click your city for local renovation cost data and verified contractors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {durhamCities.map((city) => (
              <Link
                key={city.slug}
                href={city.slug}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <h3 className="font-bold text-gray-900 group-hover:text-rose-700">{city.name}</h3>
                  <span className="ml-auto text-xs text-gray-500">{city.pop}</span>
                </div>
                <p className="text-sm text-gray-600">{city.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Renovation Types */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Renovation Costs in Durham Region
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Typical price ranges — Durham rates are 15–20% below Toronto
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renovationTypes.map((type) => (
              <div key={type.name} className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Wrench className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{type.name}</h3>
                <p className="text-rose-700 font-black text-sm">{type.priceRange}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/durham-region-renovation-costs" className="text-rose-600 hover:text-rose-700 font-semibold underline">
              View detailed Durham Region renovation cost guide →
            </Link>
          </div>
        </div>
      </section>

      {/* Why AI Estimates */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">
            Why AI Estimates Protect Durham Region Homeowners
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <h3 className="font-bold text-gray-900 mb-3">The Problem: Flying Blind</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Without a benchmark, homeowners accept the first quote they get — or wait weeks for multiple quotes
                while the project stalls. Research shows homeowners who skip price research can overpay by 20–40%.
              </p>
              <p className="text-gray-600 leading-relaxed">
                In Durham Region, where renovation activity is high and contractor capacity is stretched, this problem
                is especially common. Homeowners deserve to know what things should cost.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3">The QuoteXbert Solution</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                QuoteXbert&apos;s AI analyses your photos and project details against real Durham Region pricing data.
                Within minutes, you have a market-calibrated estimate — not a guess, but a data-driven benchmark
                you can use to evaluate any contractor quote.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Then connect directly with verified contractors. No middlemen. No hidden fees. Just transparent,
                fair pricing.
              </p>
            </div>
          </div>
          <div className="text-center">
            <Link
              href="/create-lead"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base"
            >
              Get My Free Durham Renovation Estimate →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Durham Region Renovation Estimate FAQ
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
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'Home Renovation Durham', href: '/durham-region-home-renovation' },
              { label: 'General Contractors Durham', href: '/general-contractors-durham-region' },
              { label: 'Blog: Renovation Costs Durham', href: '/blog/bathroom-renovation-cost-durham-region' },
              { label: 'For Contractors', href: '/for-contractors' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Durham Region Renovation Estimates',
            provider: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
            description: 'AI-powered home renovation estimates for all Durham Region municipalities.',
            areaServed: { '@type': 'AdministrativeArea', name: 'Durham Region, Ontario, Canada' },
            url: 'https://www.quotexbert.com/durham-region-renovation-estimates',
          }),
        }}
      />
    </main>
  );
}
