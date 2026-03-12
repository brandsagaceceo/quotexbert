import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SERVICES, SERVICE_SLUGS, GLOBAL_FAQS, INTERNAL_LINKS } from "@/lib/seo-data";
import FAQSection from "@/components/seo/FAQSection";
import CTASection from "@/components/seo/CTASection";
import InternalLinks from "@/components/seo/InternalLinks";

interface PageProps {
  params: Promise<{ service: string }>;
}

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((service) => ({ service }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceSlug } = await params;
  const serviceData = SERVICES.find((s) => s.slug === serviceSlug);
  if (!serviceData) return {};

  const title = `${serviceData.name} Cost in ${serviceData.city} (2026 Guide) | QuoteXbert`;
  const description = `See real ${serviceData.city} ${serviceData.name.toLowerCase()} prices instantly. Upload a photo and get an AI renovation estimate in seconds.`;
  const url = `https://www.quotexbert.com/renovation-services/${serviceSlug}`;

  return {
    title,
    description,
    keywords: [
      `${serviceData.name.toLowerCase()} cost ${serviceData.city}`,
      `${serviceData.name.toLowerCase()} price Toronto`,
      `${serviceData.name.toLowerCase()} estimate GTA`,
      `Toronto ${serviceData.name.toLowerCase()}`,
      `renovation cost ${serviceData.city}`,
      `${serviceData.name.toLowerCase()} contractor Toronto`,
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

export default async function ServiceRenovationPage({ params }: PageProps) {
  const { service: serviceSlug } = await params;
  const serviceData = SERVICES.find((s) => s.slug === serviceSlug);
  if (!serviceData) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceData.name} in ${serviceData.city}`,
    description: serviceData.intro,
    provider: {
      "@type": "Organization",
      name: "QuoteXbert",
      url: "https://www.quotexbert.com",
    },
    areaServed: serviceData.city,
    serviceType: serviceData.name,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
      { "@type": "ListItem", position: 2, name: "Renovation Services", item: "https://www.quotexbert.com/renovation-services" },
      {
        "@type": "ListItem",
        position: 3,
        name: serviceData.name,
        item: `https://www.quotexbert.com/renovation-services/${serviceSlug}`,
      },
    ],
  };

  const allFAQs = [...serviceData.faqItems, ...GLOBAL_FAQS.slice(0, 3)];

  const relatedServiceLinks = serviceData.relatedServices
    .map((slug) => {
      const s = SERVICES.find((sv) => sv.slug === slug);
      return s ? { href: `/renovation-services/${s.slug}`, label: `${s.name} Cost Guide` } : null;
    })
    .filter(Boolean) as { href: string; label: string }[];

  const allInternalLinks = [
    INTERNAL_LINKS.estimator,
    INTERNAL_LINKS.contractorSignup,
    ...relatedServiceLinks,
    ...INTERNAL_LINKS.cityPages.slice(0, 4),
    INTERNAL_LINKS.blog,
  ];

  return (
    <>
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
              <li><Link href="/renovation-services" className="hover:text-teal-600">Renovation Services</Link></li>
              <li className="text-slate-300">/</li>
              <li className="text-slate-900 font-medium">{serviceData.name}</li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">
              {serviceData.name} Cost in {serviceData.city} – 2026 Pricing Guide
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed">
              {serviceData.intro}
            </p>

            <CTASection
              heading={`Get Your Free ${serviceData.name} Estimate`}
              subtext={`Upload a photo of your ${serviceData.name.toLowerCase()} project and receive an instant AI-powered price estimate based on Toronto market rates.`}
            />
          </section>

          {/* Price Ranges */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {serviceData.name} Price Ranges in {serviceData.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {serviceData.priceRanges.map((tier, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-bold text-slate-900 mb-1">{tier.tier}</h3>
                  <p className="text-2xl font-black text-teal-700 mb-3">{tier.range}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">{tier.description}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-4">
              * All prices are estimates based on current Toronto and GTA contractor rates (2026). Actual costs depend on your specific scope, finishes, and contractor availability.
            </p>
          </section>

          {/* Factors Affecting Price */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              What Affects the Cost of a {serviceData.name}?
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceData.factors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white rounded-lg border border-slate-200 p-4">
                  <span className="text-teal-600 font-bold mt-0.5">✓</span>
                  <span className="text-slate-700">{factor}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* How It Works */}
          <section className="py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              How to Get an Accurate {serviceData.name} Quote in {serviceData.city}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Upload a Photo",
                  desc: `Take a photo of your current ${serviceData.name.toLowerCase()} space and upload it to QuoteXbert.`,
                },
                {
                  step: "2",
                  title: "AI Estimates Your Project",
                  desc: `Our AI analyses your photo and generates an instant cost estimate based on ${serviceData.city} market rates.`,
                },
                {
                  step: "3",
                  title: "Get Contractor Quotes",
                  desc: `Receive quotes from verified ${serviceData.city} contractors who specialise in ${serviceData.name.toLowerCase()}.`,
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
          <FAQSection items={allFAQs} title={`${serviceData.name} FAQs – ${serviceData.city}`} />

          {/* Internal Links */}
          <InternalLinks
            title="Explore More Renovation Cost Guides"
            links={allInternalLinks}
          />
        </div>
      </div>
    </>
  );
}
