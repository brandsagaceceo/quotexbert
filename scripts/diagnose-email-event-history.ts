/**
 * READ-ONLY: aggregate EmailEvent counts by type/status and by day, to determine
 * whether the historical "no EmailEvent row" gap for quote_received is specific
 * to quotes or reflects a broader production email delivery issue (e.g. missing
 * RESEND_API_KEY in a given environment). No writes.
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";

async function main() {
  const byType = await prisma.emailEvent.groupBy({
    by: ["type", "status"],
    _count: { _all: true },
  });
  console.log("EmailEvent counts by type+status (all time):");
  for (const r of byType) console.log(`  ${r.type} / ${r.status}: ${r._count._all}`);

  const rows = await prisma.$queryRawUnsafe<Array<{ type: string; day: Date; cnt: bigint }>>(`
    SELECT type, DATE("createdAt") as day, COUNT(*) as cnt
    FROM email_events
    WHERE type IN ('new_message','quote_received','new_job','quote_accepted')
    GROUP BY type, DATE("createdAt")
    ORDER BY day DESC
    LIMIT 60
  `);
  console.log("\nPer-day counts (new_message / quote_received / new_job / quote_accepted), most recent first:");
  for (const r of rows) {
    console.log(`  ${r.day.toISOString().slice(0, 10)}  ${r.type.padEnd(16)} count=${r.cnt}`);
  }

  console.log("\nEnv check (this process, i.e. local/.env.local):");
  console.log(`  RESEND_API_KEY set: ${!!process.env.RESEND_API_KEY}`);
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
