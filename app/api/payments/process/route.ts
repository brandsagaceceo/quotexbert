import { NextRequest, NextResponse } from "next/server";

// This endpoint has been deprecated in favor of the subscription model
// Payments are now handled through monthly subscriptions rather than per-job payments

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint has been deprecated. Payments are now handled through contractor subscriptions.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}