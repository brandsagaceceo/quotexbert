import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Brain, MapPin, Zap, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Renovation Estimates Durham Region | How It Works | QuoteXbert',
  description:
    'How AI renovation estimates work for Durham Region homeowners. Why Oshawa estimates differ from Pickering — and how QuoteXbert calibrates AI pricing to your specific city. Free for homeowners.',
  keywords: [
    'AI renovation estimates Durham Region',
    'AI renovation estimate Oshawa',
    'AI renovation estimate Whitby',
    'AI renovation estimate Ajax',
    'AI renovation estimate Pickering',
    'free renovation estimate Durham Region',
    'instant renovation estimate Ontario',
    'how AI renovation estimates work',
  ],
  openGraph: {
    title: 'AI Renovation Estimates Durham Region | QuoteXbert',
    description: 'How AI renovation estimates are calibrated to your Durham Region city. Oshawa, Whitby, Ajax, Pickering & more.',
    url: 'https://www.quotexbert.com/ai-renovation-estimates-durham-region',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'AI Renovation Estimates Durham Region | QuoteXbert', description: 'How AI renovation estimates work for Durham Region homeowners.' },
  alternates: { canonical: 'https://www.quotexbert.com/ai-renovation-estimates-durham-region' },
};

const durhamCityCosts = [
  { city: 'Pickering', multiplier: '~0.87×', kitchenExample: '$30,000', note: 'Closest to Toronto — slightly higher than other Durham cities' },
  { city: 'Ajax', multiplier: '~0.86×', kitchenExample: '$29,500', note: 'Family-oriented market with strong renovation activity' },
  { city: 'Whitby', multiplier: '~0.85×', kitchenExample: '$29,000', note: 'Fast-growing — good contractor competition keeps rates fair' },
  { city: 'Oshawa', multiplier: '~0.84×', kitchenExample: '$28,500', note: "Durham's largest city — deepest contractor pool, competitive rates" },
  { city: 'Bowmanville/Clarington', multiplier: '~0.83×', kitchenExample: '$28,000', note: 'Further from Toronto — lower overhead costs for contractors' },
  { city: 'Port Perry/Scugog', multiplier: '~0.82×', kitchenExample: '$27,500', note: 'Rural market — access factors can add cost for some projects' },
  { city: 'Uxbridge/Brock', multiplier: '~0.81×', kitchenExample: '$27,000', note: 'Rural northern Durham — access considerations apply' },
];

const aiAccuracyData = [
  { type: 'Kitchen Renovation', accuracy: '±12%', confidence: 'High', note: 'Large training dataset for standard kitchens' },
  { type: 'Bathroom Renovation', accuracy: '±13%', confidence: 'High', note: 'High accuracy for standard 3-piece and 4-piece bathrooms' },
  { type: 'Basement Finishing', accuracy: '±14%', confidence: 'High', note: 'Very common project — strong Durham Region data' },
  { type: 'Deck Construction', accuracy: '±15%', confidence: 'High', note: 'Accurate for standard decks; complex multi-level decks vary more' },
  { type: 'Roof Replacement', accuracy: '±12%', confidence: 'High', note: 'Accurate based on roof size and material type' },
  { type: 'Flooring Installation', accuracy: '±11%', confidence: 'Very High', note: 'Highly predictable based on area and material' },
  { type: 'Window Replacement', accuracy: '±14%', confidence: 'High', note: 'Accurate for standard sizes; custom shapes vary' },
  { type: 'Custom/Heritage Projects', accuracy: '±25%', confidence: 'Medium', note: 'Less data for unique heritage work in rural Durham' },
];

const howItWorksSteps = [
  {
    step: '1',
    title: 'Upload Project Photos',
    desc: 'Photos give the AI visual data about your space — room size, existing materials, complexity, and potential challenges specific to your Durham Region home.',
  },
  {
    step: '2',
    title: 'Describe Your Project',
    desc: 'Tell us what you want changed. "Full kitchen renovation with open-concept layout change" and "new countertops and backsplash only" get very different estimates. Be specific.',
  },
  {
    step: '3',
    title: 'Select Your Durham City',
    desc: "We ask for your city — Oshawa, Whitby, Ajax, Pickering, Bowmanville, or other Durham communities. This is critical: a $35,000 Toronto kitchen costs $28,000–$30,000 in Oshawa.",
  },
  {
    step: '4',
    title: 'AI Generates Calibrated Estimate',
    desc: "Our AI cross-references your project against thousands of Durham Region renovation projects, applies your city's local market multiplier, and generates a three-tier estimate (basic, mid-range, premium).",
  },
  {
    step: '5',
    title: 'You Receive Your Benchmark',
    desc: 'Within 3 minutes, you have a market-calibrated estimate for your specific Durham Region city. Use this as a benchmark when collecting contractor quotes.',
  },
  {
    step: '6',
    title: 'Connect with Verified Contractors',
    desc: 'If you choose, connect directly with verified, licensed contractors who serve your Durham Region city — all through QuoteXbert, free for homeowners.',
  },
];

