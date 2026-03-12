import Link from 'next/link';
import { FAQ_DATABASE, INTERNAL_LINKS } from '@/lib/seo/seo-data';
import SeoJsonLd from '@/components/seo/SeoJsonLd';

interface CityRenovationCostTemplateProps {
  cityName: string;
  citySlug: string;
  region: string;
  description: string;
  avgHomeCost: string;
  population: string;
}

const RENOVATION_OVERVIEW = [
  { name: 'Kitchen Renovation', range: '$15,000 – $120,000', href: '/kitchen-renovation-cost-toronto', icon: '🍳' },
  { name: 'Bathroom Renovation', range: '$8,000 – $65,000', href: '/bathroom-renovation-cost-toronto', icon: '🚿' },
  { name: 'Basement Finishing', range: '$25,000 – $150,000', href: '/basement-finishing-cost-toronto', icon: '🏗️' },
  { name: 'Deck Building', range: '$8,000 – $60,000', href: '/deck-building-cost-toronto', icon: '🌿' },
  { name: 'Roof Replacement', range: '$8,000 – $50,000', href: '/roof-replacement-cost-toronto', icon: '🏠' },
  { name: 'Flooring Installation', range: '$3,000 – $40,000', href: '/flooring-installation-cost-toronto', icon: '🪵' },
  { name: 'Interior Painting', range: '$500 – $18,000', href: '/painting-cost-toronto', icon: '🎨' },
  { name: 'Plumbing Work', range: '$150 – $10,000', href: '/plumbing-repair-cost-toronto', icon: '🔧' },
  { name: 'Electrical Work', range: '$200 – $20,000', href: '/electrical-work-cost-toronto', icon: '⚡' },
];

export default function CityRenovationCostTemplate({
  cityName,
  citySlug,
  region,
  description,
  avgHomeCost,
  population,
}: CityRenovationCostTemplateProps) {
  const generalFaqs = FAQ_DATABASE.general;

  return (
    <>
      <SeoJsonLd
        pageType="renovation-cost"
        title={`Renovation Costs in ${cityName} (2026 Guide)`}
        description={description}
        url={`https://www.quotexbert.com/renovation-cost/${citySlug}`}
        cityName={cityName}
        faqs={generalFaqs}
      />
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-r from-rose-600 to-orange-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-80">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/renovation-cost/toronto" className="hover:underline">
              Renovation Costs
            </Link>
            {' / '}
            <span>{cityName}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Renovation Costs in {cityName} (2026 Guide)
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Real renovation pricing for {cityName} homeowners. From kitchen remodels to basement finishing —
            see what projects actually cost in {cityName}, {region}.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-rose-600 font-bold px-8 py-4 rounded-xl hover:bg-rose-50 transition-colors shadow-lg text-lg"
          >
            📸 Get Free AI Estimate for {cityName}
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        {/* City context */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Region</p>
            <p className="text-xl font-black text-slate-900">{region}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Population</p>
            <p className="text-xl font-black text-slate-900">{population}</p>
          </div>
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <p className="text-sm text-slate-500 mb-1">Avg. Home Value</p>
            <p className="text-xl font-black text-rose-600">{avgHomeCost}</p>
          </div>
        </section>

        {/* Description */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Home Renovation Costs in {cityName}
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">{description}</p>
          <p className="text-lg text-slate-700 leading-relaxed">
            Whether you&apos;re updating a kitchen, finishing a basement, or adding a deck,{' '}
            <strong>QuoteXbert gives you an instant AI estimate</strong> based on current {cityName} contractor
            rates — so you can budget with confidence and avoid being overcharged.
          </p>
        </section>

        {/* Renovation overview table */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            2026 Renovation Cost Guide for {cityName}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {RENOVATION_OVERVIEW.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-4 bg-white border-2 border-slate-100 hover:border-rose-300 rounded-xl p-4 transition-all group"
              >
                <span className="text-3xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                    {item.name}
                  </p>
                  <p className="text-rose-600 font-semibold text-sm">{item.range}</p>
                </div>
                <span className="text-slate-400 group-hover:text-rose-500 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-3">
            Get an Instant AI Estimate for Your {cityName} Renovation
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Upload a photo of your project or describe your renovation. QuoteXbert&apos;s AI gives you a price
            range based on current {cityName} contractor rates — in seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-block bg-white text-rose-600 font-bold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md"
            >
              📸 Get My Free Estimate →
            </Link>
            <Link
              href="/contractors"
              className="inline-block border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-rose-600 transition-colors"
            >
              Find {cityName} Contractors →
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            FAQ: Home Renovation Costs in {cityName}
          </h2>
          <div className="space-y-6">
            {generalFaqs.map((faq) => (
              <div key={faq.question} className="border-l-4 border-rose-400 pl-6">
                <h3 className="font-bold text-slate-900 text-lg mb-2">{faq.question}</h3>
                <p className="text-slate-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal links */}
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Renovation Cost Guides by Type</h2>
          <div className="flex flex-wrap gap-3">
            {[
              INTERNAL_LINKS.kitchenRenovation,
              INTERNAL_LINKS.bathroomRenovation,
              INTERNAL_LINKS.basementFinishing,
              INTERNAL_LINKS.deckBuilding,
              INTERNAL_LINKS.roofReplacement,
              INTERNAL_LINKS.contractorDirectory,
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-block bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}
