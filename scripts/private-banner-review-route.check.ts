import assert from "node:assert/strict";
import { GET } from "../app/api/local-banner-review/[asset]/route";

async function requestAsset(asset: string) {
  return GET(
    new Request(
      `http://localhost/api/local-banner-review/${encodeURIComponent(asset)}`,
    ),
    { params: Promise.resolve({ asset }) },
  );
}

async function main() {
  assert.ok(
    process.env.QX_BANNER_REVIEW_ASSETS,
    "set QX_BANNER_REVIEW_ASSETS to the extracted package image directory",
  );

  assert.equal(Reflect.set(process.env, "NODE_ENV", "development"), true);
  delete process.env.NEXT_PUBLIC_QX_BANNER_REVIEW;
  assert.equal(
    (await requestAsset("estimate.webp")).status,
    404,
    "private assets stay disabled by default",
  );

  process.env.NEXT_PUBLIC_QX_BANNER_REVIEW = "1";
  const image = await requestAsset("estimate.webp");
  assert.equal(image.status, 200);
  assert.equal(image.headers.get("content-type"), "image/webp");
  assert.equal(
    image.headers.get("cache-control"),
    "private, no-store, max-age=0",
  );
  assert.ok((await image.arrayBuffer()).byteLength > 0);
  assert.equal(
    (await requestAsset("../package.json")).status,
    404,
    "only allowlisted image names are served",
  );

  assert.equal(Reflect.set(process.env, "NODE_ENV", "production"), true);
  assert.equal(
    (await requestAsset("estimate.webp")).status,
    404,
    "private images are never served in production",
  );

  console.log("private banner review route checks passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
