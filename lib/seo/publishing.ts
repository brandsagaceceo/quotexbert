import { Prisma, type SeoArticle } from "@prisma/client";
import { blogPostMetadata } from "@/app/blog/blog-metadata";
import { blogContent } from "@/app/blog/blog-content";
import { prisma } from "@/lib/prisma";
import {
  hasTestArticleLabel,
  parseGeneratedSeoArticle,
  parseSeoArticleEdits,
} from "@/lib/seo/article-validation";
import { APPROVED_SEO_TOPICS } from "@/lib/seo/topics";

const DAY = 24 * 60 * 60 * 1000;
const SETTINGS_ID = "default";

export class PublishingError extends Error {
  constructor(
    message: string,
    public readonly status = 409,
  ) {
    super(message);
  }
}

async function lock(tx: Prisma.TransactionClient) {
  await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(2180528371)`;
}

async function settings(tx: Prisma.TransactionClient) {
  return tx.seoPublishingSettings.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID },
    update: {},
  });
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function substantiallySimilar(a: string, b: string) {
  const shingles = (value: string) => {
    const words = normalize(value).split(" ");
    const result = new Set<string>();
    for (let i = 0; i + 5 <= words.length; i++) {
      result.add(words.slice(i, i + 5).join(" "));
    }
    return result;
  };
  const left = shingles(a);
  const right = shingles(b);
  if (!left.size || !right.size) return false;
  let shared = 0;
  for (const shingle of left) if (right.has(shingle)) shared++;
  return shared / Math.min(left.size, right.size) >= 0.8;
}

function stringArray(value: string): string[] | null {
  try {
    const data: unknown = JSON.parse(value);
    return Array.isArray(data) && data.every((item) => typeof item === "string")
      ? data
      : null;
  } catch {
    return null;
  }
}

function qualityError(article: SeoArticle): string | null {
  if (hasTestArticleLabel(article.title, article.slug))
    return "Test-labelled articles cannot be published";
  if (!article.approvedAt)
    return "Human review is required for unverified factual claims";
  const topic = APPROVED_SEO_TOPICS.find((item) => item.id === article.topicId);
  const tags = stringArray(article.tags);
  const sourceNotes = stringArray(article.sourceNotes);
  const affiliateProductIds = stringArray(article.affiliateProductIds);
  if (!topic || !tags || !sourceNotes || !affiliateProductIds)
    return "Article metadata or topic is invalid";
  if (
    !parseGeneratedSeoArticle(
      { ...article, tags, sourceNotes, affiliateProductIds },
      topic,
    )
  ) {
    return "Article does not pass publishing quality checks";
  }
  if (!parseSeoArticleEdits({ ...article, tags, affiliateProductIds }, topic)) {
    return "Article links or affiliate disclosures are invalid";
  }
  const withoutLinks = article.content.replace(/\[[^\]]+\]\([^)]+\)/g, "");
  if (/<|>|https?:\/\/|www\.|\]\[|^\s*\[[^\]]+\]:/im.test(withoutLinks)) {
    return "Unverified HTML or links require manual review";
  }
  return null;
}

async function duplicateError(
  tx: Prisma.TransactionClient,
  article: SeoArticle,
) {
  const others = await tx.seoArticle.findMany({
    where: {
      id: { not: article.id },
      status: { in: ["published", "scheduled"] },
    },
    select: { title: true, slug: true, content: true, topicId: true },
  });
  const title = normalize(article.title);
  const content = normalize(article.content);
  const duplicate = others.some(
    (other) =>
      other.slug === article.slug ||
      other.topicId === article.topicId ||
      normalize(other.title) === title ||
      (content.length > 0 &&
        (normalize(other.content) === content ||
          substantiallySimilar(article.content, other.content))),
  );
  const staticDuplicate =
    Object.keys(blogPostMetadata).includes(article.slug) ||
    Object.values(blogPostMetadata).some(
      (item) => normalize(item.title) === title,
    ) ||
    Object.values(blogContent).some((body) =>
      substantiallySimilar(article.content, body.replace(/<[^>]*>/g, " ")),
    );
  return duplicate || staticDuplicate
    ? "Duplicate article requires manual review"
    : null;
}

export async function readPublishingDashboard(eventPage = 1) {
  const [config, scheduled, events, eventCount] = await Promise.all([
    prisma.seoPublishingSettings.findUnique({ where: { id: SETTINGS_ID } }),
    prisma.seoArticle.findMany({
      where: { status: "scheduled" },
      orderBy: [{ scheduledFor: "asc" }, { id: "asc" }],
      select: { id: true, title: true, scheduledFor: true },
      take: 10,
    }),
    prisma.seoPublishingEvent.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (eventPage - 1) * 20,
      take: 20,
      select: {
        id: true,
        action: true,
        detail: true,
        articleId: true,
        actorId: true,
        createdAt: true,
      },
    }),
    prisma.seoPublishingEvent.count(),
  ]);
  return {
    autoPublish: config?.autoPublish ?? false,
    paused: config?.paused ?? false,
    weeklyLimit: config?.weeklyLimit ?? 3,
    scheduled,
    events,
    eventPage,
    eventPageCount: Math.max(1, Math.ceil(eventCount / 20)),
  };
}

export async function setPublishingControl(
  actorId: string,
  control: "autoPublish" | "paused",
  enabled: boolean,
) {
  if (
    control === "autoPublish" &&
    enabled &&
    process.env.VERCEL_ENV === "production" &&
    process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED !== "true"
  ) {
    throw new PublishingError(
      "Automatic publishing is not authorized in production",
      403,
    );
  }
  return prisma.$transaction(async (tx) => {
    await lock(tx);
    const current = await settings(tx);
    const now = new Date();
    if (control === "paused" && current.paused && !enabled) {
      const missed = await tx.seoArticle.findMany({
        where: { status: "scheduled", scheduledFor: { lte: now } },
        orderBy: [{ scheduledFor: "asc" }, { id: "asc" }],
        select: { id: true },
      });
      for (const [i, article] of missed.entries()) {
        const scheduledFor = new Date(now.getTime() + (i + 1) * DAY);
        await tx.seoArticle.update({
          where: { id: article.id },
          data: { scheduledFor },
        });
        await tx.seoPublishingEvent.create({
          data: {
            actorId,
            articleId: article.id,
            action: "rescheduled_after_pause",
            detail: scheduledFor.toISOString(),
          },
        });
      }
    }
    const result = await tx.seoPublishingSettings.update({
      where: { id: SETTINGS_ID },
      data: { [control]: enabled },
    });
    await tx.seoPublishingEvent.create({
      data: { actorId, action: control, detail: enabled ? "on" : "off" },
    });
    return result;
  });
}

export async function scheduleArticle(
  id: string,
  actorId: string,
  when: Date,
  expectedVersion?: Date,
) {
  if (!Number.isFinite(when.getTime()) || when.getTime() <= Date.now()) {
    throw new PublishingError("Choose a future publication time", 400);
  }
  return prisma.$transaction(async (tx) => {
    await lock(tx);
    const article = await tx.seoArticle.findUnique({ where: { id } });
    if (!article) throw new PublishingError("Article not found", 404);
    if (
      expectedVersion &&
      article.updatedAt.getTime() !== expectedVersion.getTime()
    )
      throw new PublishingError("Article changed; refresh and review it");
    if (article.status !== "approved" || !article.approvedAt) {
      throw new PublishingError("Only approved articles can be scheduled");
    }
    if (hasTestArticleLabel(article.title, article.slug)) {
      throw new PublishingError("Test-labelled articles cannot be scheduled");
    }
    const changed = await tx.seoArticle.updateMany({
      where: { id, status: article.status, updatedAt: article.updatedAt },
      data: {
        status: "scheduled",
        scheduledFor: when,
        scheduleSource: "manual",
      },
    });
    if (changed.count !== 1)
      throw new PublishingError("Article changed; refresh and review it");
    await tx.seoPublishingEvent.create({
      data: {
        actorId,
        articleId: id,
        action: "scheduled",
        detail: when.toISOString(),
      },
    });
  });
}

export async function cancelScheduledArticle(
  id: string,
  actorId: string,
  expectedVersion?: Date,
) {
  return prisma.$transaction(async (tx) => {
    await lock(tx);
    const updated = await tx.seoArticle.updateMany({
      where: {
        id,
        status: "scheduled",
        ...(expectedVersion ? { updatedAt: expectedVersion } : {}),
      },
      data: { status: "approved", scheduledFor: null, scheduleSource: null },
    });
    if (updated.count !== 1)
      throw new PublishingError("Article is not scheduled");
    await tx.seoPublishingEvent.create({
      data: { actorId, articleId: id, action: "cancelled" },
    });
  });
}

async function publishInTransaction(
  tx: Prisma.TransactionClient,
  article: SeoArticle,
  actorId: string | null,
  now: Date,
  automatic: boolean,
) {
  const config = await settings(tx);
  if (config.paused) throw new PublishingError("Publishing is paused");
  if (automatic && !config.autoPublish)
    throw new PublishingError("Automatic publishing is off");
  if (
    !["approved", "scheduled"].includes(article.status) ||
    !article.approvedAt
  ) {
    throw new PublishingError(
      "Only approved or scheduled articles can be published",
    );
  }
  if (hasTestArticleLabel(article.title, article.slug)) {
    throw new PublishingError("Test-labelled articles cannot be published");
  }
  if (process.env.VERCEL_ENV !== "production") {
    throw new PublishingError(
      "Public publishing is disabled outside production",
      403,
    );
  }
  if (
    automatic &&
    process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED !== "true"
  ) {
    throw new PublishingError(
      "Automatic publishing is not authorized in production",
      403,
    );
  }
  const error =
    (automatic ? qualityError(article) : null) ||
    (await duplicateError(tx, article));
  if (error) throw new PublishingError(error);
  const count = await tx.seoArticle.count({
    where: {
      status: "published",
      publishedAt: { gt: new Date(now.getTime() - 7 * DAY), lte: now },
    },
  });
  if (count >= config.weeklyLimit)
    throw new PublishingError("Rolling seven-day publishing limit reached");
  const changed = await tx.seoArticle.updateMany({
    where: {
      id: article.id,
      status: article.status,
      updatedAt: article.updatedAt,
    },
    data: {
      status: "published",
      publishedAt: now,
      scheduledFor: null,
      scheduleSource: null,
    },
  });
  if (changed.count !== 1)
    throw new PublishingError("Article changed; refresh and review it");
  await tx.seoPublishingSettings.update({
    where: { id: SETTINGS_ID },
    data: { lastPublishedAt: now },
  });
  await tx.seoPublishingEvent.create({
    data: {
      actorId,
      articleId: article.id,
      action: automatic ? "automatically_published" : "published",
    },
  });
}

export async function publishArticle(
  id: string,
  actorId: string,
  expectedVersion?: Date,
) {
  return prisma.$transaction(async (tx) => {
    await lock(tx);
    const article = await tx.seoArticle.findUnique({ where: { id } });
    if (!article) throw new PublishingError("Article not found", 404);
    if (
      expectedVersion &&
      article.updatedAt.getTime() !== expectedVersion.getTime()
    )
      throw new PublishingError("Article changed; refresh and review it");
    await publishInTransaction(tx, article, actorId, new Date(), false);
  });
}

export async function runPublishingCron() {
  return prisma.$transaction(async (tx) => {
    await lock(tx);
    const config = await settings(tx);
    if (config.paused) return { skipped: "Publishing is paused" };
    if (process.env.VERCEL_ENV !== "production")
      return { skipped: "Preview cannot publish" };
    const now = new Date();
    const due = await tx.seoArticle.findFirst({
      where: {
        status: "scheduled",
        scheduledFor: { lte: now },
        ...(config.autoPublish &&
        process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED === "true"
          ? {}
          : { scheduleSource: "manual" }),
      },
      orderBy: [{ scheduledFor: "asc" }, { id: "asc" }],
    });
    const mostRecent = await tx.seoArticle.findFirst({
      where: { status: "published", publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: { publishedAt: true },
    });
    if (
      due &&
      mostRecent?.publishedAt &&
      mostRecent.publishedAt.getTime() > now.getTime() - DAY
    ) {
      return {
        skipped: "Scheduled publications are spaced at least one day apart",
      };
    }
    if (due) {
      try {
        await publishInTransaction(
          tx,
          due,
          null,
          now,
          due.scheduleSource === "auto",
        );
      } catch (error) {
        if (!(error instanceof PublishingError)) throw error;
        if (error.message !== "Rolling seven-day publishing limit reached") {
          await tx.seoArticle.updateMany({
            where: {
              id: due.id,
              status: "scheduled",
              updatedAt: due.updatedAt,
            },
            data: {
              status: "failed",
              generationError: error.message,
              scheduledFor: null,
              scheduleSource: null,
              approvedAt: null,
            },
          });
        }
        await tx.seoPublishingEvent.create({
          data: {
            articleId: due.id,
            action: "publication_blocked",
            detail: error.message,
          },
        });
        return { skipped: error.message };
      }
    }
    if (
      config.autoPublish &&
      process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED === "true"
    ) {
      const candidates = await tx.seoArticle.findMany({
        where: { status: "approved", approvedAt: { not: null } },
        orderBy: [{ approvedAt: "asc" }, { id: "asc" }],
        take: 25,
      });
      for (const candidate of candidates) {
        const error =
          qualityError(candidate) || (await duplicateError(tx, candidate));
        if (error) {
          if (!hasTestArticleLabel(candidate.title, candidate.slug)) {
            const failed = await tx.seoArticle.updateMany({
              where: {
                id: candidate.id,
                status: "approved",
                updatedAt: candidate.updatedAt,
              },
              data: {
                status: "draft",
                approvedAt: null,
                generationError: error,
              },
            });
            if (failed.count === 1) {
              await tx.seoPublishingEvent.create({
                data: {
                  articleId: candidate.id,
                  action: "manual_review_required",
                  detail: error,
                },
              });
            }
          }
          continue;
        }
        const scheduled = await tx.seoArticle.updateMany({
          where: {
            id: candidate.id,
            status: "approved",
            updatedAt: candidate.updatedAt,
          },
          data: {
            status: "scheduled",
            scheduledFor: new Date(now.getTime() + DAY),
            scheduleSource: "auto",
          },
        });
        if (scheduled.count !== 1) continue;
        await tx.seoPublishingEvent.create({
          data: { articleId: candidate.id, action: "automatically_scheduled" },
        });
        break;
      }
    }
    return due
      ? { published: due.id }
      : { skipped: "No scheduled articles due" };
  });
}
