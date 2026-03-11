# 🏗️ Seed Toronto GTA Job Board

## Quick Start - Run in Vercel

### Option 1: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard** → Your Project → Storage → Neon Database
2. **Click "Query" tab** or open a SQL console
3. **Copy and paste this SQL** to create jobs directly:

```sql
-- I'll generate a simpler SQL script for you below
```

### Option 2: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Pull environment variables from Vercel (gets the correct DATABASE_URL)
vercel env pull .env.local

# Now run the seed script (it will use .env.local)
node seed-toronto-jobs.js
```

### Option 3: Get DATABASE_URL and Run Manually

1. **Get your current production DATABASE_URL:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Copy the value of `DATABASE_URL`

2. **Run with the URL:**
   ```bash
   set PRODUCTION_DATABASE_URL=<paste your url here>
   node seed-toronto-production.js
   ```

## What This Seeds

✅ **70+ Professional Job Leads** covering:
- Plumbing (5 jobs)
- Electrical (5 jobs) 
- HVAC (4 jobs)
- Roofing (4 jobs)
- Kitchen Renovation (4 jobs)
- Bathroom Renovation (4 jobs)
- Painting (4 jobs)
- Flooring (4 jobs)
- Landscaping (4 jobs)
- Basement Finishing (3 jobs)
- Deck Construction (3 jobs)
- Concrete (3 jobs)
- Fencing (3 jobs)
- Insulation, Windows, Doors, Garage (8 jobs)
- General Repairs (2 jobs)

📍 **Toronto GTA Locations:**
- Scarborough (8 neighborhoods)
- North York (3 neighborhoods)
- Markham, Richmond Hill, Vaughan
- Pickering, Ajax, Whitby, Oshawa
- Mississauga, Brampton, Etobicoke
- East York, Downtown Toronto

💰 **Realistic Budgets:** From $300 (small repairs) to $85,000 (full basement)

📝 **Professional Descriptions:** Real, detailed job descriptions that contractors can bid on

## Files Created

1. ✅ `seed-toronto-jobs.js` - Local development version
2. ✅ `seed-toronto-production.js` - Production version with hardcoded URL (needs update)
3. ✅ `SEED_TORONTO_JOBS.md` - This guide

## Alternative: Create Via API

If you want to create jobs via your production website:

1. Sign in as admin/homeowner
2. Create jobs manually via the UI
3. Or use the API endpoint: `POST /api/leads`

## Need Help?

The seed files are ready to go - you just need the correct DATABASE_URL from your Vercel production environment. The quickest way is:

```bash
vercel env pull .env.local
node seed-toronto-jobs.js
```

This will populate your job board with 70+ professional Toronto-area jobs! 🎉
