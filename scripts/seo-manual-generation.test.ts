import assert from "node:assert/strict";

const ModuleConstructor = require("node:module").Module as new (
  id: string,
) => NodeModule;
function mockModule(specifier: string, exports: Record<string, unknown>) {
  const filename = require.resolve(specifier);
  const mocked = new ModuleConstructor(filename);
  mocked.filename = filename;
  mocked.loaded = true;
  mocked.exports = exports;
  require.cache[filename] = mocked;
}

let existingSlot: { id: string; status: string; slug: string } | null = null;
let writes = 0;
let providerCalls = 0;
let budgetAllowed = true;
let providerAvailable = true;
let createConflict = false;
let lastWrite: Record<string, unknown> = {};

mockModule("@clerk/nextjs/server", { auth: async () => ({ userId: null }) });
mockModule("@/lib/prisma", {
  prisma: {
    seoArticle: {
      findUnique: async () => existingSlot,
      findMany: async () => [],
      create: async () => {
        if (createConflict)
          throw Object.assign(new Error("conflict"), { code: "P2002" });
        writes += 1;
        existingSlot = {
          id: "reserved",
          status: "generating",
          slug: "generating-test",
        };
        return { id: "reserved" };
      },
      update: async ({ data }: { data: Record<string, unknown> }) => {
        writes += 1;
        lastWrite = data;
        return { id: "reserved", ...data };
      },
    },
  },
});
mockModule("@/lib/ai-usage-budget", {
  reserveGlobalAiRequest: async (feature: string) => {
    assert.equal(feature, "seo_drafting");
    return budgetAllowed;
  },
});
mockModule("@/lib/openai-client", {
  isAiFeatureEnabled: (name: string) => process.env[name] === "true",
  OPENAI_MODELS: { seoDrafting: "test-model" },
  getOpenAIClient: () =>
    providerAvailable
      ? {
          responses: {
            create: async () => {
              providerCalls += 1;
              return { output_text: "{}" };
            },
          },
        }
      : null,
});
mockModule("@/lib/seo/article-validation", {
  parseGeneratedSeoArticle: () => ({
    title: "Test-only Ontario renovation planning guide",
    excerpt: "Test-only content, never written to a real database.",
    content: "## Planning\nPrivate fixture",
    seoTitle: "Test-only Ontario planning guide",
    seoDescription: "A private test fixture.",
    tags: [],
    affiliateProductIds: [],
  }),
});

const { generateNextSeoDraft } = require("../lib/seo/article-generation") as {
  generateNextSeoDraft: (options?: {
    trigger: "manual" | "scheduled";
  }) => Promise<{
    kind: string;
    status?: string;
    article?: { status: string; generationError?: string };
  }>;
};

async function main() {
  const keys = [
    "VERCEL_ENV",
    "SEO_PREVIEW_WRITES_ENABLED",
    "SEO_DRAFT_AUTOMATION_ENABLED",
    "SEO_MANUAL_DRAFT_ENABLED",
  ] as const;
  const original = Object.fromEntries(
    keys.map((key) => [key, process.env[key]]),
  );
  try {
    process.env.VERCEL_ENV = "preview";
    delete process.env.SEO_PREVIEW_WRITES_ENABLED;
    delete process.env.SEO_MANUAL_DRAFT_ENABLED;
    delete process.env.SEO_DRAFT_AUTOMATION_ENABLED;
    assert.equal(
      (await generateNextSeoDraft({ trigger: "manual" })).kind,
      "disabled",
    );
    assert.equal(writes, 0);

    process.env.SEO_MANUAL_DRAFT_ENABLED = "true";
    assert.equal(
      (await generateNextSeoDraft({ trigger: "manual" })).kind,
      "blocked",
    );
    assert.equal(
      writes,
      0,
      "A flag must not write to an unapproved preview database",
    );
    assert.equal(providerCalls, 0);

    process.env.SEO_PREVIEW_WRITES_ENABLED = "true";
    const generated = await generateNextSeoDraft({ trigger: "manual" });
    assert.equal(generated.kind, "created");
    assert.equal(generated.article?.status, "draft");
    assert.equal(lastWrite.status, "draft");
    assert.equal(lastWrite.publishedAt, undefined);
    assert.equal(lastWrite.approvedAt, undefined);
    assert.equal(providerCalls, 1);
    assert.equal(writes, 2);

    assert.equal(
      (await generateNextSeoDraft({ trigger: "manual" })).kind,
      "already-run",
    );
    process.env.SEO_DRAFT_AUTOMATION_ENABLED = "true";
    assert.equal((await generateNextSeoDraft()).kind, "already-run");
    assert.equal(
      providerCalls,
      1,
      "Manual and scheduled generation must share the daily reservation",
    );
    assert.equal(writes, 2);

    existingSlot = null;
    createConflict = true;
    assert.equal(
      (await generateNextSeoDraft({ trigger: "manual" })).kind,
      "already-run",
    );
    assert.equal(providerCalls, 1);
    createConflict = false;

    existingSlot = null;
    budgetAllowed = false;
    const exhausted = await generateNextSeoDraft({ trigger: "manual" });
    assert.equal(exhausted.kind, "failed");
    assert.equal(exhausted.article?.status, "failed");
    assert.equal(
      exhausted.article?.generationError,
      "GlobalAiUsageBudgetReached",
    );
    assert.equal(providerCalls, 1);

    existingSlot = null;
    budgetAllowed = true;
    providerAvailable = false;
    const unavailable = await generateNextSeoDraft({ trigger: "manual" });
    assert.equal(unavailable.kind, "failed");
    assert.equal(unavailable.article?.generationError, "OpenAIUnavailable");
    assert.equal(providerCalls, 1);
    console.log(
      "SEO manual generation gates, shared reservation, budget and private failure tests passed",
    );
  } finally {
    for (const key of keys) {
      if (original[key] === undefined) delete process.env[key];
      else process.env[key] = original[key];
    }
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
