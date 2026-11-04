import assert from "node:assert/strict";
import { NextRequest } from "next/server";

let generationCount = 0;
let publicationCount = 0;
const moduleConstructor = require("node:module").Module as new (
  id: string,
) => NodeModule;
const filename = require.resolve("@/lib/seo/article-generation");
const mockedModule = new moduleConstructor(filename);
mockedModule.filename = filename;
mockedModule.loaded = true;
mockedModule.exports = {
  generateNextSeoDraft: async () => {
    generationCount += 1;
    return { kind: "created", article: { id: "draft-only" } };
  },
  isSeoDraftAutomationEnabled: () =>
    process.env.SEO_DRAFT_AUTOMATION_ENABLED === "true",
  isSeoAutoPublishEnabled: () =>
    process.env.SEO_AUTO_PUBLISH_ENABLED === "true",
  publishScheduledSeoArticles: async () => {
    publicationCount += 1;
    return 0;
  },
};
require.cache[filename] = mockedModule;

const { GET } = require("../app/api/cron/seo-drafts/route") as {
  GET: (request: NextRequest) => Promise<Response>;
};

async function callCron(authorization?: string) {
  const headers = new Headers();
  if (authorization) headers.set("authorization", authorization);
  return GET(
    new NextRequest("http://localhost/api/cron/seo-drafts", {
      headers,
    }),
  );
}

async function main() {
  const originalSecret = process.env.CRON_SECRET;
  const originalFlag = process.env.SEO_DRAFT_AUTOMATION_ENABLED;
  const originalAutoPublishFlag = process.env.SEO_AUTO_PUBLISH_ENABLED;
  const originalVercelEnv = process.env.VERCEL_ENV;
  process.env.CRON_SECRET = "test-cron-secret";
  delete process.env.SEO_DRAFT_AUTOMATION_ENABLED;
  delete process.env.SEO_AUTO_PUBLISH_ENABLED;

  assert.equal((await callCron("Bearer wrong-secret")).status, 401);
  assert.equal(generationCount, 0);

  const disabled = await callCron("Bearer test-cron-secret");
  assert.equal(disabled.status, 200);
  assert.equal(generationCount, 0);

  process.env.SEO_DRAFT_AUTOMATION_ENABLED = "true";
  const enabled = await callCron("Bearer test-cron-secret");
  assert.equal(enabled.status, 200);
  assert.equal(generationCount, 1);

  process.env.SEO_AUTO_PUBLISH_ENABLED = "true";
  process.env.VERCEL_ENV = "preview";
  const preview = await callCron("Bearer test-cron-secret");
  assert.equal(preview.status, 200);
  assert.equal(publicationCount, 0);

  process.env.VERCEL_ENV = "production";
  const production = await callCron("Bearer test-cron-secret");
  assert.equal(production.status, 200);
  assert.equal(publicationCount, 1);

  delete process.env.CRON_SECRET;
  assert.equal((await callCron("Bearer test-cron-secret")).status, 503);
  assert.equal(generationCount, 3);

  if (originalSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = originalSecret;
  if (originalFlag === undefined)
    delete process.env.SEO_DRAFT_AUTOMATION_ENABLED;
  else process.env.SEO_DRAFT_AUTOMATION_ENABLED = originalFlag;
  if (originalAutoPublishFlag === undefined)
    delete process.env.SEO_AUTO_PUBLISH_ENABLED;
  else process.env.SEO_AUTO_PUBLISH_ENABLED = originalAutoPublishFlag;
  if (originalVercelEnv === undefined) delete process.env.VERCEL_ENV;
  else process.env.VERCEL_ENV = originalVercelEnv;

  console.log("SEO cron authentication and feature-gate tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
