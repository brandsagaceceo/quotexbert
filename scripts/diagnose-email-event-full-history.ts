import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  const rows = await prisma.$queryRawUnsafe<Array<{ type: string; day: Date; cnt: bigint }>>(`
    SELECT type, DATE("createdAt") as day, COUNT(*) as cnt
    FROM email_events
    WHERE type IN ('new_message','quote_received','new_job','quote_accepted','job_accepted')
    GROUP BY type, DATE("createdAt")
    ORDER BY day ASC
  `);
  console.log("Full per-day counts, oldest first:");
  for (const r of rows) {
    console.log(`  ${r.day.toISOString().slice(0, 10)}  ${r.type.padEnd(16)} count=${r.cnt}`);
  }

  // First-ever row per type, to see when each email type first appears at all.
  const firstEver = await prisma.$queryRawUnsafe<Array<{ type: string; first: Date }>>(`
    SELECT type, MIN("createdAt") as first
    FROM email_events
    GROUP BY type
    ORDER BY first ASC
  `);
  console.log("\nFirst-ever EmailEvent row per type:");
  for (const r of firstEver) console.log(`  ${r.type.padEnd(40)} ${r.first.toISOString()}`);

  // Oldest Quote rows overall, to see how far back quote data goes.
  const oldestQuote = await prisma.quote.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true, createdAt: true, status: true } });
  const newestQuote = await prisma.quote.findFirst({ orderBy: { createdAt: "desc" }, select: { id: true, createdAt: true, status: true } });
  console.log("\nOldest quote:", oldestQuote);
  console.log("Newest quote:", newestQuote);
  const totalQuotes = await prisma.quote.count();
  const sentQuotes = await prisma.quote.count({ where: { sentAt: { not: null } } });
  console.log(`Total quotes: ${totalQuotes}, with sentAt set: ${sentQuotes}`);
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
