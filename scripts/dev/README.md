# scripts/dev

Development-only utilities. **Never run against production unless explicitly documented.**

| Script | Purpose | Safe to re-run? |
|--------|---------|-----------------|
| `backfill-seeded-leads.js` | One-time: marks all existing seeded homeowner leads as `isSeeded=true` in the DB. Run with `node scripts/dev/backfill-seeded-leads.js`. | ✅ Idempotent |
| `check-lead-counts.js` | Shows total / seeded / real / visible lead counts from the live DB. | ✅ Read-only |

## Root-level seed/test scripts (also use isSeeded: true)

The following scripts in the project root also create leads with `isSeeded: true` and are safe to run in dev:

- `seed-production.js` — creates demo users + 5 seeded leads
- `seed-toronto-jobs.js` — seeds Toronto GTA job leads (isSeeded: true)
- `seed-toronto-production.js` — same, production variant
- `seed-job-board.js` — seeds general job board leads
- `seed-leads.js` — seeds lead data for demos
- `add-demo-jobs.js` — adds demo jobs (isSeeded: true)
- `create-realistic-jobs.js` — creates realistic demo jobs (isSeeded: true)
- `create-test-jobs.js` — creates test jobs (isSeeded: true)
- `test-full-flow.js` — creates a single test lead (isSeeded: true)
- `scripts/seed-simple.js` — simple seed for local dev (isSeeded: true)
- `scripts/test-profile-system.js` — creates test lead for review test (isSeeded: true)
- `scripts/create-test-chat-data.js` — creates test chat/lead data (isSeeded: true)

## Seeded homeowner email patterns (never real users)

- `*@example.com`
- `demo@homeowner.com`
- `homeowner@quotexbert.com`
- `demo-homeowner@quotexbert.com`
- `demo_*@*`
