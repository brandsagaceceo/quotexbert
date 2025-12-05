import { auth, clerkClient } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      // Health check mode if not authenticated
      const userCount = await prisma.user.count();
      return NextResponse.json({ 
        status: 'ok',
        databaseConnected: true,
        userCount,
        databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET'
      });
    }
    
    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });
    
    // If user doesn't exist, auto-create them WITHOUT a role (they must select during onboarding)
    if (!user) {
      try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);
        const email = clerkUser.emailAddresses[0]?.emailAddress || `${userId}@clerk.user`;
        const userName: string = clerkUser.firstName 
          ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() 
          : email.split('@')[0] || 'User';

        // Create user WITHOUT a role - they must select during onboarding
        user = await prisma.user.create({
          data: {
            id: userId,
            email: email,
            name: userName,
            role: null
          },
          select: { role: true }
        });
      } catch (error) {
        console.error('Error creating user:', error);
        // Return null if creation fails - user must select role
        user = { role: null };
      }
    }
    
    return NextResponse.json({ 
      role: user?.role || null
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

    console.log('Updating user:', { userId, email, role });

    // Use upsert to handle both create and update cases
    await prisma.user.upsert({
      where: { id: userId },
      update: {
        role: role,
        name: userName,
      },
      create: {
        id: userId,
        email: email,
        name: userName,
        role: role,
      },
    });

    console.log('User role updated successfully');

    // Return success with a flag to reload the session
    const response = NextResponse.json({ success: true, role, refreshSession: true });
    return response;
  } catch (error) {
    console.error("Error updating user role:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'NOT SET'
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
