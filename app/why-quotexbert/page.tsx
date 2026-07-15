import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Shield, Zap, DollarSign, Users, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why QuoteXbert | Transparent AI Renovation Estimates | QuoteXbert',
  description:
    'Why thousands of Ontario homeowners trust QuoteXbert. AI-powered estimates, verified contractors, no hidden fees, transparent pricing, and accurate renovation cost data for Toronto, Durham Region & the GTA.',
  keywords: ['why QuoteXbert', 'QuoteXbert review', 'AI renovation estimates Ontario', 'trusted renovation platform', 'verified contractors Canada'],
  openGraph: {
    title: 'Why QuoteXbert | AI Renovation Estimates You Can Trust',
    description: 'Transparent pricing, verified contractors, no hidden fees. Why Ontario homeowners choose QuoteXbert.',
    url: 'https://www.quotexbert.com/why-quotexbert',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why QuoteXbert | Trusted Renovation Estimates Ontario',
    description: 'AI estimates + verified contractors. Why Ontario homeowners trust QuoteXbert.',
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/why-quotexbert',
  },
};

const pillars = [
  {
    icon: '🤖',
    title: 'Accurate AI Estimates',
    desc: "Our AI is trained on thousands of completed Ontario renovation projects. When you upload photos and describe your project, you receive a market-calibrated estimate — not a guess. The estimate reflects real 2025 pricing for your specific city in Toronto, Durham Region, or the GTA.",
  },
  {
    icon: '✅',
    title: 'Verified Contractors Only',
    desc: 'Every contractor on QuoteXbert is verified before they can appear. We confirm Ontario licences, current liability insurance (minimum $2M), active WSIB coverage, and conduct background checks. No unverified contractors appear on our platform — ever.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    desc: 'QuoteXbert is completely free for homeowners. We charge contractors a subscription fee — not a per-lead fee that gets passed to you in inflated quotes. You get unbiased pricing because we have no financial incentive to inflate estimates.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Your project details and personal information are never sold to advertisers or marketing companies. We use your data only to generate your estimate and connect you with contractors. See our Privacy Policy for full details.',
  },
  {
    icon: '⚡',
    title: 'Speed Without Compromise',
    desc: 'Traditional contractor quote processes take 2–4 weeks. QuoteXbert delivers an AI estimate in under 3 minutes. You get the speed of technology with the accuracy of local market data.',
  },
  {
    icon: '🎯',
    title: 'Local Market Accuracy',
    desc: "One-size-fits-all estimates don't work. A bathroom renovation in Oshawa costs 15% less than the same project in downtown Toronto. QuoteXbert calibrates estimates by city — Oshawa, Whitby, Ajax, Pickering, Bowmanville, and all Toronto neighbourhoods.",
  },
];

const howItsDifferent = [
  { feature: 'AI Estimate Quality', us: 'Trained on 10,000+ Ontario projects', them: 'Generic national pricing' },
  { feature: 'Contractor Verification', us: 'Licence, insurance, WSIB, background check', them: 'Self-reported only' },
  { feature: 'Cost to Homeowners', us: 'Free forever', them: 'Often free but contractors pay per-lead fees' },
  { feature: 'Price Accuracy', us: 'Local market calibration by city', them: 'Province or country averages' },
  { feature: 'Privacy', us: "Data used only for your project", them: 'Often sold to advertisers' },
  { feature: 'Contractor Accountability', us: 'Ongoing monitoring and reviews', them: 'One-time verification' },
];

const faqs = [
  { q: 'Is QuoteXbert really free for homeowners?', a: "Yes, completely. Homeowners use QuoteXbert at no cost — no registration fees, no lead fees, no commissions. We charge contractors a monthly subscription to access homeowner projects, which is far less than per-lead fees on other platforms." },
  { q: 'How does QuoteXbert make money?', a: "Contractors pay a monthly subscription fee to access leads and connect with homeowners. This is a fixed cost for them — they don't pay per lead, which means they have no incentive to inflate quotes to recover lead costs. This model is better for both homeowners and contractors." },
  { q: 'Are the AI estimates accurate?', a: "AI estimates are reliable benchmarks — typically within 10–20% of final contractor quotes for standard projects. They're not final quotes (a contractor still needs to assess your specific situation), but they're accurate enough to identify unreasonable quotes and give you realistic budget expectations." },
  { q: 'Why should I trust QuoteXbert over other platforms?', a: "Three reasons: (1) Our AI is trained specifically on Ontario renovation projects, not generic national data. (2) We physically verify contractor credentials — not just take their word for it. (3) Our contractor fee model doesn't incentivize inflated estimates the way per-lead models do." },
];

export default function WhyQuoteXbertPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Why QuoteXbert</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                Why QuoteXbert
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              AI-powered estimates calibrated to your Ontario city. Verified, background-checked contractors.
              Completely free for homeowners. No hidden fees. No games.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Shield className="w-4 h-4 text-blue-500" /><span>Free for Homeowners</span></div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free AI Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/how-ai-works" className="inline-flex items-center gap-2 bg-white border-2 border-rose-600 text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-all text-lg">
                How the AI Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Six Reasons Ontario Homeowners Trust QuoteXbert</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {pillars.map((p) => (
              <div key={p.title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">QuoteXbert vs Other Platforms</h2>
          <div className="overflow-x-auto mt-8">
            <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-rose-600 text-white">
                  <th className="text-left px-4 py-3 font-bold">Feature</th>
                  <th className="text-center px-4 py-3 font-bold">QuoteXbert</th>
                  <th className="text-center px-4 py-3 font-bold">Other Platforms</th>
                </tr>
              </thead>
              <tbody>
                {howItsDifferent.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-4 py-3 font-medium text-gray-900">{row.feature}</td>
                    <td className="px-4 py-3 text-center text-green-700 font-semibold text-sm">{row.us}</td>
                    <td className="px-4 py-3 text-center text-gray-500 text-sm">{row.them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Founding Contractor Program */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-black mb-4">The Founding Contractor Program</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                QuoteXbert&apos;s early contractors helped build the platform. In recognition, Founding Contractors receive:
              </p>
              <ul className="space-y-2 text-gray-300">
                {[
                  'Priority placement for your city and trade',
                  'Discounted founding member rate — locked in for life',
                  'Access to homeowner leads before the platform expands',
                  'QuoteXbert Verified badge on your profile',
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
                <h3 className="text-2xl font-black mb-3">Limited Spots Remaining</h3>
                <p className="text-rose-100 mb-6 text-sm">Founding spots are limited per trade per area. Once filled, standard rates apply.</p>
                <Link href="/for-contractors" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors block">
                  Claim My Founding Contractor Spot
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Why QuoteXbert FAQ</h2>
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
          <h3 className="text-xl font-black text-gray-900 mb-5">Explore QuoteXbert</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'How AI Works', href: '/how-ai-works' },
              { label: 'For Homeowners', href: '/create-lead' },
              { label: 'For Contractors', href: '/for-contractors' },
              { label: 'Durham Region', href: '/durham-region' },
              { label: 'Toronto', href: '/toronto' },
              { label: 'Pricing', href: '/billing' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'About', href: '/about' },
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
