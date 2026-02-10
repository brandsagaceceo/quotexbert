import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, email: true }
    });

    if (!user) {
      return NextResponse.json({ userId: null, message: "User not found" });
    }

    return NextResponse.json({ userId: user.id, email: user.email });

  } catch (error) {
    console.error("[ADMIN] Error looking up user:", error);
    return NextResponse.json(
      { error: "Failed to look up user" },
      { status: 500 }
    );
  }
}
