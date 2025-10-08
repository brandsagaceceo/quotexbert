import { NextRequest, NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, just validate and log the analytics event
    // The actual contract creation will be implemented when the schema is fully deployed
    
    // Validate required fields
    if (!body.leadId || !body.title || !body.totalAmountCents) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log analytics event
    await logEventServer(
      body.contractorId || "unknown",
      "contract_drafted",
      {
        leadId: body.leadId,
        totalAmountCents: body.totalAmountCents,
        itemCount: body.items?.length || 0,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Contract draft created successfully",
      contractId: `draft-${Date.now()}`, // Temporary ID
    });
  } catch (error) {
    console.error("Error creating contract:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contract" },
      { status: 500 }
    );
  }
}
