import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSeoAdmin } from "@/lib/seo/admin-auth";
import { parseSeoArticleEdits } from "@/lib/seo/article-validation";
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

    const article = await prisma.seoArticle.findUnique({
      where: { id: params.id },
      select: { id: true, topicId: true, status: true },
    });
    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    if (article.status === "published") {
      return NextResponse.json(
        { error: "Published articles cannot be edited here" },
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

    const edits = parseSeoArticleEdits(body, topic);
    if (!edits)
      return NextResponse.json(
        { error: "Article fields are invalid" },
        { status: 400 },
      );

    const updated = await prisma.seoArticle.update({
      where: { id: article.id },
      data: {
        ...edits,
        tags: JSON.stringify(edits.tags),
        affiliateProductIds: JSON.stringify(edits.affiliateProductIds),
      },
      select: { id: true, updatedAt: true },
    });
    return NextResponse.json({ success: true, article: updated });
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
