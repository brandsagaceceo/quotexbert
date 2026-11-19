import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("../lib/prisma");
  const T = "backlog_digest";

  const grouped = await prisma.emailEvent.groupBy({
    by: ["status"],
    where: { type: T },
    _count: { _all: true },
  });
  console.log("backlog_digest EmailEvent rows by status:");
  for (const g of grouped) console.log(`  ${g.status.padEnd(8)} ${g._count._all}`);

  const sent = await prisma.emailEvent.findMany({
    where: { type: T, status: "sent" },
    select: { to: true, userId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  const distinctSent = new Set(sent.map((r) => r.to.toLowerCase()));
  console.log(`\nSENT rows: ${sent.length} | distinct recipients: ${distinctSent.size}`);

  // Confirm every SENT recipient is a contractor (no homeowners).
  const emails = [...distinctSent];
  const recipients = await prisma.user.findMany({
    where: { email: { in: emails, mode: "insensitive" } },
    select: { email: true, role: true, isActive: true },
  });
  const roleCounts: Record<string, number> = {};
  for (const r of recipients) roleCounts[r.role ?? "null"] = (roleCounts[r.role ?? "null"] || 0) + 1;
  console.log("Roles of SENT recipients:", JSON.stringify(roleCounts));
  const nonContractor = recipients.filter((r) => r.role !== "contractor");
  console.log(`Non-contractor SENT recipients: ${nonContractor.length}`);
  nonContractor.forEach((r) => console.log(`  !! ${r.email} role=${r.role}`));

  // At most one SENT per recipient?
  const perEmail = new Map<string, number>();
  for (const r of sent) perEmail.set(r.to.toLowerCase(), (perEmail.get(r.to.toLowerCase()) || 0) + 1);
  const overOne = [...perEmail.entries()].filter(([, n]) => n > 1);
  console.log(`Recipients with >1 SENT digest: ${overOne.length}`);
  overOne.forEach(([e, n]) => console.log(`  ${e}: ${n}`));

  // Skipped reasons
  const skipped = await prisma.emailEvent.findMany({
    where: { type: T, status: "skipped" },
    select: { to: true, error: true },
  });
  const reasons: Record<string, number> = {};
  for (const s of skipped) {
    let reason = "unknown";
    try { reason = JSON.parse(s.error || "{}").reason ?? "unknown"; } catch {}
    reasons[reason] = (reasons[reason] || 0) + 1;
  }
  console.log(`\nSKIPPED rows: ${skipped.length} | reasons:`, JSON.stringify(reasons));
  console.log(`Distinct skipped addresses: ${new Set(skipped.map((s) => s.to.toLowerCase())).size}`);

  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
