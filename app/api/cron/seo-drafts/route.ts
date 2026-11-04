import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  generateNextSeoDraft,
  isSeoAutoPublishEnabled,
  isSeoDraftAutomationEnabled,
  publishScheduledSeoArticles,
} from "@/lib/seo/article-generation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Cron authentication is not configured" },
      { status: 503 },
    );
  }
  if (!isAuthorized(request.headers.get("authorization"), secret)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const shouldDraft = isSeoDraftAutomationEnabled();
  const shouldAutoPublish =
    isSeoAutoPublishEnabled() && process.env.VERCEL_ENV === "production";
  if (!shouldDraft && !shouldAutoPublish) {
    return NextResponse.json({ skipped: "SEO draft automation is disabled" });
  }

  try {
    const publishedCount = shouldAutoPublish
      ? await publishScheduledSeoArticles()
      : 0;
    const drafting = shouldDraft
      ? await generateNextSeoDraft()
      : { kind: "disabled" as const };
    return NextResponse.json({ publishedCount, drafting });
  } catch (error) {
    const errorType =
      error instanceof Error && /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
        ? error.name
        : "Error";
    console.error("[SEO_CRON] Draft generation workflow failed", errorType);
    return NextResponse.json(
      { error: "Draft generation failed" },
      { status: 500 },
    );
  }
}

function isAuthorized(authorization: string | null, secret: string) {
  if (!authorization?.startsWith("Bearer ")) return false;
  const token = authorization.slice("Bearer ".length);
  const expected = Buffer.from(secret);
  const supplied = Buffer.from(token);
  return (
    expected.length === supplied.length && timingSafeEqual(expected, supplied)
  );
}
