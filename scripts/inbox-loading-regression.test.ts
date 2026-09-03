import assert from "node:assert/strict";
import fs from "node:fs";

const inboxRoute = fs.readFileSync("app/api/threads/route.ts", "utf8");

// Conversation rows and legacy Thread rows have different unread-count shapes.
// The response normalizer must handle both without dereferencing a missing _count.
assert.match(
  inboxRoute,
  /unreadCount: t\.unreadCount \?\? t\._count\?\.messages \?\? 0/,
  "mixed Conversation and legacy Thread rows normalize unread counts safely",
);
assert.match(inboxRoute, /prisma\.conversation\.findMany/, "homeowner and contractor inboxes include isolated Conversations");
assert.match(inboxRoute, /where: currentUser\?\.role === "contractor"\s*\n\s*\? \{ contractorId: dbUserId \}\s*\n\s*: \{ homeownerId: dbUserId \}/, "each role is restricted to its own Conversation participant field");
assert.match(inboxRoute, /conversations: \{ none: \{\} \}/, "legacy Threads are only used when no isolated Conversation exists");
assert.doesNotMatch(inboxRoute, /unreadCount: t\._count\.messages,/, "inbox no longer assumes every row has a legacy _count relation");

console.log("inbox-loading regression tests passed");