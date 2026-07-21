import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/** Resolve DB userId from Clerk session and verify homeowner role. */
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const { id: projectId } = await params;

    const savedProject = await prisma.savedProject.findUnique({
      where: { id: projectId },
      include: {
        aiEstimate: { include: { items: true } },
        postedAsLead: { include: { applications: true, acceptances: true } },
      },
    });

    if (!savedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (savedProject.homeownerId !== resolved.dbUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json({ success: true, savedProject });
  } catch (error) {
    console.error("[SavedProject GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const { id: projectId } = await params;

    // Verify ownership
    const existing = await prisma.savedProject.findUnique({ where: { id: projectId }, select: { homeownerId: true } });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (existing.homeownerId !== resolved.dbUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const { title, description, category, city, province, zipCode, location, budget, photos, status } = body;

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

    const updatedProject = await prisma.savedProject.update({
      where: { id: projectId },
      data: updateData,
      include: { aiEstimate: { include: { items: true } }, postedAsLead: true },
    });

    return NextResponse.json({ success: true, savedProject: updatedProject });
  } catch (error) {
    console.error("[SavedProject PUT] Error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await resolveDbUserId();
    if ("error" in resolved) return NextResponse.json({ error: resolved.error }, { status: resolved.status });

    const { id: projectId } = await params;

    const existing = await prisma.savedProject.findUnique({ where: { id: projectId }, select: { homeownerId: true } });
    if (!existing) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (existing.homeownerId !== resolved.dbUserId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.savedProject.delete({ where: { id: projectId } });

    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("[SavedProject DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
