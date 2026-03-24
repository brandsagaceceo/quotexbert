import { Metadata } from "next";
import Link from "next/link";
import RenovationCTA from "@/components/seo/RenovationCTA";
import FAQSection from "@/components/seo/FAQSection";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import EarningsCalculator from "./EarningsCalculator";

export const metadata: Metadata = {
  title: "Join as a Renovation Contractor | QuoteXbert GTA",
  description:
    "Get more renovation jobs in Toronto and the GTA. No monthly fees, AI-screened homeowner leads, instant quote requests. Join free — pay only for leads you want.",
  keywords: [
    "renovation contractor leads toronto",
    "contractor lead generation gta",
    "find renovation work toronto",
    "home improvement leads ontario",
    "join contractor marketplace toronto",
  ],
  openGraph: {
    title: "Join as a Renovation Contractor | QuoteXbert GTA",
    description:
      "Get verified renovation leads across the GTA. AI-screened homeowners with real budgets. No monthly fees.",
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
    href: "/sign-up?role=contractor",
    highlighted: false,
  },
  {
    name: "Renovation Xbert",
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
    href: "/sign-up?role=contractor",
    highlighted: true,
  },
  {
    name: "General Contractor",
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
    href: "/sign-up?role=contractor",
    highlighted: false,
  },
];

const COMPETITOR_TABLE = [
  {
    feature: "Monthly subscription",
    quotexbert: "From $49/mo",
    homestars: "$300–$600/mo",
    houzz: "$299–$799/mo",
    bidmii: "Free + commission",
  },
  {
    feature: "AI cost estimate for homeowner",
    quotexbert: "✓",
    homestars: "✗",
    houzz: "✗",
    bidmii: "✗",
  },
  {
    feature: "GTA-specific coverage",
    quotexbert: "✓",
    homestars: "Partial",
    houzz: "✗ (global)",
    bidmii: "Partial",
  },
  {
    feature: "Homeowner pre-qualified by budget",
    quotexbert: "✓",
    homestars: "✗",
    houzz: "✗",
    bidmii: "✗",
  },
  {
    feature: "Direct messaging with homeowner",
    quotexbert: "✓ All plans",
    homestars: "✓",
    houzz: "✓ paid",
    bidmii: "✓",
  },
  {
    feature: "Verified contractor badge",
    quotexbert: "✓",
    homestars: "✓ paid",
    houzz: "✓ paid",
    bidmii: "✗",
  },
];

