import assert from "node:assert/strict";
import fs from "node:fs";

const collection = fs.readFileSync("app/api/quotes/route.ts", "utf8");
const byId = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
const byIdDelete = byId.slice(byId.indexOf("export async function DELETE"));
const action = fs.readFileSync("app/api/quotes/[id]/action/route.ts", "utf8");
const homeownerAction = fs.readFileSync(
  "app/api/homeowner/quotes/[id]/route.ts",
  "utf8",
);
const revise = fs.readFileSync("app/api/quotes/[id]/revise/route.ts", "utf8");
const send = fs.readFileSync("app/api/quotes/[id]/send/route.ts", "utf8");
const generate = fs.readFileSync("app/api/quotes/generate/route.ts", "utf8");
const acceptJob = fs.readFileSync("app/api/jobs/[id]/accept/route.ts", "utf8");
const lifecycle = fs.readFileSync("lib/quote-lifecycle.ts", "utf8");

const authenticatedRoutes: Array<[string, string]> = [
  [
    "quote creation",
    collection.slice(collection.indexOf("export async function POST")),
  ],
  [
    "quote update",
    byId.slice(
      byId.indexOf("export async function PUT"),
      byId.indexOf("export async function DELETE"),
    ),
  ],
  ["quote action", action],
  ["homeowner quote action", homeownerAction],
  ["quote revision", revise],
  ["quote send", send],
  ["quote generation", generate],
];
for (const [name, source] of authenticatedRoutes) {
  assert.match(
    source,
    /resolveAuthUser\(\)/,
    `${name} must authenticate using the shared session helper`,
  );
}

assert.match(
  collection,
  /contractorId: contractor\.id/,
  "new quote contractor identity must come from the server session",
);
assert.match(
  collection,
  /conversation\.contractorId !== contractor\.id/,
  "quote creation must reject another contractor's conversation",
);
assert.match(
  collection,
  /conversation\.jobId !== jobId/,
  "quote creation must reject forged project associations",
);
assert.match(
  collection,
  /job\.homeownerId !== conversation\.homeownerId/,
  "quote creation must verify homeowner/project consistency",
);

assert.match(
  action,
  /quote\.conversation\.homeownerId !== homeowner\.id/,
  "quote action must authorize the session homeowner",
);
assert.match(
  action,
  /const \{ action, note \} = body/,
  "legacy client userId must not determine quote-action identity",
);
assert.doesNotMatch(
  action,
  /findFirst\(\s*\{\s*where: \{ OR:/,
  "quote action must not resolve an arbitrary client-supplied identity",
);
assert.match(
  homeownerAction,
  /quote\.job\.homeownerId !== homeowner\.id/,
  "legacy homeowner action must authorize the session owner",
);
assert.match(
  homeownerAction,
  /const \{ action \} = await request\.json\(\)/,
  "legacy homeownerId body field must be ignored",
);

assert.match(
  byId,
  /existing\.status === "draft" \? \["draft", "sent"\] : \["sent"\]/,
  "contractors can only keep drafts as drafts or send drafts/revision-requested quotes",
);
assert.match(
  byId,
  /status: existing\.status/,
  "quote edits must compare-and-set the expected status",
);
assert.match(
  byIdDelete,
  /await prisma\.\$transaction\(async \(tx\)/,
  "deleting a draft and its items must be atomic",
);
assert.match(
  byIdDelete,
  /status: existing\.status/,
  "deletion must compare-and-set the expected quote status",
);
assert.match(
  action,
  /status: "sent"/,
  "homeowner action must transition only a sent quote",
);
assert.match(
  homeownerAction,
  /status: "sent"/,
  "legacy homeowner action must transition only a sent quote",
);
assert.match(
  revise,
  /status: original\.status/,
  "revision must compare-and-set the original quote status",
);
assert.match(
  send,
  /status: quote\.status/,
  "sending must compare-and-set the original quote status",
);

assert.match(
  lifecycle,
  /await prisma\.\$transaction\(async \(tx\)/,
  "acceptance must update the project and quote atomically",
);
assert.match(
  lifecycle,
  /status: \{ in: \["open", "claimed", "reviewing"\] \}/,
  "acceptance must require an eligible project state",
);
assert.match(
  lifecycle,
  /status: "sent"/,
  "acceptance must be limited to a sent quote",
);
assert.match(
  lifecycle,
  /HOMEOWNER_VISIBLE_QUOTE_STATUSES = \[\s*"sent",\s*"accepted",\s*"rejected",\s*"expired",\s*"revision_requested"/,
  "homeowner quote visibility must allow only known public lifecycle statuses",
);
assert.match(
  lifecycle,
  /throw new QuoteAcceptanceConflictError\(\)/,
  "failed quote compare-and-set must roll back the project transition",
);

assert.match(
  acceptJob,
  /acceptedContractors\.length >= latestLead\.maxContractors/,
  "job acceptance must enforce the configured contractor cap",
);
assert.match(
  acceptJob,
  /tx\.jobAcceptance\.count/,
  "job acceptance cap must account for legacy acceptance rows",
);
assert.match(
  generate,
  /fromUserId: contractorId, toUserId: conversation\.homeownerId/,
  "AI quote generation must filter messages to the actual participant pair",
);
assert.match(
  generate,
  /fromUserId: conversation\.homeownerId, toUserId: contractorId/,
  "AI quote generation must include only the reciprocal participant pair",
);

console.log("quote-authorization-security tests passed");
