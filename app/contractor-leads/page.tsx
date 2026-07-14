import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";
import { CONTRACTOR_CITIES, CONTRACTOR_TRADES } from "@/lib/seo/contractor-acquisition-data";

export const metadata: Metadata = {
  title: "Contractor Leads in Ontario | Find Renovation Jobs | QuoteXbert",
  description:
    "Find homeowner renovation leads across Toronto, Durham Region, Clarington and the GTA. Join QuoteXbert, view local opportunities and grow your contracting business.",
  alternates: {
    canonical: "https://www.quotexbert.com/contractor-leads",
  },
  openGraph: {
    title: "Contractor Leads in Ontario | Find Renovation Jobs | QuoteXbert",
    description:
      "Find homeowner renovation leads across Toronto, Durham Region and the GTA. Join QuoteXbert to receive verified leads and grow your contracting business.",
    url: "https://www.quotexbert.com/contractor-leads",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Leads in Ontario | QuoteXbert",
    description: "Find verified renovation leads across Toronto, Durham Region, and the GTA.",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create Your Contractor Profile",
    desc: "List your trade specializations, service area, credentials, and portfolio. Verified profiles rank higher in homeowner search results.",
  },
  {
    step: "2",
    title: "Receive Matched Leads",
    desc: "When a homeowner posts a renovation project matching your trade and service area, you receive an instant notification with project photos and details.",
  },
  {
    step: "3",
    title: "Review and Quote",
    desc: "Assess the project photos and scope before committing to a site visit. Submit your proposal directly through QuoteXbert's messaging system.",
  },
  {
    step: "4",
    title: "Win Jobs and Build Reputation",
    desc: "Homeowners compare contractors and choose based on reviews, portfolio, and responsiveness. Complete jobs, earn verified reviews, and grow your pipeline.",
  },
];

const COMPARISON_ROWS = [
  { feature: "Monthly subscription", quotexbert: "From $49/mo", homestars: "$300–$600/mo", houzz: "$299–$799/mo", perLead: "$30–$150/lead" },
  { feature: "Pay-per-lead fees", quotexbert: "None", homestars: "Some plans", houzz: "None", perLead: "Every lead" },
  { feature: "View project before quoting", quotexbert: "✓ Always", homestars: "✗", houzz: "Partial", perLead: "✗" },
  { feature: "AI homeowner pre-qualification", quotexbert: "✓", homestars: "✗", houzz: "✗", perLead: "✗" },
  { feature: "Direct homeowner messaging", quotexbert: "✓ All plans", homestars: "✓", houzz: "✓ Paid", perLead: "Varies" },
  { feature: "Contractor profile page", quotexbert: "✓", homestars: "✓", houzz: "✓", perLead: "Varies" },
  { feature: "GTA & Durham Region coverage", quotexbert: "✓ Full", homestars: "Partial", houzz: "✗ Global", perLead: "Varies" },
];

const FAQS = [
  {
    question: "How does QuoteXbert work for contractors?",
    answer:
      "Contractors create a profile listing their trade, service area, and credentials. When homeowners post renovation projects on QuoteXbert, the platform notifies matching contractors. Contractors review the project details and photos, then decide whether to submit a quote. There are no mandatory bid fees — you choose which leads to pursue.",
  },
  {
    question: "Is QuoteXbert free for contractors?",
    answer:
      "Creating a contractor profile and receiving lead notifications is included in the free tier. Paid subscription plans ($49–$149/month) unlock unlimited lead access, priority placement in search results, and additional trade categories. There are no per-lead fees on any plan.",
  },
  {
    question: "What trades can join QuoteXbert?",
    answer:
      "QuoteXbert supports general contractors, renovation contractors, plumbers, electricians, roofers, HVAC contractors, painters, flooring contractors, drywall contractors, tile contractors, kitchen and bathroom specialists, basement renovators, landscapers, deck and fence contractors, masonry contractors, concrete contractors, window and door contractors, and more.",
  },
  {
    question: "What areas does QuoteXbert cover?",
    answer:
      "QuoteXbert covers Toronto and the Greater Toronto Area — including Scarborough, North York, Etobicoke, Mississauga, Brampton, Vaughan, Markham, Richmond Hill — plus Durham Region (Oshawa, Whitby, Ajax, Pickering, Clarington, Bowmanville, Newcastle, Courtice) and surrounding Ontario communities.",
  },
  {
    question: "How is QuoteXbert different from HomeStars?",
    answer:
      "HomeStars charges $300–$600/month and reviews are largely pay-to-rank. QuoteXbert starts at $49/month, homeowners submit AI-estimated project photos before contacting contractors, and every lead includes project photos and a budget description so you know what you're bidding on before committing time to a quote.",
  },
  {
    question: "Do I need to be licensed to join QuoteXbert?",
    answer:
      "Regulated trades (electricians, plumbers, HVAC) must provide their Ontario licence number during registration. General contractors and renovation contractors must carry liability insurance and WSIB. Verified credentials are displayed on your profile and increase your ranking in homeowner search results.",
  },
];

