import assert from "node:assert/strict";
import fs from "node:fs";
import {
  canRequestMoreQuotes,
  canWithdrawFromJob,
  isPendingAcceptedLead,
  MAX_PENDING_ACCEPTED_LEADS_PER_CONTRACTOR,
} from "../lib/job-acceptance";
import { evaluateQuoteSlotAccess, MAX_ACTIVE_QUOTES_PER_JOB } from "../lib/quote-limits";

const fiveActiveQuotes = Array.from({ length: MAX_ACTIVE_QUOTES_PER_JOB }, (_, index) => ({
  contractorId: `contractor-${index + 1}`,
  status: "sent",
}));

assert.deepEqual(
  evaluateQuoteSlotAccess(fiveActiveQuotes, "contractor-6"),
  { allowed: false, activeCount: 5 },
  "a sixth contractor cannot consume a sixth active quote slot",
);
assert.deepEqual(
  evaluateQuoteSlotAccess(fiveActiveQuotes, "contractor-1"),
  { allowed: true, activeCount: 5 },
  "a contractor can revise their own active quote without consuming another slot",
);
assert.deepEqual(
  evaluateQuoteSlotAccess(
    fiveActiveQuotes.map((quote, index) => index === 0 ? { ...quote, status: "withdrawn" } : quote),
    "contractor-6",
  ),
  { allowed: true, activeCount: 4 },
  "withdrawing an active quote reopens its slot",
);

assert.equal(MAX_PENDING_ACCEPTED_LEADS_PER_CONTRACTOR, 3);
assert.equal(isPendingAcceptedLead("reviewing", null, false), true);
assert.equal(isPendingAcceptedLead("reviewing", null, true), false, "submitting a quote frees the pending slot");
assert.equal(isPendingAcceptedLead("assigned", "selected-contractor", false), false);
assert.equal(isPendingAcceptedLead("completed", null, false), false);

assert.equal(canRequestMoreQuotes("open", null), true);
assert.equal(canRequestMoreQuotes("reviewing", null), true);
assert.equal(canRequestMoreQuotes("claimed", null), true);
assert.equal(canRequestMoreQuotes("assigned", "contractor-1"), false);
assert.equal(canRequestMoreQuotes("pending_completion", "contractor-1"), false);
assert.equal(canRequestMoreQuotes("completed", "contractor-1"), false);
assert.equal(canRequestMoreQuotes("closed", null), false);

assert.equal(canWithdrawFromJob("accepted", null, "contractor-1"), true);
assert.equal(canWithdrawFromJob("quoted", null, "contractor-1"), true);
assert.equal(canWithdrawFromJob("selected", "contractor-1", "contractor-1"), false);

const withdrawSource = fs.readFileSync("app/api/jobs/[id]/withdraw/route.ts", "utf8");
assert.match(withdrawSource, /status: "withdrawn"/, "withdraw preserves acceptance history");
assert.match(withdrawSource, /quote\.updateMany/, "withdraw frees active quote slots");
assert.match(withdrawSource, /notification\.create/, "withdraw notifies the homeowner");
assert.doesNotMatch(withdrawSource, /lead\.delete/, "withdraw never deletes the project");

const reopenSource = fs.readFileSync("app/api/homeowner/jobs/[id]/request-more-quotes/route.ts", "utf8");
assert.match(reopenSource, /status: "expired"/, "request-more-quotes frees active quote slots without deleting history");
assert.match(reopenSource, /notifyMatchingContractors\(leadId\)/, "request-more-quotes notifies contractors");
assert.doesNotMatch(reopenSource, /lead\.create/, "request-more-quotes reuses the existing project");

const relistSource = fs.readFileSync("app/api/cron/relist-inactive-jobs/route.ts", "utf8");
assert.match(relistSource, /acceptedById: null/, "automatic relist excludes selected contractors");
assert.match(relistSource, /status: \{ in: \['open', 'reviewing'\] \}/, "automatic relist includes only seekable statuses");
assert.match(relistSource, /RELIST_EMAILS_ENABLED === 'true'/, "relist emails remain explicitly gated");

console.log("job-fairness tests passed");