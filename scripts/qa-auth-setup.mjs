/**
 * One-time authenticated storage-state capture for the QA harness (Option B — manual login).
 *
 * WHY MANUAL: Clerk's hosted sign-in resists headless automation (bot checks, hosted pages),
 * and this local env currently has a Clerk publishable/secret key mismatch that causes a
 * sign-in redirect loop. Rather than hardcode credentials or fight Clerk automation, this
 * opens a real (headed) browser, lets YOU log in by hand, then saves the authenticated
 * session so the QA harness can reuse it. No credentials are read, printed, or committed.
 *
 * Usage:
 *   1. Ensure the app is running (npm run dev / npm start) with VALID local Clerk keys.
 *   2. Capture a homeowner session:
 *        QA_ROLE=homeowner node scripts/qa-auth-setup.mjs
 *      A browser opens on the sign-in page. Log in as a homeowner, wait until you land on a
 *      dashboard, then return to the terminal and press Enter.
 *   3. Repeat for a contractor:
 *        QA_ROLE=contractor node scripts/qa-auth-setup.mjs
 *
 * Output: qa-auth/<role>-state.json  (git-ignored — contains session tokens).
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
const ROLE = (process.env.QA_ROLE || 'homeowner').toLowerCase();

function waitForEnter(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => rl.question(prompt, () => { rl.close(); resolve(); }));
}

async function run() {
  await mkdir('qa-auth', { recursive: true });
  const statePath = path.join('qa-auth', `${ROLE}-state.json`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/sign-in`, { waitUntil: 'domcontentloaded' });

  console.log(`\n[qa-auth-setup] A browser window opened at ${BASE_URL}/sign-in`);
  console.log(`[qa-auth-setup] Please sign in as a ${ROLE.toUpperCase()} account by hand.`);
  console.log('[qa-auth-setup] Once you are fully signed in and see a dashboard, come back here.');
  await waitForEnter('[qa-auth-setup] Press Enter to save the authenticated session... ');

  await context.storageState({ path: statePath });
  console.log(`[qa-auth-setup] Saved ${ROLE} session to ${statePath} (git-ignored).`);
  await browser.close();
}

run().catch((err) => {
  console.error('[qa-auth-setup] Failed:', err);
  process.exit(1);
});
