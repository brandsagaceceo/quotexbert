import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewRenovationLeadEmail } from '@/lib/email';

export const dynamic = "force-dynamic";

// GET - Fetch homeowner's jobs with applications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get('homeownerId');
    
    if (!homeownerId) {
      return NextResponse.json({ error: 'Homeowner ID is required' }, { status: 400 });
    }

    // Resolve ALL DB user IDs that could belong to this homeowner.
    // Users created via webhook have id=UUID with clerkUserId=clerkId.
    // Users created via /api/user/role have id=clerkId with no clerkUserId.
    // Both paths may coexist, so we query with any matching ID.
    const matchingUsers = await prisma.user.findMany({
      where: { OR: [{ id: homeownerId }, { clerkUserId: homeownerId }] },
      select: { id: true },
    });
    const homeownerDbIds = matchingUsers.map((u) => u.id);
    // Always include the provided value in case the user is not in DB yet
    if (!homeownerDbIds.includes(homeownerId)) homeownerDbIds.push(homeownerId);

    console.log(`FETCH homeownerId: received=${homeownerId}, resolved DB ids=[${homeownerDbIds.join(', ')}]`);

    const jobs = await prisma.lead.findMany({
      where: {
        homeownerId: { in: homeownerDbIds },
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

      // ── Batch prefetch: get all existing LEAD_MATCHED for this job in one query ──
      const existingNotifications = await prisma.notification.findMany({
        where: {
          relatedId: job.id,
          relatedType: 'job',
          userId: { in: contractors.map(c => c.id) }
        },
        select: { userId: true }
      });
      const alreadyNotified = new Set(existingNotifications.map(n => n.userId));

      // ── Batch create: all missing in-app notifications in one createMany ─────────
      const needInApp = contractors.filter(
        c => c.notifyJobInApp !== false && !alreadyNotified.has(c.id)
      );
      if (needInApp.length > 0) {
        await prisma.notification.createMany({
          data: needInApp.map(contractor => ({
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
          }))
        });
        inAppCount = needInApp.length;
      }
      const inAppRecipientIds = new Set(needInApp.map(c => c.id));

      // ── Email: check return value — sendNewRenovationLeadEmail doesn't throw on rate limit ──
      const emailPromises = contractors
        .filter(c => c.notifyJobEmail !== false)
        .map(async (contractor) => {
          try {
            const emailResult = await sendNewRenovationLeadEmail(
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

            // Explicit check: function returns { success: false } on rate limit instead of throwing
            if (emailResult && (emailResult as any).success === false) {
              emailFails++;
              console.warn(`[JOB ALERT] Email capped (rate limit) for contractor ${contractor.id}`);
              // Fallback in-app notification if they have no in-app alert at all
              if (!alreadyNotified.has(contractor.id) && !inAppRecipientIds.has(contractor.id)) {
                await prisma.notification.create({
                  data: {
                    userId: contractor.id,
                    type: 'LEAD_MATCHED',
                    title: `New ${category} job available`,
                    message: `${title} — email alert capped, check the job board`,
                    relatedId: job.id,
                    relatedType: 'job',
                    payload: {
                      jobId: job.id,
                      jobTitle: title,
                      location: zipCode,
                      budget: budget,
                      category: category,
                      emailFallback: true
                    },
                    read: false
                  }
                }).catch(() => {});
              }
            } else {
              emailCount++;
            }
          } catch (emailError) {
            emailFails++;
            console.error(`[JOB ALERT] Email failed for contractor ${contractor.id}:`, emailError);
          }
        });

      await Promise.allSettled(emailPromises);
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