import { Metadata } from "next";
import Link from "next/link";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Pay-Per-Lead Alternative for Contractors | QuoteXbert Ontario",
  description:
    "Looking for a pay-per-lead alternative in Ontario? QuoteXbert offers flat monthly pricing with no per-lead fees — and homeowners come pre-qualified with project photos.",
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
  { feature: "Project context before contact", flat: "Yes — photos and description attached to every lead", perLead: "Typically none — you pay before seeing details" },
  { feature: "Lead exclusivity", flat: "Match-based — relevant contractors notified", perLead: "Often sold to multiple contractors simultaneously" },
  { feature: "Volume flexibility", flat: "Unlimited leads in your tier for one flat fee", perLead: "Each additional lead incurs additional cost" },
  { feature: "Risk profile", flat: "Low — fixed monthly cost, cancel anytime", perLead: "Higher — costs can escalate unpredictably" },
  { feature: "Homeowner pre-qualification", flat: "AI estimates pre-qualify budgets", perLead: "No pre-qualification in most services" },
];

const FAQS = [
  {
    question: "What is pay-per-lead for contractors?",
    answer:
      "Pay-per-lead services charge contractors a fee for each homeowner contact they receive. Fees typically range from $30 to $150 per lead depending on the trade and project type. The significant risk is that the same lead is often sold to multiple contractors simultaneously, immediately creating price competition.",
  },
  {
    question: "What is the alternative to pay-per-lead?",
    answer:
      "Subscription-based platforms like QuoteXbert charge a flat monthly fee and deliver leads included in the subscription. This provides cost predictability, allows you to respond to as many or as few leads as you choose, and removes the pressure to immediately outbid competitors because you haven't paid for each individual contact.",
  },
  {
    question: "Is a flat-fee platform better than pay-per-lead?",
    answer:
      "Neither model is universally better — it depends on your volume of jobs, the quality of leads on each platform, and your conversion rate. Flat-fee platforms work well when lead volume is consistent and conversion rates are reasonable. Pay-per-lead can work when lead quality is very high. Most contractors find flat-fee subscriptions more predictable.",
  },
  {
    question: "What does QuoteXbert charge for leads?",
    answer:
      "QuoteXbert charges a flat monthly subscription ($49–$149/month depending on plan). There are no per-lead fees on any plan. You can respond to as many leads as your capacity allows within your subscription period without incurring additional charges.",
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
            QuoteXbert offers flat monthly pricing with no per-lead fees. Homeowners arrive pre-qualified with project photos and AI estimates already reviewed.
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
              View All Leads
            </Link>
          </div>
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
