import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      projectType, 
      description, 
      location, 
      timeline, 
      budget, 
      companyName, 
      clientName,
      clientEmail,
      clientPhone 
    } = body;

    if (!projectType || !description || !companyName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a detailed prompt for the AI
    const prompt = `Generate a professional, legally-formatted contract and quote for the following project:

PROJECT DETAILS:
- Type: ${projectType}
- Description: ${description}
${location ? `- Location: ${location}` : ''}
${timeline ? `- Timeline: ${timeline}` : ''}
${budget ? `- Budget: ${budget}` : ''}

COMPANY & CLIENT:
- Contractor/Company: ${companyName}
${clientName ? `- Client Name: ${clientName}` : ''}
${clientEmail ? `- Client Email: ${clientEmail}` : ''}
${clientPhone ? `- Client Phone: ${clientPhone}` : ''}

Generate a comprehensive, professional contract that includes:
1. Header with company and client details
2. Project scope and description
3. Itemized cost breakdown with line items
4. Payment terms and schedule
5. Timeline and milestones
6. Terms and conditions
7. Warranty information
8. Cancellation policy
9. Signatures section

Format it in clean HTML with proper headings, sections, and professional styling. Use table for cost breakdown. Make it look like a real professional contract that could be signed. Include placeholder values where specific prices would go based on the project description.

The tone should be professional and legally sound. Include standard contract language for construction/renovation work.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a professional contract and quote generator for construction and renovation projects. You generate detailed, legally-formatted contracts with proper structure, terms, and conditions. Always format your output in clean HTML."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    const generatedQuote = completion.choices[0]?.message?.content;

    if (!generatedQuote) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: generatedQuote
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate quote'
      },
      { status: 500 }
    );
  }
}
