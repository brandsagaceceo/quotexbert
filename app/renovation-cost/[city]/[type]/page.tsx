import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  GTA_CITIES,
  CITY_MAP,
  RENOVATION_TYPES,
  RENO_TYPE_MAP,
  adjustCost,
} from "@/lib/seo/gta-cities";
import { renovationCostPages } from "@/lib/seo/renovation-cost-data";
import FAQSection from "@/components/seo/FAQSection";
import RenovationCTA from "@/components/seo/RenovationCTA";
import CostTable from "@/components/seo/CostTable";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import StructuredData from "@/components/seo/StructuredData";
import { MapPin, ArrowRight, CheckCircle, Sparkles, TrendingUp, DollarSign } from "lucide-react";

// Static generation: all city × type combos
export async function generateStaticParams() {
  const params: { city: string; type: string }[] = [];
  for (const city of GTA_CITIES) {
    for (const reno of RENOVATION_TYPES) {
      params.push({ city: city.slug, type: reno.slug });
    }
  }
  return params;
}

interface Props {
  params: Promise<{ city: string; type: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, type: typeSlug } = await params;
  const city = CITY_MAP[citySlug];
  const reno = RENO_TYPE_MAP[typeSlug];
  if (!city || !reno) return {};

  const title = `${reno.name} Cost in ${city.name} (2026 Guide) | QuoteXbert`;
  const description = `How much does a ${reno.name.toLowerCase()} cost in ${city.name}? 2026 price guide for ${city.region}. Average costs, labour rates, and instant AI estimates.`;
  const url = `https://www.quotexbert.com/renovation-cost/${citySlug}/${typeSlug}`;

  return {
    title,
    description,
    keywords: [
      `${reno.name.toLowerCase()} cost ${city.name.toLowerCase()}`,
      `${reno.name.toLowerCase()} price ${city.name.toLowerCase()}`,
      `${city.name.toLowerCase()} ${reno.name.toLowerCase()} estimate`,
      `${reno.name.toLowerCase()} ${city.region.toLowerCase()}`,
      "renovation cost GTA",
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "QuoteXbert",
      type: "website",
      locale: "en_CA",
      images: [{ url: reno.heroImage, width: 1200, height: 600, alt: `${reno.name} in ${city.name}` }],
    },
    alternates: { canonical: url },
  };
}

