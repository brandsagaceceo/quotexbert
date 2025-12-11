# Stripe Price IDs Configuration

## Overview
QuoteXbert uses **dynamic price creation** for subscriptions. Prices are created on-the-fly during checkout, NOT pre-configured in Stripe.

## Current Subscription Tiers (CAD)

### 1. Handyman Plan
- **Display Name**: Handyman
- **Price**: $49/month
- **Categories**: 3
- **Implementation**: `app/api/subscriptions/create-checkout/route.ts`
- **Price Data**: Created dynamically in checkout session
  ```typescript
  {
    currency: "cad",
    recurring: { interval: "month" },
    unit_amount: 4900, // $49 in cents
    product_data: {
      name: "Handyman Plan",
      description: "Access to 3 job categories with unlimited applications"
    }
  }
  ```

### 2. Renovation Xbert Plan
- **Display Name**: Renovation Xbert
- **Price**: $99/month (FIXED: was showing as $139 on homepage)
- **Categories**: 6
- **Implementation**: `app/api/subscriptions/create-checkout/route.ts`
- **Price Data**: Created dynamically in checkout session
  ```typescript
  {
    currency: "cad",
    recurring: { interval: "month" },
    unit_amount: 9900, // $99 in cents
    product_data: {
      name: "Renovation Xbert Plan",
      description: "Access to 6 job categories with priority features"
    }
  }
  ```

### 3. General Contractor Plan
- **Display Name**: General Contractor
- **Price**: $149/month
- **Categories**: 10 (ALL categories)
- **Implementation**: `app/api/subscriptions/create-checkout/route.ts`
- **Price Data**: Created dynamically in checkout session
  ```typescript
  {
    currency: "cad",
    recurring: { interval: "month" },
    unit_amount: 14900, // $149 in cents
    product_data: {
      name: "General Contractor Plan",
      description: "Access to ALL categories with premium features"
    }
  }
  ```

## AI Visualizer Subscription

### AI Visualizer Premium
- **Price**: $6.99/month
- **Implementation**: `app/api/visualizer/subscribe/route.ts`
- **Environment Variable**: `STRIPE_VISUALIZER_PRICE_ID`
- **Fallback**: `"price_visualizer_6_99"`
- **Note**: This uses a pre-configured price ID from Stripe Dashboard

## Stripe Configuration Files

### Primary Checkout Handler
- **File**: `app/api/subscriptions/create-checkout/route.ts`
- **Method**: Dynamic price creation
- **Tiers**: handyman, renovation, general
- **Currency**: CAD

### Webhook Handler
- **File**: `app/api/webhooks/stripe/route.ts`
- **Events**: 
  - `checkout.session.completed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`

### Visualizer Subscription
- **File**: `app/api/visualizer/subscribe/route.ts`
- **Method**: Pre-configured price ID from environment variable

## Environment Variables Needed

### For Production Stripe (LIVE MODE)

```bash
# Stripe API Keys
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Visualizer Price (must create in Stripe Dashboard)
STRIPE_VISUALIZER_PRICE_ID=price_... # $6.99/month CAD recurring

# Base URL for redirects
NEXT_PUBLIC_BASE_URL=https://quotexbert.com
```

## How to Create Stripe Products (For Visualizer Only)

Since subscription tiers use dynamic pricing, you only need to create:

### AI Visualizer Product
1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. **Product Name**: "AI Visualizer Premium"
4. **Description**: "AI-powered room transformation visualizations"
5. **Pricing**: 
   - Type: Recurring
   - Price: $6.99 CAD
   - Billing Period: Monthly
6. Save and copy the **Price ID** (starts with `price_...`)
7. Add to Vercel Environment Variables as `STRIPE_VISUALIZER_PRICE_ID`

## Testing

### Test Mode
- Use test keys: `pk_test_...` and `sk_test_...`
- Test cards: https://stripe.com/docs/testing#cards
- Successful card: `4242 4242 4242 4242`

### Production Mode
- Switch to live keys: `pk_live_...` and `sk_live_...`
- Real payments will be processed
- Webhook signing secret must be from LIVE mode webhook endpoint

## Webhook Setup

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://quotexbert.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
4. Copy webhook signing secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Price Consistency Check

✅ **FIXED**: All pricing is now consistent across platform
- Homepage: $49, $99, $149
- Subscription page: $49, $99, $149
- API: 4900, 9900, 14900 (cents)
- Tier names standardized: "Handyman", "Renovation Xbert", "General Contractor"

## Notes

- **No pre-configured price IDs needed** for subscription tiers (except AI Visualizer)
- Prices are created dynamically during checkout
- This approach allows easier price changes without updating environment variables
- All prices are in CAD (Canadian Dollars)
- Stripe handles currency conversion if needed
