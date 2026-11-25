import { readFile } from "node:fs/promises";
import path from "node:path";

const reviewAssets = new Set([
  "estimate.webp",
  "estimate-mobile.webp",
  "local-bids.webp",
  "local-bids-mobile.webp",
  "ai-planning.webp",
  "ai-planning-mobile.webp",
  "visualize-phone.webp",
  "visualize-phone-mobile.webp",
  "visualize-kitchen.webp",
  "visualize-kitchen-mobile.webp",
  "inspiration.webp",
  "inspiration-mobile.webp",
  "contractor.webp",
  "contractor-mobile.webp",
]);

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> },
) {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.NEXT_PUBLIC_QX_BANNER_REVIEW !== "1"
  ) {
    return new Response(null, { status: 404 });
  }

  const assetRoot = process.env.QX_BANNER_REVIEW_ASSETS;
  const { asset } = await params;
  if (!assetRoot || !reviewAssets.has(asset)) {
    return new Response(null, { status: 404 });
  }

  const image = await readFile(path.join(assetRoot, asset));
  const body = new ArrayBuffer(image.byteLength);
  new Uint8Array(body).set(image);
  return new Response(body, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Type": "image/webp",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
