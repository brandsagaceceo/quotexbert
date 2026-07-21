import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe";
import { FOUNDING_CONTRACTOR_SPOTS_REMAINING, isFoundingOfferEnabled } from "@/lib/founding-contractor-config";
import { isUnlimitedTestContractor } from "@/lib/god-access";

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.quotexbert.com";
/** @deprecated use BASE_URL */
const baseUrl = BASE_URL;
const REPLY_TO = 'quotexbert@gmail.com';
const CONTRACTOR_ONBOARDING_CAMPAIGN = 'contractor_onboarding_offer';
const CONTRACTOR_ONBOARDING_REMINDER_CAMPAIGN = 'contractor_onboarding_offer_reminder';
const LOGO_URL = `${BASE_URL}/logo.svg`;

function htmlToPlainText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/h[1-6]>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

const resend = resendClient
  ? {
      emails: {
        send: (payload: any) =>
          resendClient.emails.send({
            ...payload,
            text: payload.text || htmlToPlainText(payload.html || ''),
          }),
      },
    }
  : null;

export async function sendSharedEmail({
  to,
  subject,
  html,
  text,
  replyTo = REPLY_TO,
}: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping email:', subject);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo,
      to,
      subject,
      html,
      text,
    });
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send shared email:', error);
    return { success: false, error };
  }
}

// Email event logging (NO SECRETS)
async function logEmailEvent(
  type: string,
  to: string,
  userId?: string,
  relatedJobId?: string,
  relatedMessageId?: string,
  status: 'sent' | 'failed' = 'sent',
  error?: string
) {
  try {
    await prisma.$executeRaw`
      INSERT INTO "EmailEvent" (
        "id",
        "type",
        "to",
        "userId",
        "relatedJobId",
        "relatedMessageId",
        "status",
        "error",
        "createdAt"
      ) VALUES (
        'email_' || substr(md5(random()::text), 1, 16),
        ${type},
        ${to},
        ${userId},
        ${relatedJobId},
        ${relatedMessageId},
        ${status},
        ${error},
        NOW()
      )
    `;
  } catch (err) {
    console.error('[EMAIL] Failed to log email event:', err);
  }
}

/**
 * Rate limiting for new lead emails
 * Maximum 5 new lead emails per contractor per hour
 */
