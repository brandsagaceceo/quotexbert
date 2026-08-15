import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe";
import { isFoundingOfferEnabled } from "@/lib/founding-contractor-config";
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
export const CONTRACTOR_ACCOUNT_WELCOME_PHASE1_VARIANT = 'contractor-account-welcome-phase1-2026';
export const CONTRACTOR_ACCOUNT_WELCOME_SUBJECT = 'Welcome to QuoteXbert — your contractor account is ready';
export const CONTRACTOR_ACCOUNT_WELCOME_PREHEADER = 'Complete your profile and start browsing local homeowner projects.';
const LOGO_URL = `${BASE_URL}/logo.svg`;

// Domains that Resend rejects as undeliverable (seed/test/placeholder accounts).
// Including one of these in a batch send makes Resend reject the ENTIRE batch with
// a 422, so real contractors in the same batch receive nothing. We drop them before
// they ever enter a send.
const UNDELIVERABLE_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'email.com',
  'clerk.user',
  'user.clerk',
  'localhost',
]);

/**
 * True only for addresses Resend will actually accept. Rejects empty/malformed
 * addresses and known non-deliverable placeholder domains (example.com, the
 * `${clerkId}@clerk.user` fallback, etc.). Used to keep poison addresses out of
 * batch sends so one seed account can't block every real contractor.
 */
export function isSendableEmail(email: string | null | undefined): boolean {
  const value = (email || '').trim().toLowerCase();
  if (!value) return false;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return false;
  const domain = value.split('@')[1] || '';
  if (UNDELIVERABLE_EMAIL_DOMAINS.has(domain)) return false;
  return true;
}

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
      INSERT INTO email_events (
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
  type: 'heading' | 'text' | 'card' | 'cta' | 'tag' | 'sectionTitle' | 'infoBox' | 'warningBox' | 'successBox';
  content: string;
  href?: string;    // for 'cta'
  label?: string;   // for 'card' section labels
  rawHtml?: boolean; // skip HTML escaping when content is pre-sanitized
  tone?: 'default' | 'success'; // 'tag' pill color: burgundy (default) or green for successful billing/payment
}

