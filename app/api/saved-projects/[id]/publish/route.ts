// POST /api/saved-projects/[id]/publish
// Publishes a saved project draft as a live Lead on the job board.
// Triggers contractor email notifications and sends homeowner confirmation.

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NotificationService } from "@/lib/notifications";
import { sendJobPostedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // Resolve DB user (accept clerkUserId or direct id)
    const dbUser = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: { id: true, role: true, email: true, name: true },
    });

    if (!dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
    if (dbUser.role !== "homeowner") return NextResponse.json({ error: "Homeowner access only" }, { status: 403 });

    const { id: projectId } = await params;

    const savedProject = await prisma.savedProject.findUnique({
      where: { id: projectId },
    });

    if (!savedProject) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    if (savedProject.homeownerId !== dbUser.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Already published → return the existing lead
    if (savedProject.status === "posted" && savedProject.postedAsLeadId) {
      const existingLead = await prisma.lead.findUnique({
        where: { id: savedProject.postedAsLeadId },
      });
      return NextResponse.json({ success: true, lead: existingLead, alreadyPublished: true });
    }

    // Validate required fields
    const city = savedProject.city?.trim() || savedProject.location?.split(",")[0]?.trim() || "";
    const province = savedProject.province?.trim() || savedProject.location?.split(",")[1]?.trim() || "";

    if (!city) {
      return NextResponse.json({ error: "City is required to post on the job board. Please edit and add your city first." }, { status: 422 });
    }
    if (!province) {
      return NextResponse.json({ error: "Province is required to post on the job board. Please edit and add your province first." }, { status: 422 });
    }

    // Create the Lead
    const lead = await prisma.lead.create({
      data: {
        homeownerId: dbUser.id,
        title: savedProject.title,
        description: savedProject.description,
        category: savedProject.category,
        city,
        province,
        zipCode: savedProject.zipCode || null,
        budget: savedProject.budget || null,
        photos: savedProject.photos || "[]",
        status: "open",
        published: true,
      },
    });

    // Mark the saved project as posted
    await prisma.savedProject.update({
      where: { id: projectId },
      data: { status: "posted", postedAsLeadId: lead.id },
    });

    // Notify all active contractors (fire-and-forget — don't block the response)
    NotificationService.notifyAllContractors({
      leadId: lead.id,
      title: lead.title,
      description: lead.description,
      category: lead.category,
      city: city,
      province: province,
      budget: null,
    }).catch((err) => console.error("[Publish] notifyAllContractors error:", err));

    // Send homeowner confirmation email (fire-and-forget)
    sendJobPostedEmail({
      homeowner: { id: dbUser.id, email: dbUser.email, name: dbUser.name || null },
      job: {
        id: lead.id,
        title: lead.title,
        category: lead.category,
        city: city,
        province: province,
        zipCode: lead.zipCode || undefined,
      },
    }).catch((err) => console.error("[Publish] sendJobPostedEmail error:", err));

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[Publish SavedProject] Error:", error);
    return NextResponse.json({ error: "Failed to publish project" }, { status: 500 });
  }
}