export default async function ProgrammaticCostPage({ params }: Props) {
  const { city: citySlug, type: typeSlug } = await params;
  const city = CITY_MAP[citySlug];
  const reno = RENO_TYPE_MAP[typeSlug];
  if (!city || !reno) notFound();

  // Find the Toronto baseline data for this renovation type
  const torontoData = renovationCostPages.find((p) => p.slug === reno.baseSlug);

  // Adjust cost table values for this city's labor premium
  const adjustedCostTable = torontoData
    ? torontoData.costTable.map((row) => ({
        ...row,
        low: adjustCost(row.low, city.laborPremium),
        high: adjustCost(row.high, city.laborPremium),
      }))
    : [];

  const adjustedRange = {
    low: adjustCost(reno.range.low, city.laborPremium),
    high: adjustCost(reno.range.high, city.laborPremium),
    avg: adjustCost(reno.range.avg ?? reno.range.high, city.laborPremium),
  };

  const cityLabel = citySlug === "toronto" ? "Toronto" : `${city.name} (${city.region})`;
  const h1 = `${reno.name} Cost in ${city.name} (2026 Guide)`;
  const canonicalUrl = `https://www.quotexbert.com/renovation-cost/${citySlug}/${typeSlug}`;

  // Related city links (same renovation type)
  const relatedCities = GTA_CITIES.filter((c) => c.slug !== citySlug).slice(0, 8);

  // Related renovation type links (same city)
  const relatedRenos = RENOVATION_TYPES.filter((r) => r.slug !== typeSlug).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: h1,
        description: `${reno.name} cost guide for ${city.name}, ${city.region}. 2026 pricing.`,
        url: canonicalUrl,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Renovation Costs", item: "https://www.quotexbert.com/home-renovation-cost-toronto" },
            { "@type": "ListItem", position: 3, name: city.name, item: `https://www.quotexbert.com/renovation-cost/${citySlug}` },
            { "@type": "ListItem", position: 4, name: reno.name, item: canonicalUrl },
          ],
        },
      },
      {
        "@type": "Service",
        name: reno.name,
        provider: { "@type": "Organization", name: "QuoteXbert", url: "https://www.quotexbert.com" },
        areaServed: { "@type": "City", name: city.name, address: { "@type": "PostalAddress", addressRegion: "ON", addressCountry: "CA" } },
        description: `${reno.name} services in ${city.name}, ${city.region}`,
        offers: {
          "@type": "AggregateOffer",
          lowPrice: reno.range.low.replace(/[^0-9]/g, ""),
          highPrice: reno.range.high.replace(/[^0-9]/g, ""),
          priceCurrency: "CAD",
        },
      },
      ...(torontoData?.faqs
        ? [
            {
              "@type": "FAQPage",
              mainEntity: torontoData.faqs.slice(0, 5).map((faq) => ({
                "@type": "Question",
                name: faq.question.replace(/Toronto/g, city.name),
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer.replace(/Toronto/g, city.name),
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StructuredData type="LocalBusiness" city={city.name} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-rose-700 to-orange-600 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-rose-200 text-sm font-medium">
              <MapPin className="w-4 h-4" />
              <Link href={`/renovation-cost/${citySlug}`} className="hover:text-white transition-colors">
                {city.name}
              </Link>
              <span>/</span>
              <span>{reno.name}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{h1}</h1>
            <p className="text-lg text-rose-100 mb-8 max-w-2xl">
              {reno.name} costs in {cityLabel}. Updated 2026 pricing based on local labour rates and material costs.
              {city.laborPremium !== 0 && (
                <span className="ml-1">
                  Labour in {city.name} is typically{" "}
                  <strong className="text-white">
                    {Math.abs(city.laborPremium)}% {city.laborPremium < 0 ? "lower" : "higher"}
                  </strong>{" "}
                  than Toronto core.
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                { label: "Low Estimate", value: adjustedRange.low },
                { label: "Average", value: adjustedRange.avg },
                { label: "High Estimate", value: adjustedRange.high },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white/20 rounded-xl px-5 py-3 text-center min-w-[130px]">
                  <p className="text-xs text-rose-200 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
            <Link
              href="/#estimate"
              className="inline-flex items-center gap-2 bg-white text-rose-700 px-6 py-3 rounded-xl font-bold hover:bg-rose-50 transition-colors shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Get Free AI Estimate for {city.name}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12 space-y-14">
          {/* City context */}
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {reno.name} in {city.name}: What to Expect
            </h2>
            <p className="text-slate-700 leading-relaxed mb-4">{city.description}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { icon: <MapPin className="w-5 h-5 text-rose-600" />, label: "Region", value: city.region },
                { icon: <DollarSign className="w-5 h-5 text-green-600" />, label: "Avg Home Price", value: city.avgHome },
                { icon: <TrendingUp className="w-5 h-5 text-blue-600" />, label: "Labour vs Toronto", value: city.laborPremium === 0 ? "Baseline" : `${city.laborPremium > 0 ? "+" : ""}${city.laborPremium}%` },
              ].map(({ icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
                  {icon}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
                    <p className="font-bold text-slate-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cost Table */}
          {adjustedCostTable.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {reno.name} Cost Breakdown — {city.name} (2026)
              </h2>
              <p className="text-slate-500 mb-6 text-sm">
                Prices adjusted for {city.name} labour market. Includes materials + labour unless noted.
              </p>
              <CostTable rows={adjustedCostTable} />
            </section>
          )}

          {/* Cost Factors */}
          {torontoData && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                What Affects {reno.name} Cost in {city.name}?
              </h2>
              <div className="space-y-5">
                {torontoData.costFactors.map((factor, i) => (
                  <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{factor.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {factor.description.replace(/Toronto/g, city.name)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Budget Examples */}
          {torontoData && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Budget Examples for {city.name}</h2>
              <div className="grid sm:grid-cols-3 gap-5">
                {torontoData.budgetExamples.map((ex, i) => (
                  <div key={i} className="border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wide mb-2">{ex.label}</p>
                    <p className="text-2xl font-bold text-slate-900 mb-3">{adjustCost(ex.budget, city.laborPremium)}</p>
                    <ul className="space-y-1.5">
                      {ex.includes.map((item, j) => (
                        <li key={j} className="text-sm text-slate-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How QuoteXbert Works */}
          <section className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl p-8 border border-rose-100">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">AI-Powered Estimates</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Get an Instant {reno.name} Estimate in {city.name}
            </h2>
            <p className="text-slate-700 mb-6 leading-relaxed">
              QuoteXbert is different from HomeStars, Houzz, and Bidmii. Instead of waiting for contractor bids, upload a photo
              of your space and our AI instantly estimates your {reno.name.toLowerCase()} cost — before you even contact a contractor.
              Then, pre-qualified {city.name} contractors reach out to you with accurate quotes.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mb-7">
              {[
                { step: "1", title: "Upload Photo", desc: `Take a photo of your ${city.name} space` },
                { step: "2", title: "AI Estimates", desc: "Get instant price range in seconds" },
                { step: "3", title: "Get Contractor Quotes", desc: `Verified ${city.name} contractors reach out` },
              ].map(({ step, title, desc }) => (
                <div key={step} className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="w-9 h-9 bg-rose-600 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-2">
                    {step}
                  </div>
                  <p className="font-bold text-slate-900 text-sm mb-1">{title}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#estimate"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Upload Photo — Get Free Estimate
              </Link>
              <Link
                href="/contractors/join"
                className="inline-flex items-center gap-2 bg-white border-2 border-rose-200 text-rose-700 px-6 py-3 rounded-xl font-bold hover:border-rose-400 transition-all"
              >
                Are you a {city.name} contractor?
              </Link>
            </div>
          </section>

          {/* FAQs */}
          {torontoData && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {reno.name} in {city.name} — FAQ
              </h2>
              <FAQSection
                faqs={torontoData.faqs.map((faq) => ({
                  question: faq.question.replace(/Toronto/g, city.name),
                  answer: faq.answer.replace(/Toronto/g, city.name),
                }))}
              />
            </section>
          )}

          {/* Related: same type, other cities */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              {reno.name} Costs in Other GTA Cities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/renovation-cost/${c.slug}/${typeSlug}`}
                  className="block p-3 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-200 transition-all text-sm font-medium text-slate-700 hover:text-rose-700"
                >
                  {reno.emoji} {c.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Related: same city, other reno types */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Other Renovation Costs in {city.name}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {relatedRenos.map((r) => (
                <Link
                  key={r.slug}
                  href={`/renovation-cost/${citySlug}/${r.slug}`}
                  className="block p-3 bg-slate-50 hover:bg-rose-50 rounded-xl border border-slate-100 hover:border-rose-200 transition-all text-sm font-medium text-slate-700 hover:text-rose-700"
                >
                  {r.emoji} {r.name}
                </Link>
              ))}
            </div>
          </section>

          {/* Internal links */}
          <InternalLinksSection
            title="Explore More Renovation Resources"
            links={[
              { href: "/#estimate", label: "Get Free AI Estimate" },
              { href: "/home-renovation-cost-toronto", label: "Toronto Renovation Costs" },
              { href: "/contractors/join", label: "For Contractors: Get Leads" },
              { href: "/blog", label: "Renovation Blog" },
              { href: "/kitchen-renovation-cost-toronto", label: "Kitchen Renovation Cost" },
              { href: "/bathroom-renovation-cost-toronto", label: "Bathroom Renovation Cost" },
            ]}
          />
        </div>

        <RenovationCTA
          heading={`Get a Free ${reno.name} Estimate in ${city.name}`}
          subheading={`Upload a photo and our AI instantly estimates your ${reno.name.toLowerCase()} cost in ${city.name}. Then connect with verified local contractors.`}
        />
      </div>
    </>
  );
}
