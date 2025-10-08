import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trade = searchParams.get("trade");
    const city = searchParams.get("city");
    const homeownerId = searchParams.get("homeownerId");
    const contractorId = searchParams.get("contractorId");

    const where: any = {
      published: true,
    };

    // If fetching for a specific homeowner
    if (homeownerId) {
      where.homeownerId = homeownerId;
    }
    
    // If fetching for a specific contractor
    if (contractorId) {
      where.acceptedById = contractorId;
    }
    
    // If no specific user, show open jobs
    if (!homeownerId && !contractorId) {
      where.status = "open";
    }

    if (trade) {
      where.category = {
        contains: trade,
        mode: "insensitive",
      };
    }

    if (city) {
      where.zipCode = {
        contains: city,
        mode: "insensitive",
      };
    }

    const jobs = await prisma.lead.findMany({
      where,
      include: {
        homeowner: {
          select: {
            email: true
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    console.log(`Fetching jobs...`);
    console.log(`Found jobs:`, jobs);

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
