import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendJobPostedEmail } from "@/lib/email";
import { NotificationService } from "@/lib/notifications";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

async function resolveHomeownerIdentity() {
  const authResult = await resolveAuthUser();
  if ("error" in authResult) {
    return {
      error: NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      ),
    };
  }

  const { dbUserId, clerkUserId } = authResult.user;
  const principalIds = [...new Set([dbUserId, clerkUserId])];
  const linkedUsers = await prisma.user.findMany({
    where: {
      OR: [{ id: { in: principalIds } }, { clerkUserId }],
    },
    select: {
      id: true,
      role: true,
      homeownerProfile: { select: { userId: true } },
      contractorProfile: { select: { userId: true } },
    },
  });

  const explicitRoles = linkedUsers
    .map((user) => user.role)
    .filter((role): role is string => role !== null);
  const isHomeowner =
    explicitRoles.length > 0
      ? explicitRoles.every((role) => role === "homeowner")
      : linkedUsers.some(
          (user) =>
            user.homeownerProfile !== null && user.contractorProfile === null,
        );

  if (!isHomeowner) {
    return {
      error: NextResponse.json(
        { error: "Homeowner access required" },
        { status: 403 },
      ),
    };
  }

  return {
    user: authResult.user,
    homeownerIds: [
      ...new Set([...principalIds, ...linkedUsers.map((user) => user.id)]),
    ],
  };
}

// GET - Fetch the authenticated homeowner's jobs with applications
export async function GET(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if ("error" in identity) return identity.error;

    const jobs = await prisma.lead.findMany({
      where: {
        homeownerId: { in: identity.homeownerIds },
        isSeeded: false,
      },
      include: {
        applications: {
          include: {
            contractor: {
              include: {
                contractorProfile: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching homeowner jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}

// POST - Create a job for the authenticated homeowner
export async function POST(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if ("error" in identity) return identity.error;

    const body = await request.json();
    const {
      title,
      description,
      budget,
      category,
      city,
      zipCode,
      maxContractors = 3,
    } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const job = await prisma.lead.create({
      data: {
        title,
        description,
        budget: budget ? budget.toString() : null,
        category,
        city: city || null,
        zipCode: zipCode || null,
        status: "open",
        maxContractors,
        homeownerId: identity.user.dbUserId,
      },
    });

    // Notification failures must not undo an otherwise successful job creation.
    try {
      await NotificationService.notifyAllContractors({
        leadId: job.id,
        title,
        description,
        budget: typeof budget === "number" ? budget : null,
        city: city || undefined,
        province: undefined,
        category,
        createdAt: job.createdAt.toISOString(),
        isSeeded: job.isSeeded,
      });
      console.log(
        `[JOB ALERT] NotificationService completed for job ${job.id}`,
      );

      try {
        const homeownerUser = await prisma.user.findFirst({
          where: {
            OR: [
              { id: identity.user.dbUserId },
              { id: identity.user.clerkUserId },
              { clerkUserId: identity.user.clerkUserId },
            ],
          },
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
              city: city || "",
              zipCode: zipCode || "",
            },
          });
          console.log(
            `[JOB ALERT] Homeowner confirmation email attempted — success: ${confirmResult.success}`,
          );
        } else {
          console.warn(
            `[JOB ALERT] Homeowner user not found for authenticated user ${identity.user.dbUserId}, skipping confirmation email`,
          );
        }
      } catch (homeownerEmailError) {
        console.error(
          "[JOB ALERT] Homeowner confirmation email failed:",
          homeownerEmailError,
        );
      }
    } catch (notifyError) {
      console.error("[JOB ALERT] Notification pipeline error:", notifyError);
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 },
    );
  }
}
