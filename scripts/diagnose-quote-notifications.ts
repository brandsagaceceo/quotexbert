/**
 * READ-ONLY audit: for the most recent real structured-quote sends/revisions,
 * verify whether the homeowner in-app Notification and EmailEvent rows actually
 * exist. No writes, no emails sent, no data modified.
 *
 * Usage: npx tsx scripts/diagnose-quote-notifications.ts [--limit=10]
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { prisma } from "../lib/prisma";

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : undefined;
}
const limit = Number(arg("limit") || 10);

async function main() {
  console.log("=".repeat(70));
  console.log("QUOTE NOTIFICATION/EMAIL DIAGNOSTIC (read-only, no writes)");
  console.log("=".repeat(70));
  console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? "set" : "MISSING"}`);

  // Real "sent" events only — sentAt is stamped exactly once, when status -> 'sent'.
  const quotes = await prisma.quote.findMany({
    where: { sentAt: { not: null } },
    orderBy: { sentAt: "desc" },
    take: limit,
    select: {
      id: true,
      jobId: true,
      contractorId: true,
      conversationId: true,
      status: true,
      version: true,
      parentQuoteId: true,
      sentAt: true,
      createdAt: true,
      updatedAt: true,
      conversation: { select: { homeownerId: true, contractorId: true } },
    },
  });

  console.log(`\nFound ${quotes.length} quote(s) with sentAt set (most recent first).\n`);

  for (const q of quotes) {
    const isRevision = (q.version ?? 1) > 1 || !!q.parentQuoteId;
    console.log("-".repeat(70));
    console.log(`Quote ${q.id}  [${isRevision ? "REVISION v" + q.version : "NEW (v1)"}]`);
    console.log(`  jobId=${q.jobId}  contractorId=${q.contractorId}  conversationId=${q.conversationId}`);
    console.log(`  status=${q.status}  sentAt=${q.sentAt?.toISOString()}  updatedAt=${q.updatedAt.toISOString()}`);

    const homeownerId = q.conversation?.homeownerId;
    if (!homeownerId) {
      console.log("  ⚠ No conversation.homeownerId resolvable — cannot check recipient rows.");
      continue;
    }
    console.log(`  homeownerId=${homeownerId}`);

    // 1. In-app notification, matched by relatedId first (exact), then by
    //    recipient+type+time-window as a fallback in case relatedId isn't set.
    const byRelatedId = await prisma.notification.findMany({
      where: { userId: homeownerId, type: "quote_received", relatedId: q.id },
      select: { id: true, title: true, message: true, payload: true, read: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });
    const windowStart = new Date((q.sentAt as Date).getTime() - 2 * 60 * 1000);
    const windowEnd = new Date((q.sentAt as Date).getTime() + 5 * 60 * 1000);
    const byTimeWindow = byRelatedId.length === 0
      ? await prisma.notification.findMany({
          where: {
            userId: homeownerId,
            type: "quote_received",
            createdAt: { gte: windowStart, lte: windowEnd },
          },
          select: { id: true, title: true, message: true, payload: true, read: true, createdAt: true },
          orderBy: { createdAt: "asc" },
        })
      : [];
    const notifs = byRelatedId.length > 0 ? byRelatedId : byTimeWindow;

    console.log(`  In-app Notification (type=quote_received, recipient=homeowner): ${notifs.length > 0 ? "YES" : "NO"} (count=${notifs.length}, matchedBy=${byRelatedId.length > 0 ? "relatedId" : (byTimeWindow.length > 0 ? "time-window-fallback" : "none")})`);
    for (const n of notifs) {
      console.log(`    - id=${n.id} createdAt=${n.createdAt.toISOString()} read=${n.read} title="${n.title}"`);
    }
    // Sanity: make sure the sender (contractor) never received this notification type for this quote.
    const wrongRecipient = await prisma.notification.count({
      where: { userId: q.contractorId, type: "quote_received", relatedId: q.id },
    });
    if (wrongRecipient > 0) {
      console.log(`  ⚠ ANOMALY: quote_received notification also found for the CONTRACTOR (sender) — count=${wrongRecipient}`);
    }

    // 2. EmailEvent — matched on type + recipient(userId) + relatedJobId, near sentAt.
    const emailEvents = await prisma.emailEvent.findMany({
      where: {
        type: "quote_received",
        userId: homeownerId,
        relatedJobId: q.jobId,
        createdAt: { gte: windowStart, lte: windowEnd },
      },
      select: { id: true, status: true, error: true, createdAt: true, to: true },
      orderBy: { createdAt: "asc" },
    });
    console.log(`  EmailEvent (type=quote_received, recipient=homeowner): ${emailEvents.length > 0 ? "YES" : "NO"} (count=${emailEvents.length})`);
    for (const e of emailEvents) {
      console.log(`    - id=${e.id} status=${e.status} createdAt=${e.createdAt.toISOString()}${e.error ? `  error="${e.error}"` : ""}`);
    }

    // 3. Homeowner's notification preference (reported only — quote emails don't gate on it in code).
    const homeowner = await prisma.user.findUnique({
      where: { id: homeownerId },
      select: { notifyMessageEmail: true, notifyJobEmail: true, isActive: true, email: true },
    });
    const maskedEmail = homeowner?.email ? homeowner.email.replace(/^(.{2}).*(@.*)$/, "$1***$2") : "(none)";
    console.log(`  Homeowner prefs: notifyMessageEmail=${homeowner?.notifyMessageEmail} notifyJobEmail=${homeowner?.notifyJobEmail} isActive=${homeowner?.isActive} email=${maskedEmail}`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("Done. No rows were written or modified.");
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
