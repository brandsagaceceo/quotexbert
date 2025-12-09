import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { jobDescription, category, city, images } = await req.json();

    // Build a detailed prompt for AI quote estimation
    const prompt = `You are an expert contractor estimator in Toronto, Ontario, Canada. Analyze this home renovation job and provide a detailed cost breakdown.

Job Details:
- Category: ${category}
- Location: ${city}, Ontario
- Description: ${jobDescription}
${images && images.length > 0 ? `- Number of photos provided: ${images.length}` : ''}

Please provide:
1. Total estimated cost range (low and high) in CAD
2. Detailed breakdown by:
   - Materials cost
   - Labor cost
   - Permits (if applicable for Toronto/Ontario)
   - Disposal/cleanup
   - Miscellaneous/contingency
3. Timeline estimate (in days/weeks)
4. Key considerations specific to Toronto/GTA (permits, weather, etc.)
5. Risk factors that might affect the quote
6. Recommended contractor specialties needed

Format your response as JSON with this structure:
{
  "estimatedCostLow": number,
  "estimatedCostHigh": number,
  "breakdown": {
    "materials": number,
    "labor": number,
    "permits": number,
    "disposal": number,
    "contingency": number
  },
  "timeline": {
    "min": number,
    "max": number,
    "unit": "days" or "weeks"
  },
  "considerations": [string],
  "riskFactors": [string],
  "recommendedSpecialties": [string],
  "confidence": "low" | "medium" | "high"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert construction estimator in Toronto, Canada. Provide accurate, detailed cost estimates based on 2025 Toronto/GTA market rates. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const result = completion.choices[0]?.message?.content;
    if (!result) {
      throw new Error("No response from AI");
    }

    const aiQuote = JSON.parse(result);

    return NextResponse.json({
      success: true,
      quote: aiQuote,
      disclaimer: "This is an AI-generated estimate based on typical Toronto/GTA market rates. Actual costs may vary. Get professional quotes for accuracy."
    });

  } catch (error) {
    console.error("AI Quote Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate AI quote",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
