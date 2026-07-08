import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json({ error: 'Forbidden — admin only' }, { status: 403 });
    }
    // Simple test to validate Stripe connection
    const balance = await stripe.balance.retrieve();
    
    return NextResponse.json({
      success: true,
      message: "Stripe connection successful",
      balance: balance.available
    });
  } catch (error) {
    console.error("Stripe test error:", error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 400 });
  }
}