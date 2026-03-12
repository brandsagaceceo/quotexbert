import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CONTRACTOR_LEAD_TYPES,
  CONTRACTOR_LEAD_SLUGS,
  INTERNAL_LINKS,
} from "@/lib/seo-data";
import FAQSection from "@/components/seo/FAQSection";
import InternalLinks from "@/components/seo/InternalLinks";

interface PageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return CONTRACTOR_LEAD_SLUGS.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type } = await params;
  const lead = CONTRACTOR_LEAD_TYPES.find((l) => l.slug === type);
  if (!lead) return {};

  const title = `${lead.name} in Toronto – Join QuoteXbert | QuoteXbert`;
  const description = `${lead.headline}. QuoteXbert connects ${lead.trade.toLowerCase()}s with pre-qualified homeowners across Toronto and the GTA. Get more renovation jobs today.`;
  const url = `https://www.quotexbert.com/contractor-leads/${type}`;

  return {
    title,
    description,
    keywords: [
      `${lead.trade.toLowerCase()} leads Toronto`,
      `${lead.trade.toLowerCase()} jobs Toronto`,
      `find ${lead.trade.toLowerCase()} work Toronto`,
      `renovation leads GTA`,
      `contractor leads Toronto`,
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

export default async function ContractorLeadPage({ params }: PageProps) {
  const { type } = await params;
  const lead = CONTRACTOR_LEAD_TYPES.find((l) => l.slug === type);
  if (!lead) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${lead.name} – QuoteXbert`,
    description: lead.intro,
    provider: {
      "@type": "Organization",
      name: "QuoteXbert",
      url: "https://www.quotexbert.com",
    },
    areaServed: "Toronto, GTA",
    serviceType: "Contractor Lead Generation",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
      { "@type": "ListItem", position: 2, name: "Contractor Leads", item: "https://www.quotexbert.com/contractor-leads" },
      { "@type": "ListItem", position: 3, name: lead.name, item: `https://www.quotexbert.com/contractor-leads/${type}` },
    ],
  };

  const allInternalLinks = [
    { href: "/sign-up", label: "Join as a Contractor – Free" },
    { href: "/jobs", label: "Browse Open Renovation Jobs" },
    INTERNAL_LINKS.estimator,
    ...CONTRACTOR_LEAD_TYPES.filter((l) => l.slug !== type)
      .slice(0, 4)
      .map((l) => ({ href: `/contractor-leads/${l.slug}`, label: l.name })),
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

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Breadcrumb */}
          <nav className="text-sm text-slate-300 mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-teal-300">Home</Link></li>
              <li className="text-slate-500">/</li>
              <li><Link href="/contractor-leads" className="hover:text-teal-300">Contractor Leads</Link></li>
              <li className="text-slate-500">/</li>
              <li className="text-white font-medium">{lead.name}</li>
            </ol>
          </nav>

          {/* Hero */}
          <section className="mb-12">
            <div className="inline-block bg-teal-500/20 border border-teal-500/30 text-teal-300 text-sm font-semibold px-4 py-2 rounded-full mb-6">
              For {lead.trade}s in Toronto &amp; GTA
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 text-white leading-tight">
              {lead.headline}
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              {lead.intro}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-block bg-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors shadow-lg text-center"
              >
                🚀 Join QuoteXbert – Get More Leads
              </Link>
              <Link
                href="/jobs"
                className="inline-block border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                Browse Open Jobs
              </Link>
            </div>
          </section>

          {/* Benefits */}
          <section className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Why {lead.trade}s Choose QuoteXbert
            </h2>
            <ul className="space-y-4">
              {lead.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-200">
                  <span className="text-teal-400 font-bold text-lg mt-0.5">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Example Jobs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              Example {lead.trade} Jobs on QuoteXbert
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {lead.exampleJobs.map((job, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
                >
                  <h3 className="font-bold text-white mb-2">{job.title}</h3>
                  <p className="text-teal-400 font-bold mb-3">Budget: {job.budget}</p>
                  <p className="text-slate-300 text-sm">{job.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">
              How QuoteXbert Lead Generation Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "Create Your Profile",
                  desc: "Sign up and build your verified contractor profile with trade, service areas, portfolio, and certifications.",
                },
                {
                  step: "2",
                  title: "Receive Matched Leads",
                  desc: "Get notified when homeowners in your area post projects that match your trade and service radius.",
                },
                {
                  step: "3",
                  title: "Quote & Win Jobs",
                  desc: "Review photo-documented projects, submit your quotes, and grow your business with verified reviews.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20"
                >
                  <div className="w-12 h-12 bg-teal-500/30 text-teal-300 rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-300 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="bg-teal-500/20 border border-teal-500/30 rounded-2xl p-8 text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Get More {lead.trade} Jobs?
            </h2>
            <p className="text-slate-300 mb-6">
              Join QuoteXbert today and start receiving pre-qualified renovation leads from homeowners across Toronto and the GTA.
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-teal-500 text-white font-bold px-10 py-4 rounded-xl hover:bg-teal-400 transition-colors shadow-lg"
            >
              Create Your Free Contractor Profile
            </Link>
          </section>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-8">
            <FAQSection items={lead.faqItems} title={`${lead.name} FAQs`} />
          </div>

          {/* Internal Links */}
          <div className="mt-8">
            <InternalLinks
              title="Explore More Contractor Resources"
              links={allInternalLinks}
            />
          </div>
        </div>
      </div>
    </>
  );
}
