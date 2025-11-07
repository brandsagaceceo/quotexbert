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
      databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      databaseConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      databaseUrl: process.env.DATABASE_URL ? 'Set (length: ' + process.env.DATABASE_URL.length + ')' : 'NOT SET',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
