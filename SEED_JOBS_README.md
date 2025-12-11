# How to Seed Realistic Jobs

## Overview
The `seed-realistic-jobs.js` script creates 60+ realistic jobs across all categories with:
- Real images from Unsplash
- Detailed descriptions
- Toronto neighborhoods and postal codes
- Realistic budgets and timelines
- Various urgency levels

## Categories Included
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

## To Run the Script

1. **Make sure your DATABASE_URL is properly set in .env.local**
   - It should start with `postgresql://` or `postgres://`
   - Remove any trailing `\r\n` characters

2. **Run the script:**
   ```bash
   node seed-realistic-jobs.js
   ```

3. **The script will:**
   - Create 5 sample homeowners (if none exist)
   - Create 60+ realistic jobs with images
   - Randomly assign jobs to neighborhoods in Toronto
   - Set realistic statuses (80% published, 15% pending, 5% closed)

## What's Included

Each job has:
- ✅ Realistic title and detailed description
- ✅ Category-specific content
- ✅ Budget ranges ($300 - $65,000)
- ✅ Toronto neighborhood locations
- ✅ Real postal codes
- ✅ Timeline and urgency information
- ✅ Professional images from Unsplash
- ✅ Relevant tags

## Example Jobs

- "Emergency Kitchen Sink Leak Repair" - $300-$800
- "Complete Kitchen Renovation" - $35,000-$55,000
- "Full Home Electrical Panel Upgrade" - $3,000-$6,000
- "Master Bathroom Complete Renovation" - $25,000-$40,000
- "Composite Deck Construction" - $15,000-$25,000
- And 55+ more!

## Note
If you encounter database connection errors, ensure your `.env.local` file has a properly formatted DATABASE_URL without any line breaks or special characters at the end.
