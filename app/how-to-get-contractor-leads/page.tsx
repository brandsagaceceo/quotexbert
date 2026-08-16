import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "How to Get More Contractor Leads in Ontario | Practical Guide | QuoteXbert",
  description:
    "A practical guide for Ontario contractors looking to get more renovation leads — covering platforms, Google, referrals, social media, and what actually works.",
  alternates: { canonical: "https://www.quotexbert.com/how-to-get-contractor-leads" },
  openGraph: {
    title: "How to Get More Contractor Leads in Ontario | QuoteXbert",
    description: "Practical advice for Ontario contractors on finding more renovation leads — what works and what doesn't.",
    url: "https://www.quotexbert.com/how-to-get-contractor-leads",
    type: "website",
  },
};

const TIPS = [
  {
    number: "01",
    title: "Build a Strong Google Business Profile",
    content:
      "Your Google Business Profile (formerly Google My Business) is the single most important free marketing tool for a local contractor. Homeowners searching 'contractor near me' or 'kitchen renovation Toronto' see local businesses first. Ensure your profile is complete: business name, phone number, website, service areas, photos of completed work, and genuine client reviews. Respond to every review — positive and negative — professionally.",
  },
  {
    number: "02",
    title: "Evaluate Contractor Marketplaces",
    content:
      "Contractor marketplaces can add homeowner project opportunities to your pipeline. Compare the trades and locations covered, available project context, participation model, pricing, renewal terms, and your own cost per booked project. A marketplace opportunity is not guaranteed work, and more than one contractor may participate.",
  },
  {
    number: "03",
    title: "Systematize Your Referral Process",
    content:
      "Referrals consistently produce the highest quality leads at the lowest cost. But most contractors wait for referrals to happen organically. Instead: ask every satisfied client directly if they know anyone who might need renovation work, offer a simple referral incentive, and follow up after project completion to thank clients and ask for a Google review. A system beats hoping.",
  },
  {
    number: "04",
    title: "Photograph Every Completed Job",
    content:
      "Before-and-after photos are your most powerful marketing asset. A professional kitchen renovation, a beautifully tiled bathroom, or a clean deck build attracts inquiries without any advertising spend. Post photos to Google Business Profile, Instagram, your website, and your QuoteXbert contractor profile. Homeowners make hiring decisions based on visual evidence of your work quality.",
  },
  {
    number: "05",
    title: "Respond Promptly and Clearly",
    content:
      "Acknowledge relevant inquiries promptly, ask focused questions, and state when you can provide the next step. Do not sacrifice scope accuracy for speed. A clear response that confirms location, timing, access, and project fit is more useful than an unsupported promise.",
  },
  {
    number: "06",
    title: "Get More Online Reviews",
    content:
      "After completing a project, ask a satisfied client for an honest Google review or a review on a platform you use. Send a direct link to reduce friction, never offer incentives that violate the platform's policies, and respond professionally to both positive and critical feedback.",
  },
  {
    number: "07",
    title: "Specialize and Rank Higher in Search",
    content:
      "General contractors face more competition than specialists. A contractor who is known specifically for kitchen renovations in a specific city will rank higher in Google for '[city] kitchen renovation contractor' than a general contractor with the same credentials. Consider building specialized content on your website — even a single well-written page about your kitchen renovation work in your city improves search visibility.",
  },
  {
    number: "08",
    title: "Follow Up on Every Proposal",
    content:
      "Many contractors send a quote and wait. Schedule one respectful follow-up to ask whether the homeowner has questions about scope, assumptions, timing, or payment terms. Record the outcome and avoid repeated pressure when the homeowner has made a decision.",
  },
];

const FAQS = [
  {
    question: "How do I get renovation leads without advertising?",
    answer:
      "A complete Google Business Profile, referrals, completed-work photos, local relationships, and useful website content can generate inquiries without paid advertising. Results vary by trade and market, so track which channels produce qualified opportunities and booked projects for your business.",
  },
  {
    question: "How many leads does a contractor need per month?",
    answer:
      "There is no useful universal target. Start with your available capacity, average project size, historical quote acceptance, seasonality, and gross margin. Work backward from the projects your team can deliver, then track how many qualified opportunities and quotes your own business needs.",
  },
  {
    question: "What is a good lead conversion rate for contractors?",
    answer:
      "Use your own baseline rather than a generic benchmark. Define each stage consistently, then track inquiry, qualified opportunity, site visit, quote, and booked project by source. Investigate changes in fit, response, scope, pricing, schedule, and follow-up before drawing conclusions.",
  },
  {
    question: "Should I use multiple lead platforms?",
    answer:
      "Many contractors use 2–3 platforms to maintain consistent lead volume. The key is tracking which platforms produce actual jobs, not just inquiries. Calculate the cost per closed job on each platform (total platform cost ÷ jobs won) and allocate budget accordingly. Platforms that produce closed jobs efficiently are worth maintaining; platforms that produce high volumes of unqualified leads are not.",
  },
];

export default function HowToGetContractorLeadsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">How to Get Contractor Leads</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            Contractor Growth Guide · Ontario
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            How to Get More Contractor Leads in Ontario
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            A practical guide covering the strategies that actually work for Ontario renovation contractors — from lead platforms to referral systems and search visibility.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Start Getting Leads — From $49/Month
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

      {/* Tips */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-10">
            8 Proven Ways to Get More Contractor Leads
          </h2>
          <div className="space-y-10">
            {TIPS.map((tip) => (
              <div key={tip.number} className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#800020] rounded-xl flex items-center justify-center text-white font-black text-base">
                  {tip.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{tip.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-5">The Bottom Line</h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Contractor lead generation in Ontario works best as a layered approach: a Google Business Profile for organic local search visibility, a lead platform for consistent new client acquisition, a systematic referral program, and strong before-and-after photo content wherever you are online.
          </p>
          <p className="text-slate-700 leading-relaxed">
            A mix of sources can reduce reliance on any single channel. QuoteXbert can be one part of that approach: a paid subscription marketplace where Ontario contractors review relevant homeowner project opportunities. Multiple contractors may participate, and outcomes are not guaranteed.
          </p>
        </div>
      </section>

      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Track Lead Sources Through to Booked Work</h2>
          <p className="text-slate-700 leading-relaxed mb-6">Record the same stages for every source so you can compare business outcomes rather than inquiry counts.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Source and acquisition cost", "Trade, location, and project fit", "Qualified opportunity and site visit", "Quote sent and decision", "Booked revenue and direct project cost", "Reason declined or not selected"].map((item) => (
              <div key={item} className="flex items-center gap-3 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                <CheckCircle className="w-5 h-5 text-rose-700 flex-none" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="Contractor Lead Generation — FAQ" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Ontario Contractor Leads" },
              { href: "/contractor-lead-generation-canada", label: "Lead Generation in Canada" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/pay-per-lead-alternative", label: "Pay-Per-Lead Alternative" },
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
