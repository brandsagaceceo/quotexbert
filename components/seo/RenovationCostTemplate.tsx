import Link from "next/link";
import { Sparkles, CheckCircle, TrendingUp, DollarSign, MapPin, ArrowRight } from "lucide-react";
import { RenovationCostData } from "@/lib/seo/renovation-cost-data";
import FAQSection from "@/components/seo/FAQSection";
import RenovationCTA from "@/components/seo/RenovationCTA";
import CostTable from "@/components/seo/CostTable";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import StructuredData from "@/components/seo/StructuredData";

interface Props {
  page: RenovationCostData;
}

const relatedCostPages = [
  { href: "/bathroom-renovation-cost-toronto", label: "Bathroom Renovation Cost" },
  { href: "/kitchen-renovation-cost-toronto", label: "Kitchen Renovation Cost" },
  { href: "/basement-finishing-cost-toronto", label: "Basement Finishing Cost" },
  { href: "/deck-building-cost-toronto", label: "Deck Building Cost" },
  { href: "/roof-replacement-cost-toronto", label: "Roof Replacement Cost" },
  { href: "/flooring-installation-cost-toronto", label: "Flooring Installation Cost" },
  { href: "/painting-cost-toronto", label: "House Painting Cost" },
  { href: "/plumbing-repair-cost-toronto", label: "Plumbing Repair Cost" },
  { href: "/electrical-work-cost-toronto", label: "Electrical Work Cost" },
  { href: "/home-renovation-cost-toronto", label: "Home Renovation Cost" },
];

const neighborhoodLinks = [
  { href: "/renovation-estimates-leslieville", label: "Leslieville" },
  { href: "/renovation-estimates-the-beaches", label: "The Beaches" },
  { href: "/renovation-estimates-yorkville", label: "Yorkville" },
  { href: "/renovation-estimates-liberty-village", label: "Liberty Village" },
  { href: "/renovation-estimates-high-park", label: "High Park" },
  { href: "/renovation-estimates-danforth", label: "Danforth" },
  { href: "/renovation-estimates-scarborough", label: "Scarborough" },
  { href: "/renovation-estimates-north-york", label: "North York" },
  { href: "/renovation-estimates-etobicoke", label: "Etobicoke" },
  { href: "/renovation-estimates-mississauga", label: "Mississauga" },
  { href: "/renovation-estimates-brampton", label: "Brampton" },
  { href: "/renovation-estimates-markham", label: "Markham" },
];

export default function RenovationCostTemplate({ page }: Props) {
  return (
    <>
      <StructuredData type="LocalBusiness" city="Toronto" />
      <StructuredData type="Service" serviceName={page.h1} city="Toronto" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: page.metaTitle,
            description: page.metaDescription,
            url: `https://www.quotexbert.com/${page.slug}`,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
                { "@type": "ListItem", position: 2, name: "Renovation Costs Toronto", item: "https://www.quotexbert.com/home-renovation-cost-toronto" },
                { "@type": "ListItem", position: 3, name: page.h1, item: `https://www.quotexbert.com/${page.slug}` },
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
              <span className="text-sm font-medium">Toronto &amp; GTA · 2026 Price Guide</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{page.h1}</h1>
            <p className="text-lg text-rose-100 mb-6 max-w-2xl" dangerouslySetInnerHTML={{ __html: page.intro }} />
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                <p className="text-xs text-rose-200 uppercase tracking-wide mb-1">Low Estimate</p>
                <p className="text-2xl font-bold">{page.priceRange.low}</p>
              </div>
              <div className="bg-white/30 rounded-xl px-5 py-3 text-center border border-white/40">
                <p className="text-xs text-rose-200 uppercase tracking-wide mb-1">Average</p>
                <p className="text-2xl font-bold">{page.priceRange.average}</p>
              </div>
              <div className="bg-white/20 rounded-xl px-5 py-3 text-center">
                <p className="text-xs text-rose-200 uppercase tracking-wide mb-1">High Estimate</p>
                <p className="text-2xl font-bold">{page.priceRange.high}</p>
              </div>
            </div>
            <Link
              href="/#instant-quote"
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-rose-50 transition-all shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Get Free AI Estimate Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cost Table */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">2026 Cost Breakdown</h2>
            <p className="text-gray-500 mb-6">Toronto-specific pricing based on contractor data across the GTA.</p>
            <CostTable rows={page.costTable} />
          </div>
        </div>

        {/* Cost Factors */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <TrendingUp className="w-7 h-7 text-rose-500" />
              What Affects the Cost?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.costFactors.map((factor, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                    {factor.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{factor.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Examples */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-rose-500" />
              Sample Renovation Budgets
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {page.budgetExamples.map((ex, i) => (
                <div key={i} className={`rounded-xl p-6 border-2 ${i === 1 ? "border-rose-400 shadow-lg" : "border-gray-200"}`}>
                  {i === 1 && (
                    <span className="text-xs bg-rose-600 text-white px-3 py-1 rounded-full font-semibold mb-3 inline-block">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{ex.label}</h3>
                  <p className="text-3xl font-bold text-rose-600 mb-4">{ex.budget}</p>
                  <ul className="space-y-2">
                    {ex.includes.map((item, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <RenovationCTA />

        {/* FAQ */}
        <FAQSection faqs={page.faqs} title={`${page.h1} — FAQ`} />

        {/* Related Cost Pages */}
        <InternalLinksSection
          title="More Toronto Renovation Cost Guides"
          links={relatedCostPages.filter((l) => !l.href.endsWith(page.slug))}
          columns={3}
        />

        {/* Neighbourhoods */}
        <InternalLinksSection
          title="Renovation Estimates by Toronto Neighbourhood"
          links={neighborhoodLinks}
          columns={4}
        />
      </div>
    </>
  );
}