async function checkEmailRateLimit(userId: string, emailType: string = 'new_lead'): Promise<boolean> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const recentEmails = await prisma.emailEvent.count({
      where: {
        userId,
        type: emailType,
        status: 'sent',
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    // Allow maximum 5 emails per hour
    return recentEmails < 5;
  } catch (error) {
    console.error('[EMAIL] Failed to check rate limit:', error);
    // On error, allow the email (fail open)
    return true;
  }
}

/**
 * Anti-spam cooldown for new-message emails: at most one "new message" email per
 * (recipient, thread) pair every `cooldownMinutes`. Reuses the existing EmailEvent
 * log (relatedMessageId stores the threadId for this email type) — no new table.
 * Returns true if an email may be sent now (i.e. NOT within cooldown).
 */
async function checkMessageEmailCooldown(userId: string, threadId: string, cooldownMinutes = 20): Promise<boolean> {
  try {
    const since = new Date(Date.now() - cooldownMinutes * 60 * 1000);
    const recent = await prisma.emailEvent.findFirst({
      where: {
        userId,
        type: 'new_message',
        relatedMessageId: threadId,
        status: 'sent',
        createdAt: { gte: since },
      },
      select: { id: true },
    });
    return !recent;
  } catch (error) {
    console.error('[EMAIL] Failed to check message cooldown:', error);
    // On error, allow the email (fail open) — matches checkEmailRateLimit behaviour
    return true;
  }
}
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { email: true },
    });
    return user?.email || null;
  } catch (error) {
    console.error("[EMAIL] Failed to get user email for userId:", userId, error);
    return null;
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Shared email layout builder
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface EmailBlock {
  type: 'heading' | 'text' | 'card' | 'cta' | 'tag';
  content: string;
  href?: string;    // for 'cta'
  label?: string;   // for 'card' section labels
  rawHtml?: boolean; // skip HTML escaping when content is pre-sanitized
}

/** Escape user-supplied values before injecting into HTML email templates */
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildEmail(
  subject: string,
  blocks: EmailBlock[],
  footer?: { unsubscribeUrl?: string; unsubscribeLabel?: string }
): string {
  const renderedBlocks = blocks.map((b) => {
    // When rawHtml is set, the caller has already sanitised the content (e.g. email
    // templates that compose their own inner HTML). Otherwise, escape by default.
    const c = b.rawHtml ? b.content : escHtml(b.content);
    if (b.type === 'heading') {
      return `<h1 class="qx-heading" style="margin:0 0 14px;font-size:24px;font-weight:800;color:#111827;line-height:1.2;letter-spacing:-0.02em;">${c}</h1>`;
    }
    if (b.type === 'text') {
      return `<p class="qx-text" style="margin:0 0 16px;font-size:15px;color:#475569;line-height:1.65;">${c}</p>`;
    }
    if (b.type === 'tag') {
      return `<span class="qx-tag" style="display:inline-block;background:#fff1f2;color:#9f1239;font-size:11px;font-weight:800;padding:5px 11px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 16px;border:1px solid #fecdd3;">${c}</span>`;
    }
    if (b.type === 'card') {
      return `
        <div class="qx-card" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:20px 22px;margin:0 0 20px;box-shadow:0 1px 2px rgba(15,23,42,0.04);">
          ${b.label ? `<p style="margin:0 0 10px;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.08em;">${escHtml(b.label)}</p>` : ''}
          <div style="font-size:15px;color:#334155;line-height:1.65;">${b.rawHtml ? b.content : c}</div>
        </div>`;
    }
    if (b.type === 'cta') {
      return `
        <div style="text-align:center;margin:26px 0 10px;">
          <a class="qx-button" href="${b.href ? escHtml(b.href) : '#'}" style="display:inline-block;background:#800020;color:#ffffff;font-size:16px;font-weight:800;padding:15px 28px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;box-shadow:0 10px 20px rgba(128,0,32,0.18);">${c}</a>
        </div>`;
    }
    return '';
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escHtml(subject)}</title>
<style>
  @media (max-width: 640px) {
    .qx-shell { padding: 16px 10px !important; }
    .qx-container { width: 100% !important; max-width: 100% !important; }
    .qx-header { padding: 22px 18px !important; }
    .qx-body { padding: 24px 18px 20px !important; }
    .qx-footer { padding: 18px !important; }
    .qx-heading { font-size: 22px !important; }
    .qx-button { display: block !important; width: auto !important; }
    .qx-card { padding: 18px !important; }
  }
  @media (prefers-color-scheme: dark) {
    body, .qx-shell { background: #0f172a !important; }
    .qx-body { background: #111827 !important; }
    .qx-card { background: #1f2937 !important; border-color: #334155 !important; }
    .qx-heading { color: #f8fafc !important; }
    .qx-text, .qx-card div { color: #cbd5e1 !important; }
    .qx-footer { background: #0f172a !important; border-color: #334155 !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${escHtml(subject)} - QuoteXbert</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="qx-shell" style="background:#f1f5f9;padding:32px 12px;">
  <tr><td align="center">
    <table role="presentation" width="100%" class="qx-container" style="max-width:600px;border-collapse:separate;border-spacing:0;" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr><td class="qx-header" style="background:#800020;border-radius:18px 18px 0 0;padding:24px 32px;text-align:left;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;">
            <img src="${LOGO_URL}" width="42" height="50" alt="QuoteXbert" style="display:inline-block;vertical-align:middle;border:0;outline:none;text-decoration:none;margin-right:12px;">
            <span style="display:inline-block;vertical-align:middle;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.03em;">QuoteXbert</span>
          </td>
          <td align="right" style="vertical-align:middle;color:#fecdd3;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">Renovation intelligence</td>
        </tr></table>
      </td></tr>

      <!-- Body -->
      <tr><td class="qx-body" style="background:#ffffff;padding:32px 34px 26px;">
        ${renderedBlocks}
      </td></tr>

      <!-- Footer -->
      <tr><td class="qx-footer" style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 18px 18px;padding:20px 32px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#64748b;line-height:1.55;">Need help? Reach us at
          <a href="mailto:quotexbert@gmail.com" style="color:#9f1239;text-decoration:none;font-weight:600;">quotexbert@gmail.com</a>
          or call <a href="tel:9052429460" style="color:#9f1239;text-decoration:none;font-weight:600;">905-242-9460</a>
        </p>
        <p style="margin:0 0 6px;font-size:12px;">
          <a href="${BASE_URL}/notifications" style="color:#9f1239;text-decoration:none;font-weight:600;">Manage email preferences</a>${footer?.unsubscribeUrl ? ` &middot; <a href="${footer.unsubscribeUrl}" style="color:#94a3b8;text-decoration:none;">${footer.unsubscribeLabel || 'Unsubscribe'}</a>` : ''}
        </p>
        <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">© ${new Date().getFullYear()} QuoteXbert · Toronto, Durham Region & the GTA</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// Email templates
function createMessageReceivedTemplate(preview: string, threadId: string, senderName?: string, jobTitle?: string, recipientId?: string): string {
  const safePreview = escHtml(preview);
  const safeSender = senderName ? escHtml(senderName) : null;
  const safeJob = jobTitle ? escHtml(jobTitle) : null;
  return buildEmail(`New Message${safeSender ? ` from ${safeSender}` : ''} — QuoteXbert`, [
    { type: 'tag', content: 'New Message' },
    { type: 'heading', content: safeSender ? `Message from ${safeSender}` : 'You have a new message', rawHtml: true },
    ...(safeJob ? [{ type: 'text' as const, content: `Re: <strong>${safeJob}</strong>`, rawHtml: true }] : []),
    { type: 'card', content: `<em style="color:#64748b;">"${safePreview}"</em>`, label: 'Message Preview', rawHtml: true },
    { type: 'cta', content: 'Reply Now →', href: `${baseUrl}/messages?threadId=${threadId}` },
    { type: 'text', content: `View all your conversations at <a href="${baseUrl}/messages" style="color:#9f1239;text-decoration:none;font-weight:600;">QuoteXbert Messages</a>. For your security, never share payment details or send money outside QuoteXbert.`, rawHtml: true },
  ], recipientId ? { unsubscribeUrl: buildUnsubscribeUrl(recipientId, 'message'), unsubscribeLabel: 'Turn off message emails' } : undefined);
}

function createContractSentTemplate(contractId: string): string {
  return buildEmail('Contract Ready for Review â€” QuoteXbert', [
    { type: 'tag', content: 'Contract' },
    { type: 'heading', content: 'A contract is ready for your review' },
    { type: 'text', content: 'A contract has been sent to you. Please review it and sign to move forward.' },
    { type: 'cta', content: 'Review Contract', href: `${baseUrl}/contracts/${contractId}` },
  ]);
}

function createContractAcceptedTemplate(contractId: string, pdfUrl?: string): string {
  const blocks: EmailBlock[] = [
    { type: 'tag', content: 'Contract Signed' },
    { type: 'heading', content: 'Your contract is now active' },
    { type: 'text', content: 'Both parties have signed. The contract is now in effect â€” you can view the full details below.' },
    { type: 'cta', content: 'View Contract', href: `${baseUrl}/contracts/${contractId}` },
  ];
  if (pdfUrl) {
    blocks.push({ type: 'text', content: `<a href="${pdfUrl}" style="color:#9f1239;font-weight:600;text-decoration:none;">Download PDF copy</a>` });
  }
  return buildEmail('Contract Accepted â€” QuoteXbert', blocks);
}

interface LeadEmailPayload {
  postalCode: string;
  projectType: string;
  description: string;
  /** The FINAL canonical budget/estimate stored on the lead — must match the job board. */
  estimate: string;
  source?: string;
  affiliateId?: string;
  // Optional enriched fields for the admin email
  city?: string | null;
  title?: string | null;
  homeownerName?: string | null;
  homeownerEmail?: string | null;
  leadId?: string | null;
}

// Welcome Email
export async function sendWelcomeEmail(user: { id: string; email: string; name?: string | null; role?: string | null }) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping welcome email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const isContractor = user.role === 'contractor';
    const isHomeowner = user.role === 'homeowner';
    const ctaHref = isContractor ? `${baseUrl}/contractor/jobs` : `${baseUrl}/create-lead`;
    const ctaLabel = isContractor ? 'Browse Available Jobs' : 'Post Your First Project';
    const cardContent = isContractor
      ? '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Browse projects in your area</li><li style="margin-bottom:6px;">Submit quotes directly to homeowners</li><li style="margin-bottom:6px;">Message clients and track your jobs</li><li>Build your reputation with reviews</li></ul>'
      : '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Post your home improvement project</li><li style="margin-bottom:6px;">Get quotes from verified contractors</li><li style="margin-bottom:6px;">Message contractors directly</li><li>Save money \u2014 no bidding wars</li></ul>';
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: user.email,
      subject: isContractor ? 'Your QuoteXbert contractor account is ready' : isHomeowner ? 'Your QuoteXbert account is ready' : 'Welcome to QuoteXbert! \uD83C\uDF89',
      html: buildEmail('Welcome to QuoteXbert!', [
        { type: 'heading', content: `Welcome, ${user.name || 'there'}!` },
        { type: 'text', content: "Thanks for joining QuoteXbert \u2014 your AI-powered home renovation platform." },
        { type: 'card', label: 'What you can do now', content: cardContent, rawHtml: true },
        { type: 'cta', content: ctaLabel, href: ctaHref },
      ])
    });

    await logEmailEvent('welcome', user.email, user.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Welcome email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('welcome', user.email, user.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send welcome email:', error);
    return { success: false, error };
  }
}

async function contractorHasPaidSubscription(contractorId: string): Promise<boolean> {
  const contractor = await prisma.user.findUnique({
    where: { id: contractorId },
    select: { subscriptionStatus: true },
  });

  if (contractor?.subscriptionStatus && ['active', 'trialing'].includes(contractor.subscriptionStatus)) {
    return true;
  }

  const paidSubscription = await prisma.contractorSubscription.findFirst({
    where: {
      contractorId,
      status: { in: ['active', 'trialing'] },
      monthlyPrice: { gt: 0 },
      OR: [{ currentPeriodEnd: null }, { currentPeriodEnd: { gte: new Date() } }],
    },
    select: { id: true },
  });

  return Boolean(paidSubscription);
}

async function hasCampaignEmail(contractorId: string, email: string, campaignType: string): Promise<boolean> {
  const existing = await prisma.emailEvent.findFirst({
    where: {
      type: campaignType,
      status: 'sent',
      OR: [{ userId: contractorId }, { to: email }],
    },
    select: { id: true },
  });

  return Boolean(existing);
}

function buildContractorOfferBlocks(isReminder = false): EmailBlock[] {
  const heading = isReminder
    ? 'Your QuoteXbert contractor offer is still available'
    : 'Welcome to QuoteXbert.';

  return [
    { type: 'heading', content: heading },
    { type: 'text', content: 'Your contractor profile has been created.' },
    {
      type: 'card',
      label: 'Limited time founding offer',
      rawHtml: true,
      content: `
        <p style="margin:0 0 10px;color:#334155;line-height:1.6;">For a limited time:</p>
        <p style="margin:0 0 6px;font-size:13px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.4px;">First Month</p>
        <p style="margin:0 0 10px;font-size:32px;line-height:1;font-weight:900;color:#9f1239;">$0.99</p>
        <p style="margin:0;color:#475569;line-height:1.6;">Then renews at the normal monthly plan price.</p>
      `,
    },
    { type: 'text', content: `Only ${FOUNDING_CONTRACTOR_SPOTS_REMAINING} founding contractor spots remain.` },
    { type: 'text', content: 'Choose the categories you want.' },
    { type: 'text', content: 'Start receiving homeowner leads immediately.' },
    { type: 'cta', content: 'Choose Your Plan', href: `${BASE_URL}/contractor/subscriptions` },
    {
      type: 'text',
      rawHtml: true,
      content: `<a href="${BASE_URL}/profile" style="color:#9f1239;text-decoration:none;font-weight:700;">Complete Your Profile</a>`,
    },
    { type: 'text', content: 'Cancel anytime.' },
  ];
}

export async function sendContractorOnboardingOfferEmail(contractor: { id: string; email: string; name?: string | null }) {
  if (!isFoundingOfferEnabled()) {
    return { success: false, skipped: true, reason: 'founding_offer_disabled' };
  }

  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor onboarding offer');
    return { success: false, error: 'Email service not configured' };
  }

  if (isUnlimitedTestContractor(contractor.email)) {
    return { success: false, skipped: true, reason: 'internal_bypass_account' };
  }

  if (await contractorHasPaidSubscription(contractor.id)) {
    return { success: false, skipped: true, reason: 'already_subscribed' };
  }

  if (await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_ONBOARDING_CAMPAIGN)) {
    return { success: false, skipped: true, reason: 'already_sent' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: 'Start getting QuoteXbert jobs for just $0.99',
      html: buildEmail('Start getting QuoteXbert jobs for just $0.99', buildContractorOfferBlocks(false), {
        unsubscribeUrl: buildUnsubscribeUrl(contractor.id, 'marketing'),
        unsubscribeLabel: 'Turn off marketing emails',
      }),
    });

    await logEmailEvent(CONTRACTOR_ONBOARDING_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'sent');
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent(CONTRACTOR_ONBOARDING_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor onboarding offer:', error);
    return { success: false, error };
  }
}

export async function sendContractorOnboardingReminderEmail(contractor: { id: string; email: string; name?: string | null }) {
  if (!isFoundingOfferEnabled()) {
    return { success: false, skipped: true, reason: 'founding_offer_disabled' };
  }

  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor onboarding reminder');
    return { success: false, error: 'Email service not configured' };
  }

  if (isUnlimitedTestContractor(contractor.email)) {
    return { success: false, skipped: true, reason: 'internal_bypass_account' };
  }

  if (await contractorHasPaidSubscription(contractor.id)) {
    return { success: false, skipped: true, reason: 'already_subscribed' };
  }

  if (!(await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_ONBOARDING_CAMPAIGN))) {
    return { success: false, skipped: true, reason: 'welcome_offer_not_sent' };
  }

  if (await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_ONBOARDING_REMINDER_CAMPAIGN)) {
    return { success: false, skipped: true, reason: 'already_sent' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: 'Reminder: Start getting QuoteXbert jobs for just $0.99',
      html: buildEmail('Reminder: Start getting QuoteXbert jobs for just $0.99', buildContractorOfferBlocks(true), {
        unsubscribeUrl: buildUnsubscribeUrl(contractor.id, 'marketing'),
        unsubscribeLabel: 'Turn off marketing emails',
      }),
    });

    await logEmailEvent(CONTRACTOR_ONBOARDING_REMINDER_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'sent');
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent(CONTRACTOR_ONBOARDING_REMINDER_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor onboarding reminder:', error);
    return { success: false, error };
  }
}

// New Job Email (for matching contractors)
/** Format urgency label + emoji for email based on job creation time */
function getJobUrgencyForEmail(createdAt?: string): { emoji: string; label: string } {
  if (!createdAt) return { emoji: '📋', label: 'Just posted' };
  const minutesAgo = (Date.now() - new Date(createdAt).getTime()) / 60000;
  if (minutesAgo < 30) {
    const m = Math.max(1, Math.round(minutesAgo));
    return { emoji: '🔥', label: `Posted ${m} minute${m !== 1 ? 's' : ''} ago — ACT FAST` };
  }
  if (minutesAgo < 360) {
    const h = Math.round(minutesAgo / 60);
    return { emoji: '🟡', label: `Posted ${h} hour${h !== 1 ? 's' : ''} ago` };
  }
  const h = Math.round(minutesAgo / 60);
  return { emoji: '⚪', label: `Posted ${h} hours ago` };
}

export async function sendNewJobEmail(
  contractor: { id: string; email: string; name?: string | null },
  job: {
    id: string;
    title: string;
    category: string;
    description: string;
    budget?: string | null;
    city?: string | null;
    province?: string | null;
    location?: string | null;
    createdAt?: string | null;
  }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping job notification');
    return { success: false, error: 'Email service not configured' };
  }

  // Rate limit: max 5 new_job emails per contractor per hour
  const canSend = await checkEmailRateLimit(contractor.id, 'new_job');
  if (!canSend) {
    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'failed', 'Rate limit exceeded (max 5/hr)');
    console.warn(`[EMAIL] Rate limit hit for contractor ${contractor.id} — skipping job notification`);
    return { success: false, error: 'Rate limit exceeded' };
  }

  const urgency = getJobUrgencyForEmail(job.createdAt ?? undefined);
  // Build "City, Province" display — fall back to legacy location field or generic text
  const cityProvince = [job.city, job.province].filter(
    (v): v is string => typeof v === 'string' && v.trim() !== '' && v !== 'Not specified'
  ).join(', ');
  const displayLocation = cityProvince || job.location || null;
  const submittedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const estimatedProjectValue = job.budget || 'Estimate available in lead details';
  // Deep link highlights the specific job card when the contractor opens the page
  const jobDeepLink = `${BASE_URL}/contractor/jobs?highlight=${encodeURIComponent(job.id)}`;

  try {
    const leadSummaryRows: string[] = [
      `<strong>Service Required:</strong> ${escHtml(job.category)}`,
      `<strong>Location:</strong> ${escHtml(displayLocation || 'Location shared in lead details')}`,
      `<strong>Estimated Project Value:</strong> ${escHtml(estimatedProjectValue)}`,
      `<strong>Submitted Date:</strong> ${escHtml(submittedDate)}`,
    ];

    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: (cityProvince)
        ? `${urgency.emoji} New ${job.category} job in ${cityProvince} — QuoteXbert`
        : `${urgency.emoji} New ${job.category} lead near you — QuoteXbert`,
      html: buildEmail(`New ${escHtml(job.category)} Lead — QuoteXbert`, [
        { type: 'tag', content: `${urgency.emoji} ${urgency.label}` },
        { type: 'heading', content: job.title },
        {
          type: 'card',
          rawHtml: true,
          label: 'Estimated Project Value',
          content: `<div style="font-size:30px;line-height:1.1;font-weight:900;color:#800020;letter-spacing:-0.03em;">${escHtml(estimatedProjectValue)}</div><p style="margin:8px 0 0;color:#64748b;font-size:13px;line-height:1.5;">Review the full scope before submitting your quote.</p>`,
        },
        {
          type: 'card',
          rawHtml: true,
          content: leadSummaryRows.join('<br>'),
          label: 'Lead Summary',
        },
        { type: 'card', label: 'Homeowner Description', content: job.description.substring(0, 600) + (job.description.length > 600 ? '...' : '') },
        { type: 'cta', content: 'View Lead & Submit a Quote', href: jobDeepLink },
        {
          type: 'text',
          content: `<span style="font-size:12px;color:#64748b;">You're receiving this because this project matches your selected service categories and service area on QuoteXbert. <a href="${BASE_URL}/contractor/settings" style="color:#9f1239;font-weight:700;text-decoration:none;">Manage alerts</a></span>`,
          rawHtml: true,
        },
      ]),
    });

    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job notification sent to ${contractor.email} for lead ${job.id}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send job notification:', error);
    return { success: false, error };
  }
}
// New Message Email
export async function sendNewMessageEmail(
  recipient: { id: string; email: string; name?: string | null },
  sender: { name?: string | null },
  messagePreview: string,
  threadId: string,
  jobTitle?: string,
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping message notification');
    return { success: false, error: 'Email service not configured' };
  }

  // Anti-spam: suppress repeated emails for the same thread within the cooldown window.
  // The recipient still sees the message instantly in-app; this only limits email volume.
  const canSend = await checkMessageEmailCooldown(recipient.id, threadId);
  if (!canSend) {
    await logEmailEvent('new_message', recipient.email, recipient.id, undefined, threadId, 'failed', 'skipped: cooldown active for this thread');
    console.log(`[EMAIL] Skipped message notification to ${recipient.email} — cooldown active for thread ${threadId}`);
    return { success: false, skipped: true, reason: 'cooldown' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: recipient.email,
      subject: `New message from ${sender.name || 'a user'} on QuoteXbert`,
      html: createMessageReceivedTemplate(messagePreview, threadId, sender.name ?? undefined, jobTitle, recipient.id),
    });

    await logEmailEvent('new_message', recipient.email, recipient.id, undefined, threadId, 'sent');
    console.log(`[EMAIL] Message notification sent to ${recipient.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('new_message', recipient.email, recipient.id, undefined, threadId, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send message notification:', error);
    return { success: false, error };
  }
}

// Quote Change Request Email (contractor receives when homeowner requests changes)
export async function sendQuoteChangeRequestEmail(
  contractor: { email: string; name?: string | null },
  homeownerName: string,
  jobTitle: string,
  changeNote: string,
  leadId: string,
) {
  if (!resend) return { success: false, error: 'Email service not configured' };
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `Quote changes requested — ${jobTitle}`,
      html: buildEmail('Quote Changes Requested — QuoteXbert', [
        { type: 'tag', content: 'Quote Update' },
        { type: 'heading', content: `${escHtml(homeownerName)} requested changes to your quote`, rawHtml: true },
        { type: 'text', content: `Re: <strong>${escHtml(jobTitle)}</strong>`, rawHtml: true },
        { type: 'card', content: `<em style="color:#92400e;">"${escHtml(changeNote)}"</em>`, label: "Homeowner's Request", rawHtml: true },
        { type: 'text', content: 'Open the Quote Builder in your messaging thread to revise and resubmit the quote.' },
        { type: 'cta', content: 'Revise Quote →', href: `${baseUrl}/messages?leadId=${leadId}` },
      ]),
    });
    return { success: true };
  } catch (error) {
    console.error('[EMAIL] Failed to send quote change request email:', error);
    return { success: false, error };
  }
}

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const fromEmail = process.env.FROM_EMAIL || "leads@quotexbert.com";
  const toEmail = "quotexbert@gmail.com"; // Always send to quotexbert@gmail.com
  const submittedAt = new Date().toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' });

  // Build a human-readable location string — city is preferred over raw postal code
  const locationDisplay = payload.city
    ? `${payload.city}, ON${payload.postalCode ? ` (${payload.postalCode})` : ''}`
    : payload.postalCode;

  const adminJobLink = payload.leadId
    ? `${BASE_URL}/contractor/jobs?highlight=${encodeURIComponent(payload.leadId)}`
    : `${BASE_URL}/contractor/jobs`;

  const emailContent = {
    from: fromEmail,
    to: toEmail,
    subject: `New QuoteXbert Lead - ${payload.projectType}${payload.city ? ` in ${payload.city}` : ''}`,
    html: buildEmail('New QuoteXbert Lead Submitted', [
      { type: 'tag', content: 'New Lead' },
      { type: 'heading', content: payload.title ? `New Lead: ${payload.title}` : `New ${payload.projectType} lead` },
      { type: 'card', label: 'Final Saved Estimate (matches job board)', rawHtml: true, content: `<div style="font-size:28px;line-height:1.1;font-weight:900;color:#800020;">${escHtml(payload.estimate)}</div>` },
      { type: 'card', label: 'Lead Details', rawHtml: true, content: `<strong>Service Required:</strong> ${escHtml(payload.projectType)}<br><strong>Location:</strong> ${escHtml(locationDisplay)}<br><strong>Submitted Date:</strong> ${escHtml(submittedAt)}<br><strong>Source:</strong> ${escHtml(payload.source || 'web')}${payload.affiliateId ? `<br><strong>Affiliate ID:</strong> ${escHtml(payload.affiliateId)}` : ''}${payload.leadId ? `<br><strong>Lead ID:</strong> ${escHtml(payload.leadId)}` : ''}` },
      { type: 'card', label: 'Homeowner', rawHtml: true, content: `<strong>Name:</strong> ${escHtml(payload.homeownerName || 'Not provided')}<br><strong>Email:</strong> ${escHtml(payload.homeownerEmail || 'Not provided')}` },
      { type: 'card', label: 'Homeowner Description', content: payload.description },
      { type: 'cta', content: 'View Job on Job Board', href: adminJobLink },
    ]),
  };

  if (!resend) {
    console.log(
      "RESEND_API_KEY not configured. Email would be sent with content:",
      emailContent,
    );
    return { success: true };
  }

  try {
    await resend.emails.send(emailContent);
    console.log('[LEAD EMAIL] Sent to quotexbert@gmail.com');
    return { success: true };
  } catch (error) {
    console.error("Failed to send lead email:", error);
    return { success: false, error };
  }
}

// New notification email functions

export async function sendMessageReceivedEmail(params: {
  toUserId: string;
  threadId: string;
  preview: string;
}): Promise<{ success: boolean; error?: any }> {
  try {
    const { toUserId, threadId, preview } = params;
    const userEmail = await getUserEmail(toUserId);
    
    if (!userEmail) {
      console.error("Could not find email for user:", toUserId);
      return { success: false, error: "User email not found" };
    }

    const emailContent = {
      from: fromEmail,
      to: userEmail,
      subject: "New Message â€” QuoteXbert",
      html: createMessageReceivedTemplate(preview, threadId),
    };

    if (!resend) {
      console.log("RESEND_API_KEY not configured. Message email would be sent:", emailContent);
      return { success: true };
    }

    await resend.emails.send(emailContent);
    return { success: true };
  } catch (error) {
    console.error("Failed to send message received email:", error);
    return { success: false, error };
  }
}

export async function sendContractSentEmail(params: {
  toUserId: string;
  contractId: string;
}): Promise<{ success: boolean; error?: any }> {
  try {
    const { toUserId, contractId } = params;
    const userEmail = await getUserEmail(toUserId);
    
    if (!userEmail) {
      console.error("Could not find email for user:", toUserId);
      return { success: false, error: "User email not found" };
    }

    const emailContent = {
      from: fromEmail,
      to: userEmail,
      subject: "Contract Ready for Review â€” QuoteXbert",
      html: createContractSentTemplate(contractId),
    };

    if (!resend) {
      console.log("RESEND_API_KEY not configured. Contract sent email would be sent:", emailContent);
      return { success: true };
    }

    await resend.emails.send(emailContent);
    return { success: true };
  } catch (error) {
    console.error("Failed to send contract sent email:", error);
    return { success: false, error };
  }
}

export async function sendContractAcceptedEmail(params: {
  toUserId: string;
  contractId: string;
  pdfUrl?: string;
}): Promise<{ success: boolean; error?: any }> {
  try {
    const { toUserId, contractId, pdfUrl } = params;
    const userEmail = await getUserEmail(toUserId);
    
    if (!userEmail) {
      console.error("Could not find email for user:", toUserId);
      return { success: false, error: "User email not found" };
    }

    const emailContent = {
      from: fromEmail,
      to: userEmail,
      subject: "Contract Accepted â€” QuoteXbert",
      html: createContractAcceptedTemplate(contractId, pdfUrl),
    };

    if (!resend) {
      console.log("RESEND_API_KEY not configured. Contract accepted email would be sent:", emailContent);
      return { success: true };
    }

    await resend.emails.send(emailContent);
    return { success: true };
  } catch (error) {
    console.error("Failed to send contract accepted email:", error);
    return { success: false, error };
  }
}

// Job Accepted Email (for homeowner)
export async function sendJobAcceptedEmail(
  homeowner: { id: string; email: string; name?: string | null },
  contractor: { companyName: string; name?: string | null },
  job: { id: string; title: string; category: string; city?: string }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping job accepted email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: homeowner.email,
      subject: `${escHtml(contractor.companyName)} Accepted Your Job! âœ…`,
      html: buildEmail(`${escHtml(contractor.companyName)} Accepted Your Job â€” QuoteXbert`, [
        { type: 'tag', content: 'Job Accepted' },
        { type: 'heading', content: `${escHtml(contractor.companyName)} is on your job!` },
        { type: 'text', content: `<strong>${escHtml(contractor.companyName)}</strong> has accepted your job request for <strong>${escHtml(job.title)}</strong>.`, rawHtml: true },
        { type: 'card', label: 'Job Details', rawHtml: true, content: `<strong>Category:</strong> ${escHtml(job.category)}${job.city ? `<br><strong>Location:</strong> ${escHtml(job.city)}` : ''}` },
        { type: 'card', label: 'Suggested next steps', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Message the contractor to discuss details</li><li style="margin-bottom:6px;">Schedule a site visit if needed</li><li>Request and review their formal quote</li></ul>' },
        { type: 'cta', content: 'Message Contractor', href: `${baseUrl}/messages` },
      ])
    });

    await logEmailEvent('job_accepted', homeowner.email, homeowner.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job accepted notification sent to ${homeowner.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('job_accepted', homeowner.email, homeowner.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send job accepted email:', error);
    return { success: false, error };
  }
}

// Contractor Hired Email (contractor is notified when a homeowner hires them directly from a chat thread)
export async function sendContractorHiredEmail(
  contractor: { id: string; email: string; name?: string | null },
  homeowner: { name?: string | null },
  job: { id: string; title: string; category?: string | null; city?: string | null }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor hired email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const safeHomeownerName = homeowner.name ? escHtml(homeowner.name) : 'A homeowner';
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `You were hired for "${job.title}" on QuoteXbert`,
      html: buildEmail(`You Were Hired — QuoteXbert`, [
        { type: 'tag', content: 'Job Accepted' },
        { type: 'heading', content: `${safeHomeownerName} hired you!`, rawHtml: true },
        { type: 'text', content: `<strong>${safeHomeownerName}</strong> has hired you for <strong>${escHtml(job.title)}</strong>.`, rawHtml: true },
        ...(job.category || job.city ? [{
          type: 'card' as const,
          label: 'Job Details',
          rawHtml: true,
          content: `${job.category ? `<strong>Category:</strong> ${escHtml(job.category)}` : ''}${job.city ? `<br><strong>Location:</strong> ${escHtml(job.city)}` : ''}`,
        }] : []),
        { type: 'card', label: 'Suggested next steps', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Message the homeowner to confirm project details</li><li style="margin-bottom:6px;">Schedule a site visit if needed</li><li>Send your formal quote through QuoteXbert</li></ul>' },
        { type: 'cta', content: 'Message Homeowner', href: `${baseUrl}/messages` },
      ], { unsubscribeUrl: buildUnsubscribeUrl(contractor.id, 'job'), unsubscribeLabel: 'Turn off job emails' }),
    });

    await logEmailEvent('job_accepted', contractor.email, contractor.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Contractor hired notification sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('job_accepted', contractor.email, contractor.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor hired email:', error);
    return { success: false, error };
  }
}

// New Renovation Lead Email (for contractor matching their categories)
export async function sendNewRenovationLeadEmail(
  contractor: { id: string; email: string; companyName?: string | null },
  job: { id: string; title: string; category: string; city?: string; estimatedPrice?: string | null; description?: string }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping renovation lead email');
    return { success: false, error: 'Email service not configured' };
  }

  // Check rate limit (max 5 emails per hour per contractor)
  const canSendEmail = await checkEmailRateLimit(contractor.id, 'new_lead');
  if (!canSendEmail) {
    console.log(`[EMAIL] Rate limit reached for contractor ${contractor.id}, skipping new lead email`);
    await logEmailEvent('new_lead', contractor.email, contractor.id, job.id, undefined, 'failed', 'Rate limit exceeded (max 5 per hour)');
    return { success: false, error: 'Rate limit exceeded' };
  }

  try {
    const submittedDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
    const estimatedProjectValue = job.estimatedPrice || 'Estimate available in lead details';

    await resend.emails.send({
      from: fromEmail,
      to: contractor.email,
      subject: `New ${escHtml(job.category)} Lead on QuoteXbert`,
      html: buildEmail(`New ${escHtml(job.category)} Lead â€” QuoteXbert`, [
        { type: 'tag', content: job.category },
        { type: 'heading', content: job.title || job.category },
        { type: 'card', label: 'Estimated Project Value', rawHtml: true, content: `<div style="font-size:30px;line-height:1.1;font-weight:900;color:#800020;letter-spacing:-0.03em;">${escHtml(estimatedProjectValue)}</div><p style="margin:8px 0 0;color:#64748b;font-size:13px;line-height:1.5;">Review the full scope before submitting your quote.</p>` },
        { type: 'card', label: 'Lead Summary', rawHtml: true, content: `<strong>Service Required:</strong> ${escHtml(job.category)}<br><strong>Location:</strong> ${escHtml(job.city || 'Location shared in lead details')}<br><strong>Estimated Project Value:</strong> ${escHtml(estimatedProjectValue)}<br><strong>Submitted Date:</strong> ${escHtml(submittedDate)}` },
        ...(job.description ? [{ type: 'card' as const, label: 'Homeowner Description', content: job.description.substring(0, 600) + (job.description.length > 600 ? '...' : '') }] : []),
        { type: 'cta', content: 'View Lead & Submit a Quote', href: `${baseUrl}/contractor/jobs?highlight=${encodeURIComponent(job.id)}` },
        { type: 'text', content: `<span style="font-size:12px;color:#64748b;">You're receiving this because this project matches your selected service categories and service area on QuoteXbert. <a href="${BASE_URL}/contractor/settings" style="color:#9f1239;font-weight:700;text-decoration:none;">Manage alerts</a></span>`, rawHtml: true },
      ])
    });

    await logEmailEvent('new_lead', contractor.email, contractor.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] New renovation lead sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('new_lead', contractor.email, contractor.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send renovation lead email:', error);
    return { success: false, error };
  }
}

