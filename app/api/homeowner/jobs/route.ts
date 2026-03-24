import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewRenovationLeadEmail } from '@/lib/email';

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
          isActive: true,
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
          name: true,
          notifyJobEmail: true,
          notifyJobInApp: true,
          contractorProfile: {
            select: {
              companyName: true
            }
          }
        }
      });

      console.log(`[JOB ALERT] Job ${job.id} posted — ${contractors.length} matching contractors found for category "${category}"`);

      let inAppCount = 0;
      let emailCount = 0;
      let emailFails = 0;

      // Create in-app notifications and send emails to all subscribed contractors
      const notificationPromises = contractors.map(async (contractor) => {
        // Create in-app notification if enabled
        if (contractor.notifyJobInApp !== false) {
          // Duplicate guard: skip if already notified for this job
          const existing = await prisma.notification.findFirst({
            where: { userId: contractor.id, relatedId: job.id, relatedType: 'job' },
            select: { id: true },
          });
          if (!existing) {
            await prisma.notification.create({
              data: {
                userId: contractor.id,
                type: 'LEAD_MATCHED',
                title: `New ${category} job available`,
                message: `${title} - ${budget} in ${zipCode}`,
                relatedId: job.id,
                relatedType: 'job',
                payload: {
                  jobId: job.id,
                  jobTitle: title,
                  location: zipCode,
                  budget: budget,
                  category: category
                },
                read: false
              }
            }).then(() => inAppCount++)
              .catch(err => console.error('Failed to create notification:', err));
          }
        }

        // Send email notification if enabled
        if (contractor.notifyJobEmail !== false) {
          try {
            await sendNewRenovationLeadEmail(
              {
                id: contractor.id,
                email: contractor.email,
                companyName: contractor.contractorProfile?.companyName || contractor.name || 'Contractor',
              },
              {
                id: job.id,
                title,
                category,
                city: zipCode,
                description,
              }
            );
            emailCount++;
          } catch (emailError) {
            emailFails++;
            console.error(`[JOB ALERT] Email failed for contractor ${contractor.id}:`, emailError);
          }
        }
      });

      await Promise.allSettled(notificationPromises);
      console.log(`[JOB ALERT] Pipeline complete — ${inAppCount} in-app, ${emailCount} emails sent, ${emailFails} email failures for job: ${title}`);
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