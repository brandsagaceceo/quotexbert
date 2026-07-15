import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Bathroom Renovation in Pickering | 2025 Costs & Contractors | QuoteXbert',
  description:
    'Bathroom renovation in Pickering, Ontario. Borders Toronto — bathrooms average $10,000–$30,000. Bay Ridges to Seaton. AI estimates + verified local contractors.',
  keywords: [
    'bathroom renovation Pickering',
    'Pickering bathroom remodel',
    'bathroom contractors Pickering Ontario',
    'bathroom renovation cost Pickering',
    'Seaton bathroom renovation',
  ],
  openGraph: {
    title: 'Bathroom Renovation in Pickering | 2025 Costs | QuoteXbert',
    description: 'Pickering bathroom renovations: $10,000–$30,000. Bay Ridges to Seaton — AI estimates + verified contractors.',
    url: 'https://www.quotexbert.com/bathroom-renovation-pickering',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Bathroom Renovation Pickering | QuoteXbert', description: 'Bathroom renovation cost guide for Pickering. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/bathroom-renovation-pickering' },
};

const bathroomTiers = [
  {
    name: 'Powder Room',
    cost: '$4,500 – $9,500',
    desc: 'Half-bath refresh: vanity, toilet, tile floor, mirror, new lighting. Excellent ROI in Pickering\'s active real estate market.',
  },
  {
    name: 'Standard Bathroom',
    cost: '$10,000 – $20,000',
    desc: 'Full gut renovation: new tile (floor + surround), vanity, toilet, fixtures, updated lighting. Most popular Pickering bathroom project.',
  },
  {
    name: 'Master En-Suite',
    cost: '$18,000 – $32,000',
    desc: 'Frameless glass shower, double vanity, heated floors, large-format tile. Growing demand in Pickering\'s newer communities.',
  },
];

const faqs = [
  {
    q: 'How much does a bathroom renovation cost in Pickering?',
    a: "A standard full bathroom renovation in Pickering costs $10,000–$20,000. Because Pickering borders Scarborough, contractors here are slightly more expensive than Oshawa or Bowmanville — expect rates approximately 12–14% below Toronto core (vs 15–18% further east). A mid-range bathroom project runs $12,000–$16,000.",
  },
  {
    q: 'What bathroom work do Seaton homeowners need most?',
    a: "Pickering's Seaton community is a brand-new development. Most Seaton homeowners who purchased builder homes are looking to: (1) add basement bathrooms not included in the base build, (2) upgrade builder-grade bathroom finishes with custom tile and premium fixtures, and (3) convert main floor powder rooms to larger 3-piece bathrooms.",
  },
  {
    q: "What about Bay Ridges homes — are they harder to renovate?",
    a: "Bay Ridges homes from the 1960s–1970s often have older plumbing (galvanized pipes, original cast iron drains) that may need updating during a bathroom renovation. Budget an extra 10–15% contingency for these homes. The upside: once updated, Bay Ridges homes in Pickering\'s desirable lakefront-adjacent area see excellent value appreciation.",
  },
  {
    q: 'How do I get a bathroom renovation estimate in Pickering?',
    a: "Upload photos of your bathroom on QuoteXbert, describe the scope of work, and receive an AI-powered estimate calibrated to Pickering's local market in minutes. You can then connect with verified bathroom contractors who serve Pickering and the broader Durham Region — completely free for homeowners.",
  },
];

export default function BathroomRenovationPickeringPage() {
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
            <Link href="/pickering" className="hover:text-rose-600">Pickering</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Bathroom Renovation</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Bathroom Renovation<br />in Pickering, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Pickering bathroom renovations average <strong>$10,000–$32,000</strong>.
              From Bay Ridges&apos; lakefront homes to Seaton&apos;s new builds — every Pickering bathroom
              has its unique needs. Get a free estimate in minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Pickering Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>
            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Pickering Bathroom Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Pickering Bathroom Renovation Costs</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {bathroomTiers.map((tier) => (
              <div key={tier.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{tier.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Pickering Bathroom Renovation FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Pickering Bathroom Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Pickering bathroom contractors. No hidden fees.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free AI Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Pickering Hub', href: '/pickering' },
              { label: 'Kitchen Renovation Pickering', href: '/kitchen-renovation-pickering' },
              { label: 'Roof Replacement Pickering', href: '/roof-replacement-pickering' },
              { label: 'Bathroom Renovation Ajax', href: '/bathroom-renovation-ajax' },
              { label: 'Bathroom Renovation Oshawa', href: '/bathroom-renovation-oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
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
