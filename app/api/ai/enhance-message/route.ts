// AI Reply Assistant — route handler
// Business logic lives in lib/ai-reply.ts (keep this file thin).
import { NextRequest, NextResponse } from "next/server";
import { enhanceReply } from "@/lib/ai-reply";

/**
 * POST /api/ai/enhance-message
 *
 * Body:
 *   message         string  (required) — draft text to improve
 *   conversationId  string  (optional) — used to pull recent chat history
 *   role            string  (required) — "contractor" | "homeowner"
 *   jobTitle        string  (optional) — project title for context
 *   jobDescription  string  (optional) — project description for context
 *
 * Returns:
 *   { improvedMessage: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationId, role, jobTitle, jobDescription } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (!role) {
      return NextResponse.json({ error: "User role is required" }, { status: 400 });
    }

    const result = await enhanceReply({
      message: message.trim(),
      conversationId: conversationId || undefined,
      role,
      jobTitle: jobTitle || undefined,
      jobDescription: jobDescription || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[POST /api/ai/enhance-message] Error:", error);
    return NextResponse.json({ error: "Failed to enhance message" }, { status: 500 });
  }
}
