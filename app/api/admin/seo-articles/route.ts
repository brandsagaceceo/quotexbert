import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  resolveSeoAdmin,
  getSeoStudioCapabilities,
} from "@/lib/seo/admin-auth";
import { generateNextSeoDraft } from "@/lib/seo/article-generation";
import { SEO_ARTICLE_STATUSES } from "@/lib/seo/article-validation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  try {
    const admin = await resolveSeoAdmin();
    if (!admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const page = Number(request.nextUrl.searchParams.get("page") || "1");
    const status = request.nextUrl.searchParams.get("status") || "all";
    if (
      !Number.isSafeInteger(page) ||
      page < 1 ||
      page > 10000 ||
      (status !== "all" &&
        !SEO_ARTICLE_STATUSES.some((value) => value === status))
    ) {
      return NextResponse.json(
        { error: "Invalid article page or status" },
        { status: 400 },
      );
    }
    const pageSize = 25;
    const [articles, counts] = await Promise.all([
      prisma.seoArticle.findMany({
        where: status === "all" ? {} : { status },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          topicId: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          category: true,
          author: true,
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
      }),
      prisma.seoArticle.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);
    const summary: Record<string, number> = Object.fromEntries(
      counts.map((group) => [group.status, group._count._all]),
    );
    const total = Object.values(summary).reduce((sum, count) => sum + count, 0);
    const matchingTotal = status === "all" ? total : summary[status] || 0;
    const site = new URL(
      process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com",
    );

    return NextResponse.json({
      articles: articles.map((article) => ({
        ...article,
        tags: parseStringArray(article.tags),
        affiliateProductIds: parseStringArray(article.affiliateProductIds),
      })),
      summary: { ...summary, total },
      pagination: {
        page,
        pageSize,
        total: matchingTotal,
        pageCount: Math.max(1, Math.ceil(matchingTotal / pageSize)),
      },
      capabilities: getSeoStudioCapabilities(),
      searchConsole: {
        verificationTokenConfigured: Boolean(
          process.env.GOOGLE_SITE_VERIFICATION?.trim(),
        ),
        metricsConnected: false,
        propertyUrl: site.origin,
        sitemapUrl: new URL("/sitemap.xml", site).href,
      },
    });
  } catch (error) {
    console.error("[SEO_ADMIN] Failed to list articles", safeErrorType(error));
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error.code === "P2021" || error.code === "P2022")
    ) {
      return NextResponse.json(
        {
          error:
            "SEO article storage is unavailable or not migrated. Configure an authorized database and apply the existing SeoArticle migration.",
        },
        { status: 503 },
      );
    }
    return NextResponse.json(
      { error: "Unable to load SEO articles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await resolveSeoAdmin())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (!getSeoStudioCapabilities().canGenerate) {
      return NextResponse.json(
        {
          error:
            "Manual generation is disabled. Enable SEO_MANUAL_DRAFT_ENABLED only after authorizing AI spend; non-production also requires SEO_PREVIEW_WRITES_ENABLED and an isolated database.",
        },
        { status: 403 },
      );
    }
    const raw = await request.text();
    if (raw.length > 1000) {
      return NextResponse.json(
        { error: "Request is too large" },
        { status: 413 },
      );
    }
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (
      !body ||
      typeof body !== "object" ||
      !("action" in body) ||
      body.action !== "generate"
    ) {
      return NextResponse.json(
        { error: "Unsupported action" },
        { status: 400 },
      );
    }
    const result = await generateNextSeoDraft({ trigger: "manual" });
    if (result.kind === "created")
      return NextResponse.json(result, { status: 201 });
    const error =
      result.kind === "already-run"
        ? `Today's shared drafting slot has already been used (${result.status}). Refresh the queue; no additional AI request was made.`
        : result.kind === "empty"
          ? "No unused approved topics remain."
          : result.kind === "failed"
            ? `Generation failed: ${result.article.generationError}. The failure is recorded privately.`
            : result.kind === "blocked"
              ? result.error
              : "Manual generation is disabled.";
    return NextResponse.json(
      { error, result },
      {
        status:
          result.kind === "failed"
            ? 502
            : result.kind === "already-run" || result.kind === "empty"
              ? 409
              : 403,
      },
    );
  } catch (error) {
    console.error("[SEO_ADMIN] Manual generation failed", safeErrorType(error));
    return NextResponse.json(
      { error: "Unable to generate an article" },
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
