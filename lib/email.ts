import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.MAIL_FROM || "Quotexbert <no-reply@quotexbert.com>";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://quotexbert.com";

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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quotexbert</h1>
          </div>
          <div class="content">
            <h2>You have a new message</h2>
            <p>${preview}</p>
            <a href="${baseUrl}/messages?thread=${threadId}" class="button">View Message</a>
          </div>
          <div class="footer">
            <p>This email was sent by Quotexbert. Visit your <a href="${baseUrl}/messages">messages</a> to manage notifications.</p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quotexbert</h1>
          </div>
          <div class="content">
            <h2>Contract Ready for Review</h2>
            <p>A contract has been sent to you for review and acceptance.</p>
            <a href="${baseUrl}/contracts/${contractId}" class="button">Review Contract</a>
          </div>
          <div class="footer">
            <p>This email was sent by Quotexbert.</p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0; }
          .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quotexbert</h1>
          </div>
          <div class="content">
            <h2>Contract Fully Accepted</h2>
            <p>Great news! Both parties have accepted the contract and it's now active.</p>
            <a href="${baseUrl}/contracts/${contractId}" class="button">View Contract</a>
            ${pdfUrl ? `<a href="${pdfUrl}" class="button" style="background: #10b981;">Download PDF</a>` : ''}
          </div>
          <div class="footer">
            <p>This email was sent by Quotexbert.</p>
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

export async function sendLeadEmail(payload: LeadEmailPayload) {
  const fromEmail = process.env.FROM_EMAIL || "leads@quotexbert.com";
  const toEmail = process.env.TO_EMAIL || "owner@quotexbert.com";

  const emailContent = {
    from: fromEmail,
    to: toEmail,
    subject: `New quotexbert lead - ${payload.projectType}`,
    html: `
      <h2>New Lead Submitted</h2>
      <p><strong>Project Type:</strong> ${payload.projectType}</p>
      <p><strong>Postal Code:</strong> ${payload.postalCode}</p>
      <p><strong>Description:</strong> ${payload.description}</p>
      <p><strong>Estimated Value:</strong> ${payload.estimate}</p>
      <p><strong>Source:</strong> ${payload.source || "web"}</p>
      ${payload.affiliateId ? `<p><strong>Affiliate ID:</strong> ${payload.affiliateId}</p>` : ""}
      <hr>
      <p><em>Submitted via quotexbert.com</em></p>
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
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
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
      subject: "New message - Quotexbert",
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
      subject: "Contract ready for review - Quotexbert",
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
      subject: "Contract accepted - Quotexbert",
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
