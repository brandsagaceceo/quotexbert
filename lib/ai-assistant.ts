import { isAiFeatureEnabled } from "@/lib/openai-client";

export interface AssistantChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantChatInput {
  messages: AssistantChatMessage[];
  photos: string[];
}

export interface AssistantJobDraft {
  title: string;
  description: string;
  category: string;
  city: string | null;
  province: string | null;
  zipCode: string | null;
  budget: string | null;
  timeline: string | null;
  materials: string[];
}

export interface AssistantResponse {
  reply: string;
  followUpQuestions: string[];
  jobDraft: AssistantJobDraft | null;
}

export function isQuoteXbertAiEnabled() {
  return isAiFeatureEnabled("QUOTEXBERT_AI_ENABLED");
}

export function parseAssistantChatInput(value: unknown): AssistantChatInput | null {
  if (!value || typeof value !== "object") return null;

  const body = value as Record<string, unknown>;
  if (
    !Array.isArray(body.messages) ||
    body.messages.length < 1 ||
    body.messages.length > 8 ||
    !Array.isArray(body.photos) ||
    body.photos.length > 3
  ) {
    return null;
  }

  const messages: AssistantChatMessage[] = [];
  for (const item of body.messages) {
    if (
      !item ||
      typeof item !== "object" ||
      !["user", "assistant"].includes((item as Record<string, unknown>).role as string) ||
      typeof (item as Record<string, unknown>).content !== "string"
    ) {
      return null;
    }

    const message = item as Record<string, unknown>;
    const content = (message.content as string).trim();
    if (!content || content.length > 1200) return null;
    messages.push({
      role: message.role as AssistantChatMessage["role"],
      content,
    });
  }

  const photos: string[] = [];
  for (const photo of body.photos) {
    if (typeof photo !== "string" || photo.length > 2048) return null;
    photos.push(photo);
  }

  return { messages, photos };
}

export function parseAssistantResponse(value: unknown): AssistantResponse | null {
  if (!value || typeof value !== "object") return null;

  const response = value as Record<string, unknown>;
  if (
    typeof response.reply !== "string" ||
    response.reply.trim().length === 0 ||
    response.reply.length > 4000 ||
    !Array.isArray(response.followUpQuestions) ||
    response.followUpQuestions.length > 5 ||
    !response.followUpQuestions.every(
      (question) => typeof question === "string" && question.length <= 300,
    )
  ) {
    return null;
  }

  if (response.jobDraft === null) {
    return {
      reply: response.reply.trim(),
      followUpQuestions: response.followUpQuestions as string[],
      jobDraft: null,
    };
  }

  if (!response.jobDraft || typeof response.jobDraft !== "object") return null;
  const draft = response.jobDraft as Record<string, unknown>;
  if (
    typeof draft.title !== "string" ||
    !draft.title.trim() ||
    draft.title.length > 120 ||
    typeof draft.description !== "string" ||
    !draft.description.trim() ||
    draft.description.length > 3000 ||
    typeof draft.category !== "string" ||
    !draft.category.trim() ||
    draft.category.length > 80 ||
    !isNullableString(draft.city, 100) ||
    !isNullableString(draft.province, 50) ||
    !isNullableString(draft.zipCode, 20) ||
    !isNullableString(draft.budget, 120) ||
    !isNullableString(draft.timeline, 120) ||
    !Array.isArray(draft.materials) ||
    draft.materials.length > 12 ||
    !draft.materials.every(
      (material) => typeof material === "string" && material.length <= 120,
    )
  ) {
    return null;
  }

  return {
    reply: response.reply.trim(),
    followUpQuestions: response.followUpQuestions as string[],
    jobDraft: {
      title: draft.title.trim(),
      description: draft.description.trim(),
      category: draft.category.trim(),
      city: trimNullable(draft.city),
      province: trimNullable(draft.province),
      zipCode: trimNullable(draft.zipCode),
      budget: trimNullable(draft.budget),
      timeline: trimNullable(draft.timeline),
      materials: draft.materials as string[],
    },
  };
}

export function buildAssistantSystemPrompt(role: "homeowner" | "contractor") {
  const shared = `You are QuoteXbert's guided renovation assistant for Ontario homeowners and contractors.
Give practical help about renovation scope, photos, materials, budget planning, timelines, estimates, and QuoteXbert workflows. A photo is visual context, not a measured survey. Never claim hidden conditions or exact dimensions are known. Clearly qualify estimates and recommend licensed professionals for safety-critical work. Use only pricing ranges supplied in the conversation; do not invent market rates, permits, or savings. Discuss a homeowner's supplied estimate, but do not generate or alter a numeric estimate; direct them to QuoteXbert's existing Quick Estimator for a new estimate.
Return only JSON matching the required response schema. Never publish a job, contact a contractor, send a message, or make a payment.`;

  if (role === "contractor") {
    return `${shared}
Help contractors draft clearer estimates and inquiries, organize scope, and navigate QuoteXbert. Contractor assistance is advisory only; do not send or save a quote. Always set jobDraft to null.`;
  }

  return `${shared}
Help homeowners clarify their renovation plan and ask useful follow-up questions. If they explicitly ask to prepare a job/project draft, create a draft with only facts they provided. Leave unknown city, province, postal code, budget, timeline, and materials empty/null rather than inventing them. A draft is private until the homeowner edits it and explicitly publishes it.`;
}

function isNullableString(value: unknown, maxLength: number): boolean {
  return value === null || (typeof value === "string" && value.length <= maxLength);
}

function trimNullable(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
