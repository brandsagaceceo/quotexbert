import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, ClipboardCheck, MessageSquare, Search, Star, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Ontario Contractor Growth Guide | Build a Better Project Pipeline",
  description:
    "A practical Ontario contractor growth guide covering lead sources, project evaluation, profiles, quotes, follow-up, communication, reviews, and measurement.",
  alternates: { canonical: "https://www.quotexbert.com/contractor-growth-guide" },
  openGraph: {
    title: "Ontario Contractor Growth Guide | QuoteXbert",
    description:
      "Build a more consistent contractor pipeline from first opportunity through quote, project communication, review, and referral.",
    url: "https://www.quotexbert.com/contractor-growth-guide",
    type: "article",
  },
};

const LIFECYCLE = [
  {
    id: "need-work",
    title: "Define the Work You Want",
    summary: "A useful pipeline starts with capacity, not volume. Decide which projects fit your trade, crew, schedule, service area, and minimum job size.",
    actions: [
      "List the project types your team can estimate and deliver reliably.",
      "Set a realistic service area based on travel, permits, suppliers, and crew logistics.",
      "Identify schedule gaps and the lead time you can honestly offer homeowners.",
      "Write down the project conditions that make an opportunity a poor fit.",
    ],
  },
  {
    id: "find-opportunities",
    title: "Build a Balanced Lead Mix",
    summary: "Use several channels so one platform or referral source does not control your pipeline.",
    actions: [
      "Keep your Google Business Profile accurate and add real completed-work photos.",
      "Ask satisfied clients and trusted trade partners for referrals.",
      "Use marketplace profiles that match your trades and service area.",
      "Publish useful service information where you have genuine experience, without duplicating thin city pages.",
    ],
  },
  {
    id: "evaluate",
    title: "Evaluate Each Project Opportunity",
    summary: "A lead is an opportunity to assess, not guaranteed work. Check fit before spending hours on an estimate.",
    actions: [
      "Confirm location, scope, timing, access, decision-makers, and known constraints.",
      "Separate missing information from assumptions and ask focused questions.",
      "Decide whether a site visit, call, or document review is the right next step.",
      "Decline promptly when the project is outside your licence, capacity, or service area.",
    ],
  },
  {
    id: "respond",
    title: "Respond Clearly",
    summary: "Prompt acknowledgement helps, but accuracy matters more than an unsupported promise made too quickly.",
    actions: [
      "Confirm that you received the inquiry and when you can review it.",
      "Use a short question checklist for each project type.",
      "State your next step and timing in plain language.",
      "Keep messages professional even when an opportunity is not a fit.",
    ],
  },
  {
    id: "trust",
    title: "Build Trust Before the Quote",
    summary: "Homeowners need evidence that your business is relevant, accountable, and capable of delivering the specific work.",
    actions: [
      "Show real projects similar in scope, property type, or finish level.",
      "Keep business, insurance, and regulated-trade information current where applicable.",
      "Explain your process for site protection, changes, scheduling, and communication.",
      "Use genuine reviews and testimonials only with permission and accurate attribution.",
    ],
  },
  {
    id: "quote",
    title: "Prepare a Quote That Can Be Compared",
    summary: "A clear quote reduces ambiguity and helps a homeowner compare more than the bottom-line price.",
    actions: [
      "Define scope, inclusions, exclusions, allowances, assumptions, and tax treatment.",
      "Identify who supplies fixtures, finishes, permits, disposal, and site access.",
      "State payment milestones, anticipated timing, and quote validity.",
      "Explain how changes will be documented and approved.",
    ],
  },
  {
    id: "follow-up",
    title: "Follow Up Without Pressure",
    summary: "A useful follow-up answers questions and clarifies next steps rather than manufacturing urgency.",
    actions: [
      "Schedule one respectful follow-up after sending the quote.",
      "Ask whether any scope, timing, or payment detail needs clarification.",
      "Record the outcome and the reason when known.",
      "Close the opportunity in your tracking system when the homeowner decides.",
    ],
  },
  {
    id: "deliver",
    title: "Communicate During the Project",
    summary: "Reliable project communication protects the homeowner relationship and your margin.",
    actions: [
      "Confirm the schedule, site access, selections, and responsibilities before starting.",
      "Provide updates when milestones, delays, or decisions affect the plan.",
      "Document changes in scope, price, and timing before extra work proceeds.",
      "Finish with a walkthrough, deficiency list, and clear closeout documents.",
    ],
  },
  {
    id: "repeat",
    title: "Review, Refer, and Improve",
    summary: "The end of one project should improve the next estimating and marketing decision.",
    actions: [
      "Ask satisfied clients for an honest review using a direct link.",
      "Request permission before publishing project photos or client details.",
      "Invite referrals without making the client responsible for selling.",
      "Review which source produced the project and what the full acquisition cost was.",
    ],
  },
];

