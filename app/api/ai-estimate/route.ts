import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface EstimateResult {
  min: number;
  max: number;
  description: string;
  confidence: number;
  factors: string[];
  aiPowered: boolean;
}

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const description = formData.get('description') as string;
    const hasVoice = formData.get('hasVoice') === 'true';
    const imageCount = parseInt(formData.get('imageCount') as string) || 0;
    
    // Extract images
    const images: File[] = [];
    for (let i = 0; i < imageCount; i++) {
      const image = formData.get(`image_${i}`) as File;
      if (image) {
        images.push(image);
      }
    }

    console.log('AI estimate request:', {
      description: description?.substring(0, 100),
      hasVoice,
      imageCount: images.length,
      aiEnabled: !!openai
    });

    // Try AI estimation first
    if (openai && description) {
      try {
        const aiResult = await getAIEstimate(description, hasVoice, images.length);
        if (aiResult) {
          return NextResponse.json(aiResult);
        }
      } catch (error) {
        console.error('AI estimation failed, falling back to rule-based:', error);
      }
    }

    // Fallback to rule-based estimation
    const fallbackResult = getRuleBasedEstimate(description, hasVoice, images.length);
    return NextResponse.json(fallbackResult);

  } catch (error) {
    console.error('Error processing AI estimate:', error);
    return NextResponse.json(
      { error: 'Failed to process estimate request' },
      { status: 500 }
    );
  }
}

