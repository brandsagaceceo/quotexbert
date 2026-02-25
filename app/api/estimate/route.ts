import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo') ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface EstimateRequest {
  description?: string;
  photos?: string[]; // base64 encoded images
  projectType: string;
  postalCode?: string;
  userId?: string;
}

// AI estimate using real OpenAI API with multimodal support
export async function POST(req: NextRequest) {
  try {
    const body: EstimateRequest = await req.json();
    const { description, photos, projectType, postalCode, userId } = body;

    // Validation
    if (!projectType) {
      return NextResponse.json(
        { error: "Project type is required" },
        { status: 400 },
      );
    }

    if ((!description || description.trim().length < 3) && (!photos || photos.length === 0)) {
      return NextResponse.json(
        { error: "Please provide either a description or upload photos" },
        { status: 400 },
      );
    }

    // Validate photo count and size
    if (photos && photos.length > 5) {
      return NextResponse.json(
        { error: "Maximum 5 photos allowed" },
        { status: 400 },
      );
    }

    // Check if OpenAI API key is configured
    if (!openai) {
      console.warn("OpenAI API key not configured, using fallback");
      const estimate = generateFallbackEstimate(description?.toLowerCase() || projectType.toLowerCase());
      return NextResponse.json(estimate);
    }

    // Generate AI-powered estimate using OpenAI (multimodal)
    const estimate = await generateAIEstimateMultimodal({
      description: description || "",
      photos: photos || [],
      projectType,
      postalCode: postalCode || "",
    });

    // Log analytics event
    await logEventServer(
      userId || "anonymous",
      "estimate_created",
      {
        projectType,
        hasDescription: !!description,
        photoCount: photos?.length || 0,
        postalCode: postalCode || "not_provided",
        estimateTotal: estimate.totals.total_low,
        confidence: estimate.confidence,
        aiPowered: true,
      }
    );

    return NextResponse.json(estimate);
  } catch (error) {
    console.error("Error generating estimate:", error);
    
    // Fallback to basic estimate if OpenAI fails
    try {
      const body = await req.json();
      const fallbackEstimate = generateFallbackEstimate(
        body.description?.toLowerCase() || body.projectType?.toLowerCase() || "home repair"
      );
      return NextResponse.json({
        ...fallbackEstimate,
        warning: "AI service temporarily unavailable, using basic estimate"
      });
    } catch {
      return NextResponse.json(
        { error: "Failed to generate estimate" },
        { status: 500 },
      );
    }
  }
}

