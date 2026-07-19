import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: "This endpoint has been deprecated. QuoteXbert only bills contractor subscriptions through Stripe.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      error: "This endpoint has been deprecated. QuoteXbert only bills contractor subscriptions through Stripe.",
      redirectTo: "/api/subscriptions"
    },
    { status: 410 }
  );
}