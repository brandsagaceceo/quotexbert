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

type TestUser = {
  id: string;
  clerkUserId: string | null;
  role: string;
  contractorProfile: TestProfile | null;
};

type TestProfile = {
  id: string;
  userId: string;
};

type TestItem = {
  id: string;
  contractorId: string;
  title: string;
  description: string | null;
  caption: string | null;
  projectType: string;
  beforeImages: string;
  afterImages: string;
  imageUrl: string | null;
  projectCost: string | null;
  duration: string | null;
  materials: string | null;
  location: string | null;
  clientStory: string | null;
  isPublic: boolean;
  isPinned: boolean;
  tags: string;
  createdAt: Date;
  updatedAt: Date;
};

let authResult: AuthResult;
let users: TestUser[];
let profiles: TestProfile[];
let items: TestItem[];
let lastFindManyWhere: Record<string, unknown> | null;
let createdData: Record<string, unknown>[];
let lastUpdateData: Record<string, unknown> | null;
let deletedItemIds: string[];

const publicItem: TestItem = {
  id: "portfolio-public",
  contractorId: "profile-owner",
  title: "Public kitchen",
  description: null,
  caption: null,
  projectType: "Kitchen",
  beforeImages: "[]",
  afterImages: '["https://example.test/public.jpg"]',
  imageUrl: null,
  projectCost: null,
  duration: null,
  materials: null,
  location: null,
  clientStory: null,
  isPublic: true,
  isPinned: false,
  tags: "[]",
  createdAt: new Date("2026-10-01T00:00:00.000Z"),
  updatedAt: new Date("2026-10-01T00:00:00.000Z"),
};
const privateItem: TestItem = {
  ...publicItem,
  id: "portfolio-private",
  title: "Private bathroom",
  isPublic: false,
};

