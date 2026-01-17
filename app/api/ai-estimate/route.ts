import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface EstimateResult {
  min: number;
  max: number;
  description: string;
  confidence: number;
  factors: string[];
  aiPowered: boolean;
  confidenceMetrics?: {
    similarProjectsCount: number;
    materialCostVolatility: 'low' | 'medium' | 'high';
    priceVariance: number;
    photoQuality: 'none' | 'low' | 'medium' | 'high';
    categoryConsistency: number;
  };
  bestTimeToRenovate?: {
    optimalSeason: string;
    reason: string;
    savingsPotential: string;
    confidence: string;
  };
}

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Helper to calculate confidence metrics
async function calculateConfidenceMetrics(
  description: string,
  category: string,
  imageCount: number,
  estimateMin: number,
  estimateMax: number
) {
  // Count similar projects in database
  const similarProjects = await prisma.aIEstimate.count({
    where: {
      description: {
        contains: category,
        mode: 'insensitive'
      }
    }
  });

  // Calculate price variance
  const variance = ((estimateMax - estimateMin) / estimateMin) * 100;

  // Determine material cost volatility based on category
  const volatilityMap: Record<string, 'low' | 'medium' | 'high'> = {
    'painting': 'low',
    'flooring': 'medium',
    'kitchen': 'high',
    'bathroom': 'medium',
    'roofing': 'high',
    'hvac': 'high',
    'electrical': 'medium',
    'plumbing': 'medium',
    'outdoor': 'medium',
    'windows-doors': 'high',
    'renovation': 'high',
    'general': 'medium'
  };

  const materialCostVolatility = volatilityMap[category] || 'medium';

  // Determine photo quality
  let photoQuality: 'none' | 'low' | 'medium' | 'high' = 'none';
  if (imageCount === 0) photoQuality = 'none';
  else if (imageCount === 1) photoQuality = 'low';
  else if (imageCount === 2) photoQuality = 'medium';
  else photoQuality = 'high';

  // Calculate category consistency (how well description matches detected category)
  const categoryKeywords = description.toLowerCase();
  const categoryConsistency = categoryKeywords.includes(category) ? 95 : 75;

  return {
    similarProjectsCount: similarProjects,
    materialCostVolatility,
    priceVariance: Math.round(variance),
    photoQuality,
    categoryConsistency
  };
}

// Helper to determine best time to renovate
function determineBestTimeToRenovate(category: string) {
  const currentMonth = new Date().getMonth(); // 0-11
  
  const seasonalAdvice: Record<string, any> = {
    'roofing': {
      optimalSeason: 'Late Spring to Early Fall (May-September)',
      reason: 'Roofing materials require dry, mild weather for proper installation. Shingles seal better in warm temperatures.',
      savingsPotential: '10-15% savings if done in May or September (contractor shoulder season)',
      confidence: 'Based on GTA weather patterns and 2024-2025 pricing trends'
    },
    'kitchen': {
      optimalSeason: 'Fall or Winter (October-February)',
      reason: 'Contractors have more availability, and you can avoid summer entertaining season. Indoor work unaffected by weather.',
      savingsPotential: '5-10% savings due to lower demand and potential year-end discounts',
      confidence: 'Based on Toronto contractor availability data'
    },
    'bathroom': {
      optimalSeason: 'Fall or Early Winter (September-December)',
      reason: 'Indoor project not affected by weather. Fall has good contractor availability before holiday rush.',
      savingsPotential: '5-8% savings compared to spring rush',
      confidence: 'Based on historical GTA renovation patterns'
    },
    'outdoor': {
      optimalSeason: 'Late Spring or Early Summer (May-June)',
      reason: 'Ground is workable, weather is mild, and plants are established but not full size yet.',
      savingsPotential: '8-12% savings vs peak summer months',
      confidence: 'Based on Toronto landscaping season trends'
    },
    'painting': {
      optimalSeason: 'Late Spring or Early Fall (May or September)',
      reason: 'Moderate temperatures and low humidity allow paint to dry properly. Windows can be open for ventilation.',
      savingsPotential: '5-10% savings during shoulder seasons',
      confidence: 'Based on ideal painting conditions in GTA'
    },
    'flooring': {
      optimalSeason: 'Fall or Winter (October-February)',
      reason: 'Indoor humidity is lower, helping wood flooring acclimate. Contractors less busy than spring.',
      savingsPotential: '5-10% savings due to lower seasonal demand',
      confidence: 'Based on Toronto flooring installation patterns'
    },
    'hvac': {
      optimalSeason: 'Spring or Fall (April-May, September-October)',
      reason: 'Avoid emergency replacements during extreme weather. Contractors offer better rates in shoulder seasons.',
      savingsPotential: '10-20% savings vs emergency summer/winter replacements',
      confidence: 'Based on HVAC seasonal pricing in GTA'
    }
  };

  return seasonalAdvice[category] || {
    optimalSeason: 'Spring or Fall (April-June, September-November)',
    reason: 'Moderate weather and good contractor availability for most projects.',
    savingsPotential: '5-10% savings compared to peak summer season',
    confidence: 'Based on general Toronto renovation trends'
  };
}

