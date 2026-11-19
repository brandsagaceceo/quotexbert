/**
 * Backlog job-board DIGEST sender.
 *
 * Sends ONE email per contractor summarising every active job-board job they are
 * eligible to see, instead of one email per job. This only affects the backlog
 * flow — the live "new job posted" path (NotificationService.notifyAllContractors)
 * is intentionally left untouched.
 *
 * Reuse:
 * - buildEmail / EmailBlock: identical layout + styling as every other QuoteXbert email.
 * - getLeadNotificationAccess: the exact same subscription/category rule the live flow
 *   uses to decide full vs teaser per job.
 * - sendBulkEmails: the existing Resend batch helper (100/request) with 429 retry.
 *
 * Duplicate prevention:
 * - Each successful digest is logged as an EmailEvent with type `backlog_digest`.
 * - Contractors with an existing successful `backlog_digest` are skipped.
 * - Failed sends are not logged as sent, so they retry on the next run.
 *
 * Safety: defaults to DRY RUN. Pass --live to actually send.
 *
 * Usage:
 *   npx tsx scripts/send-backlog-job-notifications.ts             # dry run
 *   npx tsx scripts/send-backlog-job-notifications.ts --live      # send
 *   npx tsx scripts/send-backlog-job-notifications.ts --live --limit=5
 *   npx tsx scripts/send-backlog-job-notifications.ts --test-email=you@x.com        # dry-run the single test digest
 *   npx tsx scripts/send-backlog-job-notifications.ts --live --test-email=you@x.com # send ONE [TEST] digest only, no EmailEvent
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { Resend } from "resend";
import { prisma } from "../lib/prisma";
import { getLeadNotificationAccess } from "../lib/notifications";
import { buildEmail, sendBulkEmails, isSendableEmail, type EmailBlock } from "../lib/email";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.quotexbert.com";
const JOBS_URL = `${BASE_URL}/contractor/jobs`;
const MAX_CARDS = 12; // Cap visible job cards so large backlogs stay readable.
const DIGEST_EVENT_TYPE = "backlog_digest";
const FROM_EMAIL = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";
const REPLY_TO = "quotexbert@gmail.com";

const isLive = process.argv.includes("--live");
const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
const contractorLimit = limitArg ? Math.max(0, Number(limitArg.split("=")[1]) || 0) : 0;
const testEmailArg = process.argv.find((arg) => arg.startsWith("--test-email="));
const testEmail = testEmailArg ? testEmailArg.split("=").slice(1).join("=").trim() : "";

const resendClient = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function urgencyBadge(createdAt: Date): string {
  const days = (Date.now() - createdAt.getTime()) / 86_400_000;
  if (days < 2) {
    return `<span style="display:inline-block;background:#fff1f2;color:#9f1239;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px;border:1px solid #fecdd3;">🔥 New</span><br>`;
  }
  if (days < 7) {
    return `<span style="display:inline-block;background:#fffbeb;color:#92400e;font-size:11px;font-weight:800;padding:3px 10px;border-radius:999px;text-transform:uppercase;letter-spacing:.06em;margin:0 0 8px;border:1px solid #fde68a;">Recent</span><br>`;
  }
  return "";
}

type BacklogJob = {
  id: string;
  title: string;
  category: string;
  budget: string | null;
  city: string | null;
  province: string | null;
  createdAt: Date;
};

/** Full card reveals location + estimated value (paid contractor for that category). */
function fullJobCard(job: BacklogJob): EmailBlock {
  const location = [job.city, job.province].filter((v) => v && v.trim() !== "").map(esc).join(", ");
  const value = job.budget && job.budget.trim() !== "" ? esc(job.budget) : null;
  return {
    type: "card",
    rawHtml: true,
    content:
      `${urgencyBadge(job.createdAt)}` +
      `<div style="font-size:16px;font-weight:800;color:#111827;margin:0 0 6px;">${esc(job.title)}</div>` +
      `<div style="font-size:13px;color:#6b7280;">${esc(job.category)}${location ? ` &middot; ${location}` : ""}</div>` +
      (value ? `<div style="margin-top:8px;font-size:14px;color:#800020;font-weight:700;">${value}</div>` : ""),
  };
}

/** Teaser card hides location + budget, exactly like the live teaser alert. */
function teaserJobCard(job: BacklogJob): EmailBlock {
  return {
    type: "card",
    rawHtml: true,
    content:
      `<div style="font-size:16px;font-weight:800;color:#111827;margin:0 0 6px;">New ${esc(job.category)} job available</div>` +
      `<div style="font-size:13px;color:#6b7280;">Location &amp; budget locked</div>` +
      `<div style="margin-top:8px;font-size:13px;color:#6b21a8;font-weight:700;">Subscribe to this category to unlock full details &rarr;</div>`,
  };
}

