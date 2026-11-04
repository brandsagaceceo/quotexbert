import assert from "node:assert/strict";
import {
  ASTRA_ESTIMATOR_MODEL,
  generateAstraEstimate,
  generateEstimateWithAstraFallback,
  normalizeEstimateTotals,
  parseAstraEstimate,
  type AstraEstimate,
  type AstraEstimateInput,
} from "../lib/astra-estimate";

const input: AstraEstimateInput = {
  description: "Replace the bathroom tile and vanity",
  photos: ["data:image/jpeg;base64,ZmFrZQ==", "data:image/jpeg;base64,YW5vdGhlcg=="],
  projectType: "Bathroom",
  postalCode: "M5V",
};

const validEstimate: AstraEstimate = {
  summary: "Preliminary bathroom renovation estimate.",
  scope: ["Replace tile", "Install a new vanity"],
  assumptions: ["No hidden water damage is visible."],
  line_items: [
    {
      name: "Tile installation",
      qty: 80,
      unit: "sq ft",
      material_cost: 1200,
      labor_cost: 1800,
      notes: "Confirm room measurements.",
    },
  ],
  totals: {
    materials: 1200,
    labor: 1800,
    permit_or_fees: 0,
    overhead_profit: 525,
    subtotal: 3000,
    tax_estimate: 458,
    total_low: 3458,
    total_high: 3977,
  },
  timeline: { duration_days_low: 3, duration_days_high: 6 },
  confidence: 0.62,
  questions_to_confirm: ["What tile finish is preferred?"],
  next_steps: ["Confirm dimensions before requesting contractor quotes."],
};

async function main() {
  let capturedModel: string | undefined;
  let capturedRequest: unknown;
  let capturedTimeout: number | undefined;
  const parsed = await generateAstraEstimate(input, async (request, options) => {
    capturedModel = request.model;
    capturedRequest = request;
    capturedTimeout = options.timeout;
    return { output_text: JSON.stringify(validEstimate) };
  });

  assert.equal(capturedModel, ASTRA_ESTIMATOR_MODEL);
  assert.equal(capturedTimeout, 18_000);
  assert.deepEqual(parsed, validEstimate);
  const firstPhoto = input.photos[0];
  assert.ok(firstPhoto);
  assert.equal(JSON.stringify(capturedRequest).includes(firstPhoto), true);
  assert.equal(JSON.stringify(capturedRequest).includes('"store":false'), true);
  assert.deepEqual(
    Object.keys(parsed).sort(),
    [
      "summary",
      "scope",
      "assumptions",
      "line_items",
      "totals",
      "timeline",
      "confidence",
      "questions_to_confirm",
      "next_steps",
    ].sort(),
  );

  const normalized = normalizeEstimateTotals({
    line_items: [{ material_cost: 100, labor_cost: 200 }],
    totals: { permit_or_fees: 50 },
  });
  assert.deepEqual(normalized.totals, {
    materials: 100,
    labor: 200,
    permit_or_fees: 50,
    overhead_profit: 53,
    subtotal: 300,
    tax_estimate: 52,
    total_low: 455,
    total_high: 523,
  });

  const invalidEstimate = structuredClone(validEstimate);
  const firstInvalidLineItem = invalidEstimate.line_items[0];
  assert.ok(firstInvalidLineItem);
  firstInvalidLineItem.material_cost = -1;
  assert.throws(
    () => parseAstraEstimate(JSON.stringify(invalidEstimate)),
    /invalid estimate/i,
  );
  assert.throws(() => parseAstraEstimate("{"), /invalid estimate JSON/i);

  let fallbackCalls = 0;
  let existingCalls = 0;
  let loggedTimeout = false;
  const timeoutFallback = await generateEstimateWithAstraFallback({
    enabled: true,
    generateAstra: async () => {
      throw new Error("Request timed out");
    },
    generateExisting: async () => {
      existingCalls += 1;
      return validEstimate;
    },
    generateAstraFallback: async () => {
      fallbackCalls += 1;
      return validEstimate;
    },
    onAstraError: (error) => {
      loggedTimeout = error instanceof Error && error.message === "Request timed out";
    },
  });
  assert.equal(loggedTimeout, true);
  assert.equal(fallbackCalls, 1);
  assert.equal(existingCalls, 0);
  assert.deepEqual(timeoutFallback, validEstimate);

  let astraCalls = 0;
  const disabledResult = await generateEstimateWithAstraFallback({
    enabled: false,
    generateAstra: async () => {
      astraCalls += 1;
      return validEstimate;
    },
    generateExisting: async () => validEstimate,
    onAstraError: () => assert.fail("Disabled Astra should not report an error"),
  });
  assert.equal(astraCalls, 0);
  assert.deepEqual(disabledResult, validEstimate);

  console.log("Astra estimator contract, validation, timeout, and fallback tests passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
