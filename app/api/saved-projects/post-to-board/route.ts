import { NextRequest, NextResponse } from "next/server";
import { resolveHomeownerIdentity } from "@/lib/homeowner-auth";
import {
  approvedProjectPhotos,
  parseApprovedPhotoSelection,
  privatePhotosBelongTo,
} from "@/lib/private-photo-records";
import {
  publishSavedProject,
  SavedProjectPublishConflictError,
  SavedProjectPublishValidationError,
} from "@/lib/saved-project-publishing";
import { NotificationService } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const identity = await resolveHomeownerIdentity();
    if (!identity.success) {
      return NextResponse.json(
        { error: identity.error },
        { status: identity.status },
      );
    }

    const body = await request.json();
    const { savedProjectId } = body;
    if (typeof savedProjectId !== "string" || !savedProjectId) {
      return NextResponse.json(
        { error: "savedProjectId is required" },
        { status: 400 },
      );
    }
    const approvedPhotos = parseApprovedPhotoSelection(body);
    if (
      approvedPhotos === null ||
      !privatePhotosBelongTo(approvedPhotos, identity.user.dbUserId)
    ) {
      return NextResponse.json(
        { error: "Invalid or unauthorized photo selection" },
        { status: 400 },
      );
    }

    const result = await publishSavedProject(
      savedProjectId,
      identity.homeownerIds,
      (project) => {
        const photos = approvedProjectPhotos(project.photos, approvedPhotos);
        if (!photos) {
          throw new SavedProjectPublishValidationError(
            "Only photos attached to this project can be approved for publication.",
          );
        }
        return {
          title: project.title,
          description: project.description,
          category: project.category,
          budget: project.budget || "$5,000 - $10,000",
          zipCode: project.location || "M5A 1A1",
          photos: JSON.stringify(photos),
          homeownerId: project.homeownerId,
          status: "open",
          published: true,
          claimed: false,
          maxContractors: 3,
        };
      },
    );

    if (result.kind === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (result.kind === "not_found") {
      return NextResponse.json(
        { error: "Saved project not found" },
        { status: 404 },
      );
    }
    if (result.kind === "conflict") {
      return NextResponse.json({ error: result.error }, { status: 409 });
    }

    if (result.kind === "already_published") {
      if (!result.lead || !result.savedProject) {
        return NextResponse.json(
          { error: "Published project is missing its job-board record" },
          { status: 409 },
        );
      }

      return NextResponse.json({
        success: true,
        lead: result.lead,
        savedProject: result.savedProject,
        message: "Project posted to job board successfully",
        alreadyPublished: true,
      });
    }

    if (!result.lead || !result.savedProject) {
      return NextResponse.json(
        { error: "Published project is missing its job-board record" },
        { status: 409 },
      );
    }

    const { lead, savedProject } = result;
    NotificationService.notifyAllContractors({
      leadId: lead.id,
      title: lead.title,
      description: lead.description,
      category: lead.category,
      city: savedProject.location?.split(",")[0]?.trim() || undefined,
      province: savedProject.location?.split(",")[1]?.trim() || undefined,
      budget: null,
      createdAt: lead.createdAt.toISOString(),
      isSeeded: lead.isSeeded,
    }).catch((err) =>
      console.error("[post-to-board] notifyAllContractors error:", err),
    );

    return NextResponse.json({
      success: true,
      lead,
      savedProject,
      message: "Project posted to job board successfully",
    });
  } catch (error) {
    if (error instanceof SavedProjectPublishConflictError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    if (error instanceof SavedProjectPublishValidationError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    console.error("[SavedProjects Post to Board] Error:", error);
    return NextResponse.json(
      { error: "Failed to post project to job board" },
      { status: 500 },
    );
  }
}
