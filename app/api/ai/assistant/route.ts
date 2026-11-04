import { NextRequest, NextResponse } from "next/server";
import {
  buildAssistantSystemPrompt,
  isQuoteXbertAiEnabled,
  parseAssistantChatInput,
  parseAssistantResponse,
} from "@/lib/ai-assistant";
import {
  getOpenAIClient,
  OPENAI_MODELS,
} from "@/lib/openai-client";
import { reserveGlobalAiRequest } from "@/lib/ai-usage-budget";
import { resolveAuthUser } from "@/lib/server-auth";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import { getPrivateImage, isPrivatePhotoOwnedBy, privatePhotoPath } from "@/lib/upload";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ASSISTANT_LIMIT_PER_HOUR = 6;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const assistantResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["reply", "followUpQuestions", "jobDraft"],
  properties: {
    reply: { type: "string" },
    followUpQuestions: {
      type: "array",
      items: { type: "string" },
    },
    jobDraft: {
      type: ["object", "null"],
      additionalProperties: false,
      required: [
        "title",
        "description",
        "category",
        "city",
        "province",
        "zipCode",
        "budget",
        "timeline",
        "materials",
      ],
      properties: {
        title: { type: "string" },
        description: { type: "string" },
        category: { type: "string" },
        city: { type: ["string", "null"] },
        province: { type: ["string", "null"] },
        zipCode: { type: ["string", "null"] },
        budget: { type: ["string", "null"] },
        timeline: { type: ["string", "null"] },
        materials: { type: "array", items: { type: "string" } },
      },
    },
  },
} as const;

export async function GET() {
  return NextResponse.json({ enabled: isQuoteXbertAiEnabled() });
}

