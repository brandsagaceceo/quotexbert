import assert from "node:assert/strict";
import { formatBudgetDisplay } from "../lib/currency";
import { normalizeCategory } from "../lib/categories";

function mapLeadForBoard(lead: {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string | null;
  city?: string | null;
  province?: string | null;
  zipCode?: string | null;
  createdAt: Date;
  hasAccess: boolean;
}) {
  const hasAccess = Boolean(lead.hasAccess);
  const simpleCategory = normalizeCategory(lead.category || "Handyman");
  const teaserLocation = lead.city || lead.zipCode || "Your area";

  return {
    title: hasAccess ? lead.title : `New ${simpleCategory} job available`,
    description: hasAccess
      ? lead.description
      : `A new ${simpleCategory} job is available in ${teaserLocation}. Subscribe to unlock the full scope and claim this lead.`,
    category: lead.category,
    simpleCategory,
    budget: hasAccess ? formatBudgetDisplay(lead.budget) : "Budget hidden until you subscribe",
    location: hasAccess
      ? ([lead.city, lead.province].filter(Boolean).join(", ") || lead.zipCode || "Location TBD")
      : teaserLocation,
    hasAccess,
    isLocked: !hasAccess,
  };
}

const paidJob = mapLeadForBoard({
  id: "lead-paid",
  title: "Full kitchen renovation with island",
  description: "Need licensed contractor for a complete kitchen renovation.",
  category: "bathroom-renovation",
  budget: "$18,000 - $25,000",
  city: "Toronto",
  province: "ON",
  zipCode: "M5V 3A8",
  createdAt: new Date("2026-08-02T10:00:00.000Z"),
  hasAccess: true,
});

assert.equal(paidJob.hasAccess, true, "paid contractor sees unlocked job");
assert.equal(paidJob.title, "Full kitchen renovation with island", "paid contractor keeps full title");
assert.equal(paidJob.location, "Toronto, ON", "paid contractor keeps full location");

const lockedJob = mapLeadForBoard({
  id: "lead-locked",
  title: "Install heat pump and ducting",
  description: "Need HVAC contractor to install a new cold-climate heat pump.",
  category: "heating-cooling-hvac",
  budget: "$9,000 - $14,000",
  city: "Whitby",
  province: "ON",
  zipCode: "L1N 9G8",
  createdAt: new Date("2026-08-02T10:00:00.000Z"),
  hasAccess: false,
});

assert.equal(lockedJob.hasAccess, false, "unsubscribed contractor sees locked job");
assert.equal(lockedJob.isLocked, true, "locked job is marked locked");
assert.equal(lockedJob.title, "New HVAC job available", "locked job hides protected title details");
assert.equal(lockedJob.location, "Whitby", "locked job keeps teaser city only");
assert.equal(lockedJob.budget, "Budget hidden until you subscribe", "locked job hides budget");
assert.match(lockedJob.description, /Subscribe to unlock/i, "locked job contains upgrade teaser");

console.log("job-visibility-rules tests passed");