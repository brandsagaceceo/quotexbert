import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";
import { emitQuoteSignal } from "@/lib/quote-signals";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('demo') ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface EstimateRequest {
  description?: string;
  photos?: string[]; // base64 encoded images
  projectType?: string;
  postalCode?: string;
  userId?: string;
}

// AI estimate using real OpenAI API with multimodal support
export async function POST(req: NextRequest) {
  // Hoist parsed body so catch block can reference it without re-consuming the stream
  let description: string | undefined;
  let photos: string[] | undefined;
  let projectType: string = 'General';
  let postalCode: string | undefined;
  let userId: string | undefined;

  try {
    const body: EstimateRequest = await req.json();
    description = body.description;
    photos = body.photos;
    projectType = body.projectType || 'General';
    postalCode = body.postalCode;
    userId = body.userId;

    if (process.env.NODE_ENV === 'development') {
      console.debug('[ESTIMATE][request]', {
        userId: userId || 'anonymous',
        projectType,
        photoCount: photos?.length ?? 0,
        hasDescription: !!description?.trim(),
        postalCode: postalCode || 'not_provided',
      });
    }

    // Validate photo count (hard limit — ignore silently if exceeded)
    if (photos && photos.length > 5) {
      photos = photos.slice(0, 5);
    }

    // If neither description nor photos — generate a generic fallback immediately
    if ((!description || description.trim().length < 3) && (!photos || photos.length === 0)) {
      console.warn('[ESTIMATE] No description or photos provided — returning generic fallback');
      return NextResponse.json(
        buildFallbackEstimate(projectType, 'general', 'No description or photos were provided. This is a rough ballpark estimate.')
      );
    }

    // Check if OpenAI API key is configured
    if (!openai) {
      console.warn('[ESTIMATE] OpenAI API key not configured, using fallback');
      return NextResponse.json(
        buildFallbackEstimate(description?.toLowerCase() || projectType.toLowerCase(), projectType)
      );
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

    // Phase 6: structured learning signal
    void emitQuoteSignal({
      event: 'ai_estimate_shown',
      category: projectType,
      city: postalCode || undefined,
      aiEstimateLow: estimate.totals?.total_low,
      aiEstimateHigh: estimate.totals?.total_high,
      createdByRole: 'system',
    }).catch(() => {});

    return NextResponse.json(estimate);
  } catch (error: any) {
    // Log the real underlying error for debugging — never expose to end users
    console.error('[ESTIMATE] Error generating estimate:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      type: error?.type,
      userId,
      projectType,
      photoCount: photos?.length ?? 0,
    });

    // Always return a usable fallback — never a hard failure
    return NextResponse.json(
      buildFallbackEstimate(
        description?.toLowerCase() || projectType?.toLowerCase() || 'general',
        projectType || 'General'
      )
    );
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

ACCURACY RULES — FOLLOW STRICTLY:
- Read EVERY photo carefully. Identify materials, finishes, dimensions, condition, and scope from what is visible.
- Do NOT invent scope items that are not evident from the photos or description.
- If the description contradicts the photos, trust the photos for physical/size details.
- Your line_item quantities must be derived from what is actually visible or described (e.g. count tiles, measure visible wall areas, note existing fixtures).
- If information is insufficient to price accurately, set confidence below 0.6 and ask specific questions.

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
  const photoNote = photos.length > 0
    ? `\n${photos.length} photo${photos.length !== 1 ? 's' : ''} provided — analyze each carefully for materials, condition, scope, and dimensions.`
    : '';
  if (description && description.trim()) {
    contentParts.push({
      type: "text",
      text: `Project Type: ${projectType}\n${postalCode ? `Location: ${postalCode} (GTA/Ontario)\n` : ''}Project Description: ${description}${photoNote}`,
    });
  } else {
    contentParts.push({
      type: "text",
      text: `Project Type: ${projectType}\n${postalCode ? `Location: ${postalCode} (GTA/Ontario)\n` : ''}Please analyze the provided photos and provide a detailed estimate.${photoNote}`,
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

  if (!openai) {
    throw new Error("OpenAI service is not available");
  }

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
        temperature: 0.4, // lower temperature → more consistent, realistic estimates
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

  if (!openai) {
    throw new Error("OpenAI service is not available");
  }

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

// Structured fallback estimate that matches the full EstimateResultData shape.
// Used whenever OpenAI is unavailable, fails, or quota is exceeded.
function buildFallbackEstimate(
  description: string,
  projectType: string,
  customNote?: string,
): {
  summary: string;
  scope: string[];
  assumptions: string[];
  line_items: Array<{ name: string; qty: number; unit: string; material_cost: number; labor_cost: number; notes?: string }>;
  totals: { materials: number; labor: number; permit_or_fees: number; overhead_profit: number; subtotal: number; tax_estimate: number; total_low: number; total_high: number };
  timeline: { duration_days_low: number; duration_days_high: number };
  confidence: number;
  questions_to_confirm: string[];
  next_steps: string[];
  note: string;
} {
  const lower = description.toLowerCase();

  let summary = `${projectType} project estimate.`;
  let materials = 500;
  let labor = 800;
  let permitFees = 0;
  let durationLow = 1;
  let durationHigh = 5;
  let scopeItems: string[] = [
    'Initial assessment and site preparation',
    'Supply and install materials',
    'Final cleanup and inspection',
  ];

  if (lower.includes('kitchen')) {
    if (lower.includes('renovation') || lower.includes('remodel')) {
      summary = 'Full kitchen renovation including cabinetry, countertops, and appliances.';
      materials = 10000; labor = 8000; permitFees = 800; durationLow = 7; durationHigh = 21;
      scopeItems = ['Demolition of existing kitchen', 'Install new cabinetry', 'Countertop installation', 'Appliance hookups', 'Plumbing and electrical rough-in'];
    } else if (lower.includes('cabinet')) {
      summary = 'Kitchen cabinet replacement or refacing.';
      materials = 4000; labor = 3000; durationLow = 3; durationHigh = 7;
    } else if (lower.includes('faucet') || lower.includes('sink')) {
      summary = 'Kitchen faucet or sink replacement.';
      materials = 300; labor = 200; durationLow = 1; durationHigh = 1;
    } else {
      summary = 'Kitchen improvement project.';
      materials = 2000; labor = 1500; durationLow = 2; durationHigh = 5;
    }
  } else if (lower.includes('bathroom')) {
    if (lower.includes('renovation') || lower.includes('remodel')) {
      summary = 'Full bathroom renovation including fixtures, tiling, and plumbing.';
      materials = 5000; labor = 5000; permitFees = 500; durationLow = 5; durationHigh = 14;
      scopeItems = ['Demolition of existing bathroom', 'Tile installation (floor and walls)', 'Fixture replacements', 'Plumbing updates', 'Paint and finishing'];
    } else {
      summary = 'Bathroom improvement project.';
      materials = 1500; labor = 1500; durationLow = 2; durationHigh = 5;
    }
  } else if (lower.includes('paint') || projectType.toLowerCase().includes('painting')) {
    const roomCount = extractRoomCount(lower);
    summary = `Interior painting for ${roomCount} room${roomCount > 1 ? 's' : ''}.`;
    materials = 400 * roomCount; labor = 600 * roomCount; durationLow = 1; durationHigh = 3;
    scopeItems = ['Surface preparation and priming', 'Apply 2 coats of paint', 'Touch-ups and final inspection'];
  } else if (lower.includes('floor') || lower.includes('laminate') || lower.includes('hardwood') || lower.includes('tile') || projectType.toLowerCase().includes('flooring')) {
    const sqft = extractSquareFootage(lower) || 400;
    const isHardwood = lower.includes('hardwood');
    summary = `${isHardwood ? 'Hardwood' : 'Flooring'} installation for approximately ${sqft} sq ft.`;
    materials = sqft * (isHardwood ? 10 : 5); labor = sqft * 4; durationLow = 2; durationHigh = 5;
    scopeItems = ['Remove existing flooring', 'Subfloor preparation', `Install new ${isHardwood ? 'hardwood' : 'flooring'}`, 'Trim and finishing'];
  } else if (lower.includes('roof') || projectType.toLowerCase().includes('roofing')) {
    summary = 'Roof replacement or major repair.';
    materials = 7000; labor = 5000; permitFees = 500; durationLow = 3; durationHigh = 7;
    scopeItems = ['Remove existing shingles', 'Inspect and repair sheathing', 'Install new roofing material', 'Flashing and sealing'];
  } else if (lower.includes('electrical') || lower.includes('wiring') || lower.includes('outlet') || projectType.toLowerCase().includes('electrical')) {
    summary = 'Electrical work including wiring or fixture installation.';
    materials = 300; labor = 600; durationLow = 1; durationHigh = 3;
    scopeItems = ['Electrical assessment', 'Install/replace wiring or outlets', 'Final testing and inspection'];
  } else if (lower.includes('plumbing') || lower.includes('pipe') || lower.includes('drain') || projectType.toLowerCase().includes('plumbing')) {
    summary = 'Plumbing repair or installation.';
    materials = 400; labor = 700; durationLow = 1; durationHigh = 3;
    scopeItems = ['Shut off water supply', 'Replace or repair pipes/fixtures', 'Test for leaks and restore water'];
  } else if (lower.includes('hvac') || lower.includes('furnace') || lower.includes('air condition')) {
    summary = 'HVAC system installation or repair.';
    materials = 3000; labor = 2000; permitFees = 300; durationLow = 2; durationHigh = 5;
    scopeItems = ['System assessment', 'Install or replace HVAC unit', 'Ductwork and connections', 'Commissioning and testing'];
  } else if (lower.includes('deck') || lower.includes('fence') || projectType.toLowerCase().includes('deck')) {
    summary = 'Deck or fence construction.';
    materials = 4000; labor = 3000; permitFees = 400; durationLow = 3; durationHigh = 10;
    scopeItems = ['Site preparation', 'Foundation/post installation', 'Frame and decking installation', 'Finish and sealant'];
  } else if (lower.includes('basement') || projectType.toLowerCase().includes('basement')) {
    summary = 'Basement renovation or finishing.';
    materials = 8000; labor = 7000; permitFees = 700; durationLow = 10; durationHigh = 30;
    scopeItems = ['Framing and insulation', 'Drywall installation', 'Flooring', 'Electrical and lighting', 'Finishing touches'];
  } else if (lower.includes('drywall') || projectType.toLowerCase().includes('drywall')) {
    summary = 'Drywall installation or repair.';
    materials = 800; labor = 1200; durationLow = 2; durationHigh = 5;
    scopeItems = ['Surface preparation', 'Install/patch drywall', 'Tape, mud, and sand', 'Prime and paint-ready finish'];
  } else if (lower.includes('landscaping') || projectType.toLowerCase().includes('landscaping')) {
    summary = 'Landscaping project.';
    materials = 1500; labor = 2000; durationLow = 2; durationHigh = 7;
    scopeItems = ['Site assessment and design', 'Grading and soil preparation', 'Planting and hardscaping', 'Cleanup and final inspection'];
  }

  const subtotal = materials + labor;
  const overheadProfit = Math.round(subtotal * 0.175);
  const beforeTax = subtotal + overheadProfit + permitFees;
  const taxEstimate = Math.round(beforeTax * 0.13); // Ontario HST
  const totalLow = beforeTax + taxEstimate;
  const totalHigh = Math.round(totalLow * 1.25);

  return {
    summary,
    scope: scopeItems,
    assumptions: [
      'Prices are in CAD based on GTA/Ontario market rates',
      'Estimate based on typical project scope — actual costs may vary',
      'Permits may be required depending on municipality',
    ],
    line_items: [
      { name: 'Materials', qty: 1, unit: 'lot', material_cost: materials, labor_cost: 0, notes: 'Mid-range quality materials' },
      { name: 'Labour', qty: 1, unit: 'lot', material_cost: 0, labor_cost: labor, notes: 'Skilled trades at GTA market rates' },
      ...(permitFees > 0 ? [{ name: 'Permits & Fees', qty: 1, unit: 'lot', material_cost: permitFees, labor_cost: 0, notes: 'Estimated municipal permit fees' }] : []),
    ],
    totals: {
      materials,
      labor,
      permit_or_fees: permitFees,
      overhead_profit: overheadProfit,
      subtotal,
      tax_estimate: taxEstimate,
      total_low: totalLow,
      total_high: totalHigh,
    },
    timeline: {
      duration_days_low: durationLow,
      duration_days_high: durationHigh,
    },
    confidence: 0.3,
    questions_to_confirm: [
      'What is the exact size or square footage of the area?',
      'Are there any existing issues (water damage, mold, structural)?',
      'What level of finish or material quality are you looking for?',
    ],
    next_steps: [
      'Get 3 quotes from licensed local contractors',
      'Share photos for a more accurate estimate',
      'Create a free account to save this estimate',
    ],
    note: customNote || 'This is a rough estimate generated without AI. For a more accurate quote, please create an account or provide more details.',
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
