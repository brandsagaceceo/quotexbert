import { Metadata } from "next";
import Link from "next/link";
import RenovationCTA from "@/components/seo/RenovationCTA";
import FAQSection from "@/components/seo/FAQSection";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import FoundingContractorBanner from "@/components/FoundingContractorBanner";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import ContractorPlanCTA from "@/components/ContractorPlanCTA";
import { FOUNDING_OFFER_ENABLED } from "@/lib/founding-contractor-config";

export const metadata: Metadata = {
  title: "Join QuoteXbert as an Ontario Contractor | Plans & Features",
  description:
    "Compare QuoteXbert contractor subscription tiers and create a profile to review relevant homeowner project opportunities across Ontario.",
  keywords: [
    "renovation contractor leads toronto",
    "contractor lead generation gta",
    "find renovation work toronto",
    "home improvement leads ontario",
    "join contractor marketplace toronto",
  ],
  openGraph: {
    title: "Join QuoteXbert as an Ontario Contractor | Plans & Features",
    description:
      "Compare paid contractor subscription tiers and create a profile for relevant Ontario homeowner project opportunities.",
    type: "website",
    url: "https://www.quotexbert.com/contractors/join",
  },
  alternates: {
    canonical: "https://www.quotexbert.com/contractors/join",
  },
};

