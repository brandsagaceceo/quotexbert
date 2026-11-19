import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import { NextResponse } from "next/server";
import ts from "typescript";

const code = ts.transpileModule(readFileSync(path.join(process.cwd(), "app", "api", "stats", "route.ts"), "utf8"), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
}).outputText;

function fixture({ jobs = 0, contractors = 0, reviews = 0, rating = null, fail = false }: {
  jobs?: number; contractors?: number; reviews?: number; rating?: number | null; fail?: boolean;
} = {}) {
  const queries: Array<{ where: { published: boolean; isSeeded: boolean } }> = [];
  const errors: unknown[][] = [];
  const exports: { GET?: () => Promise<Response> } = {};
  const prisma = {
    lead: { count: async (query: { where: { published: boolean; isSeeded: boolean } }) => {
      queries.push(query);
      if (fail) throw new Error("Private isolated fixture connection details");
      return jobs;
    } },
    user: { count: async () => contractors },
    review: { aggregate: async () => ({ _avg: { rating }, _count: { _all: reviews } }) },
  };
  vm.runInNewContext(code, {
    exports,
    require: (id: string) => {
      if (id === "next/server") return { NextResponse };
      if (id === "@/lib/prisma") return { prisma };
      throw new Error(`Unexpected dependency ${id}`);
    },
    Error,
    console: { error: (...args: unknown[]) => errors.push(args) },
  });
  assert.ok(exports.GET);
  return { get: exports.GET, queries, errors };
}

test("statistics use real aggregates and count only published non-seeded jobs", async () => {
  const actual = fixture({ jobs: 3, contractors: 7, reviews: 2, rating: 4.25 });
  const response = await actual.get();
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { totalJobs: 3, totalContractors: 7, avgRating: 4.3, totalReviews: 2 });
  assert.equal(actual.queries[0]?.where.published, true);
  assert.equal(actual.queries[0]?.where.isSeeded, false);
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("zero reviews have no invented star rating", async () => {
  const response = await fixture().get();
  assert.deepEqual(await response.json(), { totalJobs: 0, totalContractors: 0, avgRating: null, totalReviews: 0 });
});

test("database failure is unavailable, not fabricated platform activity", async () => {
  const actual = fixture({ fail: true });
  const response = await actual.get();
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "Statistics are temporarily unavailable" });
  assert.equal(actual.errors.length, 1);
  assert.doesNotMatch(JSON.stringify(actual.errors), /Private isolated fixture/);
});
