import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

async function requireAdmin(req?: NextRequest) {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { email: true },
  });
  if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) return null;
  return user;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  try {
    const result = await prisma.user.deleteMany({});
    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

  try {
    const result = await prisma.user.deleteMany({});
    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
