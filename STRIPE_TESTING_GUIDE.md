# Stripe Integration Testing Guide

## ✅ Implementation Complete

The Stripe integration for the new tier-based subscription model has been successfully implemented!

## 🎯 What's Been Built

### 1. **Frontend Integration** (`/app/contractor/subscriptions/page.tsx`)
- ✅ Added checkout loading states for all 3 tier buttons
- ✅ Created `handleTierSubscription()` function to initiate Stripe Checkout
- ✅ All "Get Started" buttons now trigger Stripe payment flow
- ✅ Success/cancel message alerts after payment
- ✅ URL parameter handling for return flows

### 2. **Backend API** (`/app/api/subscriptions/create-checkout/route.ts`)
- ✅ POST endpoint for creating Stripe Checkout sessions
- ✅ Tier pricing configured:
  - **Handyman**: $49 CAD/month (3 categories)
  - **Renovation Xbert**: $99 CAD/month (6 categories)
  - **General Contractor**: $149 CAD/month (10+ categories)
- ✅ Customer creation/retrieval logic
- ✅ Metadata tracking (contractorId, tier, category count)
- ✅ Success/cancel URL configuration

### 3. **Webhook Handler** (`/app/api/webhooks/stripe/route.ts`)
- ✅ Handles `checkout.session.completed` event
- ✅ Updates user subscription status in database
- ✅ Creates success notifications
- ✅ Existing handlers for subscription lifecycle events

## 🧪 How to Test

### Step 1: Start Development Server
```powershell
npm run dev
```

### Step 2: Navigate to Subscriptions Page
1. Sign in as a contractor
2. Go to: `http://localhost:3000/contractor/subscriptions`
3. You should see 3 beautiful tier cards with gradient effects

### Step 3: Click "Get Started" on Any Tier
- **Handyman ($49)** - Green gradient card
- **Renovation Xbert ($99)** - Orange/Rose gradient (Most Popular)
- **General Contractor ($149)** - Purple gradient

### Step 4: You'll Be Redirected to Stripe Checkout
This is Stripe's hosted payment page where contractors enter payment details.

### Step 5: Use Stripe Test Cards

#### ✅ Successful Payment
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

#### ❌ Payment Declined
```
Card Number: 4000 0000 0000 0002
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

#### 🔒 Requires Authentication (3D Secure)
```
Card Number: 4000 0027 6000 3184
Expiry: Any future date
CVC: Any 3 digits
ZIP: Any 5 digits
```

### Step 6: After Payment

#### On Success:
- You'll be redirected to: `/contractor/subscriptions?success=true&tier={tier}`
- You'll see a **green success banner**: "Subscription Activated!"
- The banner auto-dismisses after 10 seconds

#### On Cancel:
- You'll be redirected to: `/contractor/subscriptions?canceled=true`
- You'll see a **yellow warning banner**: "Checkout Canceled"
- The banner auto-dismisses after 8 seconds

## 🔗 Webhook Testing (Local Development)

To test webhooks locally, you need to use Stripe CLI:

### Install Stripe CLI
```powershell
# Download from: https://stripe.com/docs/stripe-cli
# Or use Scoop (Windows package manager)
scoop install stripe
```

### Forward Webhooks to Local Server
```powershell
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will give you a webhook signing secret. Update your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Trigger Test Events
```powershell
# Test checkout completed
stripe trigger checkout.session.completed

# Test subscription created
stripe trigger customer.subscription.created

# Test successful payment
stripe trigger invoice.payment_succeeded
```

## 📊 What Happens After Successful Payment

1. **Stripe sends webhook** → `/api/webhooks/stripe`
2. **Webhook handler** processes `checkout.session.completed`:
   - Extracts metadata (contractorId, tier, category count)
   - Updates User record with:
     - `stripeCustomerId`
     - `stripeSubscriptionId`
     - `subscriptionPlan` = tier name
     - `subscriptionStatus` = 'active'
     - `subscriptionInterval` = 'month'
   - Creates notification for contractor
3. **Contractor can now**:
   - Select their allowed categories
   - Start receiving and claiming leads
   - Access premium features

## 🗄️ Database Changes

After successful payment, the `User` table is updated:

