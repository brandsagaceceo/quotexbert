import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get all threads where the user is involved (either as homeowner, contractor, or message participant)
    const threads = await prisma.thread.findMany({
      where: {
        OR: [
          // User is the homeowner of the lead
          { lead: { homeownerId: userId } },
          // User is the contractor of the lead
          { lead: { contractorId: userId } },
          // User has sent or received messages in this thread
          { 
            messages: {
              some: {
                OR: [
                  { fromUserId: userId },
                  { toUserId: userId }
                ]
              }
            }
          }
        ]
      },
      include: {
        lead: {
          include: {
            homeowner: true,
            contractor: true,
          },
        },
        messages: {
          take: 1,
          orderBy: { createdAt: "desc" },
          include: {
            fromUser: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 },
    );
  }
}
