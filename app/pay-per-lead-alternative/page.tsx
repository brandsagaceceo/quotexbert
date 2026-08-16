import { Metadata } from "next";
import Link from "next/link";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Pay-Per-Lead Alternative for Contractors | QuoteXbert Ontario",
  description:
    "Compare subscription and pay-per-lead pricing models for Ontario contractor opportunities, including cost predictability, participation, and measurement.",
  alternates: { canonical: "https://www.quotexbert.com/pay-per-lead-alternative" },
  openGraph: {
    title: "Pay-Per-Lead Alternative for Contractors | QuoteXbert",
    description: "Flat monthly pricing instead of pay-per-lead. QuoteXbert delivers Ontario renovation leads with no per-lead fees.",
    url: "https://www.quotexbert.com/pay-per-lead-alternative",
    type: "website",
  },
};

const COMPARISON_ROWS = [
  { feature: "Monthly cost predictability", flat: "Fixed — you know your cost in advance", perLead: "Variable — depends on lead volume" },
  { feature: "How charges accrue", flat: "Subscription cost applies for the billing period", perLead: "A charge applies to each lead under the provider's terms" },
  { feature: "Participation", flat: "Can be shared, matched, or exclusive depending on the platform", perLead: "Can be shared, matched, or exclusive depending on the platform" },
  { feature: "Project context", flat: "Varies by platform and homeowner submission", perLead: "Varies by platform and homeowner submission" },
  { feature: "Best comparison metric", flat: "Cost per booked project and gross profit", perLead: "Cost per booked project and gross profit" },
  { feature: "Terms to verify", flat: "Renewal, cancellation, plan limits, and included features", perLead: "Lead definition, credits, disputes, filters, and refunds" },
];

const FAQS = [
  {
    question: "What is pay-per-lead for contractors?",
    answer:
      "Pay-per-lead services charge a fee for each lead defined by the provider's terms. Pricing, project context, filters, credits, and the number of participating contractors vary, so verify those details directly before purchasing leads.",
  },
  {
    question: "What is the alternative to pay-per-lead?",
    answer:
      "Subscription platforms charge for access during a billing period rather than separately for each lead. This can make platform cost more predictable, but it does not guarantee lead volume, exclusivity, homeowner responses, or booked projects.",
  },
  {
    question: "Is a flat-fee platform better than pay-per-lead?",
    answer:
      "Neither model is universally better. Track total source cost, qualified opportunities, quotes, booked projects, project revenue, and gross profit. Compare the cost per booked project and the operational time each source requires.",
  },
  {
    question: "What does QuoteXbert charge for leads?",
    answer:
      "QuoteXbert currently presents paid monthly contractor tiers and does not list a separate per-lead charge. Review the current plan page for prices, limits, included features, renewal, and cancellation terms before subscribing.",
  },
];

export default function PayPerLeadAlternativePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">Pay-Per-Lead Alternative</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            For Ontario Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            Pay-Per-Lead Alternative<br />for Ontario Contractors
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            QuoteXbert uses paid monthly contractor subscription tiers rather than a separate per-lead charge. Compare the full terms and measure results using booked work, not inquiry counts.
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
              Explore Contractor Opportunities
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Shared, Matched, and Exclusive Leads</h2>
          <p className="text-slate-700 leading-relaxed">
            Pricing model and participation are separate questions. A subscription or pay-per-lead provider may offer shared opportunities, match a limited group, or sell exclusive access. Ask how many contractors can participate, what “exclusive” covers, and whether a lead can be credited before comparing prices. QuoteXbert is a marketplace where multiple relevant contractors may participate.
          </p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Flat Fee vs Pay-Per-Lead</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="px-4 py-3 rounded-tl-xl w-1/3">Feature</th>
                  <th className="px-4 py-3 bg-[#800020]">Flat Monthly (QuoteXbert)</th>
                  <th className="px-4 py-3 rounded-tr-xl">Pay-Per-Lead</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-3 font-medium text-slate-800 border-b border-slate-100">{row.feature}</td>
                    <td className="px-4 py-3 text-slate-800 border-b border-slate-100 bg-rose-50">{row.flat}</td>
                    <td className="px-4 py-3 text-slate-600 border-b border-slate-100">{row.perLead}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="Pay-Per-Lead vs Subscription — FAQ" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Contractor Leads Hub" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/how-to-get-contractor-leads", label: "How to Get Contractor Leads" },
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
