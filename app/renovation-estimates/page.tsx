import { Metadata } from "next";
import Link from "next/link";
import { CITIES } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Renovation Estimates Across Toronto & GTA | QuoteXbert",
  description:
    "Get instant AI-powered renovation estimates for any city in Toronto and the Greater Toronto Area. Compare local prices, find trusted contractors, and plan your project.",
  keywords: [
    "renovation estimates Toronto",
    "GTA renovation cost",
    "home renovation quotes Toronto",
    "renovation prices GTA",
    "AI renovation estimate",
  ],
  openGraph: {
    title: "Renovation Estimates Across Toronto & GTA | QuoteXbert",
    description:
      "See real renovation prices for your city. Upload a photo, get an AI estimate instantly.",
    url: "https://www.quotexbert.com/renovation-estimates",
    type: "website",
    siteName: "QuoteXbert",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "QuoteXbert Renovation Estimates" }],
  },
  alternates: { canonical: "https://www.quotexbert.com/renovation-estimates" },
};

export default function RenovationEstimatesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Renovation Estimates by City – Toronto & GTA
        </h1>
        <p className="text-xl text-slate-700 mb-12 max-w-3xl">
          Select your city below to see local renovation cost ranges, average prices, and get an instant AI-powered estimate for your project.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CITIES.map((city) => (
            <Link
              key={city.slug}
              href={`/renovation-estimates/${city.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-400 hover:shadow-lg transition-all group"
            >
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 mb-1">
                {city.name}
              </h2>
              <p className="text-sm text-slate-500 mb-3">{city.region}</p>
              <p className="text-teal-700 font-semibold text-sm">
                Avg. renovation: {city.avgRenovationCost}
              </p>
              <span className="mt-4 inline-block text-sm text-teal-600 group-hover:text-teal-700 font-medium">
                View pricing guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Not sure where to start?</h2>
          <p className="text-lg mb-6 opacity-95">
            Upload a photo of your project and get an instant AI renovation estimate—no matter where you are in the GTA.
          </p>
          <Link
            href="/"
            className="inline-block bg-white text-teal-700 font-bold px-8 py-4 rounded-xl hover:bg-teal-50 transition-colors shadow-lg"
          >
            📸 Get My Free Estimate
          </Link>
        </div>
      </div>
    </div>
  );
}
