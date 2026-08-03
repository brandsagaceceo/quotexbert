import assert from "node:assert/strict";
import fs from "node:fs";
import { NextRequest } from "next/server";
import { createJobsGetHandler } from "../app/api/jobs/route";

type AuthResult =
  | { user: { dbUserId: string; clerkUserId: string; email: string; name: string | null } }
  | { error: string; status: 401 | 404 };

const baseLead = {
  id: "lead_1",
  title: "Full private homeowner title",
  description: "Private homeowner description that should not be visible when locked.",
  category: "painting-interior-exterior",
  budget: "$8,000 - $12,000",
  city: null,
  province: null,
  zipCode: "L1C 2M2",
  status: "open",
  homeowner: { name: "Private Homeowner" },
  photos: "[\"https://cdn.example.com/private-photo.jpg\"]",
  createdAt: new Date("2026-08-02T10:00:00.000Z"),
  claimed: true,
  claimedBy: "contractor-secret-id",
  claimedAt: "2026-08-02T12:00:00.000Z",
  _count: { applications: 2 },
};

function makeRequest(url: string) {
  return new NextRequest(url);
}

async function json(response: Response) {
  return response.json();
}

async function testSignedOutGets401() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({ error: "Authentication required", status: 401 }),
    getVisibleLeadsFn: async () => [],
    findActorFn: async () => null,
  });

  const response = await handler(makeRequest("https://example.com/api/jobs?contractorId=attacker"));
  assert.equal(response.status, 401, "signed-out caller must receive 401");
}

async function testContractorIdQueryCannotImpersonate() {
  const calls: string[] = [];

  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-auth-user", clerkUserId: "user_clerk_1", email: "auth@example.com", name: "Auth User" },
    }),
    findActorFn: async () => ({ id: "db-auth-user", role: "contractor", isActive: true }),
    getVisibleLeadsFn: async (contractorId: string) => {
      calls.push(contractorId);
      return [];
    },
  });

  const response = await handler(makeRequest("https://example.com/api/jobs?contractorId=victim-id&userId=victim-user"));
  assert.equal(response.status, 200);
  assert.deepEqual(calls, ["db-auth-user"], "route must use authenticated identity, not URL params");
}

async function testAuthenticatedIdentityComesFromClerk() {
  const calls: string[] = [];

  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-from-session", clerkUserId: "user_clerk_2", email: "session@example.com", name: "Session User" },
    }),
    findActorFn: async () => ({ id: "db-from-session", role: "contractor", isActive: true }),
    getVisibleLeadsFn: async (contractorId: string) => {
      calls.push(contractorId);
      return [];
    },
  });

  await handler(makeRequest("https://example.com/api/jobs?contractorId=forged"));
  assert.equal(calls[0], "db-from-session", "authenticated session identity must drive data access");
}

async function testLockedPayloadStripsSensitiveFields() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-contractor-1", clerkUserId: "user_c1", email: "c1@example.com", name: "C1" },
    }),
    findActorFn: async () => ({ id: "db-contractor-1", role: "contractor", isActive: true }),
    getVisibleLeadsFn: async () => [{ ...baseLead, hasAccess: false }],
  });

  const response = await handler(makeRequest("https://example.com/api/jobs"));
  const payload = await json(response);
  const job = payload.jobs[0];

  assert.equal(job.hasAccess, false);
  assert.equal(job.isLocked, true);
  assert.equal(job.homeowner, null, "locked response must not include homeowner name");
  assert.equal(job.zipCode, null, "locked response must not include postal code");
  assert.equal(job.city, null, "locked response must not include precise city field");
  assert.equal(job.photos, "[]", "locked response must not include original photo URLs");
  assert.notEqual(job.description, baseLead.description, "locked response must not include full private description");
  assert.equal(job.location, "Your area", "locked response must avoid postal-code fallback");
  assert.equal(job.claimedBy, null, "locked response must not include claimedBy information");
}

async function testMatchingPaidContractorGetsFullDetails() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-paid", clerkUserId: "user_paid", email: "paid@example.com", name: "Paid" },
    }),
    findActorFn: async () => ({ id: "db-paid", role: "contractor", isActive: true }),
    getVisibleLeadsFn: async () => [{ ...baseLead, hasAccess: true }],
  });

  const response = await handler(makeRequest("https://example.com/api/jobs"));
  const payload = await json(response);
  const job = payload.jobs[0];

  assert.equal(job.hasAccess, true);
  assert.equal(job.isLocked, false);
  assert.equal(job.title, baseLead.title);
  assert.equal(job.description, baseLead.description);
  assert.equal(job.homeowner, "Private Homeowner");
  assert.equal(job.zipCode, "L1C 2M2");
  assert.equal(job.photos, baseLead.photos);
}

async function testWrongCategoryContractorRemainsLocked() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-wrong-cat", clerkUserId: "user_wrong", email: "wrong@example.com", name: "Wrong Cat" },
    }),
    findActorFn: async () => ({ id: "db-wrong-cat", role: "contractor", isActive: true }),
    getVisibleLeadsFn: async () => [{ ...baseLead, hasAccess: false, category: "heating-cooling-hvac" }],
  });

  const response = await handler(makeRequest("https://example.com/api/jobs"));
  const payload = await json(response);
  const job = payload.jobs[0];

  assert.equal(job.hasAccess, false);
  assert.equal(job.isLocked, true);
}

async function testUnauthorizedRoleGets403() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-homeowner", clerkUserId: "user_h", email: "h@example.com", name: "Homeowner" },
    }),
    findActorFn: async () => ({ id: "db-homeowner", role: "homeowner", isActive: true }),
    getVisibleLeadsFn: async () => [],
  });

  const response = await handler(makeRequest("https://example.com/api/jobs"));
  assert.equal(response.status, 403, "non-contractor authenticated user must be forbidden");
}

async function testContractorNotFoundGets404() {
  const handler = createJobsGetHandler({
    resolveAuthUserFn: async () => ({
      user: { dbUserId: "db-missing", clerkUserId: "user_missing", email: "missing@example.com", name: "Missing" },
    }),
    findActorFn: async () => null,
    getVisibleLeadsFn: async () => [],
  });

  const response = await handler(makeRequest("https://example.com/api/jobs"));
  assert.equal(response.status, 404, "missing contractor record should return 404");
}

async function testAcceptClaimAuthorizationGuardStillPresent() {
  const acceptRoutePath = "app/api/jobs/[id]/accept/route.ts";
  const source = fs.readFileSync(acceptRoutePath, "utf8");

  assert.match(source, /canAccessLead\(/, "accept route must keep canAccessLead authorization check");
  assert.match(
    source,
    /active subscription for this category to accept jobs/,
    "accept route must keep forbidden path for unauthorized category access"
  );
}

async function run() {
  await testSignedOutGets401();
  await testContractorIdQueryCannotImpersonate();
  await testAuthenticatedIdentityComesFromClerk();
  await testLockedPayloadStripsSensitiveFields();
  await testMatchingPaidContractorGetsFullDetails();
  await testWrongCategoryContractorRemainsLocked();
  await testUnauthorizedRoleGets403();
  await testContractorNotFoundGets404();
  await testAcceptClaimAuthorizationGuardStillPresent();
  console.log("jobs-api-security tests passed");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
