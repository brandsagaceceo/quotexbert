# QuoteXbert Production Deployment Checklist
**Commit:** `5d6b7693eaaa468ddbde85cada5e264dcb701be0`  
**Date:** March 11, 2026  
**CRITICAL**: This checklist must be completed before considering platform stable.

---

## ⚠️ DEPLOYMENT IS NOT COMPLETE UNTIL ALL STEPS PASS ⚠️

---

## Step 1: Verify Vercel Deployment

### Check Deployment Status
1. Go to: https://vercel.com/dashboard
2. Find your QuoteXbert project
3. Look at latest deployment

### Verify This Commit is Live
**Expected commit hash**: `5d6b769`  
**Expected commit message**: "Platform stabilization: dashboards, navigation, metrics, UX improvements"

### Checks:
- [ ] Deployment status: "Ready" (green checkmark)
- [ ] Commit hash matches: `5d6b769`
- [ ] No build errors in logs
- [ ] Production URL is accessible

**If deployment failed**: Fix build errors before proceeding to migration.

---

## Step 2: Run Production Database Migration 🚨 CRITICAL

### Why This Matters
Your production database is missing these columns:
- `users.displayName` - Breaks user upsert in role selection
- `leads.claimedBy` - Breaks homeowner project posting
- `leads.claimedAt` - Breaks lead claiming flow

**Without this migration, the platform WILL crash on real user flows.**

### Option A: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/dashboard
2. Click your project → "Storage" tab
3. Click your Postgres database
4. Click "Query" tab
5. **Copy and paste this SQL**:

```sql
-- Stabilization Migration - March 11, 2026
-- Adds missing columns to production database

-- Ensure displayName column exists in users table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'displayName'
    ) THEN
        ALTER TABLE users ADD COLUMN "displayName" TEXT;
        RAISE NOTICE 'Added displayName column to users table';
    ELSE
        RAISE NOTICE 'displayName column already exists';
    END IF;
END $$;

-- Ensure claimedBy column exists in leads table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'claimedBy'
    ) THEN
        ALTER TABLE leads ADD COLUMN "claimedBy" TEXT;
        RAISE NOTICE 'Added claimedBy column to leads table';
    ELSE
        RAISE NOTICE 'claimedBy column already exists';
    END IF;
END $$;

-- Ensure claimedAt column exists in leads table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'claimedAt'
    ) THEN
        ALTER TABLE leads ADD COLUMN "claimedAt" TIMESTAMP(3);
        RAISE NOTICE 'Added claimedAt column to leads table';
    ELSE
        RAISE NOTICE 'claimedAt column already exists';
    END IF;
END $$;

-- Success message
SELECT 'Migration completed successfully - all columns verified' AS status;
```

6. Click "Run Query"
7. **Verify output shows**: "Migration completed successfully"

### Option B: Via Command Line (If you have production DATABASE_URL)
```bash
# Set production database URL
export DATABASE_URL="your-production-postgres-url"

# Run migration
psql $DATABASE_URL < prisma/migrations/20260311_stabilization_fix.sql

# Or run directly
psql $DATABASE_URL -c "
DO \$\$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'displayName') THEN
        ALTER TABLE users ADD COLUMN \"displayName\" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'claimedBy') THEN
        ALTER TABLE leads ADD COLUMN \"claimedBy\" TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'claimedAt') THEN
        ALTER TABLE leads ADD COLUMN \"claimedAt\" TIMESTAMP(3);
    END IF;
END \$\$;
"
```

### Verification
After running migration, verify columns exist:
```sql
-- Check users table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'displayName';

-- Check leads table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'leads' AND column_name IN ('claimedBy', 'claimedAt');
```

**Expected result**: Should return 3 rows (one for each column)

### Migration Checklist:
- [ ] Migration SQL executed successfully
- [ ] No errors in output
- [ ] Verified `displayName` column exists in users
- [ ] Verified `claimedBy` column exists in leads
- [ ] Verified `claimedAt` column exists in leads

---

## Step 3: Test Homeowner Flow (LIVE SITE)

### Go to your production URL (quotexbert.com or Vercel URL)

### Test Path:
1. **Generate Estimate**
   - [ ] Go to homepage
   - [ ] Fill out estimate form
   - [ ] Upload photo (optional)
   - [ ] Submit form
   - [ ] Estimate generates without error
   - [ ] No Prisma/database errors in browser console (F12)

2. **Save Project**
   - [ ] Click "Save Project" button
   - [ ] Project saves successfully
   - [ ] Can view saved project

