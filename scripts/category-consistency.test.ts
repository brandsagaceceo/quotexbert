// Category consistency regression — homeowner-postable/editable categories must
// always be the SAME canonical set contractor subscriptions/entitlements match
// against. Source-assertion style (matches scripts/job-fairness.test.ts).
import assert from "node:assert/strict";
import fs from "node:fs";

const categoriesLib = fs.readFileSync("lib/categories.ts", "utf8");
const createLead = fs.readFileSync("app/create-lead/page.tsx", "utf8");
const editJob = fs.readFileSync("app/homeowner/jobs/[id]/edit/page.tsx", "utf8");
const editJobPatchRoute = fs.readFileSync("app/api/homeowner/jobs/[id]/route.ts", "utf8");
const contractorJobsPage = fs.readFileSync("app/contractor/jobs/page.tsx", "utf8");
const subscriptionAccess = fs.readFileSync("lib/subscription-access.ts", "utf8");
const subscriptionsPage = fs.readFileSync("app/contractor/subscriptions/page.tsx", "utf8");
const createCheckout = fs.readFileSync("app/api/subscriptions/create-checkout/route.ts", "utf8");
const aiEstimatePost = fs.readFileSync("app/api/ai-estimates/[id]/post/route.ts", "utf8");

// 1. Canonical source: SIMPLE_CATEGORIES is the 11-item list the working
//    contractor subscription picker (checkout flow) actually uses.
assert.match(categoriesLib, /export const SIMPLE_CATEGORIES = \[/, "SIMPLE_CATEGORIES is defined as the canonical list");
assert.match(subscriptionsPage, /SIMPLE_CATEGORIES\.filter\(\(cat\) =>/, "the working category-picker modal renders from SIMPLE_CATEGORIES (unchanged)");
assert.match(createCheckout, /categories: SIMPLE_CATEGORIES\.length/, "General Contractor tier size is still derived from SIMPLE_CATEGORIES (unchanged)");

// 2. Homeowner job creation (create-lead) already used the canonical source — unchanged.
assert.match(createLead, /import \{ SIMPLE_CATEGORIES \} from "@\/lib\/categories";/, "create-lead already imports the canonical category list");

// 3. FIX: homeowner Save Changes (edit) now uses the SAME canonical source,
//    not the legacy 60-item detailed CATEGORY_GROUPS taxonomy.
assert.doesNotMatch(editJob, /CATEGORY_GROUPS/, "edit-job page no longer uses the legacy detailed category taxonomy");
assert.match(editJob, /import \{ SIMPLE_CATEGORIES, normalizeCategory \} from "@\/lib\/categories";/, "edit-job page imports the canonical category list + normalizer");
assert.match(editJob, /category: normalizeCategory\(job\.category\)/, "edit-job normalizes the loaded job's category so an existing valid category stays selected");
assert.match(editJob, /\{SIMPLE_CATEGORIES\.map\(\(cat\) => \(/, "edit-job's dropdown renders the canonical flat category list");

// 4. Job board filters already used SIMPLE_CATEGORIES — unchanged.
assert.match(contractorJobsPage, /import \{ ALL_CATEGORIES, SIMPLE_CATEGORIES, normalizeCategory \} from "@\/lib\/categories";/, "job board filter import is unchanged");
assert.match(contractorJobsPage, /\{SIMPLE_CATEGORIES\.map\(\(category\) => \(/, "job board category filter dropdown is unchanged");

// 5. Notification/entitlement matching normalizes both sides through the same
//    function — unaffected by the dropdown fix (matching already worked before).
assert.match(subscriptionAccess, /normalizeCategory\(leadCategory\) === normalizeCategory\(entitlementCategory\)/, "entitlement matching is unchanged");

// 6. FIX: AI-estimate -> job-board posting no longer defaults to the orphan
//    'General Contractor' value (a tier name, not a category).
assert.doesNotMatch(aiEstimatePost, /categories\[0\] \|\| 'General Contractor'/, "the orphan 'General Contractor' category fallback was removed");
assert.match(aiEstimatePost, /const primaryCategory = normalizeCategory\(categories\[0\] \|\| ''\);/, "AI-estimate posting now normalizes to a canonical category");

// 7. Save Changes validation: clean 400 for invalid categories, no raw server error exposed.
assert.match(editJobPatchRoute, /Please select a valid project category\./, "PATCH returns a clean, user-friendly error for invalid categories");
assert.match(editJobPatchRoute, /status: 400 \}\);\s*\n\s*\}\s*\n\s*updateData\.category = normalizeCategory\(rawCategory\);/, "invalid category is rejected with 400 before being persisted");

// 8/9/10. Save Changes never touches Message/Quote/JobAcceptance tables — existing
// messages/quotes/acceptances/job id are structurally untouched by this route.
assert.doesNotMatch(editJobPatchRoute, /prisma\.message\./, "Save Changes never touches Message records");
assert.doesNotMatch(editJobPatchRoute, /prisma\.quote\./, "Save Changes never touches Quote records");
assert.doesNotMatch(editJobPatchRoute, /prisma\.jobAcceptance\./, "Save Changes never touches JobAcceptance records");
assert.match(editJobPatchRoute, /where: \{\s*\n\s*id: resolvedParams\.id\s*\n\s*\},\s*\n\s*data: updateData,/, "the same job row is updated in place — no duplicate job is created");

// 11/12/13/14. Tier pricing/limits/pricing untouched — protected Stripe/subscription flow.
assert.match(createCheckout, /handyman: \{[\s\S]{0,120}price: 4900,[\s\S]{0,40}categories: 3,/, "Handyman tier price/limit unchanged");
assert.match(createCheckout, /renovation: \{[\s\S]{0,120}price: 9900,[\s\S]{0,40}categories: 6,/, "Renovation Xbert tier price/limit unchanged");
assert.match(createCheckout, /general: \{[\s\S]{0,160}price: 14900,/, "General Contractor tier price unchanged");

console.log("category-consistency tests passed");
