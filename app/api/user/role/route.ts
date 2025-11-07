import { auth, clerkClient } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    return NextResponse.json({ 
      status: 'ok',
      databaseConnected: true,
      userCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      databaseConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (!["homeowner", "contractor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Get user info from Clerk
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);

    // Update user metadata in Clerk
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: role,
      },
    });

    // Create or update user in database
    const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`;
    const userName: string = clerkUser.firstName 
      ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() 
      : email.split('@')[0] || 'User';

    await prisma.user.upsert({
      where: { id: userId },
      update: {
        role: role as "homeowner" | "contractor" | "admin",
        name: userName,
      },
      create: {
        id: userId,
        email: email,
        name: userName,
        role: role as "homeowner" | "contractor" | "admin",
      },
    });

    // Return success with a flag to reload the session
    const response = NextResponse.json({ success: true, role, refreshSession: true });
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET'
    });
    return NextResponse.json(
      { 
        error: "Failed to update role",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 },
    );
  }
}
