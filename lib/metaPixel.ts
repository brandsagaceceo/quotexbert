/**
 * Meta Pixel helper for QuoteXbert Client-Side Event Tracking.
 * Prevents duplicate events using session-based and localStorage-based deduplication logs.
 */

export const META_PIXEL_ID = "2513183642529279";

/**
 * Standard Meta Pixel tracking function options
 */
export interface MetaEventOptions {
  value?: number;
  currency?: string;
  [key: string]: any;
}

/**
 * Safely access the fbq window object
 */
const getFbq = (): any => {
  if (typeof window !== "undefined") {
    return (window as any).fbq;
  }
  return null;
};

/**
 * Helper to log event debug information in development
 */
const debugLog = (eventName: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] Tracked: "${eventName}"`, data || "");
  }
};

/**
 * Checks whether an event of a specific type with a specific identifier has already been fired
 * in the current window session / local storage to prevent duplicate events on page reload/navigation.
 */
const isDuplicate = (eventName: string, deduplicationKey?: string): boolean => {
  if (typeof window === "undefined") return true;

  // Use a window-level cache for fast session check
  const windowCache = (window as any)._metaPixelFiredEvents || {};
  if (!deduplicationKey) {
    // If no deduplication key is provided, we default to window cache of the event name for the single session
    if (windowCache[eventName]) {
      return true;
    }
    windowCache[eventName] = true;
    (window as any)._metaPixelFiredEvents = windowCache;
    return false;
  }

  // If a deduplicationKey is provided, check both memory and localStorage
  const fullKey = `m_px_${eventName}_${deduplicationKey}`;
  if (windowCache[fullKey]) {
    return true;
  }

  try {
    const storageValue = localStorage.getItem(fullKey);
    if (storageValue) {
      return true;
    }
    localStorage.setItem(fullKey, "1");
  } catch (e) {
    // Treat localStorage quota or security errors as non-blocking, rely on windowCache fallback
  }

  windowCache[fullKey] = true;
  (window as any)._metaPixelFiredEvents = windowCache;
  return false;
};

/**
 * Fire general Meta Pixel events with optional deduplication.
 */
export const trackMetaEvent = (
  type: "track" | "trackCustom",
  eventName: string,
  options?: MetaEventOptions,
  deduplicationKey?: string
): void => {
  const fbq = getFbq();
  if (!fbq) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[Meta Pixel] fbq is not initialized. Skipping event: "${eventName}"`);
    }
    return;
  }

  // Prevent duplicates
  if (isDuplicate(eventName, deduplicationKey)) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Meta Pixel] Prevented duplicate event tracking: "${eventName}" with key: ${deduplicationKey || "session"}`);
    }
    return;
  }

  try {
    if (options) {
      fbq(type, eventName, options);
    } else {
      fbq(type, eventName);
    }
    debugLog(eventName, options);
  } catch (error) {
    console.error(`[Meta Pixel] Error tracking event: "${eventName}"`, error);
  }
};

/**
 * 1. CompleteRegistration
 * Detects successful user registration
 * Call when a user gets assigned or selects their role successfully in onboarding,
 * or when they sign up.
 * 
 * @param deduplicationKey Unique user ID (e.g. clerk user ID) to prevent duplicate triggers
 */
export const trackCompleteRegistration = (deduplicationKey: string): void => {
  trackMetaEvent(
    "track",
    "CompleteRegistration",
    undefined,
    deduplicationKey
  );
};

/**
 * 2. EstimateCompleted (Custom)
 * Detects when a homeowner successfully receives an AI estimate.
 * 
 * @param estimateValue Total approximate cost of the estimate (e.g., total_high or budget midpoint)
 * @param deduplicationKey Unique estimate ID to prevent duplicates if user goes back-and-forth
 */
export const trackEstimateCompleted = (
  estimateValue: number,
  deduplicationKey: string
): void => {
  trackMetaEvent(
    "trackCustom",
    "EstimateCompleted",
    {
      value: estimateValue,
      currency: "CAD",
    },
    deduplicationKey
  );
};

/**
 * 3. Lead
 * Detects when a lead or renovation project is submitted.
 * 
 * @param budgetDisplay Budget text, e.g., "$5,000 - $10,000" or raw number
 * @param projectCategory The category of lead, e.g., "Plumbing", "Renovation"
 * @param deduplicationKey Unique lead ID to prevent duplicate trigger on reload
 */
export const trackLead = (
  budgetDisplay: string,
  projectCategory: string,
  deduplicationKey: string
): void => {
  // Try to parse numerical value from budget string if possible
  const cleanBudgetString = budgetDisplay.replace(/[^0-9.-]/g, "");
  let value: number | undefined;
  if (cleanBudgetString) {
    // If range, e.g., "5000-10000", grab the average
    if (cleanBudgetString.includes("-")) {
      const parts = cleanBudgetString.split("-").map(p => parseFloat(p));
      if (parts[0] !== undefined && parts[1] !== undefined && !isNaN(parts[0]) && !isNaN(parts[1])) {
        value = (parts[0] + parts[1]) / 2;
      }
    } else {
      const parsed = parseFloat(cleanBudgetString);
      if (!isNaN(parsed)) {
        value = parsed;
      }
    }
  }

  trackMetaEvent(
    "track",
    "Lead",
    {
      content_category: projectCategory,
      content_name: "Renovation Lead",
      value: value,
      currency: "CAD"
    },
    deduplicationKey
  );
};

/**
 * 4. Purchase
 * Detects every successful contractor subscription purchase.
 * 
 * @param value The checkout price amount in CAD
 * @param stripeSessionId The unique Stripe checkout session ID for deduplication
 */
export const trackPurchase = (
  value: number,
  stripeSessionId: string
): void => {
  trackMetaEvent(
    "track",
    "Purchase",
    {
      value: value,
      currency: "CAD",
      content_type: "product",
      content_name: "Contractor Subscription Tier Plan"
    },
    stripeSessionId
  );
};
