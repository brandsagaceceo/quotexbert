import assert from "node:assert/strict";
import fs from "node:fs";

// Contractor quote-privacy hotfix regression — source-assertion style (matches
// scripts/quote-send-flow.test.ts / scripts/job-fairness.test.ts). No live DB.
//
// Intended marketplace rule: a contractor may only ever read their OWN quote(s);
// only the job's homeowner may read every competing contractor's quote details.
// Enforcement MUST be server-side (not React field-hiding). These endpoints
// previously had NO auth/ownership check — a contractor could tamper a query
// param (conversationId / homeownerId / contractorId / quote id) to read a
// rival's amount, scope, line items and identity (IDOR).

const collection = fs.readFileSync("app/api/quotes/route.ts", "utf8");
const byId = fs.readFileSync("app/api/quotes/[id]/route.ts", "utf8");
const homeownerQuotes = fs.readFileSync("app/api/homeowner/quotes/route.ts", "utf8");

// ── 1. GET /api/quotes — authenticates and never trusts client ids ──────────
assert.match(collection, /import \{ resolveAuthUser \} from "@\/lib\/server-auth"/, "collection route must import resolveAuthUser");
const collectionGet = collection.slice(
  collection.indexOf("export async function GET"),
  collection.indexOf("export async function POST"),
);
assert.match(collectionGet, /await resolveAuthUser\(\)/, "GET /api/quotes must authenticate the caller");
assert.match(collectionGet, /const \{ dbUserId \} = authResult\.user/, "GET /api/quotes must resolve the DB user id");

// Contractor is pinned to their OWN quotes — the supplied contractorId is ignored.
assert.match(collectionGet, /where\.contractorId = dbUserId/, "contractor reads must be pinned to the authenticated user's own quotes");
assert.doesNotMatch(collectionGet, /where\.contractorId = user\?\.id \?\? contractorId/, "must not trust a client-supplied contractorId param");

// Homeowner filter is pinned to the authenticated homeowner, not a supplied id.
assert.match(collectionGet, /where\.conversation = \{ homeownerId: dbUserId \}/, "homeowner reads must be pinned to the authenticated homeowner");

// conversationId path verifies participation and 403s outsiders.
assert.match(collectionGet, /prisma\.conversation\.findUnique/, "conversationId path must load the conversation to check participation");
assert.match(collectionGet, /return NextResponse\.json\(\{ error: "Forbidden" \}, \{ status: 403 \}\)/, "non-participants must be denied with 403");
assert.match(collectionGet, /if \(!isHomeowner\) where\.contractorId = dbUserId/, "a contractor on the conversation may still only see their own quotes");

// ── 2. GET /api/quotes/[id] — ownership check before returning full detail ──
const byIdGet = byId.slice(
  byId.indexOf("export async function GET"),
  byId.indexOf("export async function PUT"),
);
assert.match(byIdGet, /await resolveAuthUser\(\)/, "GET /api/quotes/[id] must authenticate the caller");
assert.match(byIdGet, /const ownsAsContractor = quote\.contractorId === dbUserId/, "must compute owning-contractor check");
assert.match(byIdGet, /const ownsAsHomeowner = quote\.conversation\?\.homeownerId === dbUserId/, "must compute owning-homeowner check");
assert.match(byIdGet, /if \(!ownsAsContractor && !ownsAsHomeowner\) \{\s*\n\s*return NextResponse\.json\(\{ error: "Forbidden" \}, \{ status: 403 \}\)/, "a non-owning contractor must be denied a rival quote by id (403)");

// ── 3. GET /api/homeowner/quotes — pinned to authenticated homeowner ────────
assert.match(homeownerQuotes, /import \{ resolveAuthUser \} from "@\/lib\/server-auth"/, "homeowner quotes route must import resolveAuthUser");
assert.match(homeownerQuotes, /await resolveAuthUser\(\)/, "GET /api/homeowner/quotes must authenticate the caller");
assert.match(homeownerQuotes, /homeownerId: dbUserId/, "homeowner quotes must be scoped to the authenticated user, not a supplied param");
assert.doesNotMatch(homeownerQuotes, /homeownerId: homeownerId/, "must not trust a client-supplied homeownerId param");

// ── 4. Homeowner comparison capability is preserved ─────────────────────────
// The homeowner list still includes contractor identity + full quote detail so
// they can compare competing quotes — only the AUTH scope changed, not the shape.
assert.match(homeownerQuotes, /contractorProfile: \{/, "homeowner list must still include contractor identity for comparison");
assert.match(homeownerQuotes, /items: \{/, "homeowner list must still include line items for comparison");

// ── 5. Mutations remain untouched (send path not weakened) ──────────────────
// The privacy hotfix must not have altered ownership on the write paths.
assert.match(byId, /existing\.contractorId !== authResult\.user\.dbUserId/, "PUT ownership check must remain intact");

console.log("quote-privacy tests passed");
