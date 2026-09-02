import assert from "node:assert/strict";
import fs from "node:fs";

const acceptRoute = fs.readFileSync("app/api/jobs/[id]/accept/route.ts", "utf8");
const inboxRoute = fs.readFileSync("app/api/threads/route.ts", "utf8");
const messageRoute = fs.readFileSync("app/api/threads/[threadId]/messages/route.ts", "utf8");
const deleteRoute = fs.readFileSync("app/api/threads/[threadId]/route.ts", "utf8");
const legacyMessagesRoute = fs.readFileSync("app/api/messages/route.ts", "utf8");
const bridgeRoute = fs.readFileSync("app/api/conversations/for-thread/route.ts", "utf8");
const legacyConversationRoute = fs.readFileSync("app/api/conversations/[id]/messages/route.ts", "utf8");
const contractorInboxRoute = fs.readFileSync("app/api/contractor/conversations/route.ts", "utf8");
const repairScript = fs.readFileSync("scripts/repair-multi-contractor-conversations.ts", "utf8");

assert.match(acceptRoute, /prisma\.conversation\.upsert/, "acceptance creates or reuses a conversation");
assert.match(acceptRoute, /jobId_homeownerId_contractorId/, "conversation identity uses job, homeowner, and contractor");
assert.match(acceptRoute, /conversationMessage\.findFirst/, "repeated acceptance does not reseed messages");
assert.match(acceptRoute, /conversationId: conversation\.id/, "acceptance notification identifies the isolated conversation");

assert.match(inboxRoute, /prisma\.conversation\.findMany/, "inbox lists contractor-specific conversations");
assert.match(inboxRoute, /const conversationThreads: any\[\]/, "each conversation becomes an independent inbox entry");
assert.match(inboxRoute, /conversations: \{ none: \{\} \}/, "legacy shared threads are excluded after migration");
assert.match(messageRoute, /const conversation = await getConversation\(threadId\)/, "message transport resolves exact conversation IDs");
assert.match(messageRoute, /dbUserId !== conversation\.homeownerId && dbUserId !== conversation\.contractorId/, "GET blocks non-participants");
assert.match(messageRoute, /conversationMessage\.findMany/, "GET reads only the selected conversation");
assert.match(messageRoute, /conversationMessage\.create/, "POST writes only the selected conversation");
assert.match(messageRoute, /callerDbId !== dbFromUserId/, "POST rejects spoofed sender IDs");
assert.match(messageRoute, /dbToUserId !== conversation\.homeownerId && dbToUserId !== conversation\.contractorId/, "POST rejects cross-conversation recipients");
assert.match(messageRoute, /conversationMessage\.updateMany/, "mark-read is conversation-specific");
assert.match(deleteRoute, /conversation\.delete/, "conversation deletion is participant-authorized");
assert.match(bridgeRoute, /directConversation/, "quote bridge preserves the selected conversation");
assert.match(legacyConversationRoute, /resolveAuthUser/, "legacy conversation GET/POST requires authentication");
assert.match(contractorInboxRoute, /seenConversationKeys/, "contractor list preserves separate acceptance rows");
assert.match(contractorInboxRoute, /fromUserId: \{ in: contractorDbIds \}/, "contractor preview filters messages to the authenticated contractor");

assert.match(messageRoute, /isMigratedLegacyThread\(thread\) && dbUserId !== thread\.lead\.homeownerId/, "contractors cannot GET migrated legacy threads");
assert.match(messageRoute, /isMigratedLegacyThread\(thread\)[\s\S]{0,180}status: 409/, "POST to a migrated legacy thread is rejected");
assert.match(messageRoute, /isMigratedLegacyThread\(legacyThread\) && dbViewerId !== legacyThread\.lead\.homeownerId/, "contractors cannot mark migrated legacy threads read");
assert.match(deleteRoute, /Legacy shared threads with isolated conversations are read-only/, "migrated legacy threads cannot be deleted");
assert.match(legacyMessagesRoute, /Legacy shared thread access is archived/, "alternate legacy GET path blocks contractor access");
assert.match(legacyMessagesRoute, /legacy shared thread is archived/, "alternate legacy POST path blocks migrated threads");
assert.match(repairScript, /const shouldApply = process\.argv\.includes\("--apply"\)/, "repair requires explicit --apply");
assert.match(repairScript, /mode: shouldApply \? "APPLY" : "DRY RUN"/, "repair defaults to dry run");
assert.match(repairScript, /jobId_homeownerId_contractorId/, "repair uses the compound Conversation identity");
assert.doesNotMatch(repairScript, /conversationMessage|prisma\.message/, "repair does not copy legacy messages");

console.log("multi-contractor isolation tests passed");