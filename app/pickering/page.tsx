import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Wrench, Clock, CheckCircle, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Estimates in Pickering | QuoteXbert',
  description:
    'Get instant AI-powered home renovation estimates in Pickering, Ontario. Compare quotes from verified local contractors for kitchen, bathroom, basement renovations. Free for homeowners.',
  keywords: [
    'Pickering contractors',
    'Pickering renovation estimates',
    'home renovation Pickering Ontario',
    'Pickering kitchen renovation',
    'Pickering bathroom remodel',
    'Pickering basement finishing',
    'Durham Region renovation',
    'Ajax Pickering contractors',
  ],
  openGraph: {
    title: 'Home Renovation Estimates in Pickering | QuoteXbert',
    description:
      'AI-powered renovation estimates for Pickering homeowners. Compare quotes from verified Durham Region contractors.',
    url: 'https://www.quotexbert.com/pickering',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Estimates in Pickering | QuoteXbert',
    description: 'AI-powered renovation estimates for Pickering homeowners. Free, fast, no commitment.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/pickering',
  },
};

const pickeringNeighbourhoods = [
  'Bay Ridges',
  'Dunbarton',
  'Highbush',
  'Liverpool',
  'Rouge Park',
  'Woodlands',
  'Brock Ridge',
  'Kingston Ridge',
  'Amberlea',
  'Rougemount',
  'Duffin Heights',
  'Seaton',
];

const popularProjects = [
  { name: 'Kitchen Renovation', avgCost: '$17,000 – $43,000', duration: '4–8 weeks', savings: '~15% below Toronto' },
  { name: 'Bathroom Remodel', avgCost: '$9,500 – $21,000', duration: '2–4 weeks', savings: '~15% below Toronto' },
  { name: 'Basement Finishing', avgCost: '$22,000 – $54,000', duration: '6–10 weeks', savings: '~15% below Toronto' },
  { name: 'Deck & Patio', avgCost: '$7,500 – $19,000', duration: '1–3 weeks', savings: '~15% below Toronto' },
  { name: 'Roof Replacement', avgCost: '$8,000 – $15,500', duration: '2–5 days', savings: '~15% below Toronto' },
  { name: 'Flooring Installation', avgCost: '$2,500 – $10,500', duration: '1–2 weeks', savings: '~15% below Toronto' },
];

const homeStyles = [
  {
    era: '1960s–1970s Bungalows & Backsplits',
    desc: 'Concentrated in Bay Ridges and Liverpool near the waterfront. Common upgrades include kitchen renovations, bathroom updates, basement apartments, and window replacements.',
  },
  {
    era: '1980s–1990s Two-Storey Colonials',
    desc: 'Found throughout Amberlea and Highbush. Popular renovations include master en-suite additions, updated kitchens, and deck construction.',
  },
  {
    era: 'Seaton & Duffin Heights (2010s–Present)',
    desc: "Pickering's newest communities feature modern builds with strong demand for basement finishing, landscaping, and custom deck or patio projects.",
  },
];

const faqs = [
  {
    q: 'How much does a bathroom renovation cost in Pickering?',
    a: 'A standard bathroom renovation in Pickering costs between $9,500 and $21,000. A mid-range full-bath renovation runs $13,000–$17,000. Pickering labour rates are approximately 15% below Toronto core, making it an affordable area for quality renovations.',
  },
  {
    q: 'Do I need a permit for a kitchen renovation in Pickering?',
    a: 'Permits are required in Pickering for structural changes, electrical panel upgrades, or plumbing relocations within a kitchen renovation. Cosmetic work (cabinets, countertops, appliances) typically does not require a permit. Your contractor should confirm requirements before starting.',
  },
  {
    q: 'How do I find a reliable contractor in Pickering?',
    a: 'QuoteXbert verifies all contractors before listing them. Each contractor is licensed, insured, and has been background-checked. Simply describe your project, get an AI estimate, and connect directly with verified Pickering-area contractors — all for free.',
  },
  {
    q: 'What is the cost of finishing a basement in Pickering?',
    a: 'Finishing a basement in Pickering typically costs $22,000–$54,000 depending on size and finish level. A 600 sq ft open-concept basement runs about $25,000–$35,000. Adding a full bathroom increases costs by $8,000–$14,000. Pickering rates are roughly 15% less than Toronto.',
  },
  {
    q: 'Is the Seaton development area active for contractors?',
    a: "Yes — Pickering's Seaton community is one of Durham Region's fastest-growing areas. Many new homeowners in Seaton need basement finishing, decks, and landscaping completed after taking possession. There is strong demand for contractors in this area.",
  },
];

