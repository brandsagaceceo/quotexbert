import Link from "next/link";
import { CheckCircle } from "lucide-react";
import FoundingContractorSection from "@/components/FoundingContractorSection";
import FAQSection from "@/components/seo/FAQSection";
import { FOUNDING_CONTRACTOR_CONFIG } from "@/lib/founding-contractor-config";
import {
  CityLeadData,
  TradeLeadData,
  CityTradeComboData,
  CONTRACTOR_CITIES,
  CONTRACTOR_TRADES,
} from "@/lib/seo/contractor-acquisition-data";

// ─── Shared sub-components ────────────────────────────────────────────────────

function HeroSection({
  eyebrow,
  h1,
  intro,
  stats,
}: {
  eyebrow: string;
  h1: string;
  intro: string;
  stats: Array<{ label: string; value: string }>;
}) {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#600018] text-white py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-slate-400 text-xs mb-4">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link href="/contractor-leads" className="hover:text-white transition-colors">Contractor Leads</Link></li>
            {eyebrow !== "Contractor Leads · Ontario" && (
              <>
                <li aria-hidden>/</li>
                <li className="text-slate-300">{eyebrow}</li>
              </>
            )}
          </ol>
        </nav>

        <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-3">
          {eyebrow}
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-5 leading-tight">{h1}</h1>
        <p className="text-slate-300 text-lg md:text-xl max-w-3xl mb-8 leading-relaxed">
          {intro}
        </p>

        {stats.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-5 py-3 text-center"
              >
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/sign-up?role=contractor"
            className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#600018] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-base"
          >
            Claim My Founding Contractor Spot →
          </Link>
          <Link
            href="/contractor-leads"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-base"
          >
            View All Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

function SpotsBanner() {
  const { spotsRemaining, spotsTotal } = FOUNDING_CONTRACTOR_CONFIG;
  const fillPct = Math.round(((spotsTotal - spotsRemaining) / spotsTotal) * 100);
  return (
    <div className="bg-[#800020] text-white py-3 px-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-semibold">
          🚨 <strong>{spotsRemaining} Founding Contractor spots</strong> remaining — lock in discounted pricing for life.
        </p>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${fillPct}%` }} />
          </div>
          <Link
            href="/sign-up?role=contractor"
            className="text-xs font-bold bg-white text-[#800020] px-4 py-1.5 rounded-full hover:bg-yellow-50 transition-colors whitespace-nowrap"
          >
            Claim Spot
          </Link>
        </div>
      </div>
    </div>
  );
}

function CTABox({ label = "Claim My Founding Contractor Spot" }: { label?: string }) {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-black mb-3">Ready to Start Receiving Leads?</h3>
      <p className="text-slate-300 mb-6 text-base">
        Join QuoteXbert — only <strong className="text-yellow-300">{FOUNDING_CONTRACTOR_CONFIG.spotsRemaining}</strong> founding spots remain.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/sign-up?role=contractor"
          className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#a0002a] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg"
        >
          {label}
        </Link>
        <Link
          href="/contractor-leads"
          className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
        >
          View Contractor Opportunities
        </Link>
      </div>
    </div>
  );
}

// ─── City Page Template ───────────────────────────────────────────────────────

interface CityPageProps {
  data: CityLeadData;
}

export function CityLeadPageTemplate({ data }: CityPageProps) {
  const nearbyTrades = CONTRACTOR_TRADES.filter((t) =>
    data.topTrades.includes(t.slug)
  );
  const otherCities = CONTRACTOR_CITIES.filter((c) => c.slug !== data.slug).slice(0, 8);

  return (
    <>
      <SpotsBanner />

      <HeroSection
        eyebrow={`Contractor Leads · ${data.region}`}
        h1={data.h1}
        intro={data.intro}
        stats={[
          { label: "Avg Project Value", value: data.avgProjectValue },
          { label: "Population", value: data.population },
          { label: "Avg Home Value", value: data.avgHome },
          { label: "Region", value: data.region },
        ]}
      />

      {/* Local context */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                Renovation Demand in {data.name}
              </h2>
              <p className="text-slate-700 mb-5 leading-relaxed">{data.housingNotes}</p>
              <ul className="space-y-3">
                {data.renovationDemand.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                Why Contractors Choose {data.name}
              </h2>
              <p className="text-slate-700 mb-5 leading-relaxed">
                {data.opportunitiesParagraph}
              </p>
              <p className="text-slate-700 leading-relaxed">{data.localContext}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby areas */}
      <section className="py-10 px-4 bg-slate-50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">
            Communities Served Near {data.name}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.nearbyAreas.map((area) => (
              <span
                key={area}
                className="bg-white border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-full"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Top trade links */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Top Trades in {data.name}
          </h2>
          <p className="text-slate-600 mb-8">
            Find trade-specific contractor opportunities in {data.name} and surrounding areas.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {nearbyTrades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/contractor-leads/trades/${trade.slug}`}
                className="group border border-slate-200 rounded-xl p-5 hover:border-rose-400 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-rose-700 transition-colors mb-1">
                  {trade.name}
                </h3>
                <p className="text-slate-500 text-sm">
                  Avg project: {trade.avgProjectValue}
                </p>
                <span className="text-rose-600 text-xs font-semibold mt-2 inline-block group-hover:underline">
                  View {trade.name} Leads →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founding contractor program */}
      <FoundingContractorSection compact />

      {/* Other cities */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-black text-slate-900 mb-5">
            Contractor Leads in Other Ontario Cities
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {otherCities.map((city) => (
              <Link
                key={city.slug}
                href={`/contractor-leads/${city.slug}`}
                className="text-sm font-medium text-slate-700 hover:text-rose-700 hover:underline transition-colors py-1"
              >
                Leads in {city.name} →
              </Link>
            ))}
            <Link
              href="/contractor-leads"
              className="text-sm font-bold text-rose-700 hover:underline transition-colors py-1"
            >
              View All Cities →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={`FAQs — Contractor Leads in ${data.name}`} />

      {/* Final CTA */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <CTABox label="Claim My Founding Contractor Spot" />
        </div>
      </section>
    </>
  );
}

// ─── Trade Page Template ──────────────────────────────────────────────────────

interface TradePageProps {
  data: TradeLeadData;
}

export function TradeLeadPageTemplate({ data }: TradePageProps) {
  const topCityData = CONTRACTOR_CITIES.filter((c) =>
    data.topCities.includes(c.slug)
  );
  const relatedTradeData = CONTRACTOR_TRADES.filter((t) =>
    data.relatedTrades.includes(t.slug)
  );

  return (
    <>
      <SpotsBanner />

      <HeroSection
        eyebrow={`Contractor Leads · ${data.name}`}
        h1={data.h1}
        intro={data.intro}
        stats={[
          { label: "Avg Project Value", value: data.avgProjectValue },
          { label: "Top Market", value: "Toronto & GTA" },
          { label: "Coverage", value: "Ontario-wide" },
        ]}
      />

      {/* Job description + how it works */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                Types of {data.name} Jobs Available
              </h2>
              <p className="text-slate-700 mb-6 leading-relaxed">{data.jobDescription}</p>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Demand Drivers</h3>
              <ul className="space-y-2">
                {data.demandFactors.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                How QuoteXbert Works for {data.name}
              </h2>
              <p className="text-slate-700 mb-5 leading-relaxed">{data.howToGetLeads}</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-3">Qualifications & Licensing</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{data.licenseInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Typical jobs table */}
      <section className="py-10 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Typical {data.singularName} Projects
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 text-white text-left">
                  <th className="px-4 py-3 rounded-tl-xl">Project Type</th>
                  <th className="px-4 py-3">Typical Price Range</th>
                  <th className="px-4 py-3 rounded-tr-xl">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.typicalJobs.map((job, i) => (
                  <tr
                    key={job.title}
                    className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 border-b border-slate-100">
                      {job.title}
                    </td>
                    <td className="px-4 py-3 text-rose-700 font-semibold border-b border-slate-100">
                      {job.priceRange}
                    </td>
                    <td className="px-4 py-3 text-slate-500 border-b border-slate-100">
                      {job.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top cities for this trade */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Top Cities for {data.name}
          </h2>
          <p className="text-slate-600 mb-8">
            Find {data.singularName.toLowerCase()} opportunities in specific Ontario cities.
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {topCityData.map((city) => (
              <Link
                key={city.slug}
                href={`/contractor-leads/${city.slug}`}
                className="group border border-slate-200 rounded-xl p-5 hover:border-rose-400 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-slate-900 group-hover:text-rose-700 transition-colors mb-1">
                  {city.name}
                </h3>
                <p className="text-slate-500 text-sm">
                  Avg project: {city.avgProjectValue}
                </p>
                <span className="text-rose-600 text-xs font-semibold mt-2 inline-block group-hover:underline">
                  {data.singularName} Leads in {city.name} →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Founding contractor program */}
      <FoundingContractorSection compact />

      {/* Related trades */}
      {relatedTradeData.length > 0 && (
        <section className="py-14 px-4 bg-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-black text-slate-900 mb-5">Related Trade Leads</h2>
            <div className="flex flex-wrap gap-3">
              {relatedTradeData.map((t) => (
                <Link
                  key={t.slug}
                  href={`/contractor-leads/trades/${t.slug}`}
                  className="border border-slate-200 rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-rose-400 hover:text-rose-700 transition-colors"
                >
                  {t.name} →
                </Link>
              ))}
              <Link
                href="/contractor-leads"
                className="border border-rose-300 rounded-full px-5 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
              >
                All Contractor Leads →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQSection faqs={data.faqs} title={`FAQs — ${data.name} Leads in Ontario`} />

      {/* Final CTA */}
      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <CTABox label={`Join as a ${data.singularName}`} />
        </div>
      </section>
    </>
  );
}

// ─── City + Trade Combo Template ──────────────────────────────────────────────

interface CityTradePageProps {
  combo: CityTradeComboData;
  cityData: CityLeadData;
  tradeData: TradeLeadData;
}

export function CityTradePageTemplate({ combo, cityData, tradeData }: CityTradePageProps) {
  return (
    <>
      <SpotsBanner />

      {/* Breadcrumb + hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#600018] text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-slate-400 text-xs mb-4">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li aria-hidden>/</li>
              <li><Link href="/contractor-leads" className="hover:text-white">Contractor Leads</Link></li>
              <li aria-hidden>/</li>
              <li><Link href={`/contractor-leads/${cityData.slug}`} className="hover:text-white">{cityData.name}</Link></li>
              <li aria-hidden>/</li>
              <li className="text-slate-300">{tradeData.name}</li>
            </ol>
          </nav>
          <p className="text-rose-400 text-xs font-bold uppercase tracking-widest mb-3">
            {tradeData.name} · {cityData.name}
          </p>
          <h1 className="text-3xl md:text-5xl font-black mb-5">{combo.h1}</h1>
          <p className="text-slate-300 text-lg max-w-3xl mb-8 leading-relaxed">{combo.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/sign-up?role=contractor"
              className="inline-flex items-center justify-center gap-2 bg-[#800020] hover:bg-[#600018] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg"
            >
              Claim My Founding Contractor Spot →
            </Link>
            <Link
              href={`/contractor-leads/${cityData.slug}`}
              className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              All {cityData.name} Leads
            </Link>
          </div>
        </div>
      </section>

      {/* Local opportunities */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                {tradeData.singularName} Opportunities in {cityData.name}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-5">{combo.localOpportunities}</p>
              <p className="text-slate-700 leading-relaxed">{cityData.localContext}</p>
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">
                How QuoteXbert Works
              </h2>
              <p className="text-slate-700 mb-5 leading-relaxed">{tradeData.howToGetLeads}</p>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h3 className="font-bold text-slate-900 mb-2">Licensing in Ontario</h3>
                <p className="text-slate-600 text-sm">{tradeData.licenseInfo}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example projects */}
      <section className="py-10 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            Example Projects in {cityData.name}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {combo.typicalJobs.map((job) => (
              <div
                key={job.title}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm"
              >
                <h3 className="font-bold text-slate-900 text-sm mb-2">{job.title}</h3>
                <p className="text-rose-700 font-black text-lg mb-1">{job.priceRange}</p>
                <p className="text-slate-500 text-xs">{job.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FoundingContractorSection compact />

      {/* Cross-links */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold text-slate-900 mb-4">
              More {tradeData.name} Leads
            </h3>
            <ul className="space-y-2">
              {CONTRACTOR_CITIES.filter((c) => c.slug !== cityData.slug)
                .slice(0, 5)
                .map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/contractor-leads/${c.slug}`}
                      className="text-sm text-rose-700 hover:underline"
                    >
                      {tradeData.singularName} Leads in {c.name} →
                    </Link>
                  </li>
                ))}
              <li>
                <Link href={`/contractor-leads/trades/${tradeData.slug}`} className="text-sm font-bold text-rose-700 hover:underline">
                  All {tradeData.singularName} Leads →
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-4">
              Other Trades in {cityData.name}
            </h3>
            <ul className="space-y-2">
              {CONTRACTOR_TRADES.filter((t) => cityData.topTrades.includes(t.slug) && t.slug !== tradeData.slug)
                .slice(0, 5)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/contractor-leads/trades/${t.slug}`}
                      className="text-sm text-rose-700 hover:underline"
                    >
                      {t.name} in {cityData.name} →
                    </Link>
                  </li>
                ))}
              <li>
                <Link href={`/contractor-leads/${cityData.slug}`} className="text-sm font-bold text-rose-700 hover:underline">
                  All {cityData.name} Contractor Leads →
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <FAQSection faqs={combo.faqs} title={`FAQs — ${tradeData.singularName} Leads in ${cityData.name}`} />

      <section className="py-14 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <CTABox label={`Become a Founding ${tradeData.singularName} Member`} />
        </div>
      </section>
    </>
  );
}
