import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

type TestUser = {
  id: string;
  clerkUserId: string | null;
  role: string;
  contractorProfile: Record<string, unknown> | null;
};

type TestReview = {
  id: string;
  leadId: string;
  contractorId: string;
  homeownerId: string;
  rating: number;
  title: string | null;
  text: string | null;
  qualityRating: number | null;
  timelinessRating: number | null;
  communicationRating: number | null;
  cleanlinessRating: number | null;
  valueRating: number | null;
  projectType: string | null;
  projectCost: number | null;
  projectDuration: string | null;
  createdAt: Date;
  isVerified: boolean;
  status: string;
  homeowner: { id: string; email: string; name: string | null };
  lead: { category: string };
};

let users: TestUser[];
let reviews: TestReview[];
let currentClerkUserId: string;
let metricsUserIds: string[];
let upsertedProfileData: Record<string, unknown> | null;

const publicPortfolioItem = {
  id: "portfolio-public-id",
  title: "Kitchen renovation",
  description: "New cabinets",
  projectType: "Kitchen",
  imageUrl: "https://images.example.test/kitchen.jpg",
  createdAt: new Date("2026-10-01T00:00:00.000Z"),
};

const contractorProfile = {
  id: "internal-profile-id",
  userId: "contractor-db-id",
  companyName: "Public Contractor Co",
  slug: "public-contractor",
  trade: "Renovation",
  bio: "Public business bio",
  city: "Toronto",
  serviceRadiusKm: 30,
  website: "https://business.example.test",
  phone: "555-0100",
  verified: true,
  avgRating: 4.5,
  reviewCount: 2,
  completedJobs: 3,
  categories: '["Kitchen"]',
  profilePhoto: "https://images.example.test/profile.jpg",
  coverPhoto: "https://images.example.test/cover.jpg",
  avgResponseTimeMinutes: 45,
  responseTimeLabel: "within an hour",
  email: "private-profile@example.test",
  stripeCustomerId: "cus_private",
  portfolio: [publicPortfolioItem],
};

function makeReview(
  id: string,
  status: string,
  rating: number,
  createdAt: string,
): TestReview {
  return {
    id,
    leadId: `lead-${id}`,
    contractorId: "contractor-db-id",
    homeownerId: `homeowner-${id}`,
    rating,
    title: "Great work",
    text: `${status} review text`,
    qualityRating: 5,
    timelinessRating: 4,
    communicationRating: 5,
    cleanlinessRating: 4,
    valueRating: 5,
    projectType: "Kitchen",
    projectCost: 15000,
    projectDuration: "3 weeks",
    createdAt: new Date(createdAt),
    isVerified: true,
    status,
    homeowner: {
      id: `private-homeowner-id-${id}`,
      email: `private-${id}@example.test`,
      name: "Jane Sample Homeowner",
    },
    lead: { category: "Kitchen" },
  };
}

function matchesWhere(review: TestReview, where: Record<string, unknown>) {
  return (
    (where.status === undefined || review.status === where.status) &&
    (where.contractorId === undefined ||
      review.contractorId === where.contractorId)
  );
}

function projectReview(review: TestReview, select: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const [field, selection] of Object.entries(select)) {
    if (selection === true) {
      result[field] = review[field as keyof TestReview];
    } else if (field === "homeowner") {
      result.homeowner = { name: review.homeowner.name };
    } else if (field === "lead") {
      result.lead = { category: review.lead.category };
    }
  }
  return result;
}

