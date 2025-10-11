import { NextRequest, NextResponse } from "next/server";

// This endpoint has been deprecated in favor of the subscription model
// Payment releases are no longer needed as we've moved to a subscription-based model

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint has been deprecated. Payment releases are no longer needed with the subscription model.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}