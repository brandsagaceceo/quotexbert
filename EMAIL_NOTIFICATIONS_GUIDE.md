# Email Notifications - QuoteXbert

## Overview
All email notifications are sent to **quotexbert@gmail.com** for centralized monitoring.

## Notification Types

### 1. New User Signup ✅
**Trigger:** User completes sign-up via Clerk  
**Source:** `/api/webhooks/clerk`  
**Subject:** 🎉 New User Signup - QuoteXbert  
**Contains:**
- User name
- Email address
- Clerk user ID
- Signup timestamp
- Role information (set during onboarding)

### 2. Affiliate Signup ✅
**Trigger:** Someone submits affiliate program application  
**Source:** `/api/affiliate/signup`  
**Subject:** 📢 New Affiliate Signup - QuoteXbert  
**Contains:**
- Email address
- Signup timestamp
- Call to action to review application

### 3. Lead Submission ✅
**Trigger:** Homeowner creates a job/lead  
**Source:** `lib/email.ts` - `sendLeadEmail()`  
**Subject:** New Lead: [Job Title]  
**Contains:**
- Job title and description
- Location (city/province)
- Budget range
- Timeline
- Homeowner contact info
- Link to view full details

### 4. Message Received (Existing)
**Trigger:** Contractor receives message from homeowner  
**Source:** `lib/email.ts` - `sendMessageReceivedEmail()`  
**Contains:**
- Message preview
- Sender information
- Link to conversation

### 5. Contract Sent (Existing)
**Trigger:** Contractor sends quote/contract to homeowner  
**Source:** `lib/email.ts` - `sendContractSentEmail()`  
**Contains:**
- Contract details
- Contractor information
- Link to view contract

### 6. Contract Accepted (Existing)
**Trigger:** Homeowner accepts contractor's quote  
**Source:** `lib/email.ts` - `sendContractAcceptedEmail()`  
**Contains:**
- Contract details
- Homeowner information
- Next steps

## Email Service Configuration

**Provider:** Resend  
**API Key:** `RESEND_API_KEY` (environment variable)  
**From Address:** `no-reply@quotexbert.com`  
**Primary Recipient:** `quotexbert@gmail.com`

## Setup Checklist

- ✅ Resend API key configured in production
- ✅ Domain verified in Resend dashboard
- ⏳ Clerk webhook configured (see CLERK_WEBHOOK_SETUP.md)
- ⏳ Webhook secret added to production environment

## Testing

### Test Affiliate Signup Email
```bash
curl -X POST https://quotexbert.com/api/affiliate/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test Lead Email
1. Sign in as homeowner
2. Create a new job/lead
3. Check quotexbert@gmail.com inbox

### Test User Signup Email
1. Sign up with a new test account
2. Complete onboarding
3. Check quotexbert@gmail.com inbox

## Monitoring

### Check Email Delivery
1. Go to [Resend Dashboard](https://resend.com/emails)
2. View recent emails sent
3. Check delivery status and open rates

### Check Webhook Status
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/) > Webhooks
2. View recent webhook deliveries
3. Check for failed attempts

### Check Application Logs
```bash
vercel logs --follow
# Or in Vercel Dashboard > Deployments > Functions
```

Look for these log messages:
- `[CLERK WEBHOOK] Notification email sent to quotexbert@gmail.com`
- `[AFFILIATE SIGNUP] Email sent successfully`
- `Lead email sent to quotexbert@gmail.com`

## Email Templates

All emails use HTML formatting with:
- Responsive design (max-width: 600px)
- Table-based layouts for data
- Brand colors (Red #dc2626 for headings)
- Professional styling

## Troubleshooting

### Not Receiving Emails

1. **Check Resend API Key:**
   ```bash
   vercel env ls
   # Verify RESEND_API_KEY is set for Production
   ```

2. **Check Domain Verification:**
   - Login to Resend dashboard
   - Verify quotexbert.com domain is verified
   - Check DNS records are configured

3. **Check Spam Folder:**
   - Emails from no-reply addresses often go to spam
   - Mark as "Not Spam" to whitelist

4. **Check Application Logs:**
   ```bash
   vercel logs --output raw | grep -i email
   # Look for email sending errors
   ```

### Webhook Not Triggering

1. **Verify Webhook URL:**
   - Should be: `https://quotexbert.com/api/webhooks/clerk`
   - Must be publicly accessible

2. **Check Webhook Secret:**
   ```bash
   vercel env ls
   # Verify CLERK_WEBHOOK_SECRET is set
   ```

3. **Test Webhook:**
   - In Clerk Dashboard, send test event
   - Check function logs for processing

4. **Verify Event Selection:**
   - Make sure `user.created` event is checked
   - Other events: `user.updated`, `user.deleted`

## Future Enhancements

Potential additions:
- Weekly summary of new signups
- Contractor application notifications
- Payment/subscription alerts
- Quote accepted notifications
- Review submitted notifications
- Referral program notifications

## Support

For issues with:
- **Email delivery:** Check Resend dashboard and API key
- **Webhook delivery:** Check Clerk dashboard and webhook secret
- **Code errors:** Check Vercel function logs
- **General questions:** Review this guide and CLERK_WEBHOOK_SETUP.md
