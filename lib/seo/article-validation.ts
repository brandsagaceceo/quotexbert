import {
  AFFILIATE_DISCLOSURE,
  getApprovedAffiliateProducts,
} from "@/lib/seo/affiliate-products";
import type { SeoTopic } from "@/lib/seo/topics";

export interface GeneratedSeoArticle {
  title: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  tags: string[];
  sourceNotes: string[];
  affiliateProductIds: string[];
}

export function parseGeneratedSeoArticle(
  value: unknown,
  topic: SeoTopic,
): GeneratedSeoArticle | null {
  if (!value || typeof value !== "object") return null;
  const article = value as Record<string, unknown>;
  if (
    typeof article.title !== "string" ||
    article.title.length < 30 ||
    article.title.length > 100 ||
    typeof article.excerpt !== "string" ||
    article.excerpt.length < 70 ||
    article.excerpt.length > 240 ||
    typeof article.content !== "string" ||
    countWords(article.content) < 700 ||
    countHeadings(article.content) < 4 ||
    typeof article.seoTitle !== "string" ||
    article.seoTitle.length < 30 ||
    article.seoTitle.length > 70 ||
    typeof article.seoDescription !== "string" ||
    article.seoDescription.length < 100 ||
    article.seoDescription.length > 170 ||
    !isStringArray(article.tags, 10, 50) ||
    !isStringArray(article.sourceNotes, 8, 300) ||
    !isStringArray(article.affiliateProductIds, 5, 80)
  ) {
    return null;
  }

  const approvedIds = new Set(
    getApprovedAffiliateProducts(article.affiliateProductIds as string[]).map(
      (product) => product.id,
    ),
  );
  const approvedProducts = getApprovedAffiliateProducts(
    article.affiliateProductIds as string[],
  );
  if (
    article.affiliateProductIds.some((id) => !approvedIds.has(id as string)) ||
    approvedProducts.some(
      (product) =>
        product.category.toLowerCase() !== topic.category.toLowerCase() &&
        product.category.toLowerCase() !== "general",
    ) ||
    !hasOnlyApprovedInternalLinks(
      article.content,
      topic.internalLinks,
      approvedProducts.map((product) => product.url),
    ) ||
    approvedProducts.some((product) => !isHttpsUrl(product.url))
  ) {
    return null;
  }

  return {
    title: article.title.trim(),
    excerpt: article.excerpt.trim(),
    content: article.content.trim(),
    seoTitle: article.seoTitle.trim(),
    seoDescription: article.seoDescription.trim(),
    tags: article.tags as string[],
    sourceNotes: article.sourceNotes as string[],
    affiliateProductIds: article.affiliateProductIds as string[],
  };
}

export function parseSeoArticleEdits(value: unknown, topic: SeoTopic) {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const fields = ["title", "excerpt", "content", "seoTitle", "seoDescription"];
  if (fields.some((field) => typeof body[field] !== "string")) return null;

  const result = {
    title: (body.title as string).trim(),
    excerpt: (body.excerpt as string).trim(),
    content: (body.content as string).trim(),
    seoTitle: (body.seoTitle as string).trim(),
    seoDescription: (body.seoDescription as string).trim(),
  };
  if (
    result.title.length < 30 ||
    result.title.length > 100 ||
    result.excerpt.length < 70 ||
    result.excerpt.length > 240 ||
    result.content.length > 30000 ||
    countWords(result.content) < 400 ||
    countHeadings(result.content) < 3 ||
    result.seoTitle.length < 30 ||
    result.seoTitle.length > 70 ||
    result.seoDescription.length < 100 ||
    result.seoDescription.length > 170
  ) {
    return null;
  }

  const tags = body.tags;
  const affiliateProductIds = body.affiliateProductIds;
  if (
    !isStringArray(tags, 10, 50) ||
    !isStringArray(affiliateProductIds, 5, 80) ||
    getApprovedAffiliateProducts(affiliateProductIds).length !==
      affiliateProductIds.length ||
    !hasOnlyApprovedInternalLinks(
      result.content,
      topic.internalLinks,
      getApprovedAffiliateProducts(affiliateProductIds).map(
        (product) => product.url,
      ),
    ) ||
    (affiliateProductIds.length > 0 &&
      (!result.content
        .toLowerCase()
        .includes(AFFILIATE_DISCLOSURE.toLowerCase()) ||
        getApprovedAffiliateProducts(affiliateProductIds).some(
          (product) =>
            product.category.toLowerCase() !== topic.category.toLowerCase() &&
            product.category.toLowerCase() !== "general",
        ) ||
        getApprovedAffiliateProducts(affiliateProductIds).some(
          (product) => !isHttpsUrl(product.url),
        )))
  ) {
    return null;
  }
  return { ...result, tags, affiliateProductIds };
}

function isStringArray(
  value: unknown,
  maxItems: number,
  maxLength: number,
): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every(
      (item) => typeof item === "string" && item.trim().length <= maxLength,
    )
  );
}

function countWords(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function countHeadings(value: string) {
  return value.match(/^#{2,3}\s+\S+/gm)?.length ?? 0;
}

function hasOnlyApprovedInternalLinks(
  content: string,
  allowedLinks: string[],
  allowedAffiliateUrls: string[] = [],
) {
  const links = Array.from(
    content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g),
    (match) => match[1] || "",
  );
  const allowed = new Set(allowedLinks);
  return links.every(
    (href) =>
      (href.startsWith("/") &&
        !href.startsWith("//") &&
        !href.includes("..") &&
        allowed.has(href.split(/[?#]/, 1)[0] || "")) ||
      (allowedAffiliateUrls.includes(href) && isHttpsUrl(href)),
  );
}

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
