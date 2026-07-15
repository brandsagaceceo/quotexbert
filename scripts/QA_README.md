# QuoteXbert Visual QA Harness

Standalone Playwright screenshot + layout-check tooling. **Not part of the app runtime.**
All output folders (`qa-screenshots/`, `qa-auth/`) are git-ignored. No credentials are stored
in source control.

## Public routes (no login required)

```powershell
# 1. Start the app in one terminal
npm run build ; npm start        # or: npm run dev

# 2. Run the public harness in another terminal
node scripts/qa-visual.mjs
```

Checks per route × viewport: horizontal overflow (`scrollWidth > clientWidth`), console/page
errors, failed same-origin requests, load failures. Screenshots are **viewport-only**
(`fullPage: false`) captured as top/mid/bottom sections so no image exceeds 8000px.

Viewports: 320×568, 375×812, 390×844, 430×932, 768×1024, 1440×900.
Output: `qa-screenshots/<viewport>/<route>-<section>.png`.

## Authenticated routes (login required)

Clerk's hosted sign-in resists headless automation, so we use **manual storage-state capture**.
No passwords are read or committed by the tooling — you log in by hand once per role.

```powershell
# Capture a homeowner session (opens a headed browser to sign in by hand)
$env:QA_ROLE="homeowner"; node scripts/qa-auth-setup.mjs

# Capture a contractor session
$env:QA_ROLE="contractor"; node scripts/qa-auth-setup.mjs

# Run the authenticated harness (uses the saved sessions)
node scripts/qa-visual-auth.mjs
```

Output: `qa-screenshots/auth/<role>/<viewport>/...`. Also flags redirect-loops/auth kickouts
and double-dollar (`$$`) rendered text.

## Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `QA_BASE_URL` | Base URL the harness targets | `http://localhost:3000` |
| `QA_ROLE` | Role to capture in `qa-auth-setup.mjs` (`homeowner` \| `contractor`) | `homeowner` |

The app's own Clerk keys (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`) must be a
**matching pair** in your local `.env` for authenticated capture to work. A mismatch causes a
sign-in redirect loop (observed locally), which blocks the authenticated harness.

## Storage-state files (git-ignored)

- `qa-auth/homeowner-state.json`
- `qa-auth/contractor-state.json`

These contain live session tokens — never commit them (already in `.gitignore`).
