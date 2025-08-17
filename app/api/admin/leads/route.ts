import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, ...updateData } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 },
      );
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }
}
