/**
 * READ-ONLY audit: distinct Lead.category values actually stored in production,
 * and how each normalizes via lib/categories.ts normalizeCategory(). No writes.
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";
import { normalizeCategory, SIMPLE_CATEGORIES } from "../lib/categories";

async function main() {
  const rows = await prisma.lead.groupBy({
    by: ["category"],
    _count: { _all: true },
    orderBy: { _count: { category: "desc" } },
  });
  console.log(`Distinct Lead.category values in production: ${rows.length}\n`);
  for (const r of rows) {
    const normalized = normalizeCategory(r.category);
    const isCanonical = (SIMPLE_CATEGORIES as readonly string[]).includes(r.category);
    console.log(`  "${r.category}"  count=${r._count._all}  canonical=${isCanonical}  normalizesTo="${normalized}"`);
  }

  // Also check ContractorSubscription.category values (what contractors actually pay for).
  const subRows = await prisma.contractorSubscription.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  console.log(`\nDistinct ContractorSubscription.category values: ${subRows.length}`);
  for (const r of subRows) {
    const isCanonical = (SIMPLE_CATEGORIES as readonly string[]).includes(r.category);
    console.log(`  "${r.category}"  count=${r._count._all}  canonical=${isCanonical}`);
  }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(async () => { await prisma.$disconnect(); });
