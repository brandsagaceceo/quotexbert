import assert from "node:assert/strict";
import { NextRequest } from "next/server";

let calls = 0;
const Module = require("node:module").Module as new (id: string) => NodeModule;
const filename = require.resolve("@/lib/seo/publishing");
const mocked = new Module(filename);
mocked.filename = filename;
mocked.loaded = true;
mocked.exports = {
  runPublishingCron: async () => {
    calls++;
    return { skipped: "Preview cannot publish" };
  },
};
require.cache[filename] = mocked;
const { GET } =
  require("../app/api/cron/seo-publishing/route") as typeof import("../app/api/cron/seo-publishing/route");

async function request(authorization?: string) {
  return GET(
    new NextRequest("https://example.test/api/cron/seo-publishing", {
      headers: authorization ? { authorization } : {},
    }),
  );
}

async function main() {
  const original = process.env.CRON_SECRET;
  try {
    delete process.env.CRON_SECRET;
    assert.equal((await request()).status, 503);
    process.env.CRON_SECRET = "test-secret";
    assert.equal((await request("Bearer wrong")).status, 401);
    assert.equal(calls, 0);
    assert.equal((await request("Bearer test-secret")).status, 200);
    assert.equal(calls, 1);
    console.log("SEO publishing cron authorization tests passed");
  } finally {
    if (original === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = original;
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
