-- Phase 4 — Quote Versioning
-- Apply to production database to add versioning fields to quotes table.
-- Safe: all changes are additive (new nullable columns / columns with defaults).

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'quotes' AND column_name = 'version'
    ) THEN
        ALTER TABLE quotes ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'quotes' AND column_name = 'parentQuoteId'
    ) THEN
        ALTER TABLE quotes ADD COLUMN "parentQuoteId" TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'quotes' AND column_name = 'revisionNote'
    ) THEN
        ALTER TABLE quotes ADD COLUMN "revisionNote" TEXT;
    END IF;
END $$;
