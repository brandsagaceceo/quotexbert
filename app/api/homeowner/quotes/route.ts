import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const homeownerId = searchParams.get("homeownerId");

    if (!homeownerId) {
      return NextResponse.json(
        { error: "Homeowner ID is required" },
        { status: 400 }
      );
    }

    // Get quotes for jobs owned by this homeowner
    const quotes = await prisma.quote.findMany({
      where: {
        job: {
          homeownerId: homeownerId
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