// Review Received Email (for contractor)
export async function sendReviewReceivedEmail(
  contractor: { id: string; email: string; companyName?: string | null },
  review: { id: string; rating: number; comment?: string | null; reviewerName?: string }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping review email');
    return { success: false, error: 'Email service not configured' };
  }

  const stars = 'â­'.repeat(review.rating);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: contractor.email,
      subject: `New ${review.rating}-Star Review Received! â­`,
      html: buildEmail(`New ${review.rating}-Star Review â€” QuoteXbert`, [
        { type: 'tag', content: `${review.rating} / 5 stars` },
        { type: 'heading', content: 'You have a new review!' },
        { type: 'card', label: `From ${escHtml(review.reviewerName || 'a client')}`, rawHtml: true, content: `<div style="font-size:22px;letter-spacing:2px;margin-bottom:8px;">${stars}</div>${review.comment ? `<p style="margin:0;font-size:14px;color:#475569;font-style:italic;">&ldquo;${escHtml(review.comment)}&rdquo;</p>` : ''}` },
        { type: 'cta', content: 'View Your Profile', href: `${baseUrl}/contractor/profile` },
      ])
    });

    await logEmailEvent('review_received', contractor.email, contractor.id, undefined, review.id, 'sent');
    console.log(`[EMAIL] Review notification sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('review_received', contractor.email, contractor.id, undefined, review.id, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send review email:', error);
    return { success: false, error };
  }
}

// â”€â”€â”€ Job Posted Confirmation (homeowner) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function sendJobPostedEmail(params: {
  homeowner: { id: string; email: string; name?: string | null };
  job: { id: string; title: string; category: string; city?: string; province?: string; zipCode?: string };
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping job-posted email');
    return { success: false, error: 'Email service not configured' };
  }
  const { homeowner, job } = params;
  const location = [job.city, job.province].filter(Boolean).join(', ') || job.zipCode || 'Your area';
  const datePosted = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: homeowner.email,
      subject: 'Your project is now live on QuoteXbert',
      html: buildEmail('Your Project is Live \u2014 QuoteXbert', [
        { type: 'tag', content: job.category },
        { type: 'heading', content: `"${escHtml(job.title)}" is now live!`, rawHtml: true },
        { type: 'text', content: 'Your project has been posted and contractors have been notified.' },
        { type: 'card', label: 'Project Details', rawHtml: true, content: `<strong>Title:</strong> ${escHtml(job.title)}<br><strong>Location:</strong> ${escHtml(location)}<br><strong>Date Posted:</strong> ${escHtml(datePosted)}` },
        { type: 'card', label: 'What happens next', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Contractors will review your project</li><li style="margin-bottom:6px;">You\'ll receive quotes directly in your messages</li><li>Accept the quote that best fits your budget and schedule</li></ul>' },
        { type: 'cta', content: 'View & Manage Your Job', href: `${baseUrl}/homeowner/jobs/${encodeURIComponent(job.id)}` },
      ]),
    });
    await logEmailEvent('job_posted', homeowner.email, homeowner.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job-posted confirmation sent to homeowner ${homeowner.id}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('job_posted', homeowner.email, homeowner.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send job-posted email:', error);
    return { success: false, error };
  }
}
export async function sendQuoteReceivedEmail(params: {
  homeowner: { id: string; email: string; name?: string | null };
  contractorName: string;
  jobTitle: string;
  totalCost: number;
  leadId: string;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping quote-received email');
    return { success: false, error: 'Email service not configured' };
  }
  const { homeowner, contractorName, jobTitle, totalCost, leadId } = params;
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: homeowner.email,
      subject: `You received a quote for your project on QuoteXbert`,
      html: buildEmail('New Quote Received â€” QuoteXbert', [
        { type: 'tag', content: 'New Quote' },
        { type: 'heading', content: 'You received a quote!' },
        { type: 'text', content: `${escHtml(contractorName)} has sent you a quote.` },
        { type: 'card', label: 'Quote Details', rawHtml: true, content: `<strong>Project:</strong> ${escHtml(jobTitle)}<br><strong>Quote Total:</strong> $${escHtml(totalCost.toLocaleString())}` },
        { type: 'cta', content: 'View Quote & Reply', href: `${baseUrl}/messages?leadId=${encodeURIComponent(leadId)}` },
        { type: 'text', content: '<span style="font-size:12px;color:#94a3b8;">Reply to this email if you need help from our support team.</span>', rawHtml: true },
      ]),
    });
    await logEmailEvent('quote_received', homeowner.email, homeowner.id, leadId, undefined, 'sent');
    console.log(`[EMAIL] Quote-received email sent to ${homeowner.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('quote_received', homeowner.email, homeowner.id, leadId, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send quote-received email:', error);
    return { success: false, error };
  }
}

// ─── Subscription Created / Payment Success (contractor) ──────────────────────
export async function sendSubscriptionCreatedEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  tier: string;
  categories: string[];
  nextBillingDate?: Date | null;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping subscription-created email');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, tier, categories, nextBillingDate } = params;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  const catList = categories.slice(0, 8).map(c => `<li style="margin-bottom:4px;">${escHtml(c)}</li>`).join('');
  const moreCount = categories.length > 8 ? ` + ${categories.length - 8} more` : '';
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `✅ Your ${tierLabel} Plan is now active — QuoteXbert`,
      html: buildEmail(`${tierLabel} Plan Activated — QuoteXbert`, [
        { type: 'tag', content: `${tierLabel} Plan` },
        { type: 'heading', content: 'Welcome to QuoteXbert Pro!' },
        { type: 'text', content: `Your subscription is active. You can now access leads in your selected categories.` },
        { type: 'card', label: 'Your Categories', rawHtml: true, content: `<ul style="margin:0;padding-left:18px;">${catList}</ul>${moreCount ? `<p style="margin:8px 0 0;font-size:12px;color:#64748b;">${escHtml(moreCount)}</p>` : ''}` },
        ...(nextBillingDate ? [{ type: 'text' as const, content: `Next billing date: <strong>${new Date(nextBillingDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>`, rawHtml: true }] : []),
        { type: 'cta', content: 'Browse Jobs Now', href: `${BASE_URL}/contractor/jobs` },
      ]),
    });
    await logEmailEvent('subscription_created', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Subscription-created email sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('subscription_created', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send subscription-created email:', error);
    return { success: false, error };
  }
}

