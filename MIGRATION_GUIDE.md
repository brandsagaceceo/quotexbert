# Production Migration Guide

## Database Schema Fixes

The platform schema already includes all necessary fields:
- `users.displayName` (line 18 in schema.prisma)
- `leads.claimedBy` (line 134 in schema.prisma)

If you're experiencing runtime errors about missing columns, run this migration in production:

```bash
# Connect to production database
psql $DATABASE_URL

# Run the migration
\i prisma/migrations/20260311_stabilization_fix.sql
```

Or if using Vercel Postgres:
1. Go to Vercel Dashboard → Storage → Your Database
2. Click "Query" tab
3. Paste and run the contents of `prisma/migrations/20260311_stabilization_fix.sql`

## Migration Safety

The migration uses `DO $$ BEGIN ... END $$` blocks to check if columns exist before adding them. This means:
- ✅ Safe to run multiple times
- ✅ Won't fail if columns already exist
- ✅ No data loss
- ✅ No downtime required

## After Migration

Run Prisma generate to update the client:
```bash
npx prisma generate
```

Then restart your application.
