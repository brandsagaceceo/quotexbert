import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
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
