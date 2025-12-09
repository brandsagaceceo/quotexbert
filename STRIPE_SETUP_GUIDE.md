# 🚀 Stripe Subscription Setup Guide

## Overview
We've simplified the subscription page to 3 clean tiers:
- **Handyman** - $79/month - 4 categories, 15 leads
- **Renovation Expert** - $139/month - 8 categories, 30 leads (MOST POPULAR)
- **General Contractor** - $199/month - All 12 categories, 50 leads

---

## ✅ RECOMMENDED: Simple Tier-Based Approach

This is the **easiest and cleanest** way to set up your Stripe subscriptions.

### Step 1: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Click **"+ Add Product"**
3. Create 3 products:

#### Product 1: Handyman
- **Name:** Handyman Plan
- **Description:** 4 trade categories, up to 15 leads per month
- **Pricing:**
  - **Price:** $79
  - **Billing period:** Monthly
  - **Recurring:** Yes
- **Save Product** and copy the **Price ID** (starts with `price_...`)

#### Product 2: Renovation Expert
- **Name:** Renovation Expert Plan
- **Description:** 8 trade categories, up to 30 leads per month (Most Popular!)
- **Pricing:**
  - **Price:** $139
  - **Billing period:** Monthly
  - **Recurring:** Yes
- **Save Product** and copy the **Price ID**

#### Product 3: General Contractor
- **Name:** General Contractor Plan
- **Description:** All 12 categories, up to 50 leads per month
- **Pricing:**
  - **Price:** $199
  - **Billing period:** Monthly
  - **Recurring:** Yes
- **Save Product** and copy the **Price ID**

---

### Step 2: Update Environment Variables

Add the Stripe Price IDs to your `.env.local`:

```env
# Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Stripe Price IDs for Plans
STRIPE_PRICE_HANDYMAN=price_1Abc123...
STRIPE_PRICE_RENOVATION=price_1Def456...
STRIPE_PRICE_GENERAL_CONTRACTOR=price_1Ghi789...
```

---

### Step 3: Update API Route

Update `app/api/contractor/subscribe/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Map package IDs to Stripe Price IDs
const PRICE_MAP = {
  handyman: process.env.STRIPE_PRICE_HANDYMAN!,
  renovation: process.env.STRIPE_PRICE_RENOVATION!,
  'general-contractor': process.env.STRIPE_PRICE_GENERAL_CONTRACTOR!,
};

export async function POST(request: NextRequest) {
  try {
    const { userId, categories, packageId } = await request.json();

    // Get the price ID for the selected package
    const priceId = PRICE_MAP[packageId as keyof typeof PRICE_MAP];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid package selected' },
        { status: 400 }
      );
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/contractor/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/contractor/subscription?canceled=true`,
      metadata: {
        userId,
        packageId,
        categories: JSON.stringify(categories),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}
```

---

### Step 4: Update Frontend to Pass Package ID

Update `app/contractor/subscription/page.tsx`:

```typescript
const handleSubscribe = async () => {
  if (selectedCategories.length === 0) {
    alert('Please select a plan');
    return;
  }

  // Determine which package was selected based on categories
  const packageId = packages.find(pkg => 
    JSON.stringify(pkg.categories.sort()) === JSON.stringify(selectedCategories.sort())
  )?.id;

  if (!packageId) {
    alert('Please select one of the package plans');
    return;
  }

  setLoading(true);
  try {
    const response = await fetch('/api/contractor/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user?.id,
        categories: selectedCategories,
        packageId, // Send package ID to backend
      })
    });

    if (response.ok) {
      const { sessionId } = await response.json();
      const stripe = await stripePromise;
      await stripe?.redirectToCheckout({ sessionId });
    } else {
      alert('Failed to create subscription. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Why This Approach is Best

### Pros:
✅ **Simple** - Only 3 products to manage in Stripe
✅ **Clean** - Each tier is a distinct product with clear pricing
✅ **Easy to track** - Clear reporting in Stripe dashboard
✅ **Scalable** - Easy to add promotional pricing or discounts
✅ **User-friendly** - Customers see exactly what they're paying for
✅ **No complex calculations** - Stripe handles all billing logic

### Cons:
❌ Can't customize individual categories (but your packages cover all major use cases)

---

## 🎨 Launch Pricing Strategy

Since you want to attract users quickly, I've set these as **LAUNCH SPECIAL** prices:

- **Handyman**: ~~$99~~ → **$79** (20% off)
- **Renovation Expert**: ~~$179~~ → **$139** (22% off) 
- **General Contractor**: ~~$249~~ → **$199** (20% off)

You can create the "regular" price products in Stripe later and switch when the launch period ends.

---

## 📊 Stripe Dashboard Best Practices

1. **Use Test Mode** first to verify everything works
2. **Set up webhooks** to handle subscription events:
   - `checkout.session.completed` - When payment succeeds
   - `customer.subscription.updated` - When subscription changes
   - `customer.subscription.deleted` - When subscription cancels
3. **Enable Customer Portal** so users can manage subscriptions themselves
4. **Set up billing alerts** to monitor revenue

---

## 🔄 Migration Path (If Needed Later)

If you want to add custom category selection later:
1. Create individual category products in Stripe
2. Use Stripe's `subscription_items` to allow multiple line items
3. Update calculateTotal() to sum individual categories
4. Keep the package tiers as "bundles" with discount pricing

---

## ✅ Testing Checklist

- [ ] Create 3 products in Stripe (test mode)
- [ ] Copy Price IDs to `.env.local`
- [ ] Update subscribe API route with price mapping
- [ ] Update frontend to send packageId
- [ ] Test checkout flow for each tier
- [ ] Verify webhook receives metadata
- [ ] Test subscription in Stripe Customer Portal
- [ ] Switch to production mode when ready

---

## 🚀 Go Live

Once testing is complete:
1. Create the same 3 products in **Production mode**
2. Copy production Price IDs to `.env.production` or Vercel env vars
3. Deploy to production
4. Test with real payment (then refund)
5. Launch! 🎉

---

## Need Help?

Stripe Documentation:
- [Products & Prices](https://stripe.com/docs/products-prices/overview)
- [Checkout Sessions](https://stripe.com/docs/payments/checkout)
- [Webhooks](https://stripe.com/docs/webhooks)
- [Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