export async function POST(request: NextRequest) {
  if (!isQuoteXbertAiEnabled()) {
    return NextResponse.json({ error: "AI assistant is disabled" }, { status: 404 });
  }

  const identity = await resolveAuthUser();
  if ("error" in identity) {
    return NextResponse.json({ error: identity.error }, { status: identity.status });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id: identity.user.dbUserId },
        { clerkUserId: identity.user.clerkUserId },
      ],
    },
    select: { role: true },
  });
  const role = user?.role;
  if (role !== "homeowner" && role !== "contractor") {
    return NextResponse.json({ error: "Homeowner or contractor account required" }, { status: 403 });
  }

  let homeownerIdentity: Awaited<ReturnType<typeof resolveHomeownerIdentity>> | null = null;
  if (role === "homeowner") {
    homeownerIdentity = await resolveHomeownerIdentity();
    if (!homeownerIdentity.success) {
      return NextResponse.json(
        { error: homeownerIdentity.error },
        { status: homeownerIdentity.status },
      );
    }
  }

  const bodyText = await request.text();
  if (bodyText.length > 32_000) {
    return NextResponse.json({ error: "Request is too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(bodyText);
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const chat = parseAssistantChatInput(body);
  if (!chat || chat.messages[chat.messages.length - 1]?.role !== "user") {
    return NextResponse.json({ error: "Invalid assistant request" }, { status: 400 });
  }

  if (role !== "homeowner" && chat.photos.length > 0) {
    return NextResponse.json({ error: "Photo analysis is available to homeowners only" }, { status: 403 });
  }

  if (
    chat.photos.some(
      (photo) =>
        !isPrivatePhotoOwnedBy(photo, identity.user.dbUserId) ||
        !privatePhotoPath(photo),
    )
  ) {
    return NextResponse.json({ error: "Photos must belong to this homeowner" }, { status: 400 });
  }

  const client = getOpenAIClient();
  if (!client) {
    return NextResponse.json({ error: "AI service is not configured" }, { status: 503 });
  }

  const withinLimit = await consumeAssistantAllowance(identity.user.dbUserId);
  if (!withinLimit) {
    return NextResponse.json({ error: "Assistant usage limit reached. Try again later." }, { status: 429 });
  }

  try {
    const imageParts = await Promise.all(
      chat.photos.map(async (photo) => {
        const pathname = privatePhotoPath(photo);
        if (!pathname) throw new Error("INVALID_PRIVATE_PHOTO");
        const image = await getPrivateImage(pathname);
        if (!image) throw new Error("PRIVATE_PHOTO_NOT_FOUND");
        const contentType = image.blob.contentType;
        if (
          typeof contentType !== "string" ||
          !["image/jpeg", "image/png", "image/webp"].includes(contentType)
        ) {
          throw new Error("UNSUPPORTED_PRIVATE_PHOTO");
        }

        const bytes = Buffer.from(await new Response(image.stream).arrayBuffer());
        if (bytes.length > MAX_IMAGE_BYTES) throw new Error("PRIVATE_PHOTO_TOO_LARGE");
        return {
          type: "input_image" as const,
          image_url: `data:${contentType};base64,${bytes.toString("base64")}`,
          detail: "auto" as const,
        };
      }),
    );

    const history = chat.messages.slice(0, -1).map((message) => ({
      role: message.role,
      content: message.content,
    }));
    const latestMessage = chat.messages[chat.messages.length - 1];
    if (!latestMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!(await reserveGlobalAiRequest("homeowner_assistant"))) {
      return NextResponse.json(
        { error: "AI usage budget is unavailable or exhausted" },
        { status: 429 },
      );
    }

    const response = await client.responses.create(
      {
        model: OPENAI_MODELS.homeownerAssistant,
        reasoning: { effort: "low" },
        max_output_tokens: 1400,
        store: false,
        input: [
          { role: "system", content: buildAssistantSystemPrompt(role) },
          ...history,
          {
            role: "user",
            content: [
              { type: "input_text", text: latestMessage.content },
              ...imageParts,
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "quotexbert_assistant",
            strict: true,
            schema: assistantResponseSchema,
          },
        },
      },
      { timeout: 30_000 },
    );

    let parsed: ReturnType<typeof parseAssistantResponse> = null;
    try {
      parsed = parseAssistantResponse(JSON.parse(response.output_text || ""));
    } catch {
      parsed = null;
    }
    if (!parsed) {
      console.error("[AI Assistant] Invalid structured response");
      return NextResponse.json({ error: "Assistant response could not be validated" }, { status: 502 });
    }

    if (role === "contractor") parsed.jobDraft = null;
    let savedProjectId: string | null = null;
    if (parsed.jobDraft && homeownerIdentity?.success) {
      const draft = parsed.jobDraft;
      const category = normalizeProjectCategory(draft.category);
      const savedProject = await prisma.savedProject.create({
        data: {
          homeownerId: homeownerIdentity.user.dbUserId,
          title: draft.title,
          description: draft.description,
          category,
          city: draft.city,
          province: draft.province,
          zipCode: draft.zipCode?.toUpperCase() ?? null,
          location: [draft.city, draft.province].filter(Boolean).join(", ") || null,
          budget: draft.budget,
          photos: JSON.stringify(chat.photos),
          visualizerImages: "[]",
          estimateSummary: JSON.stringify({
            source: "QuoteXbert guided assistant",
            timeline: draft.timeline,
            materials: draft.materials,
            estimateRange: null,
          }),
          status: "draft",
        },
        select: { id: true },
      });
      savedProjectId = savedProject.id;
    }

    return NextResponse.json({
      success: true,
      reply: parsed.reply,
      followUpQuestions: parsed.followUpQuestions,
      jobDraft: parsed.jobDraft && savedProjectId
        ? { ...parsed.jobDraft, id: savedProjectId }
        : null,
    });
  } catch (error) {
    console.error("[AI Assistant] Request failed", {
      errorType:
        error instanceof Error && /^[A-Za-z][A-Za-z0-9_]{0,39}$/.test(error.name)
          ? error.name
          : "UnknownError",
    });
    return NextResponse.json({ error: "AI assistant request failed" }, { status: 503 });
  }
}

async function consumeAssistantAllowance(userId: string) {
  const windowStart = new Date(Date.now() - 60 * 60 * 1000);
  return prisma.$transaction(
    async (transaction) => {
      const used = await transaction.analytics.count({
        where: {
          eventName: "ai_assistant_usage",
          userId,
          timestamp: { gte: windowStart },
        },
      });
      if (used >= ASSISTANT_LIMIT_PER_HOUR) return false;

      await transaction.analytics.create({
        data: {
          eventName: "ai_assistant_usage",
          userId,
          eventData: { model: OPENAI_MODELS.homeownerAssistant },
        },
      });
      return true;
    },
    { isolationLevel: "Serializable" },
  );
}

function normalizeProjectCategory(category: string) {
  const normalized = category.toLowerCase().replace(/[^a-z0-9 -]/g, "").trim();
  const supported = new Set([
    "bathroom",
    "basement",
    "deck",
    "electrical",
    "flooring",
    "general",
    "hvac",
    "kitchen",
    "painting",
    "plumbing",
    "roofing",
    "windows",
  ]);
  return supported.has(normalized) ? normalized : "general";
}
