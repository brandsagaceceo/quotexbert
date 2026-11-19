import assert from "node:assert/strict";
import fs from "node:fs";

const dashboard = fs.readFileSync("app/admin/page.tsx", "utf8");
const usageApi = fs.readFileSync("app/api/admin/usage/route.ts", "utf8");

assert.match(
  dashboard,
  /fetch\("\/api\/admin\/usage\?metric=overview&period=30d"/,
  "the existing admin dashboard loads the authenticated real usage endpoint",
);
assert.match(
  dashboard,
  /No sample activity is shown/,
  "the dashboard labels its database snapshot honestly",
);
assert.doesNotMatch(
  dashboard,
  /Load mock stats|totalLeads:\s*156|ABC Plumbing|\$45 payment processed/,
  "fabricated administrator totals and activity are removed",
);
assert.match(
  usageApi,
  /import \{ prisma \} from '@\/lib\/prisma'/,
  "the usage endpoint reuses the shared Prisma client",
);
assert.doesNotMatch(
  usageApi,
  /new PrismaClient/,
  "the usage endpoint does not create an extra database client",
);
assert.match(
  usageApi,
  /where: \{ isSeeded: false, createdAt: \{ gte: startDate \} \}/,
  "recent job activity excludes seeded records",
);
assert.match(
  usageApi,
  /recentActivity[\s\S]*\.sort\([\s\S]*\.slice\(0, 10\)/,
  "real account, job and transaction activity is ordered and bounded",
);

console.log("admin dashboard real-data tests passed");
