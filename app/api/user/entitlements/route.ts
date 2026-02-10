import { NextRequest, NextResponse } from "next/server";
import { getUserEntitlements } from "@/lib/entitlements";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const entitlements = await getUserEntitlements(userId);

    if (!entitlements) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(entitlements);

  } catch (error) {
    console.error("[ENTITLEMENTS API] Error fetching entitlements:", error);
    return NextResponse.json(
      { error: "Failed to fetch entitlements" },
      { status: 500 }
    );
  }
}
