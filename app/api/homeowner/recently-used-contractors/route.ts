import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/homeowner/recently-used-contractors
 *
 * "Recently Used Contractors" — derived ONLY from real, legitimate hire relationships:
 *   - contractor was accepted/hired for a job (lead.contractorId set, status assigned/
 *     pending_completion/completed)
 * Never populated from: likes, profile views, browsing, seeded/demo data, or
 * unfinished/unaccepted applications.
 *
 * One card per contractor, sorted by most recent relevant job first.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId: homeownerId } = authResult.user;

    const leads = await prisma.lead.findMany({
      where: {
        homeownerId,
        isSeeded: false,
        contractorId: { not: null },
        status: { in: ["assigned", "pending_completion", "completed"] },
      },
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        contractorId: true,
        completedAt: true,
        homeownerConfirmedAt: true,
        updatedAt: true,
        contractor: {
          select: {
            id: true,
            name: true,
            contractorProfile: {
              select: {
                companyName: true,
                trade: true,
                city: true,
                verified: true,
                avgRating: true,
                reviewCount: true,
                completedJobs: true,
                profilePhoto: true,
                businessLogo: true,
              },
            },
          },
        },
      },
      orderBy: [{ completedAt: "desc" }, { updatedAt: "desc" }],
    });

    type CardAcc = {
      contractorId: string;
      name: string;
      companyName: string | null;
      trade: string | null;
      city: string | null;
      verified: boolean;
      avgRating: number;
      reviewCount: number;
      profilePhoto: string | null;
      completedJobsWithHomeowner: number;
      mostRecentJobTitle: string;
      mostRecentJobDate: string;
      mostRecentJobCategory: string;
      mostRecentLeadId: string;
    };

    const byContractor = new Map<string, CardAcc>();

    for (const lead of leads) {
      if (!lead.contractorId || !lead.contractor) continue;
      const relevantDate = lead.completedAt || lead.homeownerConfirmedAt || lead.updatedAt;

      let card = byContractor.get(lead.contractorId);
      if (!card) {
        const profile = lead.contractor.contractorProfile;
        card = {
          contractorId: lead.contractorId,
          name: lead.contractor.name || "Contractor",
          companyName: profile?.companyName || null,
          trade: profile?.trade || null,
          city: profile?.city || null,
          verified: profile?.verified || false,
          avgRating: profile?.avgRating || 0,
          reviewCount: profile?.reviewCount || 0,
          profilePhoto: profile?.profilePhoto || profile?.businessLogo || null,
          completedJobsWithHomeowner: 0,
          mostRecentJobTitle: lead.title,
          mostRecentJobDate: relevantDate.toISOString(),
          mostRecentJobCategory: lead.category,
          mostRecentLeadId: lead.id,
        };
        byContractor.set(lead.contractorId, card);
      }
      if (lead.status === "completed") {
        card.completedJobsWithHomeowner += 1;
      }
    }

    // leads is already ordered most-recent-first, so the Map insertion order for
    // mostRecentJobTitle/Date above reflects each contractor's most recent job.
    const contractors = Array.from(byContractor.values()).sort(
      (a, b) => new Date(b.mostRecentJobDate).getTime() - new Date(a.mostRecentJobDate).getTime(),
    );

    return NextResponse.json({ success: true, contractors });
  } catch (error) {
    console.error("Error fetching recently used contractors:", error);
    return NextResponse.json({ error: "Failed to fetch recently used contractors" }, { status: 500 });
  }
}
