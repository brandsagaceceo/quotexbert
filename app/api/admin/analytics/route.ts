import { NextRequest, NextResponse } from "next/server";
import { PostHog } from "posthog-node";

// Initialize PostHog server client
const postHogClient = new PostHog(
  process.env.POSTHOG_API_KEY!,
  {
    host: process.env.POSTHOG_HOST || "https://app.posthog.com",
  }
);

interface PostHogEvent {
  event: string;
  timestamp: string;
  properties: Record<string, any>;
  person?: {
    id: string;
    properties: Record<string, any>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d";

    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (range) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // For demo purposes, we'll create mock data since PostHog's query API
    // requires complex setup. In production, you'd use PostHog's query API
    // or connect to their data warehouse
    
    const mockEvents: PostHogEvent[] = [
      {
        event: "estimate_created",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { estimateId: "est_123", userId: "user_1", budget: 5000 },
      },
      {
        event: "estimate_viewed",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { estimateId: "est_123", userId: "user_2" },
      },
      {
        event: "thread_created",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { threadId: "thread_123", leadId: "lead_1", userId: "user_1" },
      },
      {
        event: "message_sent",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { threadId: "thread_123", messageId: "msg_1", fromUserId: "user_1", toUserId: "user_2" },
      },
      {
        event: "lead_accepted",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { leadId: "lead_1", contractorId: "user_2", homeownerId: "user_1" },
      },
      {
        event: "contract_created",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { contractId: "contract_123", leadId: "lead_1" },
      },
      {
        event: "contract_sent",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { contractId: "contract_123", recipientEmail: "homeowner@example.com" },
      },
      {
        event: "contract_accepted",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { contractId: "contract_123", userId: "user_1" },
      },
      {
        event: "contract_pdf_generated",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { contractId: "contract_123", pdfUrl: "https://example.com/contract.pdf" },
      },
      {
        event: "payment_completed",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { leadId: "lead_1", amountCents: 900, paymentIntentId: "pi_123" },
      },
      // Add more mock events for variety
      {
        event: "estimate_created",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { estimateId: "est_124", userId: "user_3", budget: 3000 },
      },
      {
        event: "message_sent",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { threadId: "thread_124", messageId: "msg_2", fromUserId: "user_2", toUserId: "user_3" },
      },
      {
        event: "payment_completed",
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        properties: { leadId: "lead_2", amountCents: 1200, paymentIntentId: "pi_124" },
      },
    ];

    // Filter events by date range
    const filteredEvents = mockEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= startDate && eventDate <= now;
    });

    // Calculate analytics metrics
    const eventCounts: Record<string, number> = {};
    const uniqueUsers = new Set<string>();

    filteredEvents.forEach(event => {
      // Count events
      eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
      
      // Track unique users
      if (event.properties.userId) {
        uniqueUsers.add(event.properties.userId);
      }
      if (event.properties.fromUserId) {
        uniqueUsers.add(event.properties.fromUserId);
      }
      if (event.properties.contractorId) {
        uniqueUsers.add(event.properties.contractorId);
      }
    });

    // Sort recent activity by timestamp
    const recentActivity = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const analyticsData = {
      totalEvents: filteredEvents.length,
      uniqueUsers: uniqueUsers.size,
      events: filteredEvents,
      eventCounts,
      recentActivity,
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}

// Production implementation would use PostHog's query API:
/*
async function fetchPostHogData(startDate: Date, endDate: Date) {
  // Example PostHog query API call
  const query = {
    kind: "EventsQuery",
    select: ["event", "timestamp", "properties", "person"],
    event: null, // All events
    after: startDate.toISOString(),
    before: endDate.toISOString(),
    limit: 1000,
  };

  const response = await fetch(`${process.env.POSTHOG_HOST}/api/projects/${process.env.POSTHOG_PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.POSTHOG_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return response.json();
}
*/
