import assert from "node:assert/strict";
import { NextRequest } from "next/server";

let sessionUserId: string | null = null;
let sessionEmail = "visitor@example.test";
let articleStatus = "draft";
let articleTitle = "A Practical Ontario Home Renovation Planning Guide";
let articleSlug = "topic-slug";
let articleApprovedAt: Date | null = null;
let articleUpdateCount = 0;
let listCount = 0;
let generationCount = 0;
let listUnavailable = false;
let racedUpdate = false;
let lastListArgs:
  | { skip: number; take: number; where: { status?: string } }
  | undefined;
let lastWrite: { status?: string; approvedAt?: Date | null } | undefined;

const moduleConstructor = require("node:module").Module as new (
  id: string,
) => NodeModule;
function installModuleMock(
  specifier: string,
  exports: Record<string, unknown>,
) {
  const filename = require.resolve(specifier);
  const mockedModule = new moduleConstructor(filename);
  mockedModule.filename = filename;
  mockedModule.loaded = true;
  mockedModule.exports = exports;
  require.cache[filename] = mockedModule;
}

installModuleMock("@clerk/nextjs/server", {
  auth: async () => ({ userId: sessionUserId }),
});
const mockPrisma = {
  $queryRaw: async () => [],
  seoPublishingEvent: { create: async () => ({}) },
  seoPublishingSettings: {
    upsert: async () => ({ paused: false, autoPublish: false, weeklyLimit: 3 }),
    update: async () => ({}),
  },
  user: {
    findFirst: async () =>
      sessionUserId ? { id: "admin-db", email: sessionEmail } : null,
  },
  seoArticle: {
    findMany: async (
      args: NonNullable<typeof lastListArgs> & { where: { id?: unknown } },
    ) => {
      if (args.where.id) return [];
      if (listUnavailable)
        throw Object.assign(new Error("test storage unavailable"), {
          code: "P2021",
        });
      lastListArgs = args;
      listCount += 1;
      return [
        {
          id: "article-1",
          topicId: "whitby-kitchen-cabinet-replacement",
          title: "A Practical Ontario Home Renovation Planning Guide",
          slug: "topic-slug",
          excerpt: "An article excerpt for homeowner planning.",
          content: "Article content",
          category: "Kitchen",
          author: "QuoteXbert Editorial Team",
          tags: "[]",
          seoTitle: "Ontario Renovation Planning: Homeowner Guide",
          seoDescription:
            "A sufficiently descriptive meta description for the article.",
          affiliateProductIds: "[]",
          status: articleStatus,
          scheduledFor: null,
          approvedAt: null,
          publishedAt: null,
          generationError: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
    },
    groupBy: async () => [
      { status: "draft", _count: { _all: 127 } },
      { status: "published", _count: { _all: 2 } },
    ],
    findUnique: async () => ({
      id: "article-1",
      topicId: "whitby-kitchen-cabinet-replacement",
      status: articleStatus,
      updatedAt: new Date("2026-01-01"),
      title: articleTitle,
      slug: articleSlug,
      content: "Article content",
      approvedAt: articleApprovedAt,
    }),
    count: async () => 0,
    updateMany: async (args: {
      data: { status?: string; approvedAt?: Date | null };
    }) => {
      if (racedUpdate) return { count: 0 };
      lastWrite = args.data;
      articleUpdateCount += 1;
      if (args.data.status) articleStatus = args.data.status;
      if (args.data.approvedAt !== undefined)
        articleApprovedAt = args.data.approvedAt;
      return { count: 1 };
    },
  },
};
installModuleMock("@/lib/prisma", {
  prisma: {
    ...mockPrisma,
    $transaction: async (run: (tx: typeof mockPrisma) => Promise<unknown>) =>
      run(mockPrisma),
  },
});
installModuleMock("@/lib/seo/article-generation", {
  generateNextSeoDraft: async (options: { trigger: string }) => {
    assert.equal(options.trigger, "manual");
    generationCount += 1;
    return {
      kind: "created",
      article: { id: "private-draft", status: "draft" },
    };
  },
});

const listRoute = require("../app/api/admin/seo-articles/route") as {
  GET: (request: NextRequest) => Promise<Response>;
  POST: (request: NextRequest) => Promise<Response>;
};
const actionRoute =
  require("../app/api/admin/seo-articles/[id]/action/route") as {
    POST: (
      request: NextRequest,
      context: { params: { id: string } },
    ) => Promise<Response>;
  };

async function postAction(
  action: string,
  version = "2026-01-01T00:00:00.000Z",
) {
  return actionRoute.POST(
    new NextRequest(
      "http://localhost/api/admin/seo-articles/article-1/action",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ifUpdatedAt: version }),
      },
    ),
    { params: { id: "article-1" } },
  );
}

