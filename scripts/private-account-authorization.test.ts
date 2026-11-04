import assert from "node:assert/strict";

type AuthResult =
  | {
      user: {
        dbUserId: string;
        clerkUserId: string;
        email: string;
        name: string | null;
      };
    }
  | { error: string; status: 401 | 404 };

type StoredUser = {
  id: string;
  clerkUserId: string | null;
  email: string;
  name: string | null;
  displayName: string | null;
  role: string | null;
  createdAt: Date;
  selectedCategories: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionPlan: string | null;
  contractorProfile: Record<string, unknown> | null;
  homeownerProfile: Record<string, unknown> | null;
  reviewsReceived: Array<{ rating: number }>;
  _count: { acceptedLeads: number; leads: number };
};

let authResult: AuthResult = {
  user: {
    dbUserId: "homeowner-db",
    clerkUserId: "clerk-homeowner",
    email: "homeowner@example.test",
    name: "Homeowner",
  },
};
let storedUsers: StoredUser[] = [];
let contractorUpserts: Array<{
  userId: string;
  data: Record<string, unknown>;
}> = [];
let homeownerUpserts: Array<{ userId: string; data: Record<string, unknown> }> =
  [];
let userSelect: Record<string, unknown> | null = null;
let userLookupIds: string[] = [];

function makeUser(id: string, role: "homeowner" | "contractor"): StoredUser {
  return {
    id,
    clerkUserId: id === "homeowner-db" ? "clerk-homeowner" : null,
    email: `${role}@example.test`,
    name: role,
    displayName: null,
    role,
    createdAt: new Date("2026-10-01T00:00:00.000Z"),
    selectedCategories: role === "contractor" ? '["painting"]' : null,
    stripeCustomerId: `cus_private_${id}`,
    stripeSubscriptionId: `sub_private_${id}`,
    subscriptionPlan: "private-plan",
    contractorProfile:
      role === "contractor"
        ? {
            companyName: "Contractor Co",
            trade: "Painting",
            bio: "Contractor bio",
            city: "Toronto",
            serviceRadiusKm: 25,
            website: "https://contractor.example.test",
            phone: "555-0100",
            verified: true,
            avgRating: 4.5,
            reviewCount: 2,
            completedJobs: 1,
            categories: '["painting"]',
            isActive: true,
            profilePhoto: "https://images.example.test/contractor.jpg",
            coverPhoto: null,
            businessLogo: null,
            secretInternalField: "not for response",
          }
        : null,
    homeownerProfile:
      role === "homeowner"
        ? {
            name: "Homeowner",
            city: "Toronto",
            phone: "555-0101",
            profilePhoto: "https://images.example.test/homeowner.jpg",
            coverPhoto: null,
            bio: "Homeowner bio",
            homeType: "house",
            preferredRenovationTypes: '["kitchen"]',
            budgetRange: "10000-25000",
            secretInternalField: "not for response",
          }
        : null,
    reviewsReceived: [{ rating: 4 }, { rating: 5 }],
    _count: { acceptedLeads: 1, leads: 2 },
  };
}

