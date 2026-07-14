import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, CheckCircle, Shield, Wrench, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Find Contractors in Durham Region | Verified & Licensed | QuoteXbert',
  description:
    'Find verified, licensed contractors in Durham Region, Ontario. Serving Oshawa, Whitby, Ajax, Pickering, Bowmanville & all Durham cities. Free for homeowners. Join as a founding contractor.',
  keywords: [
    'Durham Region contractors',
    'contractors Durham Region Ontario',
    'verified contractors Durham Region',
    'Oshawa contractors',
    'Whitby contractors',
    'Ajax contractors',
    'Pickering contractors',
    'home renovation contractors Durham',
    'find a contractor Durham Region',
  ],
  openGraph: {
    title: 'Find Contractors in Durham Region | QuoteXbert',
    description: 'Verified, licensed contractors across all of Durham Region. Free for homeowners to connect.',
    url: 'https://www.quotexbert.com/durham-region-contractors',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Contractors in Durham Region | QuoteXbert',
    description: 'Verified, licensed contractors across Durham Region. Connect for free.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/durham-region-contractors',
  },
};

const contractorTypes = [
  { type: 'General Contractors', icon: '🔨', desc: 'Full-scope renovations, project management, and coordination across all trades.' },
  { type: 'Kitchen Specialists', icon: '🍳', desc: 'Kitchen design, cabinet installation, countertops, tile, and appliances.' },
  { type: 'Bathroom Renovators', icon: '🚿', desc: 'Bathroom remodels including plumbing, tile, vanity, and fixtures.' },
  { type: 'Basement Finishers', icon: '🏠', desc: 'Framing, insulation, drywall, flooring, and complete basement finishing.' },
  { type: 'Deck Builders', icon: '🌲', desc: 'Custom decks, patios, pergolas, and outdoor living structures.' },
  { type: 'Flooring Installers', icon: '⬛', desc: 'Hardwood, LVP, tile, laminate, and carpet installation.' },
  { type: 'Roofers', icon: '🏚', desc: 'Roof replacement, repairs, eavestroughs, and soffits.' },
  { type: 'Painters', icon: '🖌', desc: 'Interior and exterior painting, drywall finishing, and wallpaper removal.' },
  { type: 'Electricians', icon: '⚡', desc: 'Panel upgrades, wiring, pot lights, and EV charger installations.' },
  { type: 'Plumbers', icon: '🔧', desc: 'Bathroom plumbing, kitchen plumbing, water heaters, and drain work.' },
  { type: 'HVAC Technicians', icon: '❄️', desc: 'Furnace replacement, A/C installation, ductwork, and heat pumps.' },
  { type: 'Drywall & Plastering', icon: '🧱', desc: 'Drywall installation, taping, mudding, and ceiling repairs.' },
];

const durhamCities = [
  { name: 'Oshawa', href: '/oshawa' },
  { name: 'Whitby', href: '/whitby' },
  { name: 'Ajax', href: '/ajax' },
  { name: 'Pickering', href: '/pickering' },
  { name: 'Bowmanville', href: '/bowmanville' },
  { name: 'Clarington', href: '/clarington' },
  { name: 'Courtice', href: '/courtice' },
  { name: 'Newcastle', href: '/newcastle' },
  { name: 'Port Perry', href: '/port-perry' },
  { name: 'Uxbridge', href: '/uxbridge' },
  { name: 'Scugog Township', href: '/scugog' },
  { name: 'Brock Township', href: '/brock' },
];

