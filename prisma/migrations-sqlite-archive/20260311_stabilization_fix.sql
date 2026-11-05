-- Stabilization Migration - March 11, 2026
-- Run this in production database to ensure all fields exist

-- Ensure displayName column exists in users table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'displayName'
    ) THEN
        ALTER TABLE users ADD COLUMN "displayName" TEXT;
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
    END IF;
END $$;

-- Success message
SELECT 'Migration completed successfully' AS status;