const prismaMock = {
  user: {
    findFirst: async (args: {
      where: { OR: Array<{ id?: string; clerkUserId?: string }> };
      select?: Record<string, unknown>;
    }) =>
      (() => {
        const user = users.find((user) =>
          args.where.OR.some(
            (condition) =>
              user.id === condition.id ||
              user.clerkUserId === condition.clerkUserId,
          ),
        );
        if (!user) return null;

        const profileSelection = args.select?.contractorProfile as
          | { select: Record<string, unknown> }
          | undefined;
        if (!profileSelection || !user.contractorProfile) {
          return { id: user.id };
        }

        const selectedProfile: Record<string, unknown> = {};
        for (const [field, selection] of Object.entries(
          profileSelection.select,
        )) {
          if (selection === true) {
            selectedProfile[field] = user.contractorProfile[field];
          } else if (field === "portfolio" && selection) {
            const portfolioSelection = selection as {
              select: Record<string, unknown>;
            };
            selectedProfile.portfolio = (
              user.contractorProfile.portfolio as Array<Record<string, unknown>>
            ).map((item) =>
              Object.fromEntries(
                Object.keys(portfolioSelection.select).map((key) => [
                  key,
                  item[key],
                ]),
              ),
            );
          }
        }
        return { id: user.id, contractorProfile: selectedProfile };
      })(),
    findUnique: async (args: { where: { id: string } }) =>
      users.find((user) => user.id === args.where.id) ?? null,
    update: async () => ({}),
  },
  contractorProfile: {
    findUnique: async (args: { where: { slug?: string } }) =>
      args.where.slug === "public-contractor" ? contractorProfile : null,
    upsert: async (args: { update: Record<string, unknown> }) => {
      upsertedProfileData = args.update;
      return {
        ...contractorProfile,
        ...args.update,
        user: { email: "private@example.test", createdAt: new Date() },
      };
    },
  },
  review: {
    findMany: async (args: {
      where: Record<string, unknown>;
      select: Record<string, unknown>;
      skip?: number;
      take?: number;
    }) => {
      const selected = reviews
        .filter((review) => matchesWhere(review, args.where))
        .sort(
          (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
        )
        .slice(
          args.skip ?? 0,
          args.take === undefined ? undefined : (args.skip ?? 0) + args.take,
        );
      return selected.map((review) => projectReview(review, args.select));
    },
    count: async (args: { where: Record<string, unknown> }) =>
      reviews.filter((review) => matchesWhere(review, args.where)).length,
    aggregate: async (args: { where: Record<string, unknown> }) => {
      const selected = reviews.filter((review) =>
        matchesWhere(review, args.where),
      );
      return {
        _avg: {
          rating:
            selected.length > 0
              ? selected.reduce((sum, review) => sum + review.rating, 0) /
                selected.length
              : null,
        },
      };
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

installModuleMock("@/lib/prisma", { prisma: prismaMock });
installModuleMock("@/lib/contractor-metrics", {
  getContractorMetrics: async (userId: string) => {
    metricsUserIds.push(userId);
    return { jobsAccepted: 4, jobsCompleted: 3, conversionRate: 0.75 };
  },
});
installModuleMock("@clerk/nextjs/server", {
  auth: async () => ({ userId: currentClerkUserId }),
});
installModuleMock("@/lib/email", {
  sendReviewReceivedEmail: async () => ({ success: true }),
});
installModuleMock("@/lib/server-auth", {
  resolveAuthUser: async () => ({
    user: {
      dbUserId: "contractor-db-id",
      clerkUserId: currentClerkUserId,
      email: "private@example.test",
      name: "Contractor",
    },
  }),
});

const profileRoute = require("../app/api/contractors/profile/route") as {
  GET: (request: Request) => Promise<Response>;
  PUT: (request: Request) => Promise<Response>;
};
const reviewCollectionRoute = require("../app/api/reviews/route") as {
  GET: (request: Request) => Promise<Response>;
};
const contractorReviewsRoute =
  require("../app/api/reviews/[contractorId]/route") as {
    GET: (
      request: Request,
      context: { params: { contractorId: string } },
    ) => Promise<Response>;
  };
const slugRoute = require("../app/api/contractors/by-slug/[slug]/route") as {
  GET: (
    request: Request,
    context: { params: { slug: string } },
  ) => Promise<Response>;
};

function resetState() {
  users = [
    {
      id: "contractor-db-id",
      clerkUserId: "clerk-contractor-id",
      role: "contractor",
      contractorProfile,
    },
  ];
  reviews = [
    makeReview("published-one", "published", 5, "2026-10-03T00:00:00Z"),
    makeReview("published-two", "published", 4, "2026-10-02T00:00:00Z"),
    makeReview("pending-one", "pending", 1, "2026-10-04T00:00:00Z"),
    makeReview("hidden-one", "hidden", 2, "2026-10-05T00:00:00Z"),
  ];
  currentClerkUserId = "contractor-db-id";
  metricsUserIds = [];
  upsertedProfileData = null;
}

function request(url: string, method = "GET", body?: unknown): Request {
  const init: RequestInit = { method };
  if (body !== undefined) {
    init.headers = { "content-type": "application/json" };
    init.body = JSON.stringify(body);
  }
  return new Request(`http://localhost${url}`, init);
}

async function main() {
  resetState();
  const legacyProfileResponse = await profileRoute.GET(
    request("/api/contractors/profile?userId=clerk-contractor-id"),
  );
  const profileBody = await legacyProfileResponse.json();
  assert.equal(legacyProfileResponse.status, 200);
  assert.equal(profileBody.profile.companyName, "Public Contractor Co");
  assert.equal(profileBody.profile.phone, "555-0100");
  assert.equal(profileBody.profile.trade, "Renovation");
  assert.equal(profileBody.profile.portfolio[0].id, "portfolio-public-id");
  assert.equal(
    profileBody.profile.portfolio[0].imageUrl,
    publicPortfolioItem.imageUrl,
  );
  assert.equal(profileBody.profile.jobsAccepted, 4);
  assert.equal(metricsUserIds[0], "contractor-db-id");
  for (const field of ["id", "userId", "user", "email", "stripeCustomerId"]) {
    assert.equal(field in profileBody.profile, false, `profile omits ${field}`);
  }

  currentClerkUserId = "contractor-db-id";
  const editResponse = await profileRoute.PUT(
    request("/api/contractors/profile", "PUT", {
      companyName: "Edited Contractor Co",
      trade: "Renovation",
      serviceRadiusKm: 30,
      phone: "555-0199",
      city: "Toronto",
      website: "https://business.example.test",
      bio: "Edited bio",
    }),
  );
  assert.equal(
    editResponse.status,
    200,
    "contractor profile editing remains available",
  );
  assert.equal(upsertedProfileData?.companyName, "Edited Contractor Co");

  const slugResponse = await slugRoute.GET(
    request("/api/contractors/by-slug/public-contractor"),
    { params: { slug: "public-contractor" } },
  );
  const slugBody = await slugResponse.json();
  assert.equal(slugResponse.status, 200);
  assert.equal(slugBody.contractor.companyName, "Public Contractor Co");
  assert.equal(slugBody.contractor.portfolio[0].id, "portfolio-public-id");
  assert.equal("contractorId" in slugBody.contractor.portfolio[0], false);
  for (const field of ["id", "userId", "userEmail", "userName"]) {
    assert.equal(
      field in slugBody.contractor,
      false,
      `slug profile omits ${field}`,
    );
  }

  const collectionResponse = await reviewCollectionRoute.GET(
    request("/api/reviews?contractorId=clerk-contractor-id&page=1&limit=1"),
  );
  const collectionBody = await collectionResponse.json();
  assert.equal(collectionResponse.status, 200);
  assert.deepEqual(collectionBody.pagination, {
    page: 1,
    limit: 1,
    totalCount: 2,
    totalPages: 2,
  });
  assert.equal(collectionBody.averageRating, 4.5);
  assert.deepEqual(
    collectionBody.reviews.map((review: { id: string }) => review.id),
    ["published-one"],
  );

  const limitedReview = collectionBody.reviews[0];
  assert.equal(limitedReview.homeowner.name, "Jane");
  for (const field of ["id", "email"]) {
    assert.equal(field in limitedReview.homeowner, false);
  }
  for (const field of ["homeownerId", "contractorId", "leadId", "status"]) {
    assert.equal(field in limitedReview, false);
  }

  const detailResponse = await contractorReviewsRoute.GET(
    request("/api/reviews/clerk-contractor-id?limit=1"),
    { params: { contractorId: "clerk-contractor-id" } },
  );
  const detailBody = await detailResponse.json();
  assert.equal(detailResponse.status, 200);
  assert.equal(detailBody.success, true);
  assert.equal(detailBody.totalReviews, 2);
  assert.equal(detailBody.averageRating, 4.5);
  assert.deepEqual(
    detailBody.reviews.map((review: { id: string }) => review.id),
    ["published-one"],
  );
  assert.equal(detailBody.reviews[0].homeowner.name, "Jane");
  assert.equal("email" in detailBody.reviews[0].homeowner, false);
  assert.equal("homeownerId" in detailBody.reviews[0], false);
  assert.equal("contractorId" in detailBody.reviews[0], false);
  assert.equal("leadId" in detailBody.reviews[0], false);

  const reviewDisplaySource = fs.readFileSync(
    path.join(process.cwd(), "components", "ReviewDisplay.tsx"),
    "utf8",
  );
  assert.match(reviewDisplaySource, /getInitials\(review\.homeowner\.name\)/);
  assert.doesNotMatch(reviewDisplaySource, /homeowner\.email/);

  const publicPortfolioPage = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "contractor",
      "[id]",
      "portfolio",
      "page.tsx",
    ),
    "utf8",
  );
  assert.match(publicPortfolioPage, /setContractor\(profileData\.profile\)/);
  assert.match(publicPortfolioPage, /contractorId=\{resolvedParams\.id\}/);

  const contractorProfilePage = fs.readFileSync(
    path.join(
      process.cwd(),
      "app",
      "contractors",
      "profile",
      "[id]",
      "page.tsx",
    ),
    "utf8",
  );
  assert.match(contractorProfilePage, /item\.imageUrl/);
  assert.match(
    contractorProfilePage,
    /<PortfolioLikeButton itemId=\{item\.id\}/,
  );

  const portfolioManagerPage = fs.readFileSync(
    path.join(process.cwd(), "app", "profile", "portfolio", "page.tsx"),
    "utf8",
  );
  assert.match(portfolioManagerPage, /const contractorId = user\?\.id/);

  const reviewListSource = fs.readFileSync(
    path.join(process.cwd(), "components", "ReviewsList.tsx"),
    "utf8",
  );
  assert.match(reviewListSource, /firstNameOnly\(review\.homeowner\?\.name\)/);

  console.log("Public profile and review privacy tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
