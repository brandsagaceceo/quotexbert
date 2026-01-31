# 🎯 YOUR API KEYS CHECKLIST

## ✅ ALREADY WORKING (4 keys)
- ✅ **Clerk Authentication** (sign in/up)
- ✅ **Database** (PostgreSQL - 69 users)
- ✅ **OpenAI API** (AI estimates)
- ✅ **Microsoft Clarity** (analytics)

---

## 🔴 YOU NEED TO GET (3 keys - 20 minutes total)

### 1. Stripe Keys (15 min) - CRITICAL FOR PAYMENTS

**Why**: Users can't subscribe or pay without real Stripe keys

**Get them**:
1. Create account: https://dashboard.stripe.com/register
2. Go to: Dashboard → Developers → API Keys
3. Copy these 2 keys:
   - `Publishable key`: pk_test_...
   - `Secret key`: sk_test_... (click "Reveal")
4. Configure webhook:
   - Go to: Dashboard → Developers → Webhooks
   - Add endpoint: `https://www.quotexbert.com/api/webhooks/stripe`
   - Select all 6 events (see START_HERE.md)
   - Copy `Signing secret`: whsec_...

**Add to .env.local**:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

**Test with card**: `4242 4242 4242 4242`

---

### 2. Google Analytics ID (5 min) - Track Website Traffic

**Why**: See how many visitors, which pages they visit, conversion rates

**Get it**:
1. Go to: https://analytics.google.com/
2. Create Property → "QuoteXbert Production"
3. Copy Measurement ID: `G-XXXXXXXXXX`

**Add to .env.local**:
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

---

### 3. Google Business Profile URLs (5 min) - Get Reviews

**Why**: Users can leave Google reviews, shows your business info

**Get them**:
1. Go to: https://business.google.com/
2. Find your QuoteXbert profile
3. Click "Share profile" → Copy URL
4. Click "Get more reviews" → Copy review URL

**Add to .env.local**:
```env
NEXT_PUBLIC_GOOGLE_BUSINESS_URL=https://g.page/r/YOUR_ID
NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://g.page/r/YOUR_ID/review
```

---

## 🟡 OPTIONAL (Nice to have)

### Google Tag Manager (5 min)
- For advanced tracking & A/B testing
- Get from: https://tagmanager.google.com/
- Format: `GTM-XXXXXXX`
- Add to .env.local as: `NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX`

---

## 📊 Summary

| Key | Status | Priority | Time |
|-----|--------|----------|------|
| Clerk Auth | ✅ Working | - | - |
| Database | ✅ Working | - | - |
| OpenAI | ✅ Working | - | - |
| Clarity | ✅ Working | - | - |
| **Stripe (3 keys)** | ❌ Need | 🔴 Critical | 15 min |
| **Google Analytics** | ❌ Need | 🟡 Important | 5 min |
| **Google Business** | ❌ Need | 🟡 Important | 5 min |
| Google Tag Manager | ❌ Optional | 🟢 Nice | 5 min |

**Total keys needed**: 3 services = 7 individual keys
**Total time**: 25 minutes to get everything

---

## 🚀 After You Get Keys

1. **Add to .env.local** (I already created placeholders for you)
2. **Restart dev server**: 
   ```powershell
   npm run dev
   ```
3. **Test Stripe**: Visit http://localhost:3000/contractor/subscriptions
4. **Check Analytics**: Visit your site, check GA Real-Time reports
5. **Deploy to Vercel**: Add same keys to Vercel environment variables

---

## 🎯 START HERE

**Step 1**: Go to https://dashboard.stripe.com/register  
**Step 2**: Get your 3 Stripe keys (15 min)  
**Step 3**: Update .env.local with real keys  
**Step 4**: Restart server and test  

Everything else can wait! Get Stripe working first. 💳
