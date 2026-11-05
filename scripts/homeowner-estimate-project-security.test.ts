import assert from "node:assert/strict";
import fs from "node:fs";
import type { Prisma } from "@prisma/client";
import { resolveHomeownerIdentity } from "../lib/homeowner-auth";
import { publishSavedProject } from "../lib/saved-project-publishing";
import { prisma } from "../lib/prisma";

type MockProject = {
  id: string;
  homeownerId: string;
  title: string;
  description: string;
  category: string;
  status: string;
  postedAsLeadId: string | null;
  postedAsLead: { id: string } | null;
  aiEstimateId: string | null;
  aiEstimate: { homeownerId: string | null } | null;
};

function createPublishingMock(ownerId: string, estimateOwnerId = ownerId) {
  const project: MockProject = {
    id: "project-1",
    homeownerId: ownerId,
    title: "Kitchen renovation",
    description: "Update the kitchen",
    category: "kitchen",
    status: "draft",
    postedAsLeadId: null,
    postedAsLead: null,
    aiEstimateId: "estimate-1",
    aiEstimate: { homeownerId: estimateOwnerId },
  };
  const leads: Array<{ id: string }> = [];
  let nextLeadId = 1;
  let transactionTail: Promise<void> = Promise.resolve();
  let failClaim = false;

  const tx = {
    savedProject: {
      findFirst: async ({
        where,
      }: {
        where: { id: string; homeownerId: { in: string[] } };
      }) =>
        where.id === project.id &&
        where.homeownerId.in.includes(project.homeownerId)
          ? project
          : null,
      findUnique: async () => (project ? { id: project.id } : null),
      updateMany: async ({
        where,
      }: {
        where: {
          id: string;
          homeownerId: { in: string[] };
          status: string;
          postedAsLeadId: null;
        };
      }) => {
        if (
          failClaim ||
          where.id !== project.id ||
          !where.homeownerId.in.includes(project.homeownerId) ||
          where.status !== project.status ||
          project.postedAsLeadId !== null
        ) {
          return { count: 0 };
        }
        project.status = "posted";
        project.postedAsLeadId = leads[leads.length - 1]?.id ?? null;
        project.postedAsLead = project.postedAsLeadId
          ? { id: project.postedAsLeadId }
          : null;
        return { count: project.postedAsLeadId ? 1 : 0 };
      },
      findUniqueOrThrow: async () => project,
    },
    lead: {
      create: async () => {
        const lead = { id: `lead-${nextLeadId++}` };
        leads.push(lead);
        return lead;
      },
    },
    aIEstimate: {
      updateMany: async () => ({ count: 1 }),
    },
  };

  const client = {
    $transaction: async <T>(
      callback: (transaction: typeof tx) => Promise<T>,
    ) => {
      const previous = transactionTail;
      let release!: () => void;
      transactionTail = new Promise<void>((resolve) => {
        release = resolve;
      });
      await previous;

      const snapshot = {
        project: { ...project },
        leads: [...leads],
        nextLeadId,
      };
      try {
        return await callback(tx);
      } catch (error) {
        Object.assign(project, snapshot.project);
        leads.splice(0, leads.length, ...snapshot.leads);
        nextLeadId = snapshot.nextLeadId;
        throw error;
      } finally {
        release();
      }
    },
  } as unknown as Pick<typeof prisma, "$transaction">;

  return {
    client,
    leads,
    project,
    failClaim: (value: boolean) => {
      failClaim = value;
    },
  };
}

const leadData = () =>
  ({
    title: "Kitchen renovation",
    description: "Update the kitchen",
    category: "kitchen",
    homeownerId: "homeowner-1",
  }) as Prisma.LeadUncheckedCreateInput;

