import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!itemId) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 }
      );
    }

    // Update the portfolio item
    const updatedItem = await prisma.portfolioItem.update({
      where: { id: itemId },
      data: {
        ...body,
        // Handle JSON fields if they exist
        beforeImages: body.beforeImages ? JSON.stringify(body.beforeImages) : undefined,
        afterImages: body.afterImages ? JSON.stringify(body.afterImages) : undefined,
      },
    });

    // Format response with parsed JSON
    const formattedItem = {
      ...updatedItem,
      beforeImages: updatedItem.beforeImages ? JSON.parse(updatedItem.beforeImages) : [],
      afterImages: updatedItem.afterImages ? JSON.parse(updatedItem.afterImages) : [],
      tags: []
    };

    return NextResponse.json(formattedItem);
  } catch (error) {
    console.error("Error updating portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const itemId = resolvedParams.id;

    if (!itemId) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 }
      );
    }

    await prisma.portfolioItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio item:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}