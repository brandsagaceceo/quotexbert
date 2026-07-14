import { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";

export const metadata: Metadata = {
  title: "Contractor Lead Generation in Canada | Find Renovation Leads | QuoteXbert",
  description:
    "A practical guide to contractor lead generation in Canada — covering platforms, methods, and how QuoteXbert delivers verified renovation leads to Ontario contractors.",
  alternates: { canonical: "https://www.quotexbert.com/contractor-lead-generation-canada" },
  openGraph: {
    title: "Contractor Lead Generation in Canada | QuoteXbert",
    description: "How Canadian contractors find and convert renovation leads. Platform comparison and practical advice.",
    url: "https://www.quotexbert.com/contractor-lead-generation-canada",
    type: "website",
  },
};

const METHODS = [
  {
    title: "Lead Generation Platforms",
    description: "Platforms like QuoteXbert, HomeStars, and Houzz connect contractors with homeowners seeking quotes. These vary significantly by pricing model (subscription vs per-lead), geographic focus, and lead quality.",
    pros: ["Consistent lead volume", "Homeowners are actively looking for contractors", "Reviews build long-term visibility"],
    cons: ["Monthly costs", "Competition with other contractors on the same platform"],
  },
  {
    title: "Google Business Profile",
    description: "A free Google Business Profile listing allows homeowners searching for contractors near them to find your business directly in Google Maps and local search results.",
    pros: ["Free listing", "High intent search traffic", "Reviews visible in Google Search"],
    cons: ["Requires active management", "Takes time to accumulate reviews"],
  },
  {
    title: "Word of Mouth and Referrals",
    description: "In Canada, word of mouth remains the most trusted source of contractor recommendations. Many established contractors get the majority of their work through referrals.",
    pros: ["Highest trust factor", "No direct advertising cost", "Best conversion rates"],
    cons: ["Slow to build initially", "Unpredictable volume"],
  },
  {
    title: "Social Media (Instagram, Facebook)",
    description: "Renovation contractors with strong before-and-after photo content find Instagram and Facebook effective for generating awareness and inbound leads.",
    pros: ["Visual medium suits renovation work", "Organic reach possible", "Builds brand recognition"],
    cons: ["Requires consistent content creation", "Paid ads needed for meaningful reach"],
  },
  {
    title: "Pay-Per-Lead Services",
    description: "Some services charge a fee for each lead provided. Lead quality and exclusivity vary significantly — some services sell the same lead to multiple contractors.",
    pros: ["No upfront commitment", "Pay only for leads"],
    cons: ["Costs can escalate quickly", "Many shared/low-quality leads", "No project context before paying"],
  },
];

const FAQS = [
  {
    question: "What is the best way to get contractor leads in Canada?",
    answer:
      "Most established contractors rely on a combination of methods: a strong referral network built through satisfied clients, a Google Business Profile for local search visibility, and a lead generation platform for consistent new client acquisition. QuoteXbert is specifically focused on the Ontario market and includes AI homeowner pre-qualification that reduces unqualified inquiries.",
  },
  {
    question: "How much should a Canadian contractor spend on lead generation?",
    answer:
      "Marketing costs for contractors typically range from 3% to 8% of annual revenue. A contractor billing $200,000 per year might spend $6,000–$16,000 annually on lead generation. A QuoteXbert subscription ($49–$149/month = $588–$1,788/year) represents a low-cost entry point for consistent digital lead generation.",
  },
  {
    question: "Are pay-per-lead services worth it in Canada?",
    answer:
      "Pay-per-lead services can work but carry hidden costs: leads are often sold to multiple contractors simultaneously (creating immediate competition), and there's typically no project context before purchasing the lead. Contractors on subscription-based platforms like QuoteXbert pay a flat monthly fee and receive leads with project photos and details attached.",
  },
  {
    question: "Is Google effective for contractor lead generation in Canada?",
    answer:
      "Yes. A well-maintained Google Business Profile with genuine reviews is one of the most effective long-term lead generation tools for local contractors. 'Contractor near me' and '[trade] in [city]' searches drive high-intent traffic directly to businesses with strong local profiles.",
  },
  {
    question: "How do I generate contractor leads in Ontario specifically?",
    answer:
      "Ontario contractors benefit from platforms with specific Ontario/GTA focus (like QuoteXbert), maintaining a Google Business Profile with Ontario service areas listed, joining the Ontario Home Builders' Association or RenoMark program for credibility, and building a referral network within the local community.",
  },
];

export default function ContractorLeadGenerationCanadaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-slate-400 text-xs mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            {" / "}
            <Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link>
            {" / "}
            <span className="text-slate-300">Lead Generation Canada</span>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-4">
            Contractor Business Growth · Canada
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5">
            Contractor Lead Generation in Canada
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mb-8 leading-relaxed">
            A practical overview of how Canadian contractors find renovation leads — comparing platforms, organic methods, and referral strategies.
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
              View Contractor Leads
            </Link>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-3">
            Lead Generation Methods for Canadian Contractors
          </h2>
          <p className="text-slate-600 mb-10 text-lg">
            Most successful contractors combine multiple lead sources. Here's an honest look at each method.
          </p>
          <div className="space-y-8">
            {METHODS.map((method) => (
              <div key={method.title} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                <p className="text-slate-700 mb-4 leading-relaxed">{method.description}</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 text-sm mb-2">Advantages</h4>
                    <ul className="space-y-1">
                      {method.pros.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-slate-600 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-700 text-sm mb-2">Considerations</h4>
                    <ul className="space-y-1">
                      {method.cons.map((c) => (
                        <li key={c} className="flex items-start gap-2 text-slate-600 text-sm">
                          <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500 font-bold">—</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QuoteXbert section */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-5">
            How QuoteXbert Fits into Your Lead Generation Strategy
          </h2>
          <p className="text-slate-700 text-lg leading-relaxed mb-6">
            QuoteXbert is a lead generation platform focused specifically on the Ontario renovation market. It differs from most lead platforms in one important way: homeowners receive AI-powered cost estimates before they contact contractors. This means the homeowners who reach out through QuoteXbert have already reviewed a realistic cost range for their project.
          </p>
          <p className="text-slate-700 leading-relaxed mb-6">
            This pre-qualification step reduces the fraction of inquiries where homeowners are surprised by market-rate pricing — a common source of wasted time for contractors. It doesn't eliminate all mismatched expectations, but it meaningfully improves lead quality compared to platforms with no pre-qualification step.
          </p>
          <p className="text-slate-700 leading-relaxed">
            For Ontario contractors serving the GTA, Toronto, and Durham Region, QuoteXbert is one component of a broader lead generation approach that should also include Google Business Profile optimization, a strong referral system, and trade-specific platforms where relevant.
          </p>
        </div>
      </section>

      <FoundingContractorSection compact />

      <FAQSection faqs={FAQS} title="Lead Generation Questions — Canadian Contractors" />

      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">Related Resources</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { href: "/contractor-leads", label: "Ontario Contractor Leads Hub" },
              { href: "/homestars-alternative", label: "HomeStars Alternative" },
              { href: "/pay-per-lead-alternative", label: "Pay-Per-Lead Alternative" },
              { href: "/how-to-get-contractor-leads", label: "How to Get More Leads" },
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
