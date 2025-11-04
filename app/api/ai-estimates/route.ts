import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');

    if (!homeownerId) {
      return NextResponse.json(
        { success: false, error: 'homeownerId is required' },
        { status: 400 }
      );
    }

    // Fetch all estimates for this homeowner
    const estimates = await prisma.aIEstimate.findMany({
      where: {
        homeownerId,
      },
      include: {
        items: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        lead: {
          select: {
            id: true,
            title: true,
            status: true,
            published: true,
            applications: {
              select: {
                id: true,
                contractor: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      estimates,
    });
  } catch (error: any) {
    console.error('Error fetching AI estimates:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch estimates' },
      { status: 500 }
    );
  }
}
