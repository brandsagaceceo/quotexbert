import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if conversations exist
    const conversations = await prisma.conversation.findMany({
      include: {
        job: true,
        homeowner: true,
        contractor: true,
        messages: true
      }
    });

    return NextResponse.json({
      count: conversations.length,
      conversations
    });

  } catch (error) {
    console.error("Error checking conversations:", error);
    return NextResponse.json(
      { error: "Failed to check conversations", details: error },
      { status: 500 }
    );
  }
}