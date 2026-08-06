import { prisma } from "@/lib/prisma";
import { buildEmail, sendNewMessageEmail, sendNewJobEmail, sendWelcomeEmail, sendReviewReceivedEmail, sendSharedEmail, buildNewJobEmailContent, buildTeaserJobEmailContent, sendBulkEmails, isSendableEmail } from "@/lib/email";
import { categoryMatchesEntitlement } from "@/lib/subscription-access";

const CLAIMABLE_STATUSES = new Set(["active", "trialing"]);
const LEAD_NOTIFICATION_DEDUPE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type LeadNotificationAccessLevel = "full" | "teaser" | "skip";

export interface LeadNotificationSubscription {
  category: string;
  status: string;
  canClaimLeads: boolean;
  currentPeriodEnd: Date | null;
}

export interface LeadNotificationAudience {
  isActive: boolean;
  subscriptions: LeadNotificationSubscription[];
}

export interface LeadNotificationJobDetails {
  leadId: string;
  title: string;
  description: string;
  budget: number | string | null;
  city?: string | undefined;
  province?: string | undefined;
  category?: string | undefined;
  createdAt?: string | undefined;
  isSeeded?: boolean | undefined;
}

interface LeadNotificationPayload {
  leadId: string;
  jobId: string;
  jobTitle: string;
  title: string;
  description: string;
  budget: number | string | null;
  city: string;
  province: string;
  category: string;
  createdAt: string;
  fullAccess: boolean;
}

function hasCurrentAccessWindow(currentPeriodEnd: Date | null, now = Date.now()): boolean {
  return !currentPeriodEnd || currentPeriodEnd.getTime() >= now;
}

export function getLeadNotificationAccess(
  contractor: LeadNotificationAudience,
  jobCategory?: string,
  now = Date.now()
): LeadNotificationAccessLevel {
  if (!contractor.isActive) return "skip";

  if (!jobCategory?.trim()) {
    return "teaser";
  }

  const hasMatchingEntitlement = contractor.subscriptions.some((subscription) =>
    subscription.canClaimLeads &&
    CLAIMABLE_STATUSES.has(subscription.status) &&
    hasCurrentAccessWindow(subscription.currentPeriodEnd, now) &&
    categoryMatchesEntitlement(jobCategory, subscription.category)
  );

  return hasMatchingEntitlement ? "full" : "teaser";
}

export function buildLeadNotificationPayload(
  jobDetails: LeadNotificationJobDetails,
  accessLevel: Exclude<LeadNotificationAccessLevel, "skip">
): LeadNotificationPayload {
  const category = jobDetails.category?.trim() || "Home Improvement";
  const createdAt = jobDetails.createdAt || new Date().toISOString();

  if (accessLevel === "full") {
    return {
      leadId: jobDetails.leadId,
      jobId: jobDetails.leadId,
      jobTitle: jobDetails.title,
      title: `New ${category} job available`,
      description: jobDetails.description.substring(0, 200) + (jobDetails.description.length > 200 ? '...' : ''),
      budget: jobDetails.budget,
      city: jobDetails.city || 'Not specified',
      province: jobDetails.province || '',
      category,
      createdAt,
      fullAccess: true,
    };
  }

  return {
    leadId: jobDetails.leadId,
    jobId: jobDetails.leadId,
    jobTitle: jobDetails.title,
    title: `New ${category} job available`,
    description: `A new ${category} job was posted. Subscribe to unlock full details and claim this lead.`,
    budget: null,
    city: 'Your area',
    province: '',
    category,
    createdAt,
    fullAccess: false,
  };
}

// Email data interface
interface EmailData {
  to: string;
  subject: string;
  html: string;
}

// Resend-based fallback email send (for types not covered by lib/email helpers)
async function sendEmailViaResend({ to, subject, html }: EmailData) {
  return sendSharedEmail({ to, subject, html });
}

export type NotificationType = 
  | "JOB_CLAIMED"
  | "NEW_MESSAGE" 
  | "LEAD_MATCHED"
  | "SUBSCRIPTION_PAYMENT_RECEIPT"
  | "PAYMENT_FAILED"
  | "LEAD_EXPIRED"
  | "CONTRACT_SIGNED"
  | "REVIEW_RECEIVED"
  | "ACCOUNT_VERIFIED"
  | "WELCOME";

