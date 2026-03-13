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
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Create contractor profile",
      "Show up in city directories",
      "Receive job notifications",
      "View homeowner budgets",
    ],
    cta: "Sign Up Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    features: [
      "Everything in Free",
      "Unlimited quote submissions",
      "Direct homeowner messaging",
      "Priority placement in search",
      "Verified badge on profile",
      "Analytics dashboard",
    ],
    cta: "Start Pro",
    href: "/sign-up?plan=pro",
    highlighted: true,
  },
];

const COMPETITOR_TABLE = [
  {
    feature: "Monthly subscription",
    quotexbert: "Not required",
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
    quotexbert: "✓ Pro",
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
      "It's free to create a profile and appear in our city contractor directories. Our Pro plan ($29/month) unlocks unlimited quote submissions, direct messaging, and a verified badge. There are no per-lead fees on top.",
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
          <p className="text-amber-400 font-medium text-sm uppercase tracking-widest mb-3">
            For Renovation Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get More Renovation Jobs in the GTA
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Stop paying $300/month for HomeStars and chasing bad leads. QuoteXbert
            uses AI to pre-qualify homeowners before they contact you — so every
            lead has a real budget.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-8 py-3 rounded-xl transition"
            >
              Join Free — No Credit Card
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "bg-amber-50 border-amber-300 shadow-lg shadow-amber-100"
                    : "bg-white border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    MOST POPULAR
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <div className="flex items-end gap-1 my-2">
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500 text-sm mb-1">/ {plan.period}</span>
                </div>
                <ul className="space-y-2 my-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-amber-500 font-bold mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block w-full text-center py-2.5 rounded-xl font-semibold transition ${
                    plan.highlighted
                      ? "bg-amber-500 hover:bg-amber-400 text-white"
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
                  <th className="px-4 py-3 bg-amber-500 text-slate-900 font-bold">
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
                    <td className="px-4 py-3 text-center text-amber-700 font-semibold border-b border-slate-100 bg-amber-50">
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