const prismaMock = {
  user: {
    findFirst: async (args: {
      where: { OR: Array<{ id?: string; clerkUserId?: string }> };
      include?: unknown;
    }) =>
      users.find((user) =>
        args.where.OR.some(
          (condition) =>
            user.id === condition.id ||
            user.clerkUserId === condition.clerkUserId,
        ),
      ) ?? null,
    findUnique: async (args: {
      where: { id: string };
      select?: Record<string, unknown>;
    }) => users.find((user) => user.id === args.where.id) ?? null,
  },
  contractorProfile: {
    findUnique: async (args: { where: { id?: string; userId?: string } }) =>
      profiles.find(
        (profile) =>
          profile.id === args.where.id || profile.userId === args.where.userId,
      ) ?? null,
  },
  portfolioItem: {
    findMany: async (args: { where: Record<string, unknown> }) => {
      lastFindManyWhere = args.where;
      return items.filter(
        (item) =>
          item.contractorId === args.where.contractorId &&
          (args.where.isPublic !== true || item.isPublic),
      );
    },
    create: async (args: { data: Record<string, unknown> }) => {
      createdData.push(args.data);
      return {
        ...publicItem,
        ...args.data,
        id: "portfolio-created",
      } as TestItem;
    },
    findUnique: async (args: { where: { id: string }; include?: unknown }) => {
      const item = items.find((stored) => stored.id === args.where.id);
      if (!item) return null;
      const ownerProfile = profiles.find(
        (profile) => profile.id === item.contractorId,
      );
      return {
        ...item,
        contractor: { userId: ownerProfile?.userId ?? "missing-owner" },
      };
    },
    update: async (args: {
      where: { id: string };
      data: Record<string, unknown>;
    }) => {
      lastUpdateData = args.data;
      return {
        ...items.find((item) => item.id === args.where.id)!,
        ...args.data,
      };
    },
    delete: async (args: { where: { id: string } }) => {
      deletedItemIds.push(args.where.id);
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

const collectionRoute = require("../app/api/contractors/portfolio/route") as {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
};
const itemRoute = require("../app/api/contractors/portfolio/[id]/route") as {
  PATCH: (
    request: Request,
    context: { params: Promise<{ id: string }> },
  ) => Promise<Response>;
  DELETE: (
    request: Request,
    context: { params: Promise<{ id: string }> },
  ) => Promise<Response>;
};

function setAuth(
  user: { dbUserId: string; clerkUserId?: string; role: string } | null,
) {
  if (!user) {
    authResult = { error: "Authentication required", status: 401 };
    return;
  }
  authResult = {
    user: {
      dbUserId: user.dbUserId,
      clerkUserId: user.clerkUserId ?? user.dbUserId,
      email: `${user.dbUserId}@example.test`,
      name: user.role,
    },
  };
}

function resetState() {
  const ownerProfile = { id: "profile-owner", userId: "contractor-db" };
  const otherProfile = { id: "profile-other", userId: "other-contractor-db" };
  users = [
    {
      id: "contractor-db",
      clerkUserId: "clerk-contractor",
      role: "contractor",
      contractorProfile: ownerProfile,
    },
    {
      id: "other-contractor-db",
      clerkUserId: null,
      role: "contractor",
      contractorProfile: otherProfile,
    },
    {
      id: "homeowner-db",
      clerkUserId: null,
      role: "homeowner",
      contractorProfile: null,
    },
  ];
  profiles = [ownerProfile, otherProfile];
  items = [
    publicItem,
    privateItem,
    { ...publicItem, id: "other-public", contractorId: otherProfile.id },
  ];
  lastFindManyWhere = null;
  createdData = [];
  lastUpdateData = null;
  deletedItemIds = [];
  setAuth(null);
}

function request(url: string, method = "GET", body?: unknown): Request {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { "content-type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request(`http://localhost${url}`, init);
}

const itemContext = (id: string) => ({ params: Promise.resolve({ id }) });

async function main() {
  resetState();

  const anonymousCreate = await collectionRoute.POST(
    request("/api/contractors/portfolio", "POST", {
      contractorId: "contractor-db",
      title: "Attempt",
    }),
  );
  assert.equal(anonymousCreate.status, 401);
  assert.equal(createdData.length, 0);

  setAuth({ dbUserId: "contractor-db", role: "contractor" });
  const crossAccountCreate = await collectionRoute.POST(
    request("/api/contractors/portfolio", "POST", {
      contractorId: "other-contractor-db",
      title: "Owner portfolio item",
    }),
  );
  assert.equal(crossAccountCreate.status, 200);
  assert.equal(createdData.at(-1)?.contractorId, "profile-owner");
  assert.equal(createdData.at(-1)?.title, "Owner portfolio item");

  const noClientIdCreate = await collectionRoute.POST(
    request("/api/contractors/portfolio", "POST", {
      title: "Manager compatibility",
    }),
  );
  assert.equal(noClientIdCreate.status, 200);
  assert.equal(createdData.at(-1)?.contractorId, "profile-owner");
  assert.equal(
    "id" in (await noClientIdCreate.json()),
    true,
    "creation response preserves portfolio item IDs",
  );

  setAuth({ dbUserId: "homeowner-db", role: "homeowner" });
  const homeownerCreate = await collectionRoute.POST(
    request("/api/contractors/portfolio", "POST", {
      contractorId: "contractor-db",
      title: "Unauthorized",
    }),
  );
  assert.equal(homeownerCreate.status, 403);

  resetState();
  const anonymousGallery = await collectionRoute.GET(
    request("/api/contractors/portfolio?contractorId=contractor-db"),
  );
  const publicGalleryItems = await anonymousGallery.json();
  assert.equal(anonymousGallery.status, 200);
  assert.deepEqual(
    publicGalleryItems.map((item: TestItem) => item.id),
    ["portfolio-public"],
  );
  assert.equal(publicGalleryItems[0].isPublic, true);
  assert.deepEqual(publicGalleryItems[0].afterImages, [
    "https://example.test/public.jpg",
  ]);

  setAuth({ dbUserId: "other-contractor-db", role: "contractor" });
  const otherUserGallery = await collectionRoute.GET(
    request("/api/contractors/portfolio?contractorId=contractor-db"),
  );
  assert.deepEqual(
    (await otherUserGallery.json()).map((item: TestItem) => item.id),
    ["portfolio-public"],
  );

  setAuth({
    dbUserId: "contractor-db",
    clerkUserId: "clerk-contractor",
    role: "contractor",
  });
  const ownerGallery = await collectionRoute.GET(
    request("/api/contractors/portfolio?contractorId=clerk-contractor"),
  );
  const ownerItems = await ownerGallery.json();
  assert.deepEqual(
    ownerItems.map((item: TestItem) => item.id),
    ["portfolio-public", "portfolio-private"],
    "legacy Clerk ID mapping lets the owner manage private items",
  );
  assert.equal(lastFindManyWhere?.isPublic, undefined);
  assert.equal(ownerItems[1].id, "portfolio-private");

  const profileIdGallery = await collectionRoute.GET(
    request("/api/contractors/portfolio?contractorId=profile-owner"),
  );
  assert.deepEqual(
    (await profileIdGallery.json()).map((item: TestItem) => item.id),
    ["portfolio-public", "portfolio-private"],
    "portfolio manager can resolve its profile ID caller",
  );

  resetState();
  const anonymousPatch = await itemRoute.PATCH(
    request("/api/contractors/portfolio/portfolio-private", "PATCH", {
      isPublic: true,
    }),
    itemContext("portfolio-private"),
  );
  assert.equal(anonymousPatch.status, 401);
  const anonymousDelete = await itemRoute.DELETE(
    request("/api/contractors/portfolio/portfolio-private", "DELETE"),
    itemContext("portfolio-private"),
  );
  assert.equal(anonymousDelete.status, 401);
  assert.deepEqual(deletedItemIds, []);

  setAuth({ dbUserId: "other-contractor-db", role: "contractor" });
  const crossAccountPatch = await itemRoute.PATCH(
    request("/api/contractors/portfolio/portfolio-private", "PATCH", {
      isPublic: true,
    }),
    itemContext("portfolio-private"),
  );
  const crossAccountDelete = await itemRoute.DELETE(
    request("/api/contractors/portfolio/portfolio-private", "DELETE"),
    itemContext("portfolio-private"),
  );
  assert.equal(crossAccountPatch.status, 403);
  assert.equal(crossAccountDelete.status, 403);
  assert.deepEqual(deletedItemIds, []);

  setAuth({ dbUserId: "contractor-db", role: "contractor" });
  const ownerPatch = await itemRoute.PATCH(
    request("/api/contractors/portfolio/portfolio-private", "PATCH", {
      isPublic: true,
      isPinned: true,
      contractorId: "profile-other",
    }),
    itemContext("portfolio-private"),
  );
  assert.equal(ownerPatch.status, 200);
  assert.equal(lastUpdateData?.isPublic, true);
  assert.equal(lastUpdateData?.isPinned, true);
  assert.equal("contractorId" in lastUpdateData!, false);
  assert.equal((await ownerPatch.json()).id, "portfolio-private");

  const ownerDelete = await itemRoute.DELETE(
    request("/api/contractors/portfolio/portfolio-private", "DELETE"),
    itemContext("portfolio-private"),
  );
  assert.equal(ownerDelete.status, 200);
  assert.deepEqual(deletedItemIds, ["portfolio-private"]);

  console.log("Contractor portfolio authorization tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