// ─── Payment Failed (contractor) ─────────────────────────────────────────────
export async function sendPaymentFailedEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  category?: string;
  amountDue?: number;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping payment-failed email');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, category, amountDue } = params;
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: '⚠️ Payment failed — action required on QuoteXbert',
      html: buildEmail('Payment Failed — QuoteXbert', [
        { type: 'tag', content: 'Action Required' },
        { type: 'heading', content: 'We could not process your payment' },
        { type: 'text', content: `Your subscription payment${category ? ` for <strong>${escHtml(category)}</strong>` : ''} was unsuccessful.${amountDue ? ` Amount due: <strong>$${amountDue.toFixed(2)}</strong>.` : ''}`, rawHtml: true },
        { type: 'card', label: 'What this means', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:4px;">Your job access has been paused</li><li style="margin-bottom:4px;">Update your payment method to restore access</li><li>No leads will be missed — your profile stays visible</li></ul>' },
        { type: 'cta', content: 'Update Payment Method', href: `${BASE_URL}/contractor/subscriptions` },
        { type: 'text', content: 'Need help? Call us at <a href="tel:9052429460" style="color:#9f1239;">905-242-9460</a> or email <a href="mailto:quotexbert@gmail.com" style="color:#9f1239;">quotexbert@gmail.com</a>', rawHtml: true },
      ]),
    });
    await logEmailEvent('payment_failed', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Payment-failed email sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('payment_failed', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send payment-failed email:', error);
    return { success: false, error };
  }
}

