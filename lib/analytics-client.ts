"use client";

import { PostHog } from "posthog-js";

// Client-side PostHog instance
let posthogInstance: PostHog | null = null;

// Initialize PostHog client (call this in your app's root component)
export function initPosthogClient(): PostHog | null {
  if (typeof window === "undefined") return null;
  
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.posthog.com";
  
  if (!apiKey) {
    console.warn("PostHog API key not found. Analytics will be disabled.");
    return null;
  }
  
  if (!posthogInstance) {
    try {
      posthogInstance = new PostHog();
      posthogInstance.init(apiKey, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: false, // We'll capture these manually
      });
    } catch (error) {
      console.error("Failed to initialize PostHog:", error);
      return null;
    }
  }
  
  return posthogInstance;
}

// Get the PostHog instance (for client-side use)
export function getPosthogClient(): PostHog | null {
  return posthogInstance;
}

// Client-side event logging
export function logEventClient(
  eventName: string, 
  properties?: Record<string, any>
): void {
  try {
    const client = getPosthogClient();
    if (!client) return;
    
    client.capture(eventName, properties);
  } catch (error) {
    console.error("Failed to log client event:", error);
  }
}

// Identify user (call this after authentication)
export function identifyUser(userId: string, properties?: Record<string, any>): void {
  try {
    const client = getPosthogClient();
    if (!client) return;
    
    client.identify(userId, properties);
  } catch (error) {
    console.error("Failed to identify user:", error);
  }
}

// Reset user session (call this on logout)
export function resetUser(): void {
  try {
    const client = getPosthogClient();
    if (!client) return;
    
    client.reset();
  } catch (error) {
    console.error("Failed to reset user:", error);
  }
}
