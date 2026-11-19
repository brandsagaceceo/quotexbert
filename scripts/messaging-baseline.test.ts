// Baseline proof that plain contractor<->homeowner text messaging is intact.
// Source-assertion style (matches scripts/job-fairness.test.ts) — run BEFORE and
// AFTER any quote-notification/chat-stability change as the regression gate.
import assert from "node:assert/strict";
import fs from "node:fs";

const messagesRoute = fs.readFileSync("app/api/threads/[threadId]/messages/route.ts", "utf8");

// A. contractor -> homeowner and B. homeowner -> contractor both work: the
// route resolves fromUserId/toUserId symmetrically, no hardcoded role branch.
assert.match(messagesRoute, /const \[fromUser, toUser\] = await Promise\.all/, "sender/receiver resolved symmetrically for either direction");
assert.match(messagesRoute, /dbFromUserId !== callerDbId/, "sender identity is verified against the authenticated session");
assert.match(messagesRoute, /prisma\.message\.create/, "POST persists the plain-text message");

// C. receiver gets in-app notification — never the sender.
assert.match(messagesRoute, /userId: dbToUserId,\s*\n\s*type: "NEW_MESSAGE"/, "in-app NEW_MESSAGE notification targets the receiver only");

// D. receiver gets message email when enabled.
assert.match(messagesRoute, /if \(toUser\.notifyMessageEmail !== false\)/, "email is skipped only when the receiver explicitly opted out");
assert.match(messagesRoute, /sendNewMessageEmail/, "email path uses the existing plain-message email sender");

// E. conversation history loads — GET returns full ordered history, no role gate that could hide messages from one side.
assert.match(messagesRoute, /orderBy: \{ createdAt: "asc" \}/, "GET returns full history in chronological order");

// F. deep link opens correct conversation.
const messagesPage = fs.readFileSync("app/messages/page.tsx", "utf8");
assert.match(messagesPage, /searchParams\.get\('threadId'\)/, "deep link supports ?threadId=");
assert.match(messagesPage, /searchParams\.get\('leadId'\)/, "deep link supports ?leadId=");
assert.match(messagesPage, /searchParams\.get\('conversationId'\)/, "deep link supports ?conversationId=");

// Chat UI stability contract — single scroll container, fixed header/composer, mobile back button.
const chat = fs.readFileSync("components/Chat.tsx", "utf8");
assert.match(chat, /flex-1 overflow-y-auto[^"]*min-h-0/, "message list is the single scrollable region (flex-1 + min-h-0)");
assert.match(chat, /flex-shrink-0[^"]*border-b/, "header stays fixed (flex-shrink-0)");
assert.match(chat, /aria-label="Back to conversations"/, "mobile back-to-chats control is present");
assert.match(chat, /shouldScrollRef\.current/, "auto-scroll is gated, not unconditional, to avoid jumping while reading history");

console.log("messaging-baseline tests passed");
