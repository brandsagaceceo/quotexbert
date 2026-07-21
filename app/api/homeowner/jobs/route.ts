import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewRenovationLeadEmail, sendJobPostedEmail } from '@/lib/email';

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
        isSeeded: false, // Real homeowners only see their own real jobs
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
    const { title, description, budget, category, city, zipCode, maxContractors = 3, homeownerId } = body;

    if (!title || !description || !category || !homeownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const job = await prisma.lead.create({
      data: {
        title,
        description,
        budget: budget ? budget.toString() : null,
        category,
        city: city || null,
        zipCode: zipCode || null,
        status: 'open',
        maxContractors,
        homeownerId: homeownerId,
      },
    });

    // Notify all active contractors — no category or subscription filter
    try {
      const contractors = await prisma.user.findMany({
        where: {
          role: 'contractor',
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          notifyJobEmail: true,
          notifyJobInApp: true,
          contractorProfile: {
            select: {
              companyName: true,
            },
          },
        },
      });

      console.log(`[JOB ALERT] Job ${job.id} posted — ${contractors.length} contractors to notify`);

      let inAppCount = 0;
      let emailCount = 0;
      let emailFails = 0;

      // Batch prefetch existing LEAD_MATCHED notifications to prevent duplicates
      const existingNotifications = await prisma.notification.findMany({
        where: {
          relatedId: job.id,
          relatedType: 'job',
          userId: { in: contractors.map((c) => c.id) },
        },
        select: { userId: true },
      });
      const alreadyNotified = new Set(existingNotifications.map((n) => n.userId));

      // Batch-create in-app notifications for all contractors not yet notified
      const needInApp = contractors.filter(
        (c) => c.notifyJobInApp !== false && !alreadyNotified.has(c.id)
      );
      if (needInApp.length > 0) {
        await prisma.notification.createMany({
          data: needInApp.map((contractor) => ({
            userId: contractor.id,
            type: 'LEAD_MATCHED',
            title: `New ${category} job available`,
            message: `${title} in ${zipCode || city || 'your area'}`,
            relatedId: job.id,
            relatedType: 'job',
            payload: {
              jobId: job.id,
              jobTitle: title,
              location: zipCode || city || '',
              budget: budget,
              category: category,
            },
            read: false,
          })),
        });
        inAppCount = needInApp.length;
      }

      // Send emails to all contractors who have not opted out
      const emailPromises = contractors
        .filter((c) => c.notifyJobEmail !== false)
        .map(async (contractor) => {
          try {
            const emailResult = await sendNewRenovationLeadEmail(
              {
                id: contractor.id,
                email: contractor.email,
                companyName:
                  contractor.contractorProfile?.companyName ||
                  contractor.name ||
                  'Contractor',
              },
              {
                id: job.id,
                title,
                category,
                city: zipCode || city || '',
                description,
              }
            );

            if (emailResult && (emailResult as any).success === false) {
              emailFails++;
              console.warn(
                `[JOB ALERT] Email not sent for contractor ${contractor.id}: ${(emailResult as any).error}`
              );
            } else {
              emailCount++;
            }
          } catch (emailError) {
            emailFails++;
            console.error(
              `[JOB ALERT] Email exception for contractor ${contractor.id}:`,
              emailError
            );
          }
        });

      await Promise.allSettled(emailPromises);
      console.log(
        `[JOB ALERT] Complete — in-app: ${inAppCount}, emails sent: ${emailCount}, email failures: ${emailFails}`
      );

      // Send homeowner confirmation email
      try {
        const homeownerUser = await prisma.user.findFirst({
          where: { OR: [{ id: homeownerId }, { clerkUserId: homeownerId }] },
          select: { id: true, email: true, name: true },
        });
        if (homeownerUser) {
          const confirmResult = await sendJobPostedEmail({
            homeowner: {
              id: homeownerUser.id,
              email: homeownerUser.email,
              name: homeownerUser.name,
            },
            job: {
              id: job.id,
              title,
              category,
              city: city || '',
              zipCode: zipCode || '',
            },
          });
          console.log(
            `[JOB ALERT] Homeowner confirmation email attempted — success: ${confirmResult.success}`
          );
        } else {
          console.warn(
            `[JOB ALERT] Homeowner user not found for homeownerId ${homeownerId}, skipping confirmation email`
          );
        }
      } catch (homeownerEmailError) {
        console.error(
          '[JOB ALERT] Homeowner confirmation email failed:',
          homeownerEmailError
        );
      }
    } catch (notifyError) {
      console.error('[JOB ALERT] Notification pipeline error:', notifyError);
      // Never fail job creation because of notification errors
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}