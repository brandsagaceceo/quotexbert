import { loadEnvConfig } from "@next/env";
import { prisma } from "@/lib/prisma";

loadEnvConfig(process.cwd());

const shouldApply = process.argv.includes("--apply");
const activeAcceptanceStatuses = ["accepted", "quoted", "selected"];
const activeApplicationStatuses = ["accepted", "in_progress", "completed"];

function parsePairKey(key: string): [string, string, string] {
  const parts = key.split("|");
  if (parts.length !== 3 || parts.some((part) => !part)) {
    throw new Error(`Invalid contractor conversation identity: ${key}`);
  }
  return [parts[0], parts[1], parts[2]];
}

async function main() {
  const [acceptances, applications, threads] = await Promise.all([
    prisma.jobAcceptance.findMany({
      where: { status: { in: activeAcceptanceStatuses } },
      select: { leadId: true, contractorId: true },
    }),
    prisma.jobApplication.findMany({
      where: { status: { in: activeApplicationStatuses } },
      select: { leadId: true, contractorId: true },
    }),
    prisma.thread.findMany({
      select: { leadId: true },
    }),
  ]);

  const leadIds = [...new Set([...acceptances, ...applications].map((row) => row.leadId))];
  const leads = await prisma.lead.findMany({
    where: { id: { in: leadIds } },
    select: { id: true, homeownerId: true },
  });
  const homeownerByLead = new Map(leads.map((lead) => [lead.id, lead.homeownerId]));
  const pairKeys = new Set<string>();
  for (const relationship of [...acceptances, ...applications]) {
    const homeownerId = homeownerByLead.get(relationship.leadId);
    if (homeownerId) {
      pairKeys.add(`${relationship.leadId}|${homeownerId}|${relationship.contractorId}`);
    }
  }

  const [allConversations, existingConversations] = await Promise.all([
    prisma.conversation.findMany({
      select: { jobId: true, homeownerId: true, contractorId: true },
    }),
    prisma.conversation.findMany({
      where: { jobId: { in: leadIds } },
      select: { jobId: true, homeownerId: true, contractorId: true },
    }),
  ]);
  const activePairKeys = pairKeys;
  const matchedExistingKeys = new Set(existingConversations
    .map((conversation) => `${conversation.jobId}|${conversation.homeownerId}|${conversation.contractorId}`)
    .filter((key) => activePairKeys.has(key)));
  const missingKeys = [...activePairKeys].filter((key) => !matchedExistingKeys.has(key));
  const globalOnlyConversationCount = allConversations.filter((conversation) =>
    !activePairKeys.has(`${conversation.jobId}|${conversation.homeownerId}|${conversation.contractorId}`),
  ).length;
  const legacyThreadLeadIds = new Set(threads.map((thread) => thread.leadId));
  const mergedLegacyProjectCount = new Set(
    [...activePairKeys]
      .map((key) => parsePairKey(key)[0])
      .filter((leadId) => legacyThreadLeadIds.has(leadId)),
  ).size;

  if (shouldApply) {
    for (const key of missingKeys) {
      const [jobId, homeownerId, contractorId] = parsePairKey(key);
      await prisma.conversation.upsert({
        where: {
          jobId_homeownerId_contractorId: { jobId, homeownerId, contractorId },
        },
        update: {},
        create: { jobId, homeownerId, contractorId, status: "active" },
      });
    }
  }

  console.log(JSON.stringify({
    mode: shouldApply ? "APPLY" : "DRY RUN",
    rawActiveJobAcceptanceRows: acceptances.length,
    rawActiveJobApplicationRows: applications.length,
    uniqueActiveContractorProjectPairs: pairKeys.size,
    totalConversationsGlobally: allConversations.length,
    activePairsWithExistingConversation: matchedExistingKeys.size,
    activePairsMissingConversation: missingKeys.length,
    wouldCreateConversations: shouldApply ? 0 : missingKeys.length,
    createdConversations: shouldApply ? missingKeys.length : 0,
    wouldSkipExistingActivePairs: matchedExistingKeys.size,
    globalOnlyOrNonActiveConversations: globalOnlyConversationCount,
    legacyThreadsAssociatedWithActiveProjects: mergedLegacyProjectCount,
    databaseWrites: shouldApply ? missingKeys.length : 0,
  }, null, 2));
}

main()
  .catch((error) => {
    console.error("Multi-contractor conversation repair failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });