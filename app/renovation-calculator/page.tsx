import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Renovation Cost Calculators | Ontario | QuoteXbert',
  description: 'Free renovation cost calculators for Ontario homeowners. Kitchen, bathroom, basement, flooring, painting, deck, roof, and window calculators — calibrated to Ontario city market rates.',
  keywords: ['renovation calculator Ontario', 'kitchen renovation calculator', 'bathroom renovation calculator', 'basement finishing calculator', 'home renovation cost calculator Ontario'],
  openGraph: { title: 'Free Renovation Cost Calculators | QuoteXbert', description: 'Instant renovation cost estimates for every project type — Ontario market rates.', url: 'https://www.quotexbert.com/renovation-calculator', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Free Renovation Cost Calculators | QuoteXbert', description: 'Instant renovation calculators for Ontario homeowners.' },
  alternates: { canonical: 'https://www.quotexbert.com/renovation-calculator' },
};

const calculators = [
  { title: 'Kitchen Renovation Calculator', desc: 'Estimate costs by kitchen size, finish level, and Ontario city. Accounts for layout changes and appliance upgrades.', href: '/kitchen-renovation-calculator', icon: '🍳', time: '30 sec' },
  { title: 'Bathroom Renovation Calculator', desc: 'Estimate powder room, standard, or master en-suite renovation costs with optional heated floors and glass enclosure.', href: '/bathroom-renovation-calculator', icon: '🚿', time: '30 sec' },
  { title: 'Basement Finishing Calculator', desc: 'Calculate open-concept, with bathroom, or legal rental suite basement costs by size and Ontario city.', href: '/basement-renovation-calculator', icon: '🏠', time: '30 sec' },
  { title: 'Flooring Calculator', desc: 'Calculate installation costs for LVP, engineered hardwood, solid hardwood, tile, laminate, or carpet.', href: '/flooring-calculator', icon: '⬛', time: '30 sec' },
  { title: 'Painting Cost Calculator', desc: 'Estimate interior and/or exterior painting costs by home size and Ontario city.', href: '/painting-calculator', icon: '🖌', time: '30 sec' },
  { title: 'Deck Building Calculator', desc: 'Calculate wood, cedar, or composite deck costs by size with optional stairs and pergola.', href: '/deck-calculator', icon: '🌲', time: '30 sec' },
  { title: 'Roof Replacement Calculator', desc: 'Estimate roof replacement costs by home size and shingle type (3-tab, architectural, or metal).', href: '/roof-replacement-calculator', icon: '🏚', time: '30 sec' },
  { title: 'Window Replacement Calculator', desc: 'Calculate window replacement costs by window count, type, and frame material.', href: '/window-replacement-calculator', icon: '🪟', time: '30 sec' },
];

export default function RenovationCalculatorHubPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-rose-600">Guides</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Renovation Calculators</span>
          </nav>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg mb-4">
              <Calculator className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">Free Renovation Cost Calculators</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">
              Ontario Renovation<br />Cost Calculators
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Instant renovation cost estimates for every project type — calibrated to Ontario city market rates.
              Use any calculator for a quick budget estimate, then get a free AI estimate for maximum accuracy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {calculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-lg hover:border-rose-300 transition-all group">
                <div className="text-4xl mb-3">{calc.icon}</div>
                <h3 className="font-black text-gray-900 mb-2 text-sm group-hover:text-rose-700 leading-tight">{calc.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{calc.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">⚡ {calc.time}</span>
                  <span className="text-xs font-bold text-rose-600 group-hover:text-rose-700">Open →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center">
            <h2 className="text-2xl font-black text-gray-900 mb-3">Want Maximum Accuracy?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Calculators give good rough estimates. For the most accurate price — specific to your home, your neighbourhood, and your project scope — upload photos and get a free AI estimate from QuoteXbert.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/create-lead" className="bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl hover:shadow-lg transition-all text-lg">
                📸 Get My Free AI Estimate →
              </Link>
              <Link href="/how-ai-works" className="border border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-2xl hover:border-rose-300 hover:text-rose-600 transition-colors">
                How AI Estimates Work
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-3">Free · Calibrated to your Ontario city · Takes 2 minutes</p>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'QuoteXbert Renovation Cost Calculators',
        description: 'Free renovation cost calculators for Ontario homeowners — kitchen, bathroom, basement, flooring, painting, deck, roof, and window calculators.',
        applicationCategory: 'UtilityApplication',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'CAD' },
        url: 'https://www.quotexbert.com/renovation-calculator',
      })}} />
    </main>
  );
}
