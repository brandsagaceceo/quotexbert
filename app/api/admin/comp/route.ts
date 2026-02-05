import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Admin emails allowed to grant comp subscriptions
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",").filter(Boolean);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

function isAuthorized(request: NextRequest): boolean {
  // Check admin token header
  const token = request.headers.get("x-admin-token");
  if (token && token === ADMIN_TOKEN) {
    return true;
  }

  // Could add additional auth checks here (e.g., session-based)
  return false;
}

// POST - Grant comp subscription
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { email, tier, expiresAt, reason } = await request.json();

    if (!email || !tier) {
      return NextResponse.json(
        { error: "Email and tier are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Update user with comp override - using direct SQL since schema may not have these fields yet
    await prisma.$executeRaw`
      UPDATE "User" 
      SET 
        "subscriptionPlan" = 'PRO_MAX',
        "subscriptionStatus" = 'active',
        "subscriptionInterval" = 'lifetime'
      WHERE "id" = ${user.id}
    `;

    console.log(`[CompSubscription] Granted PRO_MAX to ${email}`);

    return NextResponse.json({
      success: true,
      message: `Comp subscription granted to ${email}`,
      user: {
        id: user.id,
        email: user.email,
        subscriptionPlan: 'PRO_MAX',
        subscriptionStatus: 'active'
      }
    });

  } catch (error) {
    console.error("[CompSubscription] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Remove comp subscription
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Remove comp override
    await prisma.$executeRaw`
      UPDATE "User" 
      SET 
        "subscriptionPlan" = NULL,
        "subscriptionStatus" = NULL,
        "subscriptionInterval" = NULL
      WHERE "id" = ${user.id}
    `;

    console.log(`[CompSubscription] Removed comp from ${email}`);

    return NextResponse.json({
      success: true,
      message: `Comp subscription removed from ${email}`,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    console.error("[CompSubscription] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
