import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { success: false, error: identity.error },
        { status: identity.status },
      );
    }

    const estimates = await prisma.aIEstimate.findMany({
      where: {
        homeownerId: { in: identity.homeownerIds },
      },
      include: {
        items: {
          orderBy: {
            createdAt: "asc",
          },
        },
        lead: {
          select: {
            id: true,
            title: true,
            status: true,
            published: true,
            applications: {
              select: {
                id: true,
                contractor: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      estimates,
    });
  } catch (error: any) {
    console.error("Error fetching AI estimates:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch estimates" },
      { status: 500 },
    );
  }
}
