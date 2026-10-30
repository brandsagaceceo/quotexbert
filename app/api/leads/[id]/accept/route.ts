import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";
import { sendContractorHiredEmail } from "@/lib/email";
import { resolveAuthUser } from "@/lib/server-auth";

function parseAcceptedContractors(value: string | null | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(value || "[]");
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const homeownerId = authResult.user.dbUserId;
    const { id } = await params;
    const body = await request.json();
    const contractorId = body?.contractorId;

    if (typeof contractorId !== "string" || !contractorId) {
      return NextResponse.json(
        { error: "contractorId is required" },
        { status: 400 },
      );
    }

    // Get the lead
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        homeowner: { select: { name: true } },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    if (lead.homeownerId !== homeownerId) {
      return NextResponse.json({ error: "You can only hire a contractor for your own job" }, { status: 403 });
    }

    const contractorUser = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      select: { id: true, clerkUserId: true, email: true, name: true, role: true, isActive: true },
    });
    if (!contractorUser || contractorUser.role !== "contractor" || !contractorUser.isActive) {
      return NextResponse.json({ error: "An active contractor is required" }, { status: 400 });
    }
    const dbContractorId = contractorUser.id;

    const acceptance = await prisma.jobAcceptance.findUnique({
      where: { leadId_contractorId: { leadId: id, contractorId: dbContractorId } },
      select: { status: true },
    });
    const acceptedContractors = parseAcceptedContractors(lead.acceptedContractors);
    const hasAccepted =
      acceptedContractors.includes(dbContractorId) ||
      (contractorUser.clerkUserId !== null &&
        acceptedContractors.includes(contractorUser.clerkUserId));
    if (!hasAccepted && !acceptance) {
      return NextResponse.json({ error: "This contractor has not accepted your job" }, { status: 400 });
    }
    if (acceptance && !["accepted", "quoted", "selected"].includes(acceptance.status.toLowerCase())) {
      return NextResponse.json({ error: "This contractor is no longer available for selection" }, { status: 400 });
    }

    // Check if already assigned to the requested contractor (idempotency).
    if (lead.status === "assigned") {
      if (lead.contractorId !== dbContractorId) {
        return NextResponse.json({ error: "This job has already been assigned" }, { status: 409 });
      }
      return NextResponse.json({
        success: true,
        message: "Lead already assigned",
      });
    }

    if (!["open", "claimed", "reviewing"].includes(lead.status)) {
      return NextResponse.json({ error: "This job cannot be assigned in its current state" }, { status: 409 });
    }

    // Conditional update serializes simultaneous homeowner selections.
    const updateResult = await prisma.lead.updateMany({
      where: {
        id,
        homeownerId,
        status: lead.status,
        published: lead.published,
        contractorId: lead.contractorId,
        acceptedById: lead.acceptedById,
        acceptedContractors: lead.acceptedContractors,
      },
      data: {
        status: "assigned",
        contractorId: dbContractorId,
        acceptedById: dbContractorId,
        published: false,
      },
    });
    if (updateResult.count !== 1) {
      const latestLead = await prisma.lead.findUnique({
        where: { id },
        select: { status: true, contractorId: true },
      });
      if (latestLead?.status === "assigned" && latestLead.contractorId === dbContractorId) {
        return NextResponse.json({ success: true, message: "Lead already assigned" });
      }
      return NextResponse.json({ error: "This job was assigned by another request" }, { status: 409 });
    }

    const updatedLead = await prisma.lead.findUniqueOrThrow({
      where: { id },
      select: { id: true, status: true, published: true },
    });

    // Track analytics
    await logEventServer("lead_accepted", dbContractorId, {
      leadId: id,
      homeownerId: lead.homeownerId,
    });

    // Notify the contractor by email that they were hired — non-blocking (chat gap fix)
    if (contractorUser?.email) {
      try {
        await sendContractorHiredEmail(
          { id: contractorUser.id, email: contractorUser.email, name: contractorUser.name },
          { name: lead.homeowner?.name },
          { id: lead.id, title: lead.title, category: lead.category, city: lead.zipCode },
        );
      } catch (emailError) {
        console.error("Failed to send contractor hired email (non-fatal):", emailError);
      }
    }

    return NextResponse.json({
      success: true,
      lead: {
        id: updatedLead.id,
        status: updatedLead.status,
        published: updatedLead.published,
      },
      message: "Contractor hired successfully",
    });
  } catch (error) {
    console.error("Error accepting contractor:", error);
    return NextResponse.json(
      { error: "Failed to accept contractor" },
      { status: 500 },
    );
  }
}