export interface NotificationPayload {
  leadId?: string;
  messageId?: string;
  contractId?: string;
  amount?: number;
  title?: string;
  message?: string;
  actionUrl?: string;
  emailSubject?: string;
  smsMessage?: string;
  [key: string]: any;
}

interface CreateNotificationOptions {
  userId: string;
  type: NotificationType;
  payload: NotificationPayload;
  sendEmail?: boolean;
  sendSms?: boolean;
}

/**
 * Create and send notifications to users
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  static async create({
    userId,
    type,
    payload,
    sendEmail = true,
    sendSms = false
  }: CreateNotificationOptions) {
    try {
      // First get user data for email
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          contractorProfile: {
            select: {
              companyName: true
            }
          },
          homeownerProfile: {
            select: {
              name: true
            }
          }
        }
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Dedup: skip creating (and re-emailing) a notification that already exists for this
      // user/type/lead combo within the last 24h. Prevents duplicate LEAD_MATCHED notifications
      // if notifyAllContractors is ever triggered twice for the same lead.
      if (payload.leadId) {
        const existing = await prisma.notification.findFirst({
          where: {
            userId,
            type,
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            payload: { path: ['leadId'], equals: payload.leadId },
          },
          select: { id: true },
        });
        if (existing) {
          console.log(`[NOTIFY] Skipping duplicate ${type} notification for user ${userId}, lead ${payload.leadId}`);
          return existing;
        }
      }

      // Create better title and message based on type
      let title = payload.title || `New ${type.replace('_', ' ')}`;
      let message = payload.message || `You have a new ${type.replace('_', ' ').toLowerCase()}`;

      // Create database notification
      const notification = await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          payload: payload as any,
          read: false
        }
      });

      // Send email notification if enabled
      if (sendEmail && user.email) {
        await this.sendEmailNotification(user, type, payload);
      }

      // Send SMS notification if enabled (placeholder for future SMS service)
      if (sendSms) {
        await this.sendSmsNotification(user, type, payload);
      }

      return notification;
    } catch (error) {
      console.error("Failed to create notification:", error);
      throw error;
    }
  }

  /**
   * Notify all active contractors that new work exists.
   * Matching, claimable entitlements receive full details; everyone else receives
   * a teaser alert so available work stays visible without unlocking claim access.
   */
  static async notifyAllContractors(jobDetails: LeadNotificationJobDetails): Promise<void> {
    const logTag = `[NOTIFY][${jobDetails.leadId}]`;

    if (jobDetails.isSeeded) {
      console.log(`${logTag} Skipping — seeded/demo lead`);
      return;
    }

    try {
      const contractors = await prisma.user.findMany({
        where: {
          role: 'contractor',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          notifyJobEmail: true,
          notifyJobInApp: true,
          isActive: true,
          contractorProfile: { select: { companyName: true } },
          subscriptions: {
            select: {
              category: true,
              status: true,
              canClaimLeads: true,
              currentPeriodEnd: true,
            },
          },
        },
      });

      const recipients = contractors
        .map((contractor) => ({
          contractor,
          accessLevel: getLeadNotificationAccess(contractor, jobDetails.category),
        }))
        .filter((recipient) => recipient.accessLevel !== 'skip');

      const fullRecipients = recipients.filter((recipient) => recipient.accessLevel === 'full');
      const teaserRecipients = recipients.filter((recipient) => recipient.accessLevel === 'teaser');

      console.log(
        `${logTag} New job "${jobDetails.title}" | category=${jobDetails.category || 'none'} | ` +
        `city=${jobDetails.city || 'none'} | province=${jobDetails.province || 'none'} | ` +
        `Full access: ${fullRecipients.length} | Teaser: ${teaserRecipients.length} | Total recipients: ${recipients.length}`,
      );

      if (recipients.length === 0) {
        console.warn(`${logTag} No recipients found — no notifications sent`);
        return;
      }

      const fullPayload = buildLeadNotificationPayload(jobDetails, 'full');
      const teaserPayload = buildLeadNotificationPayload(jobDetails, 'teaser');

      const existingNotifications = await prisma.notification.findMany({
        where: {
          userId: { in: recipients.map((recipient) => recipient.contractor.id) },
          type: 'LEAD_MATCHED',
          createdAt: { gte: new Date(Date.now() - LEAD_NOTIFICATION_DEDUPE_WINDOW_MS) },
          payload: { path: ['leadId'], equals: jobDetails.leadId },
        },
        select: { userId: true },
      });
      const alreadyNotified = new Set(existingNotifications.map((notification) => notification.userId));

      const inAppRecipients = recipients.filter(
        (recipient) => recipient.contractor.notifyJobInApp !== false && !alreadyNotified.has(recipient.contractor.id)
      );

      if (inAppRecipients.length > 0) {
        await prisma.notification.createMany({
          data: inAppRecipients.map((recipient) => {
            const payload = recipient.accessLevel === 'full' ? fullPayload : teaserPayload;
            return {
            userId: recipient.contractor.id,
            type: 'LEAD_MATCHED',
            title: payload.title,
            message: payload.description,
            relatedId: jobDetails.leadId,
            relatedType: 'job',
            payload: payload as any,
            read: false,
          };}),
        });
      }

      let successCount = 0;
      let failCount = 0;

      const emailRecipientMap = new Map<string, typeof recipients[number]>();
      // Contractors selected for a full/teaser email but whose address is undeliverable
      // (seed/test @example.com accounts, the ${clerkId}@clerk.user fallback, malformed
      // addresses). Resend's batch endpoint is all-or-nothing: one bad address makes it
      // reject the ENTIRE batch (422), so every real contractor gets nothing. We drop them
      // here so they can never poison the batch, and log them as skipped for auditability.
      const undeliverableRecipients: typeof recipients = [];
      for (const recipient of recipients) {
        const email = recipient.contractor.email?.toLowerCase();
        if (!email || recipient.contractor.notifyJobEmail === false) continue;
        if (!isSendableEmail(email)) {
          undeliverableRecipients.push(recipient);
          continue;
        }

        const existing = emailRecipientMap.get(email);
        if (!existing || (existing.accessLevel === 'teaser' && recipient.accessLevel === 'full')) {
          emailRecipientMap.set(email, recipient);
        }
      }

      if (undeliverableRecipients.length > 0) {
        console.warn(
          `${logTag} Skipping ${undeliverableRecipients.length} undeliverable email address(es) — excluded from batch to protect deliverable recipients`,
        );
      }

      const emailRecipients = Array.from(emailRecipientMap.values());

      // Build every contractor job email up front, then dispatch them through Resend's
      // batch endpoint (one request per 100 recipients). Previously each email was sent
      // as its own request via Promise.all, which exceeded Resend's rate limit; the SDK
      // returns a 429 as { error } instead of throwing, so those failures were silently
      // swallowed and contractors received nothing.
      const bulkMessages = emailRecipients.map((recipient) => {
        const category = jobDetails.category || 'Home Improvement';
        if (recipient.accessLevel === 'full') {
          const content = buildNewJobEmailContent(
            {
              id: jobDetails.leadId,
              title: jobDetails.title,
              category,
              description: jobDetails.description,
              budget: jobDetails.budget != null ? String(jobDetails.budget) : null,
              city: jobDetails.city ?? null,
              province: jobDetails.province ?? null,
              createdAt: jobDetails.createdAt ?? null,
            },
            true,
          );
          return { to: recipient.contractor.email, subject: content.subject, html: content.html };
        }
        const teaser = buildTeaserJobEmailContent(category);
        return { to: recipient.contractor.email, subject: teaser.subject, html: teaser.html };
      });

      if (bulkMessages.length > 0) {
        const { sent, failed, failedTo, errorByRecipient } = await sendBulkEmails(bulkMessages, { jobId: jobDetails.leadId });
        successCount = sent;
        failCount = failed;

        // Restore EmailEvent logging (previously broken) so contractor deliveries are auditable.
        try {
          await prisma.emailEvent.createMany({
            data: emailRecipients.map((recipient) => {
              const didFail = failedTo.has(recipient.contractor.email);
              return {
                type: 'new_job',
                to: recipient.contractor.email,
                userId: recipient.contractor.id,
                relatedJobId: jobDetails.leadId,
                status: didFail ? 'failed' : 'sent',
                // Sanitized, PII-free JSON error for failed sends; null on success.
                error: didFail ? (errorByRecipient.get(recipient.contractor.email) ?? null) : null,
              };
            }),
          });
        } catch (logErr) {
          console.error(`${logTag} Failed to log email events: ${logErr instanceof Error ? logErr.message : String(logErr)}`);
        }
      }

      // Audit the addresses we deliberately excluded as undeliverable so every selected
      // contractor is accounted for in EmailEvent (sent / failed / skipped).
      if (undeliverableRecipients.length > 0) {
        try {
          await prisma.emailEvent.createMany({
            data: undeliverableRecipients.map((recipient) => ({
              type: 'new_job',
              to: recipient.contractor.email,
              userId: recipient.contractor.id,
              relatedJobId: jobDetails.leadId,
              status: 'skipped',
              error: JSON.stringify({ reason: 'undeliverable_email' }),
            })),
          });
        } catch (logErr) {
          console.error(`${logTag} Failed to log skipped email events: ${logErr instanceof Error ? logErr.message : String(logErr)}`);
        }
      }

      console.log(
        `${logTag} Complete | In-app: ${inAppRecipients.length} | Emails sent: ${successCount} | Failed: ${failCount} | Skipped(undeliverable): ${undeliverableRecipients.length} | Total recipients: ${recipients.length}`,
      );
    } catch (error) {
      console.error(`${logTag} Critical error in notifyAllContractors:`, error);
      throw error;
    }
  }

  /**
   * Send email notification — checks user preference flags before sending
   */
  private static async sendEmailNotification(
    user: any,
    type: NotificationType,
    payload: NotificationPayload
  ) {
    try {
      // Load notification preferences for this user
      const prefs = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          notifyJobEmail: true,
          notifyMessageEmail: true,
          notifyMarketingEmail: true,
        },
      });

      if (type === 'NEW_MESSAGE') {
        // Check message email preference
        if (prefs && prefs.notifyMessageEmail === false) {
          console.log(`[EMAIL] Skipping message email for ${user.email} — preference disabled`);
          return;
        }
        const threadId = payload.threadId || payload.conversationId || payload.messageId || '';
        await sendNewMessageEmail(
          {
            id: user.id,
            email: user.email,
            name: user.contractorProfile?.companyName || user.homeownerProfile?.name || user.name || null
          },
          { name: payload.senderName || 'A user' },
          payload.message || 'You have a new message',
          threadId
        );
        console.log(`EMAIL SENT TO: ${user.email} | type=NEW_MESSAGE | thread=${threadId}`);
        return;
      }

      if (type === 'LEAD_MATCHED') {
        // Check job email preference
        if (prefs && prefs.notifyJobEmail === false) {
          console.log(`[EMAIL] Skipping job email for ${user.email} — preference disabled`);
          return;
        }

        if (payload.fullAccess === false) {
          await sendEmailViaResend({
            to: user.email,
            subject: `${payload.category || 'New'} job posted on QuoteXbert`,
            html: buildEmail('New Job Posted on QuoteXbert', [
              { type: 'tag', content: 'New Job Alert' },
              { type: 'heading', content: `A new ${payload.category || 'home improvement'} job is live` },
              { type: 'text', content: 'New homeowner work is available on QuoteXbert. Upgrade this category to unlock full details, submit quotes, and claim the lead.' },
              {
                type: 'card',
                label: 'What you can see now',
                rawHtml: true,
                content: `<strong>Category:</strong> ${payload.category || 'Home Improvement'}<br><strong>Access:</strong> Locked until you subscribe to this category`,
              },
              { type: 'cta', content: 'View Plans & Unlock Jobs', href: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com'}/contractor/subscriptions` },
            ]),
          });
          console.log(`EMAIL SENT TO: ${user.email} | type=LEAD_MATCHED | mode=teaser | lead=${payload.leadId}`);
          return;
        }

        await sendNewJobEmail(
          { id: user.id, email: user.email, name: user.contractorProfile?.companyName || user.name || null },
          {
            id: payload.leadId || '',
            title: payload.title || 'New Job',
            category: payload.category || 'Home Improvement',
            description: typeof payload.description === 'string' ? payload.description : 'A new job matching your services is available.',
            budget: payload.budget !== undefined && payload.budget !== null ? String(payload.budget) : null,
            city: typeof payload.city === 'string' && payload.city !== 'Not specified' ? payload.city : null,
            province: typeof payload.province === 'string' && payload.province !== '' ? payload.province : null,
            createdAt: typeof payload.createdAt === 'string' ? payload.createdAt : null,
          }
        );
        console.log(`EMAIL SENT TO: ${user.email} | type=LEAD_MATCHED | lead=${payload.leadId}`);
        return;
      }

      if (type === 'WELCOME') {
        await sendWelcomeEmail({ id: user.id, email: user.email, name: user.name });
        console.log(`EMAIL SENT TO: ${user.email} | type=WELCOME`);
        return;
      }

      if (type === 'REVIEW_RECEIVED') {
        await sendReviewReceivedEmail(
          { id: user.id, email: user.email, companyName: user.contractorProfile?.companyName || user.name || null },
          {
            id: payload.reviewId || '',
            rating: payload.rating || 5,
            comment: payload.comment || '',
            reviewerName: payload.reviewerName || 'A client',
          },
        );
        console.log(`[EMAIL] Review email sent to ${user.email}`);
        return;
      }

      // Fallback for remaining types using branded template
      const emailData = this.getEmailTemplate(type, payload, user);
      if (emailData) {
        await sendEmailViaResend({ to: user.email, subject: emailData.subject, html: emailData.html });
        console.log(`[EMAIL] Fallback email sent to ${user.email} for type ${type}`);
      }
    } catch (error) {
      console.error(`[EMAIL] Failed to send ${type} email to ${user.email}:`, error);
    }
  }

  /**
   * Send SMS notification (placeholder for future implementation)
   */
  private static async sendSmsNotification(
    user: any,
    type: NotificationType,
    payload: NotificationPayload
  ) {
    // TODO: Implement SMS service (Twilio, AWS SNS, etc.)
    console.log(`SMS notification would be sent to ${user.email} for ${type}`);
  }

  /**
   * Get enhanced branded email template
   */
  private static getBrandedEmailTemplate(subject: string, content: string) {
    return buildEmail(subject, [{ type: 'card', content, rawHtml: true }]);
  }

  /**
   * Get email templates for different notification types
   */
  private static getEmailTemplate(
    type: NotificationType,
    payload: NotificationPayload,
    user: any
  ) {
    const userName = user.contractorProfile?.companyName || 
                    user.homeownerProfile?.name || 'User';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com';

    let content = '';
    let subject = '';

    switch (type) {
      case "JOB_CLAIMED":
        subject = "🎉 Your Job Has Been Claimed!";
        content = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #22c55e, #16a34a); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🎉</span>
            </div>
            <h2 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Great News!</h2>
          </div>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            A qualified contractor has claimed your job: <strong style="color: #800020;">${payload.title}</strong>
          </p>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #800020;">
            <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.5;">
              <strong>What's Next:</strong><br>
              • You can now start communicating directly with your contractor<br>
              • Review their profile and previous work<br>
              • Finalize project details and timeline
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${baseUrl}${payload.actionUrl}" style="background: linear-gradient(135deg, #800020, #a0002a); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(128, 0, 32, 0.2);">
              View Job Details →
            </a>
          </div>
        `;
        break;

      case "NEW_MESSAGE":
        subject = "💬 New Message from QuoteXbert";
        content = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">💬</span>
            </div>
            <h2 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">New Message</h2>
          </div>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            You have a new message regarding: <strong style="color: #800020;">${payload.title}</strong>
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #3b82f6;">
            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.5; font-style: italic;">
              "${payload.message}"
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${baseUrl}/messages" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.2);">
              Reply Now →
            </a>
          </div>
        `;
        break;

      case "SUBSCRIPTION_PAYMENT_RECEIPT":
        subject = "QuoteXbert subscription payment confirmed";
        content = `
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Your QuoteXbert contractor subscription payment was confirmed through Stripe.
          </p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;margin:0 0 20px;">
            <strong>Plan:</strong> ${payload.planName || 'Contractor Plan'}<br>
            <strong>Amount Charged:</strong> $${payload.amount || '0.00'} CAD<br>
            <strong>Billing Date:</strong> ${payload.billingDate ? new Date(payload.billingDate).toLocaleDateString('en-CA') : new Date().toLocaleDateString('en-CA')}<br>
            <strong>Renewal Date:</strong> ${payload.renewalDate ? new Date(payload.renewalDate).toLocaleDateString('en-CA') : 'Available in billing settings'}
          </div>
          <div style="text-align:center;margin:35px 0;">
            <a href="${baseUrl}/contractor/subscriptions" style="background:#800020;color:white;padding:16px 32px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600;font-size:16px;">Manage Subscription</a>
          </div>
        `;
        break;

      case "PAYMENT_FAILED":
        subject = "❌ Payment Failed - Action Required";
        content = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">❌</span>
            </div>
            <h2 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Payment Failed</h2>
          </div>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <div style="background: #fef2f2; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0 0 15px 0; color: #dc2626; font-size: 16px; font-weight: 600;">
              We couldn't process your payment of $${payload.amount}
            </p>
            <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
              Please update your payment method and try again to claim this lead.
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${baseUrl}/billing" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.2);">
              Update Payment Method →
            </a>
          </div>
        `;
        break;

      case "LEAD_MATCHED":
        subject = "🔧 New Lead Match Available!";
        content = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #800020, #2d5a5a); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🔧</span>
            </div>
            <h2 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">New Lead Match!</h2>
          </div>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            We found a perfect match for your services: <strong style="color: #800020;">${payload.title}</strong>
          </p>
          
          <div style="background: #fef7ed; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.5;">
              <strong>⏰ Act Fast!</strong><br>
              This lead matches your expertise and location. Claim it now before other contractors!
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${baseUrl}${payload.actionUrl}" style="background: linear-gradient(135deg, #800020, #2d5a5a); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(128, 0, 32, 0.2);">
              Claim Lead Now →
            </a>
          </div>
        `;
        break;

      case "WELCOME":
        subject = "🎉 Welcome to QuoteXbert!";
        content = `
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="background: linear-gradient(135deg, #800020, #2d5a5a); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🎉</span>
            </div>
            <h2 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Welcome to QuoteXbert!</h2>
          </div>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
            Welcome to Canada's premier home improvement platform! We're excited to have you on board and help you connect with the perfect contractors for your projects.
          </p>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #800020;">
            <h3 style="color: #800020; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Getting Started:</h3>
            <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Complete your profile to get better matches</li>
              <li style="margin-bottom: 8px;">Browse available leads in your area</li>
              <li style="margin-bottom: 8px;">Start connecting with trusted contractors</li>
              <li>Get AI-powered project estimates instantly</li>
            </ul>
          </div>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
            <p style="margin: 0; color: #1e40af; font-size: 15px; font-weight: 600;">
              💡 Pro Tip: Complete profiles get 3x more quality matches!
            </p>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${baseUrl}/profile" style="background: linear-gradient(135deg, #800020, #2d5a5a); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(128, 0, 32, 0.2);">
              Complete Your Profile →
            </a>
          </div>
        `;
        break;

      default:
        return null;
    }

    return {
      subject,
      html: this.getBrandedEmailTemplate(subject, content)
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  /**
   * Get notifications for a user
   */
  static async getForUser(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false }
    });
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanup(olderThanDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        read: true
      }
    });
  }
}

