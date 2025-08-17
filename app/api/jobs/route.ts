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

    const where: any = {
      status: "open",
      published: true,
    };

    if (trade) {
      where.trade = {
        contains: trade,
        mode: "insensitive",
      };
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      };
    }

    const jobs = await prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 },
    );
  }
}
