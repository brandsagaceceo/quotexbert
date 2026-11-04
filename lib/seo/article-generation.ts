import { blogPostMetadata } from "@/app/blog/blog-metadata";
import {
  getOpenAIClient,
  isAiFeatureEnabled,
  OPENAI_MODELS,
} from "@/lib/openai-client";
import { reserveGlobalAiRequest } from "@/lib/ai-usage-budget";
import { prisma } from "@/lib/prisma";
import { parseGeneratedSeoArticle } from "@/lib/seo/article-validation";
import {
  AFFILIATE_DISCLOSURE,
  APPROVED_AFFILIATE_PRODUCTS,
  getApprovedAffiliateProducts,
} from "@/lib/seo/affiliate-products";
import { APPROVED_SEO_TOPICS, type SeoTopic } from "@/lib/seo/topics";

const articleSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "excerpt",
    "content",
    "seoTitle",
    "seoDescription",
    "tags",
    "sourceNotes",
    "affiliateProductIds",
  ],
  properties: {
    title: { type: "string" },
    excerpt: { type: "string" },
    content: { type: "string" },
    seoTitle: { type: "string" },
    seoDescription: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    sourceNotes: { type: "array", items: { type: "string" } },
    affiliateProductIds: { type: "array", items: { type: "string" } },
  },
} as const;

const editorialPrompt = `Write a genuinely useful, specific renovation guide for Ontario homeowners. This content will be reviewed by a human before publication.
Use Canadian English. Explain practical decisions and local context; avoid keyword repetition, generic filler, fabricated experience, fake quotes, fabricated search metrics, fake sources, unsupported code requirements, and unsupported exact prices or market ranges. Where no supplied evidence supports a price, explain the factors that affect cost and recommend itemized local quotes rather than inventing a number.
Write 800-1,200 words with a clear introduction, at least five useful H2/H3 headings, practical steps/checklists, a concise conclusion, and natural links only to the supplied QuoteXbert pages. No HTML. Avoid legal, structural, electrical, or safety advice beyond general cautions and refer readers to the relevant local authority or qualified professional.
Recommend only products whose IDs appear in the approved catalog. The catalog is empty unless supplied; never invent products, merchants, tracking IDs, product URLs, or prices. Return no more than three catalog IDs.
Do not claim that keyword metrics or Search Console research were used.`;

