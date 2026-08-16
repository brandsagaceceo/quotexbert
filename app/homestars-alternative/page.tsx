import type { Metadata } from "next";
import Link from "next/link";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "HomeStars Alternative for Ontario Contractors | Evaluation Guide",
  description:
    "A neutral framework for Ontario contractors comparing QuoteXbert with HomeStars, including pricing, participation, coverage, terms, and measurement questions.",
  alternates: { canonical: "https://www.quotexbert.com/homestars-alternative" },
};

const QUESTIONS = [
  { topic: "Current total price", quotexbert: "Review the current paid tiers on QuoteXbert's plan page.", other: "Request or review HomeStars' current official pricing and contract terms." },
  { topic: "How opportunities work", quotexbert: "Ask which projects are visible under your tier and how matching works.", other: "Ask how homeowner inquiries are distributed and whether additional charges apply." },
  { topic: "Contractor participation", quotexbert: "Multiple relevant contractors may participate in a project.", other: "Confirm whether opportunities are shared, matched, or exclusive under the current offering." },
  { topic: "Geographic and trade fit", quotexbert: "Check current Ontario service areas and project categories.", other: "Check current coverage and homeowner activity for your exact trade and service area." },
  { topic: "Renewal and cancellation", quotexbert: "Read the current billing, renewal, cancellation, and plan-limit terms.", other: "Read the current term length, renewal, cancellation, and credit policies." },
  { topic: "Business outcome", quotexbert: "Track cost per booked project and gross profit from the source.", other: "Use the same scorecard so inquiry volume does not distort the comparison." },
];

const FAQS = [
  { question: "Is QuoteXbert cheaper than HomeStars?", answer: "Do not rely on an undated comparison. QuoteXbert publishes its current contractor tiers on its plan page. Verify HomeStars' current official quote, included features, contract length, and additional charges, then compare total cost for the same period." },
  { question: "Can contractors use QuoteXbert and HomeStars together?", answer: "Contractors can test more than one source if the combined cost and intake workload fit the business. Tag every opportunity by source and compare qualified opportunities, quotes, booked projects, acquisition cost, and gross profit." },
  { question: "Does either platform guarantee contractor jobs?", answer: "No platform comparison should imply guaranteed work. QuoteXbert is a marketplace, not an employer, and multiple relevant contractors may participate. Confirm HomeStars' current participation and lead terms directly." },
  { question: "What advantage can an established platform offer?", answer: "An established platform may offer broader brand awareness, a larger historical review base, or wider geographic coverage. Contractors should verify current local activity for their specific trade rather than assuming national scale equals local fit." },
];

export default function HomeStarsAlternativePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-slate-400 mb-6"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link> / HomeStars Alternative</nav>
          <p className="text-rose-300 text-sm font-bold uppercase tracking-widest mb-4">Platform Evaluation Guide</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Comparing QuoteXbert and HomeStars</h1>
          <p className="text-xl text-slate-300 leading-relaxed">Use current first-party terms and your own booked-project data to compare contractor platforms in Ontario.</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
        <p className="max-w-4xl mx-auto text-sm text-amber-900 leading-relaxed"><strong>Methodology:</strong> QuoteXbert publishes this page and is not an independent reviewer. Competitor pricing and features can change and are not stated here as current facts. Verify HomeStars information through its official website or sales materials on the date you evaluate it.</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Questions to Verify Before You Subscribe</h2>
          <p className="text-slate-600 mb-8">Get written answers for the plan you are actually considering.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-900 text-white text-left"><th className="p-4">Compare</th><th className="p-4">QuoteXbert</th><th className="p-4">HomeStars</th></tr></thead>
              <tbody>{QUESTIONS.map((row, index) => <tr key={row.topic} className={index % 2 ? "bg-slate-50" : "bg-white"}><th className="p-4 text-left align-top border-b border-slate-200">{row.topic}</th><td className="p-4 align-top border-b border-slate-200">{row.quotexbert}</td><td className="p-4 align-top border-b border-slate-200">{row.other}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Run a Fair Source Test</h2>
          <p className="text-slate-700 leading-relaxed">Use the same definitions and time period for each source. Record total fees, qualified opportunities, quotes, booked projects, revenue, direct project cost, estimating time, and reasons lost. A larger review database or lower subscription price does not by itself establish better return for your trade and location.</p>
        </div>
      </section>

      <FAQSection faqs={FAQS} title="QuoteXbert and HomeStars Questions" />

      <section className="py-12 px-4"><div className="max-w-4xl mx-auto flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/pay-per-lead-alternative" className="text-rose-800 hover:underline">Compare pricing models →</Link>
        <Link href="/best-app-for-contractors-canada" className="text-rose-800 hover:underline">Contractor platform checklist →</Link>
        <Link href="/contractors/join" className="text-rose-800 hover:underline">Current QuoteXbert plans →</Link>
      </div></section>
    </main>
  );
}
