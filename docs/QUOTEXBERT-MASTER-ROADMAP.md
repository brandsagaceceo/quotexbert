# QuoteXbert Master Development Roadmap

This is the single tracking view for the platform workstreams. Statuses reflect code or test evidence, not intent. “IN PROGRESS” does not mean production-ready. No external service, credential, payment, or release is assumed configured unless recorded here with evidence.

## Status and evidence

| #   | Workstream                                                        | Status        | Current evidence                                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Unified QuoteXbert AI — homeowners and contractors                | IN PROGRESS   | Existing `components/AIAssistantPopup.tsx`; optional role-aware route `app/api/ai/assistant/route.ts`; centralized client/model map in `lib/openai-client.ts`. Feature flag is disabled unless `QUOTEXBERT_AI_ENABLED=true`.                                                                                                                       |
| 2   | Quick estimator and optional Astra integration                    | VERIFIED DONE | Existing estimator remains the default; optional integration is separately gated. Commit `da702cb` includes estimator changes and `scripts/astra-estimate.test.ts` covers normalization/fallback. Re-run the focused test as part of release checks.                                                                                               |
| 3   | AI renovation planning, photo visualization and job drafts        | IN PROGRESS   | Guided assistant validates homeowner-owned private photos and creates private `SavedProject` drafts; existing publish endpoint still requires an explicit homeowner action. Visualization code remains separate and is not being replaced.                                                                                                         |
| 4   | Homeowner job posting, matching, quotes and messaging             | IN PROGRESS   | Existing saved-project publish, lead, quote and messaging routes are reused. End-to-end lifecycle evidence and broader acceptance coverage remain outstanding.                                                                                                                                                                                     |
| 5   | Contractor onboarding, profiles, notifications and calendars      | IN PROGRESS   | Existing profile and notification infrastructure is present. This phase only adds a contractor role prompt to the shared assistant; onboarding/calendar completion is not claimed.                                                                                                                                                                 |
| 6 | SEO automation, Search Console and weekly blog drafting | IN PROGRESS | Approved Ontario topic queue, low-cost model draft generation, validation, private review APIs/UI, scheduled Vercel Cron route, published blog listing/detail metadata and sitemap integration are implemented locally. The additive migration is unapplied; the feature flag is off. Search Console is not connected; no search metrics are fabricated. |
| 7   | Affiliate catalog, Associates and DIY content                     | IN PROGRESS   | `lib/seo/affiliate-products.ts` is an empty-by-default approved catalog. Generation can only reference catalog entries; the editorial disclosure is wired for any populated catalog. Merchant approval, IDs and verified links remain required.                                                                                                    |
| 8   | Instagram-style feed and homeowner lead protection                | NOT STARTED   | No work in this phase. Reuse existing private-photo ownership and authorization helpers when scoped.                                                                                                                                                                                                                                               |
| 9   | Subscriptions, seven-day trial, lead credits and rewards          | IN PROGRESS   | Existing subscription/Stripe entitlement code is present but is deliberately unchanged and not re-verified in this phase.                                                                                                                                                                                                                          |
| 10  | Separate prepaid AI credits, usage metering and Stripe            | NOT STARTED   | No prepaid AI-credit workflow added. Existing subscription/lead-credit logic is not a substitute.                                                                                                                                                                                                                                                  |
| 11  | Contractor AutoPilot, private CRM and forwarded email leads       | NOT STARTED   | No CRM or email-forwarding automation added. Reuse the existing authenticated messaging and job contracts when approved.                                                                                                                                                                                                                           |
| 12  | Receipt scanning and job profitability tracking                   | NOT STARTED   | No receipt or profitability workflow added.                                                                                                                                                                                                                                                                                                        |
| 13  | Local AI headquarters and permitted homeowner lead-discovery bots | NOT STARTED   | Kept outside the website codebase and not implemented. Future communication requires an approved authenticated API and privacy review.                                                                                                                                                                                                             |
| 14  | Mobile optimization, app strategy and App Store publishing        | NOT STARTED   | This phase does not change mobile/app release scope. Existing Next.js/Capacitor dependencies are not evidence of an App Store release.                                                                                                                                                                                                             |
| 15 | Security, privacy, testing, backups, analytics and reliability | IN PROGRESS | Astra safe logging and existing security regressions are retained. New assistant/SEO paths add feature gates, role/admin authorization, request validation, per-user assistant limits, cron authentication, private-photo checks, safe error logs and explicit publication states. Focused feature tests and 15 existing privacy/authorization regressions pass; the 26-diagnostic TypeScript baseline is unchanged. Deployment isolation and operational backups still need verification. |
| 16  | Incorporation, grants, recruitment and spring relaunch            | NOT STARTED   | No corporate, financial, hiring, or launch action is part of this coding phase.                                                                                                                                                                                                                                                                    |

