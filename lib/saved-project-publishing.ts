import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export class SavedProjectPublishConflictError extends Error {
  constructor(message = "This project has already been published or updated.") {
    super(message);
    this.name = "SavedProjectPublishConflictError";
  }
}

export class SavedProjectPublishValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SavedProjectPublishValidationError";
  }
}

type PublishingClient = Pick<typeof prisma, "$transaction">;

export async function publishSavedProject(
  projectId: string,
  homeownerIds: string[],
  createLeadData: (
    project: Prisma.SavedProjectGetPayload<{
      include: {
        aiEstimate: { select: { homeownerId: true } };
        postedAsLead: true;
      };
    }>,
  ) => Prisma.LeadUncheckedCreateInput,
  client: PublishingClient = prisma,
) {
  try {
    return await client.$transaction(async (tx) => {
      const project = await tx.savedProject.findFirst({
        where: { id: projectId, homeownerId: { in: homeownerIds } },
        include: {
          aiEstimate: { select: { homeownerId: true } },
          postedAsLead: true,
        },
      });

      if (!project) {
        const exists = await tx.savedProject.findUnique({
          where: { id: projectId },
          select: { id: true },
        });
        return { kind: exists ? "forbidden" : "not_found" } as const;
      }

      if (project.postedAsLeadId && project.postedAsLead) {
        return {
          kind: "already_published",
          lead: project.postedAsLead,
          savedProject: project,
        } as const;
      }
      if (project.status === "posted" || project.postedAsLeadId) {
        throw new SavedProjectPublishConflictError();
      }
      if (
        project.aiEstimateId &&
        (!project.aiEstimate ||
          !project.aiEstimate.homeownerId ||
          !homeownerIds.includes(project.aiEstimate.homeownerId))
      ) {
        throw new SavedProjectPublishConflictError(
          "The linked estimate does not belong to this homeowner.",
        );
      }

      const lead = await tx.lead.create({ data: createLeadData(project) });
      const claimed = await tx.savedProject.updateMany({
        where: {
          id: project.id,
          homeownerId: { in: homeownerIds },
          status: project.status,
          postedAsLeadId: null,
        },
        data: { status: "posted", postedAsLeadId: lead.id },
      });

      if (claimed.count !== 1) {
        throw new SavedProjectPublishConflictError();
      }

      if (project.aiEstimateId) {
        await tx.aIEstimate.updateMany({
          where: {
            id: project.aiEstimateId,
            homeownerId: { in: homeownerIds },
          },
          data: { status: "posted", isPublic: true, leadId: lead.id },
        });
      }

      const savedProject = await tx.savedProject.findUniqueOrThrow({
        where: { id: project.id },
        include: {
          postedAsLead: true,
          aiEstimate: { include: { items: true } },
        },
      });

      return { kind: "published", lead, savedProject } as const;
    });
  } catch (error) {
    if (error instanceof SavedProjectPublishConflictError) {
      return { kind: "conflict", error: error.message } as const;
    }
    throw error;
  }
}
