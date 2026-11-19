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
    effects, errors,
    render: (props: Record<string, unknown> = {}) => {
      hook = 0;
      effects.length = 0;
      return renderToStaticMarkup(renderComponent(props));
    },
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const successPage = path.join("app", "contractor", "subscription", "success", "page.tsx");

test("missing checkout IDs never claim activation or send a verification request", () => {
  const fixture = clientFixture(successPage, {
    useSearchParams: () => new URLSearchParams(),
    fetch: () => assert.fail("Missing checkout must not send requests"),
  });
  fixture.render();
  fixture.effects[0]!();
  const html = fixture.render();
  assert.match(html, /Subscription not confirmed/);
  assert.doesNotMatch(html, /Subscription Activated|payment was successful/);
});

test("verification failures stay explicit and only a confirmed response recovers the success screen", async () => {
  for (const fail of [
    async () => new Response(null, { status: 404 }),
    async () => new Response(null, { status: 401 }),
    async () => Response.json({ success: false }),
    async () => new Response("<html>Unavailable</html>"),
    async () => { throw new Error("Offline fixture"); },
  ]) {
    let fetcher = fail;
    const fixture = clientFixture(successPage, {
      useSearchParams: () => new URLSearchParams("session_id=isolated_fixture"),
      fetch: () => fetcher(),
    });
    fixture.render();
    fixture.effects[0]!();
    await settle();
    assert.match(fixture.render(), /Subscription not confirmed/);
    assert.equal(fixture.errors.length, 1);
    fetcher = async () => Response.json({ success: true });
    fixture.effects[0]!();
    await settle();
    assert.match(fixture.render(), /Subscription Activated/);
  }
});

test("Next 14 plain route params load existing bids and nullable string prices remain honest and sortable", async () => {
  const urls: string[] = [];
  const application = (id: string, proposedPrice: string | null) => ({
    id, proposedPrice, message: null, estimatedDays: null, status: "pending", createdAt: new Date().toISOString(),
    contractor: { id: `contractor-${id}`, name: `${id} fixture`, email: `${id}@example.com` },
  });
  const fixture = clientFixture(path.join("app", "homeowner", "jobs", "[id]", "applications", "page.tsx"), {
    useAuth: () => ({ user: { id: "isolated-homeowner" } }),
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
