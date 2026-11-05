import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { resolveAuthUser } from "@/lib/server-auth";

async function authorizePortfolioItem(itemId: string) {
  const authResult = await resolveAuthUser();
  if ("error" in authResult) {
    return {
      error: NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      ),
    };
  }

  const item = await prisma.portfolioItem.findUnique({
    where: { id: itemId },
    include: { contractor: { select: { userId: true } } },
  });

  if (!item) {
    return {
      error: NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: authResult.user.dbUserId },
    select: { role: true },
  });

  if (
    user?.role !== "contractor" ||
    item.contractor.userId !== authResult.user.dbUserId
  ) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return {};
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!itemId) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 },
      );
    }

    const authorization = await authorizePortfolioItem(itemId);
    if ("error" in authorization) return authorization.error;

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }
    const fields = body as Record<string, unknown>;
    const data: Prisma.PortfolioItemUpdateInput = {};
    if (typeof fields.title === "string") data.title = fields.title;
    if (typeof fields.projectType === "string") {
      data.projectType = fields.projectType;
    }
    if (typeof fields.description === "string" || fields.description === null) {
      data.description = fields.description;
    }
    if (typeof fields.caption === "string" || fields.caption === null) {
      data.caption = fields.caption;
    }
    if (typeof fields.imageUrl === "string" || fields.imageUrl === null) {
      data.imageUrl = fields.imageUrl;
    }
    if (typeof fields.projectCost === "string" || fields.projectCost === null) {
      data.projectCost = fields.projectCost;
    }
    if (typeof fields.duration === "string" || fields.duration === null) {
      data.duration = fields.duration;
    }
    if (typeof fields.materials === "string" || fields.materials === null) {
      data.materials = fields.materials;
    }
    if (typeof fields.location === "string" || fields.location === null) {
      data.location = fields.location;
    }
    if (typeof fields.clientStory === "string" || fields.clientStory === null) {
      data.clientStory = fields.clientStory;
    }
    if (typeof fields.isPublic === "boolean") data.isPublic = fields.isPublic;
    if (typeof fields.isPinned === "boolean") data.isPinned = fields.isPinned;
    if (Array.isArray(fields.beforeImages)) {
      data.beforeImages = JSON.stringify(fields.beforeImages);
    }
    if (Array.isArray(fields.afterImages)) {
      data.afterImages = JSON.stringify(fields.afterImages);
    }
    if (Array.isArray(fields.tags)) data.tags = JSON.stringify(fields.tags);
    else if (typeof fields.tags === "string") data.tags = fields.tags;

    const updatedItem = await prisma.portfolioItem.update({
      where: { id: itemId },
      data,
    });

    // Format response with parsed JSON
    const formattedItem = {
      ...updatedItem,
      beforeImages: updatedItem.beforeImages
        ? JSON.parse(updatedItem.beforeImages)
        : [],
      afterImages: updatedItem.afterImages
        ? JSON.parse(updatedItem.afterImages)
        : [],
      tags: [],
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!itemId) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 },
      );
    }

    const authorization = await authorizePortfolioItem(itemId);
    if ("error" in authorization) return authorization.error;

    await prisma.portfolioItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({
      message: "Portfolio item deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 },
    );
  }
}
