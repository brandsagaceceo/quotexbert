import Link from 'next/link';
import { INTERNAL_LINKS } from '@/lib/seo/seo-data';
import SeoJsonLd from '@/components/seo/SeoJsonLd';

interface PopularProject {
  name: string;
  range: string;
}

interface NeighborhoodContractorTemplateProps {
  neighborhoodName: string;
  city: string;
  region: string;
  character: string;
  description: string;
  commonRenovations: readonly string[];
  popularProjects: readonly PopularProject[];
  avgPriceRange: string;
  canonicalUrl: string;
}

export default function NeighborhoodContractorTemplate({
  neighborhoodName,
  city,
  region,
  character,
  description,
  commonRenovations,
  popularProjects,
  avgPriceRange,
  canonicalUrl,
}: NeighborhoodContractorTemplateProps) {
  return (
    <>
      <SeoJsonLd
        pageType="neighborhood"
        title={`Best Contractors in ${neighborhoodName}`}
        description={description}
        url={`https://www.quotexbert.com${canonicalUrl}`}
        cityName={city}
      />
      <div className="min-h-screen bg-white">
      {/* Hero */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-70">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            {' / '}
            <Link href="/contractors" className="hover:underline">
              Contractors
            </Link>
            {' / '}
            <span>{neighborhoodName}</span>
          </nav>
          <p className="text-rose-400 font-semibold text-sm mb-2 uppercase tracking-wide">
            {region} · {city}
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            Best Contractors in {neighborhoodName}
          </h1>
          <p className="text-xl opacity-80 mb-8">
            Find trusted renovation contractors serving {neighborhoodName}, {city}. Get instant AI-powered
            renovation estimates based on local {neighborhoodName} pricing.
          </p>
          <Link
            href="/"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg text-lg"
          >
            📸 Get Instant AI Estimate →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 space-y-14">
        {/* About the neighbourhood */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-4">
            Renovations in {neighborhoodName}: What to Expect
          </h2>
          <p className="text-lg text-slate-700 leading-relaxed mb-4">{description}</p>
          <p className="text-lg text-slate-700 leading-relaxed">
            {neighborhoodName} is known for being {character}. Whether you&apos;re updating a heritage home or
            renovating a modern unit, local contractors understand the character and specific requirements of
            homes in this area.
          </p>
        </section>

        {/* Price snapshot */}
        <section className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 border border-rose-200">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Average Renovation Cost in {neighborhoodName}
          </h2>
          <p className="text-4xl font-black text-rose-600 mb-4">{avgPriceRange}</p>
          <p className="text-slate-600 mb-6">
            Renovation costs in {neighborhoodName} reflect the area&apos;s{' '}
            <strong>{character.split(',')[0]}</strong> character and the quality of finishes homeowners expect.
            Get a personalized estimate below.
          </p>
          <Link
            href="/"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Get My Free {neighborhoodName} Estimate →
          </Link>
        </section>

        {/* Popular projects */}
        <section>
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Most Common Renovations in {neighborhoodName}
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {commonRenovations.map((reno) => (
              <div key={reno} className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <span className="text-rose-500 text-xl">✓</span>
                <span className="font-medium text-slate-800">{reno}</span>
              </div>
            ))}
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-4">Popular {neighborhoodName} Projects &amp; Pricing</h3>
          <div className="space-y-3">
            {popularProjects.map((project) => (
              <div
                key={project.name}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 transition-colors"
              >
                <span className="font-semibold text-slate-800">{project.name}</span>
                <span className="font-black text-rose-600">{project.range}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-black mb-3">
            Get an AI Renovation Estimate for Your {neighborhoodName} Home
          </h2>
          <p className="text-lg opacity-90 mb-6">
            Before you call a contractor, know what fair pricing looks like. QuoteXbert&apos;s AI gives you an
            instant estimate based on {neighborhoodName} market rates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-block bg-white text-rose-600 font-bold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md"
            >
              📸 Upload a Photo &amp; Get Quote
            </Link>
            <Link
              href="/contractors"
              className="inline-block border-2 border-white text-white font-bold px-6 py-3 rounded-xl hover:bg-white hover:text-rose-600 transition-colors"
            >
              Browse Contractors →
            </Link>
          </div>
        </section>

        {/* Why use QuoteXbert in this neighborhood */}
        <section>
          <h2 className="text-2xl font-black text-slate-900 mb-4">
            Why {neighborhoodName} Homeowners Trust QuoteXbert
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏘️',
                title: 'Local Pricing',
                desc: `Estimates calibrated for ${neighborhoodName} contractors and material costs.`,
              },
              {
                icon: '⚡',
                title: 'Instant Results',
                desc: 'Get a price range in seconds — not days of waiting for quotes.',
              },
              {
                icon: '🛡️',
                title: 'Avoid Overcharging',
                desc: "Know if a contractor's quote is fair before you sign anything.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-slate-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal navigation */}
        <section className="border-t border-slate-200 pt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Explore Renovation Cost Guides</h2>
          <div className="flex flex-wrap gap-3">
            {[
              INTERNAL_LINKS.kitchenRenovation,
              INTERNAL_LINKS.bathroomRenovation,
              INTERNAL_LINKS.basementFinishing,
              INTERNAL_LINKS.deckBuilding,
              INTERNAL_LINKS.torontoRenovation,
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
