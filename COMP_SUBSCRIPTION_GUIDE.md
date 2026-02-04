# COMP Subscription System Documentation

## Overview
The COMP (Complimentary) subscription system allows manual subscription overrides for specific accounts without requiring Stripe payments. This is useful for:
- Internal testing accounts
- Partnership accounts
- Staff/admin accounts
- Demo accounts

## Key Features
- ✅ Manual subscription override (bypasses Stripe)
- ✅ Protected admin-only API endpoints
- ✅ Optional expiration dates
- ✅ Auditable (tracks who set override and when)
- ✅ Easy to enable/disable
- ✅ Works in production with live Stripe
- ✅ Does not affect other users

## Architecture

### Database Schema
Added to `User` model:
```prisma
proOverrideEnabled   Boolean?  @default(false)
proOverrideTier      String?   // 'FREE' | 'HANDYMAN' | 'RENOVATION' | 'GENERAL'
proOverrideExpiresAt DateTime? // Null = never expires
proOverrideReason    String?   // Audit trail
proOverrideSetBy     String?   // Admin who set it
proOverrideSetAt     DateTime? // When it was set
```

### Subscription Resolution Logic
Located in: `lib/subscription-utils.ts`

**Order of precedence:**
1. Check if manual override is enabled and not expired
2. If override active → return override tier
3. Else → return Stripe subscription tier

This is the **SINGLE SOURCE OF TRUTH** for all subscription checks.

### API Endpoints

#### 1. Grant/Update COMP Subscription
```
POST /api/admin/comp-subscription
```

**Authentication:**
- Requires `x-admin-token` header matching `ADMIN_TOKEN` env var
- OR authenticated Clerk user with email in `ADMIN_EMAILS`

**Request Body:**
```json
{
  "email": "user@example.com",
  "tier": "GENERAL",
  "expiresAt": "2026-12-31T23:59:59Z",  // Optional (null = never expires)
  "reason": "Internal testing"          // Optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "COMP subscription granted to user@example.com",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "proOverrideEnabled": true,
    "proOverrideTier": "GENERAL",
    "proOverrideExpiresAt": null,
    "proOverrideReason": "Internal testing",
    "proOverrideSetBy": "admin@example.com",
    "proOverrideSetAt": "2026-02-04T..."
  }
}
```

#### 2. Check Override Status
```
GET /api/admin/comp-subscription?email=user@example.com
```

**Response:**
```json
{
  "user": {
    "email": "user@example.com",
    "role": "contractor",
    "subscriptionPlan": null,
    "subscriptionStatus": null,
    "proOverrideEnabled": true,
    "proOverrideTier": "GENERAL",
    "proOverrideExpiresAt": null
  },
  "isOverrideActive": true,
  "effectiveTier": "GENERAL",
  "message": "Override active: GENERAL"
}
```

#### 3. Remove Override
```
DELETE /api/admin/comp-subscription
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

## Usage

### Setup Environment Variables

Add to `.env.local` and production environment:

```bash
# Admin Access
ADMIN_EMAILS=brandsagaceo@gmail.com,quotexbert@gmail.com
ADMIN_TOKEN=your-strong-random-token-here
```

**Generate a strong token:**
```bash
# Option 1: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 2: PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Grant COMP to Your Account

**Option 1: Using the script (Easiest)**
```bash
# Grant COMP subscription
node grant-comp.js

# Check status
node grant-comp.js check

# Remove override
node grant-comp.js remove
```

**Option 2: Using curl**
```bash
curl -X POST http://localhost:3000/api/admin/comp-subscription \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "brandsagaceo@gmail.com",
    "tier": "GENERAL",
    "expiresAt": null,
    "reason": "Internal testing - CEO account"
  }'
```

**Option 3: Production (Vercel)**
```bash
curl -X POST https://www.quotexbert.com/api/admin/comp-subscription \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{
    "email": "brandsagaceo@gmail.com",
    "tier": "GENERAL",
    "reason": "Internal testing"
  }'
```

### Check Your Subscription Status

**Script:**
```bash
node grant-comp.js check
```

**API:**
```bash
curl -X GET "http://localhost:3000/api/admin/comp-subscription?email=brandsagaceo@gmail.com" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN"
```

### Remove COMP Subscription

**Script:**
```bash
node grant-comp.js remove
```

**API:**
```bash
curl -X DELETE http://localhost:3000/api/admin/comp-subscription \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_ADMIN_TOKEN" \
  -d '{"email": "brandsagaceo@gmail.com"}'
```

## Subscription Tiers

```
FREE (0)
  ↓
HANDYMAN (1)
  ↓
RENOVATION (2)
  ↓
GENERAL / PRO / PRO_MAX (3) ← Highest
```

**Features by Tier:**

### FREE
- Can view public content
- No lead claiming
- No portfolio

### HANDYMAN
- Claim up to 10 leads/month
- Create portfolio (10 items max)
- View all leads

### RENOVATION
- Claim up to 25 leads/month
- Create portfolio (25 items max)
- Priority support
- View all leads

### GENERAL (Pro MAX)
- **Unlimited** lead claiming
- **Unlimited** portfolio items
- Priority support
- Advanced analytics
- All features unlocked

## Integration Points

### Everywhere subscriptions are checked:

1. **API Route: `/api/user/subscription`**
   - Returns effective subscription (respects overrides)
   - Used by profile page and dashboard

2. **Utility Functions in `lib/subscription-utils.ts`:**
   - `getEffectiveSubscription(userId)` - Get active tier
   - `isPro(userId)` - Check if user has any pro tier
   - `hasTier(userId, tier)` - Check if user has specific tier or higher
   - `getSubscriptionFeatures(userId)` - Get feature flags for tier

