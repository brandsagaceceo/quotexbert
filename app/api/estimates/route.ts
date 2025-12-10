import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const homeownerId = searchParams.get('homeownerId');

    if (!homeownerId) {
      return NextResponse.json(
        { error: 'Homeowner ID is required' },
        { status: 400 }
      );
    }

    // Fetch all estimates for this homeowner
    const estimates = await prisma.aIEstimate.findMany({
      where: {
        homeownerId: homeownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        items: true,
      },
    });

    // Transform the estimates to include parsed factors
    const transformedEstimates = estimates.map(estimate => ({
      id: estimate.id,
      description: estimate.description,
      minCost: estimate.minCost,
      maxCost: estimate.maxCost,
      confidence: Math.round((estimate.confidence || 0) * 100),
      aiPowered: estimate.aiPowered,
      enhancedDescription: estimate.enhancedDescription,
      factors: estimate.factors ? JSON.parse(estimate.factors as string) : [],
      hasVoice: estimate.hasVoice,
      imageCount: estimate.imageCount,
      status: estimate.status,
      isPublic: estimate.isPublic,
      createdAt: estimate.createdAt,
      updatedAt: estimate.updatedAt,
      items: estimate.items,
    }));

    return NextResponse.json({ 
      estimates: transformedEstimates 
    });

  } catch (error) {
    console.error('Error fetching estimates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch estimates' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const estimateId = searchParams.get('id');
    const homeownerId = searchParams.get('homeownerId');

    if (!estimateId || !homeownerId) {
      return NextResponse.json(
        { error: 'Estimate ID and Homeowner ID are required' },
        { status: 400 }
      );
    }

    // Verify the estimate belongs to this homeowner
    const estimate = await prisma.aIEstimate.findFirst({
      where: {
        id: estimateId,
        homeownerId: homeownerId,
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { error: 'Estimate not found or does not belong to this user' },
        { status: 404 }
      );
    }

    // Delete the estimate (items will be cascade deleted)
    await prisma.aIEstimate.delete({
      where: {
        id: estimateId,
      },
    });

    return NextResponse.json({ 
      success: true,
      message: 'Estimate deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting estimate:', error);
    return NextResponse.json(
      { error: 'Failed to delete estimate' },
      { status: 500 }
    );
  }
}
