import { NextRequest, NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";
import { sendContractSentEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    const body = await request.json();

    // For now, just log the analytics event and send emails
    // The actual contract sending logic will be implemented when the schema is ready

    // Log analytics event
    await logEventServer(
      body.userId || "unknown",
      "contract_sent",
      {
        contractId,
      }
    );

    // Send emails to both parties (you would get these from the contract in real implementation)
    if (body.homeownerId) {
      await sendContractSentEmail({
        toUserId: body.homeownerId,
        contractId,
      });
    }

    if (body.contractorId) {
      await sendContractSentEmail({
        toUserId: body.contractorId,
        contractId,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Contract sent successfully",
    });
  } catch (error) {
    console.error("Error sending contract:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send contract" },
      { status: 500 }
    );
  }
}
