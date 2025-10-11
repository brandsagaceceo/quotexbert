import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test if ContractorSubscription model is available
    const subscriptionCount = await prisma.contractorSubscription.count();
    
    // Test if Transaction model is available  
    const transactionCount = await prisma.transaction.count();
    
    // Test if User model has subscription relation
    const user = await prisma.user.findFirst({
      include: {
        subscriptions: true
      }
    });

    return NextResponse.json({
      success: true,
      subscriptionCount,
      transactionCount,
      userTest: user
    });

  } catch (error) {
    console.error("Model test error:", error);
    return NextResponse.json(
      { error: "Model test failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}