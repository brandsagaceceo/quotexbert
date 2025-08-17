import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logEventServer } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { contractorId } = await request.json();

    if (!contractorId) {
      return NextResponse.json(
        { error: "contractorId is required" },
        { status: 400 },
      );
    }

    // Get the lead
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Check if already assigned to this contractor (idempotency)
    if (lead.status === "assigned") {
      return NextResponse.json({
        success: true,
        message: "Lead already assigned",
      });
    }

    // Update the lead to assigned status
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        status: "assigned",
        published: false,
      },
    });

    // Track analytics
    await logEventServer("lead_accepted", contractorId, {
      leadId: id,
      homeownerId: lead.homeownerId,
    });

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
