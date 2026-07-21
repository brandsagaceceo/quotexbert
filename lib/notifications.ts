import { prisma } from "@/lib/prisma";
import { buildEmail, sendNewMessageEmail, sendNewJobEmail, sendWelcomeEmail, sendReviewReceivedEmail, sendSharedEmail } from "@/lib/email";

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
   * Notify ALL active contractors about a new public job post.
   * Every registered active contractor receives the alert regardless of their
   * subscription category, tier, or city — maximum awareness at this stage of growth.
   * Explicit opt-outs (notifyJobEmail: false) are respected.
   * Duplicate notifications within 24 h for the same lead are suppressed inside create().
   */
  static async notifyAllContractors(jobDetails: {
    leadId: string;
    title: string;
    description: string;
    budget: string;
    city?: string;
    category?: string;
    /** ISO timestamp — used for urgency labelling in email */
    createdAt?: string;
    /** true = demo/seed lead — must never generate visible in-app or email alerts */
    isSeeded?: boolean;
  }): Promise<void> {
    const logTag = `[NOTIFY][${jobDetails.leadId}]`;

    if (jobDetails.isSeeded) {
      console.log(`${logTag} Skipping — seeded/demo lead`);
      return;
    }

    try {
      // Fetch ALL active contractors who haven't explicitly opted out of job-alert emails.
      // No category or subscription filter — every contractor should see every new job.
      const allContractors = await prisma.user.findMany({
        where: {
          role: 'contractor',
          isActive: true,
          notifyJobEmail: true,   // respect explicit opt-out only
        },
        select: {
          id: true,
          email: true,
          name: true,
          contractorProfile: { select: { companyName: true } },
        },
      });

      // Deduplicate by lowercase email — prevents double delivery if the same address
      // appears on multiple contractor rows.
      const seen = new Set<string>();
      const uniqueContractors = allContractors.filter(c => {
        if (!c.email) return false;
        const lower = c.email.toLowerCase();
        if (seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      console.log(
        `${logTag} New job "${jobDetails.title}" | category=${jobDetails.category || 'none'} | ` +
        `city=${jobDetails.city || 'none'} | Active contractors: ${allContractors.length} | ` +
        `After dedup: ${uniqueContractors.length}`,
      );

      if (uniqueContractors.length === 0) {
        console.warn(`${logTag} No eligible contractors found — no emails sent`);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      const notificationPromises = uniqueContractors.map(contractor =>
        this.create({
          userId: contractor.id,
          type: 'LEAD_MATCHED',
          payload: {
            leadId: jobDetails.leadId,
            title: jobDetails.title,
            description: jobDetails.description.substring(0, 200) + (jobDetails.description.length > 200 ? '...' : ''),
            budget: jobDetails.budget,
            city: jobDetails.city || 'Not specified',
            category: jobDetails.category || 'Home Improvement',
            createdAt: jobDetails.createdAt || new Date().toISOString(),
          },
          sendEmail: true,
          sendSms: false,
        })
          .then(() => { successCount++; })
          .catch(err => {
            failCount++;
            // Log the failure without exposing personal contractor data in shared logs
            console.error(`${logTag} Failed to notify contractor ${contractor.id}: ${err instanceof Error ? err.message : String(err)}`);
            return null;
          })
      );

      await Promise.all(notificationPromises);
      console.log(
        `${logTag} Complete | Sent: ${successCount} | Failed: ${failCount} | Total attempted: ${uniqueContractors.length}`,
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
        await sendNewJobEmail(
          { id: user.id, email: user.email, name: user.contractorProfile?.companyName || user.name || null },
          {
            id: payload.leadId || '',
            title: payload.title || 'New Job',
            category: payload.category || 'Home Improvement',
            description: typeof payload.description === 'string' ? payload.description : 'A new job matching your services is available.',
            budget: typeof payload.budget === 'string' ? payload.budget : null,
            city: typeof payload.city === 'string' && payload.city !== 'Not specified' ? payload.city : null,
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