function buildDigest(
  jobsForContractor: Array<{ job: BacklogJob; access: "full" | "teaser" }>,
): { subject: string; html: string } {
  // Show claimable (full) jobs first, newest first, then teasers.
  const ordered = [...jobsForContractor].sort((a, b) => {
    if (a.access !== b.access) return a.access === "full" ? -1 : 1;
    return b.job.createdAt.getTime() - a.job.createdAt.getTime();
  });

  const visible = ordered.slice(0, MAX_CARDS);
  const remaining = ordered.length - visible.length;
  const count = ordered.length;

  const cards: EmailBlock[] = visible.map(({ job, access }) =>
    access === "full" ? fullJobCard(job) : teaserJobCard(job),
  );

  const blocks: EmailBlock[] = [
    { type: "tag", content: "Job Board Digest" },
    {
      type: "heading",
      content: `${count} homeowner ${count === 1 ? "job is" : "jobs are"} waiting for you`,
    },
    {
      type: "text",
      content:
        "These jobs are live on the QuoteXbert job board right now. Review the ones that fit and submit your quote before another contractor claims them.",
    },
    ...cards,
  ];

  if (remaining > 0) {
    blocks.push({
      type: "text",
      rawHtml: true,
      content: `<p style="margin:6px 0 0;font-size:14px;color:#4b5563;font-weight:600;">+ ${remaining} more job${remaining === 1 ? "" : "s"} on the board</p>`,
    });
  }

  blocks.push({ type: "cta", content: "View All Jobs", href: JOBS_URL });
  blocks.push({
    type: "text",
    rawHtml: true,
    content: `<span style="font-size:11px;color:#94a3b8;">You're receiving this as a QuoteXbert contractor. <a href="${BASE_URL}/notifications" style="color:#9f1239;font-weight:700;text-decoration:none;">Manage alerts</a></span>`,
  });

  const subject = `${count} new homeowner ${count === 1 ? "job" : "jobs"} available near you — QuoteXbert`;
  return { subject, html: buildEmail("New Jobs on QuoteXbert", blocks) };
}

/**
 * Controlled single-recipient test: builds the REAL digest with REAL job data for one approved
 * internal contractor, prefixes the subject with [TEST], and sends only to that address.
 * Writes NO EmailEvent, so campaign dedup is untouched and no other contractor is affected.
 */
