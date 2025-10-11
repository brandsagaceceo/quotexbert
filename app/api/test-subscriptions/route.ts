import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test if subscription model is available
    const subscriptionCount = await prisma.contractorSubscription.count();
    
    return NextResponse.json({
      success: true,
      message: "Subscription model is working",
      subscriptionCount
    });

  } catch (error) {
    console.error("Subscription model test error:", error);
    return NextResponse.json(
      { error: "Subscription model test failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}