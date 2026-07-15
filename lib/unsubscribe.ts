import crypto from "crypto";

/**
 * Stateless one-click email unsubscribe tokens.
 *
 * Reuses the existing `notifyJobEmail` / `notifyMessageEmail` / `notifyMarketingEmail`
 * boolean fields on the User model (see app/api/notifications/settings/route.ts) —
 * this file does NOT introduce a new preferences store. It only provides a way to
 * flip one of those existing fields to `false` from an unauthenticated email-client
 * click, via a signed token instead of a login session.
 */

const SECRET =
  process.env.UNSUBSCRIBE_SECRET ||
  process.env.CRON_SECRET ||
  "quotexbert-dev-unsubscribe-secret";

export type UnsubscribeCategory = "marketing" | "job" | "message" | "digest";

const VALID_CATEGORIES: UnsubscribeCategory[] = ["marketing", "job", "message", "digest"];

export function isUnsubscribeCategory(value: string | null): value is UnsubscribeCategory {
  return !!value && (VALID_CATEGORIES as string[]).includes(value);
}

/** Deterministic HMAC token for a given user + category. No expiry (links in old emails must keep working). */
export function generateUnsubscribeToken(userId: string, category: UnsubscribeCategory): string {
  return crypto.createHmac("sha256", SECRET).update(`${userId}:${category}`).digest("hex").slice(0, 32);
}

export function verifyUnsubscribeToken(userId: string, category: string, token: string): boolean {
  if (!isUnsubscribeCategory(category) || !token) return false;
  const expected = generateUnsubscribeToken(userId, category);
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.quotexbert.com";

/** Builds the one-click unsubscribe URL used in email footers. */
export function buildUnsubscribeUrl(userId: string, category: UnsubscribeCategory): string {
  const token = generateUnsubscribeToken(userId, category);
  return `${BASE_URL}/api/unsubscribe?u=${encodeURIComponent(userId)}&c=${category}&t=${token}`;
}
