import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { contractorId } = await request.json();
    const resolvedParams = await params;
    const jobId = resolvedParams.id;

    if (!jobId) {
      return NextResponse.json(
        { error: "Job ID is required" },
        { status: 400 }
      );
    }

    if (!contractorId) {
      return NextResponse.json(
        { error: "Contractor ID is required" },
        { status: 400 }
      );
    }

    // Ensure demo contractor exists in database
    let demoContractor = await prisma.user.findUnique({
      where: { id: contractorId }
    });

    if (!demoContractor && contractorId === "demo-contractor") {
      demoContractor = await prisma.user.create({
        data: {
          id: "demo-contractor",
          email: "demo-contractor@quotexpert.com",
          role: "contractor"
        }
      });
    }

    // Update the lead with contractor assignment
    const updatedLead = await prisma.lead.update({
      where: { id: jobId },
      data: {
        contractorId: contractorId,
        acceptedById: contractorId,
        status: "assigned",
        claimed: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Job accepted successfully",
      lead: updatedLead
    });

  } catch (error) {
    console.error("Error accepting job:", error);
    return NextResponse.json(
      { error: "Failed to accept job" },
      { status: 500 }
    );
  }
}