const prismaMock = {
  user: {
    findUnique: async (args: {
      where: { id?: string; clerkUserId?: string };
      include?: unknown;
      select?: Record<string, unknown>;
    }) => {
      if (args.select) userSelect = args.select;
      const requestedId = args.where.id || args.where.clerkUserId;
      if (requestedId) userLookupIds.push(requestedId);
      return (
        storedUsers.find(
          (user) =>
            user.id === args.where.id ||
            user.clerkUserId === args.where.clerkUserId,
        ) ?? null
      );
    },
  },
  contractorProfile: {
    upsert: async (args: {
      where: { userId: string };
      update: Record<string, unknown>;
    }) => {
      contractorUpserts.push({ userId: args.where.userId, data: args.update });
    },
  },
  homeownerProfile: {
    upsert: async (args: {
      where: { userId: string };
      update: Record<string, unknown>;
    }) => {
      homeownerUpserts.push({ userId: args.where.userId, data: args.update });
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

const profileRoute = require("../app/api/profile/route") as {
  GET: (request: Request) => Promise<Response>;
  PUT: (request: Request) => Promise<Response>;
};
const usersRoute = require("../app/api/users/route") as {
  GET: (request: Request) => Promise<Response>;
};

function resetState(role: "homeowner" | "contractor" = "homeowner") {
  const user = makeUser(`${role}-db`, role);
  storedUsers = [user, makeUser("other-user-db", "homeowner")];
  authResult = {
    user: {
      dbUserId: user.id,
      clerkUserId:
        role === "homeowner" ? "clerk-homeowner" : "clerk-contractor",
      email: user.email,
      name: user.name,
    },
  };
  contractorUpserts = [];
  homeownerUpserts = [];
  userSelect = null;
  userLookupIds = [];
}

function request(path: string, method = "GET", body?: unknown) {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { "content-type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request(`http://localhost${path}`, init);
}

async function main() {
  resetState();
  authResult = { error: "Authentication required", status: 401 };
  const anonymousProfileGet = await profileRoute.GET(
    request("/api/profile?userId=homeowner-db"),
  );
  const anonymousProfilePut = await profileRoute.PUT(
    request("/api/profile", "PUT", { name: "Changed" }),
  );
  const anonymousUserGet = await usersRoute.GET(
    request("/api/users?userId=homeowner-db"),
  );
  assert.equal(
    anonymousProfileGet.status,
    401,
    "anonymous profile GET is denied",
  );
  assert.equal(
    anonymousProfilePut.status,
    401,
    "anonymous profile PUT is denied",
  );
  assert.equal(anonymousUserGet.status, 401, "anonymous account GET is denied");

  resetState("homeowner");
  const homeownerProfileGet = await profileRoute.GET(
    request("/api/profile?userId=clerk-homeowner"),
  );
  const homeownerProfile = await homeownerProfileGet.json();
  assert.equal(homeownerProfileGet.status, 200);
  assert.equal(homeownerProfile.id, "homeowner-db");
  assert.equal(homeownerProfile.role, "homeowner");
  assert.equal(homeownerProfile.name, "Homeowner");
  assert.deepEqual(homeownerProfile.preferredRenovationTypes, ["kitchen"]);
  assert.equal(homeownerProfile.totalJobs, 2);

  const profileWithoutRequestedId = await profileRoute.GET(
    request("/api/profile"),
  );
  assert.equal(
    profileWithoutRequestedId.status,
    200,
    "profile GET can resolve the current session alone",
  );

  const mismatchedProfileGet = await profileRoute.GET(
    request("/api/profile?userId=other-user-db"),
  );
  assert.equal(
    mismatchedProfileGet.status,
    403,
    "cross-account profile GET is denied",
  );

  const mismatchedProfilePut = await profileRoute.PUT(
    request("/api/profile", "PUT", {
      userId: "other-user-db",
      name: "Attacker edit",
    }),
  );
  assert.equal(
    mismatchedProfilePut.status,
    403,
    "cross-account profile PUT is denied",
  );
  assert.equal(
    homeownerUpserts.length,
    0,
    "cross-account profile update does not write",
  );

  const homeownerPut = await profileRoute.PUT(
    request("/api/profile", "PUT", {
      name: "Updated Homeowner",
      city: "Ottawa",
      preferredRenovationTypes: ["bathroom"],
    }),
  );
  assert.equal(
    homeownerPut.status,
    200,
    "homeowner can edit their own profile without userId",
  );
  assert.equal(homeownerUpserts.at(-1)?.userId, "homeowner-db");
  assert.deepEqual(
    homeownerUpserts.at(-1)?.data.preferredRenovationTypes,
    '["bathroom"]',
  );

  resetState("contractor");
  const contractorProfileGet = await profileRoute.GET(
    request("/api/profile?userId=clerk-contractor"),
  );
  const contractorProfile = await contractorProfileGet.json();
  assert.equal(contractorProfileGet.status, 200);
  assert.equal(contractorProfile.role, "contractor");
  assert.equal(contractorProfile.companyName, "Contractor Co");
  assert.equal(contractorProfile.avgRating, 4.5);
  assert.equal(
    "name" in contractorProfile,
    false,
    "contractor response excludes homeowner profile fields",
  );

  const contractorPut = await profileRoute.PUT(
    request("/api/profile", "PUT", {
      userId: "contractor-db",
      companyName: "Updated Contractor Co",
      trade: "Electrical",
    }),
  );
  assert.equal(
    contractorPut.status,
    200,
    "contractor can edit their own profile",
  );
  assert.equal(contractorUpserts.at(-1)?.userId, "contractor-db");
  assert.equal(
    contractorUpserts.at(-1)?.data.companyName,
    "Updated Contractor Co",
  );

  resetState("homeowner");
  const ownAccountGet = await usersRoute.GET(
    request("/api/users?userId=clerk-homeowner&email=homeowner%40example.test"),
  );
  const ownAccountBody = await ownAccountGet.json();
  assert.equal(
    ownAccountGet.status,
    200,
    "owner can retrieve their own account",
  );
  assert.equal(ownAccountBody.user.id, "homeowner-db");
  assert.equal(ownAccountBody.user.homeownerProfile.name, "Homeowner");
  assert.equal(
    "contractorProfile" in ownAccountBody.user,
    false,
    "unrelated profile is omitted",
  );
  assert.equal("stripeCustomerId" in ownAccountBody.user, false);
  assert.equal("stripeSubscriptionId" in ownAccountBody.user, false);
  assert.equal("subscriptionPlan" in ownAccountBody.user, false);
  assert.ok(userSelect, "query uses an explicit account field selection");
  assert.equal("stripeCustomerId" in userSelect!, false);
  assert.equal("billing" in userSelect!, false);
  assert.ok(
    userLookupIds.includes("homeowner-db"),
    "query uses the resolved DB account ID",
  );

  const otherAccountById = await usersRoute.GET(
    request("/api/users?userId=other-user-db"),
  );
  const otherAccountByEmail = await usersRoute.GET(
    request("/api/users?email=other%40example.test"),
  );
  assert.equal(
    otherAccountById.status,
    403,
    "another account cannot be fetched by ID",
  );
  assert.equal(
    otherAccountByEmail.status,
    403,
    "another account cannot be fetched by email",
  );

  resetState("contractor");
  const contractorAccountGet = await usersRoute.GET(request("/api/users"));
  const contractorAccount = await contractorAccountGet.json();
  assert.equal(contractorAccountGet.status, 200);
  assert.equal(
    contractorAccount.user.contractorProfile.companyName,
    "Contractor Co",
  );
  assert.equal("homeownerProfile" in contractorAccount.user, false);
  assert.equal(contractorAccount.user.selectedCategories, '["painting"]');

  resetState("homeowner");
  const legacyDbUser = storedUsers[0]!;
  legacyDbUser.id = "homeowner-legacy-db";
  legacyDbUser.clerkUserId = "clerk-homeowner";
  authResult = {
    user: {
      dbUserId: "homeowner-legacy-db",
      clerkUserId: "clerk-homeowner",
      email: legacyDbUser.email,
      name: legacyDbUser.name,
    },
  };
  const legacyProfileGet = await profileRoute.GET(
    request("/api/profile?userId=clerk-homeowner"),
  );
  assert.equal(
    legacyProfileGet.status,
    200,
    "legacy Clerk-to-DB profile mapping works",
  );
  const legacyProfilePut = await profileRoute.PUT(
    request("/api/profile", "PUT", {
      userId: "clerk-homeowner",
      city: "Hamilton",
    }),
  );
  assert.equal(
    legacyProfilePut.status,
    200,
    "legacy mapped profile update works",
  );
  assert.equal(homeownerUpserts.at(-1)?.userId, "homeowner-legacy-db");

  console.log("private account authorization tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
