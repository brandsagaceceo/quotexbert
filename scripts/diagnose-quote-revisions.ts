import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  const revisions = await prisma.quote.findMany({
    where: { OR: [{ version: { gt: 1 } }, { parentQuoteId: { not: null } }] },
    select: { id: true, jobId: true, contractorId: true, version: true, parentQuoteId: true, status: true, sentAt: true, createdAt: true },
  });
  console.log(`Quotes with version>1 OR parentQuoteId set (i.e. an actual revision draft/send exists): ${revisions.length}`);
  for (const r of revisions) console.log(" ", r);

  const revisionRequested = await prisma.quote.findMany({
    where: { status: "revision_requested" },
    select: { id: true, jobId: true, contractorId: true, version: true, parentQuoteId: true, status: true, sentAt: true, createdAt: true, updatedAt: true, revisionNote: true },
  });
  console.log(`\nQuotes currently in status='revision_requested': ${revisionRequested.length}`);
  for (const r of revisionRequested) console.log(" ", { ...r, revisionNote: r.revisionNote ? "(present)" : null });

  // For each revision_requested quote, check whether a CHILD quote (revision draft) was ever created.
  for (const r of revisionRequested) {
    const child = await prisma.quote.findFirst({ where: { parentQuoteId: r.id }, select: { id: true, status: true, version: true, sentAt: true, createdAt: true } });
    console.log(`  -> child revision draft for ${r.id}:`, child || "NONE — revise was never started/completed");
  }

  // Also check: was a notification ever created for the contractor when this became revision_requested?
  for (const r of revisionRequested) {
    const notif = await prisma.notification.findMany({
      where: { userId: r.contractorId, type: "quote_revision_requested", relatedId: r.id },
      select: { id: true, createdAt: true, read: true },
    });
    console.log(`  -> quote_revision_requested notification(s) for contractor on ${r.id}:`, notif);
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
