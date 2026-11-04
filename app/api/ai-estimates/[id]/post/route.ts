import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notifications";
import { normalizeEstimatePricing } from "@/lib/estimate-pricing";
import { postalCodeToCity } from "@/lib/postal-to-city";
import { normalizeCategory } from "@/lib/categories";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import {
  deleteUnreferencedPrivatePhotos,
  privatePhotosBelongTo,
} from "@/lib/private-photo-records";

class EstimatePublishConflictError extends Error {}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { success: false, error: identity.error },
        { status: identity.status },
      );
    }

    // Fetch the estimate with selected items and homeowner profile
    const estimate = await prisma.aIEstimate.findFirst({
      where: { id, homeownerId: { in: identity.homeownerIds } },
      include: {
        items: {
          where: { selected: true },
        },
        homeowner: {
          include: {
            homeownerProfile: true,
          },
        },
      },
    });

    if (!estimate) {
      return NextResponse.json(
        { success: false, error: "Estimate not found" },
        { status: 404 },
      );
    }

    if (!estimate.homeownerId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No homeowner associated with this estimate. Please sign in and try again.",
        },
        { status: 400 },
      );
    }

    if (estimate.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No items selected for posting. Please select at least one item.",
        },
        { status: 400 },
      );
    }

    if (estimate.leadId) {
      return NextResponse.json(
        {
          success: false,
          error: "Estimate already posted to job board",
          leadId: estimate.leadId,
        },
        { status: 400 },
      );
    }

    // Create a comprehensive description from selected items
    const itemDescriptions = estimate.items.map(
      (item) =>
        `${item.category}: ${item.description}${item.quantity ? ` (${item.quantity} ${item.unit || "units"})` : ""}`,
    );
    const fullDescription = `${estimate.description}\n\n**Selected Items:**\n${itemDescriptions.join("\n")}`;

    // Get location from homeowner profile or use Toronto default
    // Extract city from homeowner profile for proper location tracking
    const city = estimate.homeowner?.homeownerProfile?.city || "Toronto";

    // Map city to postal code for the Greater Toronto Area
    // This helps contractors find jobs in their service area
    let zipCode = "M5H 2N2"; // Default Toronto postal code (downtown)

    // Improved postal code mapping based on city
    const cityPostalCodes: Record<string, string> = {
      Toronto: "M5H 2N2",
      Mississauga: "L5B 1M2",
      Brampton: "L6Y 0P6",
      Markham: "L3R 9W3",
      Vaughan: "L4L 4Y7",
      "Richmond Hill": "L4B 3P6",
      Oakville: "L6H 0H3",
      Burlington: "L7R 2G5",
      Ajax: "L1T 0A2",
      Pickering: "L1V 1B8",
      Whitby: "L1N 9B9",
      Oshawa: "L1H 8L7",
      Scarborough: "M1P 4P5",
      Etobicoke: "M9C 1B8",
      "North York": "M2N 5Z7",
    };

    // Use city-specific postal code if available
    if (city && cityPostalCodes[city]) {
      zipCode = cityPostalCodes[city];
    }

    // Determine category from estimate items
    const categories = estimate.items.map((item) => item.category);
    // Normalize to the canonical contractor-matching category set — the previous
    // 'General Contractor' fallback was a subscription TIER name, not a real
    // category, and never matched any contractor's entitlement.
    const primaryCategory = normalizeCategory(categories[0] || "");

    let body: Record<string, unknown>;
    try {
      const parsedBody: unknown = await request.json();
      if (
        typeof parsedBody !== "object" ||
        parsedBody === null ||
        Array.isArray(parsedBody)
      ) {
        return NextResponse.json(
          { success: false, error: "Invalid request body" },
          { status: 400 },
        );
      }
      body = parsedBody as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 },
      );
    }

    const submittedPhotos = body.photos === undefined ? [] : body.photos;
    const visualizationUrl = body.visualizationUrl;
    if (
      !Array.isArray(submittedPhotos) ||
      submittedPhotos.length > 10 ||
      !submittedPhotos.every(
        (photo): photo is string => typeof photo === "string",
      ) ||
      (visualizationUrl !== undefined &&
        visualizationUrl !== null &&
        typeof visualizationUrl !== "string")
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid photo selection" },
        { status: 400 },
      );
    }
    const finalPhotos = Array.from(
      new Set(
        submittedPhotos.filter(
          (photo): photo is string => typeof photo === "string",
        ),
      ),
    );
    if (
      typeof visualizationUrl === "string" &&
      !finalPhotos.includes(visualizationUrl)
    ) {
      finalPhotos.push(visualizationUrl);
    }
    if (
      finalPhotos.length > 10 ||
      !privatePhotosBelongTo(finalPhotos, identity.user.dbUserId)
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Photo selection exceeds the limit or contains an unauthorized photo",
        },
        { status: 400 },
      );
    }

    let previousEstimatePhotos: string[] = [];
    try {
      const parsed = JSON.parse(estimate.images || "[]");
      previousEstimatePhotos = Array.isArray(parsed)
        ? parsed.filter((photo: unknown): photo is string => typeof photo === "string")
        : [];
    } catch {
      previousEstimatePhotos = [];
    }

    // Price consistency: the saved AIEstimate row (estimate.minCost/maxCost) is the single
    // source of truth for the project's price range — it is NEVER recalculated here from
    // the currently-selected items (that was the bug: selecting/deselecting items produced
    // a different "average" budget than the range the homeowner saw on the review page).
    // The homeowner may deliberately override the suggested posting budget on the review
    // page; if they did, `body.budget` carries that explicit choice through. Otherwise we
    // fall back to the same `recommended` value the review page displayed by default.
    const pricing = normalizeEstimatePricing(estimate);
    const submittedBudget =
      typeof body.budget === "number"
        ? body.budget
        : typeof body.budget === "string"
          ? parseFloat(body.budget)
          : Number.NaN;
    const finalBudget =
      Number.isFinite(submittedBudget) && submittedBudget > 0
        ? Math.round(submittedBudget)
        : pricing.recommended;

    if (process.env.NODE_ENV !== "production") {
      console.log("[POST-TO-JOB-BOARD] Price consistency check", {
        estimateId: estimate.id,
        originalLow: pricing.low,
        originalHigh: pricing.high,
        recommended: pricing.recommended,
        homeownerEditedBudget:
          submittedBudget !== pricing.recommended ? finalBudget : null,
        finalLeadBudget: finalBudget,
      });
    }

    const { lead, updatedEstimate } = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.create({
        data: {
          title: `Home Renovation: ${estimate.description.substring(0, 50)}${estimate.description.length > 50 ? "..." : ""}`,
          description: fullDescription,
          budget: finalBudget.toString(),
          zipCode,
          category: primaryCategory,
          status: "open",
          published: true,
          homeownerId: estimate.homeownerId!,
          photos: JSON.stringify(finalPhotos),
        },
      });

      const claimed = await tx.aIEstimate.updateMany({
        where: {
          id,
          homeownerId: { in: identity.homeownerIds },
          leadId: null,
        },
        data: {
          leadId: lead.id,
          status: "posted",
          isPublic: true,
          images: JSON.stringify(finalPhotos),
        },
      });
      if (claimed.count !== 1) {
        throw new EstimatePublishConflictError();
      }

      const updatedEstimate = await tx.aIEstimate.findFirstOrThrow({
        where: { id, homeownerId: { in: identity.homeownerIds } },
      });
      return { lead, updatedEstimate };
    });
    await deleteUnreferencedPrivatePhotos(
      previousEstimatePhotos.filter((photo) => !finalPhotos.includes(photo)),
    );

    // 🚀 NOTIFY ALL CONTRACTORS IMMEDIATELY about this new job
    try {
      // Resolve city: prefer homeowner profile city, then derive from postal code
      const homeownerWithProfile = await prisma.user.findUnique({
        where: { id: estimate.homeownerId },
        include: { homeownerProfile: true },
      });

      const resolvedCity =
        homeownerWithProfile?.homeownerProfile?.city ||
        postalCodeToCity(lead.zipCode) ||
        undefined;

      await NotificationService.notifyAllContractors({
        leadId: lead.id,
        title: lead.title,
        description: lead.description,
        budget: lead.budget,
        category: lead.category, // was omitted → all contractors got teaser instead of full
        ...(resolvedCity ? { city: resolvedCity } : {}),
        createdAt: lead.createdAt.toISOString(),
        isSeeded: lead.isSeeded,
      });
    } catch (notificationError) {
      console.error(
        "Failed to notify contractors, but job was posted:",
        notificationError,
      );
      // Continue - job post succeeded even if notifications failed
    }

    return NextResponse.json({
      success: true,
      estimate: updatedEstimate,
      lead: lead,
      hasVisualization: !!visualizationUrl,
      message: visualizationUrl
        ? "Successfully posted to job board with AI visualization and notified all contractors! 🎨"
        : "Successfully posted to job board and notified all contractors!",
    });
  } catch (error: any) {
    if (error instanceof EstimatePublishConflictError) {
      return NextResponse.json(
        { success: false, error: "Estimate already posted to job board" },
        { status: 409 },
      );
    }
    console.error("Error posting estimate to job board:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to post to job board" },
      { status: 500 },
    );
  }
}
