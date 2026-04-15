"use client";

import { useEffect } from "react";

/**
 * Reads `?ref=CODE` from the URL on every page load and persists
 * it in a 30-day cookie (`qxb_ref`) + localStorage so the referral
 * code survives navigation and is available at Stripe checkout time.
 *
 * Rendered once in the root layout — no visible output.
 */
export default function ReferralTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      // Validate: alphanumeric + hyphen/underscore, 4–30 chars
      if (ref && /^[a-zA-Z0-9_-]{4,30}$/.test(ref)) {
        // 30-day cookie
        document.cookie = `qxb_ref=${encodeURIComponent(ref)}; max-age=2592000; path=/; Secure; SameSite=Lax`;
        localStorage.setItem("qxb_ref", ref);
      }
    } catch {
      // Non-critical — never break the page
    }
  }, []);

  return null;
}
