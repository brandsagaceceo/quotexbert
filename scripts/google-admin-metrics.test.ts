import assert from "node:assert/strict";
import {
  fetchGoogleAdminMetrics,
  getGoogleConnectionStatus,
} from "../lib/google-admin-metrics";

async function main() {
  const names = [
    "GOOGLE_SERVICE_ACCOUNT_EMAIL",
    "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
    "GOOGLE_SEARCH_CONSOLE_PROPERTY_URL",
    "GOOGLE_ANALYTICS_PROPERTY_ID",
  ] as const;
  const original = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );

  for (const name of names) delete process.env[name];
  assert.deepEqual(getGoogleConnectionStatus(), {
    serviceAccountConfigured: false,
    searchConsolePropertyConfigured: false,
    analyticsPropertyConfigured: false,
  });

  const disconnected = await fetchGoogleAdminMetrics(7);
  assert.equal(disconnected.searchConsole.connected, false);
  assert.equal(disconnected.analytics.connected, false);
  assert.equal(disconnected.searchConsole.error, null);
  assert.equal(disconnected.analytics.error, null);

  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "metrics@example.test";
  process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "configured-for-test";
  process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY_URL = "sc-domain:quotexbert.com";
  process.env.GOOGLE_ANALYTICS_PROPERTY_ID = "123456789";
  assert.deepEqual(getGoogleConnectionStatus(), {
    serviceAccountConfigured: true,
    searchConsolePropertyConfigured: true,
    analyticsPropertyConfigured: true,
  });

  for (const name of names) {
    const value = original[name];
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }

  console.log("Google administrator metrics tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
