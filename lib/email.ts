import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

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

interface LeadEmailPayload {
  postalCode: string;
  projectType: string;
  description: string;
  estimate: string;
  source?: string;
  affiliateId?: string;
}

// Utility function to get user email by ID
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

function buildEmail(subject: string, blocks: EmailBlock[]): string {
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
        <p style="margin:0;font-size:11px;color:#94a3b8;">Â© ${new Date().getFullYear()} QuoteXbert Â· All rights reserved</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

// Email templates
function createMessageReceivedTemplate(preview: string, threadId: string): string {
  const safePreview = escHtml(preview);
  return buildEmail('New Message â€” QuoteXbert', [
    { type: 'tag', content: 'New Message' },
    { type: 'heading', content: 'You have a new message' },
    { type: 'card', content: `<em style="color:#64748b;">"${safePreview}"</em>`, label: 'Preview', rawHtml: true },
    { type: 'cta', content: 'Reply Now', href: `${baseUrl}/messages?threadId=${threadId}` },
    { type: 'text', content: `Manage all your messages at <a href="${baseUrl}/messages" style="color:#9f1239;text-decoration:none;font-weight:600;">QuoteXbert Messages</a>.`, rawHtml: true },
  ]);
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
export async function sendNewJobEmail(
  contractor: { id: string; email: string; name?: string | null },
  job: { id: string; title: string; category: string; description: string; budget?: string | null }
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping job notification');
    return { success: false, error: 'Email service not configured' };
  }

  // Check if user has notifications enabled
  try {
    const user = await prisma.user.findUnique({
      where: { id: contractor.id },
      select: { email: true } // Add notificationsEnabled field to schema if needed
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await resend.emails.send({
      from: fromEmail,      replyTo: REPLY_TO,      to: contractor.email,
      subject: `New ${escHtml(job.category)} Job Available! ðŸ””`,
      html: buildEmail(`New ${escHtml(job.category)} Job Match â€” QuoteXbert`, [
        { type: 'tag', content: job.category },
        { type: 'heading', content: job.title },
        { type: 'text', content: job.description.substring(0, 160) + (job.description.length > 160 ? 'â€¦' : '') },
        { type: 'card', rawHtml: true, content: `<strong>Category:</strong> ${escHtml(job.category)}${job.budget ? `<br><strong>Budget:</strong> ${escHtml(job.budget)}` : ''}`, label: 'Job Details' },
        { type: 'cta', content: 'View Job', href: `${baseUrl}/contractor/jobs` },
        { type: 'text', content: `<span style="font-size:12px;color:#94a3b8;">You're receiving this because you're subscribed to ${escHtml(job.category)} jobs.</span>`, rawHtml: true },
      ])
    });

    await logEmailEvent('new_job', contractor.email, contractor.id, job.id, undefined, 'sent');
    console.log(`[EMAIL] Job notification sent to ${contractor.email}`);
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
  threadId: string
) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping message notification');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,      replyTo: REPLY_TO,      to: recipient.email,
      subject: `New message from ${sender.name || 'a user'} ðŸ’¬`,
      html: createMessageReceivedTemplate(messagePreview, threadId)
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

