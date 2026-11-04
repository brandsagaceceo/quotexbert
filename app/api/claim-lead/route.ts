import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error: "Per-lead payment claims are no longer supported. Use the category subscription-based jobs workflow.",
      redirectTo: "/contractor/jobs",
    },
    { status: 410 },
  );
}
