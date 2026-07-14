import Link from "next/link";
import { FOUNDING_CONTRACTOR_CONFIG } from "@/lib/founding-contractor-config";
import { ALL_CITY_SLUGS, ALL_TRADE_SLUGS } from "@/lib/seo/contractor-acquisition-data";

interface ContractorLeadsBlockProps {
  /** Display city name, e.g. "Oshawa" */
  cityName: string;
  /** URL-safe city slug, e.g. "oshawa" — used to build /contractor-leads/[city] */
  citySlug: string;
  /** Renovation type name for natural copy, e.g. "Kitchen Renovation" */
  renoName?: string;
  /**
   * Trade slug from contractor-acquisition-data, e.g. "kitchen-renovation-contractors".
   * When provided and valid, a third contextual trade link is shown.
   */
  tradeSlug?: string;
}

/**
 * ContractorLeadsBlock
 * Reusable acquisition block inserted on renovation-cost pages.
 * Renders a contractor CTA with city-specific links where the city page exists.
 */
export default function ContractorLeadsBlock({
  cityName,
  citySlug,
  renoName,
  tradeSlug,
}: ContractorLeadsBlockProps) {
  const hasCityPage = ALL_CITY_SLUGS.includes(citySlug as (typeof ALL_CITY_SLUGS)[number]);
  const hasValidTrade = !!tradeSlug && ALL_TRADE_SLUGS.includes(tradeSlug as (typeof ALL_TRADE_SLUGS)[number]);

  const cityLeadsHref = hasCityPage
    ? `/contractor-leads/${citySlug}`
    : `/contractor-leads`;

  const cityLeadsLabel = hasCityPage
    ? `View Contractor Leads in ${cityName}`
    : `View Contractor Leads in Ontario`;

  const spotsRemaining = FOUNDING_CONTRACTOR_CONFIG.spotsRemaining;

  return (
    <section
      className="bg-gradient-to-br from-slate-900 via-[#400010] to-[#600018] rounded-2xl p-6 md:p-8 text-white"
      aria-label={`Contractor opportunities in ${cityName}`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
          🔨
        </div>
        <div>
          <p className="text-rose-300 text-xs font-bold uppercase tracking-widest mb-1">
            For Contractors
          </p>
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Are You a Contractor Serving {cityName}?
          </h2>
        </div>
      </div>

      <p className="text-white/80 leading-relaxed mb-5 text-sm md:text-base">
        QuoteXbert helps contractors discover homeowner renovation opportunities across{" "}
        {hasCityPage ? (
          <Link href={cityLeadsHref} className="text-yellow-300 font-semibold hover:underline">
            {cityName}
          </Link>
        ) : (
          <strong className="text-yellow-300">{cityName}</strong>
        )}{" "}
        and nearby communities. Create a contractor profile, select your trades and service areas,
        and view relevant local opportunities.{" "}
        {hasValidTrade && renoName && (
          <>
            <Link
              href={`/contractor-leads/trades/${tradeSlug}`}
              className="text-yellow-300 font-semibold hover:underline"
            >
              {renoName} contractors
            </Link>{" "}
            can receive matching leads directly.{" "}
          </>
        )}
        Only{" "}
        <strong className="text-yellow-300">{spotsRemaining} founding spots</strong> remain — join
        now to lock in discounted pricing for life.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/sign-up?role=contractor"
          className="inline-flex items-center justify-center gap-2 bg-white text-[#800020] font-black text-sm px-6 py-3 rounded-xl hover:bg-yellow-50 active:scale-[0.98] transition-all shadow-lg"
        >
          Claim My Founding Contractor Spot →
        </Link>
        <Link
          href={cityLeadsHref}
          className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
        >
          {cityLeadsLabel}
        </Link>
      </div>
    </section>
  );
}
