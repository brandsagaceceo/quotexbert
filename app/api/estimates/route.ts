import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";

export async function GET(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { error: identity.error },
        { status: identity.status },
      );
    }

    // Fetch all estimates for this homeowner
    const estimates = await prisma.aIEstimate.findMany({
      where: {
        homeownerId: { in: identity.homeownerIds },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
        lead: {
          select: { id: true, title: true, status: true },
        },
      },
    });

    // Transform the estimates to include parsed factors
    const transformedEstimates = estimates.map((estimate) => ({
      id: estimate.id,
      description: estimate.description,
      minCost: estimate.minCost,
      maxCost: estimate.maxCost,
      confidence: Math.round((estimate.confidence || 0) * 100),
      aiPowered: estimate.aiPowered,
      enhancedDescription: estimate.enhancedDescription,
      factors: estimate.factors ? JSON.parse(estimate.factors as string) : [],
      hasVoice: estimate.hasVoice,
      imageCount: estimate.imageCount,
      status: estimate.status,
      isPublic: estimate.isPublic,
      leadId: estimate.leadId,
      lead: estimate.lead,
      createdAt: estimate.createdAt,
      updatedAt: estimate.updatedAt,
      items: estimate.items,
    }));

    return NextResponse.json({
      estimates: transformedEstimates,
    });
  } catch (error) {
    console.error("Error fetching estimates:", error);
    return NextResponse.json(
      { error: "Failed to fetch estimates" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { error: identity.error },
        { status: identity.status },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const estimateId = searchParams.get("id");

    if (!estimateId) {
      return NextResponse.json(
        { error: "Estimate ID is required" },
        { status: 400 },
      );
    }

    const deleted = await prisma.aIEstimate.deleteMany({
      where: {
        id: estimateId,
        homeownerId: { in: identity.homeownerIds },
      },
    });
    if (deleted.count !== 1) {
      return NextResponse.json(
        { error: "Estimate not found or does not belong to this user" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Estimate deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting estimate:", error);
    return NextResponse.json(
      { error: "Failed to delete estimate" },
      { status: 500 },
    );
  }
}
