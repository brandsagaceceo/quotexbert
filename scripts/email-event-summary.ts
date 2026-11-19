import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("../lib/prisma");
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const grouped = await prisma.emailEvent.groupBy({
    by: ["type", "status"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    _max: { createdAt: true },
  });
  grouped.sort((a, b) => a.type.localeCompare(b.type) || a.status.localeCompare(b.status));
  console.log("EmailEvent summary (last 30 days):");
  console.log("type".padEnd(22), "status".padEnd(10), "count".padEnd(7), "last");
  console.log("-".repeat(70));
  for (const g of grouped) {
    console.log(
      String(g.type).padEnd(22),
      String(g.status).padEnd(10),
      String(g._count._all).padEnd(7),
      g._max.createdAt ? g._max.createdAt.toISOString() : ""
    );
  }
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
