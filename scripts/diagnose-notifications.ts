/**
 * Read-only notification pipeline diagnostic.
 *
 * Reproduces the EXACT recipient-selection logic of
 * NotificationService.notifyAllContractors (lib/notifications.ts) against the
 * live database and reports, for a hypothetical new job:
 *   - how many contractors are selected
 *   - how many would receive an email vs be skipped, and WHY each is skipped
 *   - full vs teaser breakdown
 *   - contractor-type coverage (Google vs email/password, paid vs free)
 * plus recent EmailEvent delivery stats for new_job / new_message / digests.
 *
 * NOTHING is sent. No rows are written. Purely a SELECT-only audit.
 *
 * Usage:
 *   npx tsx scripts/diagnose-notifications.ts
 *   npx tsx scripts/diagnose-notifications.ts --category=Plumbing --city=Toronto
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { prisma } from "../lib/prisma";
import { getLeadNotificationAccess } from "../lib/notifications";
import { isSendableEmail } from "../lib/email";

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : undefined;
}

const jobCategory = arg("category") || "Plumbing";
const jobCity = arg("city") || undefined;

async function main() {
  console.log("=".repeat(70));
  console.log("NOTIFICATION PIPELINE DIAGNOSTIC (read-only)");
  console.log(`Simulated new job: category="${jobCategory}"  city="${jobCity ?? "(none)"}"`);
  console.log("=".repeat(70));

  console.log("\nENV:");
  console.log(`  DATABASE_URL     : ${process.env.DATABASE_URL ? "set" : "MISSING"}`);
  console.log(`  RESEND_API_KEY   : ${process.env.RESEND_API_KEY ? "set" : "MISSING"}`);
  console.log(`  MAIL_FROM        : ${process.env.MAIL_FROM || "(default) Quotexbert <no-reply@quotexbert.com>"}`);

  // Exact query used by notifyAllContractors.
  const contractors = await prisma.user.findMany({
    where: { role: "contractor", isActive: true },
    select: {
      id: true,
      email: true,
      name: true,
      clerkUserId: true,
      notifyJobEmail: true,
      notifyJobInApp: true,
      isActive: true,
      contractorProfile: { select: { companyName: true } },
      subscriptions: {
        select: { category: true, status: true, canClaimLeads: true, currentPeriodEnd: true },
      },
    },
  });

  // Population-level counts for context (including those the live query excludes).
  const [totalContractorRole, inactiveContractors, nullRoleUsers] = await Promise.all([
    prisma.user.count({ where: { role: "contractor" } }),
    prisma.user.count({ where: { role: "contractor", isActive: false } }),
    prisma.user.count({ where: { role: null } }),
  ]);

  console.log("\nPOPULATION:");
  console.log(`  role='contractor' (all)          : ${totalContractorRole}`);
  console.log(`  role='contractor' AND isActive   : ${contractors.length}  <-- entered the live query`);
  console.log(`  role='contractor' AND !isActive  : ${inactiveContractors}  (excluded: inactive)`);
  console.log(`  role=null (never chose a role)   : ${nullRoleUsers}  (excluded: no contractor role)`);

  let full = 0;
  let teaser = 0;
  let skipInactive = 0;

  const emailRecipients: string[] = [];
  const skippedNoEmail: string[] = [];
  const skippedOptOut: string[] = [];
  const emailSeen = new Set<string>();
  let dupCollapsed = 0;

  let googleCount = 0;
  let passwordCount = 0;
  let paidCount = 0;
  let freeCount = 0;

  for (const c of contractors) {
    const access = getLeadNotificationAccess(c as any, jobCategory);
    if (access === "skip") {
      skipInactive++;
      continue;
    }
    if (access === "full") full++;
    else teaser++;

    // Paid = has any subscription row (proxy); free = none.
    if (c.subscriptions.length > 0) paidCount++;
    else freeCount++;

    // Email-eligibility mirrors notifyAllContractors' emailRecipientMap loop.
    const email = c.email?.toLowerCase();
    if (!email) {
      skippedNoEmail.push(`${c.id} (${c.name ?? "no-name"})`);
      continue;
    }
    if (c.notifyJobEmail === false) {
      skippedOptOut.push(email);
      continue;
    }
    if (!isSendableEmail(email)) {
      skippedNoEmail.push(`${email} (undeliverable domain)`);
      continue;
    }
    if (emailSeen.has(email)) {
      dupCollapsed++;
      continue;
    }
    emailSeen.add(email);
    emailRecipients.push(email);

    // Signup-method proxy: clerkUserId present => Clerk-managed (Google or password).
    // We cannot see the OAuth provider from the DB, so we only confirm Clerk linkage.
    if (c.clerkUserId) googleCount++;
    else passwordCount++;
  }

  console.log("\nACCESS-LEVEL BREAKDOWN (active contractors):");
  console.log(`  full (paid, category match) : ${full}`);
  console.log(`  teaser (free / no match)    : ${teaser}`);
  console.log(`  skip (inactive)             : ${skipInactive}`);

  console.log("\nEMAIL RECIPIENTS (what notifyAllContractors would send):");
  console.log(`  WOULD SEND      : ${emailRecipients.length}`);
  console.log(`  skipped no-email: ${skippedNoEmail.length}`);
  console.log(`  skipped opt-out (notifyJobEmail=false): ${skippedOptOut.length}`);
  console.log(`  duplicate emails collapsed: ${dupCollapsed}`);

  console.log("\nCONTRACTOR-TYPE COVERAGE among would-send recipients:");
  console.log(`  paid (has subscription row): ${paidCount}`);
  console.log(`  free (no subscription)     : ${freeCount}`);
  console.log(`  Clerk-linked (Google/password): ${googleCount}`);
  console.log(`  legacy/non-clerk           : ${passwordCount}`);

  if (skippedOptOut.length) {
    console.log("\n  Opted out of job email (notifyJobEmail=false):");
    skippedOptOut.slice(0, 25).forEach((e) => console.log(`    - ${e}`));
    if (skippedOptOut.length > 25) console.log(`    ...and ${skippedOptOut.length - 25} more`);
  }
  if (skippedNoEmail.length) {
    console.log("\n  Skipped — invalid/missing email:");
    skippedNoEmail.slice(0, 25).forEach((e) => console.log(`    - ${e}`));
  }

  // Recent EmailEvent delivery stats.
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const events = await prisma.emailEvent.groupBy({
    by: ["type", "status"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
    orderBy: { type: "asc" },
  }).catch((e) => {
    console.log(`\n[warn] Could not read EmailEvent: ${e instanceof Error ? e.message : String(e)}`);
    return [] as Array<{ type: string; status: string; _count: { _all: number } }>;
  });

  console.log("\nEMAILEVENT LOG (last 14 days):");
  if (events.length === 0) {
    console.log("  (no email events recorded — pipeline may not have fired, or logging broken)");
  } else {
    for (const row of events) {
      console.log(`  type=${row.type.padEnd(16)} status=${String(row.status).padEnd(8)} count=${row._count._all}`);
    }
  }

  const latestJob = await prisma.emailEvent.findFirst({
    where: { type: "new_job" },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true, status: true },
  });
  console.log(`\n  Most recent new_job email event: ${latestJob ? `${latestJob.createdAt.toISOString()} (${latestJob.status})` : "NONE EVER"}`);

  console.log("\n" + "=".repeat(70));
  console.log("SUMMARY");
  console.log(`  Selected active contractors : ${contractors.length}`);
  console.log(`  Would email                 : ${emailRecipients.length}`);
  console.log(`  Skipped (opt-out)           : ${skippedOptOut.length}`);
  console.log(`  Skipped (no email)          : ${skippedNoEmail.length}`);
  console.log(`  Duplicates collapsed        : ${dupCollapsed}`);
  console.log("=".repeat(70));

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("DIAGNOSTIC FAILED:", e);
  await prisma.$disconnect();
  process.exit(1);
});