export async function generateNextSeoDraft() {
  if (!isSeoDraftAutomationEnabled()) return { kind: "disabled" as const };

  const createdAtSlot = new Date();
  const slotKey = getSlotKey(createdAtSlot);
  const existingSlot = await prisma.seoArticle.findUnique({
    where: { slotKey },
    select: { id: true, status: true, slug: true },
  });
  if (existingSlot) {
    return { kind: "already-run" as const, status: existingSlot.status };
  }

  const topic = await selectNextTopic();
  if (!topic) return { kind: "empty" as const };

  const draftSlug = topic.id;
  const baseUrl = (
    process.env.NEXT_PUBLIC_URL || "https://www.quotexbert.com"
  ).replace(/\/+$/, "");
  let reservation: { id: string };
  try {
    reservation = await prisma.seoArticle.create({
      data: {
        slotKey,
        topicId: topic.id,
        title: topic.titleBrief,
        slug: `generating-${slotKey}`,
        excerpt: "",
        content: "",
        category: topic.category,
        seoTitle: topic.titleBrief.slice(0, 70),
        seoDescription: `Draft in progress for ${topic.query}`.slice(0, 170),
        canonicalUrl: `${baseUrl}/blog/${draftSlug}`,
        status: "generating",
        scheduledFor: getNextPublicationSlot(createdAtSlot),
      },
      select: { id: true },
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { kind: "already-run" as const, status: "generating" };
    }
    throw error;
  }

  try {
    const client = getOpenAIClient();
    if (!client)
      return recordFailure(reservation.id, slotKey, "OpenAIUnavailable");
    if (!(await reserveGlobalAiRequest("seo_drafting"))) {
      return recordFailure(reservation.id, slotKey, "GlobalAiUsageBudgetReached");
    }

    const response = await client.responses.create(
      {
        model: OPENAI_MODELS.seoDrafting,
        max_output_tokens: 5000,
        store: false,
        input: [
          { role: "system", content: editorialPrompt },
          {
            role: "user",
            content: JSON.stringify({
              targetQuery: topic.query,
              titleBrief: topic.titleBrief,
              localContext: topic.city,
              category: topic.category,
              editorialFocus: topic.focus,
              allowedInternalLinks: topic.internalLinks,
              approvedAffiliateProducts: APPROVED_AFFILIATE_PRODUCTS,
              requiredDisclosure:
                APPROVED_AFFILIATE_PRODUCTS.length > 0
                  ? "Show a clear affiliate disclosure adjacent to any selected affiliate recommendations."
                  : null,
              verifiedPriceData: null,
              verifiedExternalSources: [],
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "seo_article_draft",
            strict: true,
            schema: articleSchema,
          },
        },
      },
      { timeout: 45_000 },
    );

    let generated: ReturnType<typeof parseGeneratedSeoArticle> = null;
    try {
      generated = parseGeneratedSeoArticle(
        JSON.parse(response.output_text || ""),
        topic,
      );
    } catch {
      generated = null;
    }

    if (!generated) {
      return recordFailure(reservation.id, slotKey, "InvalidGeneratedArticle");
    }

    const normalizedTitle = normalizeTitle(generated.title);
    if (await isDuplicateTopic(draftSlug, normalizedTitle, reservation.id)) {
      return recordFailure(reservation.id, slotKey, "DuplicateArticle");
    }

    const article = await prisma.seoArticle.update({
      where: { id: reservation.id },
      data: {
        title: generated.title,
        slug: draftSlug,
        excerpt: generated.excerpt,
        content: appendAffiliateRecommendations(
          generated.content,
          generated.affiliateProductIds,
          topic,
        ),
        category: topic.category,
        tags: JSON.stringify(generated.tags),
        seoTitle: generated.seoTitle,
        seoDescription: generated.seoDescription,
        canonicalUrl: `${baseUrl}/blog/${draftSlug}`,
        affiliateProductIds: JSON.stringify(generated.affiliateProductIds),
        sourceNotes: "[]",
        status: "draft",
      },
      select: { id: true, slug: true, title: true, status: true },
    });

    return { kind: "created" as const, article };
  } catch (error) {
    const errorType =
      error instanceof Error && /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
        ? error.name
        : "GenerationError";
    return recordFailure(reservation.id, slotKey, errorType);
  }
}

export function isSeoDraftAutomationEnabled() {
  return isAiFeatureEnabled("SEO_DRAFT_AUTOMATION_ENABLED");
}

export function isSeoAutoPublishEnabled() {
  return process.env.SEO_AUTO_PUBLISH_ENABLED === "true";
}

export async function publishScheduledSeoArticles(now = new Date()) {
  const scheduled = await prisma.seoArticle.findMany({
    where: {
      status: "approved",
      approvedAt: { not: null },
      scheduledFor: { lte: now },
    },
    orderBy: { scheduledFor: "asc" },
    take: 3,
    select: { id: true },
  });

  let publishedCount = 0;
  for (const article of scheduled) {
    const updated = await prisma.seoArticle.updateMany({
      where: {
        id: article.id,
        status: "approved",
        approvedAt: { not: null },
        scheduledFor: { lte: now },
      },
      data: { status: "published", publishedAt: now },
    });
    publishedCount += updated.count;
  }
  return publishedCount;
}

export function getNextPublicationSlot(now = new Date()) {
  const next = new Date(now);
  next.setUTCHours(14, 0, 0, 0);
  for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
    const candidate = new Date(next);
    candidate.setUTCDate(next.getUTCDate() + dayOffset);
    if (
      [1, 3, 5].includes(candidate.getUTCDay()) &&
      candidate.getTime() >= now.getTime()
    ) {
      return candidate;
    }
  }
  next.setUTCDate(next.getUTCDate() + 7);
  return next;
}

async function selectNextTopic(): Promise<SeoTopic | null> {
  const existing = await prisma.seoArticle.findMany({
    where: { status: { not: "failed" } },
    select: { topicId: true, title: true, slug: true },
  });
  const usedTopicIds = new Set(existing.map((article) => article.topicId));
  const staticSlugs = new Set(Object.keys(blogPostMetadata));
  const staticTitles = new Set(
    Object.values(blogPostMetadata).map((article) =>
      normalizeTitle(article.title),
    ),
  );
  const unused = APPROVED_SEO_TOPICS.filter(
    (topic) =>
      !usedTopicIds.has(topic.id) &&
      !staticSlugs.has(topic.id) &&
      !staticTitles.has(normalizeTitle(topic.titleBrief)) &&
      !existing.some(
        (article) =>
          normalizeTitle(article.title) === normalizeTitle(topic.titleBrief),
      ),
  );
  return unused[0] ?? null;
}

async function isDuplicateTopic(
  slug: string,
  normalizedTitle: string,
  exceptId: string,
) {
  const existing = await prisma.seoArticle.findMany({
    where: { status: { not: "failed" }, id: { not: exceptId } },
    select: { slug: true, title: true },
  });
  return (
    existing.some(
      (article) =>
        article.slug === slug ||
        normalizeTitle(article.title) === normalizedTitle,
    ) ||
    Object.keys(blogPostMetadata).includes(slug) ||
    Object.values(blogPostMetadata).some(
      (article) => normalizeTitle(article.title) === normalizedTitle,
    )
  );
}

async function recordFailure(id: string, slotKey: string, errorType: string) {
  const article = await prisma.seoArticle.update({
    where: { id },
    data: {
      status: "failed",
      generationError: errorType,
      seoDescription:
        "Draft generation failed; inspect the failure type and retry in a later slot.",
      slug: `failed-${slotKey}`,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      generationError: true,
    },
  });
  return { kind: "failed" as const, article };
}

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function getSlotKey(date: Date) {
  return `seo-draft-${date.toISOString().slice(0, 10)}`;
}

function isUniqueConstraintError(error: unknown) {
  return (
    !!error &&
    typeof error === "object" &&
    "code" in error &&
    (error as { code?: unknown }).code === "P2002"
  );
}

function appendAffiliateRecommendations(
  content: string,
  productIds: string[],
  topic: SeoTopic,
) {
  const products = getApprovedAffiliateProducts(productIds).filter(
    (product) =>
      product.category.toLowerCase() === topic.category.toLowerCase() ||
      product.category.toLowerCase() === "general",
  );
  const safeProducts = products.filter((product) => {
    try {
      const url = new URL(product.url);
      return url.protocol === "https:" && !url.username && !url.password;
    } catch {
      return false;
    }
  });
  if (!safeProducts.length) return content;

  return `${content.trim()}\n\n## Relevant tools and materials\n\n${AFFILIATE_DISCLOSURE}\n\n${safeProducts
    .map((product) => `- [${product.name}](${product.url})`)
    .join("\n")}`;
}
