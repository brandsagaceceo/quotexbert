/**
 * READ-ONLY: verify the NEW thread-list sort (latest message time, falling back
 * to thread.createdAt) actually reorders real threads vs the OLD sort
 * (thread.createdAt only), for a sample of real users who have >1 thread.
 * No writes.
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  // Find a homeowner or contractor with multiple threads to make the reorder visible.
  const leads = await prisma.lead.groupBy({
    by: ["homeownerId"],
    _count: { _all: true },
    having: { homeownerId: { _count: { gt: 1 } } },
    orderBy: { _count: { homeownerId: "desc" } },
    take: 3,
  });
  console.log("Homeowners with multiple leads/threads (candidates):", leads);

  for (const l of leads) {
    const homeownerId = l.homeownerId;
    const threads = await prisma.thread.findMany({
      where: { lead: { homeownerId } },
      include: {
        lead: { select: { id: true, title: true, createdAt: true } },
        messages: { take: 1, orderBy: { createdAt: "desc" }, select: { createdAt: true, body: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`\nHomeowner ${homeownerId} — ${threads.length} thread(s)`);
    console.log("  OLD order (thread.createdAt desc):");
    for (const t of threads) console.log(`    thread=${t.id} createdAt=${t.createdAt.toISOString()} lastMsg=${t.messages[0]?.createdAt?.toISOString() ?? "(none)"}`);

    const newOrder = [...threads].sort((a, b) => {
      const aTime = a.messages[0]?.createdAt ?? a.createdAt;
      const bTime = b.messages[0]?.createdAt ?? b.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    console.log("  NEW order (latest activity desc):");
    for (const t of newOrder) console.log(`    thread=${t.id} createdAt=${t.createdAt.toISOString()} lastMsg=${t.messages[0]?.createdAt?.toISOString() ?? "(none)"}`);

    const changed = threads.map(t => t.id).join(",") !== newOrder.map(t => t.id).join(",");
    console.log(`  Order changed by the fix: ${changed ? "YES" : "no (already in the same order)"}`);
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
