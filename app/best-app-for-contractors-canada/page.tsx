import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Best App for Contractors in Canada | Find Renovation Jobs | QuoteXbert",
  description:
    "Looking for the best app to find renovation jobs in Canada? Compare contractor apps and platforms for finding homeowner leads in Ontario and the GTA.",
  alternates: { canonical: "https://www.quotexbert.com/best-app-for-contractors-canada" },
  openGraph: {
    title: "Best App for Contractors in Canada | QuoteXbert",
    description: "Compare contractor apps and platforms for finding renovation jobs in Ontario and the GTA.",
    url: "https://www.quotexbert.com/best-app-for-contractors-canada",
    type: "website",
  },
};

const APPS_COMPARED = [
  {
    name: "QuoteXbert",
    focus: "Ontario / GTA / Durham Region",
    pricingModel: "Flat monthly subscription ($49–$149/mo)",
    preQualification: "Yes — AI estimates before homeowner posts",
    viewBeforeContact: "Yes — photos and project description",
    perLeadFees: "None",
    reviewSystem: "Verified project reviews",
    mobileApp: "Mobile-optimized web app",
    bestFor: "Ontario renovation contractors wanting pre-qualified local leads",
    highlight: true,
  },
  {
    name: "HomeStars",
    focus: "Canada-wide",
    pricingModel: "Subscription ($300–$600/mo, publicly listed 2026)",
    preQualification: "No",
    viewBeforeContact: "Limited",
    perLeadFees: "Some plans",
    reviewSystem: "Large established review database",
    mobileApp: "iOS and Android apps",
    bestFor: "Contractors wanting national brand exposure",
    highlight: false,
  },
  {
    name: "Houzz Pro",
    focus: "Global, not Ontario-specific",
    pricingModel: "Subscription ($299–$799/mo, publicly listed 2026)",
    preQualification: "No",
    viewBeforeContact: "Partial",
    perLeadFees: "None on subscription plans",
    reviewSystem: "Review system included",
    mobileApp: "iOS and Android apps",
    bestFor: "Interior designers and high-end residential contractors",
    highlight: false,
  },
  {
    name: "Thumbtack",
    focus: "USA and Canada (limited Canadian presence)",
    pricingModel: "Pay-per-contact / Credits",
    preQualification: "No",
    viewBeforeContact: "Partial",
    perLeadFees: "Yes — credits per contact",
    reviewSystem: "Review system included",
    mobileApp: "iOS and Android apps",
    bestFor: "Handymen and small service contractors",
    highlight: false,
  },
];

const FEATURES = [
  "View project photos before deciding to quote",
  "No per-lead fees — flat monthly pricing",
  "AI homeowner cost pre-qualification",
  "Direct messaging with homeowners",
  "Toronto, GTA, and Durham Region focus",
  "Verified contractor credentials displayed",
  "Founding Contractor pricing lock-in",
];

const FAQS = [
  {
    question: "What is the best app for contractors to find jobs in Canada?",
    answer:
      "The 'best' app depends on your trade, location, and business model. For Ontario renovation contractors — particularly those serving Toronto, the GTA, and Durham Region — QuoteXbert is designed specifically for this market with local pricing, AI pre-qualification, and flat monthly fees. National platforms like HomeStars and Houzz work across Canada but may have less local market density.",
  },
  {
    question: "Is there a contractor app specifically for Ontario?",
    answer:
      "QuoteXbert is focused specifically on Ontario and primarily serves the Greater Toronto Area and Durham Region. Its homeowner base, pricing data, and contractor network are all built around the Ontario renovation market.",
  },
  {
    question: "Can I use a contractor app on my phone?",
    answer:
      "Yes. QuoteXbert is mobile-optimized and works on any smartphone browser. Lead notifications are sent in real time and can be set up as push notifications. Full native iOS and Android apps are in development.",
  },
  {
    question: "What features matter most in a contractor lead app?",
    answer:
      "The most important features are: (1) project context before you commit to quoting, (2) homeowner qualification to filter out tire-kickers, (3) direct messaging without phone tag, (4) honest reviews from completed projects, and (5) transparent pricing with no surprise charges. QuoteXbert is specifically designed around these priorities.",
  },
];

export default function BestAppForContractorsCanadaPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">Best App for Contractors Canada</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            Platform Guide · Canadian Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            Best App for Contractors in Canada
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            A straightforward comparison of contractor apps and platforms available to Canadian renovation contractors — with honest notes on who each option works best for.
          </p>
          <Link
            href="/sign-up?role=contractor"
            className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg"
          >
            Try QuoteXbert Free →
          </Link>
        </div>
      </section>

      {/* Transparency note */}
      <section className="py-6 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-5xl mx-auto">
          <p className="text-amber-800 text-sm">
            <strong>Note:</strong> This comparison is written by QuoteXbert. We have tried to be factual and fair, but you should verify current pricing and features on each platform directly before deciding. Competitor pricing data is based on publicly available information as of 2026.
          </p>
        </div>
      </section>

      {/* QuoteXbert features */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">What QuoteXbert Offers Ontario Contractors</h2>
          <div className="grid sm:grid-cols-2 gap-3 mb-8">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span className="text-slate-800 text-sm font-medium">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform comparison */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-8">Platform Comparison</h2>
          <div className="space-y-6">
            {APPS_COMPARED.map((app) => (
              <div
                key={app.name}
                className={`rounded-2xl border-2 p-6 ${app.highlight ? "border-[#800020] bg-rose-50" : "border-slate-200 bg-white"}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    {app.name}
                    {app.highlight && (
                      <span className="ml-2 text-xs font-bold bg-[#800020] text-white px-2 py-1 rounded-full">
                        Reviewed Here
                      </span>
                    )}
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{app.focus}</span>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  {[
                    ["Pricing", app.pricingModel],
                    ["View before contact", app.viewBeforeContact],
                    ["Per-lead fees", app.perLeadFees],
                    ["Pre-qualification", app.preQualification],
                    ["Mobile", app.mobileApp],
                    ["Best for", app.bestFor],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-white/70 rounded-lg p-3 border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">{label}</div>
                      <div className="font-medium text-slate-800">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="Contractor App Questions" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Ontario Contractor Leads" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/pay-per-lead-alternative", label: "Pay-Per-Lead Alternative" },
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