3. **Post Project**
   - [ ] Click "Post to Job Board" or go to `/create-lead`
   - [ ] Fill out project details
   - [ ] Submit
   - [ ] **CRITICAL**: No error about `claimedBy` field
   - [ ] Success message appears
   - [ ] Project appears on job board

4. **Check Homeowner Dashboard**
   - [ ] Go to `/homeowner/dashboard`
   - [ ] Page loads without errors
   - [ ] See saved estimates count
   - [ ] See posted jobs count
   - [ ] All 6 cards are visible and clickable

### Expected Results:
- ✅ No "Column 'claimedBy' does not exist" error
- ✅ No "Column 'displayName' does not exist" error  
- ✅ Project successfully posts to job board
- ✅ Dashboard shows accurate counts

### If Errors Occur:
- Check browser console (F12) for exact error message
- Check Vercel logs (Functions tab) for server-side errors
- Verify migration actually ran (Step 2)

---

## Step 4: Test Contractor Flow (LIVE SITE)

### Test Path:
1. **Login as Contractor**
   - [ ] Go to `/sign-in`
   - [ ] Login with contractor account (or create one)
   - [ ] Redirect works correctly

2. **Browse Jobs**
   - [ ] Go to `/contractor/jobs` or click "Browse Jobs"
   - [ ] Jobs load without error
   - [ ] Can see posted jobs from Step 3
   - [ ] No Prisma errors in console

3. **Check Metrics**
   - [ ] Go to `/contractor/dashboard`
   - [ ] Metrics load (Leads Received, Jobs Accepted, etc.)
   - [ ] **CRITICAL**: Leads Received ≠ Jobs Accepted (should be different numbers)
   - [ ] Conversion Rate shows percentage (not "NaN")
   - [ ] Response Time shows value or "N/A"

4. **Accept/Claim Job** (if available)
   - [ ] Click on a job
   - [ ] Try to claim or accept
   - [ ] **CRITICAL**: No error about `claimedBy` field
   - [ ] Action completes successfully

5. **Check Dashboard Cards**
   - [ ] See "Browse Jobs" card
   - [ ] See "My Accepted Jobs" card
   - [ ] See "Leads Map" card
   - [ ] See "Messages" card
   - [ ] See "My Performance" card
   - [ ] See "Subscription" card
   - [ ] All cards clickable and lead to correct pages

### Expected Results:
- ✅ Metrics load correctly
- ✅ Leads Received and Jobs Accepted are different
- ✅ Can claim jobs without database errors
- ✅ Dashboard navigation works

---

## Step 5: Check Support/Help Links

### Desktop:
- [ ] Click "Need Help?" in header
- [ ] Goes to `/contact` page (NOT phone dialer)
- [ ] No "Open with app" popup
- [ ] Contact form loads

### Mobile:
- [ ] Open site on phone
- [ ] Open mobile menu (hamburger)
- [ ] See "📞 Need Help? Call Us"
- [ ] Click it → phone dialer opens with `905-242-9460`
- [ ] No "Pick an app" dialog
- [ ] Call connects (optional: test actual call)

### Privacy Check:
- [ ] No personal phone numbers exposed in public pages
- [ ] Support number is business line: 905-242-9460
- [ ] Help links don't leak internal data

---

## Step 6: Check Feature Visibility

### These Should Be Visible/Accessible:

1. **Affiliates Program**
   - [ ] See "Affiliates" link in header
   - [ ] Click → goes to `/affiliates` page
   - [ ] Page loads with signup form
   - [ ] See commission structure (20%)

2. **AI Renovation Inspector**
   - [ ] Visible in homeowner dashboard as card
   - [ ] Click → goes to `/ai-renovation-check`
   - [ ] Can upload photo
   - [ ] Can submit question
   - [ ] AI analyzes and responds

3. **Homeowner Dashboard**
   - [ ] Go to `/homeowner/dashboard`
   - [ ] See all 6 cards:
     - Get AI Estimate
     - My Saved Estimates
     - My Posted Jobs
     - Active Projects
     - Messages
     - AI Renovation Inspector
   - [ ] Each card shows correct stat/badge
   - [ ] All cards clickable

4. **Contractor Dashboard**
   - [ ] Go to `/contractor/dashboard`
   - [ ] See all 6 quick action cards
   - [ ] No duplicate "My Quotes" or "Portfolio" (old items removed)
   - [ ] Metrics card displays at bottom

---

## Step 7: Mobile UX Check

### Open site on actual phone (iPhone Safari or Android Chrome):

1. **Floating Widget**
   - [ ] AI chatbot button visible at bottom-right
   - [ ] Does NOT cover CTAs (Post Project, Get Estimate buttons)
   - [ ] Does NOT cover form inputs when typing
   - [ ] Positioned at least 96px from bottom (above nav)