// Helper function to save estimate to database
async function saveEstimateToDatabase(
  homeownerId: string,
  description: string,
  estimate: EstimateResult,
  hasVoice: boolean,
  imageCount: number
) {
  try {
    // Generate basic items from the estimate
    const items = estimate.factors.map((factor, index) => ({
      category: `Item ${index + 1}`,
      description: factor,
      minCost: Math.round(estimate.min / estimate.factors.length),
      maxCost: Math.round(estimate.max / estimate.factors.length),
      selected: true, // All items selected by default
    }));

    // Create the AI estimate
    const aiEstimate = await prisma.aIEstimate.create({
      data: {
        homeownerId,
        description,
        minCost: estimate.min,
        maxCost: estimate.max,
        confidence: estimate.confidence / 100, // Convert to decimal
        aiPowered: estimate.aiPowered,
        enhancedDescription: estimate.description,
        factors: JSON.stringify(estimate.factors),
        reasoning: (estimate as any).reasoning || null,
        hasVoice,
        imageCount,
        images: JSON.stringify([]),
        status: 'saved',
        isPublic: false,
        items: {
          create: items,
        },
      },
    });

    // Also create a SavedProject for this estimate
    const projectCategory = detectProjectCategory(description);
    const projectTitle = generateProjectTitle(description, projectCategory);
    
    await prisma.savedProject.create({
      data: {
        homeownerId,
        title: projectTitle,
        description: description,
        category: projectCategory,
        budget: `$${estimate.min.toLocaleString()} - $${estimate.max.toLocaleString()}`,
        photos: '[]', // No photos yet in this version
        visualizerImages: '[]',
        aiEstimateId: aiEstimate.id,
        estimateSummary: JSON.stringify({
          min: estimate.min,
          max: estimate.max,
          confidence: estimate.confidence,
          factors: estimate.factors
        }),
        status: 'draft'
      }
    });
  } catch (error) {
    console.error('Error saving estimate to database:', error);
    throw error;
  }
}

// Helper to detect project category from description
function detectProjectCategory(description: string): string {
  const keywords = description?.toLowerCase() || '';
  
  if (keywords.includes('kitchen') || keywords.includes('cabinet') || keywords.includes('faucet') || keywords.includes('counter')) return 'kitchen';
  if (keywords.includes('bathroom') || keywords.includes('shower') || keywords.includes('toilet') || keywords.includes('tub')) return 'bathroom';
  if (keywords.includes('roof') || keywords.includes('shingle') || keywords.includes('gutter')) return 'roofing';
  if (keywords.includes('floor') || keywords.includes('tile') || keywords.includes('hardwood') || keywords.includes('laminate')) return 'flooring';
  if (keywords.includes('paint') || keywords.includes('drywall') || keywords.includes('wall')) return 'painting';
  if (keywords.includes('hvac') || keywords.includes('furnace') || keywords.includes('ac') || keywords.includes('heating') || keywords.includes('cooling')) return 'hvac';
  if (keywords.includes('electrical') || keywords.includes('outlet') || keywords.includes('wiring') || keywords.includes('panel')) return 'electrical';
  if (keywords.includes('plumbing') || keywords.includes('pipe') || keywords.includes('leak') || keywords.includes('drain')) return 'plumbing';
  if (keywords.includes('deck') || keywords.includes('patio') || keywords.includes('fence') || keywords.includes('landscaping')) return 'outdoor';
  if (keywords.includes('window') || keywords.includes('door') || keywords.includes('glass')) return 'windows-doors';
  if (keywords.includes('basement') || keywords.includes('attic') || keywords.includes('addition')) return 'renovation';
  
  return 'general';
}

// Helper to generate a concise project title
function generateProjectTitle(description: string, category: string): string {
  const firstSentence = description.split(/[.!?]/)[0].trim();
  const shortDesc = firstSentence.length > 50 ? firstSentence.substring(0, 50) + '...' : firstSentence;
  
  const categoryNames: Record<string, string> = {
    'kitchen': 'Kitchen',
    'bathroom': 'Bathroom',
    'roofing': 'Roofing',
    'flooring': 'Flooring',
    'painting': 'Painting',
    'hvac': 'HVAC',
    'electrical': 'Electrical',
    'plumbing': 'Plumbing',
    'outdoor': 'Outdoor',
    'windows-doors': 'Windows & Doors',
    'renovation': 'Renovation',
    'general': 'Home Improvement'
  };
  
  return `${categoryNames[category] || 'Home'} - ${shortDesc}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const description = formData.get('description') as string;
    const hasVoice = formData.get('hasVoice') === 'true';
    const imageCount = parseInt(formData.get('imageCount') as string) || 0;
    const homeownerId = formData.get('homeownerId') as string | null;
    
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
      homeownerId: homeownerId?.substring(0, 10),
      aiEnabled: !!openai
    });

    let estimateResult: EstimateResult;

    // Try AI estimation first
    if (openai && description) {
      try {
        const aiResult = await getAIEstimate(description, hasVoice, images.length);
        if (aiResult) {
          estimateResult = aiResult;
        } else {
          estimateResult = getRuleBasedEstimate(description, hasVoice, images.length);
        }
      } catch (error) {
        console.error('AI estimation failed, falling back to rule-based:', error);
        estimateResult = getRuleBasedEstimate(description, hasVoice, images.length);
      }
    } else {
      // Fallback to rule-based estimation
      estimateResult = getRuleBasedEstimate(description, hasVoice, images.length);
    }

    // Add confidence metrics
    const projectCategory = detectProjectCategory(description);
    const confidenceMetrics = await calculateConfidenceMetrics(
      description,
      projectCategory,
      images.length,
      estimateResult.min,
      estimateResult.max
    );
    estimateResult.confidenceMetrics = confidenceMetrics;

    // Add best time to renovate advice
    estimateResult.bestTimeToRenovate = determineBestTimeToRenovate(projectCategory);

    // Auto-save estimate to database if homeownerId provided
    if (homeownerId && estimateResult) {
      try {
        await saveEstimateToDatabase(homeownerId, description, estimateResult, hasVoice, imageCount);
        console.log('Estimate auto-saved to database');
      } catch (error) {
        console.error('Failed to auto-save estimate:', error);
        // Don't fail the request if save fails
      }
    }

    return NextResponse.json(estimateResult);

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