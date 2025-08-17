import { NextRequest, NextResponse } from "next/server";
import { generatePdfSchema } from "@/lib/validation/schemas";
import { generateContractPdf } from "@/lib/pdf";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: contractId } = await params;
    
    // Validate input
    const validatedData = generatePdfSchema.parse({
      contractId,
    });

    // For now, create a mock contract for PDF generation
    // In real implementation, you would fetch the contract from the database
    const mockContract = {
      id: contractId,
      title: "Home Renovation Contract",
      description: "Complete kitchen renovation including cabinets, countertops, and appliances",
      scope: "This contract covers all aspects of kitchen renovation including demolition, installation of new cabinets, granite countertops, stainless steel appliances, electrical work, and plumbing modifications as needed.",
      totalAmountCents: 2500000, // $25,000
      homeowner: {
        email: "homeowner@example.com",
        id: "homeowner-123",
      },
      contractor: {
        email: "contractor@example.com", 
        id: "contractor-456",
      },
      items: [
        {
          description: "Kitchen Cabinets",
          quantity: 1,
          unitPrice: 1200000, // $12,000
          totalPrice: 1200000,
        },
        {
          description: "Granite Countertops",
          quantity: 1,
          unitPrice: 800000, // $8,000
          totalPrice: 800000,
        },
        {
          description: "Labor",
          quantity: 1,
          unitPrice: 500000, // $5,000
          totalPrice: 500000,
        },
      ],
      createdAt: new Date(),
      acceptedAt: new Date(),
    };

    // Generate PDF
    const pdfUrl = await generateContractPdf(mockContract);

    // In real implementation, you would save the pdfUrl to the contract record

    return NextResponse.json({
      success: true,
      pdfUrl,
    });
  } catch (error) {
    console.error("Error generating contract PDF:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
