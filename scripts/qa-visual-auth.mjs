/**
 * Authenticated visual QA harness. Reuses storage-state captured by scripts/qa-auth-setup.mjs.
 * Standalone — NOT part of the app runtime.
 *
 * Prerequisite: run scripts/qa-auth-setup.mjs first to create qa-auth/homeowner-state.json
 * and/or qa-auth/contractor-state.json (both git-ignored). If a state file is missing, that
 * role is skipped and reported.
 *
 * Usage:
 *   1. App running with VALID local Clerk keys (npm run dev / npm start).
 *   2. node scripts/qa-visual-auth.mjs
 *
 * Same viewport-only, top/mid/bottom section capture as the public harness (all images
 * stay at viewport dimensions, well under the 8000px limit). Screenshots go to
 * qa-screenshots/auth/<role>/<viewport>/ (git-ignored). Also runs the overflow +
 * console-error + redirect-loop checks per route/viewport.
 */
import { chromium } from '@playwright/test';
import { mkdir, access } from 'node:fs/promises';
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

const ROLE_ROUTES = {
  homeowner: [
    { slug: 'ho-dashboard', path: '/homeowner/dashboard' },
    { slug: 'ho-jobs', path: '/homeowner/jobs' },
    { slug: 'ho-quotes', path: '/homeowner/quotes' },
    { slug: 'ho-saved', path: '/homeowner/saved-projects' },
    { slug: 'messages', path: '/messages' },
    { slug: 'profile', path: '/profile' },
  ],
  contractor: [
    { slug: 'co-dashboard', path: '/contractor/dashboard' },
    { slug: 'co-jobs', path: '/contractor/jobs' },
    { slug: 'co-quotes', path: '/contractor/quotes' },
    { slug: 'messages', path: '/messages' },
    { slug: 'profile', path: '/profile' },
  ],
};

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function captureRoleRoutes(browser, role, statePath, summary) {
  for (const vp of VIEWPORTS) {
    const outDir = path.join('qa-screenshots', 'auth', role, vp.name);
    await mkdir(outDir, { recursive: true });
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      storageState: statePath,
    });

    for (const route of ROLE_ROUTES[role]) {
      const page = await context.newPage();
      const errors = [];
      page.on('console', (m) => { if (m.type() === 'error') errors.push(`console.error: ${m.text()}`); });
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      page.on('requestfailed', (r) => { if (r.url().startsWith(BASE_URL)) errors.push(`requestfailed: ${r.url()}`); });

      let redirected = false;
      try {
        await page.goto(BASE_URL + route.path, { waitUntil: 'networkidle', timeout: 30000 });
        const landed = new URL(page.url()).pathname;
        // Redirect loop / auth kick-out detection.
        if (landed.startsWith('/sign-in') || landed.startsWith('/sign-up')) {
          redirected = true;
          summary.redirects.push({ role, viewport: vp.name, route: route.path, landedOn: landed });
        }
      } catch (err) {
        summary.loadFailures.push({ role, viewport: vp.name, route: route.path, error: String(err) });
        await page.close();
        continue;
      }

      if (!redirected) {
        const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        const sections = pageHeight > vp.height * 1.5
          ? [{ label: 'top', y: 0 }, { label: 'mid', y: Math.max(0, Math.round(pageHeight / 2 - vp.height / 2)) }, { label: 'bottom', y: Math.max(0, pageHeight - vp.height) }]
          : [{ label: 'top', y: 0 }];
        for (const s of sections) {
          await page.evaluate((y) => window.scrollTo(0, y), s.y);
          await page.waitForTimeout(150);
          await page.screenshot({ path: path.join(outDir, `${route.slug}-${s.label}.png`), fullPage: false });
        }
        await page.evaluate(() => window.scrollTo(0, 0));

        const overflow = await page.evaluate(() => ({
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        // Double-dollar check on rendered text.
        const doubleDollar = await page.evaluate(() => /\$\$|\$\s?\$/.test(document.body.innerText));

        if (overflow.hasOverflow) summary.overflow.push({ role, viewport: vp.name, route: route.path, ...overflow });
        if (errors.length) summary.console.push({ role, viewport: vp.name, route: route.path, errors });
        if (doubleDollar) summary.doubleDollar.push({ role, viewport: vp.name, route: route.path });
      }
      await page.close();
    }
    await context.close();
  }
}

async function run() {
  const summary = { overflow: [], console: [], loadFailures: [], redirects: [], doubleDollar: [], skipped: [] };
  const browser = await chromium.launch();

  for (const role of Object.keys(ROLE_ROUTES)) {
    const statePath = path.join('qa-auth', `${role}-state.json`);
    if (!(await exists(statePath))) {
      summary.skipped.push(role);
      continue;
    }
    await captureRoleRoutes(browser, role, statePath, summary);
  }

  await browser.close();

  console.log('\n===== AUTHENTICATED QA SUMMARY =====');
  if (summary.skipped.length) {
    console.log(`SKIPPED ROLES (no qa-auth/<role>-state.json): ${summary.skipped.join(', ')}`);
    console.log('  Run: QA_ROLE=<role> node scripts/qa-auth-setup.mjs  to capture a session first.');
  }
  console.log(`\nREDIRECT-LOOP / AUTH KICKOUTS: ${summary.redirects.length}`);
  for (const r of summary.redirects) console.log(`  [${r.role}][${r.viewport}] ${r.route} -> ${r.landedOn}`);
  console.log(`\nHORIZONTAL OVERFLOW: ${summary.overflow.length}`);
  for (const o of summary.overflow) console.log(`  [${o.role}][${o.viewport}] ${o.route} scrollW=${o.scrollWidth} clientW=${o.clientWidth}`);
  console.log(`\nDOUBLE-DOLLAR TEXT: ${summary.doubleDollar.length}`);
  for (const d of summary.doubleDollar) console.log(`  [${d.role}][${d.viewport}] ${d.route}`);
  console.log(`\nCONSOLE / PAGE ERRORS: ${summary.console.length}`);
  for (const c of summary.console) { console.log(`  [${c.role}][${c.viewport}] ${c.route}`); c.errors.slice(0, 3).forEach((e) => console.log(`      ${e}`)); }
  console.log(`\nLOAD FAILURES: ${summary.loadFailures.length}`);
  for (const f of summary.loadFailures) console.log(`  [${f.role}][${f.viewport}] ${f.route}`);
  console.log('\nScreenshots: qa-screenshots/auth/<role>/<viewport>/ (git-ignored).');
  console.log('====================================\n');
}

run().catch((err) => { console.error('Auth QA harness crashed:', err); process.exit(1); });
