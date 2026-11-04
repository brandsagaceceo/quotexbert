import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveSeoAdmin } from "@/lib/seo/admin-auth";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const admin = await resolveSeoAdmin();
    if (!admin)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
    if (!["approve", "reject", "publish"].includes(String(action))) {
      return NextResponse.json(
        { error: "Unsupported action" },
        { status: 400 },
      );
    }

    const article = await prisma.seoArticle.findUnique({
      where: { id: params.id },
      select: { id: true, status: true },
    });
    if (!article)
      return NextResponse.json({ error: "Article not found" }, { status: 404 });

    if (action === "approve") {
      if (article.status !== "draft") {
        return NextResponse.json(
          { error: "Only drafts can be approved" },
          { status: 409 },
        );
      }
      await prisma.seoArticle.update({
        where: { id: article.id },
        data: { status: "approved", approvedAt: new Date() },
      });
    } else if (action === "reject") {
      if (article.status === "published") {
        return NextResponse.json(
          { error: "Published articles cannot be rejected" },
          { status: 409 },
        );
      }
      await prisma.seoArticle.update({
        where: { id: article.id },
        data: { status: "rejected" },
      });
    } else {
      if (article.status !== "approved") {
        return NextResponse.json(
          { error: "Only approved articles can be published" },
          { status: 409 },
        );
      }
      if (process.env.VERCEL_ENV !== "production") {
        return NextResponse.json(
          {
            error:
              "Public publishing is disabled outside the Production environment",
          },
          { status: 403 },
        );
      }
      await prisma.seoArticle.update({
        where: { id: article.id },
        data: { status: "published", publishedAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
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
