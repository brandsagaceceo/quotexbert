import assert from "node:assert/strict";
import fs from "node:fs";

const profile = fs.readFileSync("app/profile/page.tsx", "utf8");
const subscriptionApi = fs.readFileSync("app/api/user/subscription/route.ts", "utf8");
const categories = fs.readFileSync("lib/categories.ts", "utf8");

assert.match(profile, /SIMPLE_CATEGORIES/);
assert.match(profile, /const normalizedTier = String\(subscriptionData\.subscriptionPlan \|\| ''\)\.toLowerCase\(\)/);
assert.match(profile, /'general': SIMPLE_CATEGORIES\.length/);
assert.doesNotMatch(profile, /'general': 10/);
assert.match(profile, /subscriptionData\.activeCategories/);
assert.match(profile, /SIMPLE_CATEGORIES\.filter\(\(category\) => !selectedCategories\.includes\(category\)\)/);
assert.match(profile, /setIsGeneralSyncing\(/);
assert.match(profile, /maxCategories === 0 && !isGeneralSyncing/);
assert.match(profile, /category access is still syncing/);
assert.match(profile, /normalizedTier === 'general' && activeSubscription/);

assert.match(subscriptionApi, /getActiveSubscriptionCategories/);
assert.match(subscriptionApi, /activeCategories/);
assert.match(categories, /export const SIMPLE_CATEGORIES = \[/);
assert.match(categories, /"Other",\s*\]\s*as const/);

assert.equal((profile.match(/SIMPLE_CATEGORIES\.length/g) || []).length >= 2, true);
console.log("profile category display tests passed");