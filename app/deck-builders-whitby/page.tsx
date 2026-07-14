import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Deck Builders in Whitby | Custom Decks & Patios | QuoteXbert',
  description: 'Find deck builders in Whitby, Ontario. AI estimates for composite, wood, and PVC decks. Whitby deck builds average $8,000–$22,000. Verified local deck contractors.',
  keywords: ['deck builders Whitby', 'Whitby deck construction', 'deck contractors Whitby Ontario', 'composite deck Whitby', 'deck building cost Whitby', 'patio builders Whitby'],
  openGraph: { title: 'Deck Builders in Whitby | QuoteXbert', description: 'Find verified deck builders in Whitby. AI estimates for wood, composite & PVC decks.', url: 'https://www.quotexbert.com/deck-builders-whitby', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Deck Builders Whitby | QuoteXbert', description: 'Deck building estimates for Whitby, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/deck-builders-whitby' },
};

const deckTypes = [
  { name: 'Pressure-Treated Wood', cost: '$8,000 – $14,000', desc: 'Most affordable option. Solid, durable, requires regular staining/sealing. 12×16 ft deck. Very popular in Whitby.' },
  { name: 'Cedar Deck', cost: '$12,000 – $20,000', desc: 'Natural beauty, good rot resistance. Requires maintenance. Excellent mid-range choice for Whitby homes.' },
  { name: 'Composite Deck', cost: '$16,000 – $30,000+', desc: 'Low-maintenance, long-lasting, wide range of colours. Composite is increasingly popular in Whitby\'s newer communities.' },
];

const faqs = [
  { q: 'How much does it cost to build a deck in Whitby?', a: 'A deck in Whitby costs between $8,000 and $30,000+ depending on size, material, and complexity. A standard 12×16 ft pressure-treated deck runs $8,000–$12,000. Composite decks are more expensive upfront but lower maintenance. Multi-level decks with stairs and railings add 30–50% to the base cost.' },
  { q: 'Do I need a permit to build a deck in Whitby?', a: 'Yes. In Whitby, a building permit is required for any deck that is attached to the house, more than 600mm (24 inches) above grade, or larger than 108 sq ft (10 m²). Permit costs $200–$600. Your contractor should include permit application in their service.' },
  { q: 'What is the best deck material for Whitby\'s climate?', a: "Whitby experiences hot summers and cold, wet winters. Composite decking is the most weather-resistant option — it won't warp, crack, or splinter. Pressure-treated wood is the most affordable and performs well when maintained. Cedar is a good middle ground with natural resistance to rot and insects." },
  { q: 'How long does a deck build take in Whitby?', a: 'Most deck projects in Whitby take 1–3 weeks once construction begins. Planning, permit approval, and material ordering can add 2–4 weeks to the timeline. Book your contractor well before summer as deck season is competitive in Durham Region.' },
];

export default function DeckBuildersWhitbyPage() {
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
            <Link href="/whitby" className="hover:text-rose-600">Whitby</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Deck Builders</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Deck Builders<br />in Whitby, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Find verified deck builders in Whitby. Wood, cedar, and composite decks — with AI-powered cost estimates.
              Whitby decks average <strong>$8,000–$30,000</strong>. Get your free estimate today.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Deck Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Deck Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Whitby Deck Building Costs</h2>
          <p className="text-center text-gray-600 mb-8">Cost comparison for three popular deck materials in Whitby</p>
          <div className="grid md:grid-cols-3 gap-6">
            {deckTypes.map((type) => (
              <div key={type.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{type.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{type.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Whitby Deck Builder FAQ</h2>
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

      <section className="py-16 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Get Your Whitby Deck Built Right</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Whitby deck builders. No middlemen or hidden fees.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free Deck Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Whitby Hub', href: '/whitby' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Region Contractors', href: '/durham-region-contractors' },
              { label: 'Renovation Estimates Whitby', href: '/renovation-estimates-whitby' },
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
