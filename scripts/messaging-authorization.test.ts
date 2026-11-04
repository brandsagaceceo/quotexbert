import assert from "node:assert/strict";
import fs from "node:fs";
import {
  isConversationMessagePair,
  isConversationParticipant,
  isLegacyMessagePair,
  isLegacyThreadParticipant,
  legacyMessageVisibilityWhere,
} from "../lib/messaging-access";

const homeowner = "homeowner-db-id";
const contractor = "contractor-db-id";
const contractorTwo = "second-contractor-db-id";
const outsider = "outsider-db-id";
const conversation = { homeownerId: homeowner, contractorId: contractor };
const legacyContractors = [contractor, contractorTwo];

assert.equal(isConversationParticipant(homeowner, conversation), true);
assert.equal(isConversationParticipant(contractor, conversation), true);
assert.equal(isConversationParticipant(outsider, conversation), false);
assert.equal(
  isConversationMessagePair(homeowner, contractor, conversation),
  true,
);
assert.equal(
  isConversationMessagePair(contractor, homeowner, conversation),
  true,
);
assert.equal(
  isConversationMessagePair(homeowner, outsider, conversation),
  false,
);
assert.equal(
  isConversationMessagePair(contractor, contractor, conversation),
  false,
);

assert.equal(
  isLegacyThreadParticipant(homeowner, homeowner, legacyContractors),
  true,
);
assert.equal(
  isLegacyThreadParticipant(contractorTwo, homeowner, legacyContractors),
  true,
);
assert.equal(
  isLegacyThreadParticipant(outsider, homeowner, legacyContractors),
  false,
);
assert.equal(
  isLegacyMessagePair(homeowner, contractorTwo, homeowner, legacyContractors),
  true,
);
assert.equal(
  isLegacyMessagePair(contractorTwo, homeowner, homeowner, legacyContractors),
  true,
);
assert.equal(
  isLegacyMessagePair(contractor, contractorTwo, homeowner, legacyContractors),
  false,
);
assert.equal(
  isLegacyMessagePair(homeowner, outsider, homeowner, legacyContractors),
  false,
);
assert.deepEqual(legacyMessageVisibilityWhere(homeowner, homeowner), {});
assert.deepEqual(legacyMessageVisibilityWhere(contractor, homeowner), {
  OR: [
    { fromUserId: contractor, toUserId: homeowner },
    { fromUserId: homeowner, toUserId: contractor },
  ],
});

const source = (path: string) => fs.readFileSync(path, "utf8");
const routeContracts = [
  [
    "app/api/conversations/route.ts",
    /resolveAuthUser/,
    /requestedUserId !== dbUserId/,
    /senderId: dbUserId/,
  ],
  [
    "app/api/conversations/[id]/route.ts",
    /resolveAuthUser/,
    /dbUserId !== conversation\.homeownerId/,
    /conversationMessage\.deleteMany/,
  ],
  [
    "app/api/conversations/[id]/messages/route.ts",
    /resolveAuthUser/,
    /requestedSender\.id !== dbUserId/,
    /isConversationMessagePair/,
    /senderId: dbUserId/,
  ],
  [
    "app/api/messages/route.ts",
    /resolveAuthUser/,
    /requestedSender\.id !== dbUserId/,
    /isLegacyMessagePair/,
    /legacyMessageVisibilityWhere/,
    /conversations: \{ none: \{\} \}/,
  ],
  [
    "app/api/messages/mark-read/route.ts",
    /resolveAuthUser/,
    /requestedUser\.id !== dbUserId/,
    /receiverId: dbUserId/,
  ],
  [
    "app/api/messages/unread-count/route.ts",
    /resolveAuthUser/,
    /userId !== dbUserId && userId !== clerkUserId/,
    /receiverId: dbUserId/,
  ],
  [
    "app/api/threads/create/route.ts",
    /resolveAuthUser/,
    /isLegacyThreadParticipant/,
    /logEventServer\("thread_created", dbUserId/,
  ],
  [
    "app/api/threads/[threadId]/messages/route.ts",
    /resolveAuthUser/,
    /isLegacyMessagePair/,
    /legacyMessageVisibilityWhere/,
    /!isThreadParticipant\(legacyThread, dbViewerId\)/,
  ],
  [
    "app/api/threads/[threadId]/route.ts",
    /resolveAuthUser/,
    /thread\.lead\.conversations\.length > 0/,
    /participantIds\.has\(dbUserId\)/,
  ],
  [
    "app/api/typing-indicators/route.ts",
    /resolveAuthUser/,
    /getAccessibleHomeownerId\(threadId, dbUserId\)/,
    /userId: dbUserId === homeownerId/,
  ],
  [
    "app/api/threads/route.ts",
    /currentUser\?\.role === "contractor"[\s\S]*senderId: dbUserId/,
    /contractorId: dbUserId/,
  ],
];

for (const [path, ...checks] of routeContracts) {
  const contents = source(path as string);
  for (const check of checks) {
    assert.match(
      contents,
      check as RegExp,
      `${path} enforces ${String(check)}`,
    );
  }
}

const serverAuth = source("lib/server-auth.ts");
assert.match(
  serverAuth,
  /OR: \[\{ id: clerkId \}, \{ clerkUserId: clerkId \}\]/,
);

console.log("messaging-authorization tests passed");
