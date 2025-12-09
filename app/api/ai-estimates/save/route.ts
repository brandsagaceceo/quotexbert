import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SaveEstimateItem {
  category: string;
  description: string;
  minCost: number | string;
  maxCost: number | string;
  selected?: boolean;
  quantity?: number | string | null;
  unit?: string | null;
  notes?: string | null;
}

interface SaveEstimateBody {
  homeownerId?: string | null;
  description: string;
  minCost: number | string;
  maxCost: number | string;
  confidence: number | string;
  aiPowered?: boolean;
  enhancedDescription?: string | null;
  factors?: unknown;
  reasoning?: string | null;
  hasVoice?: boolean;
  imageCount?: number;
  images?: string[];
  items?: SaveEstimateItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SaveEstimateBody;
    const {
      homeownerId,
      description,
      minCost,
      maxCost,
      confidence,
      aiPowered,
      enhancedDescription,
      factors,
      reasoning,
      hasVoice,
      imageCount,
      images,
      items,
    } = body;

    // Create the AI estimate
    const estimate = await prisma.aIEstimate.create({
      data: {
        homeownerId: homeownerId ?? null,
        description,
        minCost:
          typeof minCost === 'number' ? minCost : parseFloat(minCost),
        maxCost:
          typeof maxCost === 'number' ? maxCost : parseFloat(maxCost),
        confidence:
          typeof confidence === 'number'
            ? confidence
            : parseFloat(confidence),
        aiPowered: aiPowered !== undefined ? aiPowered : true,
        enhancedDescription: enhancedDescription ?? null,
        factors: JSON.stringify(factors || []),
        reasoning: reasoning ?? null,
        hasVoice: hasVoice ?? false,
        imageCount: imageCount ?? 0,
        images: JSON.stringify(images ?? []),
        status: 'saved',
        isPublic: false,
        ...(items
          ? {
              items: {
                create: items.map((item) => ({
                  category: item.category,
                  description: item.description,
                  minCost:
                    typeof item.minCost === 'number'
                      ? item.minCost
                      : parseFloat(item.minCost),
                  maxCost:
                    typeof item.maxCost === 'number'
                      ? item.maxCost
                      : parseFloat(item.maxCost),
                  selected: item.selected !== undefined ? item.selected : true,
                  quantity:
                    item.quantity === undefined || item.quantity === null
                      ? null
                      : typeof item.quantity === 'number'
                      ? item.quantity
                      : parseFloat(item.quantity),
                  unit: item.unit ?? null,
                  notes: item.notes ?? null,
                })),
              },
            }
          : {}),
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      estimate,
    });
  } catch (error: any) {
    console.error('Error saving AI estimate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save estimate' },
      { status: 500 }
    );
  }
}