export default function ContractorLeadsHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.quotexbert.com/contractor-leads",
        url: "https://www.quotexbert.com/contractor-leads",
        name: "Contractor Leads in Ontario | Find Renovation Jobs | QuoteXbert",
        description:
          "Find homeowner renovation leads across Toronto, Durham Region, and the GTA. Join QuoteXbert to grow your contracting business.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.quotexbert.com" },
            { "@type": "ListItem", position: 2, name: "Contractor Leads", item: "https://www.quotexbert.com/contractor-leads" },
          ],
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
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#600018] text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            For Contractors · Ontario-Wide
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Find Local Contractor Leads<br />
            <span className="text-yellow-300">Without Paying for Every Lead</span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
            QuoteXbert connects qualified Ontario contractors with homeowners who have already described their project, uploaded photos, and are ready to receive quotes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-10 py-4 rounded-xl transition-all shadow-2xl text-lg"
            >
              Claim My Founding Contractor Spot →
            </Link>
            <Link
              href="/for-contractors"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-10 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              Learn How It Works
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> No per-lead fees</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> View project before quoting</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> From $49/month</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2 text-center">
            How QuoteXbert Works for Contractors
          </h2>
          <p className="text-slate-600 text-center mb-10 text-lg">
            A platform built to eliminate wasted quoting time.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative">
                <div className="w-12 h-12 bg-[#800020] rounded-full flex items-center justify-center text-white font-black text-xl mb-4 shadow-lg">
                  {step.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities grid */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Contractor Leads by City
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Find renovation leads and contractor opportunities in your specific service area.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CONTRACTOR_CITIES.map((city) => (
              <Link
                key={city.slug}
                href={`/contractor-leads/${city.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-400 hover:shadow-md transition-all"
              >
                <div className="font-bold text-slate-900 group-hover:text-rose-700 transition-colors mb-1">
                  {city.name}
                </div>
                <div className="text-xs text-slate-500">{city.region}</div>
                <div className="text-xs text-rose-600 font-semibold mt-1 group-hover:underline">
                  View leads →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trades grid */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Contractor Leads by Trade
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            Find renovation leads specific to your trade across Ontario.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {CONTRACTOR_TRADES.map((trade) => (
              <Link
                key={trade.slug}
                href={`/contractor-leads/trades/${trade.slug}`}
                className="group bg-white border border-slate-200 rounded-xl p-4 hover:border-rose-400 hover:shadow-md transition-all"
              >
                <div className="font-bold text-slate-900 group-hover:text-rose-700 transition-colors mb-1 text-sm">
                  {trade.name}
                </div>
                <div className="text-xs text-slate-500">Avg: {trade.avgProjectValue}</div>
                <div className="text-xs text-rose-600 font-semibold mt-1 group-hover:underline">
                  View leads →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            How QuoteXbert Compares
          </h2>
          <p className="text-slate-600 mb-8 text-lg">
            An honest comparison across the lead generation options available to Ontario contractors.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="px-4 py-3 rounded-tl-xl">Feature</th>
                  <th className="px-4 py-3 bg-[#800020]">QuoteXbert</th>
                  <th className="px-4 py-3">HomeStars</th>
                  <th className="px-4 py-3">Houzz</th>
                  <th className="px-4 py-3 rounded-tr-xl">Pay-Per-Lead</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-100">{row.feature}</td>
                    <td className="px-4 py-3 text-rose-700 font-semibold border-b border-slate-100 bg-rose-50">{row.quotexbert}</td>
                    <td className="px-4 py-3 text-slate-500 border-b border-slate-100">{row.homestars}</td>
                    <td className="px-4 py-3 text-slate-500 border-b border-slate-100">{row.houzz}</td>
                    <td className="px-4 py-3 text-slate-500 border-b border-slate-100">{row.perLead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Pricing data is approximate and based on publicly available information as of 2026. For the most current pricing, visit each platform directly.{" "}
            <Link href="/homestars-alternative" className="text-rose-700 hover:underline">
              Full comparison with HomeStars →
            </Link>
          </p>
        </div>
      </section>

      {/* Founding Contractor Program */}
      <FoundingContractorSection />

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Frequently Asked Questions — Contractor Leads" />

      {/* Popular contractor opportunities — crawlable links to city+trade combos */}
      <section className="py-14 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Popular Contractor Opportunities</h2>
          <p className="text-slate-600 mb-8">
            High-demand city and trade combinations across Ontario.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { href: "/contractor-leads/toronto/general-contractors",   label: "General Contractor Leads — Toronto" },
              { href: "/contractor-leads/toronto/handyman",              label: "Handyman Leads — Toronto" },
              { href: "/contractor-leads/toronto/painters",              label: "Painting Leads — Toronto" },
              { href: "/contractor-leads/toronto/roofers",               label: "Roofing Leads — Toronto" },
              { href: "/contractor-leads/oshawa/general-contractors",    label: "General Contractor Leads — Oshawa" },
              { href: "/contractor-leads/whitby/general-contractors",    label: "General Contractor Leads — Whitby" },
              { href: "/contractor-leads/ajax/general-contractors",      label: "General Contractor Leads — Ajax" },
              { href: "/contractor-leads/pickering/general-contractors", label: "General Contractor Leads — Pickering" },
              { href: "/contractor-leads/clarington/general-contractors",label: "General Contractor Leads — Clarington" },
              { href: "/contractor-leads/bowmanville/general-contractors",label: "General Contractor Leads — Bowmanville" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 hover:border-rose-400 hover:text-rose-700 hover:shadow-sm transition-all"
              >
                <span className="text-rose-600">→</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Additional links */}
      <section className="py-12 px-4 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-6">Contractor Resources</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { href: "/for-contractors", label: "Contractor Overview" },
              { href: "/contractors/join", label: "Join as a Contractor" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/how-to-get-contractor-leads", label: "How to Get Contractor Leads" },
              { href: "/contractor-lead-generation-canada", label: "Lead Generation in Canada" },
              { href: "/best-app-for-contractors-canada", label: "Best App for Contractors" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-rose-700 hover:underline py-1"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
