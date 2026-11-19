import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Execute the actual client functions with isolated hooks, never Clerk, Stripe or a database.
function clientFixture(file: string, overrides: Record<string, unknown>) {
  const source = ts.createSourceFile(file, readFileSync(path.join(process.cwd(), file), "utf8"),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const functions = source.statements.filter(ts.isFunctionDeclaration);
  const component = functions.find(node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.DefaultKeyword));
  assert.ok(component?.name);
  const values: unknown[] = [];
  const effects: Array<() => void | (() => void)> = [];
  const errors: unknown[][] = [];
  const elements: Array<React.ReactElement<Record<string, unknown>>> = [];
  let hook = 0;
  const globals: Record<string, unknown> = {};
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement)) continue;
    const clause = statement.importClause;
    const names = clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
      ? clause.namedBindings.elements.map(binding => binding.name.text) : [];
    if (clause?.name) names.push(clause.name.text);
    for (const name of names) {
      globals[name] = ({ children }: React.PropsWithChildren) => React.createElement("span", null, children);
    }
  }
  Object.assign(globals, {
    React, AbortController,
    console: { error: (...args: unknown[]) => errors.push(args) },
    useState: (initial: unknown) => {
      const index = hook++;
      if (!(index in values)) values[index] = initial;
      return [values[index], (next: unknown) => {
        values[index] = typeof next === "function" ? next(values[index]) : next;
      }];
    },
    useEffect: (effect: () => void | (() => void)) => effects.push(effect),
    useRouter: () => ({ push: () => assert.fail("No navigation authorized by this fixture") }),
    ...overrides,
  });
  const code = functions.map(node => node.getText(source).replace(/^export default /, "")).join("\n");
  const compiled = ts.transpileModule(`${code}\n${component.name.text};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
  }).outputText;
  const renderComponent: (props: Record<string, unknown>) => React.ReactElement = vm.runInNewContext(compiled, globals);
  return {
    effects, errors, elements,
    render: (props: Record<string, unknown> = {}) => {
      hook = 0;
      effects.length = 0;
      elements.length = 0;
      const tree = renderComponent(props);
      const capture = (node: React.ReactNode) => {
        if (!React.isValidElement<Record<string, unknown> & { children?: React.ReactNode }>(node)) return;
        elements.push(node);
        React.Children.forEach(node.props.children, capture);
      };
      capture(tree);
      return renderToStaticMarkup(tree);
    },
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const successPage = path.join("app", "contractor", "subscriptions", "page.tsx");

function subscriptionFixture(search: string, fetcher: (url: string, options?: RequestInit) => Promise<Response>) {
  return clientFixture(successPage, {
    useSearchParams: () => new URLSearchParams(search),
    useAuth: () => ({ authUser: { id: "owner", role: "contractor" }, authLoading: false }),
    useToast: () => ({ error: () => assert.fail("Unexpected checkout action") }),
    useRef: (initial: unknown) => ({ current: initial }),
    CATEGORY_GROUPS: [], SIMPLE_CATEGORIES: [], FOUNDING_OFFER_ENABLED: false,
    stripePromise: null,
    window: { history: { replaceState: () => {} } },
    fetch: fetcher,
  });
}
const dashboardResponse = () => Response.json({ success: true, subscriptions: [], data: { recentTransactions: [] } });

test("missing checkout IDs never claim activation or send a verification request", async () => {
  const fixture = subscriptionFixture("success=true", async url => {
    assert.notEqual(url, "/api/subscriptions/activate");
    return dashboardResponse();
  });
  fixture.render();
  fixture.effects.forEach(effect => effect());
  await settle();
  const html = fixture.render();
  assert.match(html, /Subscription not confirmed/);
  assert.doesNotMatch(html, /Subscription Activated|payment was successful/);
});

test("deprecated success URL preserves only the checkout ID and delegates to the existing subscription page", () => {
  const file = path.join("app", "contractor", "subscription", "success", "page.tsx");
  const redirects: string[] = [];
  const fixture = clientFixture(file, {
    URLSearchParams,
    redirect: (url: string) => { redirects.push(url); return React.createElement("span"); },
  });
  fixture.render({ searchParams: { session_id: "cs_fixture&unsafe=1" } });
  assert.deepEqual(redirects, ["/contractor/subscriptions?success=true&session_id=cs_fixture%26unsafe%3D1"]);
});

test("verification failures stay explicit and only a confirmed response recovers the success screen", async () => {
  for (const fail of [
    async () => new Response(null, { status: 404 }),
    async () => new Response(null, { status: 401 }),
    async () => Response.json({ success: false }),
    async () => Response.json({ success: true, activated: [], skipped: [] }),
    async () => Response.json({ success: true, activated: ["Plumbing"], skipped: ["Painting"] }),
    async () => new Response("<html>Unavailable</html>"),
    async () => { throw new Error("Offline fixture"); },
  ]) {
    let fetcher = fail;
    const requests: string[] = [];
    const fixture = subscriptionFixture("success=true&session_id=isolated_fixture&tier=general&founding=1", async (url, options) => {
      if (url !== "/api/subscriptions/activate") return dashboardResponse();
      requests.push(url);
      assert.equal(options?.method, "POST");
      assert.deepEqual(JSON.parse(String(options.body)), { sessionId: "isolated_fixture" });
      return fetcher();
    });
    fixture.render();
    fixture.effects.forEach(effect => effect());
    await settle();
    assert.match(fixture.render(), /Subscription not confirmed/);
    assert.equal(fixture.errors.length, 1);
    fetcher = async () => Response.json({ success: true, activated: ["Plumbing"], skipped: [] });
    fixture.effects[0]!();
    await settle();
    assert.match(fixture.render(), /Subscription Activated/);
    assert.deepEqual(requests, ["/api/subscriptions/activate", "/api/subscriptions/activate"]);
    assert.doesNotMatch(fixture.render(), /you were charged|payment was successful/);
  }
});

test("Next 14 plain route params load existing bids and nullable string prices remain honest and sortable", async () => {
  const urls: string[] = [];
  const application = (id: string, proposedPrice: string | null) => ({
    id, proposedPrice, message: null, estimatedDays: null, status: "pending", createdAt: new Date().toISOString(),
    contractor: { id: `contractor-${id}`, name: `${id} fixture`, email: `${id}@example.com` },
  });
  const fixture = clientFixture(path.join("app", "homeowner", "jobs", "[id]", "applications", "page.tsx"), {
    useAuth: () => ({ user: { id: "isolated-homeowner", role: "homeowner" }, authLoading: false }),
    fetch: async (url: string) => {
      urls.push(url);
      return Response.json({
        id: "isolated-job", title: "Isolated fixture job", description: "", budget: null,
        category: "painting", maxContractors: 3, status: "open", photos: [],
        applications: [application("High", "$1,200"), application("Missing", null), application("Low", "900"), application("Text", "TBD")],
      });
    },
  });
  const props = { params: { id: "isolated-job" } };
  fixture.render(props);
  fixture.effects[0]!();
  await settle();
  const html = fixture.render(props);
  assert.deepEqual(urls, ["/api/homeowner/jobs/isolated-job?homeownerId=isolated-homeowner"]);
  assert.ok(html.indexOf("Low fixture") < html.indexOf("High fixture"));
  assert.ok(html.indexOf("High fixture") < html.indexOf("Missing fixture"));
  assert.match(html, /\$1,200/);
  assert.match(html, /Price not provided/);
  assert.match(html, /TBD/);
  assert.doesNotMatch(html, /NaN|\$0</);
});

test("saved drafts reuse the existing form and PUT endpoint without overwriting another local draft or posting a duplicate job", async () => {
  const requests: Array<{ url: string; options?: RequestInit }> = [];
  const destinations: string[] = [];
  const fixture = clientFixture(path.join("app", "create-lead", "page.tsx"), {
    useAuth: () => ({ authUser: { id: "owner", role: "homeowner" } }),
    useSearchParams: () => new URLSearchParams("savedProjectId=draft%26fixture"),
    useRouter: () => ({ push: (url: string) => destinations.push(url) }),
    SIMPLE_CATEGORIES: [],
    HOMEOWNER_TRUST_SIGNAL: "Local contractor availability",
    localStorage: {
      getItem: () => assert.fail("Editing must not consume the unrelated estimate/local draft"),
      setItem: () => assert.fail("Editing must not overwrite the unrelated local draft"),
      removeItem: () => assert.fail("Editing must not delete the unrelated local draft"),
    },
    setTimeout: (callback: () => void) => callback(),
    fetch: async (url: string, options?: RequestInit) => {
      requests.push({ url, ...(options ? { options } : {}) });
      assert.equal(url, "/api/saved-projects/draft%26fixture");
      return Response.json({ success: true, savedProject: {
        title: "Existing private kitchen", description: "Repair the existing cabinets", category: "Renovation",
        city: null, province: "ON", zipCode: null, budget: null, photos: "[]", status: "draft", postedAsLeadId: null,
      } });
    },
  });
  assert.match(fixture.render(), /Loading your saved project/);
  fixture.effects.forEach(effect => effect());
  await settle();
  assert.match(fixture.render(), /Edit Your Saved Project/);
  const changeCity = fixture.elements.find(element => element.props.id === "city")?.props.onChange;
  assert.equal(typeof changeCity, "function");
  if (typeof changeCity === "function") changeCity({ target: { value: "Toronto" } });
  const html = fixture.render();
  assert.doesNotMatch(html, /Post to Job Board|automatically saved/);
  const save = fixture.elements.find(element => typeof element.props.onClick === "function" &&
    renderToStaticMarkup(element).includes("Save Changes Privately"))?.props.onClick;
  assert.equal(typeof save, "function");
  if (typeof save === "function") await save();
  assert.equal(requests.length, 2);
  assert.equal(requests[1]?.options?.method, "PUT");
  const body = JSON.parse(String(requests[1]?.options?.body));
  assert.equal(body.city, "Toronto");
  assert.equal(body.status, undefined);
  assert.deepEqual(destinations, ["/homeowner/saved-projects"]);
});

test("saved project edit failures stay explicit and never fall back to a new project form", async () => {
  for (const response of [
    () => Response.json({ error: "Forbidden" }, { status: 403 }),
    () => Response.json({ success: true, savedProject: { title: "Bad photos", description: "", category: "Painting", photos: '{"not":"photos"}' } }),
    () => Response.json({ success: true, savedProject: { title: "Already live", description: "", category: "Painting", status: "posted" } }),
  ]) {
    const fixture = clientFixture(path.join("app", "create-lead", "page.tsx"), {
      useAuth: () => ({ authUser: { id: "owner", role: "homeowner" } }),
      useSearchParams: () => new URLSearchParams("savedProjectId=draft"),
      fetch: async () => response(),
    });
    fixture.render();
    fixture.effects.forEach(effect => effect());
    await settle();
    const html = fixture.render();
    assert.match(html, /role="alert"/);
    assert.doesNotMatch(html, /<form|Post to Job Board|Save Changes Privately/);
    assert.equal(fixture.errors.length, 1);
  }
});

test("saved projects wait for authentication and retain their return destination when sign-in is required", async () => {
  let loading = true;
  const destinations: string[] = [];
  const fixture = clientFixture(path.join("app", "homeowner", "saved-projects", "page.tsx"), {
    useAuth: () => ({ authUser: null, isSignedIn: false, authLoading: loading }),
    useRouter: () => ({ push: (url: string) => destinations.push(url) }),
    fetch: () => assert.fail("No private records may load before authentication"),
  });
  fixture.render();
  fixture.effects[0]!();
  assert.deepEqual(destinations, []);
  loading = false;
  fixture.render();
  fixture.effects[0]!();
  assert.deepEqual(destinations, ["/sign-in?redirect_url=%2Fhomeowner%2Fsaved-projects"]);
});

test("bid loading failures are visible and signed-out users do not remain in a spinner", async () => {
  const file = path.join("app", "homeowner", "jobs", "[id]", "applications", "page.tsx");
  const props = { params: { id: "job" } };
  const fixture = clientFixture(file, {
    useAuth: () => ({ user: { id: "owner", role: "homeowner" }, authLoading: false }),
    fetch: async () => Response.json({ error: "Isolated job storage unavailable" }, { status: 503 }),
  });
  fixture.render(props);
  fixture.effects[0]!();
  await settle();
  assert.match(fixture.render(props), /role="alert".*Isolated job storage unavailable/);
  const signedOut = clientFixture(file, {
    useAuth: () => ({ user: null, authLoading: false }),
    fetch: () => assert.fail("Signed-out users must not fetch private jobs"),
  });
  assert.match(signedOut.render(props), /Sign in to compare your contractor bids/);
});

test("selecting a contractor uses only the confirmed thread and explicit recipient, never an arbitrary redirect URL", async () => {
  const destinations: string[] = [];
  let selected = false;
  const fixture = clientFixture(path.join("app", "homeowner", "jobs", "[id]", "applications", "page.tsx"), {
    useAuth: () => ({ user: { id: "owner", role: "homeowner" }, authLoading: false }),
    useRouter: () => ({ push: (url: string) => destinations.push(url) }),
    fetch: async (url: string) => {
      if (url === "/api/applications/manage") {
        selected = true;
        return Response.json({ success: true, threadId: "thread&fixture", redirectUrl: "https://not-our-app.invalid" });
      }
      return Response.json({
        id: "job", title: "Existing job", description: "", budget: null, maxContractors: 3, status: "open", photos: [],
        applications: [{ id: "bid", proposedPrice: "900", message: null, estimatedDays: null, status: selected ? "accepted" : "pending",
          contractor: { id: "chosen&contractor", name: "Contractor", email: "fixture@example.com" } }],
      });
    },
  });
  const props = { params: { id: "job" } };
  fixture.render(props);
  fixture.effects[0]!();
  await settle();
  fixture.render(props);
  const select = fixture.elements.find(element => typeof element.props.onClick === "function" &&
    /Accept &amp; Chat/.test(renderToStaticMarkup(element)))?.props.onClick;
  assert.equal(typeof select, "function");
  if (typeof select === "function") await select();
  assert.deepEqual(destinations, ["/messages?threadId=thread%26fixture&contractorId=chosen%26contractor"]);
});
