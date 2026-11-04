// Quote-notification regression: new quote, request-changes, revised quote, accept.
// Source-assertion style (matches scripts/job-fairness.test.ts). Confirms each quote
// action produces exactly one in-app notification + one email to the correct recipient,
// and that none of this is routed through the plain-message send endpoint.
import assert from "node:assert/strict";
import fs from "node:fs";

const putRoute = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
const actionRoute = fs.readFileSync("app/api/quotes/[id]/action/route.ts", "utf8");
const emailLib = fs.readFileSync("lib/email.ts", "utf8");

// 1. New quote AND revised quote both transition through the same single PUT
//    status:"sent" branch -> one notification + one email to the homeowner.
assert.match(putRoute, /if \(requestedStatus === "sent"\) \{[\s\S]*?prisma\.notification\.create/, "sending a quote (new or revised) notifies the homeowner");
assert.match(putRoute, /userId: updatedQuote\.conversation\.homeowner\.id,\s*\n\s*type: "quote_received"/, "notification targets the homeowner, not the contractor");
assert.match(putRoute, /sendQuoteReceivedEmail/, "an email is sent to the homeowner on quote send");
// Only ONE notification.create call should exist inside the whole PUT handler (no duplicate).
assert.equal((putRoute.match(/prisma\.notification\.create/g) || []).length, 1, "PUT sends exactly one notification (no duplicates for new vs revised)");

// 2. Request changes -> contractor notification + email (homeowner -> contractor).
assert.match(actionRoute, /type: 'quote_revision_requested'/, "request_changes notifies the contractor");
assert.match(actionRoute, /userId: quote\.conversation\.contractorId,[\s\S]*?type: 'quote_revision_requested'/, "revision-requested notification targets the contractor");
assert.match(actionRoute, /sendQuoteChangeRequestEmail/, "request_changes emails the contractor");

// 4. Accept quote -> contractor notification + email (the email leg was previously missing).
assert.match(actionRoute, /type: 'quote_accepted'/, "accept notifies the contractor in-app");
assert.match(actionRoute, /sendQuoteAcceptedEmail/, "accept now also emails the contractor (previously missing)");
assert.match(emailLib, /export async function sendQuoteAcceptedEmail/, "sendQuoteAcceptedEmail exists in lib/email.ts");

// No duplicates: exactly one notification.create per action branch in action/route.ts.
const acceptBranch = actionRoute.slice(actionRoute.indexOf("if (action === 'accept')"), actionRoute.indexOf("// action === 'request_changes'"));
assert.equal((acceptBranch.match(/prisma\.notification\.create/g) || []).length, 1, "accept branch creates exactly one notification");
const requestChangesBranch = actionRoute.slice(actionRoute.indexOf("// action === 'request_changes'"));
assert.equal((requestChangesBranch.match(/prisma\.notification\.create/g) || []).length, 1, "request_changes branch creates exactly one notification");

// Quote notifications must NOT be routed through the plain-message send endpoint.
assert.doesNotMatch(putRoute, /api\/threads\/.*\/messages/, "PUT quote route does not call the plain-message send API");
assert.doesNotMatch(actionRoute, /fetch\(.*\/api\/threads\//, "quote action route does not call the plain-message send API");

console.log("quote-notifications tests passed");
