import assert from "node:assert/strict";
import { NextRequest } from "next/server";

let sessionUserId: string | null = null;
let sessionEmail = "visitor@example.test";
let articleStatus = "draft";
let articleUpdateCount = 0;
let listCount = 0;

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
installModuleMock("@/lib/prisma", {
  prisma: {
    user: {
      findFirst: async () =>
        sessionUserId ? { id: "admin-db", email: sessionEmail } : null,
    },
    seoArticle: {
      findMany: async () => {
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
      findUnique: async () => ({
        id: "article-1",
        status: articleStatus,
      }),
      update: async (args: { data: { status?: string } }) => {
        articleUpdateCount += 1;
        if (args.data.status) articleStatus = args.data.status;
        return { id: "article-1" };
      },
    },
  },
});

const listRoute = require("../app/api/admin/seo-articles/route") as {
  GET: () => Promise<Response>;
};
const actionRoute =
  require("../app/api/admin/seo-articles/[id]/action/route") as {
    POST: (
      request: NextRequest,
      context: { params: { id: string } },
    ) => Promise<Response>;
  };

async function postAction(action: string) {
  return actionRoute.POST(
    new NextRequest(
      "http://localhost/api/admin/seo-articles/article-1/action",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      },
    ),
    { params: { id: "article-1" } },
  );
}

async function main() {
  const originalVercelEnv = process.env.VERCEL_ENV;
  const denied = await listRoute.GET();
  assert.equal(denied.status, 403);
  assert.equal(listCount, 0);

  sessionUserId = "clerk-visitor";
  sessionEmail = "visitor@example.test";
  assert.equal((await listRoute.GET()).status, 403);
  assert.equal(listCount, 0);

  sessionUserId = "clerk-admin";
  sessionEmail = "brandsagaceo@gmail.com";
  const listed = await listRoute.GET();
  assert.equal(listed.status, 200);
  assert.equal(listCount, 1);

  assert.equal((await postAction("publish")).status, 409);
  assert.equal(articleStatus, "draft");
  assert.equal((await postAction("approve")).status, 200);
  assert.equal(articleStatus, "approved");

  process.env.VERCEL_ENV = "preview";
  assert.equal((await postAction("publish")).status, 403);
  assert.equal(articleStatus, "approved");

  process.env.VERCEL_ENV = "production";
  assert.equal((await postAction("publish")).status, 200);
  assert.equal(articleStatus, "published");
  assert.equal(articleUpdateCount, 2);
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;

  console.log("SEO admin authorization and approval workflow tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
