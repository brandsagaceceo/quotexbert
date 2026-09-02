// Multi-contractor thread routing regression — a Lead's single shared Thread can
// host messages from several contractors; opening a notification must show the
// SPECIFIC contractor it's about, never silently fall back to the first/primary
// contractor. Source-assertion style (matches scripts/job-fairness.test.ts).
import assert from "node:assert/strict";
import fs from "node:fs";

const notificationBell = fs.readFileSync("components/NotificationBell.tsx", "utf8");
const notificationsPage = fs.readFileSync("app/notifications/page.tsx", "utf8");
const messagesPage = fs.readFileSync("app/messages/page.tsx", "utf8");
const chat = fs.readFileSync("components/Chat.tsx", "utf8");
const putRoute = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
const acceptRoute = fs.readFileSync("app/api/jobs/[id]/accept/route.ts", "utf8");
const threadsRoute = fs.readFileSync("app/api/threads/route.ts", "utf8");
const messagesSendRoute = fs.readFileSync("app/api/threads/[threadId]/messages/route.ts", "utf8");
const emailLib = fs.readFileSync("lib/email.ts", "utf8");

// 1. Both notification UIs append a contractor-identifying suffix, preferring an
//    explicit contractorId, falling back to the NEW_MESSAGE sender id.
for (const [name, src] of [["NotificationBell", notificationBell], ["notifications/page", notificationsPage]] as const) {
  assert.match(src, /payload\.contractorId \|\| payload\.fromUserId/, `${name} prefers payload.contractorId, falls back to fromUserId`);
  assert.match(src, /contractorSuffix/, `${name} appends the contractor suffix to deep links`);
}

// 2. New/revised quote notifications now identify WHICH contractor sent them.
const sentBlock = putRoute.slice(putRoute.indexOf('if (status === "sent")'));
assert.match(sentBlock, /contractorId: updatedQuote\.contractorId/, "quote_received notification payload identifies the sending contractor");

// 3. Job-accepted notification identifies WHICH contractor just accepted.
assert.match(acceptRoute, /type: "JOB_ACCEPTED"[\s\S]{0,400}contractorId: dbContractorId/, "JOB_ACCEPTED notification payload identifies the accepting contractor");

// 4. Messages page reads ?contractorId= and threads it through thread selection to Chat.
assert.match(messagesPage, /searchParams\.get\('contractorId'\)/, "messages page reads the contractorId deep-link param");
assert.match(messagesPage, /selectThread\(direct, contractorId\)/, "threadId deep link passes the resolved contractorId through");
assert.match(messagesPage, /selectThread\(byLead, contractorId\)/, "leadId deep link passes the resolved contractorId through");
assert.match(messagesPage, /focusContractorId: deepLinkContractorId/, "Chat receives the focus contractor id from the deep link");

// 5. Chat resolves the displayed contractor from focusContractorId — for the
//    homeowner's view ONLY (a lead always has exactly one homeowner, so the
//    contractor's own view of "otherUser" is never ambiguous and must be untouched).
assert.match(chat, /focusContractorId\?: string/, "Chat accepts an optional focusContractorId prop");
assert.match(chat, /if \(!isHomeowner \|\| !focusContractorId\) return null;/, "the override only ever applies to the homeowner's view");
assert.match(chat, /otherUser =\s*\n\s*isHomeowner\s*\n\s*\? \(focusedContractor \?\? thread\.lead\.contractor\)\s*\n\s*: thread\.lead\.homeowner;/, "homeowner sees the focused contractor when provided, else the existing default; contractor's own view (thread.lead.homeowner) is unchanged");

