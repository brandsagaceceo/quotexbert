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
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      databaseConnected: false,
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