## Workstream details

### 1. Unified homeowner and contractor AI

- **Reuse / group with:** `components/AIAssistantPopup.tsx`, `lib/ai-assistant.ts`, `lib/openai-client.ts`, authenticated assistant route; group with workstreams 2, 3 and 15.
- **Dependencies:** verified OpenAI access, approved model availability, feature flag review, per-user usage/cost monitoring.
- **Acceptance:** flag off by default; homeowners and contractors receive role-appropriate responses; contractors never receive homeowner job drafts; invalid input is rejected; no raw prompts, photos or credentials in logs; no tests make live provider calls.
- **Approval required:** explicit approval before enabling paid inference in any environment.

### 2. Quick estimator and optional Astra

- **Reuse / group with:** existing `app/api/estimate/route.ts`, `lib/astra-estimate.ts`, and `scripts/astra-estimate.test.ts`; keep separate from the guided assistant.
- **Dependencies:** none for the existing behavior; Astra credentials and a separate explicit feature setting are needed for live inference.
- **Acceptance:** legacy response/pricing contract works with Astra disabled; Astra fallback, normalization and privacy tests pass.
- **Approval required:** paid inference and any Preview credential changes.

### 3. Renovation planning, photos and drafts

- **Reuse / group with:** `SavedProject`, `lib/upload.ts`, `lib/private-photo-records.ts`, and `/api/saved-projects/[id]/publish`; group with workstreams 1, 4 and 15.
- **Dependencies:** authenticated homeowner identity, private storage, tested ownership checks.
- **Acceptance:** photo access is owner-scoped; generated drafts remain private and editable; publishing requires an explicit homeowner review and confirmation.
- **Approval required:** enabling AI and any public job post.

### 4. Homeowner jobs and conversations

- **Reuse / group with:** existing saved-project publishing, job/lead lifecycle, quotes, messaging and notifications; group with 3, 5 and 11.
- **Dependencies:** existing authorization and lifecycle regression tests.
- **Acceptance:** draft-to-published and quote/message workflows preserve existing permissions, notifications and lifecycle states.
- **Approval required:** production data or customer-facing workflow changes.

### 5. Contractor account workflow

- **Reuse / group with:** existing contractor profile, onboarding, notification and calendar components; group with 4 and 11.
- **Dependencies:** role authorization and contractor account acceptance tests.
- **Acceptance:** profile setup, availability and notifications work across web/mobile; assistant cannot send or save a quote without an explicit user flow.
- **Approval required:** externally visible messaging or notification changes.

### 6. SEO drafting and review

- **Reuse / group with:** current blog routes, metadata, sitemap, shared OpenAI client and Vercel Cron; group with workstream 7.
- **Dependencies:** apply the new additive `SeoArticle` migration to an isolated environment; approved topic queue; `CRON_SECRET`; `SEO_DRAFT_AUTOMATION_ENABLED=true` only when authorized.
- **Acceptance:** at most one generation attempt per UTC day/slot; duplicate topics are skipped; schema/content/link checks pass; drafts/failures are private; only an admin can edit/approve/reject/publish; public list/detail/metadata/sitemap include published articles only.
- **Approval required:** environment setup, paid inference, migration application, Search Console access and any public publication.

### 7. Affiliate catalog

- **Reuse / group with:** empty-by-default `lib/seo/affiliate-products.ts`; share approved products with future DIY guides/feed only after validation.
- **Dependencies:** merchant approval, verified product destination URLs and real tracking IDs.
- **Acceptance:** only configured products are selectable; no scraping, invented links, or live-price claims; disclosure appears with relevant recommendations.
- **Approval required:** affiliate account credentials, IDs and any product promotion.

### 8. Inspiration feed and lead protection

- **Reuse / group with:** private-photo ownership and existing moderation/reporting/lead authorization if present; group with 3 and 4.
- **Dependencies:** product requirements, moderation policy and authorization design.
- **Acceptance:** no private homeowner photo or identifying data appears in a public feed without documented consent and moderation.
- **Approval required:** public UGC release and moderation operations.