// ─── Subscription Cancelled (contractor) ──────────────────────────────────────
export async function sendSubscriptionCancelledEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  category?: string;
  accessUntil?: Date | null;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping subscription-cancelled email');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, category, accessUntil } = params;
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: 'Your QuoteXbert subscription has been cancelled',
      html: buildEmail('Subscription Cancelled — QuoteXbert', [
        { type: 'heading', content: 'Subscription Cancelled' },
        { type: 'text', content: `Your subscription${category ? ` for <strong>${escHtml(category)}</strong>` : ''} has been cancelled.`, rawHtml: true },
        ...(accessUntil ? [{ type: 'card' as const, label: 'Access Until', content: new Date(accessUntil).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) }] : []),
        { type: 'text', content: 'You can resubscribe at any time to regain access to leads.' },
        { type: 'cta', content: 'View Plans', href: `${BASE_URL}/contractor/subscriptions` },
      ]),
    });
    await logEmailEvent('subscription_cancelled', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Subscription-cancelled email sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('subscription_cancelled', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send subscription-cancelled email:', error);
    return { success: false, error };
  }
}

// ─── Subscription Renewal Receipt (contractor) ────────────────────────────────
export async function sendSubscriptionRenewalEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  tier: string;
  amountPaid: number;
  nextBillingDate?: Date | null;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping renewal email');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, tier, amountPaid, nextBillingDate } = params;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  const billingDate = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const renewalDate = nextBillingDate
    ? new Date(nextBillingDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Available in billing settings';
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: 'QuoteXbert subscription payment confirmed',
      html: buildEmail('QuoteXbert subscription payment confirmed', [
        { type: 'tag', content: 'Subscription Billing' },
        { type: 'heading', content: 'QuoteXbert subscription payment confirmed' },
        { type: 'card', label: 'Receipt', rawHtml: true, content: `<strong>Plan:</strong> ${escHtml(tierLabel)} Plan<br><strong>Amount Charged:</strong> $${amountPaid.toFixed(2)} CAD<br><strong>Billing Date:</strong> ${escHtml(billingDate)}<br><strong>Renewal Date:</strong> ${escHtml(renewalDate)}` },
        { type: 'cta', content: 'Manage Subscription', href: `${BASE_URL}/contractor/subscriptions` },
        { type: 'text', content: 'Questions? Call <a href="tel:9052429460" style="color:#9f1239;">905-242-9460</a>', rawHtml: true },
      ]),
    });
    await logEmailEvent('subscription_payment_receipt', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Renewal receipt sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('subscription_payment_receipt', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send renewal email:', error);
    return { success: false, error };
  }
}

