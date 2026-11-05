import assert from "node:assert/strict";
import {
  getGlobalAiDailyRequestLimit,
  reserveGlobalAiRequest,
} from "../lib/ai-usage-budget";

const originalLimit = process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;

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
    assert.equal(getGlobalAiDailyRequestLimit(), null, `${invalidLimit} must be rejected`);
  }

  process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT = "12";
  assert.equal(getGlobalAiDailyRequestLimit(), 12);

  console.log("ai-usage-budget tests passed");
}

run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    if (originalLimit === undefined) delete process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT;
    else process.env.AI_GLOBAL_DAILY_REQUEST_LIMIT = originalLimit;
  });
