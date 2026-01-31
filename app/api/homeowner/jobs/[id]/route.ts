import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');
    const resolvedParams = await params;
    
    if (!homeownerId) {
      return NextResponse.json({ error: 'Homeowner ID is required' }, { status: 400 });
    }

    const job = await prisma.lead.findUnique({
      where: {
        id: resolvedParams.id,
        homeownerId: homeownerId // Ensure the homeowner owns this job
      },
      include: {
        applications: {
          include: {
            contractor: {
              include: {
                contractorProfile: true
              }
            }
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');
    
    if (!homeownerId) {
      return NextResponse.json({ error: 'Homeowner ID is required' }, { status: 400 });
    }

    // First, verify the job belongs to this homeowner
    const job = await prisma.lead.findUnique({
      where: {
        id: resolvedParams.id,
        homeownerId: homeownerId
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or you do not have permission to delete it' }, { status: 404 });
    }

    // Delete the job (applications will be deleted automatically via cascade)
    await prisma.lead.delete({
      where: {
        id: resolvedParams.id
      }
    });

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');
    const body = await request.json();
    
    if (!homeownerId) {
      return NextResponse.json({ error: 'Homeowner ID is required' }, { status: 400 });
    }

    // First, verify the job belongs to this homeowner
    const job = await prisma.lead.findUnique({
      where: {
        id: resolvedParams.id,
        homeownerId: homeownerId
      }
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or you do not have permission to edit it' }, { status: 404 });
    }

    // Update the job
    const updatedJob = await prisma.lead.update({
      where: {
        id: resolvedParams.id
      },
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        budget: body.budget,
        zipCode: body.zipCode,
        photos: body.photos || []
      }
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}