import { Metadata } from "next";
import Link from "next/link";
import { CONTRACTOR_LEAD_TYPES } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Contractor Leads in Toronto & GTA – Find More Renovation Work | QuoteXbert",
  description:
    "Find renovation leads across Toronto and the GTA. QuoteXbert connects contractors with pre-qualified homeowners ready to hire. Browse leads by trade.",
  keywords: [
    "contractor leads Toronto",
    "renovation leads GTA",
    "find renovation work Toronto",
    "plumber leads Toronto",
    "electrician leads Toronto",
  ],
  openGraph: {
    title: "Contractor Leads in Toronto & GTA | QuoteXbert",
    description: "Pre-qualified renovation leads for contractors across Toronto and the GTA.",
    url: "https://www.quotexbert.com/contractor-leads",
    type: "website",
    siteName: "QuoteXbert",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "QuoteXbert Contractor Leads" }],
  },
  alternates: { canonical: "https://www.quotexbert.com/contractor-leads" },
};

export default function ContractorLeadsIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-cyan-900">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6">
          Contractor Leads in Toronto & GTA
        </h1>
        <p className="text-xl text-slate-300 mb-12 max-w-3xl">
          QuoteXbert connects skilled contractors with homeowners who are ready to renovate. Browse lead pages by trade and join the platform that's growing Toronto contractor businesses.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CONTRACTOR_LEAD_TYPES.map((lead) => (
            <Link
              key={lead.slug}
              href={`/contractor-leads/${lead.slug}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 hover:border-teal-400 transition-all group"
            >
              <h2 className="text-lg font-bold text-white group-hover:text-teal-300 mb-2">
                {lead.name}
              </h2>
              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{lead.headline}</p>
              <span className="text-sm text-teal-400 group-hover:text-teal-300 font-medium">
                See lead page →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-teal-500/20 border border-teal-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Getting Leads Today
          </h2>
          <p className="text-slate-300 text-lg mb-6">
            Create your free contractor profile and receive matched renovation leads from homeowners across the GTA.
          </p>
          <Link
            href="/sign-up"
            className="inline-block bg-teal-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-colors shadow-lg"
          >
            🚀 Join QuoteXbert Free
          </Link>
        </div>
      </div>
    </div>
  );
}
