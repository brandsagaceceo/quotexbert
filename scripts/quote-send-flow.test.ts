import assert from "node:assert/strict";
import fs from "node:fs";

// Deterministic regression tests for the Generate/Send Quote hotfix.
// Follows the same source-assertion style as scripts/job-fairness.test.ts —
// no live DB/network required, safe to run in CI or locally.

// ── 1. Multi-contractor bridge fix ──────────────────────────────────────────
// Root cause: Lead.contractorId only tracks the FIRST contractor to accept a
// job, but the fairness system allows several contractors to accept/quote the
// same job. The Thread -> Conversation bridge must authorise (and attribute
// the Conversation to) any contractor with a valid JobAcceptance, not just
// the lead's primary contractor.
const bridgeSource = fs.readFileSync("app/api/conversations/for-thread/route.ts", "utf8");
assert.match(
  bridgeSource,
  /jobAcceptance\.findUnique/,
  "for-thread bridge must fall back to JobAcceptance for non-primary contractors"
);
assert.match(
  bridgeSource,
  /resolvedContractorId/,
  "for-thread bridge must attribute the Conversation to the actual accepted contractor"
);
assert.doesNotMatch(
  bridgeSource,
  /contractorId: lead\.contractorId!/,
  "Conversation must no longer be hard-attributed to Lead.contractorId only"
);

// ── 2. /api/quotes/[id]/send — Clerk ID vs DB ID mismatch ───────────────────
// The established auth helper maps Clerk sessions to DB user IDs, including
// webhook-created accounts. The send endpoint must use that resolved identity.
const sendRouteSource = fs.readFileSync("app/api/quotes/[id]/send/route.ts", "utf8");
assert.match(
  sendRouteSource,
  /resolveAuthUser\(\)/,
  "send route must resolve the authenticated session to a DB user"
);
assert.doesNotMatch(
  sendRouteSource,
  /from '@clerk\/nextjs\/server'/,
  "send route must use the shared authentication helper"
);
assert.match(
  sendRouteSource,
  /where: \{ id: quoteId, contractorId: dbContractorId, status: quote\.status \}/,
  "send must use an owner- and status-scoped compare-and-set"
);
assert.doesNotMatch(sendRouteSource, /status:\s*'SENT',/, "send route must not use uppercase 'SENT'");
assert.match(sendRouteSource, /Only draft or revision-requested quotes can be sent/, "accepted and already-sent quotes cannot be resent");

// ── 3. PUT/DELETE /api/quotes/[id] — ownership + price validation ──────────
const quoteByIdSource = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
assert.match(
  quoteByIdSource,
  /existing\.contractorId !== authResult\.user\.dbUserId/,
  "PUT must verify the authenticated caller owns the quote before mutating it"
);
assert.match(
  quoteByIdSource,
  /Enter your quote amount before sending\./,
  "PUT must reject sending a quote with no/invalid amount with a clear message"
);

// ── 4. /api/quotes/generate — server no longer trusts body contractorId ────
const generateSource = fs.readFileSync("app/api/quotes/generate/route.ts", "utf8");
assert.match(
  generateSource,
  /authResult\.user\.dbUserId !== conversation\.contractorId/,
  "generate route must verify the authenticated caller matches the conversation's contractor"
);
assert.match(generateSource, /fromUserId: contractorId, toUserId: conversation\.homeownerId/, "generated quote context must only include this contractor-homeowner pair");

// ── 5. Messaging must remain untouched ──────────────────────────────────────
for (const messagingFile of [
  "app/api/threads/[threadId]/messages/route.ts",
  "app/api/conversations/[id]/messages/route.ts",
]) {
  assert.ok(fs.existsSync(messagingFile), `${messagingFile} must still exist untouched`);
}

// ── 6. Double-submit guard still present in the quote builder UI ───────────
const builderSource = fs.readFileSync("components/LiveQuoteBuilder.tsx", "utf8");
assert.match(
  builderSource,
  /disabled=\{saving \|\| sending \|\| !quote\.title\.trim\(\) \|\| !quote\.scope\.trim\(\) \|\| !\(quote\.totalCost > 0\)\}/,
  "Send Quote button must stay disabled while sending and require a positive amount"
);

console.log("quote-send-flow tests passed");
