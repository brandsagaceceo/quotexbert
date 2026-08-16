import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Contractor Lead Generation in Canada | Find Renovation Leads | QuoteXbert",
  description:
    "A practical guide to Canadian contractor lead channels, regional fit, trust signals, privacy, measurement, and evaluating marketplace pricing models.",
  alternates: { canonical: "https://www.quotexbert.com/contractor-lead-generation-canada" },
  openGraph: {
    title: "Contractor Lead Generation in Canada | QuoteXbert",
    description: "How Canadian contractors find and convert renovation leads. Platform comparison and practical advice.",
    url: "https://www.quotexbert.com/contractor-lead-generation-canada",
    type: "website",
  },
};

const METHODS = [
  {
    title: "Lead Generation Platforms",
    description: "Contractor marketplaces connect businesses with homeowners seeking quotes. Compare current pricing, geographic and trade coverage, project context, participation, and contract terms directly.",
    pros: ["Adds another acquisition channel", "Can focus on active homeowner projects", "Profiles can support visibility"],
    cons: ["Monthly costs", "Competition with other contractors on the same platform"],
  },
  {
    title: "Google Business Profile",
    description: "A free Google Business Profile listing allows homeowners searching for contractors near them to find your business directly in Google Maps and local search results.",
    pros: ["Free listing", "High intent search traffic", "Reviews visible in Google Search"],
    cons: ["Requires active management", "Takes time to accumulate reviews"],
  },
  {
    title: "Word of Mouth and Referrals",
    description: "Past clients, suppliers, designers, property managers, and other trades can introduce homeowners who need relevant work.",
    pros: ["Existing relationship context", "No direct advertising charge", "Can reinforce local reputation"],
    cons: ["Slow to build initially", "Unpredictable volume"],
  },
  {
    title: "Social Media (Instagram, Facebook)",
    description: "Renovation contractors with strong before-and-after photo content find Instagram and Facebook effective for generating awareness and inbound leads.",
    pros: ["Visual medium suits renovation work", "Organic reach possible", "Builds brand recognition"],
    cons: ["Requires consistent content creation", "Reach and results vary by platform"],
  },
  {
    title: "Pay-Per-Lead Services",
    description: "Some services charge for each lead defined by their terms. Lead context, filters, credits, and contractor participation vary by provider.",
    pros: ["No upfront commitment", "Pay only for leads"],
    cons: ["Total cost varies with volume", "Credit and dispute terms require review", "Project context varies"],
  },
];

const FAQS = [
  {
    question: "What is the best way to get contractor leads in Canada?",
    answer:
      "There is no universal best source. Compare referrals, local search, marketplaces, trade relationships, and advertising using your own qualified-opportunity, quote, booked-project, and gross-profit data. QuoteXbert is focused on the Ontario market.",
  },
  {
    question: "How much should a Canadian contractor spend on lead generation?",
    answer:
      "Set a test budget your business can sustain, define the outcome you will measure, and include platform fees, advertising, staff time, estimating time, and creative costs. Compare total acquisition cost with gross profit from booked projects rather than using a generic percentage.",
  },
  {
    question: "Are pay-per-lead services worth it in Canada?",
    answer:
      "Pay-per-lead and subscription services can both work. Verify whether opportunities are shared, matched, or exclusive; what project context is available; how credits work; and how charges accrue. Then calculate cost per booked project using your own results.",
  },
  {
    question: "Is Google effective for contractor lead generation in Canada?",
    answer:
      "Yes. A well-maintained Google Business Profile with genuine reviews is one of the most effective long-term lead generation tools for local contractors. 'Contractor near me' and '[trade] in [city]' searches drive high-intent traffic directly to businesses with strong local profiles.",
  },
  {
    question: "How do I generate contractor leads in Ontario specifically?",
    answer:
      "Ontario contractors benefit from platforms with specific Ontario/GTA focus (like QuoteXbert), maintaining a Google Business Profile with Ontario service areas listed, joining the Ontario Home Builders' Association or RenoMark program for credibility, and building a referral network within the local community.",
  },
];

export default function ContractorLeadGenerationCanadaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">Lead Generation Canada</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            Contractor Business Growth · Canada
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            Contractor Lead Generation in Canada
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            A practical overview of how Canadian contractors find renovation leads — comparing platforms, organic methods, and referral strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Join QuoteXbert — From $49/Month
            </Link>
            <Link
              href="/contractor-leads"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              View Contractor Leads
            </Link>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            Lead Generation Methods for Canadian Contractors
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            A resilient pipeline usually combines sources. Evaluate each one against your service area, trade, capacity, and measured outcomes.
          </p>
          <div className="space-y-8">
            {METHODS.map((method) => (
              <div key={method.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">{method.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 text-sm mb-2">Advantages</h4>
                    <ul className="space-y-1">
                      {method.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-slate-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700 text-sm mb-2">Considerations</h4>
                    <ul className="space-y-1">
                      {method.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500 font-bold">—</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QuoteXbert section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-5">
            How QuoteXbert Fits into Your Lead Generation Strategy
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-6">
            QuoteXbert is a paid contractor marketplace focused on Ontario renovation projects. Homeowners can describe a project and use estimation tools, while relevant contractors decide whether an available opportunity fits their trade, service area, and schedule.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            QuoteXbert does not employ contractors or guarantee project volume, homeowner responses, accepted quotes, or revenue. Multiple relevant contractors may participate in the same project.
          </p>
          <p className="text-slate-700 leading-relaxed">
            Canadian contractors should also account for provincial trade rules, municipal licensing and permits, insurance and workers' compensation obligations, Canadian privacy and anti-spam requirements, taxes, climate, and travel distance. Confirm requirements with the appropriate authority for each project and province.
          </p>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="Lead Generation Questions — Canadian Contractors" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Ontario Contractor Leads Hub" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/pay-per-lead-alternative", label: "Pay-Per-Lead Alternative" },
              { href: "/how-to-get-contractor-leads", label: "How to Get More Leads" },
              { href: "/contractors/join", label: "Join QuoteXbert" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-rose-700 hover:underline">
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
