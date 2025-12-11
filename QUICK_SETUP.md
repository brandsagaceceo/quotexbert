# ⚡ Quick Setup Guide - Production Environment Variables

Your code is deployed! Now configure production environment variables to make everything work.

## 🎯 Immediate Action Required

### 1. Go to Vercel Dashboard
URL: https://vercel.com/brandsagaceceo/quotexbert

### 2. Navigate to Settings → Environment Variables

### 3. Add These Production Variables:

#### Stripe (Live Mode - Get from https://dashboard.stripe.com)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
STRIPE_SECRET_KEY = sk_live_xxxxx
STRIPE_WEBHOOK_SECRET = whsec_xxxxx
```

**How to get these:**
1. Go to Stripe Dashboard
2. Toggle to **Live Mode** (top right)
3. Developers → API Keys
4. Copy Publishable and Secret keys
5. Create webhook at `/api/webhooks/stripe` (copy signing secret)

---

#### Clerk (Production - Get from https://dashboard.clerk.com)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_live_xxxxx
CLERK_SECRET_KEY = sk_live_xxxxx
```

**How to get these:**
1. Go to Clerk Dashboard
2. Switch to **Production** (top left dropdown)
3. API Keys section
4. Copy Publishable and Secret keys
5. Add your domain to Settings → Domains

---

#### Base URL
```
NEXT_PUBLIC_BASE_URL = https://quotexbert.vercel.app
```
(or your custom domain)

---

### 4. Important Settings:
- ✅ Select **"Production"** when adding each variable
- ✅ Click "Save" for each one

### 5. Redeploy After Adding Variables
- Go to Deployments tab
- Click "..." on latest deployment
- Select "Redeploy"

## 🧪 Testing

After redeployment completes:

### Test Stripe Checkout
1. Visit: https://your-domain.com/contractor/subscriptions
2. Click "Get Started" on any tier
3. Should redirect to Stripe Checkout
4. Use test card: `4242 4242 4242 4242` (if still in test mode)
5. Verify success redirect works

### Test Clerk Auth
1. Visit: https://your-domain.com/sign-up
2. Create an account
3. Verify email confirmation
4. Sign in at: https://your-domain.com/sign-in

### Verify Find Jobs Button
1. Sign in as contractor
2. Check header - should see green "💼 Find Jobs" button
3. Button should have green gradient + ring styling

## ⚠️ Current State

**What's Already Deployed:**
- ✅ Stripe checkout with comprehensive error handling
- ✅ Production URL fallback handling
- ✅ Green "Find Jobs" button (desktop + mobile)
- ✅ Better error messages and logging
- ✅ All recent UI improvements

**What You Need to Configure:**
- ⏳ Production Stripe keys (currently using test keys)
- ⏳ Production Clerk keys (currently using test keys)
- ⏳ Production base URL
- ⏳ Stripe webhook endpoint

## 🚨 Critical Notes

1. **Don't delete test keys yet** - keep them until production keys are verified
2. **Clerk domain** - Must add production URL to allowed origins
3. **Stripe webhook** - Must point to production domain
4. **Database** - Ensure production DATABASE_URL is set

## 📊 Monitoring

After configuration:
1. Check Vercel → Logs for errors
2. Check Stripe → Webhooks for delivery status
3. Check Clerk → Users for authentication activity

## ✅ Success Checklist

- [ ] Added Stripe production keys to Vercel
- [ ] Added Clerk production keys to Vercel
- [ ] Set NEXT_PUBLIC_BASE_URL in Vercel
- [ ] Redeployed after adding variables
- [ ] Tested Stripe checkout flow
- [ ] Tested Clerk authentication
- [ ] Verified Find Jobs button is green
- [ ] Checked logs for errors

---

**Need Help?** See `PRODUCTION_DEPLOYMENT_GUIDE.md` for detailed troubleshooting.
