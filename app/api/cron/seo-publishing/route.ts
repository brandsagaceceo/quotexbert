import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { runPublishingCron } from "@/lib/seo/publishing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Cron authentication is not configured" },
      { status: 503 },
    );
  const supplied = Buffer.from(request.headers.get("authorization") || "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (
    supplied.length !== expected.length ||
    !timingSafeEqual(supplied, expected)
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    return NextResponse.json(await runPublishingCron());
  } catch (error) {
    console.error(
      "[SEO_PUBLISHING] Cron failed",
      error instanceof Error ? error.name : "Error",
    );
    return NextResponse.json(
      { error: "Publishing cron failed" },
      { status: 500 },
    );
  }
}
