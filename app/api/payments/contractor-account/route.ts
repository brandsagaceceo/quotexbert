import { NextRequest, NextResponse } from "next/server";

// This endpoint has been deprecated in favor of the subscription model
// Contractors now pay monthly subscription fees instead of receiving payments

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint has been deprecated. Contractor accounts are now managed through subscriptions.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint has been deprecated. Contractor accounts are now managed through subscriptions.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: "This endpoint has been deprecated. Contractor accounts are now managed through subscriptions.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}