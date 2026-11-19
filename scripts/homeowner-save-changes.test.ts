// Homeowner Save Changes regression — READ-ONLY proof that every real existing
// job's stored category normalizes to a valid canonical SIMPLE_CATEGORIES value
// (so the fixed edit-page dropdown will show it as selected), and that the PATCH
// route's new validation logic accepts canonical values while rejecting garbage.
// No writes — this only reads production data and re-implements the exact
// validation predicate from app/api/homeowner/jobs/[id]/route.ts for testing.
import assert from "node:assert/strict";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { prisma } from "../lib/prisma";
import { SIMPLE_CATEGORIES, CATEGORY_TO_SIMPLE, normalizeCategory } from "../lib/categories";

// Mirrors the exact predicate added to app/api/homeowner/jobs/[id]/route.ts
function isKnownCategory(rawCategory: string): boolean {
  return (SIMPLE_CATEGORIES as readonly string[]).some((c) => c.toLowerCase() === rawCategory.toLowerCase())
    || Object.keys(CATEGORY_TO_SIMPLE).some((k) => k.toLowerCase() === rawCategory.toLowerCase());
}

async function main() {
  // 1. Every distinct real Lead.category value normalizes to a canonical category
  //    (so no existing job becomes "unselectable" in the fixed edit dropdown).
  const rows = await prisma.lead.groupBy({ by: ["category"] });
  assert.ok(rows.length > 0, "sanity: production has lead category data to check against");
  for (const r of rows) {
    const normalized = normalizeCategory(r.category);
    assert.ok(
      (SIMPLE_CATEGORIES as readonly string[]).includes(normalized as any),
      `Lead.category "${r.category}" normalizes to a canonical category ("${normalized}")`
    );
  }

  // 2. Canonical dropdown values are always accepted by the new PATCH validation.
  for (const cat of SIMPLE_CATEGORIES) {
    assert.equal(isKnownCategory(cat), true, `canonical category "${cat}" is accepted by Save Changes validation`);
  }

  // 3. Known legacy/detailed aliases (old DB values / bookmarked clients) are still accepted.
  const sampleLegacyKeys = ["kitchen-renovation", "decks-fences", "handyman-services"];
  for (const key of sampleLegacyKeys) {
    assert.equal(isKnownCategory(key), true, `legacy alias "${key}" is still accepted by Save Changes validation`);
  }

  // 4. Genuinely invalid input is rejected (clean 400 in the real route).
  for (const bad of ["", "   ", "not-a-real-category-xyz"]) {
    assert.equal(isKnownCategory(bad.trim()), false, `invalid category "${bad}" is rejected`);
  }
}

main()
  .then(() => console.log("homeowner-save-changes tests passed"))
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
