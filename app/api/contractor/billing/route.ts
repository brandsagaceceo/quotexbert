import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateContractorBilling } from "@/lib/billing";
import { getCustomerPaymentMethods } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Get billing information
export async function GET(request: NextRequest) {
  try {
    // TODO: Get userId from authentication
    const userId = "demo-contractor-1";

    const billing = await getOrCreateContractorBilling(userId);

    let paymentMethods: any[] = [];
    if (billing.stripeCustomerId) {
      try {
        paymentMethods = await getCustomerPaymentMethods(
          billing.stripeCustomerId,
        );
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    }

    return NextResponse.json({
      ...billing,
      paymentMethods,
    });
  } catch (error) {
    console.error("Error fetching billing:", error);
    return NextResponse.json(
      { error: "Failed to fetch billing information" },
      { status: 500 },
    );
  }
}

// Update billing settings
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    // TODO: Get userId from authentication
    const userId = "demo-contractor-1";

    const billing = await getOrCreateContractorBilling(userId);

    const updateData: any = {};

    if (typeof body.monthlyCapCents === "number") {
      updateData.monthlyCapCents = body.monthlyCapCents;
    }

    if (typeof body.isPaused === "boolean") {
      updateData.isPaused = body.isPaused;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 },
      );
    }

    // Use raw SQL to update the billing record
    if (updateData.monthlyCapCents) {
      await prisma.$executeRaw`
        UPDATE contractor_billing 
        SET monthlyCapCents = ${updateData.monthlyCapCents}
        WHERE id = ${billing.id}
      `;
    }

    if (typeof updateData.isPaused === "boolean") {
      await prisma.$executeRaw`
        UPDATE contractor_billing 
        SET isPaused = ${updateData.isPaused}
        WHERE id = ${billing.id}
      `;
    }

    // Fetch updated billing
    const updatedBilling = await getOrCreateContractorBilling(userId);

    return NextResponse.json(updatedBilling);
  } catch (error) {
    console.error("Error updating billing:", error);
    return NextResponse.json(
      { error: "Failed to update billing settings" },
      { status: 500 },
    );
  }
}
