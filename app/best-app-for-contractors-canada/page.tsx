import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Contractor Apps in Canada | Platform Evaluation Checklist",
  description:
    "Evaluate Canadian contractor apps and lead platforms by local fit, project context, pricing, participation, mobile workflow, terms, and booked-project results.",
  alternates: { canonical: "https://www.quotexbert.com/best-app-for-contractors-canada" },
};

const CRITERIA = [
  { title: "Trade and geographic fit", detail: "Confirm current project activity for your exact trade and service area. National coverage does not prove local fit." },
  { title: "Project context", detail: "Ask what information is available before you spend time responding, visiting, or quoting." },
  { title: "Contractor participation", detail: "Confirm whether opportunities are shared, matched, or exclusive and what those terms mean." },
  { title: "Complete pricing", detail: "Include subscriptions, per-lead charges, commissions, credits, add-ons, renewal, and cancellation terms." },
  { title: "Mobile workflow", detail: "Test notifications, project review, messaging, document access, and accessibility on the devices your team uses." },
  { title: "Trust and profile tools", detail: "Check how credentials, portfolios, reviews, moderation, disputes, and corrections are handled." },
  { title: "Data and privacy", detail: "Review how contact and project information is collected, used, retained, and shared in Canada." },
  { title: "Measured return", detail: "Compare total cost and staff time with qualified opportunities, quotes, booked projects, and gross profit." },
];

const FAQS = [
  { question: "What is the best contractor app in Canada?", answer: "There is no universal best app. The right platform depends on trade, service area, capacity, pricing model, project context, contractor participation, workflow, and your measured cost per booked project." },
  { question: "Is QuoteXbert a contractor job app?", answer: "QuoteXbert is a paid contractor marketplace for homeowner project opportunities, not an employer or employee job board. Multiple relevant contractors may participate, and no opportunity guarantees work." },
  { question: "Should I rely on online platform comparisons?", answer: "Use comparisons to build a question list, then verify current pricing and features through each platform's official materials. Competitor offerings and contract terms can change." },
  { question: "How long should I test a contractor platform?", answer: "Choose a period that fits the platform terms and your normal sales cycle. Define qualified opportunity, quote, booked project, and gross profit before the test so results are comparable." },
];

export default function ContractorAppsCanadaPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-slate-400 mb-6"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link> / Contractor Apps Canada</nav>
          <p className="text-rose-300 text-sm font-bold uppercase tracking-widest mb-4">Canadian Platform Checklist</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">How to Evaluate Contractor Apps in Canada</h1>
          <p className="text-xl text-slate-300 leading-relaxed">Compare the actual workflow, terms, local fit, and booked-project results instead of relying on an undated “best app” ranking.</p>
        </div>
      </section>

      <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
        <p className="max-w-4xl mx-auto text-sm text-amber-900"><strong>Disclosure:</strong> QuoteXbert publishes this guide and operates a contractor marketplace. Verify every platform's current pricing, availability, features, and terms directly before subscribing.</p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Eight Checks Before Choosing a Platform</h2>
          <p className="text-slate-600 mb-10">Use the same checklist for QuoteXbert and every alternative.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {CRITERIA.map((item) => <article key={item.title} className="border border-slate-200 rounded-lg p-6"><h3 className="flex items-center gap-2 font-bold text-slate-900 mb-2"><CheckCircle className="w-5 h-5 text-rose-700" />{item.title}</h3><p className="text-sm text-slate-600 leading-relaxed">{item.detail}</p></article>)}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-4">How QuoteXbert Should Be Evaluated</h2>
          <p className="text-slate-700 leading-relaxed mb-4">QuoteXbert offers paid contractor subscription tiers for Ontario homeowner project opportunities. It does not list a separate per-lead fee. Multiple relevant contractors may participate, and a subscription does not guarantee lead volume, homeowner responses, accepted quotes, or revenue.</p>
          <Link href="/contractors/join" className="font-bold text-rose-800 hover:underline">Review current QuoteXbert plans and features →</Link>
        </div>
      </section>

      <FAQSection faqs={FAQS} title="Contractor App Evaluation Questions" />

      <section className="py-12 px-4"><div className="max-w-4xl mx-auto flex flex-wrap gap-4 text-sm font-semibold">
        <Link href="/homestars-alternative" className="text-rose-800 hover:underline">HomeStars evaluation guide →</Link>
        <Link href="/pay-per-lead-alternative" className="text-rose-800 hover:underline">Compare pricing models →</Link>
        <Link href="/contractor-growth-guide" className="text-rose-800 hover:underline">Contractor growth workflow →</Link>
      </div></section>
    </main>
  );
}