```typescript
{
  stripeCustomerId: "cus_xxxxxxxxxxxxx",
  stripeSubscriptionId: "sub_xxxxxxxxxxxxx",
  subscriptionPlan: "handyman" | "renovation" | "general",
  subscriptionStatus: "active",
  subscriptionInterval: "month"
}
```

## 🚧 Next Steps to Complete

### 1. Category Selection Interface (PENDING)
- Add UI for contractors to choose their N categories
- Based on tier: 3, 6, or 10+ categories
- Save selections to database
- Modal or dedicated page

### 2. Access Control (PENDING)
- Check subscription status before showing leads
- Limit category access based on tier
- Display "Upgrade to see more" for restricted categories

### 3. Subscription Management (PENDING)
- Upgrade/downgrade between tiers
- Change category selections
- Pause/cancel subscription
- View billing history with new tier charges

### 4. Production Deployment
- Replace test Stripe keys with live keys
- Set up production webhook endpoint
- Configure proper webhook signing secret
- Test with real payment methods

## 🔐 Environment Variables

Make sure these are set in `.env.local`:

```env
# Stripe Test Keys (already configured)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_TYooMQauvdEDq54NiTphI7jx"
STRIPE_SECRET_KEY="sk_test_4eC39HqLyjWDarjtT1zdp7dc"
STRIPE_WEBHOOK_SECRET="whsec_test_webhook_secret_placeholder"

# For production, replace with:
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxxxx"
# STRIPE_SECRET_KEY="sk_live_xxxxx"
# STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

## 💳 Stripe Dashboard

Monitor test payments at:
- **Dashboard**: https://dashboard.stripe.com/test/dashboard
- **Customers**: https://dashboard.stripe.com/test/customers
- **Subscriptions**: https://dashboard.stripe.com/test/subscriptions
- **Payments**: https://dashboard.stripe.com/test/payments
- **Webhooks**: https://dashboard.stripe.com/test/webhooks

## ✨ Features

### User Experience
- ✅ Beautiful tier cards with 3D gradient effects
- ✅ Loading spinners during checkout
- ✅ Success/cancel message alerts
- ✅ Smooth redirect to Stripe Checkout
- ✅ Auto-dismiss notifications
- ✅ URL cleanup after redirect

### Security
- ✅ No PCI compliance needed (Stripe handles card data)
- ✅ Webhook signature verification
- ✅ Metadata validation
- ✅ Stripe customer ID tracking

### Reliability
- ✅ Error handling for failed API calls
- ✅ Loading states prevent double-clicks
- ✅ Transaction logging in database
- ✅ Subscription status tracking

## 🐛 Troubleshooting

### "Failed to create checkout session"
- Check that Stripe keys are set in `.env.local`
- Verify user is authenticated (`authUser` exists)
- Check browser console for error details

### Webhook not firing locally
- Make sure Stripe CLI is running: `stripe listen`
- Verify webhook secret matches in `.env.local`
- Check webhook endpoint is accessible: `/api/webhooks/stripe`

### Subscription not showing as active
- Check Stripe Dashboard → Subscriptions
- Verify webhook was received and processed
- Check database User record for `subscriptionStatus`

## 📝 Test Checklist

- [ ] Click "Get Started" on Handyman tier ($49)
- [ ] See loading spinner on button
- [ ] Redirected to Stripe Checkout page
- [ ] Enter test card `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Redirected back to subscriptions page
- [ ] See green success banner
- [ ] Check Stripe Dashboard for new subscription
- [ ] Verify database User record updated
- [ ] Test cancel flow (click back from Stripe)
- [ ] See yellow cancel banner
- [ ] Repeat for other tiers

## 🎉 Success Criteria

You'll know it's working when:
1. ✅ Button shows loading spinner when clicked
2. ✅ Stripe Checkout page loads with correct amount
3. ✅ After payment, you see success message
4. ✅ Stripe Dashboard shows new customer and subscription
5. ✅ Database shows updated subscription status
6. ✅ Contractor receives notification

---

**Status**: ✅ Ready for Testing
**Last Updated**: Just now
**Next Action**: Test with Stripe test cards and verify webhook handling
