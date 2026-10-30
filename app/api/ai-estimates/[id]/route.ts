import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { success: false, error: identity.error },
        { status: identity.status },
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { selectedItemIds } = body;

    if (!Array.isArray(selectedItemIds)) {
      return NextResponse.json(
        { success: false, error: "selectedItemIds must be an array" },
        { status: 400 },
      );
    }

    // Fetch the estimate to verify it exists
    const estimate = await prisma.aIEstimate.findFirst({
      where: { id, homeownerId: { in: identity.homeownerIds } },
      include: { items: true },
    });

    if (!estimate) {
      return NextResponse.json(
        { success: false, error: "Estimate not found" },
        { status: 404 },
      );
    }

    // Update all items: set selected=true for items in the array, false for others
    await prisma.$transaction(
      estimate.items.map((item) =>
        prisma.estimateItem.updateMany({
          where: { id: item.id, estimateId: estimate.id },
          data: { selected: selectedItemIds.includes(item.id) },
        }),
      ),
    );

    // Fetch updated estimate
    const updatedEstimate = await prisma.aIEstimate.findFirst({
      where: { id, homeownerId: { in: identity.homeownerIds } },
      include: { items: true },
    });

    return NextResponse.json({
      success: true,
      estimate: updatedEstimate,
      message: "Item selections saved successfully",
    });
  } catch (error: any) {
    console.error("Error updating item selections:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update selections" },
      { status: 500 },
    );
  }
}
