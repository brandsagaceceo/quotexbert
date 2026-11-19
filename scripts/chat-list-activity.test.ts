// Chat list activity/unread regression — sorting by real activity, recipient-specific
// unread, quote activity surfacing in the Thread message stream, and silent polling.
// Source-assertion style (matches scripts/job-fairness.test.ts).
import assert from "node:assert/strict";
import fs from "node:fs";

const threadsRoute = fs.readFileSync("app/api/threads/route.ts", "utf8");
const putRoute = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
const actionRoute = fs.readFileSync("app/api/quotes/[id]/action/route.ts", "utf8");
const messagesPage = fs.readFileSync("app/messages/page.tsx", "utf8");
const messagesRoute = fs.readFileSync("app/api/threads/[threadId]/messages/route.ts", "utf8");

// 1. Sorting: no longer frozen at Thread.createdAt — sorted by latest activity.
assert.match(threadsRoute, /sorted = \[\.\.\.threads\]\.sort/, "threads are re-sorted by real activity, not left in Thread.createdAt order");
assert.match(threadsRoute, /a\.messages\[0\]\?\.createdAt \?\? a\.createdAt/, "sort falls back to thread.createdAt only when there are no messages yet");

// Recipient-specific unread — unchanged, still scoped to the current viewer as toUserId.
assert.match(threadsRoute, /toUserId: \{ in: dbUserIds \},\s*\n\s*readAt: null,/, "unreadCount only counts messages TO the current user that are unread");

// 2. New/revised quote -> homeowner Thread message (drives list preview/sort/unread for quotes).
const sentBlock = putRoute.slice(putRoute.indexOf('if (status === "sent")'));
assert.match(sentBlock, /isRevision = \(updatedQuote\.version \?\? 1\) > 1 \|\| !!updatedQuote\.parentQuoteId/, "distinguishes new vs revised quote for the preview text");
assert.match(sentBlock, /prisma\.message\.create/, "quote send posts a Thread message");
assert.match(sentBlock, /New quote|Revised quote/, "quote-send message body matches the required preview text");

// 3. Quote accepted -> contractor Thread message.
const acceptBlock = actionRoute.slice(actionRoute.indexOf("if (action === 'accept')"), actionRoute.indexOf("// action === 'request_changes'"));
assert.match(acceptBlock, /prisma\.message\.create/, "accept posts a Thread message to the contractor");
assert.match(acceptBlock, /Quote accepted/, "accept message body is recognizable in the list preview");
assert.match(acceptBlock, /fromUserId: homeowner\.id,\s*\n\s*toUserId: quote\.conversation\.contractorId/, "accept message flows homeowner -> contractor (recipient-specific unread)");

// request_changes already posted a Thread message before this change — confirm untouched/still present.
assert.match(actionRoute, /Quote change request/, "existing request_changes Thread message is still present, unmodified");

// 4. Silent background polling for the thread list — must not trigger full-page loading state.
assert.match(messagesPage, /fetchThreads\(\{ silent: true \}\)/, "thread list polls silently in the background");
assert.match(messagesPage, /if \(!silent\) setLoading\(true\)/, "silent polls never toggle the full-page loading state");
assert.match(messagesPage, /threadsPollRef/, "thread-list polling uses a dedicated interval ref, matching the existing quote-poll pattern");

// Quote notification system is untouched (no duplication) — same notification calls as before.
assert.equal((putRoute.match(/prisma\.notification\.create/g) || []).length, 1, "quote send still creates exactly one notification (unchanged)");

// Plain message send/notification/email path is untouched by this change.
assert.match(messagesRoute, /prisma\.message\.create/, "plain message send route is unchanged");
assert.match(messagesRoute, /sendNewMessageEmail/, "plain message email path is unchanged");

console.log("chat-list-activity tests passed");
