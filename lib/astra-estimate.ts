import type {
  Response,
  ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses";

export const ASTRA_ESTIMATOR_MODEL = "gpt-6-astra";
export const ASTRA_REQUEST_TIMEOUT_MS = 18_000;

export function normalizeEstimateTotals<
  T extends {
    line_items: Array<{ material_cost?: number; labor_cost?: number }>;
    totals: { permit_or_fees?: number };
  },
>(estimate: T) {
  const materialsTotal = estimate.line_items.reduce(
    (sum, item) => sum + (item.material_cost || 0),
    0,
  );
  const laborTotal = estimate.line_items.reduce(
    (sum, item) => sum + (item.labor_cost || 0),
    0,
  );
  const subtotal = materialsTotal + laborTotal;
  const overheadProfit = Math.round(subtotal * 0.175);
  const beforeTax = subtotal + overheadProfit + (estimate.totals.permit_or_fees || 0);
  const taxEstimate = Math.round(beforeTax * 0.13);
  const totalLow = beforeTax + taxEstimate;
  const totalHigh = Math.round(totalLow * 1.15);

  return {
    ...estimate,
    totals: {
      materials: Math.round(materialsTotal),
      labor: Math.round(laborTotal),
      permit_or_fees: estimate.totals.permit_or_fees || 0,
      overhead_profit: overheadProfit,
      subtotal: Math.round(subtotal),
      tax_estimate: taxEstimate,
      total_low: totalLow,
      total_high: totalHigh,
    },
  };
}

export interface AstraEstimateInput {
  description: string;
  photos: string[];
  projectType: string;
  postalCode: string;
}

export interface AstraEstimate {
  summary: string;
  scope: string[];
  assumptions: string[];
  line_items: Array<{
    name: string;
    qty: number;
    unit: string;
    material_cost: number;
    labor_cost: number;
    notes: string;
  }>;
  totals: {
    materials: number;
    labor: number;
    permit_or_fees: number;
    overhead_profit: number;
    subtotal: number;
    tax_estimate: number;
    total_low: number;
    total_high: number;
  };
  timeline: {
    duration_days_low: number;
    duration_days_high: number;
  };
  confidence: number;
  questions_to_confirm: string[];
  next_steps: string[];
}

const estimateSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "scope",
    "assumptions",
    "line_items",
    "totals",
    "timeline",
    "confidence",
    "questions_to_confirm",
    "next_steps",
  ],
  properties: {
    summary: { type: "string" },
    scope: { type: "array", items: { type: "string" } },
    assumptions: { type: "array", items: { type: "string" } },
    line_items: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "qty", "unit", "material_cost", "labor_cost", "notes"],
        properties: {
          name: { type: "string" },
          qty: { type: "number" },
          unit: { type: "string" },
          material_cost: { type: "number" },
          labor_cost: { type: "number" },
          notes: { type: "string" },
        },
      },
    },
    totals: {
      type: "object",
      additionalProperties: false,
      required: [
        "materials",
        "labor",
        "permit_or_fees",
        "overhead_profit",
        "subtotal",
        "tax_estimate",
        "total_low",
        "total_high",
      ],
      properties: {
        materials: { type: "number" },
        labor: { type: "number" },
        permit_or_fees: { type: "number" },
        overhead_profit: { type: "number" },
        subtotal: { type: "number" },
        tax_estimate: { type: "number" },
        total_low: { type: "number" },
        total_high: { type: "number" },
      },
    },
    timeline: {
      type: "object",
      additionalProperties: false,
      required: ["duration_days_low", "duration_days_high"],
      properties: {
        duration_days_low: { type: "number" },
        duration_days_high: { type: "number" },
      },
    },
    confidence: { type: "number" },
    questions_to_confirm: { type: "array", items: { type: "string" } },
    next_steps: { type: "array", items: { type: "string" } },
  },
} as const;

const estimateSystemPrompt = `You are a renovation estimator specializing in the Greater Toronto Area and Southern Ontario. Produce a preliminary estimate in CAD using the provided project description and every photo.

Treat image observations as visual assumptions, not measured facts. Do not invent dimensions, hidden conditions, or scope that is not described or clearly visible. State uncertainty, use conservative estimates, and ask specific questions when details are missing. These are preliminary ranges, not measured quantities or guaranteed contractor prices. Account for Ontario HST and likely permit requirements where relevant.

Return an itemized estimate with material and labour costs, scope, assumptions, timeline, confidence from 0 to 1, questions to confirm, and practical next steps. Costs and totals must be non-negative.`;

