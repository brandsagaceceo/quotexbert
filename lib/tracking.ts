/**
 * QuoteXbert Conversion Tracking
 *
 * Compatible with: Google Analytics 4, Google Ads (AW-17979635426),
 * Microsoft Clarity, and GTM dataLayer.
 *
 * Usage:
 *   import { trackEstimateStarted, trackEstimateCompleted } from "@/lib/tracking";
 *
 * Google Ads conversion tags:
 *   After each key conversion below you'll see a comment showing where to add
 *   your Google Ads send_to tag, e.g.:
 *     gtag('event', 'conversion', { send_to: 'AW-17979635426/XXXXXXXX' })
 */

type TrackParams = Record<string, string | number | boolean | undefined | null>;

const AW_ID = "AW-17979635426";

/** Core push — fires GA4 event + GTM dataLayer + Clarity custom tag */
export function track(eventName: string, params: TrackParams = {}): void {
  if (typeof window === "undefined") return;
  const w = window as any;

  // GA4 / Google Ads
  w.gtag?.("event", eventName, params);

  // GTM dataLayer fallback
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: eventName, ...params });

  // Microsoft Clarity custom event tag
  w.clarity?.("set", eventName, "true");
}

/** Fire a Google Ads conversion with optional revenue value */
function adsConversion(label: string, value?: number): void {
  if (typeof window === "undefined") return;
  (window as any).gtag?.("event", "conversion", {
    send_to: `${AW_ID}/${label}`,
    ...(value !== undefined ? { value, currency: "CAD" } : {}),
  });
}

// ── Estimate flow ────────────────────────────────────────────────────────────

/**
 * User starts interacting with the estimator (types, uploads, or focuses field).
 * Fire once per session / per tool open.
 */
export const trackEstimateStarted = (source: string = "homepage"): void =>
  track("estimate_started", { source, event_category: "conversion" });

/**
 * User presses the "Get Estimate" / submit button.
 */
export const trackEstimateSubmitted = (source: string = "homepage"): void =>
  track("estimate_submitted", { source, event_category: "conversion" });

/**
 * AI result rendered successfully.
 * ← PRIMARY CONVERSION — wire Google Ads tag here.
 */
export const trackEstimateCompleted = (value?: number, source: string = "homepage"): void => {
  track("estimate_completed", {
    value,
    currency: "CAD",
    source,
    event_category: "conversion",
    event_label: "AI Estimate Generated",
  });
  // ↓ Google Ads conversion — replace label with your actual conversion action label
  // adsConversion("ESTIMATE_LABEL_HERE", value);
};

// ── Second opinion flow ──────────────────────────────────────────────────────

/**
 * User starts the second-opinion check (opens page or begins typing).
 */
export const trackSecondOpinionStarted = (): void =>
  track("second_opinion_started", { event_category: "conversion" });

/**
 * AI verdict returned.
 * verdict: "fair" | "possibly_high" | "likely_overpriced"
 */
export const trackSecondOpinionCompleted = (verdict: string = "unknown"): void => {
  track("second_opinion_completed", {
    verdict,
    event_category: "conversion",
    event_label: "Second Opinion Generated",
  });
  // ↓ Google Ads conversion — replace label
  // adsConversion("SECOND_OPINION_LABEL_HERE");
};

// ── Auth / account ───────────────────────────────────────────────────────────

/**
 * Sign-up gate modal appears (unauthenticated user blocked after free use).
 */
export const trackSignUpModalShown = (trigger: string = "gate"): void =>
  track("sign_up_modal_shown", { trigger, event_category: "auth" });

/**
 * User clicks "Create Account" or "Sign Up" anywhere.
 * ← HIGH VALUE — wire Google Ads tag here.
 */
export const trackCreateAccountClicked = (location: string = "unknown"): void => {
  track("create_account_clicked", { location, event_category: "auth" });
  // ↓ Google Ads conversion — replace label
  // adsConversion("SIGNUP_LABEL_HERE");
};

// ── Contractor acquisition ───────────────────────────────────────────────────

/**
 * Contractor clicks "Join" / "Get Leads" CTA.
 * ← HIGH VALUE — wire Google Ads tag here.
 */
export const trackContractorJoinClicked = (location: string = "unknown"): void => {
  track("contractor_join_clicked", { location, event_category: "acquisition" });
  // ↓ Google Ads conversion — replace label
  // adsConversion("CONTRACTOR_JOIN_LABEL_HERE");
};

// ── Support ──────────────────────────────────────────────────────────────────

/**
 * User clicks contact / support link.
 */
export const trackContactSupportClicked = (method: string = "page"): void =>
  track("contact_support_clicked", { method, event_category: "support" });

// ── Generic CTA helper ───────────────────────────────────────────────────────

/**
 * Generic CTA click — use for buttons not covered by specific helpers.
 */
export const trackCTAClick = (location: string, label: string): void =>
  track("cta_click", {
    cta_location: location,
    event_label: label,
    event_category: "engagement",
  });

// ── Legacy re-exports (backward compatible with existing page.tsx imports) ───

/** @deprecated Use trackEstimateCompleted instead */
export const trackEstimateComplete = trackEstimateCompleted;
