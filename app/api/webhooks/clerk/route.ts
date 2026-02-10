import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Missing CLERK_WEBHOOK_SECRET');
    return new NextResponse('Webhook secret not configured', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new NextResponse('Webhook verification failed', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;
  console.log(`[CLERK WEBHOOK] Received event: ${eventType}`);

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, created_at } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'New User';

    console.log(`[CLERK WEBHOOK] New user created: ${email}`);

    // Send welcome email to the user
    if (email) {
      try {
        const { sendWelcomeEmail } = await import('@/lib/email');
        await sendWelcomeEmail({ id, email, name });
        console.log(`[CLERK WEBHOOK] Welcome email sent to ${email}`);
      } catch (welcomeError) {
        console.error('[CLERK WEBHOOK] Failed to send welcome email:', welcomeError);
      }
    }

    // Send email notification to quotexbert@gmail.com
    if (resend && email) {
      try {
        await resend.emails.send({
          from: 'QuoteXbert <no-reply@quotexbert.com>',
          to: 'quotexbert@gmail.com',
          subject: '🎉 New User Signup - QuoteXbert',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">New User Signed Up!</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Name:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Clerk ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${id}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Signed up:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date(created_at).toLocaleString()}</td>
                </tr>
              </table>
              <p style="margin-top: 20px; color: #666; font-size: 14px;">
                User will be prompted to select their role (Homeowner or Contractor) during onboarding.
              </p>
            </div>
          `
        });
        console.log('[CLERK WEBHOOK] Notification email sent to quotexbert@gmail.com');
      } catch (emailError) {
        console.error('[CLERK WEBHOOK] Failed to send email:', emailError);
      }
    } else {
      console.warn('[CLERK WEBHOOK] RESEND_API_KEY not configured or no email found');
    }

    // Optionally create user record in database
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { clerkUserId: id }
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            clerkUserId: id,
            email: email || '',
            name: name,
            role: 'homeowner', // Default role, can be updated during onboarding
          }
        });
        console.log('[CLERK WEBHOOK] User record created in database');
      }
    } catch (dbError) {
      console.error('[CLERK WEBHOOK] Failed to create user in database:', dbError);
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = `${first_name || ''} ${last_name || ''}`.trim();

    console.log(`[CLERK WEBHOOK] User updated: ${email}`);

    // Update user in database if exists
    try {
      await prisma.user.updateMany({
        where: { clerkUserId: id },
        data: {
          email: email || undefined,
          name: name || undefined,
        }
      });
      console.log('[CLERK WEBHOOK] User record updated in database');
    } catch (dbError) {
      console.error('[CLERK WEBHOOK] Failed to update user in database:', dbError);
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    console.log(`[CLERK WEBHOOK] User deleted: ${id}`);

    // Optionally soft-delete or archive user data
    try {
      await prisma.user.updateMany({
        where: { clerkUserId: id },
        data: {
          isActive: false,
        }
      });
      console.log('[CLERK WEBHOOK] User marked as inactive in database');
    } catch (dbError) {
      console.error('[CLERK WEBHOOK] Failed to deactivate user in database:', dbError);
    }
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
