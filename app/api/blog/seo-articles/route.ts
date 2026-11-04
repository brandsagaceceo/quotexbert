import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await prisma.seoArticle.findMany({
      where: { status: "published", publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        content: true,
        author: true,
        category: true,
        tags: true,
        seoTitle: true,
        seoDescription: true,
        canonicalUrl: true,
        affiliateProductIds: true,
        publishedAt: true,
      },
    });
    return NextResponse.json({
      articles: articles.map((article) => ({
        ...article,
        tags: parseStringArray(article.tags),
        affiliateProductIds: parseStringArray(article.affiliateProductIds),
        readTime: Math.max(
          1,
          Math.ceil(article.content.trim().split(/\s+/).length / 200),
        ),
        isSeoGenerated: true,
      })),
    });
  } catch (error) {
    console.error(
      "[SEO_BLOG] Failed to load published articles",
      safeErrorType(error),
    );
    return NextResponse.json(
      { error: "Unable to load published articles" },
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