export type AstraResponseCreator = (
  request: ResponseCreateParamsNonStreaming,
  options: { timeout: number },
) => Promise<Pick<Response, "output_text">>;

export function buildAstraRequest(
  input: AstraEstimateInput,
): ResponseCreateParamsNonStreaming {
  const photoNote = input.photos.length
    ? `\n${input.photos.length} photo${input.photos.length === 1 ? "" : "s"} provided.`
    : "";
  const projectDetails = [
    `Project Type: ${input.projectType}`,
    input.postalCode ? `Location: ${input.postalCode} (Ontario)` : "",
    input.description.trim()
      ? `Project Description: ${input.description}`
      : "Estimate the visible work for the selected project type.",
    photoNote,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    model: ASTRA_ESTIMATOR_MODEL,
    reasoning: { effort: "low" },
    max_output_tokens: 2500,
    store: false,
    input: [
      { role: "system", content: estimateSystemPrompt },
      {
        role: "user",
        content: [
          { type: "input_text", text: projectDetails },
          ...input.photos.map((photo) => ({
            type: "input_image" as const,
            image_url: photo,
            detail: "auto" as const,
          })),
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "renovation_estimate",
        strict: true,
        schema: estimateSchema,
      },
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isAstraLineItem(
  value: unknown,
): value is AstraEstimate["line_items"][number] {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.unit === "string" &&
    value.unit.trim().length > 0 &&
    typeof value.notes === "string" &&
    isNonNegativeNumber(value.qty) &&
    isNonNegativeNumber(value.material_cost) &&
    isNonNegativeNumber(value.labor_cost)
  );
}

function isAstraEstimate(value: unknown): value is AstraEstimate {
  if (
    !isRecord(value) ||
    typeof value.summary !== "string" ||
    value.summary.trim().length === 0 ||
    !isStringArray(value.scope) ||
    !isStringArray(value.assumptions) ||
    typeof value.confidence !== "number" ||
    !Number.isFinite(value.confidence) ||
    value.confidence < 0 ||
    value.confidence > 1 ||
    !isStringArray(value.questions_to_confirm) ||
    !isStringArray(value.next_steps)
  ) {
    return false;
  }

  const lineItems = value.line_items;
  const totals = value.totals;
  const timeline = value.timeline;
  if (
    !Array.isArray(lineItems) ||
    !lineItems.every(isAstraLineItem) ||
    !isRecord(totals) ||
    !isRecord(timeline)
  ) {
    return false;
  }

  const totalKeys = [
    "materials",
    "labor",
    "permit_or_fees",
    "overhead_profit",
    "subtotal",
    "tax_estimate",
    "total_low",
    "total_high",
  ] as const;
  const totalValues = totalKeys.map((key) => totals[key]);
  const durationLow = timeline.duration_days_low;
  const durationHigh = timeline.duration_days_high;
  const totalLow = totals.total_low;
  const totalHigh = totals.total_high;

  return (
    totalValues.every(isNonNegativeNumber) &&
    isNonNegativeNumber(durationLow) &&
    isNonNegativeNumber(durationHigh) &&
    durationHigh >= durationLow &&
    isNonNegativeNumber(totalLow) &&
    isNonNegativeNumber(totalHigh) &&
    totalHigh >= totalLow
  );
}

export function parseAstraEstimate(outputText: string): AstraEstimate {
  let value: unknown;
  try {
    value = JSON.parse(outputText);
  } catch {
    throw new Error("Astra returned invalid estimate JSON");
  }

  if (!isAstraEstimate(value)) {
    throw new Error("Astra returned an invalid estimate");
  }

  return value;
}

export async function generateAstraEstimate(
  input: AstraEstimateInput,
  createResponse: AstraResponseCreator,
): Promise<AstraEstimate> {
  const response = await createResponse(buildAstraRequest(input), {
    timeout: ASTRA_REQUEST_TIMEOUT_MS,
  });
  return parseAstraEstimate(response.output_text);
}

export async function generateEstimateWithAstraFallback<T>(options: {
  enabled: boolean;
  generateAstra: () => Promise<T>;
  generateExisting: () => Promise<T>;
  generateAstraFallback?: () => Promise<T>;
  onAstraError: (error: unknown) => void;
}): Promise<T> {
  if (!options.enabled) {
    return options.generateExisting();
  }

  try {
    return await options.generateAstra();
  } catch (error) {
    options.onAstraError(error);
    return options.generateAstraFallback
      ? options.generateAstraFallback()
      : options.generateExisting();
  }
}
