import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Painting in Bowmanville | Interior & Exterior | QuoteXbert',
  description: 'Painting contractors in Bowmanville, Ontario. Interior and exterior painting. AI cost estimates. Bowmanville painting averages $1,500–$7,000. Verified local painters.',
  keywords: ['painting Bowmanville', 'Bowmanville painters', 'interior painting Bowmanville', 'exterior painting Bowmanville', 'painting contractors Clarington'],
  openGraph: { title: 'Painting in Bowmanville | QuoteXbert', description: 'AI estimates for interior and exterior painting in Bowmanville. Average $1,500–$7,000.', url: 'https://www.quotexbert.com/painting-bowmanville', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Painting Bowmanville | QuoteXbert', description: 'Painting estimates for Bowmanville, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/painting-bowmanville' },
};

const paintingServices = [
  { name: 'Interior Full Home', cost: '$3,000 – $7,000', desc: 'Walls, ceilings, doors, and trim throughout the home. Based on average 3-bedroom Bowmanville home.' },
  { name: 'Single Room Interior', cost: '$400 – $900', desc: 'Bedroom, living room, or kitchen. Includes walls, ceiling, and trim. Labour and paint included.' },
  { name: 'Exterior Painting', cost: '$3,500 – $9,000', desc: 'Full exterior paint including siding, trim, doors, and eaves. Prep and prime included.' },
  { name: 'Cabinet Painting', cost: '$1,200 – $3,500', desc: 'Kitchen or bathroom cabinet refinishing. Dramatically refreshes the look at a fraction of cabinet replacement cost.' },
];

const faqs = [
  { q: 'How much does interior painting cost in Bowmanville?', a: 'Interior painting in Bowmanville for a full home (3 bedrooms, living room, kitchen, hallways) typically costs $3,000–$7,000 including labour and paint. A single room costs $400–$900. Bowmanville painting rates are competitive — roughly 15% below Toronto core.' },
  { q: 'How do I find a reliable painter in Bowmanville?', a: 'QuoteXbert connects Bowmanville homeowners with verified, background-checked painting contractors. Upload photos of your space, describe the project, and get a free AI estimate. Then connect directly with verified painters who serve Bowmanville and Clarington.' },
  { q: 'What is the best time to paint the exterior of a home in Bowmanville?', a: 'The best time for exterior painting in Bowmanville is late spring through early fall — May through October. Temperatures should be consistently above 10°C. Avoid painting during rain or if temperatures will drop near freezing within 48 hours of painting.' },
  { q: 'Is it worth painting kitchen cabinets in Bowmanville?', a: 'Cabinet painting is one of the highest-ROI home updates in Bowmanville. For $1,200–$3,500, you can dramatically refresh your kitchen without full cabinet replacement ($8,000–$25,000). Cabinet painting is ideal if your existing cabinets are solid wood in good structural condition.' },
];

export default function PaintingBowmanvillePage() {
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
            <Link href="/bowmanville" className="hover:text-rose-600">Bowmanville</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Painting</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent">
                Painting Contractors<br />in Bowmanville
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Interior and exterior painting in Bowmanville. AI-powered estimates in minutes.
              Full home interior painting averages <strong>$3,000–$7,000</strong>.
              Verified Bowmanville painters. Free for homeowners.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Painters</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Painting Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Bowmanville Painting Costs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            {paintingServices.map((service) => (
              <div key={service.name} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="font-black text-gray-900 mb-2">{service.name}</h3>
                <p className="text-rose-700 font-black text-xl mb-3">{service.cost}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Bowmanville Painting FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Ready to Paint in Bowmanville?</h2>
          <p className="text-rose-100 text-lg mb-8">Upload photos and get a free painting estimate. Verified Bowmanville painters. No commitment.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free Painting Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Bowmanville Hub', href: '/bowmanville' },
              { label: 'Kitchen Renovation Bowmanville', href: '/kitchen-renovation-bowmanville' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Painting Leads Bowmanville', href: '/painting-leads-brampton' },
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
