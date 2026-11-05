// Server component — MUST stay as a server component (no "use client")
// This provides proper server-side <title> and <meta description> for every blog post,
// which is critical for Google indexing and SEO.

import type { Metadata } from "next";
import { getBlogPostMeta } from "../blog-metadata";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const staticMeta = getBlogPostMeta(params.slug);
  const generated = staticMeta
    ? null
    : await prisma.seoArticle.findFirst({
        where: {
          slug: params.slug,
          status: "published",
          publishedAt: { not: null },
        },
        select: {
          title: true,
          seoTitle: true,
          seoDescription: true,
          canonicalUrl: true,
          author: true,
          category: true,
          tags: true,
          publishedAt: true,
        },
      });
  const meta = staticMeta ?? (generated ? {
    title: generated.seoTitle,
    description: generated.seoDescription,
    imageUrl: "",
    author: generated.author,
    publishedAt: generated.publishedAt?.toISOString() ?? "",
    category: generated.category,
    tags: parseStringArray(generated.tags),
  } : null);

  if (!meta) {
    return {
      title: "Blog | QuoteXbert",
      description:
        "Read renovation guides, cost breakdowns, and contractor tips from QuoteXbert — Toronto, Durham Region & the GTA.",
    };
  }

  const canonicalUrl = generated?.canonicalUrl ?? `https://www.quotexbert.com/blog/${params.slug}`;

  return {
    title: meta.title,
    description: meta.description,
    authors: [{ name: meta.author }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonicalUrl,
      type: "article",
      publishedTime: meta.publishedAt,
      authors: [meta.author],
      images: meta.imageUrl ? [
        {
          url: meta.imageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      ...(meta.imageUrl ? { images: [meta.imageUrl] } : {}),
    },
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: meta.tags,
  };
}

export default function BlogPostLayout({ children }: Props) {
  return <>{children}</>;
}

function parseStringArray(value: string) {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((item) => typeof item === "string")
      ? parsed
      : [];
  } catch {
    return [];
  }
}
