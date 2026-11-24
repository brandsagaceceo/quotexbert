import assert from "node:assert/strict";

type Article = {
  id: string;
  title: string;
  slug: string;
  topicId: string;
  status: string;
  approvedAt: Date | null;
  updatedAt: Date;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  scheduleSource: string | null;
  content: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  tags: string;
  sourceNotes: string;
  affiliateProductIds: string;
  generationError: string | null;
};

const config = {
  paused: false,
  autoPublish: false,
  weeklyLimit: 3,
  lastPublishedAt: null as Date | null,
};
const articles: Article[] = [];
const events: Array<{ action: string; detail?: string }> = [];
const tx = {
  $queryRaw: async () => [],
  seoPublishingSettings: {
    upsert: async () => config,
    findUnique: async () => config,
    update: async ({ data }: { data: Partial<typeof config> }) =>
      Object.assign(config, data),
  },
  seoPublishingEvent: {
    create: async ({ data }: { data: { action: string; detail?: string } }) => {
      events.push(data);
      return data;
    },
    findMany: async () => events,
    count: async () => events.length,
  },
  seoArticle: {
    findUnique: async ({ where }: { where: { id: string } }) =>
      articles.find((a) => a.id === where.id) ?? null,
    findMany: async ({
      where,
    }: {
      where: {
        status?: string | { in: string[] };
        id?: { not: string };
        approvedAt?: unknown;
        scheduledFor?: { lte: Date };
      };
    }) => {
      return articles.filter((a) => {
        if (typeof where.status === "string" && a.status !== where.status)
          return false;
        if (
          typeof where.status === "object" &&
          !where.status.in.includes(a.status)
        )
          return false;
        if (where.id && a.id === where.id.not) return false;
        if (where.approvedAt && !a.approvedAt) return false;
        if (
          where.scheduledFor &&
          (!a.scheduledFor || a.scheduledFor > where.scheduledFor.lte)
        )
          return false;
        return true;
      });
    },
    findFirst: async ({
      where,
    }: {
      where: {
        status: string;
        scheduledFor?: { lte: Date };
        scheduleSource?: string;
      };
    }) => {
      return (
        articles
          .filter(
            (a) =>
              a.status === where.status &&
              (!where.scheduledFor ||
                (a.scheduledFor && a.scheduledFor <= where.scheduledFor.lte)) &&
              (!where.scheduleSource ||
                a.scheduleSource === where.scheduleSource),
          )
          .sort(
            (a, b) =>
              (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0),
          )[0] ?? null
      );
    },
    count: async ({
      where,
    }: {
      where: { publishedAt: { gt: Date; lte: Date } };
    }) =>
      articles.filter(
        (a) =>
          a.status === "published" &&
          a.publishedAt &&
          a.publishedAt > where.publishedAt.gt &&
          a.publishedAt <= where.publishedAt.lte,
      ).length,
    updateMany: async ({
      where,
      data,
    }: {
      where: { id: string; status: string; updatedAt?: Date };
      data: Partial<Article>;
    }) => {
      const article = articles.find(
        (a) =>
          a.id === where.id &&
          a.status === where.status &&
          (!where.updatedAt ||
            a.updatedAt.getTime() === where.updatedAt.getTime()),
      );
      if (!article) return { count: 0 };
      Object.assign(article, data, {
        updatedAt: new Date(article.updatedAt.getTime() + 1),
      });
      return { count: 1 };
    },
    update: async ({
      where,
      data,
    }: {
      where: { id: string };
      data: Partial<Article>;
    }) => {
      const article = articles.find((a) => a.id === where.id);
      assert.ok(article);
      Object.assign(article, data, {
        updatedAt: new Date(article.updatedAt.getTime() + 1),
      });
      return article;
    },
  },
};

let queue = Promise.resolve();
const prisma = {
  ...tx,
  $transaction: async <T>(
    run: (client: typeof tx) => Promise<T>,
  ): Promise<T> => {
    const previous = queue;
    let release!: () => void;
    queue = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    try {
      return await run(tx);
    } finally {
      release();
    }
  },
};
const Module = require("node:module").Module as new (id: string) => NodeModule;
const path = require.resolve("@/lib/prisma");
const mocked = new Module(path);
mocked.filename = path;
mocked.loaded = true;
mocked.exports = { prisma };
require.cache[path] = mocked;

const publishing =
  require("../lib/seo/publishing") as typeof import("../lib/seo/publishing");
const { APPROVED_SEO_TOPICS } =
  require("../lib/seo/topics") as typeof import("../lib/seo/topics");

