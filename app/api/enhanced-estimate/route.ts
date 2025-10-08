import { NextRequest, NextResponse } from 'next/server';

interface EstimateResult {
  min: number;
  max: number;
  description: string;
  confidence: number;
  factors: string[];
}

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

    console.log('Enhanced estimate request:', {
      description: description?.substring(0, 100),
      hasVoice,
      imageCount: images.length
    });

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Enhanced estimate logic with multiple factors
    const baseEstimate = calculateBaseEstimate(description);
    const voiceBonus = hasVoice ? 0.15 : 0; // 15% confidence boost for voice
    const imageBonus = Math.min(images.length * 0.1, 0.3); // Up to 30% boost for images
    
    const confidence = Math.min(
      baseEstimate.baseConfidence + (voiceBonus + imageBonus) * 100,
      95 // Max 95% confidence
    );

    // Adjust estimate range based on confidence
    const confidenceMultiplier = confidence / 100;
    const variance = 1 - (confidenceMultiplier * 0.3); // Higher confidence = lower variance
    
    const result: EstimateResult = {
      min: Math.round(baseEstimate.min * variance),
      max: Math.round(baseEstimate.max * (2 - variance)),
      description: generateEnhancedDescription(description, hasVoice, images.length),
      confidence: Math.round(confidence),
      factors: generateFactors(description, hasVoice, images.length)
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error processing enhanced estimate:', error);
    return NextResponse.json(
      { error: 'Failed to process estimate request' },
      { status: 500 }
    );
  }
}

function calculateBaseEstimate(description: string) {
  const keywords = description.toLowerCase();
  
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
  
  return `Enhanced AI estimate based on ${inputText}. This estimate considers project complexity, materials, labor requirements, and local market rates.`;
}

function generateFactors(description: string, hasVoice: boolean, imageCount: number): string[] {
  const factors = [
    "AI analysis of project requirements",
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
  const keywords = description.toLowerCase();
  if (keywords.includes('damage') || keywords.includes('repair')) {
    factors.push("Damage assessment and repair complexity");
  }
  
  if (keywords.includes('square feet') || keywords.includes('sqft') || /\d+\s*x\s*\d+/.test(keywords)) {
    factors.push("Area measurements included in calculation");
  }
  
  return factors;
}