// 6. Manual thread-list resolution — the list must not blindly show
//    thread.lead.contractor either. It resolves the contractor implicated by the
//    latest activity (already-fetched last message's sender/recipient), reusing
//    existing message data only — no new model.
assert.match(threadsRoute, /toUser: \{\s*\n\s*include: \{/, "the threads API now also fetches the latest message's toUser (needed to resolve the contractor when the homeowner sent the last message)");
assert.match(messagesPage, /const resolveThreadContractor = \(thread: Thread, myId: string\)/, "a shared resolver determines the contractor for both search-filtering and row display");
assert.match(messagesPage, /if \(last\.fromUser\.id !== myId\) return last\.fromUser;/, "resolves to whoever sent the latest message when it wasn't the homeowner");
assert.match(messagesPage, /if \(last\.toUser && last\.toUser\.id !== myId\) return last\.toUser;/, "resolves to the message recipient when the homeowner sent the latest message");
assert.match(messagesPage, /const otherUser = resolveThreadContractor\(thread, myId\);/, "the row display uses the shared resolver, not a hardcoded thread.lead.contractor");
const getConversationPartnerBlock = messagesPage.slice(
  messagesPage.indexOf("const getConversationPartner = (thread: Thread)"),
  messagesPage.indexOf("const resolveThreadContractor ="),
);
assert.match(getConversationPartnerBlock, /return resolveThreadContractor\(thread, selfUserId\);/, "search filtering uses the same resolver as row display — one consistent rule");
assert.match(messagesPage, /selectThread\(thread, rowFocusContractorId\)/, "clicking a row passes through the row's resolved contractor so Chat shows the same identity");

// 7. Email CTA links now carry the same contractorId routing rule as in-app notifications.
assert.match(emailLib, /sender: \{ name\?: string \| null; id\?: string \}/, "sendNewMessageEmail accepts the sender's DB user id");
assert.match(emailLib, /createMessageReceivedTemplate\(messagePreview, threadId, sender\.name \?\? undefined, jobTitle, recipient\.id, sender\.id\)/, "sendNewMessageEmail passes the sender id through to the template");
assert.match(emailLib, /const ctaHref = `\$\{baseUrl\}\/messages\?threadId=\$\{threadId\}\$\{contractorId \? `&contractorId=\$\{contractorId\}` : ''\}`;/, "message email CTA appends &contractorId= when known");
assert.match(emailLib, /contractorId\?: string;\s*\n\}\): Promise<\{ success: boolean; error\?: any \}> \{\s*\n\s*if \(!resend\) \{\s*\n\s*console\.warn\('\[EMAIL\] RESEND_API_KEY not configured, skipping quote-received email'\);/, "sendQuoteReceivedEmail accepts an optional contractorId param");
assert.match(emailLib, /messages\?leadId=\$\{encodeURIComponent\(leadId\)\}\$\{contractorId \? `&contractorId=\$\{encodeURIComponent\(contractorId\)\}` : ''\}/, "quote-received email CTA appends &contractorId= when known");
assert.match(emailLib, /contractor: \{ id: string; companyName: string; name\?: string \| null \}/, "sendJobAcceptedEmail accepts the contractor's DB user id");
assert.match(emailLib, /messages\?leadId=\$\{encodeURIComponent\(job\.id\)\}&contractorId=\$\{encodeURIComponent\(contractor\.id\)\}/, "job-accepted email CTA now links to the specific job AND contractor (previously a bare /messages link with no context at all)");

// Call sites actually pass the ids through (not just the function signatures).
assert.match(messagesSendRoute, /id: dbFromUserId,/, "the live plain-message send route passes the sender's DB id to the email helper");
assert.match(putRoute, /contractorId: updatedQuote\.contractorId,\s*\n\s*\}\);/, "quote PUT route passes contractorId to the quote-received email");
assert.match(acceptRoute, /id: dbContractorId,\s*\n\s*name: contractor\.name \|\| contractor\.email,/, "job accept route passes the contractor's DB id to the job-accepted email");

// ID safety: every id threaded through this fix is a resolved DB User.id, never a
// raw Clerk id or ContractorProfile id — confirmed by tracing each call site above
// (dbFromUserId / updatedQuote.contractorId / dbContractorId all originate from
// prisma.user lookups or auth resolution, not from ContractorProfile or Clerk ids).

// Protected: normal message creation, mark-as-read, and unread logic are untouched.
assert.match(messagesSendRoute, /prisma\.message\.create/, "message creation is unchanged");
assert.match(threadsRoute, /toUserId: \{ in: dbUserIds \},\s*\n\s*readAt: null,/, "unread counting rule is unchanged");

// Manual thread-list clicks resolve the row's own contractor context (only set
// when it differs from the default primary contractor) — no stale/unrelated
// focus contractor leaks in from a previous notification-driven selection.
assert.match(messagesPage, /onClick=\{\(\) => selectThread\(thread, rowFocusContractorId\)\}/, "clicking a thread row passes the row's own resolved contractor context, not a leftover deep-link value");

console.log("multi-contractor-routing tests passed");
