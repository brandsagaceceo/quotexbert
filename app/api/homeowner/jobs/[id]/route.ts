import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuthUser } from '@/lib/server-auth';

export const dynamic = "force-dynamic";

const EDITABLE_STATUSES = new Set(['draft', 'open', 'reviewing']);
const SAFE_ASSIGNED_FIELDS = new Set(['photos']);

function cleanText(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function parsePhotoList(value: unknown): string[] {
  const raw = typeof value === 'string' ? (() => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })() : value;

  return Array.isArray(raw)
    ? raw.filter((photo): photo is string => typeof photo === 'string' && /^https?:\/\//i.test(photo)).slice(0, 10)
    : [];
}

function importantFieldsChanged(previous: Record<string, unknown>, next: Record<string, unknown>): boolean {
  return ['title', 'description', 'category', 'budget', 'city', 'province', 'zipCode'].some((field) =>
    typeof next[field] !== 'undefined' && String(previous[field] ?? '') !== String(next[field] ?? '')
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const resolvedParams = await params;

    const job = await prisma.lead.findFirst({
      where: {
        id: resolvedParams.id,
        homeownerId: authResult.user.dbUserId,
        isSeeded: false,
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

    return NextResponse.json({
      ...job,
      photos: parsePhotoList(job.photos),
      canEdit: EDITABLE_STATUSES.has(job.status) || job.status === 'assigned',
      readOnly: job.status === 'completed' || job.status === 'closed',
    });
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
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const resolvedParams = await params;

    // Verify the job belongs to this homeowner
    const job = await prisma.lead.findFirst({
      where: {
        id: resolvedParams.id,
        homeownerId: authResult.user.dbUserId,
        isSeeded: false,
      },
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
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const resolvedParams = await params;
    const body = await request.json();

    // Verify the job belongs to this homeowner
    const job = await prisma.lead.findFirst({
      where: {
        id: resolvedParams.id,
        homeownerId: authResult.user.dbUserId,
        isSeeded: false,
      },
      include: {
        applications: { select: { contractorId: true, status: true } },
        aiEstimate: { select: { id: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or you do not have permission to edit it' }, { status: 404 });
    }

    if (job.status === 'completed' || job.status === 'closed') {
      return NextResponse.json({ error: 'Completed jobs are read only' }, { status: 409 });
    }

    const changedKeys = Object.keys(body).filter((key) => key !== 'homeownerId');
    if (job.status === 'assigned' && changedKeys.some((key) => !SAFE_ASSIGNED_FIELDS.has(key))) {
      return NextResponse.json({ error: 'A selected contractor is attached to this job. Only photos can be updated.' }, { status: 409 });
    }

    if (!EDITABLE_STATUSES.has(job.status) && job.status !== 'assigned') {
      return NextResponse.json({ error: 'This job cannot be edited in its current state' }, { status: 409 });
    }

    const updateData: Record<string, any> = {};
    const nextTitle = cleanText(body.title, 120);
    const nextDescription = cleanText(body.description, 3000);
    const nextCategory = cleanText(body.category, 120);
    const nextBudget = cleanText(body.budget, 100); // Treat budget as a simple string
    const nextCity = cleanText(body.city, 100);
    const nextProvince = cleanText(body.province, 50);
    const nextZipCode = cleanText(body.zipCode, 20)?.toUpperCase();

    if (typeof body.title !== 'undefined') updateData.title = nextTitle ?? job.title;
    if (typeof body.description !== 'undefined') updateData.description = nextDescription ?? job.description;
    if (typeof body.category !== 'undefined') updateData.category = nextCategory ?? job.category;
    if (typeof body.budget !== 'undefined') updateData.budget = nextBudget ?? job.budget;
    if (typeof body.city !== 'undefined') updateData.city = nextCity ?? job.city;
    if (typeof body.province !== 'undefined') updateData.province = nextProvince ?? job.province;
    if (typeof body.zipCode !== 'undefined') updateData.zipCode = nextZipCode ?? job.zipCode;
    if (typeof body.photos !== 'undefined') updateData.photos = JSON.stringify(parsePhotoList(body.photos));

    const shouldNotifyApplicants = importantFieldsChanged(job, updateData) && job.applications.length > 0;

    // Update the job
    const updatedJob = await prisma.lead.update({
      where: {
        id: resolvedParams.id
      },
      data: updateData,
      include: {
        applications: true,
        aiEstimate: { select: { id: true } },
      },
    });

    if (shouldNotifyApplicants) {
      const pendingApplicantIds = Array.from(new Set(
        job.applications
          .filter((application) => application.status === 'pending')
          .map((application) => application.contractorId)
      ));

      if (pendingApplicantIds.length > 0) {
        const alreadyNotified = await prisma.notification.findMany({
          where: {
            userId: { in: pendingApplicantIds },
            relatedId: job.id,
            relatedType: 'job',
            type: 'job_updated',
          },
          select: { userId: true },
        });
        const notifiedIds = new Set(alreadyNotified.map((notification) => notification.userId));
        const recipients = pendingApplicantIds.filter((contractorId) => !notifiedIds.has(contractorId));

        if (recipients.length > 0) {
          await prisma.notification.createMany({
            data: recipients.map((contractorId) => ({
              userId: contractorId,
              type: 'job_updated',
              title: 'Project details updated',
              message: `The homeowner updated "${updatedJob.title}". Review the latest details before quoting.`,
              relatedId: job.id,
              relatedType: 'job',
              payload: { jobId: job.id },
              read: false,
            })),
          });
        }
      }
    }

    return NextResponse.json({ ...updatedJob, photos: parsePhotoList(updatedJob.photos) });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}