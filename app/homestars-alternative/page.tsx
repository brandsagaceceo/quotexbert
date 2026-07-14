import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "HomeStars Alternative for Contractors | QuoteXbert vs HomeStars",
  description:
    "Compare QuoteXbert and HomeStars for contractor lead generation in Ontario. Transparent pricing comparison, feature breakdown, and honest assessment of both platforms.",
  alternates: { canonical: "https://www.quotexbert.com/homestars-alternative" },
  openGraph: {
    title: "HomeStars Alternative for Contractors | QuoteXbert vs HomeStars",
    description: "An honest comparison of QuoteXbert and HomeStars for Ontario contractors. Pricing, features, and lead quality compared.",
    url: "https://www.quotexbert.com/homestars-alternative",
    type: "website",
  },
};

const COMPARISON = [
  {
    feature: "Monthly subscription cost",
    quotexbert: "From $49/month (Handyman plan)",
    homestars: "$300–$600/month (publicly listed rates, 2026)",
    quotexbertWins: true,
  },
  {
    feature: "Pay-per-lead fees",
    quotexbert: "None — flat monthly fee covers all leads",
    homestars: "Some plans include per-lead charges above the base subscription",
    quotexbertWins: true,
  },
  {
    feature: "View project details before quoting",
    quotexbert: "Yes — homeowners upload photos and describe their project",
    homestars: "Limited — basic homeowner contact forms",
    quotexbertWins: true,
  },
  {
    feature: "AI homeowner pre-qualification",
    quotexbert: "Homeowners receive AI estimates before posting — enter the conversation with realistic budgets",
    homestars: "No homeowner pre-qualification step",
    quotexbertWins: true,
  },
  {
    feature: "Contractor profile page",
    quotexbert: "Included on all plans — photos, reviews, credentials",
    homestars: "Available — with badge tiers based on review volume",
    quotexbertWins: false,
  },
  {
    feature: "Review system",
    quotexbert: "Verified project completion reviews",
    homestars: "Large established review database",
    quotexbertWins: false,
  },
  {
    feature: "GTA and Durham Region coverage",
    quotexbert: "Full — Toronto, GTA, Durham Region including Clarington",
    homestars: "Available but national platform not focused on any specific market",
    quotexbertWins: true,
  },
  {
    feature: "Direct homeowner messaging",
    quotexbert: "Included on all plans",
    homestars: "Available",
    quotexbertWins: false,
  },
];

const FAQS = [
  {
    question: "Is QuoteXbert actually cheaper than HomeStars?",
    answer:
      "QuoteXbert's plans start at $49/month, which is substantially lower than HomeStars' publicly listed subscription rates of $300–$600/month. The pricing comparison is straightforward. Whether a more expensive platform delivers proportionally more value depends on lead quality, conversion rate, and project values — factors every contractor should evaluate based on their own experience.",
  },
  {
    question: "Can I use both QuoteXbert and HomeStars?",
    answer:
      "Yes. Many contractors use multiple platforms simultaneously. QuoteXbert's lower price point makes it practical to run alongside other platforms without significant cost risk. Some contractors find QuoteXbert particularly useful for its pre-qualified leads and AI-estimated project descriptions.",
  },
  {
    question: "What is HomeStars' rating system?",
    answer:
      "HomeStars uses a proprietary scoring system called HomeStars Score that incorporates reviews, complaints, and profile completeness. Contractors can purchase featured placements and higher visibility tiers. For context, QuoteXbert uses contractor rankings based on credentials, review ratings, and response rate — all earned through actual platform performance.",
  },
  {
    question: "Does QuoteXbert have as many homeowners as HomeStars?",
    answer:
      "HomeStars is a more established platform with a larger existing user base. QuoteXbert is newer and growing — primarily serving the Toronto, GTA, and Durham Region market. Contractors should evaluate both platforms based on the quality of leads received and conversion rates, not just lead volume.",
  },
  {
    question: "What types of contractors does QuoteXbert work best for?",
    answer:
      "QuoteXbert works particularly well for renovation contractors, kitchen and bathroom specialists, basement contractors, and general contractors who do complex projects. The AI pre-qualification system is especially valuable for these categories because homeowners enter the conversation already understanding the cost range of their project.",
  },
];

export default function HomeStarsAlternativePage() {
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">HomeStars Alternative</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            Platform Comparison · For Ontario Contractors
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            QuoteXbert vs HomeStars<br />for Ontario Contractors
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            A transparent feature-by-feature comparison to help Ontario contractors evaluate their lead generation options.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Try QuoteXbert — From $49/Month
            </Link>
            <Link
              href="/contractor-leads"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              View All Contractor Leads
            </Link>
          </div>
        </div>
      </section>

      {/* Context note */}
      <section className="py-8 px-4 bg-amber-50 border-y border-amber-200">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Transparency note:</strong> This comparison is produced by QuoteXbert and reflects our understanding of HomeStars' platform as of 2026 based on publicly available information. HomeStars pricing and features may change. We encourage contractors to verify current HomeStars pricing directly at homestars.com before making any decision. We have tried to be fair and factual in this comparison.
          </p>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-8">Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="px-4 py-3 rounded-tl-xl w-1/4">Feature</th>
                  <th className="px-4 py-3 bg-[#800020] w-3/8">QuoteXbert</th>
                  <th className="px-4 py-3 rounded-tr-xl w-3/8">HomeStars</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="px-4 py-4 font-medium text-slate-900 border-b border-slate-100 align-top">
                      {row.feature}
                    </td>
                    <td className="px-4 py-4 border-b border-slate-100 bg-rose-50 align-top">
                      <div className="flex items-start gap-2">
                        {row.quotexbertWins ? (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400">—</span>
                        )}
                        <span className="text-slate-800">{row.quotexbert}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 border-b border-slate-100 align-top">
                      {row.homestars}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Honest assessment */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-6">
            Our Honest Assessment
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-green-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Where QuoteXbert Has an Advantage
              </h3>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li>Significantly lower monthly cost ($49–$149 vs $300–$600)</li>
                <li>Homeowners submit project photos and receive AI estimates before contacting contractors — reducing sticker-shock conversations</li>
                <li>No per-lead fees or charges beyond the monthly subscription</li>
                <li>Specific GTA, Toronto, and Durham Region focus</li>
                <li>Founding Contractor Program — early members lock in lower pricing permanently</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-amber-200">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-amber-500" />
                Where HomeStars Has an Advantage
              </h3>
              <ul className="space-y-3 text-slate-700 text-sm">
                <li>Larger established homeowner user base with longer market history</li>
                <li>More accumulated reviews and contractor profiles</li>
                <li>National coverage beyond the GTA and Ontario</li>
                <li>More widespread brand recognition among homeowners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="QuoteXbert vs HomeStars — Common Questions" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">Related Pages</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Contractor Leads Hub" },
              { href: "/contractor-lead-generation-canada", label: "Lead Generation in Canada" },
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
