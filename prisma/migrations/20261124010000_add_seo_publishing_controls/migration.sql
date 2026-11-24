CREATE TABLE "seo_publishing_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "autoPublish" BOOLEAN NOT NULL DEFAULT false,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "weeklyLimit" INTEGER NOT NULL DEFAULT 3,
    "lastPublishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seo_publishing_settings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "seo_publishing_settings_weeklyLimit_check" CHECK ("weeklyLimit" BETWEEN 1 AND 3)
);

ALTER TABLE "seo_articles" ADD COLUMN "scheduleSource" TEXT;

CREATE TABLE "seo_publishing_events" (
    "id" TEXT NOT NULL,
    "articleId" TEXT,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "seo_publishing_events_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "seo_publishing_events_createdAt_idx" ON "seo_publishing_events"("createdAt");
CREATE INDEX "seo_publishing_events_articleId_createdAt_idx" ON "seo_publishing_events"("articleId", "createdAt");
