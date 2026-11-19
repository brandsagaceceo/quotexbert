import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import { privatePhotosBelongTo } from "@/lib/private-photo-records";
import type { Prisma } from "@prisma/client";

interface SaveEstimateItem {
  category: string;
  description: string;
  minCost: number | string;
  maxCost: number | string;
  selected?: boolean;
  quantity?: number | string | null;
  unit?: string | null;
  notes?: string | null;
}

interface SaveEstimateBody {
  clientRequestId?: string;
  homeownerId?: string | null;
  description: string;
  minCost: number | string;
  maxCost: number | string;
  confidence: number | string;
  aiPowered?: boolean;
  enhancedDescription?: string | null;
  factors?: unknown;
  reasoning?: string | null;
  hasVoice?: boolean;
  imageCount?: number;
  images?: string[];
  items?: SaveEstimateItem[];
}

export async function POST(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { success: false, error: identity.error },
        { status: identity.status },
      );
    }

    const body = (await request.json()) as SaveEstimateBody;
    const clientRequestId = body.clientRequestId;
    if (
      clientRequestId !== undefined &&
      (typeof clientRequestId !== "string" ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          clientRequestId,
        ))
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid estimate save identifier" },
        { status: 400 },
      );
    }
    const {
      description,
      minCost,
      maxCost,
      confidence,
      aiPowered,
      enhancedDescription,
      factors,
      reasoning,
      hasVoice,
      imageCount,
      images,
      items,
    } = body;

    if (!privatePhotosBelongTo(images, identity.user.dbUserId)) {
      return NextResponse.json(
        { success: false, error: "Photos must belong to this homeowner" },
        { status: 400 },
      );
    }

    const data = {
      homeownerId: identity.user.dbUserId,
      description,
      minCost: typeof minCost === "number" ? minCost : parseFloat(minCost),
      maxCost: typeof maxCost === "number" ? maxCost : parseFloat(maxCost),
      confidence:
        typeof confidence === "number" ? confidence : parseFloat(confidence),
      aiPowered: aiPowered !== undefined ? aiPowered : true,
      enhancedDescription: enhancedDescription ?? null,
      factors: JSON.stringify(factors || []),
      reasoning: reasoning ?? null,
      hasVoice: hasVoice ?? false,
      imageCount: imageCount ?? 0,
      images: JSON.stringify(images ?? []),
      status: "saved",
      isPublic: false,
      ...(items
        ? {
            items: {
              create: items.map((item) => ({
                category: item.category,
                description: item.description,
                minCost:
                  typeof item.minCost === "number"
                    ? item.minCost
                    : parseFloat(item.minCost),
                maxCost:
                  typeof item.maxCost === "number"
                    ? item.maxCost
                    : parseFloat(item.maxCost),
                selected: item.selected !== undefined ? item.selected : true,
                quantity:
                  item.quantity === undefined || item.quantity === null
                    ? null
                    : typeof item.quantity === "number"
                      ? item.quantity
                      : parseFloat(item.quantity),
                unit: item.unit ?? null,
                notes: item.notes ?? null,
              })),
            },
          }
        : {}),
    };
    let estimate: Prisma.AIEstimateGetPayload<{ include: { items: true } }>;
    if (clientRequestId) {
      try {
        estimate = await prisma.aIEstimate.upsert({
          where: { id: clientRequestId },
          create: { ...data, id: clientRequestId },
          update: {},
          include: { items: true },
        });
      } catch (error) {
        if (
          !error ||
          typeof error !== "object" ||
          !("code" in error) ||
          error.code !== "P2002"
        ) {
          throw error;
        }
        const existing = await prisma.aIEstimate.findUnique({
          where: { id: clientRequestId },
          include: { items: true },
        });
        if (!existing) throw error;
        estimate = existing;
      }
      if (estimate.homeownerId !== identity.user.dbUserId) {
        return NextResponse.json(
          {
            success: false,
            error:
              "This save identifier cannot be reused. Save a fresh estimate.",
          },
          { status: 409 },
        );
      }
    } else {
      estimate = await prisma.aIEstimate.create({
        data,
        include: { items: true },
      });
    }

    return NextResponse.json({
      success: true,
      estimate,
    });
  } catch (error: any) {
    console.error("Error saving AI estimate:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save estimate" },
      { status: 500 },
    );
  }
}
