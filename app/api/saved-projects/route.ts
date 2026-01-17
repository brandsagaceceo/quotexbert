import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all saved projects for a homeowner
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');

    if (!homeownerId) {
      return NextResponse.json({ error: "homeownerId is required" }, { status: 400 });
    }

    const savedProjects = await prisma.savedProject.findMany({
      where: {
        homeownerId
      },
      include: {
        aiEstimate: {
          include: {
            items: true
          }
        },
        postedAsLead: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      savedProjects 
    });

  } catch (error) {
    console.error("[SavedProjects GET] Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch saved projects" 
    }, { status: 500 });
  }
}

// POST - Create a new saved project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      homeownerId,
      title,
      description,
      category,
      location,
      budget,
      photos,
      visualizerImages,
      aiEstimateId,
      estimateSummary
    } = body;

    if (!homeownerId || !title || !description) {
      return NextResponse.json({ 
        error: "Missing required fields: homeownerId, title, description" 
      }, { status: 400 });
    }

    const savedProject = await prisma.savedProject.create({
      data: {
        homeownerId,
        title,
        description,
        category: category || 'general',
        location,
        budget,
        photos: photos ? JSON.stringify(photos) : '[]',
        visualizerImages: visualizerImages ? JSON.stringify(visualizerImages) : '[]',
        aiEstimateId,
        estimateSummary: estimateSummary ? JSON.stringify(estimateSummary) : null,
        status: 'draft'
      },
      include: {
        aiEstimate: {
          include: {
            items: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      savedProject 
    });

  } catch (error) {
    console.error("[SavedProjects POST] Error:", error);
    return NextResponse.json({ 
      error: "Failed to create saved project" 
    }, { status: 500 });
  }
}

// PUT - Update an existing saved project
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      title,
      description,
      category,
      location,
      budget,
      photos,
      visualizerImages,
      estimateSummary,
      status
    } = body;

    if (!id) {
      return NextResponse.json({ 
        error: "Project id is required" 
      }, { status: 400 });
    }

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (budget !== undefined) updateData.budget = budget;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);
    if (visualizerImages !== undefined) updateData.visualizerImages = JSON.stringify(visualizerImages);
    if (estimateSummary !== undefined) updateData.estimateSummary = JSON.stringify(estimateSummary);
    if (status !== undefined) updateData.status = status;

    const savedProject = await prisma.savedProject.update({
      where: { id },
      data: updateData,
      include: {
        aiEstimate: {
          include: {
            items: true
          }
        },
        postedAsLead: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      savedProject 
    });

  } catch (error) {
    console.error("[SavedProjects PUT] Error:", error);
    return NextResponse.json({ 
      error: "Failed to update saved project" 
    }, { status: 500 });
  }
}

// DELETE - Delete a saved project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        error: "Project id is required" 
      }, { status: 400 });
    }

    await prisma.savedProject.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Saved project deleted successfully" 
    });

  } catch (error) {
    console.error("[SavedProjects DELETE] Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete saved project" 
    }, { status: 500 });
  }
}
