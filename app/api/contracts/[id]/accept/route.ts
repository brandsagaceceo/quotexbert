import { NextRequest, NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";
import { sendContractAcceptedEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    const body = await request.json();

    // For now, just log the analytics event
    // The actual contract acceptance logic will be implemented when the schema is ready

    // Check if both parties have accepted (this would be done with real data)
    const bothAccepted = body.bothAccepted || false;

    if (bothAccepted) {
      // Log analytics event for full acceptance
      await logEventServer(
        body.userId || "unknown",
        "contract_accepted",
        {
          contractId,
        }
      );

      // Send emails to both parties
      if (body.homeownerId) {
        await sendContractAcceptedEmail({
          toUserId: body.homeownerId,
          contractId,
          pdfUrl: body.pdfUrl,
        });
      }

      if (body.contractorId) {
        await sendContractAcceptedEmail({
          toUserId: body.contractorId,
          contractId,
          pdfUrl: body.pdfUrl,
        });
      }

      // Generate PDF if both accepted and no PDF exists
      if (!body.pdfUrl) {
        // This would trigger PDF generation in the real implementation
        // For now, we'll just return a note about it
        return NextResponse.json({
          success: true,
          message: "Contract accepted by both parties",
          pdfGeneration: "pending",
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Contract acceptance recorded",
    });
  } catch (error) {
    console.error("Error accepting contract:", error);
    return NextResponse.json(
      { success: false, error: "Failed to accept contract" },
      { status: 500 }
    );
  }
}