3. **Profile Page: `app/profile/page.tsx`**
   - Shows subscription status
   - Hides "upgrade" prompts for override users (optional UI enhancement)

4. **Lead Claiming Logic:**
   - Uses `getSubscriptionFeatures()` to check `canClaimLeads`
   - Respects monthly limits from effective tier

## Security

### Authentication Methods
1. **Admin Token** (Recommended for scripts)
   - Set `ADMIN_TOKEN` environment variable
   - Pass as `x-admin-token` header
   - Strong random string (32+ characters)

2. **Admin Email List**
   - Set `ADMIN_EMAILS` environment variable (comma-separated)
   - Must be authenticated via Clerk
   - User's email must match one in the list

### Protection
- ✅ Admin-only access (401 if not authorized)
- ✅ Email validation
- ✅ Tier validation (only valid tiers allowed)
- ✅ Audit logging (who set override, when, why)
- ✅ No client-side token exposure
- ✅ Works alongside Stripe (doesn't bypass payment for others)

## Production Deployment

### 1. Add Environment Variables to Vercel

```bash
# Via Vercel CLI
vercel env add ADMIN_TOKEN
# Paste your token, select Production

vercel env add ADMIN_EMAILS
# Paste: brandsagaceo@gmail.com,quotexbert@gmail.com
# Select Production
```

**Or via Dashboard:**
1. Go to Vercel Dashboard
2. Select quotexbert project
3. Settings → Environment Variables
4. Add:
   - `ADMIN_TOKEN` = `your-secret-token`
   - `ADMIN_EMAILS` = `brandsagaceo@gmail.com,quotexbert@gmail.com`
5. Select "Production"
6. Redeploy

### 2. Push Code Changes

```bash
git add -A
git commit -m "Add COMP subscription system"
git push origin main
```

### 3. Run Database Migration

The schema changes were already pushed via `prisma db push`. Vercel will auto-generate Prisma Client on deploy.

### 4. Grant COMP After Deployment

```bash
# Update API_URL in grant-comp.js or use curl
curl -X POST https://www.quotexbert.com/api/admin/comp-subscription \
  -H "Content-Type: application/json" \
  -H "x-admin-token: YOUR_PRODUCTION_ADMIN_TOKEN" \
  -d '{
    "email": "brandsagaceo@gmail.com",
    "tier": "GENERAL",
    "reason": "Internal testing"
  }'
```

## Testing

### Local Development

1. **Start dev server:**
```bash
npm run dev
```

2. **Grant COMP:**
```bash
node grant-comp.js
```

3. **Verify in app:**
   - Sign in as brandsagaceo@gmail.com
   - Go to /profile
   - Should show "Pro MAX" tier
   - No "upgrade" prompts
   - Can claim unlimited leads

4. **Check database:**
```bash
npx prisma studio
# View User table → find your user → check proOverride* fields
```

### Production Testing

Same steps but use production URL:
```bash
# Set in grant-comp.js
API_URL=https://www.quotexbert.com
ADMIN_TOKEN=your-production-token
```

## Troubleshooting

### "Unauthorized" Error
- Check `ADMIN_TOKEN` is set correctly
- Verify token matches in request and environment
- Check `ADMIN_EMAILS` includes your email (if using Clerk auth)

### "User not found"
- User must exist in database first
- Sign up normally, then grant COMP
- Check email spelling (case-insensitive)

### Override Not Working
- Verify `proOverrideEnabled = true` in database
- Check `proOverrideExpiresAt` hasn't passed
- Confirm app is using `getEffectiveSubscription()` utility
- Clear browser cache/cookies

### Still Seeing "Upgrade" Prompts
- Profile page may need UI update to check `effectiveSubscription.isOverride`
- Add conditional rendering to hide upgrade CTAs for override users

## Audit Trail

All overrides are logged:
- Who set it (`proOverrideSetBy`)
- When (`proOverrideSetAt`)
- Why (`proOverrideReason`)
- Tier granted (`proOverrideTier`)
- Expiration (`proOverrideExpiresAt`)

Query audit log:
```sql
SELECT 
  email, 
  proOverrideTier, 
  proOverrideSetBy, 
  proOverrideSetAt,
  proOverrideReason
FROM users
WHERE proOverrideEnabled = true;
```

## FAQ

**Q: Does this bypass Stripe payments for everyone?**
A: No. Only users explicitly granted an override are affected. All other users must pay via Stripe normally.

**Q: Can I set an expiration date?**
A: Yes. Set `expiresAt` to an ISO 8601 datetime. When expired, user falls back to Stripe subscription.

**Q: What happens if I have both Stripe subscription AND override?**
A: Override takes precedence. Stripe subscription is ignored while override is active.

**Q: Can contractors still purchase Stripe subscriptions if they have an override?**
A: Yes, but the override will remain active. Remove the override first if you want them to use Stripe.

**Q: Is this auditable for compliance?**
A: Yes. All overrides are tracked with who/when/why. Query the database for audit reports.

**Q: Can I grant different tiers to different users?**
A: Yes. Each user can have a different override tier.

## Files Changed

```
prisma/schema.prisma                      - Added override fields to User model
lib/subscription-utils.ts                  - New utility for subscription resolution
app/api/admin/comp-subscription/route.ts  - Admin endpoint
app/api/user/subscription/route.ts        - Updated to use override logic
.env.local                                - Added ADMIN_TOKEN and ADMIN_EMAILS
grant-comp.js                             - Helper script
```

## Support

For issues:
1. Check Vercel function logs
2. Verify environment variables are set
3. Test locally first
4. Check database with Prisma Studio
5. Review this documentation

---

**Last Updated:** February 4, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