// ─────────────────────────────────────────────────────────────────────────
// Daily digests — ONE contractor digest + ONE homeowner digest.
// Called from app/api/cron/daily-digest/route.ts. Not rate-limited via
// checkEmailRateLimit (that's for high-frequency per-event emails); cadence
// here is governed by the caller checking User.digestFrequency /
// lastContractorDigestAt / lastHomeownerDigestAt before invoking these.
// ─────────────────────────────────────────────────────────────────────────

export async function sendContractorDigestEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  matchedJobs: Array<{ id: string; title: string; category: string; city?: string | null | undefined; budget?: string | null | undefined }>;
  unreadMessageCount: number;
  awaitingReplyCount: number;
  profileIncomplete?: boolean;
  foundingSpotsRemaining?: number | null;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor digest');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, matchedJobs, unreadMessageCount, awaitingReplyCount, profileIncomplete, foundingSpotsRemaining } = params;

  const blocks: EmailBlock[] = [
    { type: 'tag', content: 'Daily Update' },
    {
      type: 'heading',
      content: matchedJobs.length > 0
        ? `${matchedJobs.length} new opportunit${matchedJobs.length === 1 ? 'y' : 'ies'} near you`
        : 'Your QuoteXbert update',
    },
  ];

  if (matchedJobs.length > 0) {
    const rows = matchedJobs
      .slice(0, 10)
      .map((j) => `<strong>${escHtml(j.title)}</strong> — ${escHtml(j.category)}${j.city ? ` · ${escHtml(j.city)}` : ''}${j.budget ? ` · ${escHtml(j.budget)}` : ''}`)
      .join('<br>');
    blocks.push({ type: 'card', label: `Matching jobs (${matchedJobs.length})`, rawHtml: true, content: rows });
  }

  if (unreadMessageCount > 0 || awaitingReplyCount > 0) {
    const parts: string[] = [];
    if (unreadMessageCount > 0) parts.push(`<strong>${unreadMessageCount}</strong> unread message${unreadMessageCount === 1 ? '' : 's'}`);
    if (awaitingReplyCount > 0) parts.push(`<strong>${awaitingReplyCount}</strong> homeowner${awaitingReplyCount === 1 ? '' : 's'} waiting on your reply`);
    blocks.push({ type: 'card', label: 'Your inbox', rawHtml: true, content: parts.join('<br>') });
  }

  if (profileIncomplete) {
    blocks.push({ type: 'text', content: 'Tip: a complete profile (photos, bio, verified badge) gets noticed first by homeowners.' });
  }

  if (typeof foundingSpotsRemaining === 'number' && foundingSpotsRemaining > 0) {
    blocks.push({
      type: 'text',
      rawHtml: true,
      content: `<strong>${foundingSpotsRemaining}</strong> Founding Contractor spots remain — <a href="${BASE_URL}/contractors/join" style="color:#9f1239;font-weight:600;">learn more</a>.`,
    });
  }

  blocks.push({ type: 'cta', content: 'View All Opportunities', href: `${BASE_URL}/contractor/jobs` });

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: matchedJobs.length > 0
        ? `${matchedJobs.length} new opportunit${matchedJobs.length === 1 ? 'y' : 'ies'} near you — QuoteXbert`
        : 'Your QuoteXbert contractor update',
      html: buildEmail('Your QuoteXbert Contractor Update', blocks, {
        unsubscribeUrl: buildUnsubscribeUrl(contractor.id, 'digest'),
        unsubscribeLabel: 'Turn off daily digest',
      }),
    });
    await logEmailEvent('contractor_digest', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Contractor digest sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('contractor_digest', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor digest:', error);
    return { success: false, error };
  }
}