const faqs = [
  {
    q: 'How does QuoteXbert verify Durham Region contractors?',
    a: 'All contractors on QuoteXbert go through a verification process that includes confirming their Ontario contractor licence, insurance (general liability and WSIB coverage), and identity. We also review their project history and customer feedback. Only verified contractors appear on the platform.',
  },
  {
    q: 'Is it free to find a contractor in Durham Region through QuoteXbert?',
    a: 'Yes — homeowners use QuoteXbert for free. You can get an AI estimate and connect directly with verified contractors at no cost. There are no booking fees, commissions, or hidden charges for homeowners.',
  },
  {
    q: 'What is the Founding Contractor Program?',
    a: "QuoteXbert's Founding Contractor Program offers early contractors in Durham Region priority placement, discounted subscription rates, and exclusive access to homeowner leads before the platform opens to the general contractor market. Founding spots are limited and reserved for contractors who join early.",
  },
  {
    q: 'How do I find a general contractor in Durham Region?',
    a: 'Get a free AI estimate on QuoteXbert, then connect directly with verified general contractors who serve your city in Durham Region. You can compare multiple contractors, review their credentials, and make an informed hiring decision — all on one platform.',
  },
  {
    q: 'Can I trust contractor quotes in Durham Region?',
    a: "Getting an AI estimate first gives you a reliable benchmark. If a contractor's quote is more than 20–25% above the AI estimate, ask them to explain why — there may be legitimate reasons, or you may want a second opinion. Never accept the first quote without comparison.",
  },
];

export default function DurhamRegionContractorsPage() {
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
            <span className="text-gray-900 font-medium">Contractors</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Shield className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Verified &amp; Licensed Durham Region Contractors</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Contractors in<br />Durham Region
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Every contractor on QuoteXbert is licensed, insured, and background-checked.
              Connect with verified Durham Region tradespeople for any home renovation project.
              <strong> Free for homeowners.</strong>
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
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Licensed &amp; Insured</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                📸 Get My Free AI Estimate
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/for-contractors"
                className="inline-flex items-center gap-2 bg-white border-2 border-rose-600 text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-all text-lg"
              >
                <Users className="w-5 h-5" />
                Join as a Contractor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">How We Verify Durham Contractors</h2>
          <p className="text-center text-gray-600 mb-10">Every contractor goes through our verification process before appearing on QuoteXbert</p>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '📋', title: 'Ontario Licence Check', desc: 'We confirm each contractor holds valid Ontario licences for their trade.' },
              { icon: '🛡️', title: 'Insurance Verification', desc: 'General liability and WSIB coverage confirmed — protecting you from liability.' },
              { icon: '✅', title: 'Identity Verification', desc: 'Business identity and owner identity are confirmed during onboarding.' },
              { icon: '⭐', title: 'Ongoing Reviews', desc: 'Customer reviews and project history are monitored to maintain quality standards.' },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contractor Types */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Types of Contractors in Durham Region</h2>
          <p className="text-center text-gray-600 mb-10">QuoteXbert connects you with every trade you need</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {contractorTypes.map((ct) => (
              <div key={ct.type} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <div className="text-3xl mb-2">{ct.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{ct.type}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{ct.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contractor Program CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black mb-4">Are You a Durham Region Contractor?</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                QuoteXbert&apos;s Founding Contractor Program is open to verified contractors across Durham Region.
                Founding members get:
              </p>
              <ul className="space-y-3 text-gray-300">
                {[
                  'Priority listing for your service area',
                  'Discounted founding member subscription rate',
                  'Access to homeowner leads before public launch',
                  'QuoteXbert Verified badge and profile',
                  'Direct lead notifications with no middleman',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center">
              <div className="bg-rose-600 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-3">Limited Founding Spots</h3>
                <p className="text-rose-100 mb-6">
                  We limit contractors per trade per area to protect lead quality. Once founding spots are filled,
                  standard subscription rates apply.
                </p>
                <Link
                  href="/for-contractors"
                  className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors block"
                >
                  Claim My Founding Contractor Spot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Coverage */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Durham Region Cities We Serve</h2>
          <p className="text-center text-gray-600 mb-8">Find contractors in every Durham Region municipality</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {durhamCities.map((city) => (
              <Link
                key={city.href}
                href={city.href}
                className="bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-medium px-4 py-2 rounded-full text-sm transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Contractor FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Durham Region Hub', href: '/durham-region' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Home Renovation Durham', href: '/durham-region-home-renovation' },
              { label: 'General Contractors Durham', href: '/general-contractors-durham-region' },
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
    </main>
  );
}
