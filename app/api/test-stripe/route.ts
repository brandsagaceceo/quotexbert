import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Stripe connection with key:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
    
    // Simple test to validate Stripe connection
    const balance = await stripe.balance.retrieve();
    
    return NextResponse.json({
      success: true,
      message: "Stripe connection successful",
      keyUsed: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...',
      balance: balance.available
    });
  } catch (error) {
    console.error("Stripe test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      keyUsed: process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...'
    }, { status: 400 });
  }
}