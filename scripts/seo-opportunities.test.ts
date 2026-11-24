import assert from "node:assert/strict";
import { buildSeoOpportunities } from "../lib/seo/opportunities";

const result = buildSeoOpportunities(
  [
    {
      page: "https://www.quotexbert.com/blog/strong-page",
      clicks: 12,
      impressions: 400,
      ctr: 0.02,
      position: 8,
    },
    {
      page: "https://www.quotexbert.com/private",
      clicks: 100,
      impressions: 1000,
      ctr: 0.1,
      position: 1,
    },
  ],
  [
    {
      page: "https://www.quotexbert.com/blog/strong-page",
      clicks: 8,
      impressions: 300,
      ctr: 0.026,
      position: 10,
    },
  ],
  [
    {
      page: "https://www.quotexbert.com/blog/strong-page",
      query: "basement planning checklist",
      clicks: 4,
      impressions: 80,
      ctr: 0.05,
      position: 7,
    },
    {
      page: "https://www.quotexbert.com/blog/strong-page",
      query: "kitchen costs toronto",
      clicks: 1,
      impressions: 50,
      ctr: 0.02,
      position: 12,
    },
  ],
  [
    {
      path: "/blog/strong-page",
      title: "Strong Basement Planning Page",
      intents: ["basement renovation planning"],
      articleId: "article-1",
    },
    {
      path: "/blog/kitchen-page",
      title: "Toronto Kitchen Costs",
      intents: ["kitchen costs toronto"],
    },
  ],
);

assert.equal(result.length, 1, "only known published pages are recommended");
assert.equal(result[0]?.articleId, "article-1");
assert.equal(result[0]?.previousClicks, 8);
assert.match(result[0]?.recommendation || "", /title and description/);
assert.deepEqual(result[0]?.supportingQueries, ["basement planning checklist"]);
assert.ok(
  result[0]?.reasons.some((reason) => reason.includes("between 4 and 20")),
);

console.log("SEO opportunity classification tests passed");