async function generateAIEstimateMultimodal(params: {
  description: string;
  photos: string[];
  projectType: string;
  postalCode: string;
}): Promise<{
  summary: string;
  scope: string[];
  assumptions: string[];
  line_items: Array<{
    name: string;
    qty: number;
    unit: string;
    material_cost: number;
    labor_cost: number;
    notes?: string;
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
}> {
  const { description, photos, projectType, postalCode } = params;

  // Build the prompt for detailed contractor-style estimate
  const systemPrompt = `You are an expert contractor and cost estimator specializing in the Greater Toronto Area (GTA) and Southern Ontario. You provide detailed, contractor-style estimates with line items, accurate CAD pricing based on current 2026 Toronto/GTA market rates, and realistic timelines.

IMPORTANT PRICING CONTEXT:
- All prices must be in CAD (Canadian Dollars)
- Use current 2026 GTA/Toronto labor rates: $65-95/hour for skilled trades
- Include Ontario HST (13%) in tax calculations
- Factor in typical GTA material costs (10-15% higher than US pricing)
- Consider permit requirements for Toronto/Ontario
- Account for GTA-specific challenges (old homes, narrow lots, winter conditions)

RESPONSE FORMAT:
You must respond with ONLY a valid JSON object (no markdown, no explanations outside JSON) with this exact structure:
{
  "summary": "Brief 2-3 sentence overview of the project",
  "scope": ["Detailed scope item 1", "Detailed scope item 2", ...],
  "assumptions": ["Assumption 1", "Assumption 2", ...],
  "line_items": [
    {
      "name": "Item name",
      "qty": number,
      "unit": "sq ft | linear ft | each | etc",
      "material_cost": number,
      "labor_cost": number,
      "notes": "Optional notes about this line item"
    }
  ],
  "totals": {
    "materials": number,
    "labor": number,
    "permit_or_fees": number,
    "overhead_profit": number,
    "subtotal": number,
    "tax_estimate": number,
    "total_low": number,
    "total_high": number
  },
  "timeline": {
    "duration_days_low": number,
    "duration_days_high": number
  },
  "confidence": number between 0-1,
  "questions_to_confirm": ["Question 1?", "Question 2?", ...],
  "next_steps": ["Step 1", "Step 2", ...]
}

ESTIMATION GUIDELINES:
- Be realistic and conservative with pricing
- Break down costs into granular line items (materials + labor separately)
- Include permit costs when applicable (Toronto building permits typically $500-2000)
- Add 15-20% overhead and profit for contractor
- If photos are unclear or information is limited, reduce confidence score and add specific questions
- Provide 5-10 line items minimum for substantial projects
- Timeline should account for permits, inspections, material delivery
- Always provide actionable next steps`;

  // Build content array with text and images
  const contentParts: Array<{ type: string; text?: string; image_url?: { url: string } }> = [];

  // Add description if provided
  if (description && description.trim()) {
    contentParts.push({
      type: "text",
      text: `Project Type: ${projectType}\n${postalCode ? `Location: ${postalCode} (GTA/Ontario)\n` : ''}Project Description: ${description}`,
    });
  } else {
    contentParts.push({
      type: "text",
      text: `Project Type: ${projectType}\n${postalCode ? `Location: ${postalCode} (GTA/Ontario)\n` : ''}Please analyze the provided photos and provide a detailed estimate.`,
    });
  }

  // Add photos if provided
  for (const photo of photos) {
    contentParts.push({
      type: "image_url",
      image_url: {
        url: photo, // base64 data URL
      },
    });
  }

  // Make API call with retry logic
  let attempt = 0;
  const maxAttempts = 2;
  let lastError: Error | null = null;

  while (attempt < maxAttempts) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // GPT-4 with vision support
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: contentParts as any,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0]?.message?.content?.trim();
      
      if (!response) {
        throw new Error("No response from OpenAI");
      }

      // Parse and validate the JSON response
      const estimate = JSON.parse(response);

      // Validate structure
      if (!estimate.summary || !estimate.totals || !estimate.line_items) {
        throw new Error("Invalid estimate format from AI");
      }

      // Calculate totals if not properly set
      const materialsTotal = estimate.line_items.reduce((sum: number, item: any) => sum + (item.material_cost || 0), 0);
      const laborTotal = estimate.line_items.reduce((sum: number, item: any) => sum + (item.labor_cost || 0), 0);
      const subtotal = materialsTotal + laborTotal;
      const overheadProfit = Math.round(subtotal * 0.175); // 17.5% average
      const beforeTax = subtotal + overheadProfit + (estimate.totals.permit_or_fees || 0);
      const taxEstimate = Math.round(beforeTax * 0.13); // Ontario HST
      const totalLow = beforeTax + taxEstimate;
      const totalHigh = Math.round(totalLow * 1.15); // 15% range for uncertainty

      // Ensure totals are calculated correctly
      estimate.totals = {
        materials: Math.round(materialsTotal),
        labor: Math.round(laborTotal),
        permit_or_fees: estimate.totals.permit_or_fees || 0,
        overhead_profit: overheadProfit,
        subtotal: Math.round(subtotal),
        tax_estimate: taxEstimate,
        total_low: totalLow,
        total_high: totalHigh,
      };

      return estimate;
    } catch (error) {
      lastError = error as Error;
      attempt++;
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt >= maxAttempts) {
        throw lastError;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw lastError || new Error("Failed to generate estimate");
}

