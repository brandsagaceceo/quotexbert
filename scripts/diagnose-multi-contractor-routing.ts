/**
 * READ-ONLY audit: find a real homeowner Lead with 2+ distinct message senders
 * (i.e. 2+ contractors messaging the same homeowner in the SAME Thread), to
 * reproduce the "wrong contractor chat opens" bug. Also samples real NEW_MESSAGE
 * notifications to inspect their stored sender/threadId/payload shape.
 * No writes.
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  console.log("=".repeat(70));
  console.log("MULTI-CONTRACTOR THREAD ROUTING AUDIT (read-only)");
  console.log("=".repeat(70));

  // 1. Find leads where 2+ DISTINCT contractor userIds have JobAcceptance rows
  //    (i.e. multiple contractors legitimately engaged with the same job).
  const multiAcceptLeads = await prisma.jobAcceptance.groupBy({
    by: ["leadId"],
    _count: { _all: true },
  });
  const candidateLeadIds = multiAcceptLeads.filter(r => r._count._all >= 2).map(r => r.leadId);
  console.log(`\nLeads with >=2 JobAcceptance rows (candidate multi-contractor jobs): ${candidateLeadIds.length}`);

  for (const leadId of candidateLeadIds.slice(0, 10)) {
    const acceptances = await prisma.jobAcceptance.findMany({
      where: { leadId },
      select: { contractorId: true, status: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, homeownerId: true, contractorId: true, acceptedById: true, title: true },
    });
    const thread = await prisma.thread.findUnique({ where: { leadId }, select: { id: true } });
    console.log(`\nLead ${leadId} ("${lead?.title}")`);
    console.log(`  homeownerId=${lead?.homeownerId}`);
    console.log(`  lead.contractorId (primary/first)=${lead?.contractorId}  acceptedById=${lead?.acceptedById}`);
    console.log(`  JobAcceptance contractors: ${acceptances.map(a => `${a.contractorId}(${a.status})`).join(", ")}`);
    console.log(`  Thread: ${thread ? thread.id : "NONE"}`);

    if (thread) {
      // Distinct senders who have actually posted a Message in this shared thread.
      const senders = await prisma.message.findMany({
        where: { threadId: thread.id },
        select: { fromUserId: true },
        distinct: ["fromUserId"],
      });
      console.log(`  Distinct message senders in this ONE thread: ${senders.map(s => s.fromUserId).join(", ")}`);
    }
  }

  // 2. Sample real NEW_MESSAGE notifications to inspect stored shape.
  console.log("\n" + "-".repeat(70));
  console.log("Sample recent NEW_MESSAGE notifications (payload shape):");
  const notifs = await prisma.notification.findMany({
    where: { type: "NEW_MESSAGE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, userId: true, title: true, payload: true, relatedId: true, relatedType: true, createdAt: true },
  });
  for (const n of notifs) {
    console.log(`  id=${n.id} recipient=${n.userId} title="${n.title}" createdAt=${n.createdAt.toISOString()}`);
    console.log(`    payload=`, n.payload);
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
