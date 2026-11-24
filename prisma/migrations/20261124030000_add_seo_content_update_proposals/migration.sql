CREATE TABLE "seo_content_update_proposals" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "baseUpdatedAt" TIMESTAMP(3) NOT NULL,
    "proposedData" JSONB NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "proposedBy" TEXT NOT NULL,
    "reviewedBy" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_content_update_proposals_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "seo_content_update_proposals_articleId_status_createdAt_idx"
ON "seo_content_update_proposals"("articleId", "status", "createdAt");

CREATE INDEX "seo_content_update_proposals_status_createdAt_idx"
ON "seo_content_update_proposals"("status", "createdAt");
