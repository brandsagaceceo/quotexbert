/**
 * QuoteXbert visual QA harness (standalone Playwright script — NOT part of the app runtime).
 *
 * Usage:
 *   1. Start the app in another terminal:  npm run dev   (or:  npm run build && npm start)
 *   2. Run this harness:                    node scripts/qa-visual.mjs
 *      Optionally override the base URL:     QA_BASE_URL=http://localhost:3000 node scripts/qa-visual.mjs
 *
 * For each representative route × viewport it:
 *   - loads the page and waits for network idle
 *   - screenshots into qa-screenshots/<viewport>/ (git-ignored)
 *   - checks for horizontal overflow (scrollWidth > clientWidth)
 *   - collects console.error / pageerror / failed same-origin requests
 *   - flags any element wider than the viewport (overflow culprits)
 *
 * Only PUBLIC routes are visited by default — authenticated routes need a signed-in
 * session and are listed at the bottom for manual QA (no credentials in source control).
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { name: 'mobile-320', width: 320, height: 568 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'mobile-430', width: 430, height: 932 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

// Public routes safe to visit without auth.
const PUBLIC_ROUTES = [
  { slug: 'home', path: '/' },
  { slug: 'about', path: '/about' },
  { slug: 'contact', path: '/contact' },
  { slug: 'blog', path: '/blog' },
  { slug: 'renovation-costs', path: '/renovation-costs' },
  { slug: 'renovation-cost-toronto-kitchen', path: '/renovation-cost/toronto/kitchen-renovation' },
  { slug: 'toronto', path: '/toronto' },
  { slug: 'durham-region', path: '/durham-region' },
  { slug: 'clarington', path: '/clarington' },
  { slug: 'oshawa', path: '/oshawa' },
  { slug: 'contractors-join', path: '/contractors/join' },
  { slug: 'contractors-toronto', path: '/contractors/toronto' },
  { slug: 'affiliates', path: '/affiliates' },
  { slug: 'terms', path: '/terms' },
  { slug: 'privacy', path: '/privacy' },
];

// Authenticated routes — require a signed-in session; document for manual QA.
const AUTHENTICATED_ROUTES_FOR_MANUAL_QA = [
  '/homeowner/dashboard',
  '/homeowner/jobs',
  '/homeowner/estimates/[id]',
  '/contractor/dashboard',
  '/contractor/jobs',
  '/profile',
  '/messages',
];

async function run() {
  const browser = await chromium.launch();
  const results = [];
  const overflowIssues = [];
  const consoleIssues = [];

  for (const vp of VIEWPORTS) {
    const outDir = path.join('qa-screenshots', vp.name);
    await mkdir(outDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 1,
    });

    for (const route of PUBLIC_ROUTES) {
      const page = await context.newPage();
      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') pageErrors.push(`console.error: ${msg.text()}`);
      });
      page.on('pageerror', (err) => pageErrors.push(`pageerror: ${err.message}`));
      page.on('requestfailed', (req) => {
        const url = req.url();
        // Only flag same-origin (local) resource failures; ignore third-party analytics.
        if (url.startsWith(BASE_URL)) pageErrors.push(`requestfailed: ${url}`);
      });

      const url = BASE_URL + route.path;
      let ok = true;
      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      } catch (err) {
        ok = false;
        results.push({ viewport: vp.name, route: route.path, status: 'LOAD_FAILED', error: String(err) });
      }

      if (ok) {
        // Viewport-only section screenshots (never fullPage — long pages exceed the
        // 8000px image limit). Capture top / middle / bottom by scrolling so we still
        // review the whole page, with every image capped at the viewport dimensions.
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        const sections = pageHeight > vp.height * 1.5
          ? [
              { label: 'top', y: 0 },
              { label: 'mid', y: Math.max(0, Math.round(pageHeight / 2 - vp.height / 2)) },
              { label: 'bottom', y: Math.max(0, pageHeight - vp.height) },
            ]
          : [{ label: 'top', y: 0 }];

        for (const section of sections) {
          await page.evaluate((y) => window.scrollTo(0, y), section.y);
          await page.waitForTimeout(150);
          await page.screenshot({
            path: path.join(outDir, `${route.slug}-${section.label}.png`),
            fullPage: false,
          });
        }
        await page.evaluate(() => window.scrollTo(0, 0));

        const overflow = await page.evaluate(() => {
          const docWidth = document.documentElement.clientWidth;
          const hasOverflow = document.documentElement.scrollWidth > docWidth;
          const culprits = [];
          if (hasOverflow) {
            for (const el of Array.from(document.querySelectorAll('*'))) {
              const r = el.getBoundingClientRect();
              if (r.width > docWidth + 1 && r.right > docWidth + 1) {
                culprits.push(`${el.tagName.toLowerCase()}.${(el.className && typeof el.className === 'string' ? el.className.split(' ').slice(0, 2).join('.') : '')} (w=${Math.round(r.width)})`);
              }
              if (culprits.length >= 5) break;
            }
          }
          return { hasOverflow, docWidth, scrollWidth: document.documentElement.scrollWidth, culprits };
        });

        if (overflow.hasOverflow) {
          overflowIssues.push({ viewport: vp.name, route: route.path, scrollWidth: overflow.scrollWidth, clientWidth: overflow.docWidth, culprits: overflow.culprits });
        }
        if (pageErrors.length) {
          consoleIssues.push({ viewport: vp.name, route: route.path, errors: pageErrors });
        }
        results.push({ viewport: vp.name, route: route.path, status: 'OK', overflow: overflow.hasOverflow, consoleErrors: pageErrors.length });
      }

      await page.close();
    }
    await context.close();
  }

  await browser.close();

  console.log('\n===== QA VISUAL SUMMARY =====');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Routes: ${PUBLIC_ROUTES.length} public × ${VIEWPORTS.length} viewports = ${results.length} renders`);
  console.log(`\nHORIZONTAL OVERFLOW ISSUES: ${overflowIssues.length}`);
  for (const o of overflowIssues) {
    console.log(`  [${o.viewport}] ${o.route} — scrollW=${o.scrollWidth} clientW=${o.clientWidth} :: ${o.culprits.join(' | ')}`);
  }
  console.log(`\nCONSOLE / PAGE ERRORS: ${consoleIssues.length} route-viewport combos`);
  for (const c of consoleIssues) {
    console.log(`  [${c.viewport}] ${c.route}`);
    for (const e of c.errors.slice(0, 3)) console.log(`      ${e}`);
  }
  const failed = results.filter((r) => r.status !== 'OK');
  console.log(`\nLOAD FAILURES: ${failed.length}`);
  for (const f of failed) console.log(`  [${f.viewport}] ${f.route} — ${f.status}`);
  console.log('\nAuthenticated routes (manual QA — need signed-in session):');
  for (const r of AUTHENTICATED_ROUTES_FOR_MANUAL_QA) console.log(`  ${r}`);
  console.log('\nScreenshots saved under qa-screenshots/<viewport>/ (git-ignored).');
  console.log('=============================\n');
}

run().catch((err) => {
  console.error('QA harness crashed:', err);
  process.exit(1);
});
