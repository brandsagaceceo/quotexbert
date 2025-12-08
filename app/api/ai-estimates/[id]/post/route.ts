import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { NotificationService } from '@/lib/notifications';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch the estimate with selected items
    const estimate = await prisma.aIEstimate.findUnique({
      where: { id },
      include: {
        items: {
          where: { selected: true },
        },
        homeowner: true,
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { success: false, error: 'Estimate not found' },
        { status: 404 }
      );
    }

    if (!estimate.homeownerId) {
      return NextResponse.json(
        { success: false, error: 'No homeowner associated with this estimate' },
        { status: 400 }
      );
    }

    if (estimate.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items selected for posting' },
        { status: 400 }
      );
    }

    if (estimate.leadId) {
      return NextResponse.json(
        { success: false, error: 'Estimate already posted to job board', leadId: estimate.leadId },
        { status: 400 }
      );
    }

    // Calculate total cost from selected items
    const totalMin = estimate.items.reduce((sum, item) => sum + item.minCost, 0);
    const totalMax = estimate.items.reduce((sum, item) => sum + item.maxCost, 0);

    // Create a comprehensive description from selected items
    const itemDescriptions = estimate.items.map(
      (item) =>
        `${item.category}: ${item.description}${item.quantity ? ` (${item.quantity} ${item.unit || 'units'})` : ''}`
    );
    const fullDescription = `${estimate.description}\n\n**Selected Items:**\n${itemDescriptions.join('\n')}`;

    // Create the lead (job post)
    const lead = await prisma.lead.create({
      data: {
        title: `Home Renovation: ${estimate.description.substring(0, 50)}${estimate.description.length > 50 ? '...' : ''}`,
        description: fullDescription,
        budget: Math.round((totalMin + totalMax) / 2).toString(), // Use average as budget
        zipCode: '00000', // Default zipCode
        category: 'General Contractor', // Default, can be extracted from items
        status: 'open',
        published: true,
        homeownerId: estimate.homeownerId,
      },
    });

    // Get visualization image URL from request body if provided
    const body = await request.json().catch(() => ({}));
    const visualizationUrl = body.visualizationUrl || null;

    // Update the estimate with the lead ID and status
    const updatedEstimate = await prisma.aIEstimate.update({
      where: { id },
      data: {
        leadId: lead.id,
        status: 'posted',
        isPublic: true,
      },
    });

    // If visualization URL provided, update the lead with it
    if (visualizationUrl) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          // Store visualization in photos field (JSON array)
          photos: JSON.stringify([visualizationUrl]),
        },
      });
    }

    // 🚀 NOTIFY ALL CONTRACTORS IMMEDIATELY about this new job
    try {
      await NotificationService.notifyAllContractors({
        leadId: lead.id,
        title: lead.title,
        description: lead.description,
        budget: lead.budget,
        city: estimate.homeowner?.homeownerProfile?.city,
      });
    } catch (notificationError) {
      console.error('Failed to notify contractors, but job was posted:', notificationError);
      // Continue - job post succeeded even if notifications failed
    }

    return NextResponse.json({
      success: true,
      estimate: updatedEstimate,
      lead: lead,
      hasVisualization: !!visualizationUrl,
      message: visualizationUrl 
        ? 'Successfully posted to job board with AI visualization and notified all contractors! 🎨'
        : 'Successfully posted to job board and notified all contractors!',
    });
  } catch (error: any) {
    console.error('Error posting estimate to job board:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to post to job board' },
      { status: 500 }
    );
  }
}
