import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Shield, Users, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'General Contractors Durham Region | Verified & Licensed | QuoteXbert',
  description:
    'Find general contractors in Durham Region, Ontario. Verified, licensed GCs for full home renovations across Oshawa, Whitby, Ajax, Pickering & all Durham cities. Free AI estimates.',
  keywords: [
    'general contractors Durham Region',
    'Durham Region general contractor',
    'GC Durham Region Ontario',
    'licensed general contractor Durham',
    'Oshawa general contractor',
    'Whitby general contractor',
    'home renovation contractor Durham',
  ],
  openGraph: {
    title: 'General Contractors Durham Region | QuoteXbert',
    description: 'Verified, licensed general contractors across all of Durham Region. Free AI estimates for homeowners.',
    url: 'https://www.quotexbert.com/general-contractors-durham-region',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'General Contractors Durham Region | QuoteXbert', description: 'Verified GCs across Durham Region. Free AI estimates.' },
  alternates: { canonical: 'https://www.quotexbert.com/general-contractors-durham-region' },
};

const gcServices = [
  { name: 'Full Home Renovations', desc: 'Kitchen, bathroom, basement, and whole-home renovations managed by a single GC.' },
  { name: 'Basement Finishing', desc: 'Project management for complete basement finishing including all trades.' },
  { name: 'Kitchen & Bathroom', desc: 'Multi-trade kitchen and bathroom renovations with one point of contact.' },
  { name: 'Additions & Extensions', desc: 'Home addition projects requiring structural, mechanical, and finishing work.' },
  { name: 'Permit Management', desc: 'Building permit application and management for Durham Region municipalities.' },
  { name: 'Subcontractor Coordination', desc: 'Hiring and coordinating electricians, plumbers, HVAC, and finishing trades.' },
];

const durhamGCCities = [
  { name: 'Oshawa', href: '/oshawa' },
  { name: 'Whitby', href: '/whitby' },
  { name: 'Ajax', href: '/ajax' },
  { name: 'Pickering', href: '/pickering' },
  { name: 'Bowmanville', href: '/bowmanville' },
  { name: 'Clarington', href: '/clarington' },
];

const faqs = [
  { q: 'What does a general contractor do in Durham Region?', a: 'A general contractor (GC) in Durham Region manages all aspects of your renovation project — hiring and scheduling subcontractors (plumbers, electricians, drywallers, etc.), obtaining permits, ordering materials, and ensuring the project is completed on time and on budget. A GC is your single point of contact for multi-trade renovations.' },
  { q: 'When do I need a general contractor in Durham Region?', a: 'You need a general contractor in Durham Region when your renovation involves multiple trades, structural changes, permit requirements, or a complex scope of work. For simple single-trade jobs (just painting, just flooring), hiring the tradesperson directly is fine. For kitchen renovations, basement finishing, or additions, a GC is highly recommended.' },
  { q: 'How much does a general contractor cost in Durham Region?', a: "GCs in Durham Region typically charge 10–20% of the total project cost as their management fee. On a $40,000 kitchen renovation, expect $4,000–$8,000 in GC fees. This covers project management, scheduling, warranty, and accountability — well worth it for complex projects." },
  { q: 'How do I find a reliable general contractor in Durham Region?', a: 'QuoteXbert verifies all contractors before listing them. Each GC on the platform is licensed, insured, and background-checked. Get a free AI estimate first, then connect with verified Durham Region general contractors who specialize in your project type.' },
  { q: 'Is a general contractor different from a handyman in Durham Region?', a: "Yes. A handyman handles small, simple repairs. A general contractor manages large renovation projects, is licensed and insured, pulls permits, coordinates multiple trades, and stands behind the completed work with a warranty. For any project over $5,000, use a licensed GC in Durham Region." },
];

export default function GeneralContractorsDurhamRegionPage() {
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
            <span className="text-gray-900 font-medium">General Contractors</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Shield className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Verified General Contractors — All of Durham Region</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                General Contractors<br />Durham Region
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Find verified, licensed general contractors across all of Durham Region.
              Oshawa, Whitby, Ajax, Pickering, Bowmanville, and every Durham city.
              Get a free AI estimate first — then connect with the right GC.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Licensed & Insured GCs</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Shield className="w-4 h-4 text-blue-500" /><span>Background-Checked</span></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/for-contractors" className="inline-flex items-center gap-2 bg-white border-2 border-rose-600 text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-all text-lg">
                <Users className="w-5 h-5" /> Join as a GC
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* GC Services */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">What Durham Region GCs Provide</h2>
          <p className="text-center text-gray-600 mb-10">Services included when you hire a general contractor in Durham Region</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {gcServices.map((service) => (
              <div key={service.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{service.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Find GCs in Your Durham City</h2>
          <div className="flex flex-wrap gap-3 justify-center mt-8">
            {durhamGCCities.map((city) => (
              <Link key={city.href} href={city.href} className="bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 font-medium px-5 py-2 rounded-full text-sm transition-colors">
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region General Contractor FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Find Your Durham Region General Contractor</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate, then connect directly with verified GCs in your city. No middlemen. No fees.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors">Get My Free AI Estimate →</Link>
            <Link href="/for-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">Join as a GC</Link>
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
              { label: 'Durham Contractors', href: '/durham-region-contractors' },
              { label: 'Durham Renovation Estimates', href: '/durham-region-renovation-estimates' },
              { label: 'Home Renovation Durham', href: '/durham-region-home-renovation' },
              { label: 'General Contractor Leads Toronto', href: '/general-contractor-leads-toronto' },
              { label: 'Get a Free Estimate', href: '/create-lead' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