const FAQS = [
  {
    question: "What is the best source of contractor leads in Ontario?",
    answer:
      "There is no universal best source. Compare referrals, local search, marketplace subscriptions, advertising, and trade relationships using your own qualified-opportunity, quote, booked-project, gross-profit, and acquisition-cost data.",
  },
  {
    question: "How should contractors evaluate a lead platform?",
    answer:
      "Check geographic and trade fit, project context, contractor participation, pricing model, renewal and cancellation terms, communication tools, and your cost per booked project. Verify current platform terms directly before paying.",
  },
  {
    question: "Does a contractor marketplace guarantee jobs?",
    answer:
      "No. A marketplace opportunity is not employment or guaranteed work. Multiple relevant contractors may participate, and the homeowner decides whom to contact, compare, or hire.",
  },
  {
    question: "Should a contractor create a page for every city?",
    answer:
      "Only create a location page when it provides distinct, useful information for that community and reflects real service experience. Repeated pages with swapped place names can confuse users and weaken search quality.",
  },
];

export default function ContractorGrowthGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ontario Contractor Growth Guide",
    description: "A practical lifecycle guide for building and measuring an Ontario contractor project pipeline.",
    author: { "@type": "Organization", name: "QuoteXbert" },
    publisher: { "@type": "Organization", name: "QuoteXbert", url: "https://www.quotexbert.com" },
    mainEntityOfPage: "https://www.quotexbert.com/contractor-growth-guide",
  };

  return (
    <main className="min-h-screen bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="bg-slate-950 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">Growth Guide</span>
          </nav>
          <div className="max-w-4xl">
            <p className="text-rose-300 font-bold uppercase tracking-widest text-sm mb-4">Ontario Contractor Knowledge Hub</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">Build a Better Contractor Project Pipeline</h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              A practical workflow from deciding what work fits your business to finding opportunities, quoting clearly, communicating well, earning reviews, and measuring what produces profitable projects.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/how-to-get-contractor-leads" className="inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 px-6 py-3 rounded-lg font-bold">
                Explore Lead Sources <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contractors/join" className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 px-6 py-3 rounded-lg font-bold">
                Review QuoteXbert Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-x-5 gap-y-3 text-sm">
          {LIFECYCLE.map((stage) => (
            <a key={stage.id} href={`#${stage.id}`} className="font-semibold text-rose-800 hover:underline">{stage.title}</a>
          ))}
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: Search, title: "Quality before volume", text: "Judge opportunities by business fit and outcome, not a platform's headline lead count." },
            { icon: Users, title: "Marketplace reality", text: "Homeowners may compare multiple contractors. No opportunity guarantees a response or project." },
            { icon: ClipboardCheck, title: "Track the full path", text: "Measure from source through qualified opportunity, quote, booked project, and gross profit." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-l-4 border-rose-700 pl-5">
              <Icon className="w-6 h-6 text-rose-700 mb-3" />
              <h2 className="font-black text-slate-900 mb-2">{title}</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {LIFECYCLE.map((stage, index) => (
        <section key={stage.id} id={stage.id} className={`py-14 px-4 border-t border-slate-100 ${index % 2 ? "bg-slate-50" : "bg-white"}`}>
          <div className="max-w-4xl mx-auto grid md:grid-cols-[220px_1fr] gap-8">
            <div>
              <span className="text-sm font-black text-rose-700">STEP {String(index + 1).padStart(2, "0")}</span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">{stage.title}</h2>
            </div>
            <div>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">{stage.summary}</p>
              <ul className="space-y-3">
                {stage.actions.map((action) => (
                  <li key={action} className="flex items-start gap-3 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-rose-700 flex-none mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 px-4 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-7 h-7 text-rose-300" />
            <h2 className="text-3xl font-black">Measure the Pipeline You Actually Have</h2>
          </div>
          <p className="text-slate-300 leading-relaxed mb-8">
            Use a spreadsheet or CRM to record source, trade, location, fit, response, site visit, quote, outcome, revenue, direct cost, and reason lost. Compare sources over a meaningful period and avoid treating inquiries as revenue.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {["Qualified opportunities by source", "Quotes sent and projects booked", "Platform and advertising cost", "Gross profit from booked projects", "Reasons opportunities were declined", "Reasons quotes were not accepted"].map((item) => (
              <div key={item} className="flex items-center gap-2 bg-white/10 border border-white/10 p-4 rounded-lg">
                <CheckCircle className="w-4 h-4 text-rose-300 flex-none" />{item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="w-7 h-7 text-rose-700" />
            <h2 className="text-3xl font-black text-slate-900">Contractor Growth FAQ</h2>
          </div>
          <div className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.question} className="border border-slate-200 rounded-lg p-6">
                <h3 className="font-bold text-slate-900 mb-2">{faq.question}</h3>
                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">Continue With a Focused Guide</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Ontario Contractor Opportunities" },
              { href: "/how-to-get-contractor-leads", label: "How to Get Contractor Leads" },
              { href: "/pay-per-lead-alternative", label: "Compare Lead Pricing Models" },
              { href: "/contractor-lead-generation-canada", label: "Canadian Lead Channels" },
              { href: "/contractors/join", label: "QuoteXbert Plans" },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="font-semibold text-rose-800 hover:underline">{link.label} →</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
