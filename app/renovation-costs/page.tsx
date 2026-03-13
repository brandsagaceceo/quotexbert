import { Metadata } from "next";
import Link from "next/link";
import { GTA_CITIES, RENOVATION_TYPES } from "@/lib/seo/gta-cities";

export const metadata: Metadata = {
  title: "Renovation Cost Guides — Toronto & GTA 2026 | QuoteXbert",
  description:
    "Explore detailed 2026 renovation cost guides for every city in the GTA. Kitchen, bathroom, basement, roofing, flooring, decks and more. Get instant AI estimates.",
  keywords: [
    "renovation costs toronto 2026",
    "gta renovation prices",
    "kitchen renovation cost toronto",
    "bathroom renovation cost toronto",
    "basement finishing cost toronto",
    "home renovation cost guide ontario",
  ],
  openGraph: {
    title: "Renovation Cost Guides — Toronto & GTA 2026 | QuoteXbert",
    description:
      "Detailed renovation cost breakdowns for 14 GTA cities and 8 renovation types. Always up to date.",
    type: "website",
    url: "https://www.quotexbert.com/renovation-costs",
  },
  alternates: {
    canonical: "https://www.quotexbert.com/renovation-costs",
  },
};

const FEATURED_COMBOS = [
  { city: "toronto", type: "kitchen-renovation", label: "Kitchen Renovation — Toronto" },
  { city: "toronto", type: "bathroom-renovation", label: "Bathroom Renovation — Toronto" },
  { city: "toronto", type: "basement-finishing", label: "Basement Finishing — Toronto" },
  { city: "mississauga", type: "kitchen-renovation", label: "Kitchen Renovation — Mississauga" },
  { city: "mississauga", type: "bathroom-renovation", label: "Bathroom Renovation — Mississauga" },
  { city: "brampton", type: "basement-finishing", label: "Basement Finishing — Brampton" },
  { city: "vaughan", type: "deck-building", label: "Deck Building — Vaughan" },
  { city: "scarborough", type: "flooring-installation", label: "Flooring — Scarborough" },
  { city: "markham", type: "house-painting", label: "House Painting — Markham" },
  { city: "oshawa", type: "roof-replacement", label: "Roof Replacement — Oshawa" },
  { city: "ajax", type: "kitchen-renovation", label: "Kitchen Renovation — Ajax" },
  { city: "richmond-hill", type: "bathroom-renovation", label: "Bathroom Renovation — Richmond Hill" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.quotexbert.com/renovation-costs",
  url: "https://www.quotexbert.com/renovation-costs",
  name: "Renovation Cost Guides — Toronto & GTA 2026",
  description:
    "Explore detailed 2026 renovation cost guides for every city in the GTA.",
  inLanguage: "en-CA",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
      { "@type": "ListItem", position: 2, name: "Renovation Costs", item: "https://www.quotexbert.com/renovation-costs" },
    ],
  },
};

