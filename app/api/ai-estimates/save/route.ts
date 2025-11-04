import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
        homeownerId: homeownerId || null,
        description,
        minCost: parseFloat(minCost),
        maxCost: parseFloat(maxCost),
        confidence: parseFloat(confidence),
        aiPowered: aiPowered !== undefined ? aiPowered : true,
        enhancedDescription,
        factors: JSON.stringify(factors || []),
        reasoning,
        hasVoice: hasVoice || false,
        imageCount: imageCount || 0,
        images: JSON.stringify(images || []),
        status: 'saved',
        isPublic: false,
        items: items ? {
          create: items.map((item: any) => ({
            category: item.category,
            description: item.description,
            minCost: parseFloat(item.minCost),
            maxCost: parseFloat(item.maxCost),
            selected: item.selected !== undefined ? item.selected : true,
            quantity: item.quantity ? parseFloat(item.quantity) : null,
            unit: item.unit || null,
            notes: item.notes || null,
          }))
        } : undefined,
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
