import assert from "node:assert/strict";
import fs from "node:fs";

const route = fs.readFileSync(
  "app/api/quotes/price-suggestion/route.ts",
  "utf8",
);
const builder = fs.readFileSync("components/LiveQuoteBuilder.tsx", "utf8");

assert.match(
  route,
  /resolveAuthUser\(\)/,
  "pricing suggestions must require a resolved server session",
);
assert.match(
  route,
  /const contractorId = authResult\.user\.dbUserId/,
  "contractor identity must come from the server session",
);
assert.match(
  route,
  /where: \{ jobId, contractorId \}/,
  "private project category must require the authenticated contractor's conversation",
);
assert.match(
  route,
  /user\?\.role !== "contractor" \|\| !user\.isActive/,
  "inactive or non-contractor accounts must be denied",
);
assert.doesNotMatch(
  route,
  /searchParams\.get\("contractorId"\)/,
  "client-supplied contractor IDs must be ignored",
);
assert.doesNotMatch(
  route,
  /city:/,
  "individual contractor or city-level pricing cohorts must not be queried",
);
assert.match(
  route,
  /const MIN_QUOTES = 10/,
  "small quote samples must be suppressed",
);
assert.match(
  route,
  /const MIN_OTHER_CONTRACTORS = 5/,
  "the aggregate must include multiple other contractors",
);
assert.match(
  route,
  /const MIN_HOMEOWNERS = 5/,
  "the aggregate must include multiple homeowners",
);
assert.match(
  route,
  /costsByQuote\.has\(signal\.quoteId\)/,
  "duplicate learning signals must not inflate the quote sample",
);
assert.match(
  route,
  /quote\.jobId !== jobId &&\s*quote\.jobId === quote\.conversation\.jobId/,
  "the current project and inconsistent quote/project relationships must be excluded",
);
assert.match(
  route,
  /filter\(\(quote\) => quote\.contractorId !== contractorId\)/,
  "the aggregate cohort must include enough distinct contractors other than the requester",
);
assert.match(
  route,
  /PRICE_INCREMENT = 500/,
  "individual quote amounts must be coarsened",
);
assert.match(
  route,
  /Math\.floor\(sorted\.length \/ 5\) \* 5/,
  "the exposed count must be rounded into a bucket",
);
assert.match(
  route,
  /suggestion: \{ low, high, count, scope: "category"/,
  "the existing suggestion response shape must be retained",
);
assert.match(
  builder,
  /\/api\/quotes\/price-suggestion\?jobId=\$\{encodeURIComponent\(jobId\)\}/,
  "the quote builder must call the authorized endpoint without client identity",
);
assert.match(
  builder,
  /priceSuggestion\.low\.toLocaleString\(\)/,
  "the quote builder must retain price-range display",
);
assert.match(
  builder,
  /Based on at least \{priceSuggestion\.count\} accepted/,
  "the rounded cohort size must be presented as a lower bound",
);

console.log("quote-price-suggestion-privacy tests passed");
