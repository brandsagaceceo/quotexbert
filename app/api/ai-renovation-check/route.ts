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

    if (!photo || !question) {
      return NextResponse.json(
        { error: "Photo and question are required" },
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
          content: `You are an expert construction inspector and renovation quality assessor. Analyze photos of renovation work and provide detailed, accurate assessments based on construction standards, building codes, and best practices. 

Your response must be in JSON format with these fields:
- severity: "good" | "warning" | "poor"
- assessment: Brief overall assessment (2-3 sentences)
- observations: Array of specific things you notice in the photo
- standards: Explanation of relevant construction standards
- recommendations: Array of actionable recommendations

Be specific, practical, and constructive. Focus on visible issues and standard practices.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this renovation work and answer: ${question}`,
            },
            {
              type: "image_url",
              image_url: {
                url: photo,
              },
            },
          ],
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