export default function RenovationCostsHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-700 to-orange-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-rose-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Toronto & GTA · 2026 Pricing
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Renovation Cost Guides
          </h1>
          <p className="text-lg text-rose-100 max-w-2xl mx-auto mb-8">
            Before you hire a contractor, know what to expect. Browse detailed 2026 pricing guides for every major renovation type across 14 GTA cities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#get-estimate"
              className="bg-white text-rose-700 font-bold px-8 py-3 rounded-xl hover:bg-rose-50 transition"
            >
              Get Free AI Estimate
            </Link>
            <Link
              href="/contractors/join"
              className="border border-white/40 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              For Contractors
            </Link>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-orange-50 border-y border-orange-100 py-5 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-sm">
          {[
            { emoji: "🏙️", text: "14 GTA Cities Covered" },
            { emoji: "🔨", text: "8 Renovation Types" },
            { emoji: "📊", text: "112 Detailed Guides" },
            { emoji: "🤖", text: "AI-Verified Pricing" },
          ].map((item) => (
            <div key={item.text} className="font-semibold text-slate-700">
              {item.emoji} {item.text}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">
        {/* Featured combos */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Most Popular Cost Guides
          </h2>
          <p className="text-slate-600 mb-6">
            The most-searched renovation cost pages across the GTA.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURED_COMBOS.map((combo) => {
              const reno = RENOVATION_TYPES.find((r) => r.slug === combo.type);
              return (
                <Link
                  key={`${combo.city}-${combo.type}`}
                  href={`/renovation-cost/${combo.city}/${combo.type}`}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-sm transition group"
                >
                  <span className="text-xl flex-shrink-0">{reno?.emoji}</span>
                  <span className="text-sm font-medium text-slate-800 group-hover:text-rose-700">
                    {combo.label}
                  </span>
                  <span className="ml-auto text-slate-400 group-hover:text-rose-500 text-sm">→</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Browse by renovation type */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Browse by Renovation Type
          </h2>
          <p className="text-slate-600 mb-6">
            Select a renovation type to see all GTA city pricing.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RENOVATION_TYPES.map((reno) => (
              <Link
                key={reno.slug}
                href={`/renovation-cost/toronto/${reno.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-5 text-center hover:border-rose-300 hover:shadow-md transition group"
              >
                <div className="text-3xl mb-2">{reno.emoji}</div>
                <div className="text-sm font-semibold text-slate-900 group-hover:text-rose-700">
                  {reno.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  avg {reno.range.avg}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by city */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Browse by City
          </h2>
          <p className="text-slate-600 mb-6">
            Select your city to see local pricing across all renovation types.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {GTA_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/renovation-cost/${city.slug}/kitchen-renovation`}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-300 hover:shadow-sm transition group"
              >
                <div className="font-semibold text-slate-800 group-hover:text-rose-700 text-sm">
                  {city.name}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{city.region}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Full matrix — by city then type */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Complete GTA Renovation Cost Matrix
          </h2>
          <p className="text-slate-600 mb-6">
            Every city × renovation type combination — 112 pages in total.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-3 py-2 rounded-tl-lg">City</th>
                  {RENOVATION_TYPES.map((r) => (
                    <th key={r.slug} className="px-2 py-2 text-center">
                      {r.emoji}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GTA_CITIES.map((city, ci) => (
                  <tr key={city.slug} className={ci % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-3 py-2 font-medium text-slate-800 border-b border-slate-100 whitespace-nowrap">
                      {city.name}
                    </td>
                    {RENOVATION_TYPES.map((reno) => (
                      <td
                        key={reno.slug}
                        className="px-2 py-2 text-center border-b border-slate-100"
                      >
                        <Link
                          href={`/renovation-cost/${city.slug}/${reno.slug}`}
                          className="inline-block text-rose-600 hover:text-rose-800 hover:underline font-medium"
                          title={`${reno.name} cost in ${city.name}`}
                        >
                          →
                        </Link>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3 text-center">
            Click any arrow to view detailed pricing for that city + renovation type
          </p>
        </section>

        {/* What to expect section */}
        <section className="bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            How QuoteXbert Renovation Costs Work
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-slate-700">
            <div>
              <div className="text-rose-600 font-bold text-base mb-2">📊 Data-Driven Pricing</div>
              <p>
                All cost ranges are based on real GTA contractor quotes, material costs, and our AI analysis of thousands of renovation projects across the region.
              </p>
            </div>
            <div>
              <div className="text-rose-600 font-bold text-base mb-2">🏙️ City-Adjusted</div>
              <p>
                Labour rates vary across the GTA. Vaughan, Mississauga, and Markham prices are adjusted relative to Toronto's contractor baseline.
              </p>
            </div>
            <div>
              <div className="text-rose-600 font-bold text-base mb-2">🤖 Verify With AI</div>
              <p>
                Upload a photo of your space and our AI will estimate your specific project in 30 seconds — more accurate than any range estimate.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Get a Personalized AI Estimate
          </h2>
          <p className="text-rose-100 mb-6 max-w-xl mx-auto">
            Cost guides are a starting point. Upload a photo of your space and get an AI estimate tailored to your exact project in under 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#get-estimate"
              className="bg-white text-rose-700 font-bold px-8 py-3 rounded-xl hover:bg-rose-50 transition"
            >
              Get Free AI Estimate
            </Link>
            <Link
              href="/contractors/join"
              className="border border-white/40 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Are You a Contractor?
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
