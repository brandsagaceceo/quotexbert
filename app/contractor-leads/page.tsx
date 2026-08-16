import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";
import { CONTRACTOR_CITIES, CONTRACTOR_TRADES } from "@/lib/seo/contractor-acquisition-data";

export const metadata: Metadata = {
  title: "Contractor Leads in Ontario | Homeowner Projects | QuoteXbert",
  description:
    "Explore homeowner renovation project opportunities across Toronto, Durham Region, Clarington and the GTA through the QuoteXbert contractor marketplace.",
  alternates: {
    canonical: "https://www.quotexbert.com/contractor-leads",
  },
  openGraph: {
    title: "Contractor Leads in Ontario | Homeowner Projects | QuoteXbert",
    description:
      "Explore homeowner renovation project opportunities across Toronto, Durham Region and the GTA through the QuoteXbert marketplace.",
    url: "https://www.quotexbert.com/contractor-leads",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contractor Leads in Ontario | QuoteXbert",
    description: "Explore homeowner renovation project opportunities across Toronto, Durham Region, and the GTA.",
  },
};

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Create Your Contractor Profile",
    desc: "List your trade specializations, service area, credentials, and completed work so homeowners can assess whether you fit their project.",
  },
  {
    step: "2",
    title: "Review Relevant Opportunities",
    desc: "When a homeowner submits a project in a relevant trade and service area, participating contractors can review the available project information.",
  },
  {
    step: "3",
    title: "Review and Quote",
    desc: "Check the scope, location, timing, and available project details. Ask questions before deciding whether to prepare a quote.",
  },
  {
    step: "4",
    title: "Quote and Follow Up",
    desc: "Submit a clear proposal and follow up professionally. Homeowners may compare multiple contractors before choosing who to hire.",
  },
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
      "QuoteXbert offers paid contractor subscription tiers. Review the current plans and included features on the contractor signup page before choosing a subscription. QuoteXbert does not charge a separate fee for each lead.",
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
    question: "Are QuoteXbert opportunities exclusive to one contractor?",
    answer:
      "No. QuoteXbert is a marketplace, and multiple relevant contractors may participate in the same homeowner project. Homeowners decide which contractors to contact, compare, or hire. A project opportunity is not a guarantee of work or a homeowner response.",
  },
  {
    question: "Do I need to be licensed to join QuoteXbert?",
    answer:
      "Contractors are responsible for holding any licences, registrations, insurance, or WSIB coverage required for their trade and work. Requirements vary by trade, municipality, business structure, and project. Provide accurate credentials on your profile and confirm current obligations with the relevant authority.",
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
        name: "Contractor Leads in Ontario | Homeowner Projects | QuoteXbert",
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
            Find Homeowner Project Opportunities<br />
            <span className="text-yellow-300">Across Ontario Communities</span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-10 leading-relaxed">
            QuoteXbert is a contractor marketplace where homeowners describe renovation projects and relevant contractors can decide whether to participate and quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-10 py-4 rounded-xl transition-all shadow-2xl text-lg"
            >
              View Contractor Plans →
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
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Paid subscription tiers</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Choose which projects to pursue</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Multiple contractors may participate</span>
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
            Understand the opportunity before deciding whether it fits your business.
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
                <div className="text-xs text-slate-500">Ontario opportunities</div>
                <div className="text-xs text-rose-600 font-semibold mt-1 group-hover:underline">
                  View leads →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace transparency */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-2">
            Contractor Leads Are Marketplace Opportunities
          </h2>
          <p className="text-slate-600 mb-8 text-lg max-w-3xl">
            QuoteXbert does not employ contractors or post employee vacancies. Homeowners use the marketplace to seek quotes, and more than one relevant contractor may review or respond to the same project.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { title: "Evaluate the fit", text: "Check the trade, service area, scope, timing, and available project information before committing estimating time." },
              { title: "Ask useful questions", text: "Clarify site conditions, decision-makers, scheduling, and missing scope details before preparing a proposal." },
              { title: "Quote clearly", text: "Define inclusions, exclusions, assumptions, price, timing, and next steps so the homeowner can compare proposals fairly." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6">
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link href="/contractor-growth-guide" className="text-sm font-semibold text-rose-700 hover:underline">Follow the contractor growth workflow →</Link>
            <Link href="/how-to-get-contractor-leads" className="text-sm font-semibold text-rose-700 hover:underline">Learn how to build a balanced lead pipeline →</Link>
            <Link href="/pay-per-lead-alternative" className="text-sm font-semibold text-rose-700 hover:underline">Compare lead-pricing models →</Link>
          </div>
        </div>
      </section>

      {/* New Contractor Offer */}
      <FoundingContractorSection />

      {/* FAQ */}
      <FAQSection faqs={FAQS} title="Frequently Asked Questions — Contractor Leads" />

      {/* Popular contractor opportunities — crawlable links to city+trade combos */}
      <section className="py-14 px-4 bg-slate-50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Popular Contractor Opportunities</h2>
          <p className="text-slate-600 mb-8">
            Explore city and trade combinations currently covered by the marketplace.
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
              { href: "/contractor-growth-guide", label: "Contractor Growth Guide" },
              { href: "/how-to-get-contractor-leads", label: "How to Get Contractor Leads" },
              { href: "/pay-per-lead-alternative", label: "Compare Lead Pricing Models" },
              { href: "/homestars-alternative", label: "Compare QuoteXbert and HomeStars" },
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
