import assert from "node:assert/strict";
import { NextRequest } from "next/server";

const baseUpdatedAt = new Date("2026-11-20T12:00:00.000Z");
let articleUpdatedAt = baseUpdatedAt;
let liveTitle = "Original Published Renovation Guide";
let proposal:
  | {
      id: string;
      articleId: string;
      baseUpdatedAt: Date;
      proposedData: Record<string, unknown>;
      status: string;
    }
  | undefined;
let liveUpdateCount = 0;

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
  auth: async () => ({ userId: "clerk-admin" }),
});

const article = () => ({
  id: "published-1",
  topicId: "whitby-kitchen-cabinet-replacement",
  status: "published",
  updatedAt: articleUpdatedAt,
  title: liveTitle,
  slug: "published-renovation-guide",
  excerpt:
    "This practical guide helps Ontario homeowners plan a renovation carefully.",
  content: "Original published content.",
  seoTitle: "Original Published Ontario Renovation Guide",
  seoDescription:
    "A practical Ontario homeowner guide to planning a renovation project carefully.",
  tags: "[]",
  affiliateProductIds: "[]",
});

const mockPrisma = {
  $queryRaw: async () => [],
  user: {
    findFirst: async () => ({
      id: "admin-db",
      email: "brandsagaceo@gmail.com",
    }),
  },
  seoArticle: {
    findUnique: async () => article(),
    updateMany: async (args: {
      where: { updatedAt: Date };
      data: { title?: string };
    }) => {
      if (args.where.updatedAt.getTime() !== articleUpdatedAt.getTime())
        return { count: 0 };
      liveUpdateCount += 1;
      if (args.data.title) liveTitle = args.data.title;
      articleUpdatedAt = new Date(articleUpdatedAt.getTime() + 1000);
      return { count: 1 };
    },
  },
  seoContentUpdateProposal: {
    updateMany: async () => ({ count: 0 }),
    create: async (args: {
      data: {
        articleId: string;
        baseUpdatedAt: Date;
        proposedData: Record<string, unknown>;
      };
    }) => {
      proposal = {
        id: "proposal-1",
        ...args.data,
        status: "pending",
      };
      return proposal;
    },
    findUnique: async () => proposal || null,
    update: async (args: { data: { status: string } }) => {
      assert.ok(proposal);
      proposal.status = args.data.status;
      return proposal;
    },
  },
  seoPublishingEvent: { create: async () => ({}) },
  seoPublishingSettings: {
    upsert: async () => ({ paused: false, autoPublish: false, weeklyLimit: 3 }),
    update: async () => ({}),
  },
};

installModuleMock("@/lib/prisma", {
  prisma: {
    ...mockPrisma,
    $transaction: async (run: (tx: typeof mockPrisma) => Promise<unknown>) =>
      run(mockPrisma),
  },
});

const updateRoute = require("../app/api/admin/seo-articles/[id]/route") as {
  PUT: (
    request: NextRequest,
    context: { params: { id: string } },
  ) => Promise<Response>;
};
const actionRoute =
  require("../app/api/admin/seo-articles/[id]/action/route") as {
    POST: (
      request: NextRequest,
      context: { params: { id: string } },
    ) => Promise<Response>;
  };

const proposedTitle = "Updated Published Ontario Renovation Planning Guide";
const proposedData = {
  title: proposedTitle,
  excerpt:
    "This updated practical guide helps Ontario homeowners plan renovations carefully.",
  content: Array.from(
    { length: 4 },
    (_, index) =>
      `## Updated planning section ${index + 1}\n\n${"Ontario homeowners can review project scope, priorities, documentation, timing, and contractor questions before making careful renovation decisions. ".repeat(28)}`,
  ).join("\n\n"),
  seoTitle: "Updated Ontario Renovation Planning Guide for Homeowners",
  seoDescription:
    "Updated practical guidance for Ontario homeowners planning a renovation project, reviewing priorities, and preparing careful contractor questions.",
  tags: ["ontario renovation planning"],
  affiliateProductIds: [],
  ifUpdatedAt: baseUpdatedAt.toISOString(),
};

async function main() {
  const originalEnv = process.env.VERCEL_ENV;
  const originalWrites = process.env.SEO_PREVIEW_WRITES_ENABLED;
  process.env.VERCEL_ENV = "preview";
  process.env.SEO_PREVIEW_WRITES_ENABLED = "true";
  try {
    const proposed = await updateRoute.PUT(
      new NextRequest("http://localhost/api/admin/seo-articles/published-1", {
        method: "PUT",
        body: JSON.stringify(proposedData),
      }),
      { params: { id: "published-1" } },
    );
    const proposedBody = await proposed.json();
    assert.equal(proposed.status, 200, JSON.stringify(proposedBody));
    assert.equal(proposedBody.pendingApproval, true);
    assert.equal(liveUpdateCount, 0);
    assert.equal(liveTitle, "Original Published Renovation Guide");
    assert.equal(proposal?.status, "pending");

    const approved = await actionRoute.POST(
      new NextRequest(
        "http://localhost/api/admin/seo-articles/published-1/action",
        {
          method: "POST",
          body: JSON.stringify({
            action: "approve_update",
            proposalId: "proposal-1",
            ifUpdatedAt: baseUpdatedAt.toISOString(),
          }),
        },
      ),
      { params: { id: "published-1" } },
    );
    assert.equal(approved.status, 200);
    assert.equal(liveUpdateCount, 1);
    assert.equal(liveTitle, proposedTitle);
    assert.equal(proposal?.status, "approved");
  } finally {
    if (originalEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = originalEnv;
    if (originalWrites === undefined)
      delete process.env.SEO_PREVIEW_WRITES_ENABLED;
    else process.env.SEO_PREVIEW_WRITES_ENABLED = originalWrites;
  }
}

main()
  .then(() => console.log("Published-content update approval tests passed"))
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  });