const PLANS = [
  {
    name: "Handyman",
    tier: "handyman",
    price: "$49",
    period: "per month",
    features: [
      "3 Trade Categories",
      "Unlimited job applications",
      "Direct homeowner messaging",
      "Profile on contractor directory",
      "Email & in-app notifications",
      "Cancel anytime",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Renovation Xbert",
    tier: "renovation",
    price: "$99",
    period: "per month",
    features: [
      "6 Trade Categories",
      "Everything in Handyman",
      "Priority placement in search",
      "Featured contractor badge",
      "Portfolio showcase",
      "Advanced analytics",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "General Contractor",
    tier: "general",
    price: "$149",
    period: "per month",
    features: [
      "ALL 10+ Categories",
      "Everything in Renovation Xbert",
      "Top priority in search results",
      "Premium contractor badge",
      "Featured homepage placement",
      "Dedicated account manager",
    ],
    cta: "Get Started",
    highlighted: false,
  },
];

const JOIN_STEPS = [
  {
    step: "1",
    title: "Create your contractor profile",
    desc: "Add your trade, service area, portfolio photos, and licensing info. Takes less than 10 minutes.",
  },
  {
    step: "2",
    title: "Set your service radius",
    desc: "Choose the GTA cities and neighbourhoods you serve. Receive only relevant job notifications.",
  },
  {
    step: "3",
    title: "Review relevant project opportunities",
    desc: "Homeowners describe their project and may upload photos. Review the information available before deciding whether the opportunity fits your business.",
  },
  {
    step: "4",
    title: "Submit a clear quote",
    desc: "Ask questions, send your proposal, and follow up professionally. Multiple relevant contractors may participate, and the homeowner chooses whom to hire.",
  },
];

const FAQS = [
  {
    question: "How much does it cost to join QuoteXbert as a contractor?",
    answer:
      "Plans start at $49/month for Handyman (3 categories), $99/month for Renovation Xbert (6 categories), and $149/month for General Contractor (all categories). All paid plans include unlimited job applications and direct homeowner messaging. No per-lead fees. Cancel anytime.",
  },
  {
    question: "What areas does QuoteXbert cover?",
    answer:
      "We cover the entire Greater Toronto Area — Toronto, Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oshawa, Ajax, Pickering, Whitby, and Bowmanville.",
  },
  {
    question: "What types of renovation work can I find leads for?",
    answer:
      "Kitchen renovations, bathroom renovations, basement finishing, roofing, flooring, deck building, interior/exterior painting, plumbing, electrical, and full home renovations.",
  },
  {
    question: "How is QuoteXbert different from HomeStars?",
    answer:
      "QuoteXbert is focused on Ontario homeowner renovation projects and uses paid contractor subscription tiers without a separate per-lead fee. HomeStars is a separate platform with its own pricing and features, which can change. Review each platform's current terms directly before deciding which model fits your business.",
  },
  {
    question: "Do I need to be licensed or insured to join?",
    answer:
      "We strongly encourage all contractors to be licensed and insured, and we'll display your verified status. While we don't block unlicensed profiles, verification gives you higher placement and a trust badge visible to homeowners.",
  },
  {
    question: "How quickly do homeowners expect quotes?",
    answer:
      "Response expectations vary by homeowner and project. Reply promptly when an opportunity fits, acknowledge the request, and set a realistic time for questions, a site visit, or a written quote.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.quotexbert.com/contractors/join",
      url: "https://www.quotexbert.com/contractors/join",
      name: "Join QuoteXbert as an Ontario Contractor | Plans & Features",
      description:
        "Compare paid contractor subscription tiers and create a profile for Ontario homeowner project opportunities.",
      inLanguage: "en-CA",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://www.quotexbert.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contractors",
            item: "https://www.quotexbert.com/contractors",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Join",
            item: "https://www.quotexbert.com/contractors/join",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function ContractorsJoinPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating urgency banner */}
      <FoundingContractorBanner />

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-rose-400 font-medium text-sm uppercase tracking-widest mb-3">
            For Renovation Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join the QuoteXbert<br className="hidden md:block" /> Contractor Marketplace
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Create a contractor profile, choose a paid subscription tier, and review
            relevant homeowner project opportunities in the areas and trades you serve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              data-track="contractor_join_clicked"
              className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
              View Plans and Join
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            New contractor offer: first eligible month $0.99, then the selected plan&apos;s regular monthly price.
          </p>
        </div>
      </section>

      {/* Marketplace expectations */}
      <section className="bg-slate-50 border-y border-slate-200 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
            Know What You Are Joining
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "1",
                text: "QuoteXbert uses paid monthly contractor subscription tiers.",
              },
              {
                icon: "2",
                text: "Multiple relevant contractors may participate in the same homeowner project.",
              },
              {
                icon: "3",
                text: "An opportunity does not guarantee a response, quote acceptance, or paid work.",
              },
            ].map((item) => (
              <div
                key={item.text}
                className="flex gap-3 items-start bg-white rounded-xl p-4 border border-red-100"
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <p className="text-slate-700 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Contractor Offer */}
      <FoundingContractorSection />

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* How it works */}
        <section id="how-it-works">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How QuoteXbert Works for Contractors
          </h2>
          <p className="text-slate-600 mb-8">
            Review the available project context, ask questions, and decide which
            opportunities fit your trade, location, schedule, and estimating process.
          </p>
          <ol className="space-y-5">
            {JOIN_STEPS.map((item) => (
              <li key={item.step} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-9 h-9 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </span>
                <div>
                  <strong className="text-slate-900 text-base">{item.title}</strong>
                  <p className="text-slate-600 text-sm mt-0.5">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Pricing */}
        <section id="pricing">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Simple Pricing</h2>
          <p className="text-slate-600 mb-8">
            No per-lead fees. No locked-in annual contracts. Cancel anytime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 ${
                  plan.highlighted
                    ? "bg-rose-50 border-rose-300 shadow-md shadow-rose-100 z-10"
                    : "bg-white border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-block bg-[#800020] text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mt-2">{plan.name}</h3>
                <div className="flex items-end gap-1 my-2">
                  <span className="text-3xl font-bold text-[#800020]">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">/ {plan.period}</span>
                </div>
                {FOUNDING_OFFER_ENABLED && (
                  <p className="inline-block text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 rounded-full px-3 py-1 mb-3">
                    First eligible month $0.99 — then {plan.price}/mo · Cancel anytime
                  </p>
                )}
                <ul className="space-y-2 my-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-rose-600 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <ContractorPlanCTA
                  tier={plan.tier}
                  label={plan.cta}
                  source="contractors_join_pricing"
                  className={`block w-full text-center py-2.5 rounded-xl font-semibold transition ${
                    plan.highlighted
                      ? "bg-[#800020] hover:bg-[#600018] text-white shadow-lg"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Choosing a marketplace */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Compare the Model, Not Just the Headline Price
          </h2>
          <p className="text-slate-600 mb-6">
            Different contractor platforms use subscriptions, per-lead charges, commissions, or combinations of those models. Before subscribing, compare the current terms, project context, service-area fit, cancellation rules, and your own cost per booked project.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "Confirm the current monthly, per-lead, or commission cost directly with each platform.",
              "Track qualified opportunities, quotes, booked projects, and gross profit by source.",
              "Check whether the service area and project categories match your actual capacity.",
              "Read cancellation, renewal, lead-credit, and communication terms before paying.",
            ].map((item) => (
              <div key={item} className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <Link href="/pay-per-lead-alternative" className="inline-block mt-5 text-sm font-semibold text-rose-700 hover:underline">
            Compare subscription and pay-per-lead models →
          </Link>
        </section>

        {/* FAQs */}
        <FAQSection faqs={FAQS} title="Contractor FAQ" />

        {/* Internal links */}
        <InternalLinksSection
          title="Explore Contractor Resources"
          links={[
            { href: "/for-contractors", label: "Contractor Overview" },
            { href: "/contractor-leads", label: "Ontario Contractor Opportunities" },
            { href: "/contractor-growth-guide", label: "Contractor Growth Guide" },
            { href: "/how-to-get-contractor-leads", label: "How to Build a Lead Pipeline" },
            { href: "/pay-per-lead-alternative", label: "Compare Lead Pricing Models" },
            { href: "/contractors/toronto", label: "Contractors in Toronto" },
            { href: "/contractors/mississauga", label: "Contractors in Mississauga" },
            { href: "/contractors/brampton", label: "Contractors in Brampton" },
            { href: "/contractors/vaughan", label: "Contractors in Vaughan" },
            { href: "/contractors/markham", label: "Contractors in Markham" },
            { href: "/renovation-cost/toronto/kitchen-renovation", label: "Kitchen Renovation Costs" },
            { href: "/renovation-cost/toronto/bathroom-renovation", label: "Bathroom Renovation Costs" },
            { href: "/blog", label: "Renovation Blog" },
          ]}
          columns={3}
        />
      </div>

      {/* CTA */}
      <RenovationCTA
        heading="Ready to Join the Contractor Marketplace?"
        subheading="Compare the paid subscription tiers, create your contractor profile, and choose which relevant homeowner projects to pursue."
      />
    </>
  );
}
