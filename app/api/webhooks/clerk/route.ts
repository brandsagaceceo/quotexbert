import { headers } from 'next/headers';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { buildEmail, sendSharedEmail } from '@/lib/email';

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
    const email = email_addresses[0]?.email_address || '';
    // Generate a proper name with fallback to email
    let name = `${first_name || ''} ${last_name || ''}`.trim();
    if (!name && email) {
      // Use email prefix as name (e.g., 'john.doe@gmail.com' -> 'john doe')
      const parts = email.split('@');
      const emailPrefix = parts[0] || '';
      name = emailPrefix.replace(/[._-]/g, ' ').trim() || 'User';
    }
    if (!name) {
      name = 'User';
    }

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
    if (email) {
      try {
        await sendSharedEmail({
          to: 'quotexbert@gmail.com',
          subject: '🎉 New User Signup - QuoteXbert',
          html: buildEmail('New User Signup', [
            { type: 'tag', content: 'Admin Notification' },
            { type: 'heading', content: 'New User Signed Up' },
            { type: 'card', label: 'User Details', rawHtml: true, content: `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Clerk ID:</strong> ${id}<br><strong>Signed up:</strong> ${new Date(created_at).toLocaleString()}` },
            { type: 'text', content: 'User will be prompted to select their role during onboarding.' },
          ]),
        });
        console.log('[CLERK WEBHOOK] Notification email sent to quotexbert@gmail.com');
      } catch (emailError) {
        console.error('[CLERK WEBHOOK] Failed to send email:', emailError);
      }
    } else {
      console.warn('[CLERK WEBHOOK] No email found for signup notification');
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
            name: name, // Always has valid name from above logic
            role: 'homeowner', // Default role, can be updated during onboarding
          }
        });
        console.log(`[CLERK WEBHOOK] User record created in database with name: ${name}`);
      } else {
        // Update existing user's name if it's missing or generic
        if (!existingUser.name || existingUser.name === 'New User' || existingUser.name === 'User') {
          await prisma.user.update({
            where: { clerkUserId: id },
            data: { name: name }
          });
          console.log(`[CLERK WEBHOOK] Updated existing user name to: ${name}`);
        }
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
      const updateData: Record<string, string> = {};
      if (email) updateData.email = email;
      if (name) updateData.name = name;

      if (Object.keys(updateData).length > 0 && id) {
        await prisma.user.updateMany({
          where: { clerkUserId: id },
          data: updateData
        });
        console.log('[CLERK WEBHOOK] User record updated in database');
      }
    } catch (dbError) {
      console.error('[CLERK WEBHOOK] Failed to update user in database:', dbError);
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    console.log(`[CLERK WEBHOOK] User deleted: ${id}`);

    // Optionally soft-delete or archive user data
    if (id) {
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
  }

  return new NextResponse('Webhook processed', { status: 200 });
}
