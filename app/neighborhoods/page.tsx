import { Metadata } from "next";
import Link from "next/link";
import { NEIGHBORHOODS } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Toronto Neighbourhood Renovation Guides | QuoteXbert",
  description:
    "Find trusted renovation contractors in every Toronto neighbourhood. See local pricing, popular projects, and get an instant AI estimate for your renovation.",
  keywords: [
    "Toronto neighbourhood contractors",
    "renovation contractors Toronto",
    "Leslieville contractors",
    "East York renovation",
    "Scarborough contractors",
  ],
  openGraph: {
    title: "Toronto Neighbourhood Renovation Guides | QuoteXbert",
    description: "Find contractors and renovation prices for every Toronto neighbourhood.",
    url: "https://www.quotexbert.com/neighborhoods",
    type: "website",
    siteName: "QuoteXbert",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "QuoteXbert Toronto Neighbourhoods" }],
  },
  alternates: { canonical: "https://www.quotexbert.com/neighborhoods" },
};

export default function NeighborhoodsIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Toronto Neighbourhood Renovation Guides
        </h1>
        <p className="text-xl text-slate-700 mb-12 max-w-3xl">
          Browse renovation cost guides and find trusted contractors for every Toronto neighbourhood. Get an instant AI estimate tailored to your area.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {NEIGHBORHOODS.map((hood) => (
            <Link
              key={hood.slug}
              href={`/neighborhoods/${hood.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-400 hover:shadow-lg transition-all group"
            >
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 mb-1">
                {hood.name}
              </h2>
              <p className="text-sm text-slate-500 mb-3">{hood.borough}</p>
              <p className="text-teal-700 font-semibold text-sm">
                Avg. renovation: {hood.avgCost}
              </p>
              <p className="text-xs text-slate-400 mt-2 mb-4">{hood.renovationDemand}</p>
              <span className="inline-block text-sm text-teal-600 group-hover:text-teal-700 font-medium">
                Find contractors →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Get a Free AI Renovation Estimate</h2>
          <p className="text-lg mb-6 opacity-95">
            Upload a photo of your project from any Toronto neighbourhood and receive an instant, accurate estimate.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
          >
            📸 Upload Photo & Get Estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
