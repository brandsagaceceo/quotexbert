import assert from "node:assert/strict";
import { categoryMatchesEntitlement, uniqueNormalizedCategories } from "../lib/subscription-access";
import { normalizeSubscriptionCategoryList, parseSubscriptionMetadataCategories } from "../lib/subscription-categories";

const oneCategory = parseSubscriptionMetadataCategories(JSON.stringify(["painting-interior-exterior"]));
assert.deepEqual(oneCategory, ["painting-interior-exterior"], "stores one selected category");
const paintingEntitlement = oneCategory[0]!;
assert.equal(categoryMatchesEntitlement("Painting", paintingEntitlement), true, "painting jobs match painting entitlement");
assert.equal(categoryMatchesEntitlement("Flooring", paintingEntitlement), false, "flooring jobs do not match painting entitlement");

const threeCategories = parseSubscriptionMetadataCategories(
  JSON.stringify(["painting-interior-exterior", "drywall-plastering", "flooring-installation-repair"])
);
assert.deepEqual(
  uniqueNormalizedCategories(threeCategories).sort(),
  ["Flooring", "Handyman", "Painting"].sort(),
  "three paid category slugs normalize to three accessible job categories"
);
assert.equal(threeCategories.some((category) => categoryMatchesEntitlement("Painting", category)), true);
assert.equal(threeCategories.some((category) => categoryMatchesEntitlement("Handyman", category)), true);
assert.equal(threeCategories.some((category) => categoryMatchesEntitlement("Flooring", category)), true);

const differentOrder = parseSubscriptionMetadataCategories(
  JSON.stringify(["flooring-installation-repair", "painting-interior-exterior", "drywall-plastering"])
);
assert.deepEqual(
  uniqueNormalizedCategories(differentOrder).sort(),
  uniqueNormalizedCategories(threeCategories).sort(),
  "category order does not affect access"
);

const duplicates = normalizeSubscriptionCategoryList([
  "painting-interior-exterior",
  "painting-interior-exterior",
  "Painting",
]);
assert.deepEqual(duplicates, ["painting-interior-exterior", "Painting"], "exact duplicate slugs are saved once while legacy simple category remains valid");
assert.deepEqual(uniqueNormalizedCategories(duplicates), ["Painting"], "duplicate simple access collapses to one visible job category");

const csvMetadata = parseSubscriptionMetadataCategories("painting-interior-exterior,drywall-plastering,flooring-installation-repair");
assert.deepEqual(csvMetadata, threeCategories, "comma-separated metadata fallback parses all categories");

assert.equal(categoryMatchesEntitlement("plumbing", "Plumbing"), true, "lowercase simple lead category matches legacy simple entitlement");
assert.equal(categoryMatchesEntitlement("hvac", "HVAC"), true, "lowercase HVAC lead category matches legacy simple entitlement");
assert.equal(categoryMatchesEntitlement("general-plumbing", "Plumbing"), true, "detailed plumbing category matches legacy simple entitlement");
assert.equal(categoryMatchesEntitlement("bathroom-renovation", "Renovation"), true, "detailed renovation category matches legacy simple entitlement");
assert.equal(categoryMatchesEntitlement("general-renovation", "Renovation"), true, "freeform renovation category matches legacy simple entitlement");
assert.equal(categoryMatchesEntitlement("appliance-repair", "Other"), true, "detailed other category matches legacy simple entitlement");

console.log("subscription-category-access tests passed");