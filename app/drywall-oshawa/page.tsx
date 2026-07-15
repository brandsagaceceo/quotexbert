import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Drywall Contractors in Oshawa | Installation & Repair | QuoteXbert',
  description: 'Find drywall contractors in Oshawa, Ontario. Installation, taping, mudding, and repairs. AI cost estimates. Oshawa drywall work averages $1,800–$12,000. Free for homeowners.',
  keywords: ['drywall Oshawa', 'Oshawa drywall contractors', 'drywall installation Oshawa', 'drywall repair Oshawa', 'drywall taping Oshawa Durham Region'],
  openGraph: { title: 'Drywall Contractors in Oshawa | QuoteXbert', description: 'AI estimates for drywall installation and repair in Oshawa. Verified local drywall contractors.', url: 'https://www.quotexbert.com/drywall-oshawa', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Drywall Oshawa | QuoteXbert', description: 'Drywall estimates for Oshawa, Ontario. Free AI estimate.' },
  alternates: { canonical: 'https://www.quotexbert.com/drywall-oshawa' },
};

const drywallServices = [
  { name: 'Basement Drywall', cost: '$2,500 – $6,500', desc: 'Drywall supply, installation, taping, and mudding for a typical 700–900 sq ft unfinished Oshawa basement.' },
  { name: 'Main Floor Renovation', cost: '$1,800 – $5,000', desc: 'Drywall work during kitchen or main floor renovation. Patching, new partitions, and ceiling repairs.' },
  { name: 'Full Home Drywall', cost: '$8,000 – $18,000', desc: 'Full drywall installation for a new build or complete gut renovation. Includes all materials and labour.' },
  { name: 'Drywall Repair', cost: '$150 – $800', desc: 'Holes, cracks, water damage repair. Small patch to full panel replacement. Most repairs completed same day.' },
];

const faqs = [
  { q: 'How much does drywall installation cost in Oshawa?', a: 'Drywall installation in Oshawa costs $1,800–$18,000 depending on project size. A typical 700 sq ft basement drywall job runs $2,500–$6,500 including materials and labour. Oshawa drywall rates are competitive — typically 12–15% below Toronto.' },
  { q: 'How do I find a reliable drywall contractor in Oshawa?', a: 'QuoteXbert connects Oshawa homeowners with verified drywall contractors. Upload photos, describe your project, and get a free AI estimate. Then connect with verified local contractors who serve Oshawa and Durham Region.' },
  { q: 'What is included in a drywall quote in Oshawa?', a: "A complete drywall quote in Oshawa should include: supply and delivery of drywall sheets, framing inspection, hanging/screwing, taping (seaming), corner bead installation, three coats of compound (mud), sanding, and priming. Confirm what's included before accepting any quote." },
  { q: 'Can drywall contractors in Oshawa also do the framing?', a: 'Many drywall contractors in Oshawa also offer steel stud or wood framing services. Others work only on drywall after framing is complete. When requesting an estimate, specify whether you need framing included or just the drywall work.' },
];

export default function DrywallOshawaPage() {
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
            <span className="text-gray-900 font-medium">Drywall</span>
          </nav>

          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight">
              <span className="text-[#800020]">
                Drywall Contractors<br />in Oshawa, Ontario
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Drywall installation, taping, and repairs in Oshawa. AI-powered cost estimates.
              Basement drywall averages <strong>$2,500–$6,500</strong>. Free for homeowners.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /><span>5.0/5 Rating</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><CheckCircle className="w-4 h-4 text-green-500" /><span>Verified Drywall Contractors</span></div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow"><Clock className="w-4 h-4 text-blue-500" /><span>&lt;3 min Estimates</span></div>
            </div>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Get My Free Drywall Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">Oshawa Drywall Services &amp; Costs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
            {drywallServices.map((service) => (
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
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Oshawa Drywall FAQ</h2>
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
          <h2 className="text-3xl font-black mb-4">Get Your Oshawa Drywall Estimate</h2>
          <p className="text-rose-100 text-lg mb-8">Free AI estimate. Verified Oshawa drywall contractors. No hidden fees.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block">Get My Free Drywall Estimate →</Link>
        </div>
      </section>

      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Oshawa Hub', href: '/oshawa' },
              { label: 'Basement Renovation Oshawa', href: '/basement-renovation-oshawa' },
              { label: 'Durham Renovation Costs', href: '/durham-region-renovation-costs' },
              { label: 'Durham Region Contractors', href: '/durham-region-contractors' },
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
