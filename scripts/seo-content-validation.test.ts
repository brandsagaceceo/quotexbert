import assert from "node:assert/strict";
import {
  parseGeneratedSeoArticle,
  parseSeoArticleEdits,
} from "../lib/seo/article-validation";
import {
  getNextPublicationSlot,
  isSeoDraftAutomationEnabled,
} from "../lib/seo/article-generation";
import { APPROVED_SEO_TOPICS } from "../lib/seo/topics";

const topic = APPROVED_SEO_TOPICS[0];
assert.ok(topic);

const sections = Array.from({ length: 5 }, (_, section) => {
  const words = Array.from(
    { length: 145 },
    (_, word) => `advice${section}item${word}`,
  ).join(" ");
  return `## Planning step ${section + 1}\n\n${words}`;
});
const content = [
  "A practical Ontario renovation guide for homeowners.",
  ...sections,
  `Use the [QuoteXbert calculator](${topic.internalLinks[0]}) to organize project details.`,
].join("\n\n");
const validArticle = {
  title: "A Practical Ontario Home Renovation Planning Guide",
  excerpt:
    "Learn how to plan a renovation scope, compare local quotes, choose materials, and prepare useful questions before work begins.",
  content,
  seoTitle: "Ontario Renovation Planning: A Practical Homeowner Guide",
  seoDescription:
    "Plan an Ontario renovation with practical advice on scope, local quotes, material choices, timelines, and questions for qualified contractors.",
  tags: ["Ontario renovation", "homeowner planning"],
  sourceNotes: [],
  affiliateProductIds: [],
};

assert.ok(parseGeneratedSeoArticle(validArticle, topic));
assert.equal(
  parseGeneratedSeoArticle(
    {
      ...validArticle,
      content: `${content}\n\n[External source](https://example.com)`,
    },
    topic,
  ),
  null,
);
assert.equal(
  parseGeneratedSeoArticle(
    { ...validArticle, affiliateProductIds: ["unapproved-product"] },
    topic,
  ),
  null,
);
assert.ok(parseSeoArticleEdits({ ...validArticle, content }, topic));
assert.equal(
  parseSeoArticleEdits(
    {
      ...validArticle,
      content: `${content}\n\n[External](https://example.com)`,
    },
    topic,
  ),
  null,
);

const mondayBeforeSlot = getNextPublicationSlot(
  new Date("2026-03-02T13:00:00.000Z"),
);
assert.equal(mondayBeforeSlot.toISOString(), "2026-03-02T14:00:00.000Z");
const mondayAfterSlot = getNextPublicationSlot(
  new Date("2026-03-02T15:00:00.000Z"),
);
assert.equal(mondayAfterSlot.toISOString(), "2026-03-04T14:00:00.000Z");

const originalFlag = process.env.SEO_DRAFT_AUTOMATION_ENABLED;
delete process.env.SEO_DRAFT_AUTOMATION_ENABLED;
assert.equal(isSeoDraftAutomationEnabled(), false);
process.env.SEO_DRAFT_AUTOMATION_ENABLED = "true";
assert.equal(isSeoDraftAutomationEnabled(), true);
if (originalFlag === undefined) delete process.env.SEO_DRAFT_AUTOMATION_ENABLED;
else process.env.SEO_DRAFT_AUTOMATION_ENABLED = originalFlag;

console.log("SEO content validation tests passed");
