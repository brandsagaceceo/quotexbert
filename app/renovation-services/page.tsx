import { Metadata } from "next";
import Link from "next/link";
import { SERVICES } from "@/lib/seo-data";

export const metadata: Metadata = {
  title: "Renovation Service Cost Guides – Toronto & GTA | QuoteXbert",
  description:
    "Browse renovation cost guides for every service in Toronto and the GTA. Get accurate pricing for kitchens, bathrooms, basements, roofs, and more.",
  keywords: [
    "renovation cost guides Toronto",
    "kitchen renovation cost",
    "bathroom renovation price GTA",
    "basement finishing cost Toronto",
    "renovation services Toronto",
  ],
  openGraph: {
    title: "Renovation Service Cost Guides – Toronto & GTA | QuoteXbert",
    description: "Real renovation prices for Toronto homeowners. Get an AI estimate in seconds.",
    url: "https://www.quotexbert.com/renovation-services",
    type: "website",
    siteName: "QuoteXbert",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "QuoteXbert Renovation Services" }],
  },
  alternates: { canonical: "https://www.quotexbert.com/renovation-services" },
};

export default function RenovationServicesIndex() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      <div className="max-w-5xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          Toronto Renovation Cost Guides – 2026
        </h1>
        <p className="text-xl text-slate-700 mb-12 max-w-3xl">
          Explore detailed pricing guides for every home renovation service in Toronto and the GTA. See real cost ranges, key factors, and get an instant AI estimate.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <Link
              key={service.slug}
              href={`/renovation-services/${service.slug}`}
              className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-400 hover:shadow-lg transition-all group"
            >
              <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 mb-2">
                {service.name}
              </h2>
              <p className="text-teal-700 font-semibold text-sm mb-2">
                From {service.priceRanges[0]?.range ?? "varies"}
              </p>
              <p className="text-slate-500 text-sm line-clamp-2">{service.intro}</p>
              <span className="mt-4 inline-block text-sm text-teal-600 group-hover:text-teal-700 font-medium">
                See full cost guide →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Get an Instant AI Estimate</h2>
          <p className="text-lg mb-6 opacity-95">
            Upload a photo of your renovation space and receive a personalized AI price estimate—free, fast, and accurate.
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