async function getAIEstimate(description: string, hasVoice: boolean, imageCount: number): Promise<EstimateResult | null> {
  if (!openai) return null;

  const prompt = `
You are an expert home renovation cost estimator. Based on the project description provided, give me a realistic cost estimate range.

Project Description: "${description}"
Additional Context:
- Voice input provided: ${hasVoice ? 'Yes' : 'No'}
- Images provided: ${imageCount}

Please respond with a JSON object containing:
{
  "min": <minimum cost in USD>,
  "max": <maximum cost in USD>,
  "confidence": <confidence percentage 1-100>,
  "factors": [<array of strings explaining cost factors>],
  "reasoning": "<brief explanation of the estimate>"
}

Consider:
- Material costs and quality levels
- Labor complexity and time requirements
- Regional market rates (assume North American pricing)
- Project scope and potential complications
- Industry standards and building codes

Be realistic and conservative. Include factors like permits, cleanup, and potential surprises.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the cost-effective model
      messages: [
        {
          role: "system",
          content: "You are an expert home renovation cost estimator with 20+ years of experience in construction and contracting. Provide accurate, realistic estimates based on current market rates."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent estimates
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) return null;

    // Parse the JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const aiData = JSON.parse(jsonMatch[0]);

    // Apply input quality bonuses
    let confidenceBonus = 0;
    if (hasVoice) confidenceBonus += 10;
    if (imageCount > 0) confidenceBonus += Math.min(imageCount * 5, 20);

    const finalConfidence = Math.min(aiData.confidence + confidenceBonus, 95);

    // Enhance factors with input quality information
    const enhancedFactors = [...aiData.factors];
    if (hasVoice) enhancedFactors.push("Voice input provided additional project clarity");
    if (imageCount > 0) enhancedFactors.push(`${imageCount} image${imageCount > 1 ? 's' : ''} analyzed for visual context`);

    return {
      min: Math.round(aiData.min),
      max: Math.round(aiData.max),
      description: `AI-powered estimate: ${aiData.reasoning}`,
      confidence: finalConfidence,
      factors: enhancedFactors,
      aiPowered: true
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

function getRuleBasedEstimate(description: string, hasVoice: boolean, imageCount: number): EstimateResult {
  // Fallback to the existing rule-based system
  const baseEstimate = calculateBaseEstimate(description);
  const voiceBonus = hasVoice ? 0.15 : 0;
  const imageBonus = Math.min(imageCount * 0.1, 0.3);
  
  const confidence = Math.min(
    baseEstimate.baseConfidence + (voiceBonus + imageBonus) * 100,
    95
  );

  const confidenceMultiplier = confidence / 100;
  const variance = 1 - (confidenceMultiplier * 0.3);
  
  return {
    min: Math.round(baseEstimate.min * variance),
    max: Math.round(baseEstimate.max * (2 - variance)),
    description: generateEnhancedDescription(description, hasVoice, imageCount),
    confidence: Math.round(confidence),
    factors: generateFactors(description, hasVoice, imageCount),
    aiPowered: false
  };
}

function calculateBaseEstimate(description: string) {
  const keywords = description?.toLowerCase() || '';
  
  // Kitchen projects
  if (keywords.includes('kitchen') || keywords.includes('faucet') || keywords.includes('cabinet')) {
    if (keywords.includes('faucet')) {
      return { min: 150, max: 500, baseConfidence: 70 };
    }
    if (keywords.includes('cabinet')) {
      return { min: 2000, max: 8000, baseConfidence: 60 };
    }
    return { min: 1000, max: 15000, baseConfidence: 50 };
  }
  
  // Bathroom projects
  if (keywords.includes('bathroom') || keywords.includes('toilet') || keywords.includes('shower')) {
    if (keywords.includes('toilet')) {
      return { min: 200, max: 800, baseConfidence: 75 };
    }
    if (keywords.includes('shower')) {
      return { min: 1500, max: 5000, baseConfidence: 65 };
    }
    return { min: 800, max: 10000, baseConfidence: 55 };
  }
  
  // Painting projects
  if (keywords.includes('paint') || keywords.includes('wall')) {
    const rooms = (keywords.match(/room|bedroom|living|dining/g) || []).length;
    const baseMin = 200 + (rooms * 150);
    const baseMax = 600 + (rooms * 400);
    return { min: baseMin, max: baseMax, baseConfidence: 80 };
  }
  
  // Electrical projects
  if (keywords.includes('electrical') || keywords.includes('outlet') || keywords.includes('light')) {
    return { min: 100, max: 800, baseConfidence: 70 };
  }
  
  // Plumbing projects
  if (keywords.includes('plumbing') || keywords.includes('pipe') || keywords.includes('leak')) {
    return { min: 150, max: 1200, baseConfidence: 65 };
  }
  
  // Flooring projects
  if (keywords.includes('floor') || keywords.includes('carpet') || keywords.includes('tile')) {
    return { min: 500, max: 3000, baseConfidence: 60 };
  }
  
  // Roofing projects
  if (keywords.includes('roof') || keywords.includes('shingle') || keywords.includes('gutter')) {
    return { min: 1000, max: 8000, baseConfidence: 50 };
  }
  
  // Default estimate
  return { min: 300, max: 2000, baseConfidence: 45 };
}

function generateEnhancedDescription(description: string, hasVoice: boolean, imageCount: number): string {
  const inputs = [];
  if (description) inputs.push("detailed description");
  if (hasVoice) inputs.push("voice analysis");
  if (imageCount > 0) inputs.push(`${imageCount} project photo${imageCount !== 1 ? 's' : ''}`);
  
  const inputText = inputs.length > 1 
    ? inputs.slice(0, -1).join(", ") + " and " + inputs[inputs.length - 1]
    : inputs[0] || "project information";
  
  return `Rule-based estimate using ${inputText}. This estimate considers project complexity, materials, labor requirements, and local market rates.`;
}

function generateFactors(description: string, hasVoice: boolean, imageCount: number): string[] {
  const factors = [
    "Industry standard pricing analysis",
    "Local market rate comparison", 
    "Material cost assessment",
    "Labor complexity evaluation"
  ];
  
  if (description && description.length > 50) {
    factors.push("Detailed written specifications");
  }
  
  if (hasVoice) {
    factors.push("Voice pattern analysis for project clarity");
  }
  
  if (imageCount > 0) {
    factors.push(`Visual assessment from ${imageCount} project image${imageCount !== 1 ? 's' : ''}`);
  }
  
  if (imageCount >= 3) {
    factors.push("Multiple angle visual confirmation");
  }
  
  // Add specific factors based on project type
  const keywords = description?.toLowerCase() || '';
  if (keywords.includes('damage') || keywords.includes('repair')) {
    factors.push("Damage assessment and repair complexity");
  }
  
  if (keywords.includes('square feet') || keywords.includes('sqft') || /\d+\s*x\s*\d+/.test(keywords)) {
    factors.push("Area measurements included in calculation");
  }
  
  return factors;
}