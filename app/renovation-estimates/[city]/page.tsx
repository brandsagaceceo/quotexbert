import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CITIES, CITY_SLUGS, GLOBAL_FAQS, INTERNAL_LINKS } from "@/lib/seo-data";
import FAQSection from "@/components/seo/FAQSection";
import CTASection from "@/components/seo/CTASection";
import CostTable from "@/components/seo/CostTable";
import InternalLinks from "@/components/seo/InternalLinks";

interface PageProps {
  params: Promise<{ city: string }>;
}

export async function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const cityData = CITIES.find((c) => c.slug === citySlug);
  if (!cityData) return {};

  const title = `Renovation Estimates in ${cityData.name} (2026 Pricing Guide) | QuoteXbert`;
  const description = `See real ${cityData.name} renovation prices instantly. Upload a photo and get an AI renovation estimate in seconds. Kitchen, bathroom, basement and more in ${cityData.region}.`;
  const url = `https://www.quotexbert.com/renovation-estimates/${citySlug}`;

  return {
    title,
    description,
    keywords: [
      `renovation cost ${cityData.name}`,
      `${cityData.name} renovation estimates`,
      `home renovation ${cityData.name}`,
      `contractor quotes ${cityData.name}`,
      `kitchen renovation cost ${cityData.name}`,
      `bathroom renovation ${cityData.name}`,
      `renovation prices ${cityData.region}`,
      `AI renovation estimate ${cityData.name}`,
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

export default async function CityRenovationPage({ params }: PageProps) {
  const { city: citySlug } = await params;
  const cityData = CITIES.find((c) => c.slug === citySlug);
  if (!cityData) notFound();

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "QuoteXbert",
    description: `AI-powered renovation estimates for ${cityData.name} homeowners`,
    url: "https://www.quotexbert.com",
    logo: "https://www.quotexbert.com/quotexbert-robot.png",
    areaServed: {
      "@type": "City",
      name: cityData.name,
    },
    serviceType: "Home Renovation Estimates",
    priceRange: "$$",
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Renovation Estimates in ${cityData.name}`,
    description: `AI-powered renovation cost estimates for homeowners in ${cityData.name}, ${cityData.region}`,
    provider: {
      "@type": "Organization",
      name: "QuoteXbert",
      url: "https://www.quotexbert.com",
    },
    areaServed: cityData.name,
    serviceType: "Home Renovation Estimation",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
      { "@type": "ListItem", position: 2, name: "Renovation Estimates", item: "https://www.quotexbert.com/renovation-estimates" },
      { "@type": "ListItem", position: 3, name: cityData.name, item: `https://www.quotexbert.com/renovation-estimates/${citySlug}` },
    ],
  };

  const cityFAQs = [
    {
      question: `How much does a renovation cost in ${cityData.name}?`,
      answer: `The average renovation budget in ${cityData.name} is around ${cityData.avgRenovationCost}. Kitchen renovations start from ${cityData.costRanges[1]?.low ?? "$15,000"} and bathroom renovations from ${cityData.costRanges[0]?.low ?? "$10,000"}.`,
    },
    {
      question: `How do I find a trusted contractor in ${cityData.name}?`,
      answer: `QuoteXbert connects homeowners in ${cityData.name} with verified, reviewed contractors. Upload a photo of your project to receive an instant AI estimate and get matched with qualified local contractors.`,
    },
    ...GLOBAL_FAQS.slice(0, 4),
  ];

  const allInternalLinks = [
    INTERNAL_LINKS.estimator,
    INTERNAL_LINKS.contractorSignup,
    INTERNAL_LINKS.blog,
    ...INTERNAL_LINKS.servicePages,
    ...INTERNAL_LINKS.cityPages.filter((l) => !l.href.includes(citySlug)),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
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
              <li><Link href="/renovation-estimates" className="hover:text-teal-600">Renovation Estimates</Link></li>
              <li className="text-slate-300">/</li>
              <li className="text-slate-900 font-medium">{cityData.name}</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
              Renovation Estimates in {cityData.name} – 2026 Pricing Guide
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              {cityData.intro}
            </p>

            <CTASection
              heading={`Get Your Free ${cityData.name} Renovation Estimate`}
              subtext={`Upload a photo of your renovation project in ${cityData.name} and receive an instant AI-powered price estimate. Free, fast, and accurate.`}
            />
          </section>

          {/* Cost Ranges Table */}
          <CostTable
            rows={cityData.costRanges}
            title={`${cityData.name} Renovation Cost Ranges (2026)`}
            caption={`Based on current contractor rates and material costs in ${cityData.region}.`}
          />

          {/* Popular Services */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Popular Renovation Services in {cityData.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cityData.popularServices.map((service) => {
                const label = service
                  .split("-")
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ");
                return (
                  <Link
                    key={service}
                    href={`/renovation-services/${service}`}
                    className="bg-white rounded-xl border border-slate-200 p-5 hover:border-teal-400 hover:shadow-md transition-all group"
                  >
                    <span className="text-teal-600 font-semibold group-hover:text-teal-700">
                      {label} →
                    </span>
                    <p className="text-sm text-slate-500 mt-1">Cost guide + AI estimate</p>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Local Insight */}
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-bold text-amber-900 mb-2">
              💡 {cityData.name} Renovation Insight
            </h3>
            <p className="text-amber-800">{cityData.localInsight}</p>
          </section>

          {/* How QuoteXbert Works */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              How QuoteXbert Works for {cityData.name} Homeowners
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Upload a Photo",
                  desc: `Take a photo of your renovation space in ${cityData.name} and upload it to QuoteXbert.`,
                },
                {
                  step: "2",
                  title: "Get an AI Estimate",
                  desc: `Our AI analyses your photo and generates an instant renovation cost estimate based on ${cityData.name} market rates.`,
                },
                {
                  step: "3",
                  title: "Connect with Contractors",
                  desc: `Get matched with trusted, verified contractors in ${cityData.name} who are ready to quote your project.`,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white rounded-xl border border-slate-200 p-6 text-center shadow-sm"
                >
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
          <FAQSection items={cityFAQs} title={`${cityData.name} Renovation FAQs`} />

          {/* Internal Links */}
          <InternalLinks
            title="Explore More Renovation Resources"
            links={allInternalLinks}
          />
        </div>
      </div>
    </>
  );
}
