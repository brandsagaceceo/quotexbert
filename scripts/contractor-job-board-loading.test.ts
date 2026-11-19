import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = ts.createSourceFile(
  "page.tsx",
  readFileSync(path.join(process.cwd(), "app", "contractor", "jobs", "page.tsx"), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
let loader: ts.ArrowFunction | undefined;
let listState: ts.ConditionalExpression | undefined;
function visit(node: ts.Node) {
  if (
    ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) &&
    node.name.text === "fetchJobs" && node.initializer && ts.isArrowFunction(node.initializer)
  ) loader = node.initializer;
  if (ts.isConditionalExpression(node) && node.condition.getText(source) === "loading") {
    listState = node;
  }
  ts.forEachChild(node, visit);
}
visit(source);
assert.ok(loader && listState, "exercise the actual existing loader and list-state JSX");
const compile = (code: string) => ts.transpileModule(code, {
  fileName: "check.tsx",
  compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
}).outputText;
const loaderCode = compile(`(${loader.getText(source)})`);
const listCode = compile(`(${listState.getText(source)})`);

function makeLoader(initialFetch: () => Promise<Response>) {
  const state: {
    jobs: unknown[];
    message: string;
    loadError: string | null;
    loading: boolean;
  } = { jobs: [{ id: "previous" }], message: "Previous result", loadError: null, loading: false };
  let fetcher = initialFetch;
  const user: { current: { id: string } | null } = { current: { id: "contractor_1" } };
  const loggedErrors: unknown[][] = [];
  const urls: string[] = [];
  const load: () => Promise<void> = vm.runInNewContext(loaderCode, {
    get user() { return user.current; },
    jobsRequestId: { current: 0 },
    setJobs: (jobs: unknown[]) => { state.jobs = jobs; },
    setMessage: (message: string) => { state.message = message; },
    setLoadError: (error: string | null) => { state.loadError = error; },
    setLoading: (loading: boolean) => { state.loading = loading; },
    fetch: (url: string) => { urls.push(url); return fetcher(); },
    console: { error: (...args: unknown[]) => loggedErrors.push(args) },
    Error,
    SyntaxError,
  });
  return {
    state, load, loggedErrors, urls,
    setFetch: (next: () => Promise<Response>) => { fetcher = next; },
    signOut: () => { user.current = null; },
  };
}

function pendingResponse() {
  let resolve: (response: Response) => void = () => { throw new Error("Not initialized"); };
  const promise = new Promise<Response>((complete) => { resolve = complete; });
  return { promise, resolve };
}

test("HTTP, malformed and transport failures are explicit, clear stale jobs, and recover", async () => {
  for (const [fetcher, expected] of [
    [async () => new Response("Unavailable", { status: 503 }), /HTTP 503/],
    [async () => new Response(null, { status: 401 }), /HTTP 401/],
    [async () => Response.json({ jobs: null }), /invalid response/],
    [async () => Response.json(null), /invalid response/],
    [async () => new Response("<html>Unavailable</html>"), /unreadable response/],
    [async () => { throw new Error("Network unavailable"); }, /Network unavailable/],
  ] satisfies Array<[() => Promise<Response>, RegExp]>) {
    const fixture = makeLoader(fetcher);
    await fixture.load();
    assert.match(fixture.state.loadError ?? "", expected);
    assert.equal(fixture.state.jobs.length, 0);
    assert.equal(fixture.state.message, "");
    assert.equal(fixture.state.loading, false);
    assert.equal(fixture.loggedErrors.length, 1);
    fixture.setFetch(async () => Response.json({ jobs: [{ id: "current" }], message: "Loaded" }));
    await fixture.load();
    assert.equal(fixture.state.loadError, null);
    assert.deepEqual(fixture.state.jobs, [{ id: "current" }]);
    assert.equal(fixture.state.message, "Loaded");
    assert.equal(fixture.urls[0], "/api/jobs?contractorId=contractor_1");
  }
});

test("current, legacy and genuinely empty responses remain compatible", async () => {
  for (const payload of [[{ id: "legacy" }], { jobs: [{ id: "current" }] }, { jobs: [] }]) {
    const fixture = makeLoader(async () => Response.json(payload));
    await fixture.load();
    assert.equal(fixture.state.loadError, null);
    assert.deepEqual(fixture.state.jobs, Array.isArray(payload) ? payload : payload.jobs);
    assert.equal(fixture.loggedErrors.length, 0);
  }
});

test("stale success or error cannot overwrite a newer completed request", async () => {
  for (const staleResponse of [
    Response.json({ jobs: [{ id: "stale" }] }),
    new Response(null, { status: 500 }),
  ]) {
    const old = pendingResponse();
    const fixture = makeLoader(() => old.promise);
    const first = fixture.load();
    fixture.setFetch(async () => Response.json({ jobs: [{ id: "newest" }] }));
    await fixture.load();
    old.resolve(staleResponse);
    await first;
    assert.deepEqual(fixture.state.jobs, [{ id: "newest" }]);
    assert.equal(fixture.state.loadError, null);
    assert.equal(fixture.state.loading, false);
  }
});

test("an older completion cannot end the current spinner or resurrect jobs after sign-out", async () => {
  const old = pendingResponse();
  const current = pendingResponse();
  const fixture = makeLoader(() => old.promise);
  const first = fixture.load();
  fixture.setFetch(() => current.promise);
  const second = fixture.load();
  old.resolve(Response.json({ jobs: [{ id: "old" }] }));
  await first;
  assert.equal(fixture.state.loading, true);
  fixture.signOut();
  await fixture.load();
  current.resolve(Response.json({ jobs: [{ id: "private" }] }));
  await second;
  assert.equal(fixture.state.jobs.length, 0);
  assert.equal(fixture.state.message, "Please sign in to view jobs.");
  assert.equal(fixture.state.loading, false);
  assert.equal(fixture.urls.length, 2);
});

test("actual list JSX renders an alert with retry, not an empty-board upsell, after failure", () => {
  const nodes: { type: unknown; props: Record<string, unknown> | null; children: unknown[] }[] = [];
  let retried = false;
  function render(error: string | null) {
    nodes.length = 0;
    return vm.runInNewContext(listCode, {
      loading: false, loadError: error, jobs: [], filteredJobs: [],
      fetchJobs: () => { retried = true; },
      Link: "a", LoadingState: "loading",
      React: {
        createElement: (type: unknown, props: Record<string, unknown> | null, ...children: unknown[]) => {
          const node = { type, props, children };
          nodes.push(node);
          return node;
        },
      },
    });
  }
  function text(value: unknown): string {
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) return value.map(text).join(" ");
    if (value && typeof value === "object" && "children" in value) return text(value.children);
    return "";
  }
  const failureText = text(render("Unable to load jobs (HTTP 503). Please try again."));
  assert.match(failureText, /HTTP 503/);
  assert.doesNotMatch(failureText, /No jobs are available|Categories|posted daily/);
  assert.ok(nodes.some(node => node.props?.role === "alert"));
  const retry = nodes.find(node => node.type === "button")?.props?.onClick;
  assert.equal(typeof retry, "function");
  if (typeof retry === "function") retry();
  assert.equal(retried, true);
  const emptyText = text(render(null));
  assert.match(emptyText, /No jobs are available right now/);
  assert.doesNotMatch(emptyText, /posted daily|HTTP 503/);
  assert.ok(!nodes.some(node => node.props?.role === "alert"));
});
