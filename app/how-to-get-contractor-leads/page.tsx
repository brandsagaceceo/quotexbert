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
    title: "Join a Verified Lead Platform",
    content:
      "Lead generation platforms give you consistent access to homeowners actively looking for contractors. The key is choosing a platform that pre-qualifies leads — platforms where homeowners describe projects with photos and budget information before contacting you save significant time compared to cold contact forms. QuoteXbert includes an AI estimation step that helps homeowners understand project costs before reaching out.",
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
    title: "Respond to Leads Fast",
    content:
      "Studies consistently show that the first contractor to respond to an inquiry wins a disproportionate share of jobs. On platforms like QuoteXbert, lead notifications are sent in real time. Enable push notifications on your phone, and aim to respond to every new lead within 2 hours during business hours. Speed signals professionalism and availability.",
  },
  {
    number: "06",
    title: "Get More Online Reviews",
    content:
      "After completing every job, ask your client to leave a Google review and a review on any platform you use. Send them a direct link to your review page to reduce friction. Reviews are cumulative — contractors with 50+ verified Google reviews consistently outperform competitors with fewer reviews, even if the overall rating is similar.",
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
      "Most contractors send a quote and wait. Many homeowners choose contractors who follow up once (not repeatedly) to ask if they have questions. A simple 'Do you have any questions about my proposal?' message sent 3–5 days after submission converts a meaningful fraction of otherwise lost leads. This single habit often increases conversion rates significantly.",
  },
];

const FAQS = [
  {
    question: "How do I get renovation leads without advertising?",
    answer:
      "A strong Google Business Profile with verified reviews is the most effective low-cost way to attract leads. Referral programs, before-and-after photos on social media, and word of mouth amplified by post-project follow-up can generate significant lead volume without paid advertising. Most successful established contractors get the majority of their work through non-paid channels.",
  },
  {
    question: "How many leads does a contractor need per month?",
    answer:
      "It depends on your average project value and conversion rate. A contractor with a 30% conversion rate and $25,000 average project value needs roughly 1 lead per $7,500 of revenue. To achieve $200,000 annual revenue, that means approximately 27 leads per year — roughly 2–3 per month. Higher-value work (general contracting, additions) requires fewer leads to hit revenue targets.",
  },
  {
    question: "What is a good lead conversion rate for contractors?",
    answer:
      "Industry conversion rates vary by trade and platform, but a healthy range for renovation contractors is 20–40% of qualified leads resulting in a contracted job. Lower rates often indicate either pricing issues, slow response times, or mismatched lead quality. Higher rates are common when leads are pre-qualified and arrive with realistic budgets already set.",
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
            No single method produces enough volume alone for most contractors. Combining 2–3 sources creates resilience — when one channel slows, others compensate. QuoteXbert is designed to be one part of that approach: a platform that delivers pre-qualified renovation leads to Ontario contractors at a predictable monthly cost.
          </p>
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
