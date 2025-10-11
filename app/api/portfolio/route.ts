import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractorId, title, description, projectType, projectCost, duration, location, materials, clientStory, imageUrl } = body;

    if (!contractorId || !title) {
      return NextResponse.json(
        { error: "Contractor ID and title are required" },
        { status: 400 }
      );
    }

    const portfolioItem = await prisma.portfolioItem.create({
      data: {
        contractorId,
        title,
        description: description || null,
        projectType: projectType || 'general',
        projectCost: projectCost || null,
        duration: duration || null,
        location: location || null,
        materials: materials || null,
        clientStory: clientStory || null,
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio item ID is required" },
        { status: 400 }
      );
    }

    // Get the portfolio item first to delete associated image
    const portfolioItem = await prisma.portfolioItem.findUnique({
      where: { id }
    });

    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Delete the portfolio item
    await prisma.portfolioItem.delete({
      where: { id }
    });

    // Optionally delete the associated image file
    if (portfolioItem.imageUrl && portfolioItem.imageUrl.startsWith('/uploads/')) {
      try {
        await fetch(`/api/upload?file=${portfolioItem.imageUrl}`, {
          method: 'DELETE'
        });
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