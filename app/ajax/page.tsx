import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Ajax | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Ajax, Ontario. Durham Region family city — rates 14–16% below Toronto. Verified local contractors for kitchen, bathroom, basement & more.',
  keywords: [
    'Ajax contractors',
    'Ajax renovation estimates',
    'home renovation Ajax Ontario',
    'Ajax kitchen renovation',
    'Ajax basement finishing',
    'Ajax bathroom renovation',
    'Durham Region renovation Ajax',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Ajax | QuoteXbert',
    description: 'AI-powered renovation estimates for Ajax homeowners. Durham Region rates 14–16% below Toronto.',
    url: 'https://www.quotexbert.com/ajax',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Ajax | QuoteXbert',
    description: 'Instant AI renovation estimates for Ajax, Ontario. Free for homeowners.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/ajax',
  },
};

const ajaxNeighbourhoods = [
  'Pickering Village', 'Salem', 'Central Ajax', 'Westney Heights',
  'Village South', 'Northeast Ajax', 'Audley', 'Duffins Bay',
  'Carruthers Creek', 'Downtown Ajax',
];

const popularProjects = [
  { name: 'Basement Finishing', avgCost: '$22,000 – $50,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Kitchen Renovation', avgCost: '$17,000 – $48,000', duration: '4–8 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$9,500 – $22,000', duration: '2–4 weeks', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$7,500 – $19,000', duration: '1–3 weeks', savings: '~15% below Toronto' },
  { name: 'Flooring Installation', avgCost: '$2,400 – $10,000', duration: '1–2 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$8,000 – $16,000', duration: '2–4 days', savings: '~15% below Toronto' },
];

const faqs = [
  {
    q: 'How much does a home renovation cost in Ajax?',
    a: "Renovation costs in Ajax are typically 14–16% below Toronto core. A kitchen renovation runs $17,000–$48,000, bathroom renovation $9,500–$22,000, and basement finishing $22,000–$50,000. Ajax's family-oriented housing stock (predominantly 1980s–2000s two-storey homes) has strong renovation demand year-round.",
  },
  {
    q: 'What are the most popular renovations in Ajax?',
    a: "Basement finishing is the most popular renovation in Ajax — most 1990s–2000s Ajax homes have unfinished basements that represent significant untapped value. Kitchen renovations (especially open-concept conversions removing the kitchen-dining wall) and bathroom updates are next most common.",
  },
  {
    q: 'Are there good contractors in Ajax?',
    a: "Yes — Ajax has a well-established local contractor base supplemented by contractors from Pickering, Whitby, and east Toronto who regularly serve the area. QuoteXbert verifies all contractors before listing them, including licence, insurance, WSIB coverage, and background checks.",
  },
  {
    q: 'Do I need a building permit for renovations in Ajax?',
    a: "Permits are required in Ajax (Town of Ajax Building Services, 905-619-2529) for basement finishing, structural changes, plumbing additions, and electrical upgrades. Cosmetic work generally doesn't need a permit. Your contractor should confirm requirements and handle permit applications as part of their service.",
  },
];

export default function AjaxPage() {
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
            <span className="text-gray-900 font-medium">Ajax</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Ajax &amp; Durham Region</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Instant Renovation<br />Estimates in Ajax
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Ajax is one of Durham Region&apos;s most family-friendly cities — and renovation rates here are
              typically <strong>14–16% below Toronto core</strong>. Get an AI-powered estimate calibrated
              to Ajax&apos;s local market in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Ajax Contractors</span>
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
                📸 Get My Free Ajax Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Popular Renovation Projects in Ajax</h2>
          <p className="text-center text-gray-600 mb-8">Ajax renovation costs — 14–16% below Toronto</p>
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
          <div className="text-center mt-8">
            <Link href="/durham-region-renovation-costs" className="text-rose-600 hover:text-rose-700 font-semibold text-sm underline">
              View full Durham Region renovation cost guide →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Neighbourhoods We Serve</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {ajaxNeighbourhoods.map((n) => (
              <span key={n} className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full">{n}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Why Ajax Homeowners Choose QuoteXbert</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              { icon: '🤖', title: 'AI Estimate in Minutes', desc: 'Upload photos and get an instant renovation estimate calibrated to Ajax\'s local market. No callbacks, no waiting.' },
              { icon: '✅', title: 'Verified Ajax Contractors', desc: 'Every contractor is licensed, insured, and background-checked. QuoteXbert serves Ajax and all of Durham Region.' },
              { icon: '💰', title: 'Fair Pricing', desc: 'Ajax rates are lower than Toronto — but you still need a benchmark. QuoteXbert gives you one for free.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-base">
            Get a Free Estimate for Your Ajax Project →
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Are You a Contractor in Ajax?</h2>
          <p className="text-gray-300 text-lg mb-6">
            Join QuoteXbert&apos;s Founding Contractor Program. Get exclusive access to homeowner leads in Ajax
            and all of Durham Region. Limited spots available.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/for-contractors" className="bg-white text-gray-900 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors">
              Claim My Founding Contractor Spot
            </Link>
            <Link href="/durham-region-contractors" className="border border-gray-600 text-white font-semibold px-8 py-4 rounded-2xl hover:border-gray-400 transition-colors">
              Learn About Durham Contractor Program
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Ajax Renovation FAQ</h2>
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

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Ajax &amp; Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Kitchen Renovation Ajax', href: '/kitchen-renovation-ajax' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
              { label: 'Basement Renovation Ajax', href: '/basement-renovation-ajax' },
              { label: 'Flooring Ajax', href: '/flooring-ajax' },
              { label: 'Whitby', href: '/whitby' },
              { label: 'Pickering', href: '/pickering' },
              { label: 'Oshawa', href: '/oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Contractor Leads Ajax', href: '/contractor-leads-ajax' },
              { label: 'Renovation Estimates Ajax', href: '/renovation-estimates-ajax' },
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
            '@type': 'LocalBusiness',
            name: 'QuoteXbert — Ajax Home Renovation Estimates',
            description: 'AI-powered home renovation estimates for Ajax, Ontario homeowners.',
            url: 'https://www.quotexbert.com/ajax',
            areaServed: { '@type': 'City', name: 'Ajax', containedInPlace: { '@type': 'AdministrativeArea', name: 'Durham Region, Ontario, Canada' } },
            serviceType: 'Home Renovation Estimates',
          }),
        }}
      />
    </main>
  );
}
