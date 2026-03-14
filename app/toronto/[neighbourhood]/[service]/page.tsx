import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  TORONTO_NEIGHBOURHOODS,
  TORONTO_SERVICES,
  NEIGHBOURHOOD_MAP,
  SERVICE_MAP,
  getTorontoPinpointParams,
} from "@/lib/seo/toronto-pinpoint";
import { MapPin, CheckCircle, ArrowRight, DollarSign, Star, Clock, Phone } from "lucide-react";

// Static generation: all 52 neighbourhoods × 16 services = 832 pages
export async function generateStaticParams() {
  return getTorontoPinpointParams();
}

interface Props {
  params: Promise<{ neighbourhood: string; service: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { neighbourhood: nSlug, service: sSlug } = await params;
  const n = NEIGHBOURHOOD_MAP[nSlug];
  const s = SERVICE_MAP[sSlug];
  if (!n || !s) return {};

  const title = `${s.name} in ${n.name}, Toronto (2026) | Free Quotes — QuoteXbert`;
  const description = `Looking for a ${s.name.toLowerCase()} contractor in ${n.name}, Toronto? Get free AI-powered quotes from verified local contractors. Average cost: ${s.avgCostLow}–${s.avgCostHigh}. Compare bids and save.`;
  const url = `https://www.quotexbert.com/toronto/${nSlug}/${sSlug}`;

  return {
    title,
    description,
    keywords: [
      `${s.shortName.toLowerCase()} ${n.name.toLowerCase()} toronto`,
      `${s.shortName.toLowerCase()} contractor ${n.name.toLowerCase()}`,
      `${n.name.toLowerCase()} ${s.name.toLowerCase()}`,
      `${s.name.toLowerCase()} quote ${n.name.toLowerCase()}`,
      `${s.name.toLowerCase()} cost ${n.name.toLowerCase()} toronto`,
      `best ${s.shortName.toLowerCase()} contractor ${n.name.toLowerCase()}`,
      `${s.name.toLowerCase()} near me ${n.name.toLowerCase()}`,
      `${n.district.toLowerCase()} ${s.name.toLowerCase()}`,
      "toronto renovation quote",
      "renovation contractor toronto",
      ...s.keywords,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: "QuoteXbert",
      type: "website",
      locale: "en_CA",
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TorontoNeighbourhoodServicePage({ params }: Props) {
  const { neighbourhood: nSlug, service: sSlug } = await params;
  const n = NEIGHBOURHOOD_MAP[nSlug];
  const s = SERVICE_MAP[sSlug];

  if (!n || !s) return notFound();

  const relatedServices = TORONTO_SERVICES.filter((sv) => sv.slug !== sSlug).slice(0, 5);
  const nearbyWithLinks = n.nearbyAreas.slice(0, 4);

  const faqs = [
    {
      q: `How much does ${s.name.toLowerCase()} cost in ${n.name}, Toronto?`,
      a: `${s.name} in ${n.name} typically costs between ${s.avgCostLow} and ${s.avgCostHigh} depending on scope, materials, and the specific contractor. ${n.district} labour rates are ${n.district === "Yorkville" || n.district === "Rosedale" || n.district === "Forest Hill" ? "slightly above the Toronto average due to premium expectations in this neighbourhood" : "close to the Toronto average"}. Use QuoteXbert to get free accurate quotes from verified local contractors.`,
    },
    {
      q: `How do I find a reliable ${s.shortName.toLowerCase()} contractor in ${n.name}?`,
      a: `The easiest way is through QuoteXbert — post your project details, and verified ${n.name} contractors will respond with quotes within hours. All contractors on QuoteXbert are verified for licence, insurance, and WSIB coverage. You can compare bids, read reviews, and see portfolio photos before deciding.`,
    },
    {
      q: `How long does a ${s.name.toLowerCase()} take in ${n.name}?`,
      a: `Timeline depends on the project scope. A standard ${s.shortName.toLowerCase()} project in ${n.name} typically takes ${
        s.slug === "kitchen-renovation"
          ? "3–6 weeks"
          : s.slug === "bathroom-renovation"
          ? "1–3 weeks"
          : s.slug === "basement-finishing"
          ? "4–8 weeks"
          : s.slug === "roofing"
          ? "1–3 days"
          : s.slug === "home-addition"
          ? "2–6 months"
          : "1–4 weeks"
      }. Permit timelines through the City of Toronto can add 2–6 weeks for larger projects.`,
    },
    {
      q: `Do I need a permit for ${s.name.toLowerCase()} in ${n.name}?`,
      a: `Permit requirements depend on the scope of work. ${
        s.slug === "roofing" || s.slug === "painting" || s.slug === "flooring" || s.slug === "handyman"
          ? `${s.name} typically does not require a permit unless structural work is involved.`
          : s.slug === "home-addition" || s.slug === "basement-finishing"
          ? `${s.name} usually requires a building permit from the City of Toronto. Your contractor will handle permit applications for you.`
          : `For ${s.name.toLowerCase()} in ${n.name}, permits may be required. Your QuoteXbert-verified contractor will advise and handle permit applications.`
      } ${n.name === "Lawrence Park" || n.name === "Rosedale" || n.name === "Forest Hill" || n.name === "Leslieville" || n.name === "Kensington Market" ? "Heritage designation on some streets in " + n.name + " may add additional approval requirements for exterior changes." : ""}`,
    },
    {
      q: `What should I look for in a ${n.name} ${s.shortName.toLowerCase()} contractor?`,
      a: `Look for: valid Ontario licence and insurance, active WSIB coverage, strong local reviews, and portfolio examples of similar ${s.name.toLowerCase()} projects in ${n.district}. QuoteXbert verifies all of these requirements before contractors can receive leads on the platform.`,
    },
  ];

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: `${s.name} in ${n.name} Toronto`,
            description: `${s.name} services for homeowners in ${n.name}, Toronto. Free quotes from verified contractors.`,
            provider: {
              "@type": "Organization",
              name: "QuoteXbert",
              url: "https://www.quotexbert.com",
            },
            areaServed: {
              "@type": "Place",
              name: `${n.name}, Toronto, Ontario, Canada`,
            },
            offers: {
              "@type": "AggregateOffer",
              lowPrice: s.avgCostLow.replace(/[$,]/g, ""),
              highPrice: s.avgCostHigh.replace(/[$,]/g, ""),
              priceCurrency: "CAD",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-brand text-white">
          <div className="max-w-5xl mx-auto px-4 py-14 md:py-20">
            {/* Breadcrumb */}
            <nav className="text-sm text-white/60 mb-6 flex items-center gap-1.5">
              <Link href="/" className="hover:text-white">Home</Link>
              <span>›</span>
              <Link href="/toronto" className="hover:text-white">Toronto</Link>
              <span>›</span>
              <span className="text-white/80">{n.name}</span>
              <span>›</span>
              <span className="text-white">{s.shortName}</span>
            </nav>

            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-5 h-5 text-rose-200 mt-1 flex-shrink-0" />
              <p className="text-rose-200 font-semibold text-sm uppercase tracking-wide">
                {n.name} · {n.district} · Toronto
              </p>
            </div>

            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              {s.name} in {n.name}, Toronto
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
              Get free quotes from verified {n.name} contractors for your {s.name.toLowerCase()} project.
              Compare bids, review portfolios, and hire with confidence.
            </p>

            {/* Cost range */}
            <div className="flex flex-wrap gap-4 mb-10">
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3">
                <div className="text-xs text-white/60 mb-1">Average Cost Range</div>
                <div className="text-xl font-black text-white">{s.avgCostLow} – {s.avgCostHigh}</div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3">
                <div className="text-xs text-white/60 mb-1">Area</div>
                <div className="text-xl font-black text-white">{n.district}</div>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-3">
                <div className="text-xs text-white/60 mb-1">Avg Home Value</div>
                <div className="text-xl font-black text-white">{n.avgHome}</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/create-lead"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-lg"
              >
                <Star className="w-5 h-5" />
                Get Free {s.shortName} Quotes
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
              >
                Compare Contractors
              </Link>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-brand/5 border-b border-brand/10 py-5">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              {[
                "✓ Free to post",
                "✓ Verified contractors",
                "✓ Compare multiple bids",
                "✓ No obligation",
                "✓ Toronto & GTA specialists",
              ].map((item) => (
                <span key={item} className="font-semibold text-brand">{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left — content */}
            <div className="lg:col-span-2 space-y-10">

              {/* About the neighbourhood */}
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-3">
                  {s.name} in {n.name}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">{n.description}</p>
                <p className="text-gray-700 leading-relaxed">{n.renovationNotes}</p>
              </section>

              {/* Cost breakdown */}
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4">
                  {s.name} Cost in {n.name} (2026)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-brand text-white">
                        <th className="text-left px-4 py-3 rounded-tl-lg">Project Scope</th>
                        <th className="text-right px-4 py-3 rounded-tr-lg">Estimated Cost (CAD)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { scope: `Basic ${s.shortName}`, cost: s.avgCostLow },
                        { scope: `Mid-Range ${s.shortName}`, cost: `${s.avgCostLow.replace(/[$,]/g, "")} – ${Math.round(parseInt(s.avgCostHigh.replace(/[$,]/g, "")) * 0.6).toLocaleString()}` },
                        { scope: `Full ${s.shortName} Renovation`, cost: s.avgCostHigh },
                        { scope: "Premium / Custom", cost: `${s.avgCostHigh}+` },
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-brand/5"}>
                          <td className="px-4 py-3 text-gray-800 font-medium border-b border-gray-100">{row.scope}</td>
                          <td className="px-4 py-3 text-right text-gray-900 font-bold border-b border-gray-100">${row.cost.replace(/^\$/, "")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Cost estimates based on {n.district}, Toronto 2026 rates. Final price depends on materials, scope, and contractor. Get firm quotes from local contractors on QuoteXbert.
                </p>
              </section>

              {/* Why QuoteXbert */}
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-5">
                  Why Use QuoteXbert for {s.name} in {n.name}?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      icon: <Star className="w-5 h-5" />,
                      title: "Verified Local Contractors",
                      desc: `All contractors are licensed, insured, and verified for ${n.district} and the City of Toronto.`,
                    },
                    {
                      icon: <DollarSign className="w-5 h-5" />,
                      title: "Compare Real Bids",
                      desc: "Post your project once and receive multiple quotes. See exactly what each contractor is offering.",
                    },
                    {
                      icon: <Clock className="w-5 h-5" />,
                      title: "Quotes Within Hours",
                      desc: `Active contractors in ${n.name} and ${n.district} respond quickly. Most projects receive 3+ bids within 24 hrs.`,
                    },
                    {
                      icon: <CheckCircle className="w-5 h-5" />,
                      title: "AI Estimate First",
                      desc: `Get an instant AI estimate before posting so you know what's reasonable for ${n.name} before a contractor arrives.`,
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-3 p-4 bg-brand/5 border border-brand/15 rounded-xl">
                      <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center text-white flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{item.title}</div>
                        <div className="text-xs text-gray-600 mt-0.5 leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ */}
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-6">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-gray-50 px-5 py-4 font-bold text-gray-900 text-sm md:text-base">
                        {faq.q}
                      </div>
                      <div className="px-5 py-4 text-gray-700 text-sm leading-relaxed">
                        {faq.a}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Nearby areas */}
              <section>
                <h2 className="text-xl font-black text-gray-900 mb-4">
                  Also Serving Nearby Neighbourhoods
                </h2>
                <div className="flex flex-wrap gap-3">
                  {nearbyWithLinks.map((area) => {
                    const nearbySlug = area
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    return (
                      <Link
                        key={area}
                        href={`/toronto/${nearbySlug}/${sSlug}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white border border-brand/30 text-brand text-sm font-semibold rounded-full hover:bg-brand hover:text-white transition-colors"
                      >
                        <MapPin className="w-3.5 h-3.5" /> {area}
                      </Link>
                    );
                  })}
                </div>
              </section>

            </div>

            {/* Right — CTA sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-5">
                {/* Main CTA card */}
                <div className="bg-brand text-white rounded-2xl p-6">
                  <h3 className="text-xl font-black mb-2">
                    Get {s.shortName} Quotes in {n.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">
                    Free, no-obligation quotes from verified {n.name} contractors. Post your project in under 2 minutes.
                  </p>
                  <Link
                    href="/create-lead"
                    className="block w-full text-center bg-white text-brand font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors mb-3"
                  >
                    Post Your Project →
                  </Link>
                  <Link
                    href="/ai-quote"
                    className="block w-full text-center bg-white/10 border border-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/20 transition-colors text-sm"
                  >
                    Try AI Estimate First
                  </Link>
                </div>

                {/* Cost fact box */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Cost Summary — {n.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold text-gray-900">{s.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area</span>
                      <span className="font-semibold text-gray-900">{n.name}, Toronto</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Cost</span>
                      <span className="font-bold text-brand">{s.avgCostLow}–{s.avgCostHigh}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Postal Area</span>
                      <span className="font-semibold text-gray-900">{n.postalPrefixes.join(", ")}</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Need Help?</h4>
                  <a
                    href="tel:9052429460"
                    className="flex items-center gap-2 text-brand font-bold text-sm hover:underline"
                  >
                    <Phone className="w-4 h-4" /> 905-242-9460
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Mon–Fri, 9 AM–6 PM EST</p>
                </div>

                {/* Related services */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm">Other Services in {n.name}</h4>
                  <div className="space-y-2">
                    {relatedServices.map((sv) => (
                      <Link
                        key={sv.slug}
                        href={`/toronto/${nSlug}/${sv.slug}`}
                        className="flex items-center justify-between gap-2 text-sm text-brand hover:bg-brand/5 px-2 py-1.5 rounded-lg transition-colors"
                      >
                        <span>{sv.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA banner */}
        <section className="bg-brand">
          <div className="max-w-4xl mx-auto px-4 py-14 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-black mb-3">
              Ready to Start Your {s.shortName} Project in {n.name}?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Post your project for free and receive quotes from verified {n.district} contractors today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create-lead"
                className="inline-flex items-center justify-center gap-2 bg-white text-brand font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-lg shadow-lg"
              >
                Get Free Quotes Now
              </Link>
              <Link
                href="/ai-quote"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
              >
                Try AI Estimate First
              </Link>
            </div>
          </div>
        </section>

        {/* All neighbourhoods footer nav */}
        <section className="bg-gray-50 border-t border-gray-200 py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
              {s.name} — All Toronto Neighbourhoods
            </h3>
            <div className="flex flex-wrap gap-2">
              {TORONTO_NEIGHBOURHOODS.map((nb) => (
                <Link
                  key={nb.slug}
                  href={`/toronto/${nb.slug}/${sSlug}`}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    nb.slug === nSlug
                      ? "bg-brand text-white border-brand font-bold"
                      : "bg-white text-gray-700 border-gray-200 hover:border-brand hover:text-brand"
                  }`}
                >
                  {nb.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
