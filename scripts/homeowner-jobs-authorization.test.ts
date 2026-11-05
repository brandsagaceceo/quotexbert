import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

type TestUser = {
  id: string;
  clerkUserId?: string | null;
  role: string | null;
  homeownerProfile: { userId: string } | null;
  contractorProfile: { userId: string } | null;
};

type TestJob = {
  id: string;
  title: string;
  description: string;
  budget: string | null;
  category: string;
  city: string | null;
  zipCode: string | null;
  status: string;
  isSeeded: boolean;
  maxContractors: number;
  homeownerId: string;
  createdAt: Date;
};

let authResult:
  | {
      user: {
        dbUserId: string;
        clerkUserId: string;
        email: string;
        name: string | null;
      };
    }
  | { error: string; status: 401 | 404 };
let linkedUsers: TestUser[] = [];
let storedJobs: TestJob[] = [];
let createData: Record<string, unknown> | null = null;
let createCount = 0;
let notificationCount = 0;
let emailCount = 0;
let requestedOwnerIds: string[] = [];

const createdJob: TestJob = {
  id: "created-job",
  title: "Kitchen renovation",
  description: "Update the kitchen",
  budget: "10000",
  category: "Kitchen",
  city: "Toronto",
  zipCode: "M5A 1A1",
  status: "open",
  isSeeded: false,
  maxContractors: 3,
  homeownerId: "homeowner-db",
  createdAt: new Date("2026-10-30T12:00:00.000Z"),
};

const prismaMock = {
  user: {
    findMany: async (args: {
      where: {
        OR: Array<{ id?: { in: string[] }; clerkUserId?: string }>;
      };
    }) => {
      const clerkId = args.where.OR.find(
        (condition) => condition.clerkUserId,
      )?.clerkUserId;
      return linkedUsers.filter((user) =>
        args.where.OR.some((condition) =>
          condition.id
            ? condition.id.in.includes(user.id)
            : user.clerkUserId === clerkId,
        ),
      );
    },
    findFirst: async () => ({
      id: "homeowner-db",
      email: "homeowner@example.test",
      name: "Homeowner",
    }),
  },
  lead: {
    findMany: async (args: { where: { homeownerId: { in: string[] } } }) => {
      requestedOwnerIds = args.where.homeownerId.in;
      return storedJobs.filter((job) =>
        requestedOwnerIds.includes(job.homeownerId),
      );
    },
    create: async (args: { data: Record<string, unknown> }) => {
      createCount += 1;
      createData = args.data;
      return { ...createdJob, homeownerId: String(args.data.homeownerId) };
    },
  },
};

const ModuleConstructor = require("node:module").Module as new (
  id: string,
) => NodeModule;

function installModuleMock(
  specifier: string,
  exports: Record<string, unknown>,
) {
  const filename = require.resolve(specifier);
  const mockedModule = new ModuleConstructor(filename);
  mockedModule.filename = filename;
  mockedModule.loaded = true;
  mockedModule.exports = exports;
  require.cache[filename] = mockedModule;
}

installModuleMock("@/lib/server-auth", {
  resolveAuthUser: async () => authResult,
});
installModuleMock("@/lib/prisma", { prisma: prismaMock });
installModuleMock("@/lib/notifications", {
  NotificationService: {
    notifyAllContractors: async () => {
      notificationCount += 1;
    },
  },
});
installModuleMock("@/lib/email", {
  sendJobPostedEmail: async () => {
    emailCount += 1;
    return { success: true };
  },
});

const { GET, POST } = require("../app/api/homeowner/jobs/route") as {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
};

function setHomeownerIdentity() {
  authResult = {
    user: {
      dbUserId: "homeowner-db",
      clerkUserId: "clerk-homeowner",
      email: "homeowner@example.test",
      name: "Homeowner",
    },
  };
  linkedUsers = [
    {
      id: "homeowner-db",
      role: "homeowner",
      homeownerProfile: { userId: "homeowner-db" },
      contractorProfile: null,
    },
    {
      id: "clerk-homeowner",
      role: null,
      homeownerProfile: { userId: "clerk-homeowner" },
      contractorProfile: null,
    },
    {
      id: "legacy-homeowner-db",
      clerkUserId: "clerk-homeowner",
      role: null,
      homeownerProfile: { userId: "legacy-homeowner-db" },
      contractorProfile: null,
    },
    {
      id: "other-homeowner-db",
      role: "homeowner",
      homeownerProfile: { userId: "other-homeowner-db" },
      contractorProfile: null,
    },
  ];
}

function postRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/homeowner/jobs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function main() {
  authResult = { error: "Authentication required", status: 401 };
  createCount = 0;
  const anonymousGet = await GET(
    new Request("http://localhost/api/homeowner/jobs"),
  );
  const anonymousPost = await POST(
    postRequest({
      title: "Kitchen renovation",
      description: "Update the kitchen",
      category: "Kitchen",
    }),
  );
  assert.equal(anonymousGet.status, 401, "anonymous GET is denied");
  assert.equal(anonymousPost.status, 401, "anonymous POST is denied");
  assert.equal(createCount, 0, "anonymous requests cannot create jobs");

  authResult = {
    user: {
      dbUserId: "contractor-db",
      clerkUserId: "clerk-contractor",
      email: "contractor@example.test",
      name: "Contractor",
    },
  };
  linkedUsers = [
    {
      id: "contractor-db",
      role: "contractor",
      homeownerProfile: null,
      contractorProfile: { userId: "contractor-db" },
    },
  ];
  const contractorGet = await GET(
    new Request("http://localhost/api/homeowner/jobs"),
  );
  const contractorPost = await POST(
    postRequest({
      title: "Kitchen renovation",
      description: "Update the kitchen",
      category: "Kitchen",
      homeownerId: "homeowner-db",
    }),
  );
  assert.equal(contractorGet.status, 403, "contractor GET is denied");
  assert.equal(contractorPost.status, 403, "contractor POST is denied");
  assert.equal(createCount, 0, "contractors cannot create homeowner jobs");

  setHomeownerIdentity();
  storedJobs = [
    { ...createdJob, id: "own-db-job", homeownerId: "homeowner-db" },
    { ...createdJob, id: "own-clerk-job", homeownerId: "clerk-homeowner" },
    { ...createdJob, id: "own-legacy-job", homeownerId: "legacy-homeowner-db" },
    { ...createdJob, id: "other-job", homeownerId: "other-homeowner-db" },
  ];
  const homeownerGet = await GET(
    new Request(
      "http://localhost/api/homeowner/jobs?homeownerId=other-homeowner-db",
    ),
  );
  const getBody = (await homeownerGet.json()) as TestJob[];
  assert.equal(homeownerGet.status, 200, "valid homeowner GET succeeds");
  assert.deepEqual(
    getBody.map((job) => job.id),
    ["own-db-job", "own-clerk-job", "own-legacy-job"],
    "GET returns only jobs linked to the authenticated homeowner",
  );
  assert.ok(requestedOwnerIds.includes("homeowner-db"));
  assert.ok(requestedOwnerIds.includes("clerk-homeowner"));
  assert.ok(requestedOwnerIds.includes("legacy-homeowner-db"));
  assert.ok(!requestedOwnerIds.includes("other-homeowner-db"));

  createCount = 0;
  notificationCount = 0;
  emailCount = 0;
  const homeownerPost = await POST(
    postRequest({
      title: "Kitchen renovation",
      description: "Update the kitchen",
      budget: 10000,
      category: "Kitchen",
      city: "Toronto",
      zipCode: "M5A 1A1",
      homeownerId: "other-homeowner-db",
    }),
  );
  const postBody = (await homeownerPost.json()) as TestJob;
  assert.equal(homeownerPost.status, 200, "valid homeowner POST succeeds");
  assert.equal(
    postBody.id,
    "created-job",
    "POST preserves the existing job response",
  );
  assert.equal(
    createData?.homeownerId,
    "homeowner-db",
    "POST ignores another homeowner's body ID",
  );
  assert.equal(
    notificationCount,
    1,
    "successful job creation notifies contractors",
  );
  assert.equal(
    emailCount,
    1,
    "successful job creation sends the homeowner confirmation email",
  );

  const homeownerPostWithoutId = await POST(
    postRequest({
      title: "Bathroom renovation",
      description: "Update the bathroom",
      category: "Bathroom",
    }),
  );
  assert.equal(
    homeownerPostWithoutId.status,
    200,
    "homeowner POST does not require a client-supplied owner ID",
  );
  assert.equal(
    createData?.homeownerId,
    "homeowner-db",
    "POST uses the authenticated owner when body ID is omitted",
  );
  assert.equal(
    notificationCount,
    2,
    "second successful job still notifies contractors",
  );
  assert.equal(
    emailCount,
    2,
    "second successful job still sends confirmation email",
  );

  linkedUsers = [
    {
      id: "legacy-homeowner-db",
      clerkUserId: "clerk-homeowner",
      role: null,
      homeownerProfile: { userId: "legacy-homeowner-db" },
      contractorProfile: null,
    },
  ];
  const legacyHomeownerGet = await GET(
    new Request("http://localhost/api/homeowner/jobs"),
  );
  assert.equal(
    legacyHomeownerGet.status,
    200,
    "legacy homeowner profile without a role remains authorized",
  );

  const dashboardPath = path.join(
    process.cwd(),
    "app",
    "homeowner",
    "dashboard",
    "page.tsx",
  );
  const dashboardSource = fs.readFileSync(dashboardPath, "utf8");
  assert.match(
    dashboardSource,
    /const homeownerJobs = Array\.isArray\(jobsData\) \? jobsData : \[\]/,
  );
  assert.match(dashboardSource, /postedJobs:\s*homeownerJobs\.length/);
  assert.match(dashboardSource, /activeProjects:\s*homeownerJobs\.filter/);
  assert.doesNotMatch(dashboardSource, /jobsData\.jobs/);

  console.log("homeowner jobs authorization tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
