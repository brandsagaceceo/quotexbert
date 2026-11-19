import assert from "node:assert/strict";
import fs from "node:fs";

const component = fs.readFileSync("components/GoogleAnalytics.tsx", "utf8");
const layout = fs.readFileSync("app/layout.tsx", "utf8");

assert.equal(
  (layout.match(/googletagmanager\.com\/gtag\/js/g) || []).length,
  0,
  "the layout must not load a second gtag library",
);
assert.equal(
  (component.match(/googletagmanager\.com\/gtag\/js/g) || []).length,
  1,
  "the shared component owns the only gtag loader",
);
assert.match(
  component,
  /send_page_view: false/,
  "automatic config pageviews are disabled",
);
assert.match(
  component,
  /gtag\("event", "page_view"/,
  "route changes emit one explicit pageview",
);
assert.match(
  component,
  /pageUrl === lastTrackedUrl\.current/,
  "duplicate route pageviews are suppressed",
);
assert.match(
  component,
  /GTM_ID && !GA_MEASUREMENT_ID/,
  "direct GA4 mode does not also load GTM",
);

console.log("Google tag single-pageview tests passed");
