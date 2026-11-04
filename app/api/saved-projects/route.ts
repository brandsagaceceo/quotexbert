import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import {
  deleteUnreferencedPrivatePhotos,
  privatePhotosBelongTo,
} from "@/lib/private-photo-records";

export const dynamic = "force-dynamic";

// GET - Fetch all saved projects for the authenticated homeowner
export async function GET() {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const savedProjects = await prisma.savedProject.findMany({
      where: { homeownerId: { in: resolved.homeownerIds } },
      include: {
        aiEstimate: { include: { items: true } },
        postedAsLead: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, savedProjects });
  } catch (error) {
    console.error("[SavedProjects GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved projects" },
      { status: 500 },
    );
  }
}

// POST - Create a new saved project (private draft)
export async function POST(request: NextRequest) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const body = await request.json();
    const {
      title,
      description,
      category,
      city,
      province,
      zipCode,
      location,
      budget,
      photos,
      visualizerImages,
      aiEstimateId,
      estimateSummary,
    } = body;
    const submittedPhotos = photos === null ? [] : photos;
    const submittedVisualizerImages =
      visualizerImages === null ? [] : visualizerImages;

    if (!title || !description) {
      return NextResponse.json(
        { error: "title and description are required" },
        { status: 400 },
      );
    }
    if (
      !privatePhotosBelongTo(submittedPhotos, resolved.user.dbUserId) ||
      !privatePhotosBelongTo(
        submittedVisualizerImages,
        resolved.user.dbUserId,
      )
    ) {
      return NextResponse.json(
        { error: "Photos must belong to this homeowner" },
        { status: 400 },
      );
    }

    if (aiEstimateId) {
      const estimate = await prisma.aIEstimate.findFirst({
        where: {
          id: aiEstimateId,
          homeownerId: { in: resolved.homeownerIds },
        },
        select: { id: true },
      });
      if (!estimate) {
        return NextResponse.json(
          { error: "Estimate not found or does not belong to this homeowner" },
          { status: 404 },
        );
      }
    }

    const savedProject = await prisma.savedProject.create({
      data: {
        homeownerId: resolved.user.dbUserId,
        title: title.trim().slice(0, 120),
        description: description.trim().slice(0, 3000),
        category: category || "general",
        city: city?.trim().slice(0, 100) || null,
        province: province?.trim().slice(0, 50) || null,
        zipCode: zipCode?.trim().toUpperCase().slice(0, 20) || null,
        location: location || null,
        budget: budget || null,
        photos: submittedPhotos ? JSON.stringify(submittedPhotos) : "[]",
        visualizerImages: submittedVisualizerImages
          ? JSON.stringify(submittedVisualizerImages)
          : "[]",
        aiEstimateId: aiEstimateId || null,
        estimateSummary: estimateSummary
          ? JSON.stringify(estimateSummary)
          : null,
        status: "draft",
      },
      include: { aiEstimate: { include: { items: true } } },
    });

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProjects POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create saved project" },
      { status: 500 },
    );
  }
}

// PUT - Update an existing saved project (auth: must own the project)
export async function PUT(request: NextRequest) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const body = await request.json();
    const {
      id,
      title,
      description,
      category,
      city,
      province,
      zipCode,
      location,
      budget,
      photos,
      visualizerImages,
      estimateSummary,
      status,
    } = body;
    const submittedPhotos = photos === null ? [] : photos;
    const submittedVisualizerImages =
      visualizerImages === null ? [] : visualizerImages;

    if (!id)
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 },
      );
    if (
      !privatePhotosBelongTo(submittedPhotos, resolved.user.dbUserId) ||
      !privatePhotosBelongTo(
        submittedVisualizerImages,
        resolved.user.dbUserId,
      )
    ) {
      return NextResponse.json(
        { error: "Photos must belong to this homeowner" },
        { status: 400 },
      );
    }

    const previousProject = await prisma.savedProject.findFirst({
      where: { id, homeownerId: { in: resolved.homeownerIds } },
      select: { photos: true, visualizerImages: true },
    });
    if (!previousProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (location !== undefined) updateData.location = location;
    if (budget !== undefined) updateData.budget = budget;
    if (photos !== undefined)
      updateData.photos = JSON.stringify(submittedPhotos);
    if (visualizerImages !== undefined)
      updateData.visualizerImages = JSON.stringify(submittedVisualizerImages);
    if (estimateSummary !== undefined)
      updateData.estimateSummary = JSON.stringify(estimateSummary);
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.savedProject.updateMany({
      where: { id, homeownerId: { in: resolved.homeownerIds } },
      data: updateData,
    });
    if (updated.count !== 1)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const savedProject = await prisma.savedProject.findFirst({
      where: { id, homeownerId: { in: resolved.homeownerIds } },
      include: { aiEstimate: { include: { items: true } }, postedAsLead: true },
    });
    if (!savedProject)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const nextPhotos =
      photos === undefined
        ? previousProject.photos
        : JSON.stringify(submittedPhotos);
    const nextVisualizerImages =
      visualizerImages === undefined
        ? previousProject.visualizerImages
        : JSON.stringify(submittedVisualizerImages);
    const previousPhotoUrls = [
      ...parsePhotoUrls(previousProject.photos),
      ...parsePhotoUrls(previousProject.visualizerImages),
    ];
    const retainedPhotoUrls = new Set([
      ...parsePhotoUrls(nextPhotos),
      ...parsePhotoUrls(nextVisualizerImages),
    ]);
    await deleteUnreferencedPrivatePhotos(
      previousPhotoUrls.filter((url) => !retainedPhotoUrls.has(url)),
    );

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProjects PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update saved project" },
      { status: 500 },
    );
  }
}

// DELETE - Delete a saved project (auth: must own the project)
export async function DELETE(request: NextRequest) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id)
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 },
      );

    // Verify ownership before deleting
    const existing = await prisma.savedProject.findFirst({
      where: { id, homeownerId: { in: resolved.homeownerIds } },
      select: { homeownerId: true, photos: true, visualizerImages: true },
    });
    if (!existing)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    await prisma.savedProject.deleteMany({
      where: { id, homeownerId: { in: resolved.homeownerIds } },
    });
    await deleteUnreferencedPrivatePhotos([
      ...parsePhotoUrls(existing.photos),
      ...parsePhotoUrls(existing.visualizerImages),
    ]);

    return NextResponse.json({
      success: true,
      message: "Saved project deleted successfully",
    });
  } catch (error) {
    console.error("[SavedProjects DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete saved project" },
      { status: 500 },
    );
  }
}

function parsePhotoUrls(value: string | null | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((url): url is string => typeof url === "string")
      : [];
  } catch {
    return [];
  }
}
