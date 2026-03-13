import { Metadata } from "next";
import Link from "next/link";
import { GTA_CITIES, RENOVATION_TYPES, CITY_MAP } from "@/lib/seo/gta-cities";
import RenovationCTA from "@/components/seo/RenovationCTA";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import FAQSection from "@/components/seo/FAQSection";

export async function generateStaticParams() {
  return GTA_CITIES.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = CITY_MAP[params.city];
  if (!city) return {};

  const title = `Find Renovation Contractors in ${city.name} | QuoteXbert`;
  const description = `Browse verified renovation contractors in ${city.name}. Get instant AI cost estimates, compare quotes, and hire trusted local pros. Serving ${city.region}.`;

  return {
    title,
    description,
    keywords: [
      `contractors ${city.name}`,
      `renovation contractors ${city.name}`,
      `home renovation ${city.name}`,
      `find contractor ${city.name}`,
      `renovation quotes ${city.name}`,
      `trusted contractors ${city.region}`,
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.quotexbert.com/contractors/${city.slug}`,
    },
    alternates: {
      canonical: `https://www.quotexbert.com/contractors/${city.slug}`,
    },
  };
}

const COMPETITOR_COMPARISON = [
  {
    platform: "HomeStars",
    issue: "Pay-to-win reviews & expensive annual subscriptions",
    ours: "Pay per verified lead only — no monthly fees",
  },
  {
    platform: "Houzz",
    issue: "Global platform with little local GTA focus",
    ours: "Built exclusively for the GTA renovation market",
  },
  {
    platform: "Bidmii",
    issue: "Blind bidding wars drive prices down unsustainably",
    ours: "AI pre-qualifies homeowners so you quote serious buyers",
  },
  {
    platform: "Jiffy",
    issue: "Race-to-the-bottom on hourly gig rates",
    ours: "Full renovation projects with real budgets, not gig work",
  },
];

