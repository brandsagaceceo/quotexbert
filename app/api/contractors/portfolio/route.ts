import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 },
      );
    }

    // Resolve ContractorProfile by looking up the user via both id and clerkUserId.
    // Webhook-created users have id=UUID with clerkUserId=clerkId, so a plain
    // findUnique by userId would miss them when the caller passes the Clerk ID.
    const contractorUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: contractorId }, { clerkUserId: contractorId }],
      },
      include: {
        contractorProfile: true,
      },
    });

    const contractorProfile =
      contractorUser?.contractorProfile ??
      (await prisma.contractorProfile.findUnique({
        where: { id: contractorId },
      }));

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }

    const authResult = await resolveAuthUser();
    const authenticatedUser =
      "user" in authResult
        ? await prisma.user.findUnique({
            where: { id: authResult.user.dbUserId },
            select: { role: true },
          })
        : null;
    const isOwner =
      authenticatedUser?.role === "contractor" &&
      "user" in authResult &&
      contractorProfile.userId === authResult.user.dbUserId;

    const portfolioItems = await prisma.portfolioItem.findMany({
      where: {
        contractorId: contractorProfile.id,
        ...(!isOwner ? { isPublic: true } : {}),
      },
      orderBy: [{ createdAt: "desc" }],
    });

    // Parse JSON fields for before/after images
    const formattedItems = portfolioItems.map((item) => ({
      ...item,
      beforeImages: item.beforeImages ? JSON.parse(item.beforeImages) : [],
      afterImages: item.afterImages ? JSON.parse(item.afterImages) : [],
      tags: [],
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const fields = body as Record<string, unknown>;
    const { title } = fields;

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const contractorUser = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { role: true },
    });

    if (!contractorUser || contractorUser.role !== "contractor") {
      return NextResponse.json(
        { error: "Only contractors can manage portfolio items" },
        { status: 403 },
      );
    }

    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: { userId: authResult.user.dbUserId },
    });

    if (!contractorProfile) {
      return NextResponse.json(
        { error: "Contractor profile not found" },
        { status: 404 },
      );
    }

    // Create portfolio item with available fields
    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId: contractorProfile.id,
        title: title.trim(),
        caption:
          typeof fields.caption === "string" && fields.caption
            ? fields.caption
            : null,
        projectType:
          typeof fields.projectType === "string" && fields.projectType
            ? fields.projectType
            : "general",
        beforeImages: JSON.stringify(
          Array.isArray(fields.beforeImages) ? fields.beforeImages : [],
        ),
        afterImages: JSON.stringify(
          Array.isArray(fields.afterImages) ? fields.afterImages : [],
        ),
      },
    });

    // Format response with parsed JSON
    const formattedItem = {
      ...portfolioItem,
      beforeImages: JSON.parse(portfolioItem.beforeImages),
      afterImages: JSON.parse(portfolioItem.afterImages),
      tags: [],
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Error creating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio item" },
      { status: 500 },
    );
  }
}
