// Email notification system for QuoteXbert
// Note: In production, you would install and use nodemailer or similar email service

// Email templates and notification types
export type NotificationType = 
  | 'welcome'
  | 'job_posted'
  | 'quote_received'
  | 'quote_accepted'
  | 'payment_received'
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

// Mock email transporter for demo purposes
const createTransporter = () => {
  return {
    sendMail: async (options: any) => {
      console.log('📧 [DEMO] Email would be sent:', options);
      return Promise.resolve({ messageId: 'demo-' + Date.now() });
    }
  };
};

// Email templates
export const getEmailTemplate = (type: NotificationType, data: Record<string, any>): EmailTemplate => {
  const baseStyle = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
      .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
      .content { padding: 20px; }
      .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 14px; color: #666; }
      .highlight { background: #fef3c7; padding: 10px; border-left: 4px solid #f59e0b; margin: 10px 0; }
    </style>
  `;

  switch (type) {
    case 'welcome':
      return {
        subject: 'Welcome to QuoteXbert!',
        html: `
          ${baseStyle}
          <div class="header">
            <h1>Welcome to QuoteXbert!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name}!</h2>
            <p>Thank you for joining QuoteXbert, the leading platform for connecting homeowners with trusted contractors.</p>
            
            ${data.role === 'homeowner' ? `
              <div class="highlight">
                <h3>🏠 As a Homeowner, you can:</h3>
                <ul>
                  <li>Post your home improvement projects</li>
                  <li>Get quotes from verified contractors</li>
                  <li>Message contractors directly</li>
                  <li>Pay securely through our platform</li>
                </ul>
              </div>
              <a href="${process.env.NEXT_PUBLIC_URL}/create-lead" class="button">Post Your First Project</a>
            ` : `
              <div class="highlight">
                <h3>🔨 As a Contractor, you can:</h3>
                <ul>
                  <li>Browse available jobs in your area</li>
                  <li>Submit competitive quotes</li>
                  <li>Build your portfolio</li>
                  <li>Get paid through our secure system</li>
                </ul>
              </div>
              <a href="${process.env.NEXT_PUBLIC_URL}/contractor/jobs" class="button">Browse Available Jobs</a>
            `}
            
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
            <p><a href="${process.env.NEXT_PUBLIC_URL}">Visit QuoteXbert</a> | <a href="#">Unsubscribe</a></p>
          </div>
        `,
        text: `Welcome to QuoteXbert! Thank you for joining our platform. Visit ${process.env.NEXT_PUBLIC_URL} to get started.`
      };

    case 'job_posted':
      return {
        subject: `New Job Posted: ${data.jobTitle}`,
        html: `
          ${baseStyle}
          <div class="header">
            <h1>New Job Available!</h1>
          </div>
          <div class="content">
            <h2>📋 ${data.jobTitle}</h2>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Budget:</strong> $${data.budget}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            
            <div class="highlight">
              <h3>Job Description:</h3>
              <p>${data.description}</p>
            </div>
            
            <p>This job matches your profile and service area. Submit a quote to get started!</p>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/contractor/jobs/${data.jobId}" class="button">View Job & Submit Quote</a>
            
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
            <p><a href="#">Manage Email Preferences</a> | <a href="#">Unsubscribe</a></p>
          </div>
        `,
        text: `New job available: ${data.jobTitle} in ${data.location}. Budget: $${data.budget}. Visit ${process.env.NEXT_PUBLIC_URL}/contractor/jobs/${data.jobId} to view and quote.`
      };

    case 'quote_received':
      return {
        subject: `New Quote Received for ${data.jobTitle}`,
        html: `
          ${baseStyle}
          <div class="header">
            <h1>You've Received a New Quote!</h1>
          </div>
          <div class="content">
            <h2>💰 Quote for: ${data.jobTitle}</h2>
            <p><strong>Contractor:</strong> ${data.contractorName}</p>
            <p><strong>Quote Amount:</strong> $${data.quoteAmount}</p>
            <p><strong>Estimated Timeline:</strong> ${data.timeline}</p>
            
            <div class="highlight">
              <h3>Quote Details:</h3>
              <p>${data.quoteDetails}</p>
            </div>
            
            <p>Review the quote and contractor profile to make your decision.</p>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/homeowner/quotes/${data.quoteId}" class="button">Review Quote</a>
            
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
          </div>
        `,
        text: `New quote received for ${data.jobTitle} from ${data.contractorName}. Amount: $${data.quoteAmount}. View at ${process.env.NEXT_PUBLIC_URL}/homeowner/quotes/${data.quoteId}`
      };

    case 'quote_accepted':
      return {
        subject: `Your Quote Was Accepted! 🎉`,
        html: `
          ${baseStyle}
          <div class="header">
            <h1>Congratulations! Your Quote Was Accepted!</h1>
          </div>
          <div class="content">
            <h2>🎉 Job: ${data.jobTitle}</h2>
            <p><strong>Homeowner:</strong> ${data.homeownerName}</p>
            <p><strong>Quote Amount:</strong> $${data.quoteAmount}</p>
            <p><strong>Project Start:</strong> ${data.startDate}</p>
            
            <div class="highlight">
              <h3>Next Steps:</h3>
              <ul>
                <li>Contact the homeowner to confirm details</li>
                <li>Begin work as scheduled</li>
                <li>Submit progress updates</li>
                <li>Request milestone payments</li>
              </ul>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/conversations/${data.conversationId}" class="button">Message Homeowner</a>
            
            <p>Good luck with your project!</p>
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
          </div>
        `,
        text: `Congratulations! Your quote for ${data.jobTitle} was accepted by ${data.homeownerName}. Amount: $${data.quoteAmount}. Contact them at ${process.env.NEXT_PUBLIC_URL}/conversations/${data.conversationId}`
      };

    case 'message_received':
      return {
        subject: `New Message from ${data.senderName}`,
        html: `
          ${baseStyle}
          <div class="header">
            <h1>New Message</h1>
          </div>
          <div class="content">
            <h2>💬 Message from ${data.senderName}</h2>
            <p><strong>Project:</strong> ${data.jobTitle}</p>
            
            <div class="highlight">
              <p>"${data.messagePreview}"</p>
            </div>
            
            <p>Reply to continue the conversation.</p>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/conversations/${data.conversationId}" class="button">View & Reply</a>
            
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
            <p><a href="#">Manage Email Preferences</a></p>
          </div>
        `,
        text: `New message from ${data.senderName} about ${data.jobTitle}: "${data.messagePreview}". Reply at ${process.env.NEXT_PUBLIC_URL}/conversations/${data.conversationId}`
      };

    case 'payment_received':
      return {
        subject: `Payment Received - $${data.amount}`,
        html: `
          ${baseStyle}
          <div class="header">
            <h1>Payment Received! 💰</h1>
          </div>
          <div class="content">
            <h2>$${data.amount} Payment Confirmed</h2>
            <p><strong>Job:</strong> ${data.jobTitle}</p>
            <p><strong>Payment Type:</strong> ${data.paymentType}</p>
            <p><strong>Date:</strong> ${data.paymentDate}</p>
            
            <div class="highlight">
              <p>This payment has been securely processed and will be available in your account within 1-2 business days.</p>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_URL}/contractor/payments" class="button">View Payment Details</a>
            
            <p>Thank you for using QuoteXbert!</p>
            <p>Best regards,<br>The QuoteXbert Team</p>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
          </div>
        `,
        text: `Payment received: $${data.amount} for ${data.jobTitle}. Payment type: ${data.paymentType}. View details at ${process.env.NEXT_PUBLIC_URL}/contractor/payments`
      };

    default:
      return {
        subject: 'QuoteXbert Notification',
        html: `
          ${baseStyle}
          <div class="header">
            <h1>QuoteXbert Notification</h1>
          </div>
          <div class="content">
            <p>You have a new notification from QuoteXbert.</p>
            <a href="${process.env.NEXT_PUBLIC_URL}" class="button">Visit QuoteXbert</a>
          </div>
          <div class="footer">
            <p>© 2024 QuoteXbert. All rights reserved.</p>
          </div>
        `,
        text: 'You have a new notification from QuoteXbert.'
      };
  }
};

// Main function to send emails
export const sendNotificationEmail = async ({ to, type, data }: EmailParams): Promise<boolean> => {
  try {
    // Skip sending emails in development/demo mode
    if (process.env.NODE_ENV !== 'production' || !process.env.EMAIL_USER) {
      console.log('📧 Email notification (demo mode):', { to, type, data });
      return true;
    }

    const transporter = createTransporter();
    const template = getEmailTemplate(type, data);

    const mailOptions = {
      from: `"QuoteXbert" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
      text: template.text,
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Email sent successfully:', { to, type });
    return true;
  } catch (error) {
    console.error('❌ Email send error:', error);
    return false;
  }
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