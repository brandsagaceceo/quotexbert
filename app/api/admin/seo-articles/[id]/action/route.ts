import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  resolveSeoAdmin,
  areSeoAdminWritesEnabled,
} from "@/lib/seo/admin-auth";
import {
  PublishingError,
  cancelScheduledArticle,
  publishArticle,
  scheduleArticle,
} from "@/lib/seo/publishing";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const admin = await resolveSeoAdmin();
    if (!admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    if (!areSeoAdminWritesEnabled())
      return NextResponse.json(
        {
          error:
            "Preview writes are disabled until an isolated database is authorized",
        },
        { status: 403 },
      );

    const rawBody = await request.text();
    if (rawBody.length > 2_000) {
      return NextResponse.json(
        { error: "Request is too large" },
        { status: 413 },
      );
    }
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    const action =
      body && typeof body === "object" && "action" in body
        ? (body as { action?: unknown }).action
        : null;
    if (
      typeof action !== "string" ||
      !["approve", "reject", "publish", "schedule", "cancel"].includes(action)
    ) {
      return NextResponse.json(
        { error: "Unsupported action" },
        { status: 400 },
      );
    }
    const version =
      body && typeof body === "object" && "ifUpdatedAt" in body
        ? body.ifUpdatedAt
        : null;
    if (typeof version !== "string" || !Number.isFinite(Date.parse(version))) {
      return NextResponse.json(
        { error: "Article version is required; refresh and review it" },
        { status: 400 },
      );
    }
    const expectedVersion = new Date(version);

    if (action === "schedule") {
      const value =
        body && typeof body === "object" && "scheduledFor" in body
          ? body.scheduledFor
          : null;
      if (typeof value !== "string")
        return NextResponse.json(
          { error: "Choose a future publication time" },
          { status: 400 },
        );
      await scheduleArticle(
        params.id,
        admin.id,
        new Date(value),
        expectedVersion,
      );
      return NextResponse.json({ success: true });
    }
    if (action === "cancel") {
      await cancelScheduledArticle(params.id, admin.id, expectedVersion);
      return NextResponse.json({ success: true });
    }
    if (action === "publish") {
      await publishArticle(params.id, admin.id, expectedVersion);
      return NextResponse.json({ success: true });
    }

    const article = await prisma.seoArticle.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        status: true,
        updatedAt: true,
        title: true,
        slug: true,
      },
    });
    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    if (article.updatedAt.getTime() !== expectedVersion.getTime()) {
      return NextResponse.json(
        { error: "Article changed; refresh and review it" },
        { status: 409 },
      );
    }

    let data: { status: string; approvedAt?: Date | null; publishedAt?: Date };
    if (action === "approve") {
      if (article.status !== "draft") {
        return NextResponse.json(
          { error: "Only drafts can be approved" },
          { status: 409 },
        );
      }
      data = { status: "approved", approvedAt: new Date() };
    } else if (action === "reject") {
      if (!["draft", "approved", "failed"].includes(article.status)) {
        return NextResponse.json(
          { error: "Only drafts, approved or failed articles can be rejected" },
          { status: 409 },
        );
      }
      data = { status: "rejected", approvedAt: null };
    } else {
      return NextResponse.json(
        { error: "Unsupported action" },
        { status: 400 },
      );
    }
    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.seoArticle.updateMany({
        where: {
          id: article.id,
          status: article.status,
          updatedAt: article.updatedAt,
        },
        data,
      });
      if (result.count === 1) {
        await tx.seoPublishingEvent.create({
          data: {
            actorId: admin.id,
            articleId: article.id,
            action: action === "approve" ? "approved" : "rejected",
          },
        });
      }
      return result;
    });
    if (updated.count !== 1)
      return NextResponse.json(
        {
          error: "Article changed. Refresh and review it before trying again.",
        },
        { status: 409 },
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof PublishingError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    console.error(
      "[SEO_ADMIN] Failed to apply article action",
      safeErrorType(error),
    );
    return NextResponse.json(
      { error: "Unable to update article status" },
      { status: 500 },
    );
  }
}

function safeErrorType(error: unknown) {
  return error instanceof Error &&
    /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
    ? error.name
    : "Error";
}
