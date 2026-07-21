import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Resolve the DB user ID for the currently authenticated Clerk user. */
async function resolveDbUserId(): Promise<{ dbUserId: string } | { error: string; status: number }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthenticated", status: 401 };

  const user = await prisma.user.findFirst({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { id: true, role: true },
  });
  if (!user) return { error: "User not found", status: 404 };
  if (user.role !== "homeowner") return { error: "Homeowner access only", status: 403 };
  return { dbUserId: user.id };
}

// GET - Fetch all saved projects for the authenticated homeowner
export async function GET() {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const savedProjects = await prisma.savedProject.findMany({
      where: { homeownerId: resolved.dbUserId },
      include: {
        aiEstimate: { include: { items: true } },
        postedAsLead: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, savedProjects });
  } catch (error) {
    console.error("[SavedProjects GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch saved projects" }, { status: 500 });
  }
}

// POST - Create a new saved project (private draft)
export async function POST(request: NextRequest) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const body = await request.json();
    const { title, description, category, city, province, zipCode, location, budget, photos, visualizerImages, aiEstimateId, estimateSummary } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "title and description are required" }, { status: 400 });
    }

    const savedProject = await prisma.savedProject.create({
      data: {
        homeownerId: resolved.dbUserId,
        title: title.trim().slice(0, 120),
        description: description.trim().slice(0, 3000),
        category: category || "general",
        city: city?.trim().slice(0, 100) || null,
        province: province?.trim().slice(0, 50) || null,
        zipCode: zipCode?.trim().toUpperCase().slice(0, 20) || null,
        location: location || null,
        budget: budget || null,
        photos: photos ? JSON.stringify(photos) : "[]",
        visualizerImages: visualizerImages ? JSON.stringify(visualizerImages) : "[]",
        aiEstimateId: aiEstimateId || null,
        estimateSummary: estimateSummary ? JSON.stringify(estimateSummary) : null,
        status: "draft",
      },
      include: { aiEstimate: { include: { items: true } } },
    });

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProjects POST] Error:", error);
    return NextResponse.json({ error: "Failed to create saved project" }, { status: 500 });
  }
}

// PUT - Update an existing saved project (auth: must own the project)
export async function PUT(request: NextRequest) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const body = await request.json();
    const { id, title, description, category, city, province, zipCode, location, budget, photos, visualizerImages, estimateSummary, status } = body;

    if (!id) return NextResponse.json({ error: "Project id is required" }, { status: 400 });

    // Verify ownership
    const existing = await prisma.savedProject.findUnique({ where: { id }, select: { homeownerId: true } });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (existing.homeownerId !== resolved.dbUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (location !== undefined) updateData.location = location;
    if (budget !== undefined) updateData.budget = budget;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);
    if (visualizerImages !== undefined) updateData.visualizerImages = JSON.stringify(visualizerImages);
    if (estimateSummary !== undefined) updateData.estimateSummary = JSON.stringify(estimateSummary);
    if (status !== undefined) updateData.status = status;

    const savedProject = await prisma.savedProject.update({
      where: { id },
      data: updateData,
      include: { aiEstimate: { include: { items: true } }, postedAsLead: true },
    });

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProjects PUT] Error:", error);
    return NextResponse.json({ error: "Failed to update saved project" }, { status: 500 });
  }
}

// DELETE - Delete a saved project (auth: must own the project)
export async function DELETE(request: NextRequest) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Project id is required" }, { status: 400 });

    // Verify ownership before deleting
    const existing = await prisma.savedProject.findUnique({ where: { id }, select: { homeownerId: true } });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (existing.homeownerId !== resolved.dbUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.savedProject.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Saved project deleted successfully" });
  } catch (error) {
    console.error("[SavedProjects DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete saved project" }, { status: 500 });
  }
}
