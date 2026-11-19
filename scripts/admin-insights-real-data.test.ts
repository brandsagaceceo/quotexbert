import assert from "node:assert/strict";
import fs from "node:fs";

const route = fs.readFileSync("app/api/admin/analytics/route.ts", "utf8");
const page = fs.readFileSync("app/admin/insights/page.tsx", "utf8");

assert.match(
  route,
  /prisma\.analytics\.findMany/,
  "administrator insights query the existing analytics table",
);
assert.match(
  route,
  /take: 500/,
  "the analytics query is bounded",
);
assert.doesNotMatch(
  route,
  /mockEvents|Math\.random|new PostHog/,
  "the API contains no generated activity or provider client",
);
assert.match(
  route,
  /metricsConnected: false/g,
  "Google Analytics and Search Console metrics remain explicitly disconnected",
);
assert.match(
  page,
  /No Google API request is made by this page/,
  "the UI states the connection boundary",
);
assert.doesNotMatch(
  page,
  /amountCents|Estimates → Payments|Total payments/,
  "the dashboard does not derive revenue or conversions from fabricated events",
);

console.log("admin insights real-data tests passed");
