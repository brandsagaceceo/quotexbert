import { NextRequest, NextResponse } from "next/server";
import {
  areSeoAdminWritesEnabled,
  resolveSeoAdmin,
} from "@/lib/seo/admin-auth";
import {
  PublishingError,
  readPublishingDashboard,
  setPublishingControl,
} from "@/lib/seo/publishing";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!(await resolveSeoAdmin()))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const page = Number(request.nextUrl.searchParams.get("page") || "1");
    if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
      return NextResponse.json(
        { error: "Invalid history page" },
        { status: 400 },
      );
    }
    return NextResponse.json(await readPublishingDashboard(page));
  } catch (error) {
    console.error(
      "[SEO_PUBLISHING] Unable to load controls",
      error instanceof Error ? error.name : "Error",
    );
    return NextResponse.json(
      {
        error: "Publishing controls unavailable; publishing is not safe to use",
      },
      { status: 503 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await resolveSeoAdmin();
    if (!admin || !areSeoAdminWritesEnabled())
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const raw = await request.text();
    if (raw.length > 1000)
      return NextResponse.json({ error: "Request too large" }, { status: 413 });
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (
      !body ||
      typeof body !== "object" ||
      !("control" in body) ||
      !("enabled" in body) ||
      (body.control !== "autoPublish" && body.control !== "paused") ||
      typeof body.enabled !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Invalid publishing control" },
        { status: 400 },
      );
    }
    await setPublishingControl(admin.id, body.control, body.enabled);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof PublishingError)
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    console.error(
      "[SEO_PUBLISHING] Control update failed",
      error instanceof Error ? error.name : "Error",
    );
    return NextResponse.json(
      { error: "Unable to update publishing controls" },
      { status: 500 },
    );
  }
}
