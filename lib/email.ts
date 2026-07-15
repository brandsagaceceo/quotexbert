import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "https://www.quotexbert.com";
/** @deprecated use BASE_URL */
const baseUrl = BASE_URL;
const REPLY_TO = 'quotexbert@gmail.com';

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

interface EmailBlock {
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

function buildEmail(
  subject: string,
  blocks: EmailBlock[],
  footer?: { unsubscribeUrl?: string; unsubscribeLabel?: string }
): string {
  const renderedBlocks = blocks.map((b) => {
    // When rawHtml is set, the caller has already sanitised the content (e.g. email
    // templates that compose their own inner HTML). Otherwise, escape by default.
    const c = b.rawHtml ? b.content : escHtml(b.content);
    if (b.type === 'heading') {
      return `<h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#1e293b;line-height:1.3;">${c}</h2>`;
    }
    if (b.type === 'text') {
      return `<p style="margin:0 0 14px;font-size:14px;color:#475569;line-height:1.6;">${c}</p>`;
    }
    if (b.type === 'tag') {
      return `<span style="display:inline-block;background:#fef2f2;color:#9f1239;font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:14px;">${c}</span>`;
    }
    if (b.type === 'card') {
      return `
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;margin:0 0 20px;">
          ${b.label ? `<p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:.5px;">${escHtml(b.label)}</p>` : ''}
          <div style="font-size:14px;color:#334155;line-height:1.6;">${b.rawHtml ? b.content : c}</div>
        </div>`;
    }
    if (b.type === 'cta') {
      return `
        <div style="text-align:center;margin:24px 0 8px;">
          <a href="${b.href ? escHtml(b.href) : '#'}" style="display:inline-block;background:linear-gradient(135deg,#9f1239,#ea580c);color:#fff;font-size:15px;font-weight:700;padding:13px 32px;border-radius:8px;text-decoration:none;letter-spacing:.2px;">${c}</a>
        </div>`;
    }
    return '';
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
  <tr><td align="center">
    <table width="100%" style="max-width:560px;" cellpadding="0" cellspacing="0">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#9f1239 0%,#ea580c 100%);border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
        <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-.3px;">QuoteXbert</span>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#fff;padding:28px 32px 24px;">
        ${renderedBlocks}
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 12px 12px;padding:18px 32px;text-align:center;">
        <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Need help? Reach us at
          <a href="mailto:quotexbert@gmail.com" style="color:#9f1239;text-decoration:none;font-weight:600;">quotexbert@gmail.com</a>
          or call <a href="tel:9052429460" style="color:#9f1239;text-decoration:none;font-weight:600;">905-242-9460</a>
        </p>
        <p style="margin:0 0 6px;font-size:12px;">
          <a href="${BASE_URL}/notifications" style="color:#9f1239;text-decoration:none;font-weight:600;">Manage email preferences</a>${footer?.unsubscribeUrl ? ` &middot; <a href="${footer.unsubscribeUrl}" style="color:#94a3b8;text-decoration:none;">${footer.unsubscribeLabel || 'Unsubscribe'}</a>` : ''}
        </p>
        <p style="margin:0;font-size:11px;color:#94a3b8;">Â© ${new Date().getFullYear()} QuoteXbert Â· All rights reserved</p>
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
  estimate: string;
  source?: string;
  affiliateId?: string;
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
  const displayLocation = job.city || job.location || null;
  // Deep link highlights the specific job card when the contractor opens the page
  const jobDeepLink = `${BASE_URL}/contractor/jobs?highlight=${encodeURIComponent(job.id)}`;

  try {
    const cardRows: string[] = [
      `<strong>Category:</strong> ${escHtml(job.category)}`,
      displayLocation ? `<strong>Location:</strong> ${escHtml(displayLocation)}` : '',
      job.budget ? `<strong>Budget:</strong> ${escHtml(job.budget)}` : '',
      `<strong>Urgency:</strong> ${urgency.emoji} ${escHtml(urgency.label)}`,
    ].filter(Boolean);

    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `${urgency.emoji} New ${job.category} lead near you — QuoteXbert`,
      html: buildEmail(`New ${escHtml(job.category)} Lead — QuoteXbert`, [
        { type: 'tag', content: `${urgency.emoji} ${urgency.label}` },
        { type: 'heading', content: job.title },
        { type: 'text', content: job.description.substring(0, 180) + (job.description.length > 180 ? '...' : '') },
        {
          type: 'card',
          rawHtml: true,
          content: cardRows.join('<br>'),
          label: 'Job Details',
        },
        { type: 'cta', content: '👉 View Job Now', href: jobDeepLink },
        {
          type: 'text',
          content: `<span style="font-size:12px;color:#94a3b8;">You're receiving this because you're subscribed to ${escHtml(job.category)} jobs on QuoteXbert. <a href="${BASE_URL}/contractor/settings" style="color:#9f1239;">Manage alerts</a></span>`,
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

  const emailContent = {
    from: fromEmail,
    to: toEmail,
    subject: `New QuoteXbert Lead - ${payload.projectType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Lead Submitted</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Project Type:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.projectType}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Postal Code:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.postalCode}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Description:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.description}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Estimated Value:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.estimate}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Source:</strong></td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.source || "web"}</td>
          </tr>
          ${payload.affiliateId ? `<tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Affiliate ID:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${payload.affiliateId}</td></tr>` : ""}
        </table>
        <p style="margin-top: 20px; color: #666; font-size: 14px;">Submitted via quotexbert.com on ${new Date().toLocaleString()}</p>
      </div>
    `,
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
    await resend.emails.send({
      from: fromEmail,
      to: contractor.email,
      subject: `New ${escHtml(job.category)} Lead on QuoteXbert`,
      html: buildEmail(`New ${escHtml(job.category)} Lead â€” QuoteXbert`, [
        { type: 'tag', content: job.category },
        { type: 'heading', content: job.title || job.category },
        { type: 'card', label: 'Lead Details', rawHtml: true, content: `${job.city ? `<strong>Location:</strong> ${escHtml(job.city)}<br>` : ''}${job.estimatedPrice ? `<strong>Est. Value:</strong> ${escHtml(job.estimatedPrice)}<br>` : ''}${job.description ? `<span style="color:#64748b;">${escHtml(job.description.substring(0, 200))}${job.description.length > 200 ? 'â€¦' : ''}</span>` : ''}` },
        { type: 'cta', content: 'View Lead', href: `${baseUrl}/contractor/jobs` },
        { type: 'text', content: '<span style="font-size:12px;color:#94a3b8;">You\'re receiving this because this project matches your selected service categories.</span>', rawHtml: true },
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
  job: { id: string; title: string; category: string };
}): Promise<{ success: boolean; error?: any }> {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping job-posted email');
    return { success: false, error: 'Email service not configured' };
  }
  const { homeowner, job } = params;
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: homeowner.email,
      subject: 'Your project is now live on QuoteXbert',
      html: buildEmail('Your Project is Live â€” QuoteXbert', [
        { type: 'tag', content: job.category },
        { type: 'heading', content: `"${escHtml(job.title)}" is now live!`, rawHtml: true },
        { type: 'text', content: 'Your project has been posted and matching contractors have been notified.' },
        { type: 'card', label: 'What happens next', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li style="margin-bottom:6px;">Contractors will review your project</li><li style="margin-bottom:6px;">You\'ll receive quotes directly in your messages</li><li>Accept the quote that best fits your budget and schedule</li></ul>' },
        { type: 'cta', content: 'View My Messages', href: `${baseUrl}/messages` },
      ]),
    });
    await logEmailEvent('job_posted', homeowner.email, homeowner.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job-posted confirmation sent to ${homeowner.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('job_posted', homeowner.email, homeowner.id, job.id, undefined, 'failed', errorMsg);
    console.error('[EMAIL] Failed to send job-posted email:', error);
    return { success: false, error };
  }
}

// â”€â”€â”€ Quote Received Notification (homeowner) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  try {
    await resend.emails.send({
      from: fromEmail,
      replyTo: REPLY_TO,
      to: contractor.email,
      subject: `✅ Payment received — QuoteXbert ${tierLabel} Plan renewed`,
      html: buildEmail(`${tierLabel} Plan Renewed — QuoteXbert`, [
        { type: 'tag', content: 'Payment Received' },
        { type: 'heading', content: 'Your subscription has been renewed' },
        { type: 'card', label: 'Receipt', rawHtml: true, content: `<strong>Plan:</strong> ${escHtml(tierLabel)}<br><strong>Amount Paid:</strong> $${amountPaid.toFixed(2)} CAD${nextBillingDate ? `<br><strong>Next Billing Date:</strong> ${new Date(nextBillingDate).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}` },
        { type: 'cta', content: 'View Jobs', href: `${BASE_URL}/contractor/jobs` },
        { type: 'text', content: 'Questions? Call <a href="tel:9052429460" style="color:#9f1239;">905-242-9460</a>', rawHtml: true },
      ]),
    });
    await logEmailEvent('subscription_renewed', contractor.email, contractor.id, undefined, undefined, 'sent');
    console.log(`[EMAIL] Renewal receipt sent to ${contractor.email}`);
    return { success: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    await logEmailEvent('subscription_renewed', contractor.email, contractor.id, undefined, undefined, 'failed', errorMsg);
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
