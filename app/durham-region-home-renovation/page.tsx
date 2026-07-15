import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Wrench, Home, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home Renovation Durham Region | Full-Service Contractor Matching | QuoteXbert',
  description:
    'Home renovation services across all of Durham Region, Ontario. AI estimates + verified contractor matching for kitchen, bathroom, basement, deck, roofing & more. Free for homeowners.',
  keywords: [
    'home renovation Durham Region',
    'Durham Region home renovation',
    'renovation services Durham Ontario',
    'Durham Region kitchen renovation',
    'Durham Region bathroom renovation',
    'Durham Region basement renovation',
    'home improvement Durham Region',
  ],
  openGraph: {
    title: 'Home Renovation Durham Region | QuoteXbert',
    description: 'Full-service home renovation estimates and contractor matching for Durham Region homeowners.',
    url: 'https://www.quotexbert.com/durham-region-home-renovation',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Renovation Durham Region | QuoteXbert',
    description: 'AI estimates + verified contractors for all Durham Region home renovation projects.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/durham-region-home-renovation',
  },
};

const renovationServices = [
  {
    name: 'Kitchen Renovation',
    desc: 'Full kitchen remodels including cabinets, countertops, flooring, lighting, and appliances. Durham Region kitchens run $15,000–$50,000.',
    href: '/kitchen-renovation-bowmanville',
    icon: '🍳',
  },
  {
    name: 'Bathroom Renovation',
    desc: 'Bathroom updates from simple refreshes to full gut renovations. Durham Region bathrooms run $8,500–$25,000.',
    href: '/bathroom-renovation-courtice',
    icon: '🚿',
  },
  {
    name: 'Basement Finishing',
    desc: 'Turn your unfinished basement into living space, a rental suite, or a rec room. Durham Region basements run $18,000–$60,000.',
    href: '/basement-renovation-oshawa',
    icon: '🏠',
  },
  {
    name: 'Deck Building',
    desc: 'Custom wood, composite, or PVC decks and outdoor living areas. Durham Region decks run $6,500–$25,000.',
    href: '/deck-builders-whitby',
    icon: '🌲',
  },
  {
    name: 'Flooring Installation',
    desc: 'Hardwood, LVP, tile, laminate, and carpet for any room. Durham Region flooring runs $2,200–$12,000.',
    href: '/flooring-ajax',
    icon: '⬛',
  },
  {
    name: 'Roof Replacement',
    desc: 'Asphalt shingle, metal, and flat roofing. Durham Region roof replacements run $7,000–$20,000.',
    href: '/roof-replacement-pickering',
    icon: '🏚',
  },
  {
    name: 'Painting',
    desc: 'Interior and exterior painting, including drywall prep and trim. Durham Region painting runs $1,500–$8,000.',
    href: '/painting-bowmanville',
    icon: '🖌',
  },
  {
    name: 'Drywall & Framing',
    desc: 'Drywall installation, finishing, and framing for walls and ceilings. Durham Region drywall work runs $1,800–$10,000.',
    href: '/drywall-oshawa',
    icon: '🧱',
  },
];

const durhamFacts = [
  { label: 'Population', value: '730,000+' },
  { label: 'Municipalities', value: '8' },
  { label: 'Cities Served', value: '12+' },
  { label: 'Below Toronto Rates', value: '15–20%' },
  { label: 'Active Contractors', value: '100+' },
  { label: 'Avg. Estimate Time', value: '< 3 min' },
];

const faqs = [
  {
    q: 'What home renovation services are available in Durham Region?',
    a: 'QuoteXbert connects Durham Region homeowners with contractors for virtually every home renovation trade: kitchens, bathrooms, basements, decks, roofing, flooring, painting, drywall, electrical, plumbing, HVAC, windows, siding, and more. If you need it done, we can help you find a verified contractor.',
  },
  {
    q: 'How much does home renovation cost in Durham Region?',
    a: 'Durham Region renovation costs are typically 15–20% below Toronto core rates. A kitchen renovation runs $15,000–$50,000, bathroom $8,500–$25,000, and basement finishing $18,000–$60,000. Total renovation costs depend heavily on scope, materials, and your specific city.',
  },
  {
    q: "What's the most popular renovation in Durham Region?",
    a: "Basement finishing is extremely popular across Durham Region, particularly in newer subdivisions in Whitby, Ajax, Pickering, and Clarington where builders leave basements unfinished. Kitchen and bathroom renovations are the next most common projects, followed by deck construction.",
  },
  {
    q: "Should I renovate or sell my Durham Region home?",
    a: "With Durham Region's strong real estate market, strategic renovations often yield excellent ROI. Kitchen renovations typically return 60–80% of cost on resale. Basement finishing — especially as a rental suite — can pay for itself within 2–3 years through rental income. Always get an estimate before deciding.",
  },
];

export default function DurhamRegionHomeRenovationPage() {
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
            <span className="text-gray-900 font-medium">Home Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Home className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Home Renovation Across All of Durham Region</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Home Renovation<br />in Durham Region
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Durham Region is one of Ontario&apos;s fastest-growing areas — and one of the best places to renovate.
              Lower labour costs, strong contractor supply, and a booming real estate market make every dollar go further.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>5.0/5 Rating</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100+ Verified Contractors</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                <DollarSign className="w-4 h-4 text-blue-500" />
                <span>15–20% Below Toronto</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl"
              >
                📸 Get My Free AI Estimate
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Durham Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {durhamFacts.map((fact) => (
              <div key={fact.label} className="text-center">
                <p className="text-2xl font-black text-rose-600">{fact.value}</p>
                <p className="text-xs text-gray-600 mt-1">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Durham Region */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Why Renovate in Durham Region?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">💰 Lower Costs Than Toronto</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Labour rates in Durham Region are 15–20% below Toronto core. The same kitchen renovation that
                  costs $45,000 in Toronto can be done for $35,000–$38,000 in Oshawa or Whitby by equally skilled tradespeople.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">📈 Strong Real Estate Market</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Durham Region real estate has consistently appreciated. Renovations that add quality and space — especially
                  basement finishing and kitchen updates — deliver strong ROI in this market.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">👷 Strong Contractor Supply</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Durham Region has a large base of skilled renovation contractors who grew up serving this market.
                  Many contractors who started in Toronto have relocated to Durham, bringing big-city skills at regional rates.
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">🏠 Aging Housing Stock</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Durham Region has tens of thousands of homes from the 1970s–1990s that are prime for renovation.
                  Kitchens, bathrooms, and basements in these homes offer excellent value-add opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Renovation Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Renovation Services in Durham Region</h2>
          <p className="text-center text-gray-600 mb-10">Click any service to see Durham Region pricing and get an estimate</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {renovationServices.map((service) => (
              <Link
                key={service.name}
                href={service.href}
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-200 transition-all group"
              >
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-rose-700 text-sm">{service.name}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{service.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Durham Region Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">
            Get a free AI estimate for any project. Know the fair price before talking to a single contractor.
          </p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block text-lg">
            Get My Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region Renovation FAQ</h2>
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
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'General Contractors Durham', href: '/general-contractors-durham-region' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Kitchen Renovation Bowmanville', href: '/kitchen-renovation-bowmanville' },
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
