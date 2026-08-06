"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { trackContractorJoinClicked } from "@/lib/tracking";

// Canonical contractor subscription route — the SAME page the job-board
// "Unlock" buttons use, which renders the category-selection modal before
// Stripe Checkout. Every subscription CTA must funnel here.
const CANONICAL_ROUTE = "/contractor/subscriptions";

type CanonicalTier = "handyman" | "renovation" | "general";

// Map every historical tier id/name to the three canonical tier ids used by
// the subscriptions page and the checkout API (handyman | renovation | general).
function toCanonicalTier(tier: string): CanonicalTier {
  const t = tier.toLowerCase();
  if (t.includes("handyman")) return "handyman";
  if (t.includes("renovation") || t.includes("xbert")) return "renovation";
  return "general";
}

interface ContractorPlanCTAProps {
  tier: string;
  label: string;
  className?: string;
  /** Optional analytics source label */
  source?: string;
}

/**
 * Auth-aware subscription CTA.
 * - Signed-in contractors go straight to the canonical category-selection page
 *   with the chosen tier preserved (?tier=...).
 * - Everyone else signs up first; the intended tier destination is stashed so
 *   onboarding can continue them into the same canonical flow afterward.
 */
export default function ContractorPlanCTA({ tier, label, className, source }: ContractorPlanCTAProps) {
  const { authUser, isSignedIn } = useAuth();
  const canonicalTier = toCanonicalTier(tier);
  const destination = `${CANONICAL_ROUTE}?tier=${canonicalTier}`;

  const isContractor = isSignedIn && authUser?.role === "contractor";
  const href = isContractor ? destination : "/sign-up?role=contractor";

  const handleClick = () => {
    if (source) trackContractorJoinClicked(source);
    // Preserve the tier destination through sign-up + onboarding for new users.
    if (!isContractor && typeof window !== "undefined") {
      try {
        localStorage.setItem("post_auth_redirect", destination);
      } catch {
        /* ignore storage errors */
      }
    }
  };

  return (
    <Link href={href} onClick={handleClick} data-source={source} className={className}>
      {label}
    </Link>
  );
}
