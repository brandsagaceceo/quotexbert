/**
 * Auth blocker probe (headless). Confirms empirically what happens when hitting the sign-in
 * page and an authenticated route WITHOUT a session, so we can document the exact blocker
 * rather than assuming. Follows the redirect chain and captures Clerk-related console output.
 *
 * Usage: node scripts/qa-auth-probe.mjs   (app must be running)
 */
import { chromium } from '@playwright/test';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';

async function probe(context, label, path) {
  const page = await context.newPage();
  const redirects = [];
  const clerkMsgs = [];
  page.on('console', (m) => { const t = m.text(); if (/clerk|redirect|session/i.test(t)) clerkMsgs.push(t.slice(0, 140)); });
  page.on('response', (r) => { if ([301, 302, 303, 307, 308].includes(r.status())) redirects.push(`${r.status()} ${new URL(r.url()).pathname} -> ${r.headers()['location'] || ''}`); });
  let finalPath = '(none)';
  let loadError = null;
  try {
    await page.goto(BASE_URL + path, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2500); // allow client-side Clerk redirects
    finalPath = new URL(page.url()).pathname;
  } catch (e) {
    loadError = String(e).split('\n')[0];
  }
  // Does a login form / Clerk component render?
  let hasClerkUI = false;
  try { hasClerkUI = await page.locator('input[type="email"], input[name="identifier"], .cl-rootBox, [data-clerk-component]').count() > 0; } catch {}
  console.log(`\n[${label}] requested ${path}`);
  console.log(`  final path: ${finalPath}`);
  console.log(`  redirects (${redirects.length}): ${redirects.slice(0, 6).join(' | ') || 'none'}`);
  console.log(`  clerk/session console msgs (${clerkMsgs.length}): ${clerkMsgs.slice(0, 3).join(' || ') || 'none'}`);
  console.log(`  sign-in UI present: ${hasClerkUI}`);
  if (loadError) console.log(`  load error: ${loadError}`);
  await page.close();
  return { label, path, finalPath, redirectCount: redirects.length, hasClerkUI, loadError };
}

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  console.log('===== CLERK AUTH BLOCKER PROBE =====');
  console.log(`Base URL: ${BASE_URL}`);
  await probe(context, 'sign-in page', '/sign-in');
  await probe(context, 'protected route (homeowner)', '/homeowner/dashboard');
  await probe(context, 'protected route (contractor)', '/contractor/dashboard');
  await browser.close();
  console.log('\n===================================\n');
}
run().catch((e) => { console.error('probe crashed:', e); process.exit(1); });
