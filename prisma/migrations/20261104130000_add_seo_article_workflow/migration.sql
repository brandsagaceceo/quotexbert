CREATE TABLE "seo_articles" (
    "id" TEXT NOT NULL,
    "slotKey" TEXT,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL DEFAULT 'QuoteXbert Editorial Team',
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "seoTitle" TEXT NOT NULL,
    "seoDescription" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "affiliateProductIds" TEXT NOT NULL DEFAULT '[]',
    "sourceNotes" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledFor" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "generationError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "seo_articles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "seo_articles_slug_key" ON "seo_articles"("slug");
CREATE UNIQUE INDEX "seo_articles_slotKey_key" ON "seo_articles"("slotKey");
CREATE INDEX "seo_articles_status_scheduledFor_idx" ON "seo_articles"("status", "scheduledFor");
CREATE INDEX "seo_articles_topicId_status_idx" ON "seo_articles"("topicId", "status");
CREATE INDEX "seo_articles_createdAt_idx" ON "seo_articles"("createdAt");
