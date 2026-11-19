import assert from "node:assert/strict";
import {
  getAiCostRates,
  getGlobalAiDailyRequestLimit,
  reserveGlobalAiRequest,
} from "../lib/ai-usage-budget";

const originalLimit = process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;
const originalSeoInput = process.env.AI_SEO_INPUT_COST_PER_MILLION_USD;
const originalSeoOutput = process.env.AI_SEO_OUTPUT_COST_PER_MILLION_USD;
const originalSeoCached = process.env.AI_SEO_CACHED_INPUT_COST_PER_MILLION_USD;

async function run() {
  delete process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;
  assert.equal(getGlobalAiDailyRequestLimit(), null);
  assert.equal(
    await reserveGlobalAiRequest("homeowner_assistant"),
    false,
    "missing global budget configuration must deny inference",
  );

  for (const invalidLimit of ["0", "-1", "1.5", " 4", "4 ", "not-a-number"]) {
    process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT = invalidLimit;
    assert.equal(
      getGlobalAiDailyRequestLimit(),
      null,
      `${invalidLimit} must be rejected`,
    );
  }

  process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT = "12";
  assert.equal(getGlobalAiDailyRequestLimit(), 12);

  delete process.env.AI_SEO_INPUT_COST_PER_MILLION_USD;
  delete process.env.AI_SEO_OUTPUT_COST_PER_MILLION_USD;
  assert.equal(getAiCostRates("seo_drafting"), null);
  process.env.AI_SEO_INPUT_COST_PER_MILLION_USD = "0.15";
  process.env.AI_SEO_OUTPUT_COST_PER_MILLION_USD = "0.60";
  assert.deepEqual(getAiCostRates("seo_drafting"), {
    inputPerMillionUsd: 0.15,
    cachedInputPerMillionUsd: 0.15,
    outputPerMillionUsd: 0.6,
  });
  process.env.AI_SEO_CACHED_INPUT_COST_PER_MILLION_USD = "0.075";
  assert.equal(getAiCostRates("seo_drafting")?.cachedInputPerMillionUsd, 0.075);

  console.log("ai-usage-budget tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (originalLimit === undefined)
      delete process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;
    else process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT = originalLimit;
    if (originalSeoInput === undefined)
      delete process.env.AI_SEO_INPUT_COST_PER_MILLION_USD;
    else process.env.AI_SEO_INPUT_COST_PER_MILLION_USD = originalSeoInput;
    if (originalSeoOutput === undefined)
      delete process.env.AI_SEO_OUTPUT_COST_PER_MILLION_USD;
    else process.env.AI_SEO_OUTPUT_COST_PER_MILLION_USD = originalSeoOutput;
    if (originalSeoCached === undefined)
      delete process.env.AI_SEO_CACHED_INPUT_COST_PER_MILLION_USD;
    else
      process.env.AI_SEO_CACHED_INPUT_COST_PER_MILLION_USD = originalSeoCached;
  });
