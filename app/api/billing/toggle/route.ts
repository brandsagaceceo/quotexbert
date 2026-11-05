import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export async function POST(_request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const contractor = await prisma.user.findUnique({
      where: { id: authResult.user.dbUserId },
      select: { id: true, role: true, isActive: true },
    });
    if (
      !contractor ||
      contractor.role !== "contractor" ||
      !contractor.isActive
    ) {
      return NextResponse.json(
        { error: "Active contractor access required" },
        { status: 403 },
      );
    }
    const userId = contractor.id;

    // Toggle the billing pause status
    const billing = await prisma.contractorBilling.findUnique({
      where: { userId },
    });

    if (!billing) {
      return NextResponse.json(
        { error: "Billing record not found" },
        { status: 404 },
      );
    }

    const updatedBilling = await prisma.contractorBilling.update({
      where: { userId },
      data: { isPaused: !billing.isPaused },
    });

    return NextResponse.json({
      success: true,
      isPaused: updatedBilling.isPaused,
    });
  } catch (error) {
    console.error("Error toggling billing status:", error);
    return NextResponse.json(
      { error: "Failed to update billing status" },
      { status: 500 },
    );
  }
}
