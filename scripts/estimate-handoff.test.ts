import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import {
  queueEstimateForSignIn,
  resumePendingEstimate,
} from "../lib/estimate-handoff";

class MemoryStorage implements Storage {
  private values = new Map<string, string>();
  failWrites = false;
  get length() {
    return this.values.size;
  }
  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }
  clear() {
    this.values.clear();
  }
  getItem(key: string) {
    return this.values.get(key) ?? null;
  }
  removeItem(key: string) {
    this.values.delete(key);
  }
  setItem(key: string, value: string) {
    if (this.failWrites) throw new Error("Fixture storage full");
    this.values.set(key, value);
  }
}

const storage = new MemoryStorage();
const key = "pending_save_estimate";
const payload = {
  description: "Test renovation",
  minCost: 100,
  maxCost: 200,
  confidence: 80,
  images: [],
};
const originalFetch = globalThis.fetch;
const originalStorage = Object.getOwnPropertyDescriptor(
  globalThis,
  "localStorage",
);
const reply = (value: unknown, status = 200) =>
  new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  });

async function main() {
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: storage,
  });
  queueEstimateForSignIn(payload);
  const firstRaw = storage.getItem(key);
  globalThis.fetch = async () =>
    reply({ success: false, error: "Fixture storage unavailable" }, 503);
  await assert.rejects(
    resumePendingEstimate("owner-1"),
    /Fixture storage unavailable/,
  );
  assert.equal(
    storage.getItem(key),
    firstRaw,
    "failed saves retain the exact queued request",
  );
  globalThis.fetch = async () => {
    throw new Error("Fixture offline");
  };
  await assert.rejects(
    resumePendingEstimate("owner-1"),
    /remains in this browser/,
  );
  assert.equal(storage.getItem(key), firstRaw);
  globalThis.fetch = async () => reply({ success: true });
  await assert.rejects(resumePendingEstimate("owner-1"), /not confirmed/);
  assert.equal(
    storage.getItem(key),
    firstRaw,
    "success without a saved record must not clear the queue",
  );

  storage.setItem(key, JSON.stringify(payload));
  const requestIds: string[] = [];
  globalThis.fetch = async (_input, init) => {
    const body = JSON.parse(String(init?.body)) as { clientRequestId: string };
    requestIds.push(body.clientRequestId);
    return requestIds.length === 1
      ? reply({ success: false, error: "Fixture retry" }, 503)
      : reply({ success: true, estimate: { id: body.clientRequestId } });
  };
  await assert.rejects(resumePendingEstimate("owner-1"), /Fixture retry/);
  assert.ok(
    storage.getItem(key)?.includes("clientRequestId"),
    "legacy caches receive a durable request identifier before POST",
  );
  assert.equal(await resumePendingEstimate("owner-1"), true);
  assert.equal(
    requestIds[0],
    requestIds[1],
    "retries reuse the same request identifier",
  );
  assert.equal(storage.getItem(key), null);

  queueEstimateForSignIn(payload);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    await gate;
    return reply({ success: true, estimate: { id: "fixture-saved" } });
  };
  const first = resumePendingEstimate("owner-1");
  const second = resumePendingEstimate("owner-1");
  await Promise.resolve();
  assert.equal(calls, 1, "concurrent mount effects share one request");
  queueEstimateForSignIn({ ...payload, description: "A newer test estimate" });
  const newerRaw = storage.getItem(key);
  release();
  await Promise.all([first, second]);
  assert.equal(
    storage.getItem(key),
    newerRaw,
    "an older completion cannot remove a newer queued estimate",
  );

  storage.setItem(key, "{bad-json");
  await assert.rejects(resumePendingEstimate("owner-1"), /could not be read/);
  assert.equal(storage.getItem(key), "{bad-json");
  storage.failWrites = true;
  assert.throws(() => queueEstimateForSignIn(payload), /Fixture storage full/);
  assert.equal(storage.getItem(key), "{bad-json");
  storage.failWrites = false;
  storage.clear();

  for (const [filename, name] of [
    [join("app", "page.tsx"), "handleGetContractorBids"],
    [join("app", "landing", "estimate", "page.tsx"), "handleGetBids"],
  ] as const) {
    const source = ts.createSourceFile(
      filename,
      readFileSync(filename, "utf8"),
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const initializers: ts.Expression[] = [];
    function findHandler(node: ts.Node) {
      if (
        ts.isVariableDeclaration(node) &&
        node.name.getText(source) === name
      ) {
        if (node.initializer) initializers.push(node.initializer);
        return;
      }
      ts.forEachChild(node, findHandler);
    }
    findHandler(source);
    assert.equal(initializers.length, 1);
    const initializer = initializers[0];
    assert.ok(initializer, "The existing estimate CTA must remain wired");
    const code = ts.transpileModule(`(${initializer.getText(source)})`, {
      compilerOptions: { target: ts.ScriptTarget.ES2020 },
    }).outputText;
    for (const signedIn of [false, true]) {
      storage.clear();
      const location = { href: "initial" };
      let errors = 0;
      const handler: unknown = runInNewContext(code, {
        estimateResult: {
          summary: "Test kitchen",
          totals: { total_low: 100, total_high: 200 },
        },
        isSignedIn: signedIn,
        localStorage: storage,
        window: { location },
        toast: {
          error: () => {
            errors++;
          },
        },
        trackCTAClick: () => {},
        trackCreateAccountClicked: () => {},
      });
      assert.ok(typeof handler === "function");
      handler();
      assert.equal(
        location.href,
        signedIn ? "/create-lead" : "/sign-up?redirect_url=%2Fcreate-lead",
      );
      const cached = JSON.parse(storage.getItem("estimate_data") || "null") as {
        projectDescription: string;
        min: number;
        max: number;
      };
      assert.deepEqual(
        {
          projectDescription: cached.projectDescription,
          min: cached.min,
          max: cached.max,
        },
        { projectDescription: "Test kitchen", min: 100, max: 200 },
      );
      storage.failWrites = true;
      location.href = "initial";
      handler();
      assert.equal(errors, 1, "storage failure must be visible");
      assert.equal(
        location.href,
        "initial",
        "do not navigate after failing to preserve the estimate",
      );
      assert.equal(storage.getItem("estimate_data"), JSON.stringify(cached));
      storage.failWrites = false;
    }
  }
  storage.clear();

  let owner: string | null = "owner-1";
  let legacyCreates = 0;
  let uniqueRace = false;
  let failDatabase = false;
  let raceLookups = 0;
  const rows = new Map<string, Record<string, unknown> & { id: string }>();
  const moduleConstructor = require("node:module").Module as new (
    id: string,
  ) => NodeModule;
  const mock = (specifier: string, exports: Record<string, unknown>) => {
    const filename = require.resolve(specifier);
    const module = new moduleConstructor(filename);
    module.filename = filename;
    module.loaded = true;
    module.exports = exports;
    require.cache[filename] = module;
  };
  mock("@/lib/homeowner-auth", {
    resolveHomeownerIdentity: async () =>
      owner
        ? { success: true, user: { dbUserId: owner } }
        : { success: false, status: 401, error: "Authentication required" },
  });
  mock("@/lib/prisma", {
    prisma: {
      aIEstimate: {
        create: async ({ data }: { data: Record<string, unknown> }) => {
          legacyCreates++;
          const record = { ...data, id: `legacy-${legacyCreates}`, items: [] };
          rows.set(record.id, record);
          return record;
        },
        upsert: async ({
          where,
          create,
          update,
        }: {
          where: { id: string };
          create: Record<string, unknown>;
          update: Record<string, never>;
        }) => {
          assert.deepEqual(
            update,
            {},
            "retry requests must not modify existing customer records",
          );
          if (failDatabase) throw new Error("Fixture database unavailable");
          const existing = rows.get(where.id);
          if (existing) return existing;
          const record = { ...create, id: where.id, items: [] };
          rows.set(where.id, record);
          if (uniqueRace) {
            uniqueRace = false;
            throw Object.assign(new Error("Fixture concurrent creation"), {
              code: "P2002",
            });
          }
          return record;
        },
        findUnique: async ({ where }: { where: { id: string } }) => {
          raceLookups++;
          return rows.get(where.id) ?? null;
        },
      },
    },
  });
  const route =
    require("../app/api/ai-estimates/save/route") as typeof import("../app/api/ai-estimates/save/route");
  const send = (body: Record<string, unknown>) =>
    route.POST(
      new NextRequest("https://example.test/api/ai-estimates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
  owner = null;
  assert.equal((await send(payload)).status, 401);
  assert.equal(rows.size, 0);
  owner = "owner-1";
  for (const clientRequestId of [null, 123, "invalid-request"]) {
    assert.equal((await send({ ...payload, clientRequestId })).status, 400);
  }
  assert.equal(rows.size, 0);
  const requestId = "12345678-1234-4234-8234-123456789012";
  const body = {
    ...payload,
    homeownerId: "untrusted-client-owner",
    clientRequestId: requestId,
  };
  assert.equal((await send(body)).status, 200);
  assert.equal(rows.get(requestId)?.homeownerId, "owner-1");
  assert.equal(rows.get(requestId)?.isPublic, false);
  assert.equal((await send(body)).status, 200);
  assert.equal(rows.size, 1);
  owner = "owner-2";
  const collision = await send(body);
  assert.equal(collision.status, 409);
  assert.equal("estimate" in (await collision.json()), false);
  assert.equal(rows.get(requestId)?.homeownerId, "owner-1");
  owner = "owner-1";
  uniqueRace = true;
  assert.equal(
    (
      await send({
        ...body,
        clientRequestId: "12345678-1234-4234-8234-123456789013",
      })
    ).status,
    200,
  );
  assert.equal(raceLookups, 1);
  failDatabase = true;
  assert.equal(
    (
      await send({
        ...body,
        clientRequestId: "12345678-1234-4234-8234-123456789014",
      })
    ).status,
    500,
  );
  failDatabase = false;
  assert.equal((await send(payload)).status, 200);
  assert.equal(
    legacyCreates,
    1,
    "legacy callers retain their existing create behavior",
  );

  let loseResponse = true;
  globalThis.fetch = async (_input, init) => {
    const response = await route.POST(
      new NextRequest(
        new Request("https://example.test/api/ai-estimates/save", init),
      ),
    );
    if (loseResponse) {
      loseResponse = false;
      throw new Error("Fixture response lost after commit");
    }
    return response;
  };
  const before = rows.size;
  queueEstimateForSignIn(payload);
  await assert.rejects(
    resumePendingEstimate("owner-1"),
    /remains in this browser/,
  );
  assert.equal(rows.size, before + 1);
  assert.ok(storage.getItem(key));
  await resumePendingEstimate("owner-1");
  assert.equal(
    rows.size,
    before + 1,
    "a lost response followed by retry must not create another estimate",
  );
  assert.equal(storage.getItem(key), null);
  console.log(
    "Estimate sign-in handoff, retry idempotency and existing save API tests passed",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => {
    globalThis.fetch = originalFetch;
    if (originalStorage)
      Object.defineProperty(globalThis, "localStorage", originalStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
  });