export default function ContractorsCityPage({
  params,
}: {
  params: { city: string };
}) {
  const city = CITY_MAP[params.city];
  if (!city) return null;

  const faqs = [
    {
      question: `How do I find renovation jobs in ${city.name}?`,
      answer: `Sign up as a contractor on QuoteXbert, set your service area to include ${city.name}, and you'll receive lead notifications for relevant renovation projects. Our AI pre-screens homeowners, so every lead has a real budget.`,
    },
    {
      question: `How much do renovation contractors in ${city.name} charge?`,
      answer: `In ${city.name}, contractor labour rates typically range from $45–$120/hour depending on the trade. Project rates such as kitchen renovations average $25,000–$60,000. Rates in ${city.name} are ${city.laborPremium < 0 ? `roughly ${Math.abs(city.laborPremium)}% below downtown Toronto` : city.laborPremium > 0 ? `roughly ${city.laborPremium}% above Toronto baseline` : "comparable to Toronto"}.`,
    },
    {
      question: `Is QuoteXbert available for contractors in ${city.name}?`,
      answer: `Yes. QuoteXbert serves the entire Greater Toronto Area including ${city.name}, ${city.region}. Contractors can set their service radius to cover ${city.name} and surrounding areas.`,
    },
    {
      question: "What types of renovation leads does QuoteXbert provide?",
      answer: `We cover all major renovation categories — kitchen, bathroom, basement, roofing, flooring, deck building, painting, plumbing, electrical, and full home renovations.`,
    },
    {
      question: "How does QuoteXbert screen homeowners?",
      answer:
        "Homeowners submit a photo of their space and our AI instantly generates a cost estimate. This sets accurate expectations before they request contractor quotes — meaning you only receive leads from homeowners who understand the real cost.",
    },
  ];

  const allCityLinks = GTA_CITIES.filter((c) => c.slug !== city.slug)
    .slice(0, 6)
    .map((c) => ({
      href: `/contractors/${c.slug}`,
      label: `Contractors in ${c.name}`,
    }));

  const renoTypeLinks = RENOVATION_TYPES.slice(0, 4).map((r) => ({
    href: `/${r.baseSlug}-cost-toronto`,
    label: `${r.name} Cost Toronto`,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://www.quotexbert.com/contractors/${city.slug}`,
        url: `https://www.quotexbert.com/contractors/${city.slug}`,
        name: `Renovation Contractors in ${city.name} | QuoteXbert`,
        description: `Find and hire verified renovation contractors in ${city.name}. Get AI cost estimates and compare quotes instantly.`,
        inLanguage: "en-CA",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Contractors", item: "https://www.quotexbert.com/contractors" },
            { "@type": "ListItem", position: 3, name: city.name, item: `https://www.quotexbert.com/contractors/${city.slug}` },
          ],
        },
      },
      {
        "@type": "Service",
        name: `Renovation Contractor Marketplace in ${city.name}`,
        description: `Connect homeowners in ${city.name} with verified renovation contractors for kitchen, bathroom, basement, roofing, and more.`,
        provider: {
          "@type": "Organization",
          name: "QuoteXbert",
          url: "https://www.quotexbert.com",
        },
        areaServed: {
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "AdministrativeArea",
            name: "Ontario, Canada",
          },
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            {city.region}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Renovation Contractors in {city.name}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            {city.description} Browse verified local contractors, get AI cost
            estimates, and receive competitive quotes — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#estimate"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition"
            >
              Get Free AI Estimate
            </Link>
            <Link
              href="/contractors/join"
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              Join as a Contractor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-amber-50 border-y border-amber-100 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: "Verified Contractors", value: "500+" },
            { label: `Serving ${city.name}`, value: "✓" },
            { label: "Avg Response Time", value: "< 4 hrs" },
            { label: "Renovation Types", value: "10+" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-amber-600">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* How it works */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How QuoteXbert Works in {city.name}
          </h2>
          <p className="text-slate-600 mb-8">
            We&apos;re the only GTA platform that uses AI to pre-qualify
            homeowners before they ever contact a contractor.
          </p>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "Homeowner uploads a photo",
                desc: `A ${city.name} homeowner snaps a photo of their kitchen, bathroom, or space.`,
              },
              {
                step: "2",
                title: "AI generates an instant estimate",
                desc: "Our model analyses the space and produces a detailed cost estimate — setting realistic expectations before any quotes.",
              },
              {
                step: "3",
                title: "Homeowner requests contractor quotes",
                desc: `Verified ${city.name} contractors like you receive a lead notification with full project details and an AI-suggested budget.`,
              },
              {
                step: "4",
                title: "You quote, win the job",
                desc: "Submit your proposal and chat directly with the homeowner. No bidding wars, no middlemen.",
              },
            ].map((item) => (
              <li key={item.step} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {item.step}
                </span>
                <div>
                  <strong className="text-slate-900">{item.title}</strong>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Renovation categories */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Renovation Categories in {city.name}
          </h2>
          <p className="text-slate-600 mb-6">
            We source homeowner leads across all major renovation types in{" "}
            {city.name}.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RENOVATION_TYPES.map((reno) => (
              <Link
                key={reno.slug}
                href={`/renovation-cost/${city.slug}/${reno.slug}`}
                className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-amber-300 hover:shadow-sm transition group"
              >
                <div className="text-2xl mb-2">{reno.emoji}</div>
                <div className="text-sm font-medium text-slate-800 group-hover:text-amber-600">
                  {reno.name}
                </div>
                <div className="text-xs text-slate-500 mt-1">{reno.range.low}–{reno.range.high}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Competitor comparison */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Why Not HomeStars, Houzz, or Bidmii?
          </h2>
          <p className="text-slate-600 mb-6">
            Other platforms were built for volume—not contractor success. Here&apos;s
            how QuoteXbert is different.
          </p>
          <div className="space-y-3">
            {COMPETITOR_COMPARISON.map((c) => (
              <div
                key={c.platform}
                className="grid grid-cols-1 md:grid-cols-3 gap-2 bg-white border border-slate-200 rounded-xl p-4"
              >
                <div className="font-semibold text-slate-800">{c.platform}</div>
                <div className="text-slate-500 text-sm md:text-center">
                  ✗ {c.issue}
                </div>
                <div className="text-amber-600 text-sm md:text-right font-medium">
                  ✓ {c.ours}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trust signals */}
        <section className="bg-slate-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
            Trusted by {city.name} Contractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "I stopped paying HomeStars $400/month and switched to QuoteXbert. Better leads, real budgets.",
                name: "Mike T.",
                trade: `Kitchen Contractor, ${city.name}`,
              },
              {
                quote:
                  "The AI estimate means homeowners already know what it costs — no more sticker shock when I quote.",
                name: "Sandra R.",
                trade: `Bathroom Renovator, ${city.region}`,
              },
              {
                quote:
                  "I was skeptical but I booked 3 jobs in my first month. The leads are local and serious.",
                name: "David K.",
                trade: `General Contractor, GTA`,
              },
            ].map((t) => (
              <blockquote
                key={t.name}
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-100"
              >
                <p className="text-slate-700 text-sm italic mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="text-sm font-semibold text-slate-900">
                  {t.name}
                  <span className="font-normal text-slate-500"> — {t.trade}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <FAQSection
          faqs={faqs}
          title={`Contractor FAQ — ${city.name}`}
        />

        {/* Other cities */}
        <InternalLinksSection
          title={`Contractors in Other GTA Cities`}
          links={[
            ...allCityLinks,
            { href: "/contractors/join", label: "Join as a Contractor" },
            { href: "/for-contractors", label: "Contractor Resources" },
            ...renoTypeLinks,
          ]}
          columns={3}
        />
      </div>

      {/* CTA */}
      <RenovationCTA
        heading={`Start Getting ${city.name} Renovation Leads`}
        subheading={`Join hundreds of verified contractors across ${city.region}. No monthly fees — pay only for qualified leads.`}
      />
    </>
  );
}
