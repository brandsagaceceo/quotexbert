import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST - Convert a saved project to a job board listing
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { savedProjectId } = body;

    if (!savedProjectId) {
      return NextResponse.json({ 
        error: "savedProjectId is required" 
      }, { status: 400 });
    }

    // Get the saved project
    const savedProject = await prisma.savedProject.findUnique({
      where: { id: savedProjectId },
      include: {
        aiEstimate: {
          include: {
            items: true
          }
        }
      }
    });

    if (!savedProject) {
      return NextResponse.json({ 
        error: "Saved project not found" 
      }, { status: 404 });
    }

    // Check if already posted
    if (savedProject.postedAsLeadId) {
      return NextResponse.json({ 
        error: "This project has already been posted to the job board",
        leadId: savedProject.postedAsLeadId
      }, { status: 400 });
    }

    // Create a Lead from the saved project
    const lead = await prisma.lead.create({
      data: {
        title: savedProject.title,
        description: savedProject.description,
        category: savedProject.category,
        budget: savedProject.budget || '$5,000 - $10,000',
        zipCode: savedProject.location || 'M5A 1A1', // Default Toronto postal code
        photos: savedProject.photos || '[]',
        homeownerId: savedProject.homeownerId,
        status: 'open',
        published: true,
        claimed: false,
        maxContractors: 3
      }
    });

    // Update the saved project to link to the lead
    const updatedProject = await prisma.savedProject.update({
      where: { id: savedProjectId },
      data: {
        status: 'posted',
        postedAsLeadId: lead.id
      },
      include: {
        postedAsLead: true,
        aiEstimate: {
          include: {
            items: true
          }
        }
      }
    });

    // Also update the AI estimate if it exists
    if (savedProject.aiEstimateId) {
      await prisma.aIEstimate.update({
        where: { id: savedProject.aiEstimateId },
        data: {
          status: 'posted',
          isPublic: true,
          leadId: lead.id
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      lead,
      savedProject: updatedProject,
      message: "Project posted to job board successfully"
    });

  } catch (error) {
    console.error("[SavedProjects Post to Board] Error:", error);
    return NextResponse.json({ 
      error: "Failed to post project to job board" 
    }, { status: 500 });
  }
}
