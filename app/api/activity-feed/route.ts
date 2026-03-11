import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/activity-feed
 * Fetch recent activity events for the feed
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    // Get recent activity events (using optional chaining since model may not exist)
    let activities = [];
    
    try {
      const events = await (prisma as any).activityFeedEvent?.findMany({
        take: Math.min(limit, 50),
        orderBy: { createdAt: 'desc' },
      });
      
      if (events && events.length > 0) {
        activities = events.map((event: any) => ({
          id: event.id,
          type: event.type,
          category: event.category,
          city: event.city,
          estimate: event.estimate,
          contractorName: event.contractorName,
          rating: event.rating,
          timestamp: event.createdAt,
        }));
      }
    } catch (err) {
      console.log('[ACTIVITY_FEED] activityFeedEvent model not found, returning empty');
    }

    return NextResponse.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("[ACTIVITY_FEED_GET]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/activity-feed
 * Create a new activity event
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, category, city, estimate, contractorName, rating } = body;

    if (!type || !city) {
      return NextResponse.json(
        { error: "Type and city are required" },
        { status: 400 }
      );
    }

    // Create activity event (if model exists)
    try {
      const event = await (prisma as any).activityFeedEvent?.create({
        data: {
          type,
          category,
          city,
          estimate,
          contractorName,
          rating,
        },
      });
      
      if (!event) {
        throw new Error('activityFeedEvent model not available');
      }

      return NextResponse.json({
        success: true,
        event,
      });
    } catch (eventError) {
      console.log('[ACTIVITY_FEED] activityFeedEvent model not available');
      return NextResponse.json({
        success: false,
        error: 'Activity feed not configured'
      }, { status: 501 });
    }
  } catch (error) {
    console.error("[ACTIVITY_FEED_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
