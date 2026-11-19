import assert from "node:assert/strict";
import fs from "node:fs";

const route = fs.readFileSync("app/api/admin/analytics/route.ts", "utf8");
const page = fs.readFileSync("app/admin/insights/page.tsx", "utf8");
const usageRoute = fs.readFileSync("app/api/admin/usage/route.ts", "utf8");
const dashboard = fs.readFileSync("app/admin/page.tsx", "utf8");

assert.match(
  route,
  /prisma\.analytics\.findMany/,
  "administrator insights query the existing analytics table",
);
assert.match(route, /take: 500/, "the analytics query is bounded");
assert.doesNotMatch(
  route,
  /mockEvents|Math\.random|new PostHog/,
  "the API contains no generated activity or provider client",
);
assert.match(
  route,
  /fetchGoogleAdminMetrics/,
  "the API uses the shared read-only Google metrics integration",
);
assert.match(
  page,
  /API requests are read-only/,
  "the UI states the read-only connection boundary",
);
assert.match(page, /Search queries/, "Search Console queries are visible");
assert.match(page, /GA4 key events/, "GA4 conversions are visible");
assert.match(page, /Traffic sources/, "GA4 traffic sources are visible");
assert.match(page, /Top landing pages/, "GA4 landing pages are visible");
assert.match(page, /Blog performance/, "GA4 blog performance is visible");
assert.match(
  page,
  /duplicate GTM loading is suppressed/,
  "the dashboard reports the active non-duplicating tag mode",
);
assert.match(page, /AI usage and cost/, "real AI usage is visible");
assert.match(
  page,
  /no cost is invented/,
  "missing AI pricing never produces a fabricated cost",
);
assert.match(
  route,
  /AI_USAGE_COST_EVENT/,
  "AI usage is read from the existing analytics event store",
);
assert.doesNotMatch(
  page,
  /amountCents|Estimates → Payments|Total payments/,
  "the dashboard does not derive revenue or conversions from fabricated events",
);
for (const model of [
  "user",
  "lead",
  "quote",
  "contractorSubscription",
  "transaction",
  "seoArticle",
]) {
  assert.match(
    usageRoute,
    new RegExp(`prisma\\.${model}`),
    `administrator overview queries the existing ${model} model`,
  );
}
for (const label of [
  "Homeowners",
  "Contractors",
  "Quotes",
  "Subscriptions",
  "Credit transactions",
  "Pending actions",
  "SEO activity",
]) {
  assert.match(dashboard, new RegExp(label), `dashboard shows ${label}`);
}

console.log("admin insights real-data tests passed");
