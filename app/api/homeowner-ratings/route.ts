import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import { isGodUser } from "@/lib/god-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_NOTE_LENGTH = 500;

function clampRating(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n);
  if (rounded < 1 || rounded > 5) return null;
  return rounded;
}

/** Strips HTML/scripts, trims, and enforces a character limit. Never used publicly. */
function sanitizeNote(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const stripped = input.replace(/<[^>]*>/g, "").trim();
  if (!stripped) return null;
  return stripped.slice(0, MAX_NOTE_LENGTH);
}

/**
 * POST /api/homeowner-ratings
 *
 * PRIVATE contractor -> homeowner "job experience" rating. Never public.
 * A contractor may rate a homeowner only when:
 *  - the contractor was hired/accepted for the job (lead.contractorId === caller)
 *  - the job is marked "completed" (homeowner confirmed)
 *  - the contractor has not already rated the homeowner for that job
 *  - the job is not seeded/demo data
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: contractorId } = authResult.user;

    const caller = await prisma.user.findUnique({
      where: { id: contractorId },
      select: { role: true },
    });
    if (!caller || caller.role !== "contractor") {
      return NextResponse.json(
        { error: "Only contractors can submit a homeowner experience rating" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const leadId = typeof body.leadId === "string" ? body.leadId : null;
    if (!leadId) {
      return NextResponse.json({ error: "leadId is required" }, { status: 400 });
    }

    const overallRating = clampRating(body.overallRating);
    if (overallRating === null) {
      return NextResponse.json(
        { error: "overallRating must be a whole number from 1 to 5" },
        { status: 400 },
      );
    }

    const optionalCategories: Record<string, number | null> = {
      communicationRating: null,
      clarityRating: null,
      responsivenessRating: null,
      paymentRating: null,
      accessReadinessRating: null,
      professionalismRating: null,
    };
    for (const key of Object.keys(optionalCategories)) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== "") {
        const val = clampRating(body[key]);
        if (val === null) {
          return NextResponse.json({ error: `${key} must be a whole number from 1 to 5` }, { status: 400 });
        }
        optionalCategories[key] = val;
      }
    }

    const privateNote = sanitizeNote(body.privateNote);

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: {
        id: true,
        status: true,
        contractorId: true,
        homeownerId: true,
        isSeeded: true,
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    if (lead.isSeeded) {
      return NextResponse.json({ error: "Cannot rate a demo/seeded job" }, { status: 400 });
    }

    if (!lead.contractorId || lead.contractorId !== contractorId) {
      return NextResponse.json(
        { error: "You were not hired for this job" },
        { status: 403 },
      );
    }

    if (lead.homeownerId === contractorId) {
      // Defensive guard — cannot rate yourself
      return NextResponse.json({ error: "Invalid rating target" }, { status: 400 });
    }

    if (lead.status !== "completed") {
      return NextResponse.json(
        { error: "You can only rate a homeowner after the job is confirmed complete" },
        { status: 400 },
      );
    }

    const existing = await prisma.homeownerRating.findUnique({
      where: { leadId_contractorId: { leadId, contractorId } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "You have already rated this homeowner for this job" },
        { status: 400 },
      );
    }

    const rating = await prisma.homeownerRating.create({
      data: {
        leadId,
        contractorId,
        homeownerId: lead.homeownerId,
        overallRating,
        ...optionalCategories,
        privateNote,
      },
    });

    // Recalculate the homeowner's private aggregate
    const agg = await prisma.homeownerRating.aggregate({
      where: { homeownerId: lead.homeownerId },
      _avg: { overallRating: true },
      _count: { _all: true },
    });
    await prisma.user.update({
      where: { id: lead.homeownerId },
      data: {
        avgHomeownerRating: agg._avg.overallRating || 0,
        homeownerRatingCount: agg._count._all,
      },
    });

    return NextResponse.json({ success: true, rating: { id: rating.id, overallRating: rating.overallRating } });
  } catch (error) {
    console.error("Error submitting homeowner rating:", error);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}

/**
 * GET /api/homeowner-ratings?homeownerId=xxx
 *
 * Returns the PRIVATE aggregate experience score for a homeowner. Only visible to:
 *  - a contractor already involved in a job with this homeowner (hired/accepted), or
 *  - a contractor considering an open job currently posted by this homeowner
 *      (has applied/accepted on one of their open/reviewing jobs), or
 *  - an internal admin/test account (isGodUser)
 * Never returns other contractors' private notes — only the caller's own note (if any)
 * plus anonymous aggregate numbers.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: callerId, email } = authResult.user;

    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get("homeownerId");
    if (!homeownerId) {
      return NextResponse.json({ error: "homeownerId is required" }, { status: 400 });
    }

    const caller = await prisma.user.findUnique({
      where: { id: callerId },
      select: { role: true },
    });

    const isAdmin = isGodUser(email);

    if (!isAdmin) {
      if (!caller || caller.role !== "contractor") {
        return NextResponse.json({ error: "Not authorized to view this data" }, { status: 403 });
      }

      const [involvedLead, consideredLead] = await Promise.all([
        prisma.lead.findFirst({
          where: { homeownerId, contractorId: callerId },
          select: { id: true },
        }),
        prisma.lead.findFirst({
          where: {
            homeownerId,
            status: { in: ["open", "reviewing"] },
            OR: [
              { applications: { some: { contractorId: callerId } } },
              { acceptances: { some: { contractorId: callerId } } },
            ],
          },
          select: { id: true },
        }),
      ]);

      if (!involvedLead && !consideredLead) {
        return NextResponse.json(
          { error: "You do not have a legitimate connection to this homeowner" },
          { status: 403 },
        );
      }
    }

    const [homeowner, ownRating] = await Promise.all([
      prisma.user.findUnique({
        where: { id: homeownerId },
        select: { avgHomeownerRating: true, homeownerRatingCount: true },
      }),
      prisma.homeownerRating.findFirst({
        where: { homeownerId, contractorId: callerId },
        select: {
          overallRating: true,
          communicationRating: true,
          clarityRating: true,
          responsivenessRating: true,
          paymentRating: true,
          accessReadinessRating: true,
          professionalismRating: true,
          privateNote: true,
          createdAt: true,
        },
      }),
    ]);

    if (!homeowner) {
      return NextResponse.json({ error: "Homeowner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      averageExperienceRating: homeowner.avgHomeownerRating,
      completedJobRatingCount: homeowner.homeownerRatingCount,
      myRating: ownRating, // the caller's own submitted rating/note, if any — never anyone else's note
    });
  } catch (error) {
    console.error("Error fetching homeowner rating:", error);
    return NextResponse.json({ error: "Failed to fetch rating" }, { status: 500 });
  }
}
