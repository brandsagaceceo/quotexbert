import assert from "node:assert/strict";
import fs from "node:fs";
import { hasClaimableCategoryEntitlement } from "../lib/subscription-access";

const now = new Date("2026-08-08T12:00:00.000Z").getTime();
const future = new Date(now + 86_400_000);
const past = new Date(now - 60_000);

const subscription = (
  category: string,
  status: string,
  canClaimLeads = true,
  currentPeriodEnd: Date | null = future,
) => ({ category, status, canClaimLeads, currentPeriodEnd });

assert.equal(
  hasClaimableCategoryEntitlement([subscription("Painting", "active")], "painting-interior-exterior", now),
  true,
  "active paid contractor can accept an entitled category alias",
);
assert.equal(
  hasClaimableCategoryEntitlement([subscription("Renovation", "trialing")], "bathroom-renovation", now),
  true,
  "trialing paid contractor can accept an entitled category alias",
);
assert.equal(
  hasClaimableCategoryEntitlement([subscription("Painting", "active")], "general-plumbing", now),
  false,
  "active paid contractor cannot accept a non-entitled category",
);
assert.equal(
  hasClaimableCategoryEntitlement([], "Painting", now),
  false,
  "free contractor cannot accept a paid-category job",
);
assert.equal(
  hasClaimableCategoryEntitlement([subscription("Painting", "canceled")], "Painting", now),
  false,
  "cancelled subscription cannot accept a job",
);
assert.equal(
  hasClaimableCategoryEntitlement([subscription("Painting", "active", true, past)], "Painting", now),
  false,
  "expired subscription cannot accept a job",
);
assert.equal(
  hasClaimableCategoryEntitlement([subscription("Painting", "active", false)], "Painting", now),
  false,
  "subscription without claim permission cannot accept a job",
);

const boardSource = fs.readFileSync("app/contractor/jobs/page.tsx", "utf8");
const acceptSource = fs.readFileSync("app/api/jobs/[id]/accept/route.ts", "utf8");

assert.match(
  boardSource,
  /canAcceptJob\(user\?\.email, job\.hasAccess === true\)/,
  "frontend uses the access decision returned by the authenticated jobs API",
);
assert.doesNotMatch(
  boardSource,
  /job\.hasAccess \?\?/,
  "job cards do not fall back to a separate client-side entitlement decision",
);
assert.match(
  acceptSource,
  /canAccessLead\(dbContractorId, currentLead\.category\)/,
  "backend remains the final category-entitlement authority",
);
assert.match(
  acceptSource,
  /const authResult = await resolveAuthUser\(\)/,
  "backend binds acceptance to the authenticated user",
);
assert.doesNotMatch(
  acceptSource,
  /const \{ contractorId, message \} = await request\.json\(\)/,
  "backend does not trust a body-supplied contractor identity",
);
assert.doesNotMatch(
  boardSource,
  /contractorId: user\.id/,
  "frontend does not send a contractor identity for acceptance",
);

console.log("job-accept-entitlement tests passed");