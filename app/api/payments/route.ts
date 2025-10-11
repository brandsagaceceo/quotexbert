import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, amount, type, payerId, description } = body;

    if (!leadId || !amount || !type || !payerId) {
      return NextResponse.json(
        { error: "leadId, amount, type, and payerId are required" },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate successful payment processing
    // In a real app, you'd integrate with Stripe here

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create payment record
    const payment = {
      id: `demo_pay_${Date.now()}`,
      leadId,
      amount: parseFloat(amount),
      type, // 'deposit', 'milestone', 'final'
      status: 'completed',
      payerId,
      description: description || `${type} payment`,
      stripePaymentIntentId: `pi_demo_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // In a real app, you'd save this to the database
    // For demo, we'll just return the simulated payment

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment processed successfully (Demo Mode)"
    });

  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Payment processing failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");
    const userId = searchParams.get("userId");

    if (!leadId || !userId) {
      return NextResponse.json(
        { error: "leadId and userId are required" },
        { status: 400 }
      );
    }

    // For demo purposes, return mock payment data
    const mockPayments = [
      {
        id: "demo_pay_001",
        leadId,
        amount: 500.00,
        type: "deposit",
        status: "completed",
        payerId: userId,
        description: "Project deposit",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: "demo_pay_002", 
        leadId,
        amount: 1500.00,
        type: "milestone",
        status: "pending",
        payerId: userId,
        description: "50% milestone payment",
        createdAt: new Date().toISOString()
      }
    ];

    return NextResponse.json(mockPayments);

  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}