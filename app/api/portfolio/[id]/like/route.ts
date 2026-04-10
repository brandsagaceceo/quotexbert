import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Resolve Clerk ID or DB UUID to a DB user ID */
async function resolveDbUserId(userId: string): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { id: true },
  });
  return user?.id ?? null;
}

// POST /api/portfolio/[id]/like — toggle like on a portfolio item
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUserId = await resolveDbUserId(clerkUserId);
    if (!dbUserId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const portfolioItemId = params.id;

    // Verify portfolio item exists
    const item = await prisma.portfolioItem.findUnique({
      where: { id: portfolioItemId },
      select: { id: true },
    });
    if (!item) {
      return NextResponse.json({ error: "Portfolio item not found" }, { status: 404 });
    }

    // Toggle: try to create; if unique constraint fails, delete instead
    const existing = await prisma.portfolioLike.findUnique({
      where: { portfolioItemId_userId: { portfolioItemId, userId: dbUserId } },
    });

    if (existing) {
      await prisma.portfolioLike.delete({ where: { id: existing.id } });
    } else {
      await prisma.portfolioLike.create({ data: { portfolioItemId, userId: dbUserId } });
    }

    const likeCount = await prisma.portfolioLike.count({ where: { portfolioItemId } });

    return NextResponse.json({ liked: !existing, likeCount });
  } catch (error) {
    console.error("Error toggling portfolio like:", error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

// GET /api/portfolio/[id]/like — get like count + viewer's like status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    const portfolioItemId = params.id;

    const likeCount = await prisma.portfolioLike.count({ where: { portfolioItemId } });

    let liked = false;
    if (clerkUserId) {
      const dbUserId = await resolveDbUserId(clerkUserId);
      if (dbUserId) {
        const existing = await prisma.portfolioLike.findUnique({
          where: { portfolioItemId_userId: { portfolioItemId, userId: dbUserId } },
        });
        liked = !!existing;
      }
    }

    return NextResponse.json({ liked, likeCount });
  } catch (error) {
    console.error("Error fetching portfolio like:", error);
    return NextResponse.json({ error: "Failed to fetch like" }, { status: 500 });
  }
}
