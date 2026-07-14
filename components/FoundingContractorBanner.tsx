"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FOUNDING_CONTRACTOR_CONFIG } from "@/lib/founding-contractor-config";

const { spotsRemaining, programName, ctaHref } = FOUNDING_CONTRACTOR_CONFIG;

export default function FoundingContractorBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Delay banner appearance slightly so it doesn't clash with page load
  useEffect(() => {
    const stored = sessionStorage.getItem("founding_banner_dismissed");
    if (stored) return;
    const t = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  if (!visible || dismissed) return null;

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]
        w-[calc(100%-2rem)] max-w-2xl
        bg-gradient-to-r from-[#800020] to-[#600018]
        rounded-2xl shadow-2xl border border-white/20
        px-5 py-4
        animate-slide-up
      "
      role="banner"
      aria-label="Founding Contractor Program"
    >
      {/* Dismiss button */}
      <button
        onClick={() => {
          setDismissed(true);
          sessionStorage.setItem("founding_banner_dismissed", "1");
        }}
        className="absolute top-2.5 right-3 text-white/60 hover:text-white text-xl leading-none transition-colors"
        aria-label="Dismiss"
      >
        ×
      </button>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Icon + text */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm flex items-center gap-1.5 mb-1">
            <span className="text-base">🚨</span>
            {programName}
          </p>
          <p className="text-white/80 text-xs leading-snug">
            Only{" "}
            <span className="font-bold text-white">{spotsRemaining} spots</span>{" "}
            remain for discounted founding memberships.{" "}
            <span className="text-yellow-300 font-semibold">
              Lock in your pricing for life.
            </span>
          </p>

          {/* Mini progress bar */}
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full animate-shimmer"
                style={{
                  width: `${
                    ((FOUNDING_CONTRACTOR_CONFIG.spotsTotal -
                      spotsRemaining) /
                      FOUNDING_CONTRACTOR_CONFIG.spotsTotal) *
                    100
                  }%`,
                }}
              />
            </div>
            <span className="text-white/70 text-xs whitespace-nowrap">
              {spotsRemaining} left
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="
            flex-shrink-0
            bg-white text-[#800020] font-black text-sm
            px-5 py-2.5 rounded-xl
            hover:bg-yellow-50 active:scale-95
            transition-all shadow-lg
            whitespace-nowrap
          "
        >
          Claim Your Spot →
        </Link>
      </div>
    </div>
  );
}
