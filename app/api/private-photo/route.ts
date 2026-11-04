import { NextRequest, NextResponse } from "next/server";
import { getVisibleLeads } from "@/lib/subscription-access";
import {
  getPrivateImage,
  isPrivatePhotoPathname,
  privatePhotoUrl,
} from "@/lib/upload";
import { prisma } from "@/lib/prisma";
import { resolveAuthUser } from "@/lib/server-auth";
import { privatePhotoAccessAllowed } from "@/lib/private-photo-records";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authResult = await resolveAuthUser();
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status },
      );
    }

    const pathname = request.nextUrl.searchParams.get("pathname");
    if (!pathname) {
      return NextResponse.json({ error: "Photo path required" }, { status: 400 });
    }
    if (!isPrivatePhotoPathname(pathname)) {
      return NextResponse.json({ error: "Invalid photo path" }, { status: 400 });
    }

    const photoUrl = privatePhotoUrl(pathname);
    const ownerId = pathname.split("/")[1];
    if (!ownerId) {
      return NextResponse.json({ error: "Invalid photo path" }, { status: 400 });
    }
    const isOwner = ownerId === authResult.user.dbUserId;
    let hasPublishedLeadAccess = false;
    let isActiveContractor = false;

    if (!isOwner) {
      const [actor, lead] = await Promise.all([
        prisma.user.findUnique({
          where: { id: authResult.user.dbUserId },
          select: { role: true, isActive: true },
        }),
        prisma.lead.findFirst({
          where: {
            homeownerId: ownerId,
            published: true,
            photos: { contains: photoUrl },
          },
          select: { id: true },
        }),
      ]);
      isActiveContractor =
        actor?.role === "contractor" && actor.isActive;

      if (isActiveContractor && lead) {
        const visibleLeads = await getVisibleLeads(authResult.user.dbUserId);
        hasPublishedLeadAccess = visibleLeads.some(
          (visibleLead) => visibleLead.id === lead.id && visibleLead.hasAccess,
        );
      }
    }

    if (
      !privatePhotoAccessAllowed(
        isOwner,
        isActiveContractor,
        hasPublishedLeadAccess,
      )
    ) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    const result = await getPrivateImage(pathname);
    if (!result) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }
    const contentType = result.blob.contentType;
    if (typeof contentType !== "string" || !contentType.startsWith("image/")) {
      return NextResponse.json({ error: "Unsupported photo type" }, { status: 415 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("[PrivatePhoto GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 },
    );
  }
}
