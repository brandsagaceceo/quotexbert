import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  NEIGHBORHOODS,
  NEIGHBORHOOD_SLUGS,
  GLOBAL_FAQS,
  INTERNAL_LINKS,
} from "@/lib/seo-data";
import FAQSection from "@/components/seo/FAQSection";
import CTASection from "@/components/seo/CTASection";
import CostTable from "@/components/seo/CostTable";
import InternalLinks from "@/components/seo/InternalLinks";

interface PageProps {
  params: Promise<{ area: string }>;
}

export async function generateStaticParams() {
  return NEIGHBORHOOD_SLUGS.map((area) => ({ area }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { area } = await params;
  const hood = NEIGHBORHOODS.find((n) => n.slug === area);
  if (!hood) return {};

  const title = `Best Contractors in ${hood.name}, Toronto (2026) | QuoteXbert`;
  const description = `Find trusted renovation contractors in ${hood.name}, ${hood.borough}. See local renovation costs, popular projects, and get an instant AI estimate.`;
  const url = `https://www.quotexbert.com/neighborhoods/${area}`;

  return {
    title,
    description,
    keywords: [
      `contractors ${hood.name}`,
      `renovation ${hood.name} Toronto`,
      `${hood.name} renovation cost`,
      `home renovation ${hood.name}`,
      `${hood.borough} contractors`,
      `best contractors ${hood.name}`,
    ],
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "QuoteXbert",
      images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/twitter-image.svg"],
    },
    alternates: { canonical: url },
  };
}

export default async function NeighborhoodPage({ params }: PageProps) {
  const { area } = await params;
  const hood = NEIGHBORHOODS.find((n) => n.slug === area);
  if (!hood) notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: `QuoteXbert – ${hood.name} Contractors`,
    description: `Find trusted renovation contractors in ${hood.name}, Toronto`,
    url: "https://www.quotexbert.com",
    logo: "https://www.quotexbert.com/quotexbert-robot.png",
    areaServed: {
      "@type": "Place",
      name: `${hood.name}, ${hood.borough}, Toronto`,
    },
    priceRange: "$$",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
      { "@type": "ListItem", position: 2, name: "Toronto Neighborhoods", item: "https://www.quotexbert.com/neighborhoods" },
      { "@type": "ListItem", position: 3, name: hood.name, item: `https://www.quotexbert.com/neighborhoods/${area}` },
    ],
  };

  const hoodFAQs = [
    {
      question: `How much does a renovation cost in ${hood.name}?`,
      answer: `Renovation costs in ${hood.name} average around ${hood.avgCost}. This varies by project type—kitchen renovations start from ${hood.costRanges[0]?.low ?? "$15,000"} and can reach ${hood.costRanges[0]?.high ?? "$80,000+"}`,
    },
    {
      question: `What are the most popular renovations in ${hood.name}?`,
      answer: `In ${hood.name}, homeowners commonly invest in: ${hood.commonRenovations.join(", ")}. These projects tend to have strong ROI given the neighbourhood's property values.`,
    },
    ...GLOBAL_FAQS.slice(0, 3),
  ];

  const allInternalLinks = [
    INTERNAL_LINKS.estimator,
    INTERNAL_LINKS.contractorSignup,
    ...INTERNAL_LINKS.servicePages,
    ...NEIGHBORHOODS.filter((n) => n.slug !== area)
      .slice(0, 4)
      .map((n) => ({ href: `/neighborhoods/${n.slug}`, label: `Contractors in ${n.name}` })),
    INTERNAL_LINKS.blog,
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-500 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-teal-600">Home</Link></li>
              <li className="text-slate-300">/</li>
              <li><Link href="/neighborhoods" className="hover:text-teal-600">Toronto Neighborhoods</Link></li>
              <li className="text-slate-300">/</li>
              <li className="text-slate-900 font-medium">{hood.name}</li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="mb-12">
            <div className="text-sm text-teal-700 font-semibold mb-2">
              {hood.borough} · Toronto
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
              Best Contractors in {hood.name} – 2026 Renovation Guide
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              {hood.intro}
            </p>

            <CTASection
              heading={`Get a Free Renovation Estimate in ${hood.name}`}
              subtext={`Upload a photo of your ${hood.name} renovation project and receive an instant AI-powered price estimate. Connect with trusted local contractors.`}
            />
          </section>

          {/* Renovation Demand */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              📊 Renovation Demand in {hood.name}
            </h3>
            <p className="text-amber-800">{hood.renovationDemand}</p>
          </section>

          {/* Cost Ranges */}
          <CostTable
            rows={hood.costRanges}
            title={`${hood.name} Renovation Cost Ranges (2026)`}
            caption={`Based on current contractor rates and material costs in ${hood.borough}, Toronto.`}
          />

          {/* Common Renovations */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Most Popular Renovations in {hood.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {hood.commonRenovations.map((reno, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 p-4">
                  <span className="text-teal-500 font-bold text-lg">✓</span>
                  <span className="text-slate-700 font-medium">{reno}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Local Insight */}
          <section className="bg-teal-50 border border-teal-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-teal-900 mb-2">
              💡 {hood.name} Market Insight
            </h3>
            <p className="text-teal-800">{hood.localInsight}</p>
          </section>

          {/* How It Works */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Find Contractors in {hood.name} with QuoteXbert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Upload a Photo", desc: `Take a photo of your renovation space in ${hood.name} and upload it instantly.` },
                { step: "2", title: "Get an AI Estimate", desc: "Our AI generates an instant cost estimate based on local market rates." },
                { step: "3", title: "Connect with Local Pros", desc: `Get matched with verified contractors who work in ${hood.name} and ${hood.borough}.` },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm">
                  <div className="w-12 h-12 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <FAQSection items={hoodFAQs} title={`${hood.name} Renovation FAQs`} />

          {/* Internal Links */}
          <InternalLinks
            title="Explore More Toronto Neighbourhood Guides"
            links={allInternalLinks}
          />
        </div>
      </div>
    </>
  );
}