/** Escape user-supplied values before injecting into HTML email templates */
function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function buildEmail(
  subject: string,
  blocks: EmailBlock[],
  footer?: { unsubscribeUrl?: string; unsubscribeLabel?: string },
  preheader = `${subject} - QuoteXbert`,
): string {
  const renderedBlocks = blocks.map((b) => {
    // When rawHtml is set, the caller has already sanitised the content (e.g. email
    // templates that compose their own inner HTML). Otherwise, escape by default.
    const c = b.rawHtml ? b.content : escHtml(b.content);
    if (b.type === 'heading') {
      return `<h1 class="qx-heading" style="margin:0 0 18px;font-size:30px;font-weight:800;color:#111111;line-height:1.22;letter-spacing:-0.02em;">${c}</h1>`;
    }
    if (b.type === 'text') {
      return `<p class="qx-text" style="margin:0 0 18px;font-size:16px;color:#4b5563;line-height:1.7;">${c}</p>`;
    }
    if (b.type === 'tag') {
      // Green pill for successful billing/payment; burgundy for leads, account actions, and general notices.
      const isSuccess = b.tone === 'success';
      const tagBg = isSuccess ? '#ecfdf3' : '#fff6f8';
      const tagColor = isSuccess ? '#067647' : '#800020';
      const tagBorder = isSuccess ? '#abefc6' : '#f3d6df';
      return `<span class="qx-tag" style="display:inline-block;background:${tagBg};color:${tagColor};font-size:11px;font-weight:800;padding:6px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 18px;border:1px solid ${tagBorder};">${c}</span>`;
    }
    if (b.type === 'sectionTitle') {
      return `<p class="qx-section-title" style="margin:0 0 12px;font-size:12px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.09em;">${c}</p>`;
    }
    if (b.type === 'card') {
      return `
        <div class="qx-card" style="background:#F9FAFB;border:1px solid #edf0f3;border-radius:12px;padding:20px 22px;margin:0 0 14px;box-shadow:0 1px 2px rgba(16,24,40,0.04);">
          ${b.label ? `<p style="margin:0 0 10px;font-size:11px;font-weight:800;color:#6b7280;text-transform:uppercase;letter-spacing:.08em;">${escHtml(b.label)}</p>` : ''}
          <div style="font-size:15px;color:#111827;line-height:1.68;">${b.rawHtml ? b.content : c}</div>
        </div>`;
    }
    if (b.type === 'infoBox') {
      return `<div class="qx-note" style="background:#f6f7fb;border:1px solid #dbe3ef;border-radius:12px;padding:16px 18px;margin:0 0 14px;font-size:14px;color:#374151;line-height:1.65;">${b.rawHtml ? b.content : c}</div>`;
    }
    if (b.type === 'warningBox') {
      return `<div class="qx-note" style="background:#fff7ed;border:1px solid #fdba74;border-radius:12px;padding:16px 18px;margin:0 0 14px;font-size:14px;color:#9a3412;line-height:1.65;">${b.rawHtml ? b.content : c}</div>`;
    }
    if (b.type === 'successBox') {
      return `<div class="qx-note" style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:16px 18px;margin:0 0 14px;font-size:14px;color:#166534;line-height:1.65;">${b.rawHtml ? b.content : c}</div>`;
    }
    if (b.type === 'cta') {
      return `
        <div class="qx-cta-wrap" style="text-align:center;margin:26px 0 6px;">
          <a class="qx-button" href="${b.href ? escHtml(b.href) : '#'}" style="display:inline-block;background:#800020;color:#ffffff;font-size:16px;font-weight:800;padding:15px 30px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;min-width:240px;">${c}</a>
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
    .qx-shell { padding: 12px 10px !important; }
    .qx-container { width: 100% !important; max-width: 100% !important; }
    .qx-header { padding: 22px 18px !important; }
    .qx-body { padding: 26px 18px 20px !important; }
    .qx-footer { padding: 20px 18px 22px !important; }
    .qx-heading { font-size: 25px !important; }
    .qx-button { display: block !important; width: 100% !important; min-width: 0 !important; box-sizing: border-box !important; }
    .qx-card { padding: 18px 18px !important; }
    .qx-note { padding: 15px 16px !important; }
    .qx-cta-wrap { margin: 22px 0 4px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#111111;">
<div style="display:none;max-height:0;overflow:hidden;color:transparent;opacity:0;">${escHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" class="qx-shell" style="background:#ffffff;padding:20px 10px;">
  <tr><td align="center">
    <table role="presentation" width="100%" class="qx-container" style="max-width:600px;border-collapse:separate;border-spacing:0;border-radius:16px;box-shadow:0 1px 3px rgba(16,24,40,0.06);" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr><td class="qx-header" style="background:#ffffff;border:1px solid #e5e7eb;border-bottom:0;border-radius:16px 16px 0 0;padding:24px 30px 20px;text-align:left;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:middle;padding-right:12px;">
            <div style="background:#F9FAFB;border:1px solid #edf0f3;border-radius:10px;padding:8px 10px;display:inline-block;line-height:0;">
              <img src="${LOGO_URL}" width="34" height="40" alt="QuoteXbert" style="display:block;border:0;outline:none;text-decoration:none;">
            </div>
          </td>
          <td style="vertical-align:middle;">
            <div style="font-size:28px;font-weight:900;color:#111111;letter-spacing:-0.03em;line-height:1.05;">QuoteXbert</div>
            <div style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:.08em;text-transform:uppercase;margin-top:4px;">Renovation Intelligence</div>
          </td>
        </tr></table>
        <div style="height:3px;background:linear-gradient(90deg,#800020,#b91c4b);border-radius:99px;margin-top:20px;"></div>
      </td></tr>

      <!-- Body -->
      <tr><td class="qx-body" style="background:#ffffff;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;padding:34px 30px 28px;">
        ${renderedBlocks}
      </td></tr>

      <!-- Footer -->
      <tr><td class="qx-footer" style="background:#ffffff;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 16px 16px;padding:20px 30px 24px;text-align:center;">
        <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;">Need help? Reach us at
          <a href="mailto:quotexbert@gmail.com" style="color:#800020;text-decoration:none;font-weight:600;">quotexbert@gmail.com</a>
          or call <a href="tel:9052429460" style="color:#800020;text-decoration:none;font-weight:600;">905-242-9460</a>
        </p>
        <p style="margin:0 0 6px;font-size:12px;">
          <a href="${BASE_URL}/notifications" style="color:#800020;text-decoration:none;font-weight:600;">Manage email preferences</a>${footer?.unsubscribeUrl ? ` &middot; <a href="${footer.unsubscribeUrl}" style="color:#6b7280;text-decoration:none;">${footer.unsubscribeLabel || 'Unsubscribe'}</a>` : ''}
        </p>
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">© ${new Date().getFullYear()} QuoteXbert · Toronto, Durham Region & the GTA</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function sectionTitle(content: string): EmailBlock {
  return { type: 'sectionTitle', content };
}

export function infoBox(content: string, rawHtml = false): EmailBlock {
  return { type: 'infoBox', content, rawHtml };
}

export function warningBox(content: string, rawHtml = false): EmailBlock {
  return { type: 'warningBox', content, rawHtml };
}

export function successBox(content: string, rawHtml = false): EmailBlock {
  return { type: 'successBox', content, rawHtml };
}

export function keyValueCard(label: string, rows: Array<{ label: string; value: string }>): EmailBlock {
  const htmlRows = rows
    .map((row) => `<tr><td style="padding:4px 0;color:#6b7280;font-size:14px;width:40%;">${escHtml(row.label)}</td><td style="padding:4px 0;color:#111827;font-size:14px;font-weight:600;">${escHtml(row.value)}</td></tr>`)
    .join('');
  return {
    type: 'card',
    label,
    rawHtml: true,
    content: `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table>`,
  };
}

export function photoGalleryCard(label: string, urls: string[]): EmailBlock {
  const images = urls
    .slice(0, 4)
    .map((url) => `<td style="padding:4px;"><img src="${escHtml(url)}" alt="Project photo" width="120" style="display:block;width:100%;max-width:120px;border-radius:10px;border:1px solid #e5e7eb;"></td>`)
    .join('');
  return {
    type: 'card',
    label,
    rawHtml: true,
    content: `<table role="presentation" cellpadding="0" cellspacing="0"><tr>${images}</tr></table>`,
  };
}

// Email templates
function createMessageReceivedTemplate(preview: string, threadId: string, senderName?: string, jobTitle?: string, recipientId?: string, contractorId?: string): string {
  const safePreview = escHtml(preview);
  const safeSender = senderName ? escHtml(senderName) : null;
  const safeJob = jobTitle ? escHtml(jobTitle) : null;
  // contractorId identifies WHICH contractor this message is from — a lead can
  // have several contractors sharing one Thread, so threadId alone isn't enough
  // to open the right contractor's conversation. Same routing rule as in-app.
  const ctaHref = `${baseUrl}/messages?threadId=${threadId}${contractorId ? `&contractorId=${contractorId}` : ''}`;
  return buildEmail(`New Message${safeSender ? ` from ${safeSender}` : ''} — QuoteXbert`, [
    { type: 'tag', content: 'New Message' },
    { type: 'heading', content: safeSender ? `Message from ${safeSender}` : 'You have a new message', rawHtml: true },
    ...(safeJob ? [{ type: 'text' as const, content: `Re: <strong>${safeJob}</strong>`, rawHtml: true }] : []),
    { type: 'card', content: `<em style="color:#64748b;">"${safePreview}"</em>`, label: 'Message Preview', rawHtml: true },
    { type: 'cta', content: 'Reply Now →', href: ctaHref },
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

export function buildContractorOfferBlocks(isReminder = false, isPaid = false): EmailBlock[] {
  // ── Hero ──────────────────────────────────────────────────────────────────
  const heroBlock: EmailBlock = {
    type: 'text',
    rawHtml: true,
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="text-align:center;padding:8px 0 32px;">
          <div style="font-size:44px;line-height:1;margin:0 0 18px;">🔥</div>
          <h1 style="margin:0 0 14px;font-size:26px;font-weight:900;color:#111827;line-height:1.25;letter-spacing:-0.03em;">
            New Homeowner Projects<br>Are Waiting
          </h1>
          <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
            Real homeowners are posting renovation projects right now.<br>
            Check the QuoteXbert Job Board before they're claimed.
          </p>
          <a href="${BASE_URL}/contractor/jobs"
             style="display:inline-block;background:#800020;color:#ffffff;font-size:16px;font-weight:800;padding:16px 40px;border-radius:12px;text-decoration:none;letter-spacing:-0.01em;box-shadow:0 10px 24px rgba(128,0,32,0.22);">
            View Available Jobs →
          </a>
        </td></tr>
      </table>`,
  };

  // ── Divider ───────────────────────────────────────────────────────────────
  const divider: EmailBlock = {
    type: 'text',
    rawHtml: true,
    content: `<div style="border-top:1px solid #e2e8f0;margin:4px 0 28px;"></div>`,
  };

  // ── Feature card: Why Check Today? ────────────────────────────────────────
  const featureCard: EmailBlock = {
    type: 'card',
    rawHtml: true,
    label: 'Why Check Today?',
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr><td style="padding:6px 0;">
          <span style="font-size:15px;">✅</span>&nbsp;
          <span style="font-size:15px;color:#1e293b;font-weight:600;">New homeowner renovation projects</span>
        </td></tr>
        <tr><td style="padding:6px 0;">
          <span style="font-size:15px;">✅</span>&nbsp;
          <span style="font-size:15px;color:#1e293b;font-weight:600;">Check jobs that match your business</span>
        </td></tr>
        <tr><td style="padding:6px 0;">
          <span style="font-size:15px;">✅</span>&nbsp;
          <span style="font-size:15px;color:#1e293b;font-weight:600;">Stay ahead of other contractors</span>
        </td></tr>
        <tr><td style="padding:6px 0;">
          <span style="font-size:15px;">✅</span>&nbsp;
          <span style="font-size:15px;color:#1e293b;font-weight:600;">Fill gaps in your schedule</span>
        </td></tr>
      </table>`,
  };

  // ── Project types card (two-column table) ─────────────────────────────────
  const projectTypesCard: EmailBlock = {
    type: 'card',
    rawHtml: true,
    label: 'Popular Projects Being Posted',
    content: `
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td width="50%" style="padding:7px 10px 7px 0;font-size:14px;color:#334155;vertical-align:top;">🏠 Kitchen Renovations</td>
          <td width="50%" style="padding:7px 0 7px 10px;font-size:14px;color:#334155;vertical-align:top;">🛁 Bathroom Renovations</td>
        </tr>
        <tr>
          <td style="padding:7px 10px 7px 0;font-size:14px;color:#334155;">🎨 Painting</td>
          <td style="padding:7px 0 7px 10px;font-size:14px;color:#334155;">🔨 Handyman Services</td>
        </tr>
        <tr>
          <td style="padding:7px 10px 7px 0;font-size:14px;color:#334155;">⚡ Electrical</td>
          <td style="padding:7px 0 7px 10px;font-size:14px;color:#334155;">🚿 Plumbing</td>
        </tr>
        <tr>
          <td style="padding:7px 10px 7px 0;font-size:14px;color:#334155;">🪟 Windows &amp; Doors</td>
          <td style="padding:7px 0 7px 10px;font-size:14px;color:#334155;">🌿 Landscaping</td>
        </tr>
        <tr>
          <td style="padding:7px 10px 7px 0;font-size:14px;color:#334155;">🧱 Masonry</td>
          <td style="padding:7px 0 7px 10px;font-size:14px;color:#334155;">🏗 General Renovations</td>
        </tr>
      </table>`,
  };

  // ── Urgency card (burgundy) ────────────────────────────────────────────────
  const urgencyBlock: EmailBlock = {
    type: 'text',
    rawHtml: true,
    content: `
      <div style="background:#800020;border-radius:16px;padding:26px 28px;margin:0 0 28px;text-align:center;">
        <p style="margin:0 0 12px;font-size:20px;font-weight:900;color:#ffffff;letter-spacing:-0.02em;line-height:1.2;">
          ⏰ Don't Wait Too Long
        </p>
        <p style="margin:0;font-size:14px;color:#fecdd3;line-height:1.75;">
          New projects are claimed quickly.<br>
          Checking the Job Board regularly gives you the best opportunity<br>
          to connect with homeowners looking for work today.
        </p>
      </div>`,
  };

  // ── Subscription section: paid vs free ────────────────────────────────────
  const subscriptionBlock: EmailBlock = isPaid
    ? {
        type: 'text',
        rawHtml: true,
        content: `
          <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:14px;padding:22px 26px;margin:0 0 28px;text-align:center;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#166534;line-height:1.3;">
              ✅ Your contractor membership is active.
            </p>
            <p style="margin:0;font-size:14px;color:#475569;line-height:1.65;">
              You're ready to start reviewing homeowner projects immediately.
            </p>
          </div>`,
      }
    : {
        type: 'text',
        rawHtml: true,
        content: `
          <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:26px 28px;margin:0 0 28px;text-align:center;">
            <p style="margin:0 0 10px;font-size:20px;font-weight:900;color:#6b21a8;letter-spacing:-0.02em;line-height:1.25;">
              Ready to Start Winning More Jobs?
            </p>
            <p style="margin:0 0 22px;font-size:14px;color:#475569;line-height:1.7;">
              Upgrade your contractor account to unlock full access to homeowner projects,
              messaging and future premium features.
            </p>
            <a href="${BASE_URL}/contractor/subscriptions"
               style="display:inline-block;background:#6b21a8;color:#ffffff;font-size:15px;font-weight:800;padding:14px 32px;border-radius:12px;text-decoration:none;box-shadow:0 8px 18px rgba(107,33,168,0.22);">
              View Contractor Plans →
            </a>
          </div>`,
      };

  return [heroBlock, divider, featureCard, projectTypesCard, urgencyBlock, subscriptionBlock];
}

export const CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN = 'contractor-job-board-99-cent-offer-2026';
export const CONTRACTOR_JOB_BOARD_OFFER_SUBJECT = 'Homeowner jobs are waiting — your first month is only $0.99';
export const CONTRACTOR_JOB_BOARD_OFFER_ALTERNATIVE_SUBJECT = 'Your QuoteXbert contractor account is ready';
export const CONTRACTOR_JOB_BOARD_OFFER_PREHEADER = 'Browse local homeowner projects and unlock the categories you want to work in.';

export interface ContractorJobBoardOfferRecipient {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  isActive: boolean;
  notifyMarketingEmail: boolean;
  subscriptionStatus: string | null;
  subscriptions: Array<{
    status: string;
    monthlyPrice: number;
    currentPeriodEnd: Date | null;
  }>;
}

export interface ContractorJobBoardOfferCounts {
  eligible: number;
  missingEmail: number;
  invalidEmail: number;
  inactive: number;
  wrongRole: number;
  internalAccount: number;
  marketingOptOut: number;
  activePaidSubscription: number;
  duplicateCampaignRecipient: number;
  alreadySentCampaign: number;
}

export interface ContractorJobBoardOfferPlan {
  recipients: Array<{ id: string; email: string; name: string | null }>;
  counts: ContractorJobBoardOfferCounts;
}

const CONTRACTOR_JOB_BOARD_OFFER_INTERNAL_EMAILS = new Set([
  'brandsagaceo@gmail.com',
  'quotexbert@gmail.com',
]);

function isInternalOrStaffAccountEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (CONTRACTOR_JOB_BOARD_OFFER_INTERNAL_EMAILS.has(normalized)) return true;
  if (normalized.endsWith('@quotexbert.com')) return true;
  if (isUnlimitedTestContractor(normalized)) return true;
  return false;
}

function isValidCampaignEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function hasCurrentAccessWindowForCampaign(currentPeriodEnd: Date | null): boolean {
  return !currentPeriodEnd || currentPeriodEnd.getTime() >= Date.now();
}

function hasPaidSubscriptionForCampaign(recipient: ContractorJobBoardOfferRecipient): boolean {
  if (["active", "trialing"].includes(recipient.subscriptionStatus || "")) {
    return true;
  }

  return recipient.subscriptions.some((subscription) => {
    return (
      ["active", "trialing"].includes(subscription.status) &&
      subscription.monthlyPrice > 0 &&
      hasCurrentAccessWindowForCampaign(subscription.currentPeriodEnd)
    );
  });
}

export function planContractorJobBoardOfferRecipients(
  contractors: ContractorJobBoardOfferRecipient[],
  alreadySentRecipientKeys = new Set<string>()
): ContractorJobBoardOfferPlan {
  const counts: ContractorJobBoardOfferCounts = {
    eligible: 0,
    missingEmail: 0,
    invalidEmail: 0,
    inactive: 0,
    wrongRole: 0,
    internalAccount: 0,
    marketingOptOut: 0,
    activePaidSubscription: 0,
    duplicateCampaignRecipient: 0,
    alreadySentCampaign: 0,
  };

  const recipients: Array<{ id: string; email: string; name: string | null }> = [];
  const seenEmails = new Set<string>();

  for (const contractor of contractors) {
    if (contractor.role !== 'contractor') {
      counts.wrongRole++;
      continue;
    }

    if (!contractor.isActive) {
      counts.inactive++;
      continue;
    }

    if (!contractor.email) {
      counts.missingEmail++;
      continue;
    }

    const normalizedEmail = contractor.email.trim().toLowerCase();
    if (!isValidCampaignEmail(normalizedEmail)) {
      counts.invalidEmail++;
      continue;
    }

    if (isInternalOrStaffAccountEmail(normalizedEmail)) {
      counts.internalAccount++;
      continue;
    }

    if (!contractor.notifyMarketingEmail) {
      counts.marketingOptOut++;
      continue;
    }

    if (hasPaidSubscriptionForCampaign(contractor)) {
      counts.activePaidSubscription++;
      continue;
    }

    if (alreadySentRecipientKeys.has(normalizedEmail) || alreadySentRecipientKeys.has(contractor.id)) {
      counts.alreadySentCampaign++;
      continue;
    }

    if (seenEmails.has(normalizedEmail)) {
      counts.duplicateCampaignRecipient++;
      continue;
    }

    seenEmails.add(normalizedEmail);
    counts.eligible++;
    recipients.push({ id: contractor.id, email: normalizedEmail, name: contractor.name });
  }

  return { recipients, counts };
}

export function buildContractorJobBoardOfferHtml(params: {
  firstName?: string | null;
  availableJobCount?: number | null;
  unsubscribeUserId: string;
}): string {
  const firstName = params.firstName?.trim() || 'there';
  const availableJobCount =
    typeof params.availableJobCount === 'number' && Number.isFinite(params.availableJobCount)
      ? Math.max(0, Math.floor(params.availableJobCount))
      : null;
  const jobCountLine = availableJobCount !== null
    ? `There are currently ${availableJobCount} open homeowner projects on the QuoteXbert Job Board.`
    : 'Homeowners are actively posting local projects on the QuoteXbert Job Board.';

  return buildEmail(CONTRACTOR_JOB_BOARD_OFFER_SUBJECT, [
    { type: 'tag', content: 'Contractor Account Ready' },
    { type: 'heading', content: `Hi ${firstName},` },
    { type: 'text', content: 'Thanks for joining QuoteXbert.' },
    { type: 'text', content: 'Your contractor account is active, and homeowners are posting renovation and home-service projects on the QuoteXbert Job Board.' },
    { type: 'text', content: jobCountLine },
    { type: 'text', content: 'You can browse available opportunities for free and see the types of projects being posted in your area.' },
    { type: 'text', content: 'To unlock the full project details and accept a homeowner job, activate a subscription for the category that matches your services.' },
    { type: 'text', content: 'For a limited time, your first month is only $0.99.' },
    {
      type: 'card',
      label: 'With an active category subscription, you can unlock:',
      rawHtml: true,
      content:
        '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Full project descriptions</li><li style="margin-bottom:6px;">Homeowner project photos</li><li style="margin-bottom:6px;">Available homeowner contact details</li><li style="margin-bottom:6px;">The ability to accept matching jobs</li><li>New lead alerts for your selected categories</li></ul>',
    },
    { type: 'text', content: 'Do not wait until another contractor responds to a project that fits your business.' },
    { type: 'cta', content: 'View My Job Board', href: `${BASE_URL}/contractor/jobs` },
    { type: 'cta', content: 'Unlock My Categories', href: `${BASE_URL}/contractor/subscriptions` },
    { type: 'text', content: 'Thanks for being part of QuoteXbert. The QuoteXbert Team' },
    {
      type: 'text',
      rawHtml: true,
      content:
        '<p style="margin:0;font-size:13px;color:#64748b;line-height:1.65;">P.S. Free contractors can browse available jobs. Contractors with an active matching category subscription can unlock the full details and accept homeowner projects.</p>',
    },
  ], {
    unsubscribeUrl: buildUnsubscribeUrl(params.unsubscribeUserId, 'marketing'),
    unsubscribeLabel: 'Turn off marketing emails',
  });
}

export async function sendContractorJobBoardOfferEmail(contractor: {
  id: string;
  email: string;
  name?: string | null;
}, options: { availableJobCount?: number | null } = {}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor job board offer');
    return { success: false, error: 'Email service not configured' };
  }

  if (isUnlimitedTestContractor(contractor.email)) {
    return { success: false, skipped: true, reason: 'internal_bypass_account' };
  }

  if (await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN)) {
    return { success: false, skipped: true, reason: 'already_sent' };
  }

  const firstName = (contractor.name || '').split(' ')[0] || 'there';

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: CONTRACTOR_JOB_BOARD_OFFER_SUBJECT,
      html: buildContractorJobBoardOfferHtml({
        firstName,
        availableJobCount: options.availableJobCount,
        unsubscribeUserId: contractor.id,
      }),
    });

    await logEmailEvent(CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'sent');
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent(CONTRACTOR_JOB_BOARD_OFFER_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor job board offer:', error);
    return { success: false, error };
  }
}

export async function sendContractorJobBoardOfferTestEmail({
  testEmail,
  firstName,
  availableJobCount,
  unsubscribeUserId,
}: {
  testEmail: string;
  firstName?: string | null;
  availableJobCount?: number | null;
  unsubscribeUserId: string;
}) {
  const subject = `[TEST] ${CONTRACTOR_JOB_BOARD_OFFER_SUBJECT}`;

  return sendSharedEmail({
    to: testEmail,
    subject,
    html: buildContractorJobBoardOfferHtml({
      firstName,
      availableJobCount,
      unsubscribeUserId,
    }),
  });
}

export const CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN = 'contractor_profile_optimization_aug_2026';
export const CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT = 'A quick way to improve your QuoteXbert profile';
export const CONTRACTOR_PROFILE_OPTIMIZATION_PREHEADER = 'A strong profile photo and recent work can help homeowners feel more confident reaching out.';

export interface ContractorProfileOptimizationRecipient {
  id: string;
  email: string | null;
  name: string | null;
  role: string | null;
  isActive: boolean;
  notifyMarketingEmail: boolean;
  subscriptionStatus: string | null;
  subscriptionCurrentPeriodEnd: Date | null;
  subscriptions: Array<{
    status: string;
    monthlyPrice: number;
    currentPeriodEnd: Date | null;
  }>;
}

export interface ContractorProfileOptimizationCounts {
  contractorsScanned: number;
  payingActive: number;
  eligibleRecipients: number;
  excludedFree: number;
  excludedCanceledInactive: number;
  excludedPreferenceUnsubscribed: number;
  excludedInvalidEmail: number;
  excludedInternalAccount: number;
  excludedDuplicateEmail: number;
  alreadyReceivedCampaign: number;
  wouldSend: number;
}

export interface ContractorProfileOptimizationPlan {
  recipients: Array<{ id: string; email: string; name: string | null }>;
  counts: ContractorProfileOptimizationCounts;
}

function hasCurrentPaidProfileOptimizationAccess(contractor: ContractorProfileOptimizationRecipient, now: number): boolean {
  const userAccessIsCurrent =
    ['active', 'trialing'].includes(contractor.subscriptionStatus || '') &&
    (!contractor.subscriptionCurrentPeriodEnd || contractor.subscriptionCurrentPeriodEnd.getTime() >= now);

  if (userAccessIsCurrent) return true;

  return contractor.subscriptions.some((subscription) =>
    ['active', 'trialing'].includes(subscription.status) &&
    subscription.monthlyPrice > 0 &&
    (!subscription.currentPeriodEnd || subscription.currentPeriodEnd.getTime() >= now)
  );
}

function hasPaidSubscriptionHistory(contractor: ContractorProfileOptimizationRecipient): boolean {
  return Boolean(contractor.subscriptionStatus) || contractor.subscriptions.some((subscription) => subscription.monthlyPrice > 0);
}

export function planContractorProfileOptimizationRecipients(
  contractors: ContractorProfileOptimizationRecipient[],
  alreadySentRecipientKeys = new Set<string>(),
  now = Date.now(),
): ContractorProfileOptimizationPlan {
  const counts: ContractorProfileOptimizationCounts = {
    contractorsScanned: contractors.length,
    payingActive: 0,
    eligibleRecipients: 0,
    excludedFree: 0,
    excludedCanceledInactive: 0,
    excludedPreferenceUnsubscribed: 0,
    excludedInvalidEmail: 0,
    excludedInternalAccount: 0,
    excludedDuplicateEmail: 0,
    alreadyReceivedCampaign: 0,
    wouldSend: 0,
  };
  const recipients: Array<{ id: string; email: string; name: string | null }> = [];
  const seenEmails = new Set<string>();

  for (const contractor of contractors) {
    const hasCurrentPaidAccess = hasCurrentPaidProfileOptimizationAccess(contractor, now);
    if (hasCurrentPaidAccess) counts.payingActive++;

    if (contractor.role !== 'contractor' || !contractor.isActive) {
      counts.excludedCanceledInactive++;
      continue;
    }

    if (!hasCurrentPaidAccess) {
      if (hasPaidSubscriptionHistory(contractor)) counts.excludedCanceledInactive++;
      else counts.excludedFree++;
      continue;
    }

    if (!contractor.email || !isSendableEmail(contractor.email)) {
      counts.excludedInvalidEmail++;
      continue;
    }

    const normalizedEmail = contractor.email.trim().toLowerCase();
    if (isInternalOrStaffAccountEmail(normalizedEmail)) {
      counts.excludedInternalAccount++;
      continue;
    }

    if (!contractor.notifyMarketingEmail) {
      counts.excludedPreferenceUnsubscribed++;
      continue;
    }

    if (alreadySentRecipientKeys.has(contractor.id.toLowerCase()) || alreadySentRecipientKeys.has(normalizedEmail)) {
      counts.alreadyReceivedCampaign++;
      continue;
    }

    if (seenEmails.has(normalizedEmail)) {
      counts.excludedDuplicateEmail++;
      continue;
    }

    seenEmails.add(normalizedEmail);
    recipients.push({ id: contractor.id, email: normalizedEmail, name: contractor.name });
  }

  counts.eligibleRecipients = recipients.length;
  counts.wouldSend = recipients.length;
  return { recipients, counts };
}

export function buildContractorProfileOptimizationHtml(params: {
  firstName?: string | null;
  unsubscribeUserId?: string | null;
}): string {
  const firstName = params.firstName?.trim() || 'there';
  const footer = params.unsubscribeUserId
    ? {
        unsubscribeUrl: buildUnsubscribeUrl(params.unsubscribeUserId, 'marketing'),
        unsubscribeLabel: 'Turn off marketing emails',
      }
    : {
        unsubscribeUrl: `${BASE_URL}/unsubscribe?preview=1`,
        unsubscribeLabel: 'Turn off marketing emails',
      };

  return buildEmail(CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT, [
    { type: 'tag', content: 'Profile Tip' },
    { type: 'heading', content: 'A quick tip to help you stand out' },
    { type: 'text', content: `Hi ${firstName},` },
    { type: 'text', content: "We hope you're enjoying QuoteXbert so far." },
    { type: 'text', content: 'As we continue bringing more homeowners onto the platform, we wanted to share a few simple things you can do to help your profile stand out when homeowners are comparing contractors.' },
    { type: 'sectionTitle', content: 'Put a face to your business' },
    { type: 'text', content: "If you haven't already, upload a profile photo. A clear personal photo or simple selfie works great." },
    { type: 'text', content: "Homeowners aren't just hiring a company - they're choosing the person they feel comfortable inviting into their home." },
    { type: 'text', content: '<strong>People buy from people.</strong> Having a clear, friendly photo can help build trust before you have even had the first conversation.', rawHtml: true },
    { type: 'sectionTitle', content: 'Show homeowners your recent work' },
    { type: 'text', content: 'Make sure your QuoteXbert profile includes photos of your recent projects. Whether it is a renovation, painting job, flooring installation, landscaping project, repair, or other completed work, real project photos help homeowners understand the quality of work you provide.' },
    {
      type: 'card',
      label: 'A strong profile should ideally have',
      rawHtml: true,
      content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">A clear profile photo</li><li style="margin-bottom:6px;">A short description of what you specialize in</li><li style="margin-bottom:6px;">Photos of recent work</li><li style="margin-bottom:6px;">Accurate service categories</li><li>An up-to-date service area</li></ul>',
    },
    { type: 'cta', content: 'Update My Profile', href: `${BASE_URL}/contractor/profile/edit` },
    { type: 'sectionTitle', content: 'Keep an eye on the Job Board' },
    { type: 'text', content: 'We have increased our homeowner marketing efforts for the coming months and will continue working to bring more homeowners and job opportunities onto QuoteXbert. Make sure you are checking the Job Board regularly so you do not miss opportunities in your categories and service area.' },
    { type: 'text', content: `<div style="text-align:center;"><a href="${BASE_URL}/contractor/jobs" style="color:#800020;text-decoration:none;font-weight:700;">View Job Board</a></div>`, rawHtml: true },
    { type: 'sectionTitle', content: "We're building this with contractors" },
    { type: 'text', content: 'Your feedback matters. If there is something you would like to see improved, changed, or added to QuoteXbert, please reach out.' },
    { type: 'text', content: 'If you have questions about your profile, the Job Board, quoting, or anything else, we are happy to help.' },
    { type: 'text', content: '<strong>Text us at <a href="sms:9052429460" style="color:#800020;text-decoration:none;">905-242-9460</a> to schedule a quick call.</strong>', rawHtml: true },
    { type: 'text', content: 'Thanks for being part of QuoteXbert.' },
    { type: 'text', content: '<strong>The QuoteXbert Team</strong>', rawHtml: true },
  ], footer, CONTRACTOR_PROFILE_OPTIMIZATION_PREHEADER);
}

export async function sendContractorProfileOptimizationEmail(contractorId: string) {
  const contractor = await prisma.user.findUnique({
    where: { id: contractorId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      notifyMarketingEmail: true,
      subscriptionStatus: true,
      subscriptionCurrentPeriodEnd: true,
      subscriptions: {
        select: { status: true, monthlyPrice: true, currentPeriodEnd: true },
      },
    },
  });

  if (!contractor) return { success: false, skipped: true, reason: 'contractor_not_found' };

  const sentKeys = new Set<string>();
  if (await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN)) {
    sentKeys.add(contractor.id.toLowerCase());
    sentKeys.add(contractor.email.toLowerCase());
  }
  const plan = planContractorProfileOptimizationRecipients([contractor], sentKeys);
  const recipient = plan.recipients[0];
  if (!recipient) return { success: false, skipped: true, reason: 'no_longer_eligible' };

  try {
    const result = await sendSharedEmail({
      to: recipient.email,
      subject: CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT,
      html: buildContractorProfileOptimizationHtml({
        firstName: (recipient.name || '').split(' ')[0] || 'there',
        unsubscribeUserId: recipient.id,
      }),
    });
    if (!result.success) throw result.error;
    await logEmailEvent(CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN, recipient.email, recipient.id, undefined, undefined, 'sent');
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent(CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN, recipient.email, recipient.id, undefined, undefined, 'failed', errorMsg);
    return { success: false, error };
  }
}

interface ProfileOptimizationTestSendResponse {
  data: { id: string } | null;
  error: unknown | null;
}

export async function sendContractorProfileOptimizationTestEmail(
  testEmail: string,
  send = (payload: any) => resend!.emails.send(payload) as Promise<ProfileOptimizationTestSendResponse>,
) {
  const subject = `[TEST] ${CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT}`;
  const payload = {
    from: fromEmail,
    replyTo: REPLY_TO,
    to: testEmail,
    subject,
    html: buildContractorProfileOptimizationHtml({ firstName: 'QuoteXbert Test' }),
  };

  if (!resend && arguments.length < 2) {
    return {
      success: false,
      apiAccepted: false,
      messageId: null,
      error: 'Email service not configured',
      payload: { to: testEmail, subject, from: fromEmail, replyTo: REPLY_TO },
    };
  }

  try {
    const response = await send(payload);
    if (response.error) {
      return {
        success: false,
        apiAccepted: false,
        messageId: null,
        error: response.error,
        payload: { to: testEmail, subject, from: fromEmail, replyTo: REPLY_TO },
      };
    }

    const messageId = response.data?.id || null;
    return {
      success: Boolean(messageId),
      apiAccepted: Boolean(messageId),
      messageId,
      error: messageId ? null : 'Resend returned no error and no message ID',
      payload: { to: testEmail, subject, from: fromEmail, replyTo: REPLY_TO },
    };
  } catch (error) {
    return {
      success: false,
      apiAccepted: false,
      messageId: null,
      error,
      payload: { to: testEmail, subject, from: fromEmail, replyTo: REPLY_TO },
    };
  }
}

export async function getContractorProfileOptimizationTestEmailStatus(messageId: string) {
  if (!resendClient) return { success: false, status: null, error: 'Email service not configured' };

  try {
    const response = await resendClient.emails.get(messageId);
    if (response.error) return { success: false, status: null, error: response.error };
    return { success: true, status: response.data.last_event, error: null };
  } catch (error) {
    return { success: false, status: null, error };
  }
}

// Campaign type for the general contractor announcement blast (separate from founding offer dedup key)
const CONTRACTOR_ANNOUNCEMENT_CAMPAIGN = 'contractor_announcement_v1';

/**
 * Send the general contractor announcement to a single contractor.
 * Unlike sendContractorOnboardingOfferEmail, this:
 *  - Is NOT gated by isFoundingOfferEnabled()
 *  - Sends to paid AND unpaid contractors (passing isPaid to the template)
 *  - Uses a separate campaign dedup key so old onboarding-offer recipients are not blocked
 *
 * Caller is responsible for filtering by isActive and notifyJobEmail before calling this.
 */
export async function sendContractorAnnouncementEmail(contractor: {
  id: string;
  email: string;
  name?: string | null;
  isPaid: boolean;
}) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping contractor announcement');
    return { success: false, error: 'Email service not configured' };
  }

  if (isUnlimitedTestContractor(contractor.email)) {
    return { success: false, skipped: true, reason: 'internal_bypass_account' };
  }

  if (await hasCampaignEmail(contractor.id, contractor.email, CONTRACTOR_ANNOUNCEMENT_CAMPAIGN)) {
    return { success: false, skipped: true, reason: 'already_sent' };
  }

  const subject = contractor.isPaid
    ? '✅ Your QuoteXbert Contractor Account is Active — Homeowner Projects Are Waiting'
    : '🔥 New Homeowner Projects Are Waiting on the QuoteXbert Job Board';

  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject,
      html: buildEmail(subject, buildContractorOfferBlocks(false, contractor.isPaid), {
        unsubscribeUrl: buildUnsubscribeUrl(contractor.id, 'marketing'),
        unsubscribeLabel: 'Turn off marketing emails',
      }),
    });

    await logEmailEvent(CONTRACTOR_ANNOUNCEMENT_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Contractor announcement sent to ${contractor.email} (isPaid=${contractor.isPaid})`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent(CONTRACTOR_ANNOUNCEMENT_CAMPAIGN, contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send contractor announcement:', error);
    return { success: false, error };
  }
}

/**
 * Send a single test announcement email to an arbitrary address.
 * - Subject is prefixed with [TEST]
 * - Uses fake preview contractor data — no real contractor queried
 * - Nothing is written to EmailEvent; campaign dedup is untouched
 * - Both isPaid variants are supported
 */
export async function sendContractorAnnouncementTestEmail({
  testEmail,
  isPaid,
}: {
  testEmail: string;
  isPaid: boolean;
}) {
  const baseSubject = isPaid
    ? '✅ Your QuoteXbert Contractor Account is Active — Homeowner Projects Are Waiting'
    : '🔥 New Homeowner Projects Are Waiting on the QuoteXbert Job Board';
  const subject = `[TEST] ${baseSubject}`;

  // Fake unsubscribe URL — not tied to any real user id
  const fakeUnsubscribeUrl = 'https://www.quotexbert.com/unsubscribe?preview=1';

  return sendSharedEmail({
    to: testEmail,
    subject,
    html: buildEmail(subject, buildContractorOfferBlocks(false, isPaid), {
      unsubscribeUrl: fakeUnsubscribeUrl,
      unsubscribeLabel: 'Turn off marketing emails',
    }),
  });
}

export function buildContractorAccountWelcomeHtml(params: {
  firstName?: string | null;
  unsubscribeUserId: string;
}) {
  const firstName = params.firstName?.trim() || 'there';

  return buildEmail(CONTRACTOR_ACCOUNT_WELCOME_SUBJECT, [
    { type: 'tag', content: 'Contractor Account' },
    { type: 'heading', content: `Hi ${firstName},` },
    { type: 'text', content: CONTRACTOR_ACCOUNT_WELCOME_PREHEADER },
    { type: 'text', content: 'Welcome to QuoteXbert.' },
    { type: 'text', content: 'Your contractor account is now active.' },
    { type: 'text', content: 'QuoteXbert helps contractors discover homeowner renovation and home-service projects in their area.' },
    {
      type: 'card',
      label: 'Best next steps',
      rawHtml: true,
      content:
        '<ol style="margin:0;padding-left:18px;"><li style="margin-bottom:7px;">Complete your contractor profile</li><li style="margin-bottom:7px;">Choose the service categories you offer</li><li style="margin-bottom:7px;">Set your service area</li><li style="margin-bottom:7px;">Browse available homeowner projects</li><li>Turn on job alerts for the categories that matter to you</li></ol>',
    },
    {
      type: 'text',
      content:
        'Free contractors can browse available opportunities. An active matching category subscription is required to unlock full project details and accept a job.',
    },
    { type: 'cta', content: 'View My Job Board', href: `${BASE_URL}/contractor/jobs` },
    { type: 'cta', content: 'Complete My Profile', href: `${BASE_URL}/contractor/profile/edit` },
    { type: 'text', content: 'Thanks for joining QuoteXbert.' },
    { type: 'text', content: 'The QuoteXbert Team' },
  ], {
    unsubscribeUrl: buildUnsubscribeUrl(params.unsubscribeUserId, 'job'),
    unsubscribeLabel: 'Turn off job emails',
  });
}

export async function sendContractorAccountWelcomeTestEmail({
  testEmail,
  firstName,
  unsubscribeUserId,
}: {
  testEmail: string;
  firstName?: string | null;
  unsubscribeUserId: string;
}) {
  return sendSharedEmail({
    to: testEmail,
    subject: `[TEST] ${CONTRACTOR_ACCOUNT_WELCOME_SUBJECT}`,
    html: buildContractorAccountWelcomeHtml({ firstName, unsubscribeUserId }),
  });
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
      subject: '🔥 New Homeowner Projects Are Waiting on the QuoteXbert Job Board',
      html: buildEmail('🔥 New Homeowner Projects Are Waiting on the QuoteXbert Job Board', buildContractorOfferBlocks(false), {
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
      subject: '⏰ Reminder: Homeowner Projects Are Still Waiting — QuoteXbert',
      html: buildEmail('⏰ Reminder: Homeowner Projects Are Still Waiting — QuoteXbert', buildContractorOfferBlocks(true), {
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

  // Check subscription status so we can tailor CTA for free vs paid contractors
  const isPaid = await contractorHasPaidSubscription(contractor.id).catch(() => false);

  try {
    const { subject, html } = buildNewJobEmailContent(job, isPaid);

    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject,
      html,
    });

    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job notification sent to ${contractor.email} for lead ${job.id} (paid=${isPaid})`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send job notification:', error);
    return { success: false, error };
  }
}

/**
 * Build the subject + HTML for the "new job" contractor email.
 * Extracted so both the single-send path (sendNewJobEmail) and the batched
 * bulk-send path (sendBulkEmails, used by NotificationService.notifyAllContractors)
 * render an identical email without duplicating template markup.
 */
export function buildNewJobEmailContent(
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
  },
  isPaid: boolean
): { subject: string; html: string } {
  const urgency = getJobUrgencyForEmail(job.createdAt ?? undefined);
  const cityProvince = [job.city, job.province].filter(
    (v): v is string => typeof v === 'string' && v.trim() !== '' && v !== 'Not specified'
  ).join(', ');
  const displayLocation = cityProvince || job.location || null;
  const submittedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const estimatedProjectValue = job.budget || 'Contact for pricing';
  const jobDeepLink = `${BASE_URL}/contractor/jobs?highlight=${encodeURIComponent(job.id)}`;

  // Build lead details card HTML
  const detailRows = [
    `<tr><td style="padding:4px 0;font-size:14px;color:#64748b;width:38%;">📍 Location</td><td style="padding:4px 0;font-size:14px;color:#0f172a;font-weight:600;">${escHtml(displayLocation || 'Available in lead details')}</td></tr>`,
    `<tr><td style="padding:4px 0;font-size:14px;color:#64748b;">🔧 Category</td><td style="padding:4px 0;font-size:14px;color:#0f172a;font-weight:600;">${escHtml(job.category)}</td></tr>`,
    `<tr><td style="padding:4px 0;font-size:14px;color:#64748b;">💰 Budget</td><td style="padding:4px 0;font-size:14px;color:#0f172a;font-weight:600;">${escHtml(estimatedProjectValue)}</td></tr>`,
    `<tr><td style="padding:4px 0;font-size:14px;color:#64748b;">📅 Posted</td><td style="padding:4px 0;font-size:14px;color:#0f172a;">${escHtml(submittedDate)}</td></tr>`,
  ].join('');

  const urgencyBadgeHtml = `<div style="display:inline-block;background:#fff1f2;color:#9f1239;font-size:12px;font-weight:800;padding:5px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:.08em;margin:0 0 14px;border:1px solid #fecdd3;">${urgency.emoji} HOT LEAD JUST POSTED NEAR YOU</div>`;
  const postedTimeHtml = `<p style="margin:0 0 16px;font-size:13px;color:#64748b;font-style:italic;">${urgency.label}</p>`;

  const upgradeBlock = !isPaid ? `
      <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:18px 20px;margin:20px 0 0;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#6b21a8;">🔓 Want to claim this lead?</p>
        <p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.6;">This lead is live on the QuoteXbert Job Board. Choose a plan to unlock full access, submit quotes, and start securing projects.</p>
        <div style="text-align:center;">
          <a href="${BASE_URL}/contractor/subscriptions" style="display:inline-block;background:#6b21a8;color:#ffffff;font-size:14px;font-weight:800;padding:11px 22px;border-radius:10px;text-decoration:none;">View Plans &amp; Access Jobs →</a>
        </div>
      </div>` : '';

  const emailBlocks: EmailBlock[] = [
    { type: 'heading', rawHtml: true, content: urgencyBadgeHtml + postedTimeHtml + escHtml(job.title) },
    {
      type: 'card',
      rawHtml: true,
      label: 'Estimated Project Value',
      content: `<div style="font-size:28px;line-height:1.1;font-weight:900;color:#800020;letter-spacing:-0.03em;">${escHtml(estimatedProjectValue)}</div><p style="margin:6px 0 0;color:#64748b;font-size:12px;">Review the full scope before submitting your quote.</p>`,
    },
    {
      type: 'card',
      rawHtml: true,
      label: 'Lead Details',
      content: `<table style="width:100%;border-collapse:collapse;">${detailRows}</table>`,
    },
    {
      type: 'card',
      label: 'Homeowner Description',
      content: job.description.substring(0, 500) + (job.description.length > 500 ? '...' : ''),
    },
    { type: 'cta', content: isPaid ? 'View This Job →' : 'View Job Details', href: jobDeepLink },
    {
      type: 'text',
      rawHtml: true,
      content: `<p style="margin:0 0 0;font-size:12px;color:#94a3b8;text-align:center;">Review the full project details and act before another contractor claims it.</p>${upgradeBlock}`,
    },
    {
      type: 'text',
      rawHtml: true,
      content: `<span style="font-size:11px;color:#94a3b8;">You're receiving this as a QuoteXbert contractor. <a href="${BASE_URL}/notifications" style="color:#9f1239;font-weight:700;text-decoration:none;">Manage alerts</a></span>`,
    },
  ];

  const subject = cityProvince
    ? `${urgency.emoji} New ${job.category} job in ${cityProvince} — QuoteXbert`
    : `${urgency.emoji} New ${job.category} lead near you — QuoteXbert`;

  return { subject, html: buildEmail(`New ${escHtml(job.category)} Lead — QuoteXbert`, emailBlocks) };
}

/**
 * Build the subject + HTML for the "teaser" job alert sent to contractors who do
 * not have a claimable entitlement for the job's category (free / non-matching tiers).
 */
export function buildTeaserJobEmailContent(category: string): { subject: string; html: string } {
  const cat = category || 'Home Improvement';
  return {
    subject: `${cat} job posted on QuoteXbert`,
    html: buildEmail('New Job Posted on QuoteXbert', [
      { type: 'tag', content: 'New Job Alert' },
      { type: 'heading', content: `A new ${cat} job is live` },
      { type: 'text', content: 'New homeowner work is available on QuoteXbert. Upgrade this category to unlock full details, submit quotes, and claim the lead.' },
      {
        type: 'card',
        label: 'What you can see now',
        rawHtml: true,
        content: `<strong>Category:</strong> ${escHtml(cat)}<br><strong>Access:</strong> Locked until you subscribe to this category`,
      },
      { type: 'cta', content: 'View Plans & Unlock Jobs', href: `${BASE_URL}/contractor/subscriptions` },
    ]),
  };
}

/**
 * Send many pre-built emails through Resend's batch endpoint (up to 100 per request).
 *
 * Firing one HTTP request per recipient with Promise.all exceeded Resend's rate limit
 * (429), and the SDK returns that error instead of throwing — so those failures were
 * silently swallowed and contractors received nothing. Batching keeps the whole fan-out
 * to a single request per 100 recipients, which stays within the rate limit.
 */
interface BulkBatchPayload {
  from: string;
  replyTo: string;
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface BulkEmailContext {
  /** Job/lead id included in structured logs for traceability. */
  jobId?: string;
  /** Injectable batch sender (tests); defaults to the module Resend client. */
  batchSend?: (payload: BulkBatchPayload[]) => Promise<unknown>;
  /** Base backoff in ms for rate-limit retries. */
  baseRetryDelayMs?: number;
  /** Max rate-limit retries per chunk (in addition to the first attempt). */
  maxRetries?: number;
}

/** Replace anything that looks like an email address so logs never leak recipients. */
function redactEmails(input: unknown): string {
  const text = typeof input === 'string' ? input : (() => {
    try { return JSON.stringify(input); } catch { return String(input); }
  })();
  return (text || '').replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]');
}

function describeResendError(err: any): { status: number | null; name: string; message: string } {
  return {
    status: err?.statusCode ?? err?.status ?? null,
    name: String(err?.name || 'unknown'),
    message: redactEmails(err?.message ?? err),
  };
}

function isRateLimitError(err: any): boolean {
  if (!err) return false;
  const statusCode = err.statusCode ?? err.status;
  const name = String(err.name || '').toLowerCase();
  const message = String(err.message || '').toLowerCase();
  return statusCode === 429 || name.includes('rate_limit') || message.includes('rate limit') || message.includes('too many requests');
}

/** Build a concise, PII-free JSON string suitable for persisting in EmailEvent.error. */
function normalizeBatchError(failure: unknown, thrown: boolean, attempts: number): string {
  const { status, name, message } = describeResendError(failure);
  const concise = message.length > 300 ? `${message.slice(0, 300)}…` : message;
  return JSON.stringify({ status, name, message: concise, thrown, attempts });
}

export async function sendBulkEmails(
  messages: Array<{ to: string; subject: string; html: string }>,
  context: BulkEmailContext = {}
): Promise<{ sent: number; failed: number; failedTo: Set<string>; errorByRecipient: Map<string, string> }> {
  const failedTo = new Set<string>();
  // Keyed by the exact `to` string used for the send (same key space as failedTo).
  const errorByRecipient = new Map<string, string>();
  const jobId = context.jobId;

  const batchSend = context.batchSend
    ?? (resendClient ? (payload: BulkBatchPayload[]) => resendClient.batch.send(payload as any) : null);

  if (!batchSend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping bulk send', { jobId, batchSize: messages.length });
    const configError = JSON.stringify({ status: null, name: 'not_configured', message: 'RESEND_API_KEY not configured', thrown: false, attempts: 0 });
    for (const m of messages) {
      failedTo.add(m.to);
      errorByRecipient.set(m.to, configError);
    }
    return { sent: 0, failed: messages.length, failedTo, errorByRecipient };
  }

  const maxRetries = context.maxRetries ?? 4;
  const baseRetryDelayMs = context.baseRetryDelayMs ?? 600;
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  let sent = 0;
  let failed = 0;
  const CHUNK_SIZE = 100;

  type BatchOutcome = { ok: true } | { ok: false; error: string; rateLimited: boolean };

  // Send a single batch, retrying only on 429/rate-limit with exponential backoff.
  // Resend's default limit is ~2 requests/second; a job post fires several emails in quick
  // succession, so the batch is frequently throttled with a 429 (returned as { error }, not
  // thrown). A 429 means nothing was sent, so retrying the identical batch cannot duplicate.
  // Validation errors (e.g. an undeliverable address) are permanent and returned immediately.
  async function attemptBatch(chunk: typeof messages): Promise<BatchOutcome> {
    const batchPayload: BulkBatchPayload[] = chunk.map((m) => ({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: m.to,
      subject: m.subject,
      html: m.html,
      text: htmlToPlainText(m.html),
    }));

    let lastError = '';
    let lastRateLimited = false;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let threw = false;
      let failure: unknown;
      try {
        const result = await batchSend!(batchPayload);
        failure = (result as any)?.error ?? undefined;
      } catch (err) {
        threw = true;
        failure = err;
      }

      if (!failure) return { ok: true };

      const { status, name, message } = describeResendError(failure);
      const rateLimited = isRateLimitError(failure);
      if (rateLimited && attempt < maxRetries) {
        const retryInMs = baseRetryDelayMs * Math.pow(2, attempt);
        console.warn('[EMAIL] Bulk send rate-limited, retrying', {
          jobId, batchSize: chunk.length, attempt: attempt + 1, status, name, message, retryInMs, thrown: threw,
        });
        await sleep(retryInMs);
        continue;
      }

      lastError = normalizeBatchError(failure, threw, attempt + 1);
      lastRateLimited = rateLimited;
      console.error('[EMAIL] Bulk send failed', {
        jobId, batchSize: chunk.length, attempt: attempt + 1, status, name, message, thrown: threw,
      });
      return { ok: false, error: lastError, rateLimited: lastRateLimited };
    }
    return { ok: false, error: lastError, rateLimited: lastRateLimited };
  }

  // Deliver a chunk. Resend's batch endpoint is all-or-nothing on validation: a SINGLE
  // undeliverable address makes it reject the ENTIRE batch with a 422, so every real
  // contractor in that batch would otherwise receive nothing. On a permanent (non-rate-limit)
  // failure we split the chunk and retry each half, isolating the bad address so all
  // deliverable recipients still get their email. Splitting is safe: a rejected batch sent
  // nothing, so re-sending sub-batches cannot duplicate. We do NOT split on rate-limit
  // exhaustion — the whole batch was throttled, and splitting would only multiply throttled requests.
  async function deliverChunk(chunk: typeof messages): Promise<void> {
    const outcome = await attemptBatch(chunk);
    if (outcome.ok) {
      sent += chunk.length;
      return;
    }

    if (!outcome.rateLimited && chunk.length > 1) {
      const mid = Math.ceil(chunk.length / 2);
      await deliverChunk(chunk.slice(0, mid));
      await deliverChunk(chunk.slice(mid));
      return;
    }

    failed += chunk.length;
    for (const m of chunk) {
      failedTo.add(m.to);
      if (outcome.error) errorByRecipient.set(m.to, outcome.error);
    }
  }

  for (let i = 0; i < messages.length; i += CHUNK_SIZE) {
    await deliverChunk(messages.slice(i, i + CHUNK_SIZE));
  }

  return { sent, failed, failedTo, errorByRecipient };
}
// New Message Email
export async function sendNewMessageEmail(
  recipient: { id: string; email: string; name?: string | null },
  sender: { name?: string | null; id?: string },
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
      html: createMessageReceivedTemplate(messagePreview, threadId, sender.name ?? undefined, jobTitle, recipient.id, sender.id),
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
  contractor: { id: string; companyName: string; name?: string | null },
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
        // Previously linked to the bare /messages inbox with no job/contractor context at all.
        { type: 'cta', content: 'Message Contractor', href: `${baseUrl}/messages?leadId=${encodeURIComponent(job.id)}&contractorId=${encodeURIComponent(contractor.id)}` },
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
  contractorId?: string;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping quote-received email');
    return { success: false, error: 'Email service not configured' };
  }
  const { homeowner, contractorName, jobTitle, totalCost, leadId, contractorId } = params;
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
        { type: 'cta', content: 'View Quote & Reply', href: `${baseUrl}/messages?leadId=${encodeURIComponent(leadId)}${contractorId ? `&contractorId=${encodeURIComponent(contractorId)}` : ''}` },
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

// Quote Accepted Email (contractor receives when homeowner accepts their quote)
export async function sendQuoteAcceptedEmail(params: {
  contractor: { id: string; email: string; name?: string | null };
  homeownerName: string;
  jobTitle: string;
  totalCost: number;
  leadId: string;
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping quote-accepted email');
    return { success: false, error: 'Email service not configured' };
  }
  const { contractor, homeownerName, jobTitle, totalCost, leadId } = params;
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `Your quote was accepted — ${jobTitle}`,
      html: buildEmail('Quote Accepted — QuoteXbert', [
        { type: 'tag', content: 'Quote Accepted', tone: 'success' },
        { type: 'heading', content: 'Your quote was accepted!' },
        { type: 'text', content: `${escHtml(homeownerName)} accepted your quote.` },
        { type: 'card', label: 'Quote Details', rawHtml: true, content: `<strong>Project:</strong> ${escHtml(jobTitle)}<br><strong>Quote Total:</strong> $${escHtml(totalCost.toLocaleString())}` },
        { type: 'cta', content: 'Message Homeowner', href: `${baseUrl}/messages?leadId=${encodeURIComponent(leadId)}` },
      ]),
    });
    await logEmailEvent('quote_accepted', contractor.email, contractor.id, leadId, undefined, 'sent');
    console.log(`[EMAIL] Quote-accepted email sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('quote_accepted', contractor.email, contractor.id, leadId, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send quote-accepted email:', error);
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
        { type: 'tag', content: `${tierLabel} Plan`, tone: 'success' },
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
        { type: 'tag', content: 'Subscription Billing', tone: 'success' },
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
