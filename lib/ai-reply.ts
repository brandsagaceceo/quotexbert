/**
 * AI Reply Assistant — business logic for message enhancement
 *
 * Used by: POST /api/ai/enhance-message
 *
 * Architecture note:
 * - This file contains ALL the AI logic. The route handler is a thin wrapper.
 * - Fetches real conversation history from DB when conversationId is provided.
 * - Adapts system prompt based on user role (contractor vs homeowner).
 * - Degrades gracefully: if OpenAI is not configured, returns the original message.
 */

import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export interface EnhanceReplyParams {
  /** The draft message the user wants to improve */
  message: string;
  /** Conversation ID — used to fetch recent message history for context */
  conversationId?: string;
  /** User role — determines the tone and goal of the prompt */
  role: "contractor" | "homeowner" | string;
  /** Job title — adds project context to the prompt */
  jobTitle?: string;
  /** Job description — additional project context */
  jobDescription?: string;
}

export interface EnhanceReplyResult {
  /** The AI-improved message. Falls back to original if AI is unavailable. */
  improvedMessage: string;
}

/**
 * Build a recent-messages context string from conversation history.
 * Uses the last 8 messages (chronological order) so the AI understands
 * the current tone, what's been said, and what still needs to be addressed.
 */
async function getConversationContext(conversationId: string): Promise<string> {
  try {
    const recentMessages = await prisma.conversationMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        content: true,
        senderRole: true,
      },
    });

    if (recentMessages.length === 0) return "";

    // Reverse to chronological order
    const lines = [...recentMessages]
      .reverse()
      .map((m) => `[${m.senderRole.toUpperCase()}]: ${m.content}`)
      .join("\n");

    return `\n\nRECENT CONVERSATION:\n${lines}`;
  } catch {
    // Non-fatal — proceed without history if DB is unavailable
    return "";
  }
}

/**
 * Build the system prompt tailored to the user's role.
 */
function buildSystemPrompt(role: string): string {
  if (role === "contractor") {
    return `You are a professional communication assistant helping a home renovation contractor win jobs on a marketplace platform called QuoteXbert.

Your goal is to improve the contractor's message so it:
- Sounds professional, competent, and trustworthy
- Builds confidence with the homeowner
- Clearly communicates the contractor's value without sounding pushy or desperate
- Stays warm, approachable and human
- Keeps the message focused and under 120 words
- Increases the likelihood the homeowner chooses this contractor

Return ONLY the improved message text. Do not add explanations, preamble, or quotation marks around the response.`;
  }

  // Homeowner prompt
  return `You are a communication assistant helping a homeowner get the best results from a home renovation project on a platform called QuoteXbert.

Your goal is to improve the homeowner's message so it:
- Asks clearer and more specific questions that get useful answers
- Communicates the project needs and expectations precisely
- Avoids ambiguity that could lead to misquotes or misunderstandings
- Stays friendly, respectful, and concise (under 100 words)

Return ONLY the improved message text. Do not add explanations, preamble, or quotation marks around the response.`;
}

/**
 * Improve a user's draft message using GPT-4o with conversation context.
 *
 * @param params - Message, optional conversation ID, role, and job context
 * @returns Improved message text (or original if AI is unavailable)
 */
export async function enhanceReply(
  params: EnhanceReplyParams
): Promise<EnhanceReplyResult> {
  const { message, conversationId, role, jobTitle, jobDescription } = params;

  // Graceful degradation when OpenAI is not configured
  if (!openai) {
    console.warn("[ai-reply] OPENAI_API_KEY not configured — returning original message");
    return { improvedMessage: message };
  }

  // Fetch conversation context (non-blocking if it fails)
  const conversationContext = conversationId
    ? await getConversationContext(conversationId)
    : "";

  // Build the user prompt with all available context
  const contextParts: string[] = [];
  if (jobTitle) contextParts.push(`PROJECT: ${jobTitle}`);
  if (jobDescription) contextParts.push(`DESCRIPTION: ${jobDescription}`);
  if (conversationContext) contextParts.push(conversationContext);
  contextParts.push(`\nMESSAGE TO IMPROVE:\n${message}`);

  const userPrompt = contextParts.join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: buildSystemPrompt(role) },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 220,
    });

    const improved = completion.choices[0]?.message?.content?.trim();

    if (!improved) {
      return { improvedMessage: message };
    }

    return { improvedMessage: improved };
  } catch (error) {
    console.error("[ai-reply] OpenAI call failed:", error);
    // Return original message on API error — never crash the caller
    return { improvedMessage: message };
  }
}
