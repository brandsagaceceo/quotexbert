import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://quotexbert.com";

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

// Utility function to get user email by ID (you'll need to implement this based on your user storage)
async function getUserEmail(userId: string): Promise<string | null> {
  try {
    // For now, return a placeholder - you'll need to implement actual user lookup
    // This would typically query your user database or Clerk
    return `user-${userId}@example.com`;
  } catch (error) {
    console.error("Failed to get user email:", error);
    return null;
  }
}

// Email templates
function createMessageReceivedTemplate(preview: string, threadId: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>New Message - Quotexbert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; background: #9f1239; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .support-footer { background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-size: 13px; color: #555; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Quotexbert</h1>
          </div>
          <div class="content">
            <h2>You have a new message</h2>
            <p>${preview}</p>
            <a href="${baseUrl}/messages?threadId=${threadId}" class="button">View Message</a>
            <p style="color: #6b7280; font-size: 13px;">Visit your <a href="${baseUrl}/messages" style="color: #9f1239;">messages</a> to manage notifications.</p>
          </div>
          <div class="support-footer">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
            <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
            <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
            <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function createContractSentTemplate(contractId: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contract Sent - Quotexbert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; background: #9f1239; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .support-footer { background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-size: 13px; color: #555; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Quotexbert</h1>
          </div>
          <div class="content">
            <h2>Contract Ready for Review</h2>
            <p>A contract has been sent to you for review and acceptance.</p>
            <a href="${baseUrl}/contracts/${contractId}" class="button">Review Contract</a>
          </div>
          <div class="support-footer">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
            <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
            <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
            <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function createContractAcceptedTemplate(contractId: string, pdfUrl?: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Contract Accepted - Quotexbert</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; background: #9f1239; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .support-footer { background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-size: 13px; color: #555; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Quotexbert</h1>
          </div>
          <div class="content">
            <h2>Contract Fully Accepted</h2>
            <p>Great news! Both parties have accepted the contract and it's now active.</p>
            <a href="${baseUrl}/contracts/${contractId}" class="button">View Contract</a>
            ${pdfUrl ? `<a href="${pdfUrl}" class="button" style="background: #10b981;">Download PDF</a>` : ''}
          </div>
          <div class="support-footer">
            <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
            <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
            <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
            <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
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
export async function sendWelcomeEmail(user: { id: string; email: string; name?: string | null }) {
  if (!resend) {
    console.warn('[EMAIL] RESEND_API_KEY not configured, skipping welcome email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Welcome to QuoteXbert! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">Welcome to QuoteXbert!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
                <h2>Hi ${user.name || 'there'}! 👋</h2>
                <p>Thanks for joining QuoteXbert - your AI-powered home renovation platform!</p>
                <p><strong>What you can do now:</strong></p>
                <ul>
                  <li>✨ Get instant AI estimates by uploading photos</li>
                  <li>👷 Connect with verified contractors</li>
                  <li>💰 Compare quotes and save money</li>
                  <li>📄 Generate professional contracts</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}" style="background: #9f1239; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Get Started</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Need help? Reply to this email or visit our support page.</p>
              </div>
              <div style="background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 13px; color: #555;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
                <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
                <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
                <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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
      from: fromEmail,
      to: contractor.email,
      subject: `New ${job.category} Job Available! 🔔`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">New Job Match!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
                <h2>Hi ${contractor.name || 'there'}! 👷</h2>
                <p>A new job matching your services just posted:</p>
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9f1239;">
                  <h3 style="margin-top: 0;">${job.title}</h3>
                  <p><strong>Category:</strong> ${job.category}</p>
                  <p><strong>Description:</strong> ${job.description.substring(0, 150)}${job.description.length > 150 ? '...' : ''}</p>
                  ${job.budget ? `<p><strong>Budget:</strong> ${job.budget}</p>` : ''}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/contractor/jobs" style="background: #9f1239; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">View Job Details</a>
                </div>
                <p style="color: #6b7280; font-size: 12px;">You're receiving this because you're subscribed to ${job.category} jobs.</p>
              </div>
              <div style="background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 13px; color: #555;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
                <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
                <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
                <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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
      from: fromEmail,
      to: recipient.email,
      subject: `New message from ${sender.name || 'a user'} 💬`,
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
      subject: "New Message — QuoteXbert",
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
      subject: "Contract Ready for Review — QuoteXbert",
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
      subject: "Contract Accepted — QuoteXbert",
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
      subject: `${contractor.companyName} Accepted Your Job! ✅`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">Good News!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
                <h2>Hi ${homeowner.name || 'there'}! 🎉</h2>
                <p><strong>${contractor.companyName}</strong> has accepted your job request!</p>
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                  <h3 style="margin-top: 0;">${job.title}</h3>
                  <p><strong>Contractor:</strong> ${contractor.companyName}</p>
                  <p><strong>Category:</strong> ${job.category}</p>
                  ${job.city ? `<p><strong>Location:</strong> ${job.city}</p>` : ''}
                </div>
                <p><strong>Next Steps:</strong></p>
                <ul>
                  <li>Message the contractor to discuss details</li>
                  <li>Schedule a site visit if needed</li>
                  <li>Request and review their quote</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/messages" style="background: #9f1239; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">Message Contractor</a>
                </div>
              </div>
              <div style="background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 13px; color: #555;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
                <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
                <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
                <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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
      subject: `New ${job.category} Lead on QuoteXbert`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">New Renovation Lead</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">QuoteXbert</p>
              </div>
              <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #9f1239;">
                  <h2 style="margin-top: 0; color: #9f1239;">${job.title || job.category}</h2>
                  ${job.city ? `<p style="font-size: 16px; margin: 10px 0;"><strong>📍 Location:</strong> ${job.city}</p>` : ''}
                  ${job.estimatedPrice ? `<p style="font-size: 18px; margin: 10px 0; color: #10b981;"><strong>💰 Estimated:</strong> ${job.estimatedPrice}</p>` : ''}
                  ${job.description ? `<p style="margin: 15px 0; color: #666;">${job.description.substring(0, 200)}${job.description.length > 200 ? '...' : ''}</p>` : ''}
                </div>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/contractor/jobs" style="background: #9f1239; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">View Lead</a>
                </div>
                <p style="color: #6b7280; font-size: 13px; text-align: center;">You're receiving this because this job matches your selected categories.</p>
              </div>
              <div style="background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 13px; color: #555;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
                <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
                <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
                <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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

  const stars = '⭐'.repeat(review.rating);

  try {
    await resend.emails.send({
      from: fromEmail,
      to: contractor.email,
      subject: `New ${review.rating}-Star Review Received! ⭐`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #9f1239 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="margin: 0;">New Review!</h1>
              </div>
              <div style="padding: 30px; background: #f9fafb; border-radius: 0 0 10px 10px;">
                <h2>Great news, ${contractor.companyName || 'there'}! 🎉</h2>
                <p>You've received a new review on QuoteXbert:</p>
                <div style="background: white; padding: 25px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                  <div style="font-size: 24px; margin-bottom: 10px;">${stars}</div>
                  <p style="margin: 10px 0;"><strong>Rating:</strong> ${review.rating}/5</p>
                  ${review.reviewerName ? `<p style="margin: 10px 0;"><strong>From:</strong> ${review.reviewerName}</p>` : ''}
                  ${review.comment ? `
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin-top: 15px;">
                      <p style="margin: 0; font-style: italic;">"${review.comment}"</p>
                    </div>
                  ` : ''}
                </div>
                <p><strong>Why reviews matter:</strong></p>
                <ul>
                  <li>Build trust with potential clients</li>
                  <li>Improve your ranking in search results</li>
                  <li>Showcase your quality work</li>
                </ul>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/contractor/profile" style="background: #9f1239; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">View Your Profile</a>
                </div>
              </div>
              <div style="background: #f8f8f8; border-top: 2px solid #9f1239; padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 13px; color: #555;">
                <p style="margin: 0 0 6px 0; font-weight: bold; color: #9f1239;">QuoteXbert Support</p>
                <p style="margin: 0 0 4px 0;">📧 <a href="mailto:quotexbert@gmail.com" style="color: #9f1239;">quotexbert@gmail.com</a></p>
                <p style="margin: 0 0 10px 0;">📞 905-242-9460</p>
                <p style="margin: 0; font-size: 11px; color: #999;">© 2025 QuoteXbert. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `
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