// Convenience functions for common notification types
export const notifications = {
  jobClaimed: (userId: string, payload: { leadId: string; title: string; contractorName: string }) =>
    NotificationService.create({
      userId,
      type: "JOB_CLAIMED",
      payload: { ...payload, actionUrl: `/messages` }
    }),

  newMessage: (userId: string, payload: { messageId: string; title: string; message: string; senderName: string; threadId?: string }) =>
    NotificationService.create({
      userId,
      type: "NEW_MESSAGE",
      payload,
      sendEmail: true  // Ensure email is always sent for messages
    }),

  subscriptionPaymentReceipt: (userId: string, payload: { amount: number; planName?: string; billingDate?: string; renewalDate?: string }) =>
    NotificationService.create({
      userId,
      type: "SUBSCRIPTION_PAYMENT_RECEIPT",
      payload
    }),

  paymentFailed: (userId: string, payload: { amount: number; reason?: string }) =>
    NotificationService.create({
      userId,
      type: "PAYMENT_FAILED",
      payload
    }),

  leadMatched: (userId: string, payload: { leadId: string; title: string; location: string }) =>
    NotificationService.create({
      userId,
      type: "LEAD_MATCHED",
      payload: { ...payload, actionUrl: `/contractor/jobs` }
    }),

  welcome: (userId: string, payload: { firstName?: string }) =>
    NotificationService.create({
      userId,
      type: "WELCOME",
      payload
    })
};
