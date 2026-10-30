import assert from "node:assert/strict";
import fs from "node:fs";
import { hasClaimableCategoryEntitlement } from "../lib/subscription-access";

const source = (path: string) => fs.readFileSync(path, "utf8");
const contractorAccept = source("app/api/jobs/[id]/accept/route.ts");
const homeownerAccept = source("app/api/leads/[id]/accept/route.ts");
const legacyClaim = source("app/api/claim-lead/route.ts");
const deprecatedPaymentClaim = source("app/api/payments/claim-lead/route.ts");
const payout = source("app/api/contractor/payout/route.ts");

assert.match(
  contractorAccept,
  /resolveAuthUser\(\)/,
  "contractor acceptance is session-authenticated",
);
assert.match(
  contractorAccept,
  /currentLead\.homeownerId === contractorId/,
  "contractors cannot accept their own jobs",
);
assert.match(
  contractorAccept,
  /contractor\.role !== "contractor" \|\| !contractor\.isActive/,
  "only active contractor accounts may accept",
);
assert.match(
  contractorAccept,
  /canAccessLead\(dbContractorId, currentLead\.category\)/,
  "category subscription access remains enforced",
);
assert.match(
  contractorAccept,
  /prisma\.\$transaction\(async \(tx\)/,
  "acceptance state is changed transactionally",
);
assert.match(
  contractorAccept,
  /tx\.lead\.updateMany/,
  "lead acceptance uses an atomic conditional update",
);
assert.match(
  contractorAccept,
  /acceptedContractors: latestLead\.acceptedContractors/,
  "compare-and-set prevents concurrent accepted-list overwrites",
);
assert.match(
  contractorAccept,
  /acceptedContractors\.includes\(dbContractorId\)/,
  "replayed acceptance is rejected",
);
assert.match(
  contractorAccept,
  /leadId_contractorId/,
  "acceptance uniqueness is checked per contractor/job",
);
assert.doesNotMatch(
  contractorAccept,
  /const \{ contractorId, message \} = await request\.json\(\)/,
  "contractor identity does not come from request body",
);

assert.match(
  homeownerAccept,
  /resolveAuthUser\(\)/,
  "homeowner selection requires an authenticated session",
);
assert.match(
  homeownerAccept,
  /lead\.homeownerId !== homeownerId/,
  "only the job owner can hire a contractor",
);
assert.match(
  homeownerAccept,
  /contractorUser\.role !== "contractor" \|\| !contractorUser\.isActive/,
  "selected account must be an active contractor",
);
assert.match(
  homeownerAccept,
  /jobAcceptance\.findUnique/,
  "the selected contractor must have accepted the job",
);
assert.match(
  homeownerAccept,
  /acceptedContractors/,
  "legacy accepted-contractor mappings remain supported",
);
assert.match(
  homeownerAccept,
  /acceptedContractors\.includes\(contractorUser\.clerkUserId\)/,
  "legacy Clerk-ID acceptances remain supported",
);
assert.match(
  homeownerAccept,
  /prisma\.lead\.updateMany/,
  "selection is conditional and race-safe",
);
assert.match(
  homeownerAccept,
  /acceptedById: dbContractorId/,
  "final selected contractor is recorded",
);
assert.match(
  homeownerAccept,
  /latestLead\?\.status === "assigned" && latestLead\.contractorId === dbContractorId/,
  "same-contractor replay remains idempotent",
);

assert.match(
  legacyClaim,
  /status: 410/,
  "legacy per-lead charge endpoint is disabled",
);
assert.doesNotMatch(
  legacyClaim,
  /createPaymentIntent|createCharge|contractorBilling\.update/,
  "legacy endpoint cannot charge or mutate billing",
);
assert.match(
  deprecatedPaymentClaim,
  /status: 410/,
  "the duplicate legacy payment route remains disabled",
);

assert.match(
  payout,
  /resolveAuthUser\(\)/,
  "payout information requires authentication",
);
assert.match(
  payout,
  /contractor\.role !== "contractor" \|\| !contractor\.isActive/,
  "payout information is limited to active contractors",
);
assert.match(
  payout,
  /where: \{ userId: access\.contractorId \}/,
  "billing lookup uses only the authenticated contractor",
);
assert.match(payout, /status: 501/, "no fake payout is reported as successful");
assert.doesNotMatch(
  payout,
  /spendThisMonthCents:\s*0|contractorBilling\.update/,
  "payout request cannot erase the monthly spend counter",
);

const future = new Date(Date.now() + 86_400_000);
assert.equal(
  hasClaimableCategoryEntitlement(
    [
      {
        category: "Painting",
        status: "active",
        canClaimLeads: true,
        currentPeriodEnd: future,
      },
    ],
    "Painting",
  ),
  true,
  "active matching subscription continues to permit job acceptance",
);
assert.equal(
  hasClaimableCategoryEntitlement(
    [
      {
        category: "Painting",
        status: "active",
        canClaimLeads: true,
        currentPeriodEnd: future,
      },
    ],
    "Plumbing",
  ),
  false,
  "a different category remains unavailable",
);

console.log("lead-claiming security tests passed");