async function main() {
  const originalVercelEnv = process.env.VERCEL_ENV;
  const originalPreviewWrites = process.env.SEO_PREVIEW_WRITES_ENABLED;
  const originalManual = process.env.SEO_MANUAL_DRAFT_ENABLED;
  process.env.VERCEL_ENV = "preview";
  delete process.env.SEO_PREVIEW_WRITES_ENABLED;
  delete process.env.SEO_MANUAL_DRAFT_ENABLED;
  const listRequest = new NextRequest(
    "http://localhost/api/admin/seo-articles",
  );
  const denied = await listRoute.GET(listRequest);
  assert.equal(denied.status, 403);
  assert.equal(listCount, 0);

  sessionUserId = "clerk-visitor";
  sessionEmail = "visitor@example.test";
  assert.equal((await listRoute.GET(listRequest)).status, 403);
  assert.equal(listCount, 0);

  sessionUserId = "clerk-admin";
  sessionEmail = "brandsagaceo@gmail.com";
  const listed = await listRoute.GET(listRequest);
  assert.equal(listed.status, 200);
  assert.equal(listCount, 1);
  const listedData = await listed.json();
  assert.equal(listedData.summary.total, 129);
  assert.equal(listedData.pagination.pageCount, 6);
  assert.equal(listedData.capabilities.canEdit, false);
  assert.equal(listedData.capabilities.canGenerate, false);
  assert.equal(listedData.searchConsole.metricsConnected, false);
  listUnavailable = true;
  const unavailable = await listRoute.GET(listRequest);
  assert.equal(unavailable.status, 503);
  assert.match(
    (await unavailable.json()).error,
    /existing SeoArticle migration/,
  );
  listUnavailable = false;
  assert.equal((await postAction("approve")).status, 403);
  assert.equal(articleUpdateCount, 0);

  const filtered = await listRoute.GET(
    new NextRequest(
      "http://localhost/api/admin/seo-articles?page=2&status=draft",
    ),
  );
  assert.equal(filtered.status, 200);
  assert.equal(lastListArgs?.skip, 25);
  assert.equal(lastListArgs?.take, 25);
  assert.deepEqual(lastListArgs?.where, { status: "draft" });
  assert.equal(
    (
      await listRoute.GET(
        new NextRequest("http://localhost/api/admin/seo-articles?page=-1"),
      )
    ).status,
    400,
  );
  assert.equal(
    (
      await listRoute.GET(
        new NextRequest("http://localhost/api/admin/seo-articles?status=fake"),
      )
    ).status,
    400,
  );

  const generate = () =>
    listRoute.POST(
      new NextRequest("http://localhost/api/admin/seo-articles", {
        method: "POST",
        body: JSON.stringify({ action: "generate" }),
      }),
    );
  assert.equal((await generate()).status, 403);
  assert.equal(generationCount, 0);
  process.env.SEO_MANUAL_DRAFT_ENABLED = "true";
  assert.equal(
    (await generate()).status,
    403,
    "Manual flag cannot bypass preview isolation",
  );
  assert.equal(generationCount, 0);
  process.env.SEO_PREVIEW_WRITES_ENABLED = "true";
  const generated = await generate();
  assert.equal(generated.status, 201);
  assert.equal((await generated.json()).article.status, "draft");
  assert.equal(generationCount, 1);

  assert.equal((await postAction("publish")).status, 409);
  assert.equal(articleStatus, "draft");
  assert.equal(
    (await postAction("approve", "2025-01-01T00:00:00.000Z")).status,
    409,
  );
  assert.equal(articleStatus, "draft");
  assert.equal((await postAction("approve")).status, 200);
  assert.equal(articleStatus, "approved");
  racedUpdate = true;
  assert.equal((await postAction("reject")).status, 409);
  assert.equal(articleStatus, "approved");
  racedUpdate = false;

  const editRoute = require("../app/api/admin/seo-articles/[id]/route") as {
    PUT: (
      request: NextRequest,
      context: { params: { id: string } },
    ) => Promise<Response>;
  };
  const { APPROVED_SEO_TOPICS } = require("../lib/seo/topics") as {
    APPROVED_SEO_TOPICS: { id: string; internalLinks: string[] }[];
  };
  const topic = APPROVED_SEO_TOPICS.find(
    (item) => item.id === "whitby-kitchen-cabinet-replacement",
  );
  assert.ok(topic);
  const edits = {
    title: "A Practical Ontario Home Renovation Planning Guide",
    excerpt:
      "Learn how to plan your renovation scope and compare qualified local contractors before committing to a project.",
    content:
      Array.from(
        { length: 5 },
        (_, i) =>
          `## Planning step ${i}\n\n${"practical renovation planning ".repeat(55)}`,
      ).join("\n\n") + `\n[Plan your renovation](${topic.internalLinks[0]})`,
    seoTitle: "Ontario Renovation Planning: A Practical Homeowner Guide",
    seoDescription:
      "Plan an Ontario renovation with practical advice on scope, local quotes, material choices, timelines, and questions for qualified contractors.",
    tags: [],
    affiliateProductIds: [],
  };
  const staleSave = await editRoute.PUT(
    new NextRequest("http://localhost/api/admin/seo-articles/article-1", {
      method: "PUT",
      body: JSON.stringify({
        ...edits,
        ifUpdatedAt: "2025-01-01T00:00:00.000Z",
      }),
    }),
    { params: { id: "article-1" } },
  );
  assert.equal(staleSave.status, 409);
  assert.equal(articleStatus, "approved");
  articleTitle = "TEST ONLY: Private Renovation Draft";
  const removeTestLabel = await editRoute.PUT(
    new NextRequest("http://localhost/api/admin/seo-articles/article-1", {
      method: "PUT",
      body: JSON.stringify(edits),
    }),
    { params: { id: "article-1" } },
  );
  assert.equal(removeTestLabel.status, 409);
  assert.equal(articleStatus, "approved");
  articleTitle = "A Practical Ontario Home Renovation Planning Guide";
  const saved = await editRoute.PUT(
    new NextRequest("http://localhost/api/admin/seo-articles/article-1", {
      method: "PUT",
      body: JSON.stringify(edits),
    }),
    { params: { id: "article-1" } },
  );
  assert.equal(saved.status, 200);
  assert.equal(
    articleStatus,
    "draft",
    "Editing an approved article clears approval",
  );
  assert.equal(lastWrite?.approvedAt, null);
  assert.equal((await postAction("publish")).status, 409);
  assert.equal((await postAction("approve")).status, 200);

  process.env.VERCEL_ENV = "preview";
  assert.equal((await postAction("publish")).status, 403);
  assert.equal(articleStatus, "approved");

  process.env.VERCEL_ENV = "production";
  articleTitle = "TEST ONLY: Private Renovation Draft";
  assert.equal((await postAction("publish")).status, 409);
  assert.equal(articleStatus, "approved");
  articleTitle = "A Practical Ontario Home Renovation Planning Guide";
  articleSlug = "test-private-draft";
  assert.equal((await postAction("publish")).status, 409);
  assert.equal(articleStatus, "approved");
  articleSlug = "topic-slug";
  assert.equal((await postAction("publish")).status, 200);
  assert.equal(articleStatus, "published");
  assert.equal(articleUpdateCount, 4);
  articleStatus = "generating";
  assert.equal((await postAction("reject")).status, 409);
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;
  if (originalPreviewWrites === undefined)
    delete process.env.SEO_PREVIEW_WRITES_ENABLED;
  else process.env.SEO_PREVIEW_WRITES_ENABLED = originalPreviewWrites;
  if (originalManual === undefined) delete process.env.SEO_MANUAL_DRAFT_ENABLED;
  else process.env.SEO_MANUAL_DRAFT_ENABLED = originalManual;

  console.log("SEO admin authorization and approval workflow tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
