import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const { id: projectId } = await params;

    const savedProject = await prisma.savedProject.findUnique({
      where: { id: projectId },
      include: {
        aiEstimate: { include: { items: true } },
        postedAsLead: { include: { applications: true, acceptances: true } },
      },
    });

    if (!savedProject)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (!resolved.homeownerIds.includes(savedProject.homeownerId))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProject GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch project" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const { id: projectId } = await params;

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
      status,
    } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (city !== undefined) updateData.city = city;
    if (province !== undefined) updateData.province = province;
    if (zipCode !== undefined) updateData.zipCode = zipCode;
    if (location !== undefined) updateData.location = location;
    if (budget !== undefined) updateData.budget = budget;
    if (status !== undefined) updateData.status = status;
    if (photos !== undefined) updateData.photos = JSON.stringify(photos);

    const updated = await prisma.savedProject.updateMany({
      where: {
        id: projectId,
        homeownerId: { in: resolved.homeownerIds },
      },
      data: updateData,
    });
    if (updated.count !== 1)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const updatedProject = await prisma.savedProject.findFirst({
      where: {
        id: projectId,
        homeownerId: { in: resolved.homeownerIds },
      },
      include: { aiEstimate: { include: { items: true } }, postedAsLead: true },
    });
    if (!updatedProject)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    return NextResponse.json({ success: true, savedProject: updatedProject });
  } catch (error) {
    console.error("[SavedProject PUT] Error:", error);
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolved = await resolveHomeownerIdentity();
    if (!resolved.success)
      return NextResponse.json(
        { error: resolved.error },
        { status: resolved.status },
      );

    const { id: projectId } = await params;

    const existing = await prisma.savedProject.findFirst({
      where: { id: projectId, homeownerId: { in: resolved.homeownerIds } },
      select: { homeownerId: true },
    });
    if (!existing)
      return NextResponse.json({ error: "Project not found" }, { status: 404 });

    await prisma.savedProject.deleteMany({
      where: { id: projectId, homeownerId: { in: resolved.homeownerIds } },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("[SavedProject DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