async function generateAIEstimate(description: string): Promise<{
  min: number;
  max: number;
  description: string;
}> {
  const prompt = `You are an expert contractor providing cost estimates for home improvement projects. 
Based on the following project description, provide a realistic cost estimate range in USD.

Project Description: "${description}"

Respond with ONLY a JSON object in this exact format:
{
  "min": <minimum cost as number>,
  "max": <maximum cost as number>,
  "description": "<brief explanation of what's included in the estimate, 1-2 sentences>"
}

Consider:
- Labor costs for skilled contractors
- Material costs at mid-range quality
- Regional average pricing (US nationwide average)
- Typical project complexity
- Industry standard pricing

Be realistic and conservative. Return ONLY the JSON, no other text.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional contractor cost estimator. Always respond with valid JSON only."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const response = completion.choices[0]?.message?.content?.trim();
  
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  // Parse the JSON response
  const estimate = JSON.parse(response);

  // Validate the response structure
  if (typeof estimate.min !== 'number' || typeof estimate.max !== 'number' || !estimate.description) {
    throw new Error("Invalid estimate format from AI");
  }

  return {
    min: Math.round(estimate.min),
    max: Math.round(estimate.max),
    description: estimate.description
  };
}

// Fallback keyword-based estimate for when OpenAI is unavailable
function generateFallbackEstimate(description: string): {
  min: number;
  max: number;
  description: string;
}

function generateFallbackEstimate(description: string): {
  min: number;
  max: number;
  description: string;
} {
  // Kitchen projects
  if (description.includes("kitchen")) {
    if (description.includes("renovation") || description.includes("remodel")) {
      return {
        min: 15000,
        max: 45000,
        description:
          "Kitchen renovation costs vary widely based on size, materials, and appliances. This estimate includes basic to mid-range finishes.",
      };
    }
    if (description.includes("cabinet")) {
      return {
        min: 3000,
        max: 12000,
        description:
          "Cabinet replacement or refacing costs depend on size, material, and hardware choices.",
      };
    }
    if (description.includes("faucet")) {
      return {
        min: 150,
        max: 500,
        description:
          "Faucet replacement including basic installation. Higher-end faucets may cost more.",
      };
    }
  }

  // Bathroom projects
  if (description.includes("bathroom")) {
    if (description.includes("renovation") || description.includes("remodel")) {
      return {
        min: 8000,
        max: 25000,
        description:
          "Bathroom renovation including fixtures, tiling, and basic electrical/plumbing work.",
      };
    }
  }

  // Painting
  if (description.includes("paint")) {
    const roomCount = extractRoomCount(description);
    const baseMin = 300;
    const baseMax = 800;
    return {
      min: baseMin * roomCount,
      max: baseMax * roomCount,
      description: `Interior painting for ${roomCount} room${roomCount > 1 ? "s" : ""} including primer, paint, and basic prep work.`,
    };
  }

  // Flooring
  if (
    description.includes("floor") ||
    description.includes("laminate") ||
    description.includes("hardwood") ||
    description.includes("tile")
  ) {
    const sqft = extractSquareFootage(description) || 500;
    const pricePerSqft = description.includes("hardwood")
      ? { min: 8, max: 15 }
      : { min: 3, max: 8 };
    return {
      min: Math.round(sqft * pricePerSqft.min),
      max: Math.round(sqft * pricePerSqft.max),
      description: `Flooring installation for approximately ${sqft} sq ft including materials and labor.`,
    };
  }

  // Roofing
  if (description.includes("roof")) {
    return {
      min: 8000,
      max: 20000,
      description:
        "Roof replacement or major repair for typical residential home. Price varies with materials and size.",
    };
  }

  // Electrical
  if (
    description.includes("electrical") ||
    description.includes("wiring") ||
    description.includes("outlet")
  ) {
    return {
      min: 200,
      max: 800,
      description:
        "Basic electrical work including outlet installation or minor wiring. Complex projects may cost more.",
    };
  }

  // Plumbing
  if (
    description.includes("plumbing") ||
    description.includes("pipe") ||
    description.includes("drain")
  ) {
    return {
      min: 250,
      max: 1200,
      description:
        "Plumbing repair or installation including basic fixtures and labor.",
    };
  }

  // HVAC
  if (
    description.includes("hvac") ||
    description.includes("furnace") ||
    description.includes("air condition")
  ) {
    return {
      min: 3000,
      max: 8000,
      description:
        "HVAC system installation or major repair including unit and basic installation.",
    };
  }

  // Default estimate for unrecognized projects
  return {
    min: 500,
    max: 2000,
    description:
      "General home repair estimate. Final cost will depend on specific project requirements and materials.",
  };
}

function extractRoomCount(description: string): number {
  const matches = description.match(/(\d+)\s*(room|bedroom|bed)/i);
  return matches ? parseInt(matches[1]!) : 1;
}

function extractSquareFootage(description: string): number | null {
  const matches =
    description.match(/(\d+)\s*(sq|square)\s*(ft|foot|feet)/i) ||
    description.match(/(\d+)\s*(sq\s*ft)/i);
  return matches ? parseInt(matches[1]!) : null;
}