const JOIN_STEPS = [
  {
    step: "1",
    title: "Create your free profile",
    desc: "Add your trade, service area, portfolio photos, and licensing info. Takes less than 10 minutes.",
  },
  {
    step: "2",
    title: "Set your service radius",
    desc: "Choose the GTA cities and neighbourhoods you serve. Receive only relevant job notifications.",
  },
  {
    step: "3",
    title: "Receive AI-screened leads",
    desc: "Homeowners submit a photo and our AI pre-estimates the cost. You receive leads from informed buyers — no sticker shock.",
  },
  {
    step: "4",
    title: "Submit quotes, win jobs",
    desc: "Send your proposal, chat directly with the homeowner, and close the deal — without auction-style bidding wars.",
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
      "HomeStars charges $300–$600/month and uses a pay-to-rank review system. QuoteXbert has no expensive monthly subscription, and our AI pre-qualifies every homeowner so the leads you receive already have realistic budgets.",
  },
  {
    question: "Do I need to be licensed or insured to join?",
    answer:
      "We strongly encourage all contractors to be licensed and insured, and we'll display your verified status. While we don't block unlicensed profiles, verification gives you higher placement and a trust badge visible to homeowners.",
  },
  {
    question: "How quickly do homeowners expect quotes?",
    answer:
      "Homeowners on QuoteXbert expect responses within 2–4 hours. Pro tier members receive push notifications and can respond directly via in-app messaging.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://www.quotexbert.com/contractors/join",
      url: "https://www.quotexbert.com/contractors/join",
      name: "Join as a Renovation Contractor | QuoteXbert",
      description:
        "Get verified renovation leads across the GTA. AI-screened homeowners with real budgets.",
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-rose-400 font-medium text-sm uppercase tracking-widest mb-3">
            For Renovation Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get Renovation Leads in Toronto<br className="hidden md:block" /> Without Bidding Wars
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Stop paying $300/month for HomeStars and chasing bad leads. QuoteXbert
            uses AI to pre-qualify homeowners before they contact you — so every
            lead has a real budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              data-track="contractor_join_clicked"
              className="bg-brand hover:bg-brand-dark text-white font-bold px-8 py-3 rounded-xl transition shadow-lg"
            >
              Join as Contractor — Free
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/30 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition"
            >
              See How It Works
            </Link>
          </div>
          <p className="text-slate-400 text-sm mt-4">
            500+ verified contractors already on the platform
          </p>
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-red-50 border-y border-red-100 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900 text-center mb-6">
            Sound Familiar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: "💸",
                text: "Paying $400+/month for HomeStars with no guarantee of ROI",
              },
              {
                icon: "😤",
                text: "Receiving leads from homeowners with unrealistic $5,000 kitchen budgets",
              },
              {
                icon: "🏆",
                text: "Competing in blind auctions where the cheapest bid wins regardless of quality",
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

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* How it works */}
        <section id="how-it-works">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How QuoteXbert Works for Contractors
          </h2>
          <p className="text-slate-600 mb-8">
            Our AI acts as a pre-sales filter — setting homeowner expectations
            before you ever spend time quoting.
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "bg-rose-50 border-rose-300 shadow-lg shadow-rose-100 scale-105 z-10"
                    : "bg-white border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-block bg-gradient-to-r from-rose-700 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mt-2">{plan.name}</h3>
                <div className="flex items-end gap-1 my-2">
                  <span className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">/ {plan.period}</span>
                </div>
                <ul className="space-y-2 my-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-rose-600 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-2.5 rounded-xl font-semibold transition ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-800 hover:to-orange-700 text-white shadow-lg"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-900"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Competitor comparison table */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Platform Comparison
          </h2>
          <p className="text-slate-600 mb-6">
            How QuoteXbert stacks up against HomeStars, Houzz, and Bidmii.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="text-left px-4 py-3 rounded-tl-xl">Feature</th>
                  <th className="px-4 py-3 bg-gradient-to-r from-rose-700 to-orange-600 text-white font-bold">
                    QuoteXbert
                  </th>
                  <th className="px-4 py-3">HomeStars</th>
                  <th className="px-4 py-3">Houzz</th>
                  <th className="px-4 py-3 rounded-tr-xl">Bidmii</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-100">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3 text-center text-rose-700 font-semibold border-b border-slate-100 bg-rose-50">
                      {row.quotexbert}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 border-b border-slate-100">
                      {row.homestars}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 border-b border-slate-100">
                      {row.houzz}
                    </td>
                    <td className="px-4 py-3 text-center text-slate-500 border-b border-slate-100">
                      {row.bidmii}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            What Contractors Are Saying
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote:
                  "I cancelled my HomeStars subscription after 2 weeks on QuoteXbert. My close rate is way higher because homeowners actually have a budget.",
                name: "James M.",
                trade: "Kitchen Contractor, Toronto",
              },
              {
                quote:
                  "No more 'we thought it would be $8,000' conversations. The AI estimate does the expectation-setting for me.",
                name: "Priya S.",
                trade: "Bathroom Renovator, Mississauga",
              },
              {
                quote:
                  "I got 3 serious kitchen jobs in my first month. The leads are local, the homeowners are engaged, and I'm not bidding against 12 other contractors.",
                name: "Carlos B.",
                trade: "General Contractor, Vaughan",
              },
            ].map((t) => (
              <blockquote
                key={t.name}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
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

        {/* Earnings calculator */}
        <EarningsCalculator />

        {/* FAQs */}
        <FAQSection faqs={FAQS} title="Contractor FAQ" />

        {/* Internal links */}
        <InternalLinksSection
          title="Explore Contractor Resources"
          links={[
            { href: "/for-contractors", label: "Contractor Overview" },
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
        heading="Ready to Fill Your Project Calendar?"
        subheading="Join QuoteXbert free. Get verified renovation leads across the GTA with AI-screened homeowners who already know the budget."
      />
    </>
  );
}