### 9. Subscriptions, trial and rewards

- **Reuse / group with:** existing Stripe subscriptions, entitlement and lead-credit code; group with workstream 10 only after separate accounting is specified.
- **Dependencies:** billing regression coverage, Stripe test-mode verification and customer support rules.
- **Acceptance:** trial/renewal/cancellation/entitlement behavior passes test-mode regression tests; no production payment or subscription changes during unrelated feature work.
- **Approval required:** pricing, billing, trial and rewards changes.

### 10. Prepaid AI credits

- **Reuse / group with:** centralized AI client/usage controls; do not conflate with subscription lead credits.
- **Dependencies:** product approval, ledger/idempotency design, Stripe test mode, refunds and usage policy.
- **Acceptance:** auditable separate credit ledger; concurrency-safe charge/refund; hard spend limits and provider failure handling.
- **Approval required:** financial model and payment processing changes.

### 11. Contractor AutoPilot and private CRM

- **Reuse / group with:** contractor profile, jobs, messaging, notifications and future shared AI tool framework; group with 4 and 5.
- **Dependencies:** privacy boundaries, explicit contractor controls, secure email ingestion and retention policy.
- **Acceptance:** private tenant-scoped leads/notes; no automatic outreach or quote send without explicit authorization; safe failure/replay handling.
- **Approval required:** email credentials, outreach, CRM retention and paid inference.

### 12. Receipt and profitability tracking

- **Reuse / group with:** renovation project/job contracts and private storage; group with workstreams 3 and 11.
- **Dependencies:** receipt data model, accounting/privacy requirements and extraction accuracy criteria.
- **Acceptance:** receipt uploads are private; extracted amounts are reviewable; no financial result is recorded without user confirmation.
- **Approval required:** financial data processing and retention.

### 13. Local AI headquarters

- **Reuse / group with:** approved authenticated website APIs only; keep machine agents in a separate repository/runtime.
- **Dependencies:** endpoint scopes, machine identity, audit logging and threat/privacy review.
- **Acceptance:** bounded authenticated jobs; no direct production database access; no unauthorized lead scraping or outreach.
- **Approval required:** local agent infrastructure and each permitted data source/action.

### 14. Mobile and App Store

- **Reuse / group with:** existing responsive web UI and Capacitor project where verified; group mobile acceptance with workstreams 4 and 5.
- **Dependencies:** device matrix, privacy disclosures, signing accounts and release checklist.
- **Acceptance:** core homeowner/contractor journeys pass device/browser testing; App Store privacy and review requirements are met.
- **Approval required:** signing credentials and store submission.

### 15. Security and reliability

- **Reuse / group with:** Security Fixes 01–08B, existing authorization/private upload helpers, regression scripts and existing logging conventions; required across every workstream.
- **Dependencies:** preserve the existing 26-diagnostic TypeScript baseline and isolated database/storage/auth/payment/email configuration.
- **Acceptance:** no regressions in targeted security tests; no cross-user private-photo access; admin and cron operations fail closed; backups/restore, rate limits and error monitoring are documented and exercised.
- **Approval required:** any production access, environment changes, migrations or releases.

### 16. Company and relaunch preparation

- **Reuse / group with:** verified product readiness, roadmap evidence, reliability and operational metrics; group with no coding work until an owner sets scope.
- **Dependencies:** owner decisions, legal/financial advice, hiring and relaunch dates.
- **Acceptance:** written launch checklist with assigned owners, dates, readiness evidence and outstanding risks.
- **Approval required:** corporate, grant, hiring, spend and public launch decisions.

## Current phase release gates

- The Astra change is already locally committed as `da702cb`; its focused contract/fallback test passes and this phase must not rewrite that commit.
- Assistant inference remains disabled unless `QUOTEXBERT_AI_ENABLED=true`; SEO cron drafts remain disabled unless `SEO_DRAFT_AUTOMATION_ENABLED=true`.
- Automatic SEO publishing is disabled; approval and public publishing are distinct admin actions.
- The SEO catalog is empty until approved products and verified affiliate links are provided.
- No migration has been applied, no public content has been published, and no credentials, environment variables, push, merge or deployment have been changed by this phase.
- Before enabling anything: verify Preview database, Clerk, Stripe test mode, private Blob, email sink, OpenAI limits and Vercel project/branch isolation; do not assume URL-based Preview isolation.
