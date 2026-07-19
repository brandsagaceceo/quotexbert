// Email notification system for QuoteXbert
// Uses Resend (configured via RESEND_API_KEY env var) for actual delivery.
// sendNotificationEmail() below routes job/message types to lib/email.ts → Resend.
// Other notification types log and return true until implemented.
import { buildEmail, type EmailBlock } from '@/lib/email';

// Email templates and notification types
export type NotificationType = 
  | 'welcome'
  | 'job_posted'
  | 'quote_received'
  | 'quote_accepted'
  | 'subscription_payment_receipt'
  | 'message_received'
  | 'job_completed'
  | 'review_received'
  | 'subscription_reminder'
  | 'lead_available';

interface EmailParams {
  to: string;
  type: NotificationType;
  data: Record<string, any>;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://www.quotexbert.com';
const SITE_URL = process.env.NEXT_PUBLIC_URL || BASE_URL;

function stripHtml(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '- ')
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, '$2 ($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function template(subject: string, blocks: EmailBlock[]): EmailTemplate {
  const html = buildEmail(subject, blocks);
  return { subject, html, text: stripHtml(html) };
}

// Email templates
export const getEmailTemplate = (type: NotificationType, data: Record<string, any>): EmailTemplate => {
  switch (type) {
    case 'welcome':
      return template('Welcome to QuoteXbert!', [
        { type: 'heading', content: `Hi ${data.name || 'there'}!` },
        { type: 'text', content: 'Thank you for joining QuoteXbert, the platform for planning renovation projects and connecting with trusted contractors.' },
        data.role === 'homeowner'
          ? { type: 'card', label: 'As a homeowner', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li>Post your home improvement projects</li><li>Get quotes from verified contractors</li><li>Message contractors directly</li><li>Track your project in one place</li></ul>' }
          : { type: 'card', label: 'As a contractor', rawHtml: true, content: '<ul style="margin:0;padding-left:18px;"><li>Browse available jobs in your area</li><li>Submit quotes directly</li><li>Build your portfolio</li><li>Manage homeowner conversations</li></ul>' },
        { type: 'cta', content: data.role === 'homeowner' ? 'Post Your First Project' : 'Browse Available Jobs', href: data.role === 'homeowner' ? `${BASE_URL}/create-lead` : `${BASE_URL}/contractor/jobs` },
      ]);

    case 'job_posted':
      const estimatedValue = String(data.budget || 'Estimate available in lead details');
      return template(`New Job Posted: ${data.jobTitle}`, [
        { type: 'tag', content: 'New Lead' },
        { type: 'heading', content: data.jobTitle || 'New Job Available' },
        { type: 'card', label: 'Lead Summary', rawHtml: true, content: `<strong>Service Required:</strong> ${data.category || 'General'}<br><strong>Location:</strong> ${data.location || 'Location shared in lead details'}<br><strong>Estimated Project Value:</strong> ${estimatedValue.startsWith('$') ? estimatedValue : `$${estimatedValue}`}<br><strong>Submitted Date:</strong> ${new Date().toLocaleDateString('en-CA')}` },
        { type: 'card', label: 'Homeowner Description', content: data.description || 'No description provided.' },
        { type: 'cta', content: 'View Lead & Submit a Quote', href: `${BASE_URL}/contractor/jobs?highlight=${encodeURIComponent(data.jobId || '')}` },
        { type: 'text', content: 'You’re receiving this because this project matches your selected service categories and service area on QuoteXbert.' },
      ]);

    case 'quote_received':
      return template(`New Quote Received for ${data.jobTitle}`, [
        { type: 'tag', content: 'Quote Received' },
        { type: 'heading', content: `Quote for ${data.jobTitle || 'your project'}` },
        { type: 'card', label: 'Quote Summary', rawHtml: true, content: `<strong>Contractor:</strong> ${data.contractorName || 'Contractor'}<br><strong>Quote Amount:</strong> $${data.quoteAmount || 'TBD'}<br><strong>Estimated Timeline:</strong> ${data.timeline || 'Shared in quote details'}` },
        { type: 'card', label: 'Quote Details', content: data.quoteDetails || 'Open QuoteXbert to review the full quote.' },
        { type: 'cta', content: 'Review Quote', href: `${BASE_URL}/homeowner/quotes/${data.quoteId || ''}` },
      ]);

    case 'quote_accepted':
      return template('Your Quote Was Accepted!', [
        { type: 'tag', content: 'Quote Accepted' },
        { type: 'heading', content: `Your quote for ${data.jobTitle || 'the project'} was accepted` },
        { type: 'card', label: 'Project Summary', rawHtml: true, content: `<strong>Homeowner:</strong> ${data.homeownerName || 'Homeowner'}<br><strong>Quote Amount:</strong> $${data.quoteAmount || 'TBD'}<br><strong>Project Start:</strong> ${data.startDate || 'To be confirmed'}` },
        { type: 'cta', content: 'Message Homeowner', href: `${SITE_URL}/messages?threadId=${data.conversationId || ''}` },
      ]);

    case 'message_received':
      return template(`New Message from ${data.senderName || 'QuoteXbert'}`, [
        { type: 'tag', content: 'New Message' },
        { type: 'heading', content: `Message from ${data.senderName || 'a QuoteXbert user'}` },
        { type: 'text', rawHtml: true, content: data.jobTitle ? `Project: <strong>${data.jobTitle}</strong>` : 'Reply to continue the conversation.' },
        { type: 'card', label: 'Message Preview', content: data.messagePreview || 'You have a new message.' },
        { type: 'cta', content: 'View & Reply', href: `${SITE_URL}/messages?threadId=${data.conversationId || ''}` },
      ]);

    case 'subscription_payment_receipt':
      return template('QuoteXbert subscription payment confirmed', [
        { type: 'tag', content: 'Subscription Billing' },
        { type: 'heading', content: 'QuoteXbert subscription payment confirmed' },
        { type: 'card', label: 'Receipt', rawHtml: true, content: `<strong>Plan:</strong> ${data.planName || data.plan || 'Contractor Plan'}<br><strong>Amount Charged:</strong> ${data.amountCharged || data.amount || '$0.00 CAD'}<br><strong>Billing Date:</strong> ${data.billingDate || new Date().toLocaleDateString('en-CA')}<br><strong>Renewal Date:</strong> ${data.renewalDate || data.nextBillingDate || 'Available in billing settings'}` },
        { type: 'text', content: 'This receipt is for your QuoteXbert contractor subscription billed through Stripe.' },
        { type: 'cta', content: 'Manage Subscription', href: `${SITE_URL}/contractor/subscriptions` },
      ]);

    default:
      return template('QuoteXbert Notification', [
        { type: 'heading', content: 'You have a new notification from QuoteXbert' },
        { type: 'cta', content: 'Visit QuoteXbert', href: SITE_URL },
      ]);
  }
};

// Main function to send emails using Resend
export const sendNotificationEmail = async ({ to, type, data }: EmailParams): Promise<boolean> => {
  try {
    // Import Resend email functions (avoiding circular dependency by importing inline)
    const { sendNewJobEmail, sendNewMessageEmail, sendLeadEmail } = await import('@/lib/email');
    
    // Route to appropriate email function based on type
    switch (type) {
      case 'job_posted':
        // Use the new sendNewJobEmail function
        const jobResult = await sendNewJobEmail(
          {
            id: data.contractorId || '',
            email: to,
            name: data.contractorName || null
          },
          {
            id: data.jobId || 'unknown',
            title: data.jobTitle || 'New Job',
            description: data.description || '',
            category: data.category || 'General',
            budget: data.budget?.toString() || null
          }
        );
        return jobResult.success;
        
      case 'message_received':
        // Use the new sendNewMessageEmail function
        const messageResult = await sendNewMessageEmail(
          {
            id: data.recipientId || '',
            email: to,
            name: data.recipientName || null
          },
          {
            name: data.senderName || null
          },
          data.messagePreview || 'You have a new message',
          data.conversationId || ''
        );
        return messageResult.success;
        
      case 'lead_available':
        // Use the existing sendLeadEmail function
        await sendLeadEmail({
          projectType: data.projectType || 'General Project',
          postalCode: data.postalCode || 'N/A',
          description: data.description || 'No description',
          estimate: data.estimate || 'TBD',
          source: data.source || 'web',
          affiliateId: data.affiliateId
        });
        return true;
        
      case 'welcome':
      case 'quote_received':
      case 'quote_accepted':
      case 'subscription_payment_receipt':
      case 'job_completed':
      case 'review_received':
      case 'subscription_reminder':
      default:
        // For other types, log and return true (implement as needed)
        console.log('📧 Email notification type not yet implemented with Resend:', { to, type, data });
        return true;
    }
  } catch (error) {
    console.error('❌ Email send error:', error);
    return false;
  }
};

// Wrapper function for API routes
export const sendEmailNotification = async ({
  type,
  toEmail,
  data
}: {
  type: NotificationType;
  toEmail: string;
  data: Record<string, any>;
}): Promise<boolean> => {
  return sendNotificationEmail({ to: toEmail, type, data });
};

// Batch email sending for notifications to multiple users
export const sendBulkNotifications = async (
  recipients: Array<{ email: string; data: Record<string, any> }>,
  type: NotificationType
): Promise<number> => {
  let successCount = 0;
  
  for (const recipient of recipients) {
    const success = await sendNotificationEmail({
      to: recipient.email,
      type,
      data: recipient.data
    });
    
    if (success) successCount++;
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return successCount;
};

// Email preference management
export const getEmailPreferences = (userId: string) => {
  // In a real app, this would fetch from database
  return {
    welcomeEmails: true,
    jobNotifications: true,
    quoteNotifications: true,
    messageNotifications: true,
    paymentNotifications: true,
    marketingEmails: false,
  };
};

export const updateEmailPreferences = (userId: string, preferences: Record<string, boolean>) => {
  // In a real app, this would update the database
  console.log('Updating email preferences for user:', userId, preferences);
  return true;
};

// Email verification
export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<boolean> => {
  const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${verificationToken}`;
  
  return sendNotificationEmail({
    to: email,
    type: 'welcome', // Using welcome template for verification
    data: {
      name: 'New User',
      verificationUrl,
      role: 'user'
    }
  });
};