export default function PickeringPage() {
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
            <span className="text-gray-900 font-medium">Pickering</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Serving Pickering &amp; Seaton</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Instant Renovation<br />Estimates in Pickering
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pickering borders Toronto but costs significantly less. Get AI-powered renovation estimates
              tailored to Pickering&apos;s local market — where rates are typically{' '}
              <strong>15–20% below Toronto core</strong>. Know what&apos;s fair before you hire.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Verified Pickering Contractors</span>
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
                📸 Get My Free Pickering Estimate
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
            Popular Renovation Projects in Pickering
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Pickering renovation costs — typically 15% lower than Toronto
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

      {/* Home Styles */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">
            Pickering Home Styles &amp; Renovation Demand
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            From Bay Ridges bungalows to new Seaton builds — each era of Pickering home has distinct renovation needs.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {homeStyles.map((style) => (
              <div key={style.era} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
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
            Pickering Neighbourhoods We Serve
          </h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {pickeringNeighbourhoods.map((n) => (
              <span
                key={n}
                className="bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium px-4 py-2 rounded-full"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6 text-sm">
            Including new Seaton community and all Pickering neighbourhoods bordering Ajax and Scarborough.
          </p>
        </div>
      </section>

      {/* Why QuoteXbert */}
      <section className="py-16 bg-gradient-to-br from-rose-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-6">
            Why Pickering Homeowners Trust QuoteXbert
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: '🤖',
                title: 'AI Estimate in Minutes',
                desc: "Upload photos of your project and get an instant renovation estimate calibrated to Pickering's local market. No waiting.",
              },
              {
                icon: '✅',
                title: 'Verified Local Contractors',
                desc: 'All contractors are licensed, insured, and background-checked. We only list pros who actually serve Pickering and Durham Region.',
              },
              {
                icon: '💰',
                title: 'Stop Overpaying',
                desc: "Pickering rates are lower than Toronto — but without a benchmark you can still get overcharged. QuoteXbert gives you that benchmark for free.",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm">
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
            Get a Free Estimate for Your Pickering Project →
          </Link>
        </div>
      </section>

      {/* Contractor CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Are You a Contractor in Pickering?</h2>
          <p className="text-gray-300 text-lg mb-6">
            Join QuoteXbert&apos;s Founding Contractor Program. Get exclusive access to verified homeowner leads
            in Pickering, Seaton, and all of Durham Region. Limited spots — early contractors get priority placement.
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
              Learn About the Durham Program
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">
            Pickering Renovation FAQ
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
          <h3 className="text-xl font-black text-gray-900 mb-5">More Durham Region Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Whitby Renovation Estimates', href: '/whitby' },
              { label: 'Ajax Renovation Estimates', href: '/ajax' },
              { label: 'Oshawa Renovation Estimates', href: '/oshawa' },
              { label: 'Roof Replacement Pickering', href: '/roof-replacement-pickering' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Renovation Estimates Pickering', href: '/renovation-estimates-pickering' },
              { label: 'Contractor Leads Pickering', href: '/contractor-leads-pickering' },
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'QuoteXbert — Pickering Home Renovation Estimates',
            description:
              'AI-powered home renovation estimates for Pickering, Ontario homeowners. Free quotes from verified Durham Region contractors.',
            url: 'https://www.quotexbert.com/pickering',
            areaServed: {
              '@type': 'City',
              name: 'Pickering',
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
