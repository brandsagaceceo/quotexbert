import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

type MockUser = {
  id: string;
  email: string;
  role: string | null;
  clerkUserId?: string | null;
};

let sessionUserId: string | null = "clerk-homeowner";
let clerkUser = {
  emailAddresses: [{ emailAddress: "homeowner@example.test" }],
  firstName: "Home",
  lastName: "Owner",
  publicMetadata: {} as Record<string, unknown>,
};
let users: MockUser[] = [];
let createCount = 0;
let userUpdateCount = 0;
let metadataUpdateCount = 0;
let homeownerProfileCount = 0;
let contractorProfileCount = 0;
let createdUserData: Record<string, unknown> | null = null;

const prismaMock = {
  user: {
    findFirst: async (args: {
      where: { OR: Array<{ id?: string; clerkUserId?: string }> };
    }) =>
      users.find((user) =>
        args.where.OR.some(
          (condition) =>
            (condition.id && user.id === condition.id) ||
            (condition.clerkUserId &&
              user.clerkUserId === condition.clerkUserId),
        ),
      ) ?? null,
    findUnique: async (args: { where: { email?: string } }) =>
      users.find((user) => user.email === args.where.email) ?? null,
    update: async (args: {
      where: { email: string };
      data: Partial<MockUser>;
    }) => {
      userUpdateCount += 1;
      const user = users.find((entry) => entry.email === args.where.email);
      if (!user) throw new Error("User not found");
      Object.assign(user, args.data);
      return user;
    },
    create: async (args: { data: Record<string, unknown> }) => {
      createCount += 1;
      createdUserData = args.data;
      const user = args.data as unknown as MockUser;
      users.push(user);
      return user;
    },
  },
  contractorProfile: {
    upsert: async () => {
      contractorProfileCount += 1;
    },
    create: async () => {
      contractorProfileCount += 1;
    },
  },
  homeownerProfile: {
    upsert: async () => {
      homeownerProfileCount += 1;
    },
    create: async () => {
      homeownerProfileCount += 1;
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

installModuleMock("@clerk/nextjs/server", {
  auth: async () => ({ userId: sessionUserId }),
  clerkClient: async () => ({
    users: {
      getUser: async () => clerkUser,
      updateUserMetadata: async (
        _userId: string,
        data: { publicMetadata: Record<string, unknown> },
      ) => {
        metadataUpdateCount += 1;
        clerkUser.publicMetadata = data.publicMetadata;
      },
    },
  }),
});
installModuleMock("@/lib/prisma", { prisma: prismaMock });
const roleRoute = require("../app/api/user/role/route") as {
  POST: (request: Request) => Promise<Response>;
};
const usersRoute = require("../app/api/users/route") as {
  POST: (request: Request) => Promise<Response>;
};

function postRequest(path: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function resetState(options?: {
  role?: string | null;
  metadataRole?: string;
  email?: string;
}) {
  sessionUserId = "clerk-homeowner";
  clerkUser = {
    emailAddresses: [
      { emailAddress: options?.email || "homeowner@example.test" },
    ],
    firstName: "Home",
    lastName: "Owner",
    publicMetadata: options?.metadataRole ? { role: options.metadataRole } : {},
  };
  users =
    options?.role === null || options?.role === undefined
      ? []
      : [
          {
            id: "clerk-homeowner",
            clerkUserId: "clerk-homeowner",
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            role: options.role,
          },
        ];
  createCount = 0;
  userUpdateCount = 0;
  metadataUpdateCount = 0;
  homeownerProfileCount = 0;
  contractorProfileCount = 0;
  createdUserData = null;
}

async function main() {
  const roleRouteSource = fs.readFileSync(
    path.join(process.cwd(), "app", "api", "user", "role", "route.ts"),
    "utf8",
  );
  assert.match(roleRouteSource, /sendWelcomeEmail/);
  assert.match(roleRouteSource, /sendContractorOnboardingOfferEmail/);

  resetState({ role: "homeowner" });
  sessionUserId = null;
  const anonymousResponse = await roleRoute.POST(
    postRequest("/api/user/role", { role: "homeowner" }),
  );
  assert.equal(
    anonymousResponse.status,
    401,
    "anonymous role changes are denied",
  );
  assert.equal(metadataUpdateCount, 0);

  resetState({ role: "homeowner" });
  const homeownerResponse = await roleRoute.POST(
    postRequest("/api/user/role", { role: "homeowner" }),
  );
  assert.equal(homeownerResponse.status, 200, "homeowner onboarding succeeds");
  assert.deepEqual(await homeownerResponse.json(), {
    success: true,
    role: "homeowner",
    refreshSession: true,
  });
  assert.equal(clerkUser.publicMetadata.role, "homeowner");
  assert.equal(users[0]?.role, "homeowner");
  assert.equal(homeownerProfileCount, 1, "homeowner profile is created");

  resetState({ role: "contractor" });
  const contractorResponse = await roleRoute.POST(
    postRequest("/api/user/role", { role: "contractor" }),
  );
  assert.equal(
    contractorResponse.status,
    200,
    "contractor onboarding succeeds",
  );
  assert.equal(clerkUser.publicMetadata.role, "contractor");
  assert.equal(users[0]?.role, "contractor");
  assert.equal(contractorProfileCount, 1, "contractor profile is created");

  for (const invalidBody of [
    { role: "admin" },
    { role: "owner" },
    { role: "" },
    {},
    null,
  ]) {
    resetState();
    const invalidResponse = await roleRoute.POST(
      postRequest("/api/user/role", invalidBody),
    );
    assert.equal(
      invalidResponse.status,
      400,
      "invalid and privileged roles are rejected",
    );
    assert.equal(
      metadataUpdateCount,
      0,
      "invalid roles do not update Clerk metadata",
    );
    assert.equal(createCount, 0, "invalid roles do not create database users");
  }

  const adminStates: Array<{
    role: string | null;
    metadataRole?: string;
    email?: string;
  }> = [
    { role: "admin" },
    { role: "homeowner", metadataRole: "admin" },
    { role: null, metadataRole: "homeowner", email: "brandsagaceo@gmail.com" },
  ];
  for (const adminState of adminStates) {
    resetState(adminState);
    const adminRoleBefore: string | null | undefined = users[0]?.role;
    const adminResponse = await roleRoute.POST(
      postRequest("/api/user/role", { role: "contractor" }),
    );
    assert.equal(
      adminResponse.status,
      403,
      "provisioned administrators cannot self-change role",
    );
    assert.equal(
      users[0]?.role,
      adminRoleBefore,
      "database admin role remains intact",
    );
    assert.equal(clerkUser.publicMetadata.role, adminState.metadataRole);
    assert.equal(
      metadataUpdateCount,
      0,
      "administrator metadata remains intact",
    );
    assert.equal(userUpdateCount, 0);
  }

  resetState();
  sessionUserId = null;
  const anonymousLegacyResponse = await usersRoute.POST(
    postRequest("/api/users", {
      id: "attacker-controlled",
      email: "attacker@example.test",
      role: "admin",
    }),
  );
  assert.equal(
    anonymousLegacyResponse.status,
    401,
    "legacy user creation requires a session",
  );
  assert.equal(createCount, 0);

  resetState();
  const legacyAdminResponse = await usersRoute.POST(
    postRequest("/api/users", {
      id: "attacker-controlled",
      email: "attacker@example.test",
      role: "admin",
    }),
  );
  assert.equal(
    legacyAdminResponse.status,
    400,
    "legacy route rejects admin role",
  );
  assert.equal(createCount, 0);

  resetState();
  const legacyHomeownerResponse = await usersRoute.POST(
    postRequest("/api/users", {
      id: "attacker-controlled",
      email: "attacker@example.test",
      role: "homeowner",
    }),
  );
  assert.equal(legacyHomeownerResponse.status, 201);
  assert.deepEqual(
    createdUserData,
    {
      id: "clerk-homeowner",
      email: "homeowner@example.test",
      role: "homeowner",
    },
    "legacy route binds creation to the authenticated Clerk identity",
  );
  assert.equal(homeownerProfileCount, 1);

  resetState({ role: "admin" });
  const legacyExistingAdminResponse = await usersRoute.POST(
    postRequest("/api/users", {
      id: "clerk-homeowner",
      email: clerkUser.emailAddresses[0]?.emailAddress,
      role: "homeowner",
    }),
  );
  assert.equal(legacyExistingAdminResponse.status, 403);
  assert.equal(createCount, 0);

  console.log("user role authorization tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
