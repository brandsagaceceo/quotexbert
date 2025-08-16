-- CreateTable
CREATE TABLE "contractor_interests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contractorId" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_leads" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "postalCode" TEXT NOT NULL,
    "projectType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimate" TEXT NOT NULL,
    "source" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "affiliateId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "city" TEXT,
    "province" TEXT,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "claimedById" TEXT,
    "notesAdmin" TEXT,
    "tags" TEXT
);
INSERT INTO "new_leads" ("affiliateId", "createdAt", "description", "estimate", "id", "ip", "postalCode", "projectType", "source", "userAgent") SELECT "affiliateId", "createdAt", "description", "estimate", "id", "ip", "postalCode", "projectType", "source", "userAgent" FROM "leads";
DROP TABLE "leads";
ALTER TABLE "new_leads" RENAME TO "leads";
CREATE INDEX "leads_status_createdAt_idx" ON "leads"("status", "createdAt" DESC);
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "contractor_interests_contractorId_leadId_type_key" ON "contractor_interests"("contractorId", "leadId", "type");
