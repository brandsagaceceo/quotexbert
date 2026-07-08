import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const caller = await prisma.user.findUnique({ where: { clerkUserId: userId }, select: { email: true } });
    if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { leadId, ...updateData } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: "Lead ID is required" },
        { status: 400 },
      );
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: updateData,
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { error: "Failed to update lead" },
      { status: 500 },
    );
  }
}
