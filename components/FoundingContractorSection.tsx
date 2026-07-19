"use client";

import Link from "next/link";
import { FOUNDING_CONTRACTOR_CONFIG, FOUNDING_OFFER_ENABLED } from "@/lib/founding-contractor-config";

const {
  spotsRemaining,
  spotsTotal,
  programName,
  ctaHref,
} = FOUNDING_CONTRACTOR_CONFIG;

const BENEFITS = [
  { icon: "💰", text: "Lifetime discounted pricing" },
  { icon: "⚡", text: "Priority job notifications" },
  { icon: "🔝", text: "Higher placement in search results" },
  { icon: "🏅", text: "Founding Member badge on your profile" },
  { icon: "🤖", text: "Early access to AI features" },
  { icon: "🔒", text: "Lock your pricing forever" },
] as const;

const filledSpots = spotsTotal - spotsRemaining;
const fillPercent = Math.round((filledSpots / spotsTotal) * 100);

interface FoundingContractorSectionProps {
  /** Slim variant for embedding inside other sections */
  compact?: boolean;
}

export default function FoundingContractorSection({
  compact = false,
}: FoundingContractorSectionProps) {
  if (!FOUNDING_OFFER_ENABLED) return null;

  return (
    <section
      className={`relative overflow-hidden ${
        compact ? "py-8 px-4" : "py-12 md:py-14 px-4"
      } bg-gradient-to-br from-[#800020] via-[#6a001a] to-[#400010]`}
      aria-label={programName}
    >
      {/* Decorative background dots */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.04)_0%,transparent_50%)] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Eyebrow badge */}
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full animate-pulse-slow">
            🚨 Limited Time Offer
          </span>
        </div>

        {/* Heading */}
        <h2
          className={`text-center font-black text-white mb-3 ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
          }`}
        >
          Become a{" "}
          <span className="text-yellow-300">Founding Contractor</span>
        </h2>
        <p className="text-center text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-7">
          First month <span className="text-yellow-300 font-bold">$0.99</span>, then renews at your selected monthly plan price. Only{" "}
          <span className="text-yellow-300 font-bold">{spotsRemaining}</span> founding contractor spots remain. Cancel anytime.
        </p>

        <div
          className={`grid ${
            compact ? "gap-8" : "md:grid-cols-2 gap-10"
          } items-start`}
        >
          {/* Benefits list */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 md:p-6">
            <h3 className="text-white font-bold text-base mb-4">
              Founding Member Benefits
            </h3>
            <ul className="space-y-2.5">
              {BENEFITS.map((b) => (
                <li key={b.text} className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{b.icon}</span>
                  <span className="text-white/90 text-sm font-medium">
                    {b.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress bar + CTAs */}
          <div className="flex flex-col gap-4">
            {/* Progress card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 md:p-6">
              <h3 className="text-white font-bold text-base mb-1">
                Founding Contractor Spots Remaining
              </h3>
              <p className="text-white/60 text-xs mb-4">
                Once these spots are gone, founding pricing is gone forever.
              </p>

              {/* Progress bar */}
              <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${fillPercent}%` }}
                >
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">
                  <span className="text-white font-bold">{filledSpots}</span>{" "}
                  spots taken
                </span>
                <span className="text-yellow-300 font-bold text-base">
                  {spotsRemaining} / {spotsTotal} Remaining
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href={ctaHref}
                className="
                  group flex items-center justify-center gap-2
                  bg-white text-[#800020] font-black text-base
                  py-3 px-5 rounded-lg
                  hover:bg-yellow-50 active:scale-[0.98]
                  transition-all shadow-2xl
                  ring-2 ring-white/20 hover:ring-yellow-300/50
                "
              >
                Claim My Spot
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>

              <Link
                href={ctaHref}
                className="
                  flex items-center justify-center gap-2
                  bg-yellow-400 text-[#600018] font-black text-base
                  py-3 px-5 rounded-lg
                  hover:bg-yellow-300 active:scale-[0.98]
                  transition-all shadow-xl
                "
              >
                🔒 Lock In My Pricing
              </Link>

              <Link
                href={ctaHref}
                className="
                  flex items-center justify-center gap-2
                  border-2 border-white/30 text-white font-bold text-sm
                  py-2.5 px-5 rounded-lg
                  hover:bg-white/10 active:scale-[0.98]
                  transition-all
                "
              >
                Become a Founding Member
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
