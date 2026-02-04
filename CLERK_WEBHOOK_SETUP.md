# Clerk Webhook Setup Guide

## Overview
This guide will help you configure Clerk webhooks to send email notifications to `quotexbert@gmail.com` whenever a new user signs up.

## Prerequisites
- Clerk account with access to the dashboard
- Production deployment URL (e.g., https://quotexbert.com)
- RESEND_API_KEY configured in production environment

## Step 1: Generate Webhook Secret

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to **Webhooks** in the left sidebar
4. Click **Add Endpoint**

## Step 2: Configure Webhook Endpoint

Add your production webhook URL:
```
https://quotexbert.com/api/webhooks/clerk
```

Or for Vercel deployments:
```
https://your-deployment-url.vercel.app/api/webhooks/clerk
```

## Step 3: Select Events to Monitor

Check the following events:
- ✅ **user.created** - Sends notification when new user signs up
- ✅ **user.updated** - Keeps database in sync when user updates profile
- ✅ **user.deleted** - Marks user as inactive when account deleted

## Step 4: Copy Signing Secret

1. After creating the endpoint, click on it
2. Copy the **Signing Secret** (starts with `whsec_...`)
3. Keep this secret safe - you'll need it in the next step

## Step 5: Add Environment Variable

Add the webhook secret to your production environment:

**Vercel:**
```bash
# In Vercel Dashboard > Settings > Environment Variables
CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

**Or via CLI:**
```bash
vercel env add CLERK_WEBHOOK_SECRET
# Paste the secret when prompted
# Select Production environment
```

## Step 6: Verify Setup

1. **Test the webhook:**
   - In Clerk Dashboard, go to your webhook endpoint
   - Click **Send test event**
   - Select `user.created` event
   - Click **Send**

2. **Check the logs:**
   - In Vercel Dashboard > Deployments > Your deployment > Functions
   - Look for logs from `/api/webhooks/clerk`
   - You should see: `[CLERK WEBHOOK] Received event: user.created`

3. **Check your email:**
   - Check `quotexbert@gmail.com` inbox
   - You should receive a notification email with user details

## Email Notification Details

When a new user signs up, you'll receive an email with:
- User's name
- User's email address
- Clerk user ID
- Signup timestamp
- Note about role selection during onboarding

## Environment Variables Checklist

Make sure these are all configured in production:

- ✅ `CLERK_WEBHOOK_SECRET` - Webhook signing secret
- ✅ `RESEND_API_KEY` - Resend API key for sending emails
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- ✅ `CLERK_SECRET_KEY` - Clerk secret key

## Troubleshooting

### Webhook fails with "Webhook verification failed"
- Double-check the `CLERK_WEBHOOK_SECRET` is correct
- Make sure you copied the full secret including `whsec_` prefix
- Verify the secret is set in the correct environment (Production)

### No email received
- Check RESEND_API_KEY is configured in production
- Verify the domain is verified in Resend dashboard
- Check Vercel function logs for email sending errors
- Look for `[CLERK WEBHOOK] Notification email sent` in logs

### Webhook timeout
- Check database connection is working
- Verify Prisma schema is up to date in production
- Run `npm run db:push` if schema changes were made

### User created in Clerk but not in database
- Check database connection
- Verify Prisma Client is generated: `npx prisma generate`
- Look for database errors in function logs

## Testing Locally

To test webhooks locally:

1. Install Clerk CLI:
```bash
npm install -g @clerk/clerk-cli
```

2. Forward webhooks to local dev server:
```bash
clerk webhooks forward http://localhost:3000/api/webhooks/clerk
```

3. Sign up a test user in your local app
4. Check console for webhook logs
5. Check quotexbert@gmail.com for notification

## Additional Features

The webhook handler also:
- Creates user record in database automatically
- Updates user data when profile is changed in Clerk
- Marks users as inactive when deleted
- Syncs name and email between Clerk and database

## Security Notes

- The webhook secret (`CLERK_WEBHOOK_SECRET`) should never be committed to git
- All webhook requests are verified using Svix signature verification
- Only properly signed requests from Clerk will be processed
- Unsigned or tampered requests will be rejected with 400 error

## Support

If you need help:
1. Check Vercel function logs for detailed error messages
2. Review Clerk webhook delivery logs in dashboard
3. Verify all environment variables are set correctly
4. Test with Clerk's test event feature first
