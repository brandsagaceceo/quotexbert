# QuoteXbert Master Development Roadmap

This is the single tracking view for the platform workstreams. Statuses reflect code or test evidence, not intent. “IN PROGRESS” does not mean production-ready. No external service, credential, payment, or release is assumed configured unless recorded here with evidence.

## Current isolated development checkpoint

### Spring 2027 staging integration

The active development view is now `integration/spring-2027-staging`, based on latest `origin/main` (`706fb7a`). All five PR heads (#20-24) are preserved as merge ancestors; none was merged into main or closed. The only content conflict was in README documentation, resolved by retaining both sections. Combined layout metadata keeps both QX icons and optional genuine Google verification; combined homepage code retains motion and estimate handoff.

| State | Evidence |
| --- | --- |
| Code integrated | All five full PR heads retained; existing Prisma schema unchanged; no duplicate implementation added. |
| Tests passed | Seventeen relevant regression files run together: 28 runner tests pass. Four actual-app browser tests cover the carousel, responsive journeys and public-activity error/retry/empty/ISO-time behavior. Deliberate isolated fixtures make no live provider/database calls. |
| Local preview verified | Existing app returns HTTP 200 on port 3102 without loading database/paid-service credentials. At 320, 375, 390, 768, 1024, 1280 and 1440px: no banner clipping/overflow; both header logos load with equal centre coordinates. Normal gradients are 12 seconds; reduced motion disables decoration. Anonymous SEO API request returns 403. |
| Remote preview verified | Canonical Preview build succeeds for runtime commit `eb82664`, containing all five packages, carousel and strict-build fixes. Anonymous access redirects to Vercel Login; remote visual/authenticated runtime acceptance is blocked, not claimed. Later roadmap-only commits do not change that tested runtime. |
| Production enabled | No. No main merge, production deployment, paid AI activation or live data writes. |
| Release readiness | The existing 26 TypeScript diagnostics are resolved with strict settings retained. Production-style build passes with type checking re-enabled (1,683 static pages generated); `/api/stats` is dynamic rather than build-cached. Production-mode local runtime requires legitimate Clerk configuration; the missing key was recorded, not bypassed. Authenticated/provider acceptance and the legacy checkout verification gap remain release blockers. |

**Homepage inventory and completion:** scoped discovery found existing banners, estimator, create-lead, one assistant, visualizer and design example library, but no rotating carousel. One necessary `HomepageJourneyCarousel` component now extends the existing hero with six journeys, six-second rotation, manual controls, keyboard navigation, horizontal swipe, pause-on-hover/focus/hidden-tab and reduced-motion behavior. One focused browser test file is the only other new file. Existing destinations and estimate/job handlers are reused. The existing assistant launcher is shared, with a truthful disabled-guided-planning notice and mobile opening fix. No inspiration route was found in the scoped page/component search: the library is labelled stock examples, not a released feed or real transformations. Unverified homepage endorsements/testimonials are not rendered. Existing public activity now validates records, parses ISO timestamps and shows explicit empty/error/retry states instead of fabricated fallback events.

**Integrated Blog Studio verification:** the canonical editor, legacy redirect, SeoArticle queries/counts, shared generator/budget/daily reservation, admin APIs, edit-invalidates-approval contract and separate explicit publish action remain the existing implementations. Integrated isolated regressions pass. Preview publication is disabled; manual/scheduled generation and preview writes were not enabled. Search Console still uses optional genuine verification and existing sitemap setup, with metrics explicitly disconnected. Real administrator/database/Google acceptance is blocked, not replaced with sample dashboard activity.

**Release-readiness inventory:** scoped compiler diagnostics identified existing DTO/null/optional-property mismatches and incomplete test fixtures, not a need for new models or services. Existing email, analytics, lead/quote and maintenance-script contracts were corrected in place. The existing bid page also incorrectly treated Next 14 params as a Promise and actual string/null prices as numbers; it now loads the existing route and orders/formats real supplied prices without fabricated zero bids. The legacy subscription-success screen no longer claims activation on missing/failed verification, guesses purchase amounts or asserts email delivery. Its referenced verification endpoint is absent; the existing legacy/category and tiered checkout flows need authorized Stripe-test reconciliation, not a third verifier. One necessary client-state regression file covers actual functions with isolated hooks; it does not prove signed-in end-to-end acceptance.

**Statistics inventory and completion:** the existing public `/api/stats` route was build-cached and returned invented jobs/contractors/reviews/rating after database failures. No frontend consumer was found in the scoped page/component search. The same route now uses live aggregates, excludes private/unpublished and seeded jobs, returns null for no rating, disables caching and reports HTTP 503 on failure. One focused handler test file covers real aggregate mapping, empty reviews and unavailable storage. No new API, model, database, dashboard or service was introduced. The broader admin overview is not declared complete.

Historical package entries below retain their original per-branch evidence. Current combined test/build status is recorded above.

- **Existing work preserved:** the original working directory's 83 modified/untracked files remain unchanged. This tracked roadmap starts from the existing untracked roadmap, copied into the isolated Blog Studio worktree rather than overwriting the original.
- **QX branding / PR #20:** existing header/footer and lossless display improvements are already implemented; do not repeat them. Commit `bdff6f0` additionally converts only the approved square PNG into existing favicon/ICO/SVG/Apple-touch/web-app outputs. Four focused asset tests pass, including pixel-for-pixel comparison against direct resizes. Both PNG masters and display derivatives remain unchanged. The updated Preview serves byte-identical converted icons; header centring is within 0.51px with no overflow at all seven previously tested widths (320-1440px). Signed-in header acceptance remains unverified without an authorized account. User visual approval remains required; no merge or production promotion is authorized.
- **AI Blog Studio / draft PR #21:** isolated from origin/main, commit `d041259`. The existing SEO editor is now canonical at `/admin/blog`; the old `/admin/blog/seo` URL redirects there. Sample posts/authors/views and simulated loading are removed. Existing APIs provide real status totals, filters and pagination. Existing generator, topic queue, daily reservation and global budget are reused for separately gated manual generation.
- **Private publication contract:** approval remains private, editing clears previous approval, and only the existing explicit administrator publish action can publish. Cron's old optional auto-publish path is removed. Non-production editing/generation requires deliberate isolated-database authorization; no environment variable, paid inference, migration or live data has been changed.
- **Focused SEO evidence:** authorization/pagination/storage-error, approval/edit/publication/concurrency, content-validation, cron-no-auto-publication, and manual-generation gate/budget/reservation tests pass using isolated mocks only. Actual dashboard component checks use clearly labelled, local-only fixtures, not production activity: responsive rendering (including unbroken long titles/slugs at 320-1440px), read-only controls, filtering, storage failure/retry, stale-request cancellation, and private generation failure reporting pass. Combined generation/refresh errors retain both causes and clear stale generating notices. A Preview build succeeded, but Vercel login and an authorized administrator/isolated database session are unavailable. Live data editing, generation and publication acceptance remain blocked, not assumed complete.
- **Search Console:** no existing API service was found in the scoped SEO/admin discovery. The existing sitemap and layout verification mechanism are reused for setup. The placeholder verification token is removed; optional `GOOGLE_SITE_VERIFICATION` is supported. Ownership verification and API metrics are **not connected**; no search data is fabricated.
- **Homepage motion / draft PR #22:** isolated from origin/main, commit `31c7d54`. Four existing banner sections reuse burgundy tokens and existing gradient/blob animations; gradient motion is slowed to 12 seconds. Existing offer conditions, links and prices are preserved. The final estimate CTA respects reduced motion. Actual JSX/CSS checks cover anonymous/homeowner/contractor conditions and 320-1440px layouts. The real local homepage also responds with HTTP 200 and has no banner text/control clipping or horizontal overflow at all seven widths. A secondary-project Preview build succeeded. The production-named project's Preview hit the existing Next Google font-loader error; an attempted Preview-only no-cache retry was cancelled at Vercel identity verification. No code challenge was requested or bypassed.
- **Estimate handoff / draft PR #23:** isolated from origin/main, commit `8e0b165`. Existing homepage/landing/create-lead routes retain the posting destination across authentication and report storage failures. Pending saves survive failed responses and clear only after a confirmed save. A small client helper shares the existing cache key/API; optional UUID idempotency reuses the existing AIEstimate primary key with owner checks. No schema, model or parallel workflow was added. Focused client, actual-handler, existing project-regression and actual-route/in-memory-Prisma tests pass, including a committed save with a lost response followed by a retry producing exactly one private estimate. The Preview build succeeded; real Clerk/database/private-photo acceptance remains outstanding.
- **Contractor job loading / draft PR #24:** isolated from origin/main, commits `f08949e` and `7cf9abd`. The existing job-board page now separates HTTP/transport/JSON/payload-shape failures from genuinely empty or filtered results, offers retry, and prevents stale responses/finalizers from replacing newer results or a signed-out state. Even blank service errors retain visible failure feedback. Failures no longer imply zero jobs or suggest expanding subscriptions; empty copy no longer claims unverified daily activity. Existing current-object/legacy-array API contracts remain compatible. Five focused actual-loader/JSX tests and the existing jobs API regression file pass (six runner groups). The only new file is the focused client regression test; no route, model, access or billing change was added. TypeScript remains at the same 26 diagnostic baseline. Preview build and authenticated contractor acceptance remain separate gates.
- **Remaining roadmap:** branding visual approval, signed-in acceptance and authorized isolated-service end-to-end testing are release gates. Continue scoped discovery of the existing contractor/AI/credits/feed/mobile workflows below; none is declared complete merely because files exist. The separate AI HQ is unchanged. No production merge/deployment, live writes, migrations or paid-service activation occurred.

### Review links

- Integrated development: [draft PR #25](https://github.com/brandsagaceceo/quotexbert/pull/25), [canonical integrated Preview](https://quotexbert-production-jbo2feans-brandsagaceceos-projects.vercel.app), and [current local review](http://127.0.0.1:3102). The canonical Preview contains the full tested runtime (`eb82664`) and requires authorized Vercel login for visual approval.
- Branding: [PR #20](https://github.com/brandsagaceceo/quotexbert/pull/20) and [verified Preview](https://quotexbert-production-2nl4cf3wu-brandsagaceceos-projects.vercel.app).
- Blog Studio: [draft PR #21](https://github.com/brandsagaceceo/quotexbert/pull/21) and [protected Preview](https://quotexbert-production-bfqt44eik-brandsagaceceos-projects.vercel.app/admin/blog).
- Homepage: [draft PR #22](https://github.com/brandsagaceceo/quotexbert/pull/22), [successful Preview build](https://quotexbert-bhc3whg9t-brandsagaceceos-projects.vercel.app), and [working local review](http://127.0.0.1:3101). The local instance serves the existing application without loading database or paid-service credentials; authenticated/provider-backed actions are not configured.
- Handoff: [draft PR #23](https://github.com/brandsagaceceo/quotexbert/pull/23) and [Preview build](https://quotexbert-production-gzdi6xr7g-brandsagaceceos-projects.vercel.app).
- Contractor job loading: [draft PR #24](https://github.com/brandsagaceceo/quotexbert/pull/24); Preview checks for the latest head are not yet verified. Real-account acceptance is not assumed complete.
- Original package links remain historical independent previews. PR #25 is the single active combined development view, not a production release. Preview build success does not establish authenticated runtime or database acceptance.

## Status and evidence

| #   | Workstream                                                        | Status        | Current evidence                                                                                                                                                                                                                                                                                                                                   |
| --- | ----------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Unified QuoteXbert AI — homeowners and contractors                | IN PROGRESS   | Existing `components/AIAssistantPopup.tsx`; optional role-aware route `app/api/ai/assistant/route.ts`; centralized client/model map in `lib/openai-client.ts`. Feature flag is disabled unless `QUOTEXBERT_AI_ENABLED=true`.                                                                                                                       |
| 2   | Quick estimator and optional Astra integration                    | VERIFIED DONE | Existing estimator remains the default; optional integration is separately gated. Commit `da702cb` includes estimator changes and `scripts/astra-estimate.test.ts` covers normalization/fallback. Re-run the focused test as part of release checks.                                                                                               |
| 3   | AI renovation planning, photo visualization and job drafts        | IN PROGRESS   | Guided assistant validates homeowner-owned private photos and creates private `SavedProject` drafts; existing publish endpoint still requires an explicit homeowner action. Visualization code remains separate and is not being replaced.                                                                                                         |
| 4   | Homeowner job posting, matching, quotes and messaging             | IN PROGRESS   | PR #23 fixes authentication return destinations, pending-estimate retention and owner-bound retry idempotency using existing routes/models. Focused mocked integration and existing project regression tests pass. Real authenticated estimate/photo/job/quote/message lifecycle acceptance remains outstanding. |
| 5   | Contractor onboarding, profiles, notifications and calendars      | IN PROGRESS   | Existing profile, pricing/onboarding entry and job-board infrastructure were traced, not rebuilt. PR #24 fixes verified job-list loading/error/retry/race behavior with passing focused client/API tests. Real onboarding, verification, quoting, messaging, notifications and calendar acceptance remain outstanding; presence in code is not completion. |
| 6 | SEO automation, Search Console and weekly blog drafting | IN PROGRESS | Existing editor consolidated at `/admin/blog`; real SeoArticle counts/filtering/pagination replace samples. Existing generation is reused for gated manual requests; approval/edit/publication and preview isolation tests pass. Scheduled drafting remains available but cannot publish. No paid calls, migration or live writes performed. Authenticated preview acceptance and authorized environment setup remain outstanding. Search Console setup is prepared, not connected. |
| 7   | Affiliate catalog, Associates and DIY content                     | IN PROGRESS   | `lib/seo/affiliate-products.ts` is an empty-by-default approved catalog. Generation can only reference catalog entries; the editorial disclosure is wired for any populated catalog. Merchant approval, IDs and verified links remain required.                                                                                                    |
| 8   | Instagram-style feed and homeowner lead protection                | NOT STARTED   | No work in this phase. Reuse existing private-photo ownership and authorization helpers when scoped.                                                                                                                                                                                                                                               |
| 9   | Subscriptions, seven-day trial, lead credits and rewards          | IN PROGRESS   | Existing checkout/entitlement authorization regressions pass; no prices, Stripe settings or entitlements changed. The legacy confirmation UI now fails visibly instead of claiming activation without verification. Its missing verifier and legacy/tiered flow reconciliation remain release blockers requiring authorized Stripe-test acceptance. |
| 10  | Separate prepaid AI credits, usage metering and Stripe            | NOT STARTED   | No prepaid AI-credit workflow added. Existing subscription/lead-credit logic is not a substitute.                                                                                                                                                                                                                                                  |
| 11  | Contractor AutoPilot, private CRM and forwarded email leads       | NOT STARTED   | No CRM or email-forwarding automation added. Reuse the existing authenticated messaging and job contracts when approved.                                                                                                                                                                                                                           |
| 12  | Receipt scanning and job profitability tracking                   | NOT STARTED   | No receipt or profitability workflow added.                                                                                                                                                                                                                                                                                                        |
| 13  | Local AI headquarters and permitted homeowner lead-discovery bots | NOT STARTED   | Kept outside the website codebase and not implemented. Future communication requires an approved authenticated API and privacy review.                                                                                                                                                                                                             |
| 14  | Mobile optimization, app strategy and App Store publishing        | IN PROGRESS   | PR #20 converts existing approved artwork for web/Apple-touch icons; PR #22 verifies existing banner layouts at 320-1440px and reduced motion. Native packaging, store assets, signing, device acceptance and App Store release are not completed. Existing Next.js/Capacitor dependencies are not release evidence. |
| 15 | Security, privacy, testing, backups, analytics and reliability | IN PROGRESS | No repeat security audit. Existing authorization/privacy regressions are retained in the 28-test combined pass. The 26 TypeScript diagnostics are resolved; strict type checking is enforced in the successful production-style build. Homepage/public-statistics fake fallbacks are removed. Runtime auth/configuration, full isolated-service workflows, deployment isolation and operational backups still need acceptance. |
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
- **Current package:** PR #23 adds only a narrow client helper and focused regression test file; existing pages and save API are extended in place. Optional request IDs preserve legacy callers without a migration. Real authentication, isolated database and private-storage acceptance are still required.

### 5. Contractor account workflow

- **Reuse / group with:** existing contractor profile, onboarding, notification and calendar components; group with 4 and 11.
- **Scoped entry follow-up:** existing `ContractorPlanCTA.tsx` stores the selected plan in `post_auth_redirect`, consumed by `app/onboarding/page.tsx`. Plan/tour storage-failure recovery in that entry path remains unfinished; it was traced, not changed or accepted by the job-loading package.
- **Dependencies:** role authorization and contractor account acceptance tests.
- **Acceptance:** profile setup, availability and notifications work across web/mobile; assistant cannot send or save a quote without an explicit user flow.
- **Approval required:** externally visible messaging or notification changes.

### 6. SEO drafting and review

- **Reuse / group with:** current blog routes, metadata, sitemap, shared OpenAI client and Vercel Cron; group with workstream 7.
- **Dependencies:** the existing `SeoArticle` table/migration must be present in an approved isolated environment; approved topic queue; `CRON_SECRET`; `SEO_DRAFT_AUTOMATION_ENABLED=true` only when authorized. This package creates no schema or migration and does not apply existing migrations.
- **Acceptance:** at most one generation attempt per UTC day/slot; duplicate topics are skipped; schema/content/link checks pass; drafts/failures are private; only an admin can edit/approve/reject/publish; public list/detail/metadata/sitemap include published articles only.
- **Approval required:** environment setup, paid inference, migration application, Search Console access and any public publication.
- **Current implementation flags:** `SEO_MANUAL_DRAFT_ENABLED` authorizes the manual generator independently of cron; `SEO_DRAFT_AUTOMATION_ENABLED` continues to control scheduled drafts. Non-production writes also require `SEO_PREVIEW_WRITES_ENABLED` only after database isolation is verified. The old `SEO_AUTO_PUBLISH_ENABLED` variable no longer authorizes publication.
- **Compatibility:** `/admin/blog/seo` redirects to the existing canonical `/admin/blog` editor. Existing GET/PUT/action API paths are retained; manual generation is POST on the existing collection API, not a parallel service.

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
- **Dependencies:** keep the now-clean strict TypeScript/build baseline and obtain authorized isolated database/storage/auth/payment/email configuration.
- **Acceptance:** no regressions in targeted security tests; no cross-user private-photo access; admin and cron operations fail closed; backups/restore, rate limits and error monitoring are documented and exercised.
- **Approval required:** any production access, environment changes, migrations or releases.

### 16. Company and relaunch preparation

- **Reuse / group with:** verified product readiness, roadmap evidence, reliability and operational metrics; group with no coding work until an owner sets scope.
- **Dependencies:** owner decisions, legal/financial advice, hiring and relaunch dates.
- **Acceptance:** written launch checklist with assigned owners, dates, readiness evidence and outstanding risks.
- **Approval required:** corporate, grant, hiring, spend and public launch decisions.

## Original integration phase release gates (retained context)

- The Astra change is already locally committed as `da702cb`; its focused contract/fallback test passes and this phase must not rewrite that commit.
- Assistant inference remains disabled unless `QUOTEXBERT_AI_ENABLED=true`; SEO cron drafts remain disabled unless `SEO_DRAFT_AUTOMATION_ENABLED=true`.
- Automatic SEO publishing is disabled; approval and public publishing are distinct admin actions.
- The SEO catalog is empty until approved products and verified affiliate links are provided.
- No migration has been applied, no public content has been published, and no credentials, environment variables, push, merge or deployment have been changed by this phase.
- Before enabling anything: verify Preview database, Clerk, Stripe test mode, private Blob, email sink, OpenAI limits and Vercel project/branch isolation; do not assume URL-based Preview isolation.

## Current release gates

- PRs #20-24 remain open and unmerged; PR #25 is the single isolated integration branch/Preview. No main merge or production promotion is authorized.
- Do not enable AI spending, cron, preview writes, public publishing, Google access, or migrations as part of preview validation.
- Full TypeScript validation and the production-style build now pass with build-time type checks enabled. Existing lint disabling is unchanged; do not claim lint or complete production runtime acceptance.
- The legacy subscription confirmation route references a missing verifier. Resolve its connection to the existing authoritative billing flow and test with authorized Stripe-test accounts before release; do not invent success or another billing system.
- Production-mode local browsing without a Clerk key fails closed in middleware. A legitimate test configuration/session is required; development-mode anonymous review is not authenticated acceptance.
- Credential-free development enters the existing Clerk SDK's keyless mode and shows configuration controls plus client/server-serialization errors originating in its keyless client code. Carousel/header/layout checks pass, but the local app is not a console-clean production-runtime acceptance. No auth provider replacement, SDK workaround or bypass was added.
- Visual follow-up still includes existing estimator/FAQ/example copy claiming a 1,000+ training/customer sample; these claims were not verified and must be substantiated or removed in the existing components. Removing homepage testimonial/activity fallbacks is not a claim that every marketing statement or estimator failure path is complete.
- Existing main admin overview metrics and the remaining marketplace workstreams are not verified by the Blog Studio package.
- Continue independent safe roadmap packages while visual approval, test accounts, isolated infrastructure, external credentials or product decisions are outstanding.