function article(id: string, index: number, status = "approved"): Article {
  const topic = APPROVED_SEO_TOPICS[index];
  assert.ok(topic);
  return {
    id,
    title: `A Detailed Homeowner Guide For Renovation Project Number ${index}`,
    slug: `private-article-${index}`,
    topicId: topic.id,
    status,
    approvedAt: status === "approved" ? new Date() : null,
    updatedAt: new Date(),
    publishedAt: null,
    scheduledFor: null,
    scheduleSource: null,
    content: Array.from(
      { length: 5 },
      (_, i) =>
        `## Planning section ${i}\n\n${`distinctive${index} practical${i} decisions help homeowners plan carefully. `.repeat(32)}`,
    ).join("\n\n"),
    excerpt:
      "This practical guide helps homeowners plan their renovation carefully and compare local contractor options.",
    seoTitle: `Detailed Renovation Planning Guide Number ${index}`,
    seoDescription:
      "Learn practical steps for planning a renovation, comparing contractors, and preparing for a successful homeowner project.",
    tags: "[]",
    sourceNotes: "[]",
    affiliateProductIds: "[]",
    generationError: null,
  };
}

async function main() {
  process.env.VERCEL_ENV = "preview";
  assert.equal((await publishing.readPublishingDashboard()).autoPublish, false);
  const test = article("test", 0);
  test.title = "TEST ONLY: Private Renovation Draft";
  articles.push(test);
  await assert.rejects(
    () =>
      publishing.scheduleArticle(
        test.id,
        "admin",
        new Date(Date.now() + 86400000),
      ),
    /Test-labelled/,
  );
  await assert.rejects(
    () => publishing.publishArticle(test.id, "admin"),
    /Test-labelled/,
  );
  assert.equal(test.status, "approved");

  const planned = article("planned", 1);
  articles.push(planned);
  await publishing.scheduleArticle(
    planned.id,
    "admin",
    new Date(Date.now() + 86400000),
  );
  assert.equal(planned.status, "scheduled");
  await publishing.cancelScheduledArticle(planned.id, "admin");
  assert.equal(planned.status, "approved");
  await publishing.scheduleArticle(
    planned.id,
    "admin",
    new Date(Date.now() + 86400000),
  );
  planned.scheduledFor = new Date(Date.now() - 1000);
  await publishing.setPublishingControl("admin", "paused", true);
  await assert.rejects(
    () => publishing.publishArticle(planned.id, "admin"),
    /paused/,
  );
  assert.deepEqual(await publishing.runPublishingCron(), {
    skipped: "Publishing is paused",
  });
  assert.equal(planned.status, "scheduled");
  await publishing.setPublishingControl("admin", "paused", false);
  assert.ok(planned.scheduledFor && planned.scheduledFor > new Date());
  assert.equal(planned.status, "scheduled");
  await publishing.cancelScheduledArticle(planned.id, "admin");

  const unsafe = article("unsafe", 6);
  unsafe.content += "\n\n[External source](https://example.test/)";
  const unreviewed = article("unreviewed", 7, "draft");
  articles.unshift(unsafe, unreviewed);
  process.env.VERCEL_ENV = "production";
  process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED = "true";
  await publishing.runPublishingCron();
  assert.equal(
    planned.status,
    "approved",
    "Auto OFF does not schedule approved articles",
  );
  process.env.VERCEL_ENV = "preview";
  await publishing.setPublishingControl("admin", "autoPublish", true);
  assert.deepEqual(await publishing.runPublishingCron(), {
    skipped: "Preview cannot publish",
  });
  assert.equal(planned.status, "approved");
  process.env.VERCEL_ENV = "production";
  process.env.SEO_AUTO_PUBLISH_PRODUCTION_AUTHORIZED = "true";
  await publishing.runPublishingCron();
  assert.equal(planned.status, "scheduled");
  assert.equal(planned.scheduleSource, "auto");
  assert.equal(
    unsafe.status,
    "draft",
    "Invalid links return an article to review",
  );
  assert.equal(
    unreviewed.status,
    "draft",
    "Unverified drafts are never auto scheduled",
  );
  assert.ok(events.some((e) => e.action === "manual_review_required"));
  planned.scheduledFor = new Date(Date.now() - 1000);
  await publishing.runPublishingCron();
  assert.equal(planned.status, "published");
  await publishing.runPublishingCron();
  assert.equal(
    events.filter((e) => e.action === "automatically_published").length,
    1,
  );

  const duplicate = article("duplicate", 5);
  duplicate.content = planned.content;
  articles.push(duplicate);
  await assert.rejects(
    () => publishing.publishArticle(duplicate.id, "admin"),
    /Duplicate/,
  );
  assert.equal(duplicate.status, "approved");

  const extra = [article("a", 2), article("b", 3), article("c", 4)];
  articles.push(...extra);
  const attempts = await Promise.allSettled(
    extra.map((a) => publishing.publishArticle(a.id, "admin")),
  );
  assert.equal(attempts.filter((a) => a.status === "fulfilled").length, 2);
  assert.equal(articles.filter((a) => a.status === "published").length, 3);
  assert.equal(attempts.filter((a) => a.status === "rejected").length, 1);
  assert.ok(events.some((e) => e.action === "rescheduled_after_pause"));
  console.log("SEO publishing safeguards and simulated scheduler tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
