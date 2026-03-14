import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo') 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

/**
 * POST /api/ai-renovation-check
 * Analyze renovation work quality from photos
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { photo, question } = body;

    if (!question) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (!openai) {
      return NextResponse.json(
        { error: "AI service not available" },
        { status: 503 }
      );
    }

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a knowledgeable renovation advisor. Answer the user's renovation or home improvement question directly and practically. If a photo is provided, analyze what you see and give specific feedback about that photo. If no photo is provided, give practical guidance based on their description.

Answer the specific question they asked. If they ask "does this room need painting?" — answer that directly. If they ask about paint prep — assess the prep. Don't deflect to "hire a professional" or "check building codes" unless there is a genuine safety concern. Be direct, helpful, and focused on what the person actually asked.

Your response must be in JSON format with these exact fields:
- severity: "good" | "warning" | "poor" (based on the overall situation)
- assessment: Direct 2-3 sentence answer to their specific question
- observations: Array of specific things you notice (from photo or from their description)
- standards: Relevant best practices or tips for this type of work (keep it brief and practical)
- recommendations: Array of practical, actionable next steps`,
        },
        {
          role: "user",
          content: photo
            ? [
                {
                  type: "text" as const,
                  text: `Please analyze this renovation work and answer: ${question}`,
                },
                {
                  type: "image_url" as const,
                  image_url: {
                    url: photo,
                  },
                },
              ]
            : `Please answer this renovation question: ${question}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      // If not JSON, format it ourselves
      result = {
        severity: "warning",
        assessment: content,
        observations: [],
        standards: "",
        recommendations: [],
      };
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[AI_RENOVATION_CHECK]", error);
    return NextResponse.json(
      { error: "Failed to analyze work. Please try again." },
      { status: 500 }
    );
  }
}
