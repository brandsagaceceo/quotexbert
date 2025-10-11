import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationEmail, sendBulkNotifications, NotificationType } from '@/lib/email-notifications';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, recipients, data } = body;

    // Validate input
    if (!type || !recipients) {
      return NextResponse.json(
        { error: 'Missing required fields: type and recipients' },
        { status: 400 }
      );
    }

    // Single recipient
    if (typeof recipients === 'string') {
      const success = await sendNotificationEmail({
        to: recipients,
        type: type as NotificationType,
        data: data || {}
      });

      return NextResponse.json({ 
        success, 
        message: success ? 'Email sent successfully' : 'Failed to send email'
      });
    }

    // Multiple recipients
    if (Array.isArray(recipients)) {
      const successCount = await sendBulkNotifications(
        recipients.map(recipient => ({
          email: recipient.email || recipient,
          data: { ...data, ...recipient.data }
        })),
        type as NotificationType
      );

      return NextResponse.json({
        success: successCount > 0,
        successCount,
        totalCount: recipients.length,
        message: `${successCount}/${recipients.length} emails sent successfully`
      });
    }

    return NextResponse.json(
      { error: 'Invalid recipients format' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Email notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to test email templates
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const type = url.searchParams.get('type') as NotificationType;
  const preview = url.searchParams.get('preview') === 'true';

  if (!type) {
    return NextResponse.json(
      { error: 'Missing type parameter' },
      { status: 400 }
    );
  }

  try {
    // Sample data for preview
    const sampleData = {
      name: 'John Doe',
      role: 'homeowner',
      jobTitle: 'Kitchen Renovation',
      location: 'Toronto, ON',
      budget: '15000',
      category: 'Kitchen',
      description: 'Complete kitchen renovation including cabinets, countertops, and appliances.',
      contractorName: 'Elite Kitchen Design',
      quoteAmount: '14500',
      timeline: '3-4 weeks',
      quoteDetails: 'Full kitchen renovation with premium materials and professional installation.',
      homeownerName: 'Sarah Johnson',
      startDate: 'March 15, 2024',
      conversationId: 'conv-123',
      senderName: 'Mike Wilson',
      messagePreview: 'I have a question about the timeline for the project...',
      amount: '7250',
      paymentType: 'Milestone Payment',
      paymentDate: 'March 10, 2024',
      jobId: 'job-123',
      quoteId: 'quote-456'
    };

    if (preview) {
      // Return HTML preview - Import dynamically to avoid issues
      const emailLib = await import('@/lib/email-notifications');
      const template = emailLib.getEmailTemplate ? 
        emailLib.getEmailTemplate(type, sampleData) : 
        { html: '<p>Email template not available</p>' };
      
      return new NextResponse(template.html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Send test email
    const success = await sendNotificationEmail({
      to: 'test@example.com',
      type,
      data: sampleData
    });

    return NextResponse.json({
      success,
      message: success ? 'Test email sent' : 'Failed to send test email',
      sampleData
    });

  } catch (error) {
    console.error('Email preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate email preview' },
      { status: 500 }
    );
  }
}