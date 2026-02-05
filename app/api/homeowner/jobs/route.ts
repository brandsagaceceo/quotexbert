import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmailNotification } from '@/lib/email-notifications';

// GET - Fetch homeowner's jobs with applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');
    
    if (!homeownerId) {
      return NextResponse.json({ error: 'Homeowner ID is required' }, { status: 400 });
    }

    const jobs = await prisma.lead.findMany({
      where: {
        homeownerId: homeownerId
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching homeowner jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST - Create a new job
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, budget, category, zipCode, maxContractors = 3, homeownerId } = body;

    if (!title || !description || !budget || !category || !zipCode || !homeownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.lead.create({
      data: {
        title,
        description,
        budget: budget.toString(), // Ensure budget is stored as string
        category,
        zipCode,
        status: 'open',
        maxContractors,
        homeownerId: homeownerId
      }
    });

    // Find contractors subscribed to this category and send notifications
    try {
      const contractors = await prisma.user.findMany({
        where: {
          role: 'contractor',
          subscriptions: {
            some: {
              category: category,
              status: 'active',
              canClaimLeads: true
            }
          }
        },
        select: {
          id: true,
          email: true,
          name: true
        }
      });

      // Send email notifications to all subscribed contractors
      const notificationPromises = contractors.map(contractor =>
        sendEmailNotification({
          type: 'job_posted',
          toEmail: contractor.email,
          data: {
            jobTitle: title,
            jobId: job.id,
            location: zipCode,
            budget: budget,
            category: category,
            description: description
          }
        })
      );

      await Promise.allSettled(notificationPromises);
      console.log(`📧 Sent ${contractors.length} job notification emails for new job: ${title}`);
    } catch (emailError) {
      console.error('Error sending job notifications:', emailError);
      // Don't fail job creation if notifications fail
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}