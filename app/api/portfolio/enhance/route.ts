import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

interface PortfolioEnhancementResult {
  title: string;
  description: string;
  projectCost: string;
  duration: string;
  materials: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  summary: string;
  tags: string[];
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const projectType = formData.get('projectType') as string;
    const existingDescription = formData.get('existingDescription') as string || '';
    
    // Try AI enhancement if OpenAI is available
    if (openai && projectType) {
      const prompt = `You are a professional contractor portfolio writer. Based on this project type and any existing description, generate compelling portfolio content.

Project Type: ${projectType}
Existing Description: ${existingDescription || 'None provided'}

Generate a JSON response with:
{
  "title": "<short catchy project title>",
  "description": "<2-3 sentences describing the project, challenges, and results>",
  "projectCost": "<estimated cost range like '$5,000 - $8,000'>",
  "duration": "<estimated timeframe like '2-3 weeks'>",
  "materials": "<key materials used, comma-separated>",
  "category": "<one of: kitchen, bathroom, flooring, painting, roofing, plumbing, electrical, hvac, outdoor, general>",
  "difficulty": "<one of: Easy, Medium, Hard, Expert>",
  "summary": "<one sentence highlighting the transformation>",
  "tags": ["<tag1>", "<tag2>", "<tag3>"]
}

Make it professional, specific to Toronto/GTA market, and highlight value delivered to the client.`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are an expert contractor portfolio writer. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        });

        const response = completion.choices[0]?.message?.content?.trim();
        if (response) {
          const jsonMatch = response.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const enhancement = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, enhancement });
          }
        }
      } catch (error) {
        console.error('AI enhancement error:', error);
      }
    }

    // Fallback to rule-based enhancement
    const fallbackEnhancement = generateFallbackEnhancement(projectType, existingDescription);
    return NextResponse.json({ success: true, enhancement: fallbackEnhancement });

  } catch (error) {
    console.error('Portfolio enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance portfolio' },
      { status: 500 }
    );
  }
}

function generateFallbackEnhancement(projectType: string, existingDesc: string): PortfolioEnhancementResult {
  const type = projectType.toLowerCase();
  
  const templates: Record<string, PortfolioEnhancementResult> = {
    kitchen: {
      title: 'Complete Kitchen Renovation',
      description: 'Transformed outdated kitchen into modern, functional space. Updated cabinetry, countertops, and appliances. Enhanced workflow with improved layout and increased storage capacity.',
      projectCost: '$25,000 - $45,000',
      duration: '3-4 weeks',
      materials: 'Quartz countertops, Custom cabinetry, Stainless appliances, Porcelain tile backsplash',
      category: 'kitchen',
      difficulty: 'Hard',
      summary: 'Complete kitchen transformation with modern finishes and improved functionality',
      tags: ['kitchen', 'renovation', 'custom-cabinets', 'modern', 'toronto']
    },
    bathroom: {
      title: 'Modern Bathroom Remodel',
      description: 'Complete bathroom renovation including new fixtures, tiling, and vanity. Improved lighting and ventilation. Waterproofing and plumbing upgrades ensure long-lasting quality.',
      projectCost: '$12,000 - $22,000',
      duration: '2-3 weeks',
      materials: 'Porcelain tile, Quartz vanity top, Modern fixtures, Glass shower enclosure',
      category: 'bathroom',
      difficulty: 'Hard',
      summary: 'Full bathroom renovation with spa-like features and premium finishes',
      tags: ['bathroom', 'remodel', 'modern', 'fixtures', 'toronto']
    },
    flooring: {
      title: 'Hardwood Flooring Installation',
      description: 'Installed high-quality engineered hardwood throughout main living areas. Professional preparation, installation, and finishing. Enhanced home value with timeless elegant flooring.',
      projectCost: '$6,000 - $12,000',
      duration: '1-2 weeks',
      materials: 'Engineered hardwood, Underlayment, Transitions, Stain & finish',
      category: 'flooring',
      difficulty: 'Medium',
      summary: 'Beautiful hardwood floors that add warmth and value to any home',
      tags: ['flooring', 'hardwood', 'installation', 'renovation', 'toronto']
    },
    painting: {
      title: 'Professional Interior Painting',
      description: 'Complete interior painting with premium paints and expert color consultation. Thorough surface preparation, multiple coats, and clean edges. Fresh, modern look throughout.',
      projectCost: '$3,000 - $8,000',
      duration: '3-5 days',
      materials: 'Premium latex paint, Primers, Caulking, Paint supplies',
      category: 'painting',
      difficulty: 'Easy',
      summary: 'Professional painting service that transforms your space with fresh, lasting color',
      tags: ['painting', 'interior', 'color', 'professional', 'toronto']
    },
    basement: {
      title: 'Basement Finishing Project',
      description: 'Transformed unfinished basement into beautiful living space. Added bedroom, bathroom, and recreation area. Proper insulation, lighting, and flooring for comfortable year-round use.',
      projectCost: '$30,000 - $55,000',
      duration: '4-6 weeks',
      materials: 'Framing lumber, Drywall, Insulation, LVP flooring, Fixtures',
      category: 'general',
      difficulty: 'Expert',
      summary: 'Complete basement transformation adding valuable living space to your home',
      tags: ['basement', 'finishing', 'renovation', 'addition', 'toronto']
    }
  };

  // Find matching template or use kitchen as default
  for (const key of Object.keys(templates)) {
    if (type.includes(key)) {
      const template = templates[key];
      // Incorporate existing description if provided
      if (existingDesc) {
        template.description = existingDesc + ' ' + template.description;
      }
      return template;
    }
  }

  return templates['kitchen']; // Default fallback
}
