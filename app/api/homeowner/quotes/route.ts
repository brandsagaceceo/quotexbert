import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // PRIVACY: scope to the authenticated homeowner. The client-supplied
    // homeownerId is ignored for authorization so it can't be tampered to read
    // another user's quotes.
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;

    // Get quotes for jobs owned by this homeowner
    const quotes = await prisma.quote.findMany({
      where: {
        job: {
          homeownerId: dbUserId
        }
      },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            category: true,
            zipCode: true
          }
        },
        contractor: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: {
              select: {
                companyName: true,
                trade: true,
                city: true
              }
            }
          }
        },
        items: {
          orderBy: {
            createdAt: "asc"
          }
        },
        conversation: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(quotes);

  } catch (error) {
    console.error("Error fetching homeowner quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}