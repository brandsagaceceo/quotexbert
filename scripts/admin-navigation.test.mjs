import assert from "node:assert/strict";
import fs from "node:fs";

const config = JSON.parse(fs.readFileSync("vercel.json", "utf8"));
assert.ok(fs.existsSync("app/admin/page.tsx"), "the admin dashboard exists");
assert.ok(
  !config.redirects?.some((redirect) => redirect.source === "/admin"),
  "the admin dashboard must not redirect to a missing page",
);

console.log("admin navigation configuration test passed");
