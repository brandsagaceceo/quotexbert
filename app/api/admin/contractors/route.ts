import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

export async function GET() {
  try {
    const authResult = await auth();
    const userId = authResult.userId;
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    const caller = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { email: true },
    });

    if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    // Fetch all contractor profiles
    const contractors = await prisma.contractorProfile.findMany({
      include: {
        user: {
          select: {
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { verified: "asc" }, // Unverified first
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ contractors });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractors" },
      { status: 500 }
    );
  }
}

