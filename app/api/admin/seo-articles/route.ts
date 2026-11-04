import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSeoAdmin } from "@/lib/seo/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await resolveSeoAdmin();
    if (!admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const articles = await prisma.seoArticle.findMany({
      orderBy: [{ createdAt: "desc" }],
      take: 100,
      select: {
        id: true,
        topicId: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        category: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        affiliateProductIds: true,
        status: true,
        scheduledFor: true,
        approvedAt: true,
        publishedAt: true,
        generationError: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      articles: articles.map((article) => ({
        ...article,
        tags: parseStringArray(article.tags),
        affiliateProductIds: parseStringArray(article.affiliateProductIds),
      })),
    });
  } catch (error) {
    console.error("[SEO_ADMIN] Failed to list articles", safeErrorType(error));
    return NextResponse.json(
      { error: "Unable to load SEO articles" },
      { status: 500 },
    );
  }
}

function parseStringArray(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}

function safeErrorType(error: unknown) {
  return error instanceof Error &&
    /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
    ? error.name
    : "Error";
}
