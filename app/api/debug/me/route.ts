import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();
    
    if (!userId) {
      return NextResponse.json({ 
        error: "Not authenticated",
        userId: null,
        sessionRole: null,
        dbUser: null
      });
    }

    // Get role from session
    const sessionRole = (sessionClaims?.publicMetadata as any)?.role;

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    });

    return NextResponse.json({ 
      userId,
      sessionRole,
      dbUser,
      sessionClaims: sessionClaims?.publicMetadata
    });
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
