// Server component — MUST stay as a server component (no "use client")
// This provides proper server-side <title> and <meta description> for every blog post,
// which is critical for Google indexing and SEO.

import type { Metadata } from "next";
import { getBlogPostMeta } from "../blog-metadata";

interface Props {
  params: { slug: string };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = getBlogPostMeta(params.slug);

  if (!meta) {
    return {
      title: "Blog | QuoteXbert",
      description:
        "Read renovation guides, cost breakdowns, and contractor tips from QuoteXbert — Toronto, Durham Region & the GTA.",
    };
  }

  const canonicalUrl = `https://www.quotexbert.com/blog/${params.slug}`;

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
      images: [
        {
          url: meta.imageUrl,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.imageUrl],
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
