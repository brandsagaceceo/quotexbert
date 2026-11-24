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
    "GOOGLE_WORKLOAD_IDENTITY_PROVIDER",
    "VERCEL_ENV",
    "VERCEL_OIDC_TOKEN",
  ] as const;
  const original = Object.fromEntries(
    names.map((name) => [name, process.env[name]]),
  );
  const originalFetch = globalThis.fetch;
  const originalNow = Date.now;
  const provider =
    "projects/123/locations/global/workloadIdentityPools/vercel/providers/vercel";
  const fixtureToken = [
    Buffer.from(JSON.stringify({ alg: "RS256" })).toString("base64url"),
    Buffer.from(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 }),
    ).toString("base64url"),
    "test-signature",
  ].join(".");
  let mode = "success";
  const calls: string[] = [];

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    calls.push(url);
    const body = JSON.parse(String(init?.body));
    if (url === "https://oidc.vercel.com/~token") {
      assert.equal(body.aud, `https://iam.googleapis.com/${provider}`);
      if (mode === "oidc-error") {
        return Response.json({ error: "sensitive-fixture" }, { status: 401 });
      }
      return Response.json({ token: fixtureToken });
    }
    assert.equal(init?.cache, "no-store");
    if (url === "https://sts.googleapis.com/v1/token") {
      assert.equal(body.audience, `//iam.googleapis.com/${provider}`);
      assert.equal(body.subject_token, fixtureToken);
      if (mode === "sts-error") {
        return Response.json({ error: "sensitive-fixture" }, { status: 403 });
      }
      if (mode === "malformed") {
        return new Response('{"access_token":"sensitive-fixture');
      }
      return Response.json({ access_token: "federated-test-access" });
    }
    if (url.includes("iamcredentials.googleapis.com")) {
      assert.equal(
        new Headers(init?.headers).get("Authorization"),
        "Bearer federated-test-access",
      );
      assert.deepEqual(body.scope, [
        "https://www.googleapis.com/auth/webmasters.readonly",
        "https://www.googleapis.com/auth/analytics.readonly",
      ]);
      assert.equal(body.lifetime, "600s");
      return Response.json({
        accessToken: "reporting-test-access",
        expireTime:
          mode === "expired"
            ? new Date(0).toISOString()
            : new Date(Date.now() + 600_000).toISOString(),
      });
    }
    assert.equal(
      new Headers(init?.headers).get("Authorization"),
      "Bearer reporting-test-access",
    );
    if (url.includes("searchconsole.googleapis.com")) {
      return Response.json({
        rows: [
          {
            keys: ["renovation quote"],
            clicks: 4,
            impressions: 80,
            ctr: 0.05,
            position: 9,
          },
        ],
      });
    }
    if (url.includes("analyticsdata.googleapis.com")) {
      return Response.json({
        rows: [
          {
            dimensionValues: [{ value: "/blog/test" }],
            metricValues: ["11", "21", "31", "2"].map((value) => ({ value })),
          },
        ],
      });
    }
    throw new Error("Unexpected network request in Google metrics test");
  };

  try {
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
    assert.deepEqual(disconnected.analytics.trafficSources, []);
    assert.deepEqual(disconnected.analytics.landingPages, []);
    assert.deepEqual(disconnected.analytics.blogPages, []);

    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "metrics@example.test";
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY = "configured-for-test";
    process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY_URL = "sc-domain:quotexbert.com";
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID = "123456789";
    assert.deepEqual(getGoogleConnectionStatus(), {
      serviceAccountConfigured: true,
      searchConsolePropertyConfigured: true,
      analyticsPropertyConfigured: true,
    });

    process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER = provider;
    process.env.VERCEL_ENV = "production";
    const blocked = await fetchGoogleAdminMetrics(7);
    assert.match(blocked.analytics.error || "", /Vercel Preview/);
    assert.equal(calls.length, 0);

    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_OIDC_TOKEN = fixtureToken;
    process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER = "https://untrusted.test";
    const invalidProvider = await fetchGoogleAdminMetrics(7);
    assert.match(invalidProvider.analytics.error || "", /resource is invalid/);
    assert.equal(calls.length, 0);
    process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER = provider;

    for (const failure of ["oidc-error", "sts-error", "malformed", "expired"]) {
      mode = failure;
      const failed = await fetchGoogleAdminMetrics(7);
      assert.equal(failed.analytics.connected, false);
      assert.equal(failed.searchConsole.connected, false);
      assert.ok(failed.analytics.error);
      assert.equal(failed.analytics.error, failed.searchConsole.error);
      assert.doesNotMatch(failed.analytics.error, /sensitive-fixture/);
      assert.ok(!calls.includes("https://oauth2.googleapis.com/token"));
    }

    mode = "success";
    delete process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    assert.equal(getGoogleConnectionStatus().serviceAccountConfigured, true);
    const connected = await fetchGoogleAdminMetrics(7);
    assert.equal(connected.analytics.error, null);
    assert.equal(connected.searchConsole.error, null);
    assert.equal(connected.analytics.connected, true);
    assert.equal(connected.searchConsole.connected, true);
    assert.equal(connected.analytics.activeUsers, 11);
    assert.equal(connected.analytics.pageViews, 31);
    assert.equal(connected.searchConsole.clicks, 4);
    assert.equal(connected.searchConsole.queries[0]?.query, "renovation quote");
    assert.equal(connected.analytics.blogPages[0]?.path, "/blog/test");

    const exchanges = () =>
      calls.filter((url) => url === "https://sts.googleapis.com/v1/token")
        .length;
    const beforeReuse = exchanges();
    await fetchGoogleAdminMetrics(7);
    assert.equal(
      exchanges(),
      beforeReuse,
      "reuse the short-lived Google token",
    );
    process.env.VERCEL_ENV = "production";
    const blockedCachedToken = await fetchGoogleAdminMetrics(7);
    assert.match(blockedCachedToken.analytics.error || "", /Vercel Preview/);
    process.env.VERCEL_ENV = "preview";
    Date.now = () => originalNow() + 601_000;
    await fetchGoogleAdminMetrics(7);
    assert.equal(
      exchanges(),
      beforeReuse + 1,
      "refresh an expired Google token",
    );
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = originalNow;
    for (const name of names) {
      const value = original[name];
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
  }

  console.log("Google administrator metrics tests passed");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