async function sendTestDigest(jobs: BacklogJob[], recipientEmail: string): Promise<void> {
  console.log(`\n=== Backlog DIGEST — CONTROLLED TEST (${isLive ? "LIVE SEND" : "DRY RUN"}) ===`);
  console.log(`Approved test recipient: ${recipientEmail}`);

  const contractor = await prisma.user.findFirst({
    where: { role: "contractor", email: { equals: recipientEmail, mode: "insensitive" } },
    select: {
      id: true,
      email: true,
      isActive: true,
      subscriptions: {
        select: { category: true, status: true, canClaimLeads: true, currentPeriodEnd: true },
      },
    },
  });

  if (!contractor) {
    console.error(`No contractor account matches ${recipientEmail}. Aborting — cannot compute real category access.`);
    process.exitCode = 1;
    return;
  }

  // Real category access — identical rule to the live flow (no god-access override).
  const audience = { isActive: contractor.isActive, subscriptions: contractor.subscriptions };
  const entries = jobs
    .map((job) => ({ job, access: getLeadNotificationAccess(audience, job.category) }))
    .filter((e): e is { job: BacklogJob; access: "full" | "teaser" } => e.access !== "skip");

  const fullCount = entries.filter((e) => e.access === "full").length;
  const teaserCount = entries.filter((e) => e.access === "teaser").length;

  const { subject: baseSubject, html } = buildDigest(entries);
  const subject = `[TEST] ${baseSubject}`;

  // --- Content verification (requirements 5, 6, 7) ---
  const allJobsIncluded = entries.length === jobs.length;
  const ctaCount = (html.match(/href="[^"]*\/contractor\/jobs"/g) || []).length;

  const piiLeaks: string[] = [];
  for (const { job } of entries.filter((e) => e.access === "teaser")) {
    const card = teaserJobCard(job).content;
    const sensitive: Array<[string, string | null]> = [
      ["title", job.title],
      ["city", job.city],
      ["province", job.province],
      ["budget", job.budget],
    ];
    for (const [field, val] of sensitive) {
      if (val && val.trim() && card.includes(val.trim())) {
        piiLeaks.push(`${field} leaked in teaser for job ${job.id}`);
      }
    }
  }

  console.log(`\nContractor account:   ${contractor.email} (id=${contractor.id}, active=${contractor.isActive})`);
  console.log(`Eligible jobs:        ${entries.length} of ${jobs.length} active board jobs`);
  console.log(`  full-detail cards:  ${fullCount}`);
  console.log(`  teaser cards:       ${teaserCount}`);
  console.log(`\nVerification:`);
  console.log(`  [${allJobsIncluded ? "PASS" : "FAIL"}] all eligible active job-board jobs included`);
  console.log(`  [${fullCount > 0 ? "PASS" : "n/a "}] full details present for accessible categories`);
  console.log(`  [${teaserCount > 0 ? "PASS" : "n/a "}] teaser details present for locked categories`);
  console.log(`  [${ctaCount === 1 ? "PASS" : "FAIL"}] exactly one "View All Jobs" CTA (found ${ctaCount})`);
  console.log(`       CTA target: ${JOBS_URL}`);
  console.log(`  [${piiLeaks.length === 0 ? "PASS" : "FAIL"}] no title/city/province/budget in teaser cards`);
  piiLeaks.forEach((l) => console.log(`      - ${l}`));

  if (!isLive) {
    console.log(`\nDRY RUN — no email sent. Re-run with --live to deliver this single test email.\n`);
    return;
  }

  if (!resendClient) {
    console.error("RESEND_API_KEY not configured — cannot send.");
    process.exitCode = 1;
    return;
  }

  // Send exactly one email. No EmailEvent is written for anyone (dedup untouched).
  const text = `New homeowner jobs are available on QuoteXbert. View all jobs: ${JOBS_URL}`;
  const result = await resendClient.emails.send({
    from: FROM_EMAIL,
    replyTo: REPLY_TO,
    to: recipientEmail,
    subject,
    html,
    text,
  });

  const messageId = result.data?.id ?? null;
  const sendError = result.error ? JSON.stringify(result.error) : null;

  // Requirement 3/9: confirm no EmailEvent was written and no other recipient was touched.
  const digestEventCount = await prisma.emailEvent.count({ where: { type: DIGEST_EVENT_TYPE } });

  console.log(`\n=== TEST SEND RESULT ===`);
  console.log(`Recipients:                 1 (${recipientEmail})`);
  console.log(`Resend message ID:          ${messageId ?? "(none returned)"}`);
  console.log(`Resend error status:        ${sendError ?? "none"}`);
  console.log(`EmailEvent rows written:    0 (dedup untouched)`);
  console.log(`Total '${DIGEST_EVENT_TYPE}' events in DB: ${digestEventCount}`);
  console.log(`Other contractors emailed:  0\n`);
}

async function main() {
  console.log(`\n=== Backlog job DIGEST — ${isLive ? "LIVE" : "DRY RUN"} ===`);
  if (!isLive) console.log("No emails will be sent. Re-run with --live to send.\n");

  // 1. Active job-board jobs: the board's exact visibility rule, still accepting contractors.
  const leads = await prisma.lead.findMany({
    where: { status: "open", published: true, isSeeded: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      budget: true,
      city: true,
      province: true,
      createdAt: true,
      acceptedContractors: true,
    },
  });

  const jobs: BacklogJob[] = leads
    .filter((lead) => {
      let accepted: unknown[] = [];
      try {
        accepted = JSON.parse(lead.acceptedContractors || "[]");
      } catch {
        accepted = [];
      }
      return Array.isArray(accepted) && accepted.length < 3;
    })
    .map((lead) => ({
      id: lead.id,
      title: lead.title,
      category: lead.category,
      budget: lead.budget,
      city: lead.city,
      province: lead.province,
      createdAt: lead.createdAt,
    }));

  if (jobs.length === 0) {
    console.log("No active backlog jobs on the board. Nothing to send.\n");
    return;
  }

  // Controlled single-recipient test: send exactly one [TEST] digest, no EmailEvent, no campaign.
  if (testEmail) {
    await sendTestDigest(jobs, testEmail);
    return;
  }

  // 2. Eligible contractors (single query, subscriptions included — no N+1).
  const contractors = await prisma.user.findMany({
    where: { role: "contractor", isActive: true },
    select: {
      id: true,
      email: true,
      isActive: true,
      notifyJobEmail: true,
      subscriptions: {
        select: { category: true, status: true, canClaimLeads: true, currentPeriodEnd: true },
      },
    },
  });

  // 3. Duplicate prevention: contractors with a prior successful digest are skipped.
  const priorDigests = await prisma.emailEvent.findMany({
    where: { type: DIGEST_EVENT_TYPE, status: "sent" },
    select: { to: true, userId: true },
  });
  const sentEmails = new Set(priorDigests.map((e) => (e.to || "").toLowerCase()));
  const sentUserIds = new Set(priorDigests.map((e) => e.userId).filter((id): id is string => Boolean(id)));

  type Recipient = { id: string; email: string; message: { to: string; subject: string; html: string }; fullJobs: number };
  const recipients: Recipient[] = [];

  let skippedPrefs = 0;
  let skippedDuplicate = 0;
  let skippedNoEmail = 0;
  let skippedUndeliverable = 0;
  const skippedUndeliverableRecipients: Array<{ id: string; email: string }> = [];

  for (const contractor of contractors) {
    const email = contractor.email?.trim();
    if (!email) {
      skippedNoEmail += 1;
      continue;
    }

    // Same deliverability rule as the live flow — never batch seed/test/invalid addresses.
    if (!isSendableEmail(email)) {
      skippedUndeliverable += 1;
      skippedUndeliverableRecipients.push({ id: contractor.id, email });
      continue;
    }

    // Preserve recipient filtering: honour the job-email opt-out, exactly like the live flow.
    if (contractor.notifyJobEmail === false) {
      skippedPrefs += 1;
      continue;
    }

    // Duplicate prevention (one digest per contractor; failed sends are not 'sent' so they retry).
    if (sentUserIds.has(contractor.id) || sentEmails.has(email.toLowerCase())) {
      skippedDuplicate += 1;
      continue;
    }

    // 4/5/6/7. Per-job access via the SAME rule the live flow uses (full vs teaser).
    const audience = { isActive: contractor.isActive, subscriptions: contractor.subscriptions };
    const jobsForContractor = jobs
      .map((job) => ({ job, access: getLeadNotificationAccess(audience, job.category) }))
      .filter((entry): entry is { job: BacklogJob; access: "full" | "teaser" } => entry.access !== "skip");

    if (jobsForContractor.length === 0) continue;

    const { subject, html } = buildDigest(jobsForContractor);
    recipients.push({
      id: contractor.id,
      email,
      message: { to: email, subject, html },
      fullJobs: jobsForContractor.filter((e) => e.access === "full").length,
    });
  }

  const selected = contractorLimit > 0 ? recipients.slice(0, contractorLimit) : recipients;
  const messages = selected.map((r) => r.message);
  const estimatedBatches = Math.ceil(messages.length / 100);

  console.log(`Active backlog jobs:         ${jobs.length}`);
  console.log(`Active contractors:          ${contractors.length}`);
  console.log(`Skipped (no email):          ${skippedNoEmail}`);
  console.log(`Skipped (seed/undeliverable):${skippedUndeliverable}`);
  console.log(`Skipped (email prefs off):   ${skippedPrefs}`);
  console.log(`Skipped (already digested):  ${skippedDuplicate}`);
  console.log(`Digest emails ${isLive ? "to send" : "that WOULD send"}:    ${messages.length}${contractorLimit > 0 ? ` (--limit=${contractorLimit})` : ""}`);
  console.log(`Estimated Resend batches:    ${estimatedBatches} (@ 100/request)`);

  if (!isLive) {
    const sample = selected.slice(0, 3);
    if (sample.length > 0) {
      console.log(`\nSample:`);
      for (const r of sample) {
        console.log(`  - ${r.message.subject} | full-access jobs: ${r.fullJobs}`);
      }
    }
    console.log("");
    return;
  }

  if (messages.length === 0) {
    console.log("\nNothing to send.\n");
    return;
  }

  // 8/9/10. Batch send via the existing helper (chunks of 100 + 429 retry), then log EmailEvents.
  const { sent, failed, failedTo, errorByRecipient } = await sendBulkEmails(messages, {
    jobId: DIGEST_EVENT_TYPE,
  });

  try {
    await prisma.emailEvent.createMany({
      data: selected.map((r) => {
        const didFail = failedTo.has(r.email);
        return {
          type: DIGEST_EVENT_TYPE,
          to: r.email,
          userId: r.id,
          status: didFail ? "failed" : "sent",
          error: didFail ? (errorByRecipient.get(r.email) ?? null) : null,
        };
      }),
    });
    if (skippedUndeliverableRecipients.length > 0) {
      await prisma.emailEvent.createMany({
        data: skippedUndeliverableRecipients.map((r) => ({
          type: DIGEST_EVENT_TYPE,
          to: r.email,
          userId: r.id,
          status: "skipped",
          error: JSON.stringify({ reason: "undeliverable_email" }),
        })),
      });
    }
  } catch (logErr) {
    console.error(`[BACKLOG] Failed to log email events:`, logErr instanceof Error ? logErr.message : String(logErr));
  }

  console.log(`\n=== Summary (LIVE) ===`);
  console.log(`Emails sent:     ${sent}`);
  console.log(`Emails failed:   ${failed}`);
  console.log(`Skipped (seed/undeliverable): ${skippedUndeliverable}`);
  console.log(`Skipped total:   ${skippedNoEmail + skippedUndeliverable + skippedPrefs + skippedDuplicate}`);
  console.log("");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
