import Link from "next/link";
import { Sparkles, CheckCircle, MapPin, ArrowRight, DollarSign, Users } from "lucide-react";
import { NeighborhoodData } from "@/lib/seo/neighbourhood-data";
import FAQSection from "@/components/seo/FAQSection";
import RenovationCTA from "@/components/seo/RenovationCTA";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import StructuredData from "@/components/seo/StructuredData";

interface Props {
  data: NeighborhoodData;
}

const renovationCostLinks = [
  { href: "/bathroom-renovation-cost-toronto", label: "Bathroom Renovation Cost" },
  { href: "/kitchen-renovation-cost-toronto", label: "Kitchen Renovation Cost" },
  { href: "/basement-finishing-cost-toronto", label: "Basement Finishing Cost" },
  { href: "/deck-building-cost-toronto", label: "Deck Building Cost" },
  { href: "/roof-replacement-cost-toronto", label: "Roof Replacement Cost" },
  { href: "/flooring-installation-cost-toronto", label: "Flooring Installation Cost" },
  { href: "/painting-cost-toronto", label: "House Painting Cost" },
  { href: "/home-renovation-cost-toronto", label: "Home Renovation Cost Guide" },
];

const contractorLinks = [
  { href: "/contractor-leads-toronto", label: "Find Verified Contractors" },
  { href: "/plumber-leads-toronto", label: "Plumbers" },
  { href: "/electrician-leads-toronto", label: "Electricians" },
  { href: "/roofing-leads-toronto", label: "Roofers" },
  { href: "/renovation-jobs-toronto", label: "General Contractors" },
];

export default function NeighbourhoodTemplate({ data }: Props) {
  const isCity = data.type === "gta-city";

  return (
    <>
      <StructuredData type="LocalBusiness" city={data.name} />
      <StructuredData type="Service" serviceName={`Home Renovation in ${data.name}`} city={data.name} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: data.metaTitle,
            description: data.metaDescription,
            url: `https://www.quotexbert.com/${data.slug}`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: isCity ? "GTA Cities" : "Toronto Neighbourhoods",
                  item: "https://www.quotexbert.com/toronto",
                },
                { "@type": "ListItem", position: 3, name: data.name, item: `https://www.quotexbert.com/${data.slug}` },
              ],
            },
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-rose-200">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isCity ? "GTA City" : "Toronto Neighbourhood"} · Postal Codes: {data.postalCodes.join(", ")}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{data.h1}</h1>
            <p
              className="text-lg text-rose-100 mb-6 max-w-2xl"
              dangerouslySetInnerHTML={{ __html: data.intro }}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#instant-quote"
                className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                Get Free AI Estimate
              </Link>
              <Link
                href="/create-lead"
                className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                <Users className="w-5 h-5" />
                Post Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed">{data.description}</p>
          </div>
        </div>

        {/* Average Prices */}
        <div className="py-12 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-rose-500" />
              Average Renovation Prices in {data.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.avgPrices.map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">{item.service}</p>
                  <p className="text-xl font-bold text-rose-600">{item.price}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-4">
              * Prices are estimates for {data.name} based on 2026 contractor data. Get a precise quote using the AI estimator below.
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Why Homeowners in {data.name} Choose QuoteXbert
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.highlights.map((highlight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-800 font-medium">{highlight}</p>
                </div>
              ))}
              <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">Instant AI estimate in under 60 seconds</p>
              </div>
              <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-800 font-medium">100% free for homeowners — no hidden fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <RenovationCTA
          heading={`Get a Free Renovation Estimate for Your ${data.name} Home`}
          subheading={`Upload a photo of your renovation project and receive an AI-powered cost estimate. Then connect with verified ${data.name} contractors who compete for your job.`}
        />

        {/* Nearby Areas */}
        {data.nearbyAreas.length > 0 && (
          <div className="py-12 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Areas We Serve</h2>
              <div className="flex flex-wrap gap-3">
                {data.nearbyAreas.map((area) => (
                  <Link
                    key={area.slug}
                    href={`/${area.slug}`}
                    className="px-5 py-2 bg-rose-50 text-rose-700 rounded-full font-medium hover:bg-rose-100 transition-colors border border-rose-200"
                  >
                    {area.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <FAQSection faqs={data.faqs} title={`Renovation in ${data.name} — FAQ`} />

        {/* Internal Links: Cost Guides */}
        <InternalLinksSection
          title="Toronto Renovation Cost Guides"
          links={renovationCostLinks}
          columns={4}
        />

        {/* Internal Links: Find Contractors */}
        <InternalLinksSection
          title="Find Contractors by Trade"
          links={contractorLinks}
          columns={3}
        />
      </div>
    </>
  );
}
