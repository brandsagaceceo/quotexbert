import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractorId, title, description, projectType, imageUrl } = body;

    if (!contractorId || !title) {
      return NextResponse.json(
        { error: "Contractor ID and title are required" },
        { status: 400 }
      );
    }

    // Look up the User (and their ContractorProfile) by either User.id or User.clerkUserId
    // to support both role-selection users and webhook-created users.
    const contractorUser = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      include: { contractorProfile: true }
    });
    const contractorProfile = contractorUser?.contractorProfile;

    if (!contractorProfile) {
      console.error("[PORTFOLIO POST] ContractorProfile not found for userId:", contractorId);
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 }
      );
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId: contractorProfile.id,
        title,
        description: description || null,
        projectType: projectType || 'general',
        imageUrl: imageUrl || null,
        isPublic: true,
        isPinned: false,
        tags: JSON.stringify([])
      }
    });

    return NextResponse.json(portfolioItem);
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, description, projectType, projectCost, duration, location, materials, clientStory, imageUrl } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 }
      );
    }

    const portfolioItem = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title,
        description,
        projectType,
        projectCost,
        duration,
        location,
        materials,
        clientStory,
        imageUrl
      }
    });

    return NextResponse.json(portfolioItem);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // 1. Authenticate the request via Clerk session
    const authResult = await resolveAuthUser();
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 }
      );
    }

    // 2. Load item + owner profile for ownership verification
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id },
      include: {
        contractor: {          // ContractorProfile
          select: { userId: true },
        },
      },
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // 3. Ownership check — ContractorProfile.userId is a DB User.id.
    //    resolveAuthUser() already resolved the Clerk session to dbUserId, so a
    //    direct comparison is correct.  An extra DB lookup handles the edge case
    //    where the ContractorProfile.userId itself is a Clerk ID (role-selection path).
    const ownerUserId = portfolioItem.contractor?.userId ?? null;
    if (!ownerUserId) {
      return NextResponse.json(
        { error: "You do not have permission to delete this portfolio item" },
        { status: 403 }
      );
    }

    // Direct match or cross-check via clerkUserId column
    let isOwner = ownerUserId === dbUserId;
    if (!isOwner) {
      const ownerUser = await prisma.user.findFirst({
        where: { id: ownerUserId, OR: [{ id: dbUserId }, { clerkUserId: dbUserId }] },
        select: { id: true },
      });
      isOwner = ownerUser !== null;
    }

    if (!isOwner) {
      return NextResponse.json(
        { error: "You do not have permission to delete this portfolio item" },
        { status: 403 }
      );
    }

    // 4. Delete the portfolio item
    await prisma.portfolioItem.delete({ where: { id } });

    // 5. Best-effort cleanup of associated upload
    if (portfolioItem.imageUrl && portfolioItem.imageUrl.startsWith('/uploads/')) {
      try {
        await fetch(`/api/upload?file=${portfolioItem.imageUrl}`, { method: 'DELETE' });
      } catch (error) {
        console.warn("Failed to delete associated image:", error);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}