-- Add comp subscription override fields to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pro_override_enabled" BOOLEAN DEFAULT FALSE;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pro_override_tier" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pro_override_expires_at" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "pro_override_reason" TEXT;

-- Add affiliate tracking to User
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "referredByAffiliateId" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "affiliateReferralLockedAt" TIMESTAMP(3);

-- Create Affiliate table
CREATE TABLE IF NOT EXISTS "Affiliate" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "userId" TEXT,
  "name" TEXT,
  "email" TEXT,
  "status" TEXT NOT NULL DEFAULT 'active',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL
);

-- Create AffiliateCommission table
CREATE TABLE IF NOT EXISTS "AffiliateCommission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "affiliateId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "stripeInvoiceId" TEXT NOT NULL UNIQUE,
  "amount" DECIMAL(10,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'unpaid',
  "paidAt" TIMESTAMP(3),
  "paidVia" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "AffiliateCommission_affiliateId_idx" ON "AffiliateCommission"("affiliateId");
CREATE INDEX IF NOT EXISTS "AffiliateCommission_status_idx" ON "AffiliateCommission"("status");
CREATE INDEX IF NOT EXISTS "AffiliateCommission_stripeInvoiceId_idx" ON "AffiliateCommission"("stripeInvoiceId");

-- Insert BRANDSAGA affiliate code
INSERT INTO "Affiliate" ("id", "code", "name", "email", "status", "createdAt", "updatedAt")
VALUES (
  'aff_brandsaga_' || substr(md5(random()::text), 1, 8),
  'BRANDSAGA',
  'BrandSaga Marketing',
  'brandsagaceo@gmail.com',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("code") DO NOTHING;
