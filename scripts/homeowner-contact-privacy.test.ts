import assert from "node:assert/strict";
import fs from "node:fs";

const acceptedJobs = fs.readFileSync("app/api/contractor/accepted-jobs/route.ts", "utf8");
const contractorConversations = fs.readFileSync("app/api/contractor/conversations/route.ts", "utf8");
const threadMessages = fs.readFileSync("app/api/threads/[threadId]/messages/route.ts", "utf8");
const messages = fs.readFileSync("app/api/messages/route.ts", "utf8");
const threads = fs.readFileSync("app/api/threads/route.ts", "utf8");
const apply = fs.readFileSync("app/api/jobs/[id]/apply/route.ts", "utf8");

assert.ok(acceptedJobs.includes("{ id: userId }, { clerkUserId: userId }"));
assert.doesNotMatch(acceptedJobs, /contractorDbIds\.push\(contractorId\)/);
assert.match(acceptedJobs, /if \(!contractorDbIds\.includes\(contractorId\)\)/);
assert.ok(contractorConversations.includes("{ id: userId }"));
assert.match(contractorConversations, /if \(!contractorDbIds\.includes\(contractorId\)\)/);

for (const source of [threadMessages, messages, threads]) {
  assert.match(source, /resolveAuthUser/);
}

assert.match(threadMessages, /ACTIVE_ACCEPTANCE_STATUSES/);
assert.match(threadMessages, /ACTIVE_APPLICATION_STATUSES/);
assert.match(messages, /status: \{ in: \["accepted", "quoted", "selected"\] \}/);
assert.match(threads, /status: \{ in: \["accepted", "quoted", "selected"\] \}/);

assert.match(threadMessages, /if \(!thread \|\| !isThreadParticipant\(thread, callerDbId\)/);
assert.match(threadMessages, /if \(!isThreadParticipant\(thread, dbUserId\)/);
assert.match(messages, /authenticatedIds\.has\(userId\)/);
assert.match(messages, /if \(!isParticipant\)/);
assert.match(threads, /authenticatedIds\.has\(requestedUserId\)/);
assert.doesNotMatch(threads, /\{ lead: \{ contractorId: \{ in: dbUserIds \} \} \}/);
assert.doesNotMatch(threads, /messages: \{\s*some:/);

assert.match(apply, /resolveAuthUser/);
assert.match(apply, /const \{ dbUserId: contractorId \} = authResult\.user/);
assert.match(apply, /contractor\.role !== "contractor"/);
assert.match(apply, /contractor\.isActive/);
assert.doesNotMatch(apply, /const \{ contractorId, message/);
assert.doesNotMatch(apply, /contractorId: await request\.json/);
assert.match(apply, /data: \{\s*leadId,\s*contractorId,/);
assert.match(apply, /const \{ dbUserId, clerkUserId \} = authResult\.user/);
assert.match(apply, /const requestedUserId = searchParams\.get\('userId'\)/);
assert.match(apply, /if \(lead\.homeownerId !== dbUserId\)/);
assert.match(apply, /if \(requestedUserId && !authenticatedIds\.has\(requestedUserId\)\)/);
assert.match(apply, /requester\.role !== "homeowner"/);
assert.doesNotMatch(apply, /if \(userId && lead\.homeownerId !== userId\)/);

console.log("homeowner contact privacy tests passed");