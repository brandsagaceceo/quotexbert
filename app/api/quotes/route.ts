// LIVE ROUTE — /api/quotes
// Collection-level quote retrieval and creation.
// Individual quote operations (GET by id, PUT, status updates) are in /api/quotes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/quotes
 * Filters (at least one required):
 *   ?contractorId=<db-id or clerk-id>
 *   ?homeownerId=<db-id or clerk-id>   → resolved via Conversation.homeownerId
 *   ?conversationId=<conversation-id>
 * Returns: { quotes: Quote[] }
 * If no filter is provided returns { quotes: [] } so pages don't crash.
 *
 * PRIVACY: reads are scoped to the authenticated caller on the SERVER. A
 * contractor may only ever receive their OWN quotes; a homeowner may only
 * receive quotes on their own jobs. Client-supplied ids are never trusted for
 * authorization — they can't be tampered to read a competing contractor's quote.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }
    const { dbUserId } = authResult.user;

    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");
    const homeownerId = searchParams.get("homeownerId");
    const conversationId = searchParams.get("conversationId");

    if (!contractorId && !homeownerId && !conversationId) {
      // Return empty rather than 400 so pages calling without a filter do not break.
      return NextResponse.json({ quotes: [] });
    }

    const where: Record<string, unknown> = {};

    if (conversationId) {
      // Caller must be a participant of this conversation. Conversations are keyed
      // per (jobId, homeownerId, contractorId), so a contractor's conversation only
      // ever contains their own quotes — but verify participation regardless so a
      // tampered conversationId can't surface a co-bidder's quotes.
      const conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        select: { homeownerId: true, contractorId: true },
      });
      if (!conversation) return NextResponse.json({ quotes: [] });
      const isHomeowner = conversation.homeownerId === dbUserId;
      const isContractor = conversation.contractorId === dbUserId;
      if (!isHomeowner && !isContractor) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      where.conversationId = conversationId;
      // Defense in depth: a contractor is pinned to their own quotes only.
      if (!isHomeowner) where.contractorId = dbUserId;
    } else if (contractorId) {
      // Contractors may only read their own quotes — pin to the authenticated
      // user and ignore the supplied id so it can't be tampered to read a rival's.
      where.contractorId = dbUserId;
    } else if (homeownerId) {
      // Homeowners may only read quotes on their own jobs (via Conversation.homeownerId).
      where.conversation = { homeownerId: dbUserId };
    }

    const quotes = await prisma.quote.findMany({
      where,
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            budget: true,
            category: true,
            status: true,
            zipCode: true,
          },
        },
        contractor: {
          select: {
            id: true,
            name: true,
            email: true,
            contractorProfile: {
              select: {
                companyName: true,
                trade: true,
                city: true,
                profilePhoto: true,
              },
            },
          },
        },
        conversation: {
          select: {
            id: true,
            homeownerId: true,
            contractorId: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ quotes });
  } catch (error) {
    console.error("[GET /api/quotes] Error:", error);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

/**
 * POST /api/quotes
 * Creates a new quote (contractor-initiated, tied to a Conversation).
 * Required body: { conversationId, jobId, contractorId, title, description, scope, totalCost }
 * Optional: { laborCost, materialCost, items: QuoteItem[] }
 * Returns: { quote: Quote }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      conversationId,
      jobId,
      contractorId,
      title,
      description,
      scope,
      totalCost,
      laborCost = 0,
      materialCost = 0,
      items = [],
    } = body;

    if (
      !conversationId ||
      !jobId ||
      !contractorId ||
      !title ||
      !description ||
      !scope ||
      totalCost == null
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: conversationId, jobId, contractorId, title, description, scope, totalCost",
        },
        { status: 400 }
      );
    }

    // Resolve contractor — support both DB id and Clerk user id
    const contractor = await prisma.user.findFirst({
      where: { OR: [{ id: contractorId }, { clerkUserId: contractorId }] },
      select: { id: true },
    });

    if (!contractor) {
      return NextResponse.json({ error: "Contractor not found" }, { status: 404 });
    }

    const quote = await prisma.quote.create({
      data: {
        conversationId,
        jobId,
        contractorId: contractor.id,
        title,
        description,
        scope,
        totalCost: Number(totalCost),
        laborCost: Number(laborCost),
        materialCost: Number(materialCost),
        status: "draft",
        ...(items.length > 0
          ? {
              items: {
                create: items.map((item: {
                  category?: string;
                  description: string;
                  quantity?: number;
                  unitPrice?: number;
                  totalPrice?: number;
                  notes?: string;
                }) => ({
                  category: item.category ?? "other",
                  description: item.description,
                  quantity: Number(item.quantity ?? 1),
                  unitPrice: Number(item.unitPrice ?? 0),
                  totalPrice: Number(item.totalPrice ?? (item.quantity ?? 1) * (item.unitPrice ?? 0)),
                  notes: item.notes ?? null,
                })),
              },
            }
          : {}),
      },
      include: {
        items: { orderBy: { createdAt: "asc" } },
        job: { select: { id: true, title: true, category: true, budget: true, status: true } },
        contractor: { select: { id: true, name: true, email: true } },
        conversation: {
          select: { id: true, homeownerId: true, contractorId: true, status: true },
        },
      },
    });

    return NextResponse.json({ quote }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quotes] Error:", error);
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}