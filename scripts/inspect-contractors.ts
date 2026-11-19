import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  const { prisma } = await import("../lib/prisma");
  const { isSendableEmail } = await import("../lib/email");
  const { getLeadNotificationAccess } = await import("../lib/notifications");

  const contractors = await prisma.user.findMany({
    where: { role: "contractor", isActive: true },
    select: {
      id: true, email: true, name: true, clerkUserId: true, notifyJobEmail: true, isActive: true,
      subscriptions: { select: { category: true, status: true, canClaimLeads: true, currentPeriodEnd: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`Active contractors: ${contractors.length}\n`);
  const header = ["deliverable", "paid", "clerk", "notifyJob", "access(Plumbing)", "email"].join(" | ");
  console.log(header);
  console.log("-".repeat(header.length + 20));

  let deliverablePaid = 0, deliverableFree = 0, clerkLinked = 0;
  for (const c of contractors) {
    const email = (c.email || "").toLowerCase();
    const deliverable = isSendableEmail(email);
    const paid = c.subscriptions.length > 0;
    const access = getLeadNotificationAccess(c as any, "Plumbing");
    if (deliverable && paid) deliverablePaid++;
    if (deliverable && !paid) deliverableFree++;
    if (c.clerkUserId) clerkLinked++;
    console.log(
      [
        deliverable ? "YES" : "no ",
        paid ? "PAID" : "free",
        c.clerkUserId ? "clerk" : "-----",
        c.notifyJobEmail === false ? "OFF" : "on ",
        access.padEnd(6),
        email,
      ].join("  |  ")
    );
  }

  console.log(`\nDeliverable PAID: ${deliverablePaid} | Deliverable FREE: ${deliverableFree} | Clerk-linked: ${clerkLinked}`);
  await prisma.$disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
