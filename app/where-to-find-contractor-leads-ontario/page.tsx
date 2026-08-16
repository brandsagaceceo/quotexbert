import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Where to Find Contractor Leads in Ontario | Channel Guide",
  description:
    "Compare Ontario contractor lead sources including referrals, local search, marketplaces, partnerships, directories, and paid campaigns.",
  alternates: { canonical: "https://www.quotexbert.com/where-to-find-contractor-leads-ontario" },
};

const CHANNELS = [
  { title: "Past clients and referrals", fit: "Contractors with completed projects and strong client relationships", check: "Ask consistently, request permission for photos, and record who referred each inquiry." },
  { title: "Google Business Profile", fit: "Businesses serving defined local areas", check: "Keep services, hours, contact details, photos, and review responses accurate." },
  { title: "Contractor marketplaces", fit: "Businesses adding homeowner project opportunities to an existing pipeline", check: "Compare coverage, context, participation, pricing, renewal, cancellation, and cost per booked project." },
  { title: "Trade and professional partners", fit: "Specialists who collaborate with designers, suppliers, property managers, and other trades", check: "Define the projects and service areas that make a useful referral." },
  { title: "Useful website content", fit: "Contractors able to show genuine project experience and answer homeowner questions", check: "Publish distinct service information rather than repeated city pages with swapped place names." },
  { title: "Paid search and social campaigns", fit: "Businesses with a controlled test budget and reliable intake process", check: "Track calls and forms through qualified opportunity, quote, booked work, and gross profit." },
];

export default function WhereToFindContractorLeadsOntarioPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm text-slate-400 mb-6"><Link href="/" className="hover:text-white">Home</Link> / <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link> / Ontario Lead Sources</nav>
          <p className="text-rose-300 text-sm font-bold uppercase tracking-widest mb-4">Ontario Contractor Channel Map</p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">Where to Find Contractor Leads in Ontario</h1>
          <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">Choose lead sources by trade, location, capacity, project fit, and measured business results. No channel guarantees work.</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">Ontario Contractor Lead Sources</h2>
          <p className="text-slate-600 mb-10">Use a mix that your team can respond to, quote, and deliver well.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {CHANNELS.map((channel) => (
              <article key={channel.title} className="border border-slate-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{channel.title}</h3>
                <p className="text-sm text-slate-600 mb-4"><strong className="text-slate-800">Useful for:</strong> {channel.fit}</p>
                <p className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle className="w-5 h-5 text-rose-700 flex-none" />{channel.check}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Compare Sources With the Same Scorecard</h2>
          <p className="text-slate-700 leading-relaxed mb-6">Record source cost, project fit, qualified opportunities, site visits, quotes, booked projects, revenue, direct cost, and reason lost. Inquiry volume alone does not show whether a channel is profitable.</p>
          <Link href="/contractor-growth-guide" className="inline-flex items-center gap-2 font-bold text-rose-800 hover:underline">Use the contractor growth workflow <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/how-to-get-contractor-leads" className="text-rose-800 hover:underline">Ontario acquisition guide →</Link>
          <Link href="/pay-per-lead-alternative" className="text-rose-800 hover:underline">Compare pricing models →</Link>
          <Link href="/contractor-leads" className="text-rose-800 hover:underline">QuoteXbert marketplace →</Link>
          <Link href="/contractors/join" className="text-rose-800 hover:underline">Review plans →</Link>
        </div>
      </section>
    </main>
  );
}
