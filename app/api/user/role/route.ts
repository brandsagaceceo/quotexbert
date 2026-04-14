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
    
    // Check if user exists in database.
    // Must search by BOTH id and clerkUserId because webhook-created users
    // have User.id = UUID and User.clerkUserId = clerkId, while role-selection
    // created users have User.id = clerkId directly.
    let user = await prisma.user.findFirst({
      where: { OR: [{ id: userId }, { clerkUserId: userId }] },
      select: {
        id: true,
        role: true,
        contractorProfile: { select: { profilePhoto: true } },
        homeownerProfile: { select: { profilePhoto: true } }
      }
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

        // Check if a user with the same email already exists (e.g. seeded data).
        // If so, link the Clerk ID to the existing record instead of creating a duplicate.
        const existingByEmail = await prisma.user.findUnique({
          where: { email },
          select: { id: true, role: true, contractorProfile: { select: { profilePhoto: true } }, homeownerProfile: { select: { profilePhoto: true } } }
        });
        if (existingByEmail) {
          await prisma.user.update({ where: { email }, data: { clerkUserId: userId } });
          user = existingByEmail;
        } else {
          // Create user WITHOUT a role — they must select during onboarding
          user = await prisma.user.create({
            data: {
              id: userId,
              email: email,
              name: userName,
              clerkUserId: userId,
              role: null
            },
            select: {
              id: true,
              role: true,
              contractorProfile: { select: { profilePhoto: true } },
              homeownerProfile: { select: { profilePhoto: true } }
            }
          });
        }
      } catch (error) {
        console.error('Error creating user:', error);
        // Return null if creation fails - user must select role
        user = { id: userId, role: null, contractorProfile: null, homeownerProfile: null };
      }
    }
    
    const profilePhoto = (user as any)?.contractorProfile?.profilePhoto || (user as any)?.homeownerProfile?.profilePhoto || null;
    return NextResponse.json({ 
      role: user?.role || null,
      profilePhoto
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
    
    // Generate proper name with fallback logic
    let userName = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim();
    if (!userName) {
      // Use email prefix as name (e.g., 'john.doe@gmail.com' -> 'john doe')
      const emailPrefix = email.split('@')[0] || '';
      userName = emailPrefix ? emailPrefix.replace(/[._-]/g, ' ').trim() : 'User';
      if (!userName) userName = 'User';
    }
    if (!userName) {
      userName = 'User';
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[API/user/role][POST]', { userId, email, userName, role });
    }

    // Check if a user already exists by email to avoid duplicate email constraint errors
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    let resolvedUserId: string;

    if (existingUser) {
      // User exists — update role, name, and ensure clerkUserId is stored
      await prisma.user.update({
        where: { email },
        data: { role, name: userName, clerkUserId: userId },
      });
      resolvedUserId = existingUser.id;
    } else {
      // No user with this email — create fresh record
      await prisma.user.create({
        data: {
          id: userId,
          email,
          name: userName,
          role,
          clerkUserId: userId,
        },
      });
      resolvedUserId = userId;
    }

    // Ensure the role-specific profile row exists so saves never fail on first attempt.
    // Uses upsert (no-op if already exists).
    if (role === "contractor") {
      await prisma.contractorProfile.upsert({
        where: { userId: resolvedUserId },
        update: {},
        create: { userId: resolvedUserId, companyName: userName || "My Company", trade: "General" },
      });
      console.log('[API/user/role] contractor profile ensured for', resolvedUserId);
    } else if (role === "homeowner") {
      await prisma.homeownerProfile.upsert({
        where: { userId: resolvedUserId },
        update: {},
        create: { userId: resolvedUserId, name: userName || "" },
      });
      console.log('[API/user/role] homeowner profile ensured for', resolvedUserId);
    }

    console.log('User role updated successfully:', role);

    // Send role-specific welcome email — only on first role selection (was null before)
    const isFirstRoleSet = !existingUser || existingUser.role === null;
    if (isFirstRoleSet) {
      try {
        const { sendWelcomeEmail } = await import('@/lib/email');
        await sendWelcomeEmail({ id: resolvedUserId, email, name: userName, role });
        console.log(`[USER/ROLE] Role-specific welcome email sent to ${email} (role=${role})`);
      } catch (welcomeErr) {
        console.error('[USER/ROLE] Failed to send welcome email (non-fatal):', welcomeErr);
      }
    }

    // Return success with a flag to reload the session
    return NextResponse.json({ success: true, role, refreshSession: true });
  } catch (error) {
    console.error("Error updating user role:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving your role. Please try again." },
      { status: 500 },
    );
  }
}
