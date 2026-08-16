"use client";

import Link from "next/link";
import { FOUNDING_CONTRACTOR_CONFIG, FOUNDING_OFFER_ENABLED } from "@/lib/founding-contractor-config";

const {
  programName,
  ctaHref,
} = FOUNDING_CONTRACTOR_CONFIG;

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
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
            Contractor Intro Offer
          </span>
        </div>

        <h2
          className={`text-center font-black text-white mb-3 ${
            compact ? "text-2xl md:text-3xl" : "text-3xl md:text-4xl"
          }`}
        >
          First month only <span className="text-yellow-300">$0.99</span>
        </h2>
        <p className="text-center text-white/75 text-sm md:text-base max-w-2xl mx-auto mb-7 leading-relaxed">
          Choose your contractor plan and get your first eligible month for 99¢.
          After the first month, your subscription renews at the regular monthly
          price for the selected plan.
        </p>

        <div className={`mx-auto ${compact ? "max-w-2xl" : "max-w-3xl"}`}>
          <div className="grid sm:grid-cols-2 gap-3 mb-5">
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
                First eligible month
              </p>
              <p className="text-yellow-300 text-2xl font-black">$0.99</p>
            </div>
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">
                After the first month
              </p>
              <p className="text-white text-base font-bold">Regular selected plan price</p>
            </div>
          </div>
          <p className="text-center text-white/65 text-xs mb-5">
            Available to eligible first-time contractor subscribers. Recurring
            billing continues at the selected plan&apos;s regular monthly price unless cancelled.
          </p>
          <Link
            href={ctaHref}
            className="group flex items-center justify-center gap-2 bg-white text-[#800020] font-black text-base py-3 px-5 rounded-lg hover:bg-yellow-50 active:scale-[0.98] transition-all shadow-2xl ring-2 ring-white/20 hover:ring-yellow-300/50"
          >
            Choose a Contractor Plan
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
