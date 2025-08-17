import { PostHog } from "posthog-node";

// Server-side PostHog instance
let posthogServerInstance: PostHog | null = null;

// Initialize PostHog server instance
function getPosthogServer(): PostHog | null {
  const apiKey = process.env.POSTHOG_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";
  
  if (!apiKey) {
    console.warn("PostHog API key not found. Server analytics will be disabled.");
    return null;
  }
  
  if (!posthogServerInstance) {
    try {
      posthogServerInstance = new PostHog(apiKey, {
        host,
      });
    } catch (error) {
      console.error("Failed to initialize PostHog server:", error);
      return null;
    }
  }
  
  return posthogServerInstance;
}

// Server-side event logging
export async function logEventServer(
  userId: string,
  eventName: string,
  properties?: Record<string, any>
): Promise<void> {
  try {
    const client = getPosthogServer();
    if (!client) return;
    
    const eventData: {
      distinctId: string;
      event: string;
      properties?: Record<string | number, any>;
    } = {
      distinctId: userId,
      event: eventName,
    };
    
    if (properties) {
      eventData.properties = properties;
    }
    
    client.capture(eventData);
    
    // Ensure the event is sent
    await client.flush();
  } catch (error) {
    console.error("Failed to log server event:", error);
  }
}

// Graceful shutdown
export async function shutdownAnalytics(): Promise<void> {
  try {
    if (posthogServerInstance) {
      await posthogServerInstance.shutdown();
    }
  } catch (error) {
    console.error("Failed to shutdown analytics:", error);
  }
}

// Analytics event types for type safety
export type AnalyticsEvent = 
  | "estimate_created"
  | "job_comment_created"
  | "thread_started"
  | "message_sent"
  | "lead_assigned"
  | "contract_drafted"
  | "contract_sent"
  | "contract_accepted"
  | "checkout_success";

// Unified analytics helper that works on both client and server
export { logEventClient, identifyUser, resetUser } from "./analytics-client";