2. **Bottom Navigation**
   - [ ] Bottom nav visible on mobile
   - [ ] All icons and labels readable
   - [ ] Tappable (not too small)
   - [ ] Doesn't overlap content when scrolling

3. **Layout**
   - [ ] No horizontal scroll anywhere
   - [ ] Text doesn't spill outside boxes
   - [ ] Cards stack properly (responsive grid)
   - [ ] Forms are full-width and usable

4. **Critical Pages on Mobile**
   - [ ] Homepage estimate form: clean, no cutoffs
   - [ ] Homeowner dashboard: cards stack nicely
   - [ ] Contractor jobs page: job cards readable
   - [ ] Create lead form: all fields accessible

### Test These Specific Scenarios:
- [ ] Fill out estimate form on mobile → no keyboard overlap issues
- [ ] Post project on mobile → all fields accessible
- [ ] Browse jobs on mobile → cards don't overlap
- [ ] Click floating AI widget → doesn't block anything

---

## Step 8: Error Message Verification

### Test Quota Error Handling:
If you can trigger an OpenAI quota error (submit many estimates quickly):
- [ ] User sees: "High demand right now. Please try again in a moment."
- [ ] NOT: "The quota has been exceeded"
- [ ] NOT: Raw error stack trace

### General Error Handling:
- [ ] No raw Prisma errors shown to users
- [ ] No "Column does not exist" errors
- [ ] All errors have user-friendly messages
- [ ] Console errors don't contain sensitive data

---

## Final Smoke Test Checklist ✅

Copy this exact checklist and check off as you test:

- [ ] ✅ Vercel deploy successful (commit 5d6b769 is live)
- [ ] ✅ Prisma migration successful (displayName, claimedBy columns exist)
- [ ] ✅ Homepage estimate works (no errors)
- [ ] ✅ Save project works
- [ ] ✅ Post project works (NO claimedBy error)
- [ ] ✅ Contractor browse jobs works
- [ ] ✅ Dashboard metrics load and look consistent
- [ ] ✅ Affiliate page visible and accessible
- [ ] ✅ AI Renovation Inspector visible and works
- [ ] ✅ Help link works correctly (desktop→contact, mobile→phone)
- [ ] ✅ No raw technical errors shown to users
- [ ] ✅ Mobile: no widget overlap, clean layout
- [ ] ✅ Mobile: help button calls phone number

---

## If Any Test Fails

### Database Errors (claimedBy, displayName)
→ Migration didn't run or failed
→ Re-run Step 2, verify output
→ Check columns exist with verification query

### Metrics Look Wrong
→ Clear browser cache and reload
→ Check contractor has actual data (jobs, acceptances)
→ Verify API response at `/api/contractors/metrics?contractorId=xxx`

### Mobile Issues
→ Check responsive breakpoints in browser DevTools
→ Test on actual device (not just browser emulation)
→ Verify z-index layers aren't conflicting

### Feature Not Visible
→ Hard refresh browser (Ctrl+Shift+R)
→ Clear cache
→ Check Vercel deployment has latest commit

---

## Success Criteria

**Platform is production-ready when:**
1. ✅ All database migrations ran successfully
2. ✅ Homeowner can post project without errors
3. ✅ Contractor can browse and accept jobs
4. ✅ Metrics display accurate, differentiated values
5. ✅ All features are discoverable in UI
6. ✅ Mobile experience is clean (no overlaps)
7. ✅ Error messages are user-friendly
8. ✅ Support links work correctly

---

## Next Steps After Success

1. **Monitor for 24 hours**
   - Watch Vercel error logs
   - Check for Prisma/database errors
   - Monitor user complaints

2. **Scale Gradually**
   - Start with small traffic
   - Test under load
   - Watch OpenAI quota usage

3. **Track Metrics**
   - Homeowner conversion rate (estimate → post)
   - Contractor engagement (browse → accept)
   - Error rates
   - Mobile bounce rate

---

## Emergency Rollback Plan

If production breaks after migration:

1. **Columns are nullable** - no data is lost
2. **Can safely revert code**: `git revert 5d6b769`
3. **Keep database columns** - they don't hurt anything
4. **Contact support** if migration corrupted data (unlikely)

---

**⚠️ DO NOT PUSH TRAFFIC UNTIL ALL CHECKBOXES ABOVE ARE CHECKED ⚠️**

The biggest risk is still production DB not matching code. Migration is the gate.

---

**Prepared:** March 11, 2026  
**Commit:** 5d6b7693eaaa468ddbde85cada5e264dcb701be0  
**Status:** Awaiting production verification
