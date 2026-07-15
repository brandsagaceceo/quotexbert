import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock, Wrench } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Basement Renovation in Oshawa | Costs & Contractors | QuoteXbert',
  description:
    'Basement renovation in Oshawa, Ontario. AI estimates + verified contractors. Oshawa basement finishing averages $22,000–$55,000. Legal suites, rec rooms, home offices. Free for homeowners.',
  keywords: ['basement renovation Oshawa', 'Oshawa basement finishing', 'basement contractors Oshawa', 'Oshawa basement apartment', 'Durham Region basement renovation'],
  openGraph: { title: 'Basement Renovation in Oshawa | QuoteXbert', description: 'AI estimates for Oshawa basement renovations. Average $22,000–$55,000. Verified contractors.', url: 'https://www.quotexbert.com/basement-renovation-oshawa', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Basement Renovation Oshawa | QuoteXbert', description: 'Basement renovation estimates for Oshawa. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/basement-renovation-oshawa' },
};

const basementTypes = [
  { name: 'Open-Concept Finish', cost: '$22,000 – $35,000', desc: 'Insulation, drywall, pot lights, LVP flooring, paint. One open space — ideal for rec room, gym, or office.' },
  { name: 'With Bedroom & Bath', cost: '$32,000 – $50,000', desc: 'Same as above plus a 3-piece bathroom and one enclosed bedroom. Most common Oshawa basement project.' },
  { name: 'Legal Rental Suite', cost: '$42,000 – $70,000+', desc: 'Full secondary suite with kitchen, bathroom, separate entrance (interior or exterior). Requires Oshawa/Durham permit.' },
];

const faqs = [
  { q: 'How much does it cost to finish a basement in Oshawa?', a: 'A basement renovation in Oshawa typically costs $22,000–$70,000+ depending on scope. An open-concept finish runs $22,000–$35,000. Adding a bathroom and bedroom brings it to $32,000–$50,000. A complete legal rental suite costs $42,000–$70,000+. Oshawa rates are 15–18% below Toronto core.' },
  { q: 'Can I create a legal basement apartment in Oshawa?', a: "Yes — Oshawa and Durham Region allow secondary suites (basement apartments) in most residential zones, subject to meeting Ontario Building Code requirements. Key requirements include minimum ceiling height of 6'5\", egress windows in bedrooms, separate entrance, kitchen facilities, and a 3-piece bathroom. A permit is required." },
  { q: 'How long does a basement renovation take in Oshawa?', a: 'A standard basement finishing project in Oshawa takes 6–10 weeks for construction. Planning, design, and permit approval add 3–6 weeks. A legal rental suite may take 10–14 weeks total. Your contractor should provide a detailed schedule before starting.' },
  { q: 'What permits do I need for a basement renovation in Oshawa?', a: 'Building permits are required in Oshawa for most basement finishing work, including creating a secondary suite, adding bathrooms, and any structural or electrical changes. Permit costs typically range $500–$2,000. Your contractor should include permit applications in their service.' },
  { q: 'What is the ROI on finishing a basement in Oshawa?', a: "A finished basement in Oshawa adds 15–25% to your home's value and can generate $1,500–$2,000/month in rental income as a legal suite. Given Oshawa's real estate market and rental demand, finishing your basement is one of the highest-ROI renovations you can make." },
];

export default function BasementRenovationOshawaPage() {
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
            <Link href="/oshawa" className="hover:text-rose-600">Oshawa</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Basement Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Basement Renovation<br />in Oshawa
              </span>
            </h1>

            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Oshawa basement renovations average <strong>$22,000–$70,000+</strong> depending on scope.
              Turn your unfinished basement into a rec room, legal suite, or home office.
              Get a free AI estimate in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Basement Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Oshawa Basement Renovation Costs</h2>
          <p className="text-center text-gray-600 mb-8">Three common basement renovation types in Oshawa</p>
          <div className="grid md:grid-cols-3 gap-6">
            {basementTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{type.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{type.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6 text-center">Oshawa Basement Renovation: What to Expect</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: 'Insulation & Vapour Barrier', desc: 'Critical for Oshawa basements. Spray foam or batt insulation on all exterior walls, plus proper vapour barrier. Don\'t skip this — it prevents moisture damage and mold.' },
              { title: 'Framing & Drywall', desc: 'Steel or wood framing for interior walls, followed by drywall and finishing. Ceiling options include drywall flat ceiling or drop-tile systems (easier for accessing utilities).' },
              { title: 'Electrical', desc: 'Rough-in electrical for outlets, lighting, and the electrical sub-panel. Pot lights are popular in Oshawa basements. An HVAC rough-in is typically included in this phase.' },
              { title: 'Flooring', desc: 'Luxury vinyl plank (LVP) is the most popular basement flooring in Oshawa — moisture-resistant, durable, and comfortable. Tile works well for bathrooms and utility areas.' },
              { title: 'Bathroom (Optional)', desc: 'A 3-piece bathroom adds $8,000–$14,000 to your basement project. A full 4-piece bathroom with tub adds $10,000–$18,000. Required if creating a legal rental suite.' },
              { title: 'Permits', desc: 'Oshawa requires building permits for most basement finishing work. This protects you at resale and during insurance claims. Your contractor should pull the permit before work begins.' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start gap-3">
                  <Wrench className="w-5 h-5 text-rose-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Oshawa Basement Renovation FAQ</h2>
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

      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Start Your Oshawa Basement Renovation</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate for your Oshawa basement. Know the price before you talk to a single contractor.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Oshawa Hub', href: '/oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Drywall Oshawa', href: '/drywall-oshawa' },
              { label: 'Durham Region Contractors', href: '/durham-region-contractors' },
              { label: 'Blog: Should You Finish Your Basement?', href: '/blog/should-you-finish-your-basement' },
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
