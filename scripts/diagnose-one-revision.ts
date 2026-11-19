import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  const revisionQuoteId = "cmp5zk5yp0001l804mt6ybrn1";
  const q = await prisma.quote.findUnique({
    where: { id: revisionQuoteId },
    select: { id: true, jobId: true, contractorId: true, conversationId: true, sentAt: true, status: true, conversation: { select: { homeownerId: true } } },
  });
  console.log("Revision quote:", q);
  if (q?.conversation?.homeownerId) {
    const notif = await prisma.notification.findMany({
      where: { userId: q.conversation.homeownerId, type: "quote_received", relatedId: q.id },
      select: { id: true, title: true, createdAt: true, read: true },
    });
    console.log("Homeowner in-app notification for this revision send:", notif.length > 0 ? notif : "NONE FOUND");
  }
  // parent quote, for context
  const parent = await prisma.quote.findUnique({ where: { id: "cmp5yxwxx0008l204g8pqbwpz" }, select: { id: true, status: true, sentAt: true, version: true } });
  console.log("Parent (original) quote:", parent);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
