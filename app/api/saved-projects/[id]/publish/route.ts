import { NextRequest, NextResponse } from "next/server";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import {
  publishSavedProject,
  SavedProjectPublishConflictError,
  SavedProjectPublishValidationError,
} from "@/lib/saved-project-publishing";
import { NotificationService } from "@/lib/notifications";
import { sendJobPostedEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { error: identity.error },
        { status: identity.status },
      );
    }

    const { id: projectId } = await params;
    const result = await publishSavedProject(
      projectId,
      identity.homeownerIds,
      (project) => {
        const city =
          project.city?.trim() || project.location?.split(",")[0]?.trim() || "";
        const province =
          project.province?.trim() ||
          project.location?.split(",")[1]?.trim() ||
          "";

        if (!city) {
          throw new SavedProjectPublishValidationError(
            "City is required to post on the job board. Please edit and add your city first.",
          );
        }
        if (!province) {
          throw new SavedProjectPublishValidationError(
            "Province is required to post on the job board. Please edit and add your province first.",
          );
        }

        return {
          homeownerId: project.homeownerId,
          title: project.title,
          description: project.description,
          category: project.category,
          city,
          province,
          zipCode: project.zipCode || null,
          budget: project.budget || null,
          photos: project.photos || "[]",
          status: "open",
          published: true,
        };
      },
    );

    if (result.kind === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (result.kind === "not_found") {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    if (result.kind === "conflict") {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    if (result.kind === "already_published") {
      if (!result.lead) {
        return NextResponse.json(
          { error: "Published project is missing its job-board record" },
          { status: 409 },
        );
      }
      return NextResponse.json({
        success: true,
        lead: result.lead,
        alreadyPublished: true,
      });
    }

    if (!result.lead) {
      return NextResponse.json(
        { error: "Published project is missing its job-board record" },
        { status: 409 },
      );
    }
    const { lead } = result;

    NotificationService.notifyAllContractors({
      leadId: lead.id,
      title: lead.title,
      description: lead.description,
      category: lead.category,
      city: lead.city || undefined,
      province: lead.province || undefined,
      budget: null,
    }).catch((err) =>
      console.error("[Publish] notifyAllContractors error:", err),
    );

    sendJobPostedEmail({
      homeowner: {
        id: identity.user.dbUserId,
        email: identity.user.email,
        name: identity.user.name,
      },
      job: {
        id: lead.id,
        title: lead.title,
        category: lead.category,
        city: lead.city || "",
        province: lead.province || "",
        ...(lead.zipCode ? { zipCode: lead.zipCode } : {}),
      },
    }).catch((err) =>
      console.error("[Publish] sendJobPostedEmail error:", err),
    );

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    if (error instanceof SavedProjectPublishConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof SavedProjectPublishValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("[Publish SavedProject] Error:", error);
    return NextResponse.json(
      { error: "Failed to publish project" },
      { status: 500 },
    );
  }
}