export async function sendHomeownerDigestEmail(params: {
  homeowner: { id: string; email: string; name?: string | null };
  newContractorResponses: number;
  unreadMessageCount: number;
  savedEstimateCount: number;
  openJobsAwaitingContractor: number;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping homeowner digest');
    return { success: false, error: 'Email service not configured' };
  }
  const { homeowner, newContractorResponses, unreadMessageCount, savedEstimateCount, openJobsAwaitingContractor } = params;

  const blocks: EmailBlock[] = [
    { type: 'tag', content: 'Project Update' },
    { type: 'heading', content: 'Your QuoteXbert Project Update' },
  ];

  const activityParts: string[] = [];
  if (newContractorResponses > 0) activityParts.push(`<strong>${newContractorResponses}</strong> new contractor response${newContractorResponses === 1 ? '' : 's'}`);
  if (unreadMessageCount > 0) activityParts.push(`<strong>${unreadMessageCount}</strong> unread message${unreadMessageCount === 1 ? '' : 's'}`);
  if (activityParts.length > 0) {
    blocks.push({ type: 'card', label: 'Your conversations', rawHtml: true, content: activityParts.join('<br>') });
  }

  if (openJobsAwaitingContractor > 0) {
    blocks.push({
      type: 'text',
      content: `You have <strong>${openJobsAwaitingContractor}</strong> open project${openJobsAwaitingContractor === 1 ? '' : 's'} still waiting for a contractor response.`,
      rawHtml: true,
    });
  }

  if (savedEstimateCount > 0) {
    blocks.push({
      type: 'text',
      rawHtml: true,
      content: `You have <strong>${savedEstimateCount}</strong> saved estimate${savedEstimateCount === 1 ? '' : 's'} — <a href="${BASE_URL}/my-estimates" style="color:#9f1239;font-weight:600;">review them</a> or post a job to get contractor quotes.`,
    });
  }

  blocks.push({ type: 'cta', content: 'View Your Projects', href: `${BASE_URL}/messages` });

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: homeowner.email,
      subject: 'Your QuoteXbert Project Update',
      html: buildEmail('Your QuoteXbert Project Update', blocks, {
        unsubscribeUrl: buildUnsubscribeUrl(homeowner.id, 'digest'),
        unsubscribeLabel: 'Turn off project updates',
      }),
    });
    await logEmailEvent('homeowner_digest', homeowner.email, homeowner.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Homeowner digest sent to ${homeowner.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('homeowner_digest', homeowner.email, homeowner.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send homeowner digest:', error);
    return { success: false, error };
  }
}
