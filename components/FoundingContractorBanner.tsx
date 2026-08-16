"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FOUNDING_CONTRACTOR_CONFIG, FOUNDING_OFFER_ENABLED } from "@/lib/founding-contractor-config";

const { ctaHref } = FOUNDING_CONTRACTOR_CONFIG;

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

  if (!FOUNDING_OFFER_ENABLED || !visible || dismissed) return null;

  return (
    <div
      className="
        fixed bottom-4 left-1/2 -translate-x-1/2 z-[9998]
        w-[calc(100%-2rem)] max-w-2xl
        bg-gradient-to-r from-[#800020] to-[#600018]
        rounded-xl shadow-xl border border-white/20
        px-4 py-3
        animate-slide-up
      "
      role="banner"
      aria-label="New Contractor Offer"
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
          <p className="text-white font-bold text-sm mb-1">
            New Contractor Offer — First month only $0.99
          </p>
          <p className="text-white/80 text-xs leading-snug">
            Offer available to eligible first-time contractor subscribers. Then regular monthly plan pricing applies.
          </p>
        </div>

        {/* CTA */}
        <Link
          href={ctaHref}
          className="
            flex-shrink-0
            bg-white text-[#800020] font-black text-sm
            px-4 py-2.5 rounded-lg
            hover:bg-yellow-50 active:scale-95
            transition-all shadow-lg
            whitespace-nowrap
          "
        >
          View Plans →
        </Link>
      </div>
    </div>
  );
}
