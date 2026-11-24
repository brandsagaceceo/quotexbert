import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  resolveSeoAdmin,
  areSeoAdminWritesEnabled,
} from "@/lib/seo/admin-auth";
import {
  hasTestArticleLabel,
  parseSeoArticleEdits,
} from "@/lib/seo/article-validation";
import { APPROVED_SEO_TOPICS } from "@/lib/seo/topics";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
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

    const article = await prisma.seoArticle.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        topicId: true,
        status: true,
        updatedAt: true,
        title: true,
        slug: true,
      },
    });
    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    if (!["draft", "approved", "rejected", "failed"].includes(article.status)) {
      return NextResponse.json(
        {
          error:
            "Only drafts, approved, rejected or failed articles can be edited here",
        },
        { status: 409 },
      );
    }

    const topic = APPROVED_SEO_TOPICS.find(
      (item) => item.id === article.topicId,
    );
    if (!topic)
      return NextResponse.json(
        { error: "Article topic is no longer approved" },
        { status: 409 },
      );

    const rawBody = await request.text();
    if (rawBody.length > 50_000) {
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

    if (body && typeof body === "object" && "ifUpdatedAt" in body) {
      if (
        typeof body.ifUpdatedAt !== "string" ||
        !Number.isFinite(Date.parse(body.ifUpdatedAt))
      ) {
        return NextResponse.json(
          { error: "Invalid article version" },
          { status: 400 },
        );
      }
      if (
        new Date(body.ifUpdatedAt).getTime() !== article.updatedAt.getTime()
      ) {
        return NextResponse.json(
          {
            error:
              "Article changed since you opened it. Refresh and review it again.",
          },
          { status: 409 },
        );
      }
    }

    const edits = parseSeoArticleEdits(body, topic);
    if (!edits)
      return NextResponse.json(
        { error: "Article fields are invalid" },
        { status: 400 },
      );
    if (
      hasTestArticleLabel(article.title, article.slug) &&
      !hasTestArticleLabel(edits.title, article.slug)
    ) {
      return NextResponse.json(
        { error: "Test-labelled articles must retain their TEST label" },
        { status: 409 },
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const result = await tx.seoArticle.updateMany({
        where: {
          id: article.id,
          status: article.status,
          updatedAt: article.updatedAt,
        },
        data: {
          ...edits,
          tags: JSON.stringify(edits.tags),
          affiliateProductIds: JSON.stringify(edits.affiliateProductIds),
          status: "draft",
          approvedAt: null,
          scheduledFor: null,
          scheduleSource: null,
          generationError: null,
        },
      });
      if (result.count === 1) {
        await tx.seoPublishingEvent.create({
          data: { actorId: admin.id, articleId: article.id, action: "edited" },
        });
      }
      return result;
    });
    if (updated.count !== 1)
      return NextResponse.json(
        { error: "Article changed while saving. Refresh and review it again." },
        { status: 409 },
      );
    return NextResponse.json({ success: true, article: { id: article.id } });
  } catch (error) {
    console.error("[SEO_ADMIN] Failed to update article", safeErrorType(error));
    return NextResponse.json(
      { error: "Unable to update article" },
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