const faqs = [
  {
    q: 'How accurate are AI renovation estimates for Durham Region?',
    a: "For standard renovations (kitchens, bathrooms, basements), AI estimates for Durham Region are typically within 10–15% of final contractor quotes. The AI has strong training data for common Durham Region project types. Heritage homes, unusual layouts, and highly custom projects may have wider variance.",
  },
  {
    q: 'Why does the AI give different estimates for Oshawa vs Pickering?',
    a: "Because contractor rates genuinely differ between Durham cities. Pickering is closest to Toronto and has slightly higher contractor overhead. Oshawa and Bowmanville, being further east, have lower contractor overhead. The AI applies city-specific multipliers to reflect these real market differences.",
  },
  {
    q: 'Can AI estimates replace contractor quotes in Durham Region?',
    a: "No — AI estimates are benchmarks, not final quotes. A contractor visiting your specific home in Whitby or Ajax will factor in site-specific conditions (access, existing conditions, hidden issues) that photos can't fully capture. Use the AI estimate to evaluate whether contractor quotes are reasonable.",
  },
  {
    q: 'How is QuoteXbert AI different from generic renovation calculators?',
    a: "Generic calculators use national or provincial averages. QuoteXbert is trained specifically on Durham Region and Ontario renovation projects, with city-level calibration. An Oshawa kitchen estimate from QuoteXbert reflects actual Oshawa contractor rates — not a generic Ontario average that could be 20% off.",
  },
  {
    q: "What information gives the AI the most accurate Durham Region estimate?",
    a: "The most accurate estimates come from: (1) clear photos from multiple angles, (2) room dimensions if available, (3) specific project description (not just 'renovate kitchen' but 'remove wall, add island, replace all cabinets and countertops'), (4) materials quality preference (budget/mid-range/premium), and (5) correct city selection.",
  },
];

export default function AIRenovationEstimatesDurhamPage() {
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
            <span className="text-gray-900 font-medium">AI Renovation Estimates</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Brain className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">AI Estimates Calibrated to Durham Region</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                AI Renovation Estimates<br />for Durham Region
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              QuoteXbert&apos;s AI generates renovation estimates calibrated specifically to Durham Region — not
              generic Ontario averages. Your Oshawa estimate reflects Oshawa contractor rates.
              Your Pickering estimate reflects Pickering rates. Free in minutes.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Brain className="w-4 h-4 text-purple-500" /><span>City-Calibrated AI</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>±12–15% Accuracy</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Zap className="w-4 h-4 text-blue-500" /><span>&lt;3 min Results</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Free for Homeowners</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-xl">
                📸 Get My Free Durham Region Estimate
                <ArrowRight className="w-6 h-6" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* City-by-City Calibration */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">How Costs Differ Across Durham Cities</h2>
          <p className="text-center text-gray-600 mb-4">Example: $35,000 Toronto kitchen renovated in each Durham city</p>
          <p className="text-center text-sm text-gray-500 mb-8">The AI applies these city-specific multipliers to every estimate</p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="text-left px-4 py-3 font-bold">Durham City</th>
                  <th className="text-center px-4 py-3 font-bold">vs Toronto</th>
                  <th className="text-center px-4 py-3 font-bold">$35K Kitchen Cost</th>
                  <th className="text-left px-4 py-3 font-bold hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {durhamCityCosts.map((row, i) => (
                  <tr key={row.city} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.city}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-bold">{row.multiplier}</td>
                    <td className="px-4 py-3 text-center font-black text-rose-700">{row.kitchenExample}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm hidden md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">* Approximate multipliers based on market data. Actual variance depends on contractor, project type, and timing.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-10 text-center">How Your Durham Region AI Estimate is Generated</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {howItWorksSteps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="w-10 h-10 bg-rose-600 text-white font-black text-lg rounded-full flex items-center justify-center mb-4">
                  {step.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy by Project Type */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">AI Estimate Accuracy by Project Type (Durham Region)</h2>
          <div className="overflow-x-auto mt-8">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left px-4 py-3 font-bold text-gray-700">Project Type</th>
                  <th className="text-center px-4 py-3 font-bold text-gray-700">Typical Accuracy</th>
                  <th className="text-center px-4 py-3 font-bold text-gray-700">Confidence</th>
                  <th className="text-left px-4 py-3 font-bold text-gray-700 hidden md:table-cell">Note</th>
                </tr>
              </thead>
              <tbody>
                {aiAccuracyData.map((row, i) => (
                  <tr key={row.type} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.type}</td>
                    <td className="px-4 py-3 text-center font-bold text-rose-700">{row.accuracy}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${row.confidence === 'Very High' ? 'bg-green-100 text-green-800' : row.confidence === 'High' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>{row.confidence}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* City Quick Links */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Get an Estimate for Your Durham City</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {[
              { city: 'Oshawa', href: '/oshawa' },
              { city: 'Whitby', href: '/whitby' },
              { city: 'Ajax', href: '/ajax' },
              { city: 'Pickering', href: '/pickering' },
              { city: 'Bowmanville', href: '/bowmanville' },
              { city: 'Clarington', href: '/clarington' },
              { city: 'Courtice', href: '/courtice' },
              { city: 'Newcastle', href: '/newcastle' },
            ].map((c) => (
              <Link key={c.city} href={c.href} className="bg-white rounded-xl p-4 border border-gray-200 text-center hover:border-rose-300 hover:shadow-md transition-all group">
                <MapPin className="w-5 h-5 text-rose-600 mx-auto mb-2" />
                <span className="font-bold text-gray-900 group-hover:text-rose-700 text-sm">{c.city}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Durham Region AI Estimate FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Free Durham Region AI Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">City-calibrated. Instant. Free. No contractor calls needed until you know what&apos;s fair.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block text-lg">Get My Free AI Estimate →</Link>
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
              { label: 'How AI Works', href: '/how-ai-works' },
              { label: 'Why QuoteXbert', href: '/why-quotexbert' },
              { label: 'How AI Helps Homeowners', href: '/blog/how-ai-helps-homeowners-avoid-expensive-quotes' },
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
