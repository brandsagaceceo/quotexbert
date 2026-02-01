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
    
    // Fetch the estimate with selected items and homeowner profile
    const estimate = await prisma.aIEstimate.findUnique({
      where: { id },
      include: {
        items: {
          where: { selected: true },
        },
        homeowner: {
          include: {
            homeownerProfile: true,
          },
        },
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
        { success: false, error: 'No homeowner associated with this estimate. Please sign in and try again.' },
        { status: 400 }
      );
    }

    if (estimate.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No items selected for posting. Please select at least one item.' },
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

    // Get location from homeowner profile or use Toronto default
    // Extract city from homeowner profile for proper location tracking
    const city = estimate.homeowner?.homeownerProfile?.city || 'Toronto';
    
    // Map city to postal code for the Greater Toronto Area
    // This helps contractors find jobs in their service area
    let zipCode = 'M5H 2N2'; // Default Toronto postal code (downtown)
    
    // Improved postal code mapping based on city
    const cityPostalCodes: Record<string, string> = {
      'Toronto': 'M5H 2N2',
      'Mississauga': 'L5B 1M2',
      'Brampton': 'L6Y 0P6',
      'Markham': 'L3R 9W3',
      'Vaughan': 'L4L 4Y7',
      'Richmond Hill': 'L4B 3P6',
      'Oakville': 'L6H 0H3',
      'Burlington': 'L7R 2G5',
      'Ajax': 'L1T 0A2',
      'Pickering': 'L1V 1B8',
      'Whitby': 'L1N 9B9',
      'Oshawa': 'L1H 8L7',
      'Scarborough': 'M1P 4P5',
      'Etobicoke': 'M9C 1B8',
      'North York': 'M2N 5Z7',
    };
    
    // Use city-specific postal code if available
    if (city && cityPostalCodes[city]) {
      zipCode = cityPostalCodes[city];
    }

    // Determine category from estimate items
    const categories = estimate.items.map(item => item.category);
    const primaryCategory = categories[0] || 'General Contractor';

    // Create the lead (job post)
    const lead = await prisma.lead.create({
      data: {
        title: `Home Renovation: ${estimate.description.substring(0, 50)}${estimate.description.length > 50 ? '...' : ''}`,
        description: fullDescription,
        budget: Math.round((totalMin + totalMax) / 2).toString(), // Use average as budget
        zipCode: zipCode,
        category: primaryCategory,
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
      // Get homeowner profile for city info
      const homeownerWithProfile = await prisma.user.findUnique({
        where: { id: estimate.homeownerId },
        include: { homeownerProfile: true },
      });

      const city = homeownerWithProfile?.homeownerProfile?.city || undefined;

      await NotificationService.notifyAllContractors({
        leadId: lead.id,
        title: lead.title,
        description: lead.description,
        budget: lead.budget,
        // Only include city when we have a concrete string value
        ...(city ? { city } : {}),
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
