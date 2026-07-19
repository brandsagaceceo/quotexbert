import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    {
      error: 'This endpoint has been deprecated. QuoteXbert only bills contractor subscriptions through Stripe.',
      redirectTo: '/contractor/subscriptions'
    },
    { status: 410 }
  );
}