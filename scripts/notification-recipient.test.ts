import assert from "node:assert/strict";
import {
  buildLeadNotificationPayload,
  getLeadNotificationAccess,
  type LeadNotificationAudience,
} from "../lib/notifications";

const now = new Date("2026-08-02T12:00:00.000Z").getTime();

const baseJob = {
  leadId: "lead_test_1",
  title: "Replace cracked shower base",
  description: "Homeowner needs a shower base replaced and surrounding tile repaired.",
  budget: "$4,000 - $6,000",
  city: "Toronto",
  province: "ON",
  category: "bathroom-renovation",
  createdAt: "2026-08-02T11:30:00.000Z",
};

function contractor(subscriptions: LeadNotificationAudience["subscriptions"], isActive = true): LeadNotificationAudience {
  return { isActive, subscriptions };
}

assert.equal(
  getLeadNotificationAccess(
    contractor([{ category: "Renovation", status: "active", canClaimLeads: true, currentPeriodEnd: new Date(now + 86_400_000) }]),
    "bathroom-renovation",
    now,
  ),
  "full",
  "matching paid contractor gets full notification access"
);

const fullPayload = buildLeadNotificationPayload(baseJob, "full");
assert.equal(fullPayload.fullAccess, true, "full payload flags full access");
assert.equal(fullPayload.budget, "$4,000 - $6,000", "full payload retains budget");
assert.equal(fullPayload.city, "Toronto", "full payload retains location");

assert.equal(
  getLeadNotificationAccess(
    contractor([{ category: "Electrical", status: "active", canClaimLeads: true, currentPeriodEnd: new Date(now + 86_400_000) }]),
    "bathroom-renovation",
    now,
  ),
  "teaser",
  "unsubscribed contractor still receives teaser notification"
);

const teaserPayload = buildLeadNotificationPayload(baseJob, "teaser");
assert.equal(teaserPayload.fullAccess, false, "teaser payload flags limited access");
assert.equal(teaserPayload.budget, null, "teaser payload hides budget details");
assert.equal(teaserPayload.city, "Your area", "teaser payload hides exact location");
assert.match(teaserPayload.description, /Subscribe to unlock full details/i, "teaser payload contains upgrade call to action");

assert.equal(
  getLeadNotificationAccess(
    contractor([{ category: "Renovation", status: "canceled", canClaimLeads: false, currentPeriodEnd: new Date(now + 86_400_000) }]),
    "bathroom-renovation",
    now,
  ),
  "teaser",
  "cancelled subscriptions fall back to teaser notifications"
);

assert.equal(
  getLeadNotificationAccess(
    contractor([{ category: "Renovation", status: "active", canClaimLeads: true, currentPeriodEnd: new Date(now - 60_000) }]),
    "bathroom-renovation",
    now,
  ),
  "teaser",
  "expired entitlements fall back to teaser notifications"
);

assert.equal(
  getLeadNotificationAccess(
    contractor([{ category: "Renovation", status: "active", canClaimLeads: true, currentPeriodEnd: new Date(now + 86_400_000) }], false),
    "bathroom-renovation",
    now,
  ),
  "skip",
  "inactive contractors do not receive notifications"
);

console.log("notification-recipient tests passed");