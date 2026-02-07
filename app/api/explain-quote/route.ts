// NEW API ROUTE: Explains quote pricing in plain English using AI
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, minCost, maxCost, items } = body;

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'Missing description' },
        { status: 400 }
      );
    }

    const prompt = `Explain this home renovation quote in plain, simple English. Break down the pricing so homeowners understand what they're paying for.

PROJECT: ${description}
ESTIMATED COST: $${minCost.toLocaleString()} - $${maxCost.toLocaleString()}

${items && items.length > 0 ? `
COST BREAKDOWN:
${items.map((item: any) => `- ${item.category}: $${item.minCost.toLocaleString()} - $${item.maxCost.toLocaleString()}
  ${item.description}`).join('\n')}
` : ''}

Please explain in 3-4 paragraphs:
1. MATERIALS: What materials are included and why they cost what they do
2. LABOR: Estimated hours and why skilled labor costs this amount
3. TIME & LOGISTICS: How long it takes and why (prep, installation, cleanup)
4. LOCATION FACTORS: Typical GTA/Toronto pricing and why

Be specific, friendly, and educational. Help homeowners understand the value. Use real numbers from their quote.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful renovation expert who explains construction costs in plain English. You break down pricing into materials, labor, time, and location factors. You're friendly, specific, and educational."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const explanation = completion.choices[0]?.message?.content;

    if (!explanation) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate explanation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      explanation
    });

  } catch (error) {
    console.error('Error explaining quote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate explanation'
      },
      { status: 500 }
    );
  }
}
