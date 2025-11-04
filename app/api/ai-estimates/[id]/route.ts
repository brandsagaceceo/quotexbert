import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { selectedItemIds } = body;

    if (!Array.isArray(selectedItemIds)) {
      return NextResponse.json(
        { success: false, error: 'selectedItemIds must be an array' },
        { status: 400 }
      );
    }

    // Fetch the estimate to verify it exists
    const estimate = await prisma.aIEstimate.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!estimate) {
      return NextResponse.json(
        { success: false, error: 'Estimate not found' },
        { status: 404 }
      );
    }

    // Update all items: set selected=true for items in the array, false for others
    await Promise.all(
      estimate.items.map((item) =>
        prisma.estimateItem.update({
          where: { id: item.id },
          data: { selected: selectedItemIds.includes(item.id) },
        })
      )
    );

    // Fetch updated estimate
    const updatedEstimate = await prisma.aIEstimate.findUnique({
      where: { id },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      estimate: updatedEstimate,
      message: 'Item selections saved successfully',
    });
  } catch (error: any) {
    console.error('Error updating item selections:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update selections' },
      { status: 500 }
    );
  }
}
