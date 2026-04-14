/**
 * Shared quote numeric validation utilities.
 *
 * Used by: /api/quotes/generate, LiveQuoteBuilder, QuoteMessageCard
 *
 * Prevents the $11M bug by:
 *  1. Strict money-string parsing (no phone numbers, addresses, etc.)
 *  2. Residential-job sanity caps
 *  3. Deterministic line-item ↔ total reconciliation
 */

// ─── Thresholds ─────────────────────────────────────────────────────────────

export const RESIDENTIAL_CAP = 250_000;     // hard upper for any single field
export const STANDARD_JOB_CAP = 100_000;    // most residential jobs land here
export const SMALL_JOB_CAP = 10_000;        // typical small-job ceiling

/** Heuristics: if the job scope contains any of these, allow up to RESIDENTIAL_CAP */
const LARGE_PROJECT_SIGNALS = [
  'addition', 'extension', 'custom home', 'full renovation', 'new build',
  'whole house', 'structural', 'foundation', 'commercial',
];

// ─── sanitizeMoneyValue ─────────────────────────────────────────────────────

export interface SanitizeOptions {
  fallback?: number;
  max?: number;
  min?: number;
  /** If true, returns 0 instead of fallback on parse failure */
  zeroOnFail?: boolean;
}

/**
 * Parse a raw value (string | number | unknown) into a clean, bounded dollar amount.
 * Strips commas, dollar signs, whitespace. Rejects NaN / Infinity / negative.
 */
export function sanitizeMoneyValue(value: unknown, opts: SanitizeOptions = {}): number {
  const { fallback = 0, max = RESIDENTIAL_CAP, min = 0, zeroOnFail = false } = opts;

  let n: number;
  if (typeof value === 'number') {
    n = value;
  } else if (typeof value === 'string') {
    // Strip currency symbols, commas, whitespace, "dollars"
    let cleaned = value.replace(/[$,\s]/g, '').replace(/dollars?/i, '').trim();
    // Handle shorthand: "1k" → "1000", "2.5k" → "2500"
    const kMatch = cleaned.match(/^(\d+(?:\.\d+)?)k$/i);
    if (kMatch && kMatch[1]) {
      cleaned = String(parseFloat(kMatch[1]) * 1000);
    }
    // Only accept strings that look like a decimal number
    const match = cleaned.match(/^(\d+(?:\.\d+)?)$/);
    if (!match || !match[1]) return zeroOnFail ? 0 : fallback;
    n = parseFloat(match[1]);
  } else {
    return zeroOnFail ? 0 : fallback;
  }

  if (!Number.isFinite(n) || n < min) return zeroOnFail ? 0 : fallback;
  return Math.min(n, max);
}

// ─── normalizeQuoteDraft ────────────────────────────────────────────────────

export interface QuoteLineItem {
  category?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface RawQuoteDraft {
  totalCost: unknown;
  laborCost: unknown;
  materialCost: unknown;
  items?: QuoteLineItem[];
  scope?: string;
  [key: string]: unknown;
}

export interface NormalizedQuoteDraft {
  totalCost: number;
  laborCost: number;
  materialCost: number;
  items: QuoteLineItem[];
}

/**
 * Takes a raw AI-generated (or user-edited) quote draft and returns
 * deterministically consistent, bounded values.
 *
 * Rules:
 *  - All values clamped to [0, effectiveCap]
 *  - If line items exist, total = sum of items (items are the source of truth)
 *  - If only top-level values exist, derive 60/40 labor/material split
 *  - labor + material must == total  (reconciled deterministically)
 *  - absurd values exceeding the effective cap are recalculated
 */
export function normalizeQuoteDraft(raw: RawQuoteDraft): NormalizedQuoteDraft {
  const scope = typeof raw.scope === 'string' ? raw.scope.toLowerCase() : '';
  const isLargeProject = LARGE_PROJECT_SIGNALS.some(s => scope.includes(s));
  const effectiveCap = isLargeProject ? RESIDENTIAL_CAP : STANDARD_JOB_CAP;

  // ── 1. Sanitize top-level values ──────────────────────────────────────────
  let totalCost = sanitizeMoneyValue(raw.totalCost, { max: effectiveCap, fallback: 0 });
  let laborCost = sanitizeMoneyValue(raw.laborCost, { max: effectiveCap, fallback: 0 });
  let materialCost = sanitizeMoneyValue(raw.materialCost, { max: effectiveCap, fallback: 0 });

  // ── 2. Sanitize line items ────────────────────────────────────────────────
  const items: QuoteLineItem[] = (raw.items ?? []).map(item => {
    const qty = sanitizeMoneyValue(item.quantity, { max: 10_000, fallback: 1 });
    const unit = sanitizeMoneyValue(item.unitPrice, { max: effectiveCap, fallback: 0 });
    const computed = Math.min(qty * unit, effectiveCap);
    return {
      ...item,
      quantity: qty,
      unitPrice: unit,
      totalPrice: computed,
    };
  });

  // ── 3. Reconcile: items are source of truth when present ──────────────────
  if (items.length > 0) {
    let labor = 0, materials = 0, other = 0;
    for (const item of items) {
      if (item.category === 'labor') labor += item.totalPrice;
      else if (item.category === 'materials') materials += item.totalPrice;
      else other += item.totalPrice;
    }
    const itemSum = labor + materials + other;

    // Clamp the aggregate
    const clampedSum = Math.min(itemSum, effectiveCap);
    if (clampedSum !== itemSum && itemSum > 0) {
      // scale all items down proportionally
      const ratio = clampedSum / itemSum;
      for (const item of items) {
        item.totalPrice = Math.round(item.totalPrice * ratio * 100) / 100;
        item.unitPrice = item.quantity > 0 ? Math.round((item.totalPrice / item.quantity) * 100) / 100 : 0;
      }
      labor = Math.round(labor * ratio * 100) / 100;
      materials = Math.round(materials * ratio * 100) / 100;
    }

    totalCost = Math.round(clampedSum * 100) / 100;
    laborCost = Math.round(labor * 100) / 100;
    materialCost = Math.round(materials * 100) / 100;
  } else {
    // No items — reconcile top-level values
    if (totalCost <= 0 && (laborCost > 0 || materialCost > 0)) {
      totalCost = Math.min(laborCost + materialCost, effectiveCap);
    }
    if (totalCost > 0 && laborCost <= 0 && materialCost <= 0) {
      laborCost = Math.round(totalCost * 0.6 * 100) / 100;
      materialCost = Math.round(totalCost * 0.4 * 100) / 100;
    }
    // Ensure labor+material == total
    const sum = laborCost + materialCost;
    if (sum > 0 && Math.abs(sum - totalCost) > 1) {
      totalCost = Math.min(sum, effectiveCap);
    }
  }

  // ── 4. Hard final safety clamp — reject absurd totals for residential jobs ─
  // If the total exceeds the standard job cap and no large-project signals were
  // detected, force-clamp to STANDARD_JOB_CAP. This catches concatenated ranges
  // and runaway AI math that slipped through earlier guards.
  if (totalCost > effectiveCap) {
    const ratio = effectiveCap / totalCost;
    totalCost = effectiveCap;
    laborCost = Math.round(laborCost * ratio * 100) / 100;
    materialCost = Math.round(materialCost * ratio * 100) / 100;
    for (const item of items) {
      item.totalPrice = Math.round(item.totalPrice * ratio * 100) / 100;
      item.unitPrice = item.quantity > 0 ? Math.round((item.totalPrice / item.quantity) * 100) / 100 : 0;
    }
  }

  return { totalCost, laborCost, materialCost, items };
}
