import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    const savedProject = await prisma.savedProject.findUnique({
      where: { id: projectId },
      include: {
        aiEstimate: {
          include: {
            items: true
          }
        },
        postedAsLead: {
          include: {
            applications: true,
            acceptances: true
          }
        }
      }
    });

    if (!savedProject) {
      return NextResponse.json({ 
        error: "Project not found" 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      savedProject 
    });

  } catch (error) {
    console.error("[SavedProject GET] Error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch project" 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;
    const body = await request.json();

    const {
      title,
      description,
      category,
      location,
      budget,
      photos,
      status
    } = body;

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (budget !== undefined) updateData.budget = budget;
    if (status !== undefined) updateData.status = status;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);

    const updatedProject = await prisma.savedProject.update({
      where: { id: projectId },
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
      savedProject: updatedProject 
    });

  } catch (error) {
    console.error("[SavedProject PUT] Error:", error);
    return NextResponse.json({ 
      error: "Failed to update project" 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    await prisma.savedProject.delete({
      where: { id: projectId }
    });

    return NextResponse.json({ 
      success: true,
      message: "Project deleted successfully"
    });

  } catch (error) {
    console.error("[SavedProject DELETE] Error:", error);
    return NextResponse.json({ 
      error: "Failed to delete project" 
    }, { status: 500 });
  }
}