async function main() {
  let databaseLookups = 0;
  const anonymous = await resolveHomeownerIdentity({
    resolveAuthUser: async () => ({
      error: "Authentication required",
      status: 401,
    }),
    user: {
      findMany: async () => {
        databaseLookups++;
        return [];
      },
    } as unknown as Pick<typeof prisma.user, "findMany">,
  });
  assert.equal(anonymous.success, false);
  assert.equal(
    databaseLookups,
    0,
    "anonymous access must not resolve account records",
  );

  const mappedIdentity = await resolveHomeownerIdentity({
    resolveAuthUser: async () => ({
      user: {
        dbUserId: "database-homeowner",
        clerkUserId: "clerk-homeowner",
        email: "owner@example.test",
        name: "Homeowner",
      },
    }),
    user: {
      findMany: async () => [
        {
          id: "database-homeowner",
          role: null,
          homeownerProfile: { userId: "database-homeowner" },
          contractorProfile: null,
        },
        {
          id: "clerk-homeowner",
          role: null,
          homeownerProfile: { userId: "clerk-homeowner" },
          contractorProfile: null,
        },
      ],
    } as unknown as Pick<typeof prisma.user, "findMany">,
  });
  assert.equal(mappedIdentity.success, true);
  assert.deepEqual(
    new Set(mappedIdentity.homeownerIds),
    new Set(["database-homeowner", "clerk-homeowner"]),
    "legacy Clerk/database identities must both be recognized",
  );

  const contractorIdentity = await resolveHomeownerIdentity({
    resolveAuthUser: async () => ({
      user: {
        dbUserId: "contractor-1",
        clerkUserId: "clerk-contractor",
        email: "contractor@example.test",
        name: "Contractor",
      },
    }),
    user: {
      findMany: async () => [
        {
          id: "contractor-1",
          role: "contractor",
          homeownerProfile: null,
          contractorProfile: { userId: "contractor-1" },
        },
      ],
    } as unknown as Pick<typeof prisma.user, "findMany">,
  });
  assert.equal(
    contractorIdentity.success,
    false,
    "contractors cannot use homeowner APIs",
  );

  const foreignProject = createPublishingMock("homeowner-2");
  const unauthorized = await publishSavedProject(
    "project-1",
    ["homeowner-1"],
    leadData,
    foreignProject.client,
  );
  assert.equal(unauthorized.kind, "forbidden");
  assert.equal(
    foreignProject.leads.length,
    0,
    "foreign projects must not create leads",
  );

  const foreignEstimate = createPublishingMock("homeowner-1", "homeowner-2");
  const foreignEstimateResult = await publishSavedProject(
    "project-1",
    ["homeowner-1"],
    leadData,
    foreignEstimate.client,
  );
  assert.equal(foreignEstimateResult.kind, "conflict");
  assert.equal(
    foreignEstimate.leads.length,
    0,
    "foreign estimates must not be published",
  );

  const validProject = createPublishingMock("homeowner-1");
  const published = await publishSavedProject(
    "project-1",
    ["homeowner-1"],
    leadData,
    validProject.client,
  );
  assert.equal(published.kind, "published");
  assert.equal(validProject.leads.length, 1);
  assert.equal(validProject.project.status, "posted");

  const retry = await publishSavedProject(
    "project-1",
    ["homeowner-1"],
    leadData,
    validProject.client,
  );
  assert.equal(retry.kind, "already_published");
  assert.equal(
    validProject.leads.length,
    1,
    "retries must not create duplicate leads",
  );

  const concurrentProject = createPublishingMock("homeowner-1");
  const concurrent = await Promise.all([
    publishSavedProject(
      "project-1",
      ["homeowner-1"],
      leadData,
      concurrentProject.client,
    ),
    publishSavedProject(
      "project-1",
      ["homeowner-1"],
      leadData,
      concurrentProject.client,
    ),
  ]);
  assert.equal(
    concurrentProject.leads.length,
    1,
    "concurrent requests must create one lead",
  );
  assert.deepEqual(concurrent.map((result) => result.kind).sort(), [
    "already_published",
    "published",
  ]);

  const failedClaimProject = createPublishingMock("homeowner-1");
  failedClaimProject.failClaim(true);
  const failedClaim = await publishSavedProject(
    "project-1",
    ["homeowner-1"],
    leadData,
    failedClaimProject.client,
  );
  assert.equal(failedClaim.kind, "conflict");
  assert.equal(
    failedClaimProject.leads.length,
    0,
    "a failed conditional claim must roll back lead creation",
  );

  const saveRoute = fs.readFileSync(
    "app/api/ai-estimates/save/route.ts",
    "utf8",
  );
  const estimateItemRoute = fs.readFileSync(
    "app/api/ai-estimates/[id]/route.ts",
    "utf8",
  );
  const projectRoute = fs.readFileSync(
    "app/api/saved-projects/route.ts",
    "utf8",
  );
  const projectDetailRoute = fs.readFileSync(
    "app/api/saved-projects/[id]/route.ts",
    "utf8",
  );
  const estimateRoute = fs.readFileSync(
    "app/api/ai-estimates/route.ts",
    "utf8",
  );
  const legacyEstimateRoute = fs.readFileSync(
    "app/api/estimates/route.ts",
    "utf8",
  );
  const estimatePublishRoute = fs.readFileSync(
    "app/api/ai-estimates/[id]/post/route.ts",
    "utf8",
  );
  const publishRoute = fs.readFileSync(
    "app/api/saved-projects/[id]/publish/route.ts",
    "utf8",
  );
  const boardRoute = fs.readFileSync(
    "app/api/saved-projects/post-to-board/route.ts",
    "utf8",
  );

  assert.match(saveRoute, /homeownerId:\s*identity\.user\.dbUserId/);
  assert.doesNotMatch(saveRoute, /homeownerId:\s*body\.homeownerId/);
  assert.match(
    estimateRoute,
    /homeownerId:\s*\{\s*in:\s*identity\.homeownerIds\s*\}/,
  );
  assert.match(estimateItemRoute, /resolveHomeownerIdentity\(\)/);
  assert.match(
    estimateItemRoute,
    /homeownerId:\s*\{\s*in:\s*identity\.homeownerIds\s*\}/,
  );
  assert.match(
    legacyEstimateRoute,
    /homeownerId:\s*\{\s*in:\s*identity\.homeownerIds\s*\}/,
  );
  assert.match(
    legacyEstimateRoute,
    /deleteMany\(\{[\s\S]*homeownerId:\s*\{\s*in:\s*identity\.homeownerIds\s*\}/,
  );
  assert.match(
    projectRoute,
    /homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(
    projectRoute,
    /aiEstimateId[\s\S]*homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(
    projectRoute,
    /deleteMany\(\{[\s\S]*homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(
    projectRoute,
    /updateMany\(\{\s*where:\s*\{\s*id,\s*homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(
    projectDetailRoute,
    /resolved\.homeownerIds\.includes\(savedProject\.homeownerId\)/,
  );
  assert.match(
    projectDetailRoute,
    /homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(
    projectDetailRoute,
    /updateMany\(\{\s*where:\s*\{\s*id:\s*projectId,\s*homeownerId:\s*\{\s*in:\s*resolved\.homeownerIds\s*\}/,
  );
  assert.match(publishRoute, /publishSavedProject\(/);
  assert.match(boardRoute, /publishSavedProject\(/);
  assert.match(
    estimatePublishRoute,
    /homeownerId:\s*\{\s*in:\s*identity\.homeownerIds\s*\}/,
  );
  assert.match(estimatePublishRoute, /leadId:\s*null/);
  assert.match(publishRoute, /alreadyPublished:\s*true/);
  assert.match(boardRoute, /savedProject,\s*message:/);
  assert.ok(
    publishRoute.indexOf('if (result.kind === "already_published")') <
      publishRoute.indexOf("NotificationService.notifyAllContractors"),
    "publishing retries must not repeat contractor notifications",
  );
  assert.ok(
    boardRoute.indexOf('if (result.kind === "already_published")') <
      boardRoute.indexOf("NotificationService.notifyAllContractors"),
    "job-board retries must not repeat contractor notifications",
  );
  assert.match(
    projectRoute,
    /return NextResponse\.json\(\{ success: true, savedProjects \}\)/,
  );
  assert.match(
    estimateRoute,
    /return NextResponse\.json\(\{\s*success: true,\s*estimates,/,
  );

  console.log("homeowner-estimate-project-security tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
