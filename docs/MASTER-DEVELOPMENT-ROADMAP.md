# QuoteXbert Master Development Roadmap

Last updated: 2026-11-25

## Current milestone: Release 1 homepage preview

Status: pushed to PR #28 at `7efb94f`; both Vercel project Preview deployments are ready. Owner review and image provenance remain release gates.

- Restored the approved QX icon and wordmark across the existing site components and browser/app icons.
- Kept the existing six-slide carousel, routes, animation, keyboard/touch controls, and responsive layout. Replaced the phone composition with the kitchen photo directly in private local review mode.
- Simplified homepage copy and removed the redundant slide labels and chips. Kept workflow disclosures and existing route/authentication gates. Banner 3 uses capability-accurate copy because guided AI planning is disabled in the local environment; its CTA still opens the assistant and the existing disabled-state notice remains.
- The supplied package photos are served only by the allowlisted development route. Public/Preview behavior continues to use the existing licensed fallback photographs.
- All seven supplied photo subjects and their mobile variants remain unverified. The manifest has no verified source URL, photographer, or licence for any of them. Do not publish or upload them to Vercel until rights are confirmed.
- Twelve desktop/mobile banner screenshots and a homepage desktop capture are retained as session review artifacts.
- Security patch `b496922` is already an ancestor of this branch; PR #27 is separate. No duplicate security patch was applied.

### Verification

- Private banner review carousel: 9 passed, 1 fallback-only test skipped.
- Licensed public-fallback carousel: 10 passed.
- Private image-route allowlist and production-disabled checks: passed.
- Branding asset regressions: 5 passed.
- User-role authorization, notification-recipient, jobs API security, multi-contractor routing, and quote authorization tests: passed.
- Fixed the mobile assistant observer so it hides the launcher near the estimator without closing a panel opened by the user.
- TypeScript reports 26 existing diagnostics in unrelated application/test logic. No new homepage carousel diagnostics remain; do not suppress these errors.
- Installed dependencies previously verified: Next.js 15.5.29, Sharp 0.35.5, and Clerk 6.39.3. Vercel Node 22 satisfies their runtime requirements.
- PR #28 is open and both Vercel checks pass for commit `7efb94f`. The `quotexbert` Preview is https://quotexbert-git-integration-rele-de53ce-brandsagaceceos-projects.vercel.app; the `quotexbert-production` project's PR Preview is https://quotexbert-production-git-integ-96b56f-brandsagaceceos-projects.vercel.app. Both are Preview deployments, not Production, and require Vercel authentication.

## Release gates

1. Owner provides original listing or photographer/licence evidence for each of the seven supplied photographs.
2. Owner reviews the desktop/mobile screenshots and authenticated Vercel Preview.
3. Keep the supplied unverified photos private and retain licensed public fallbacks.
4. Do not merge to Production or deploy until the owner explicitly approves.

## Subsequent priorities

After homepage review:

1. Complete touchscreen testing of the existing Blog Studio; keep automatic generation and publishing off.
2. Add mandatory signup-source selection and unobtrusive attribution capture to existing onboarding.
3. Add admin-only acquisition-source reporting to the existing dashboard using verified data.
4. Continue Search Console-backed SEO improvements without overwriting published content or enabling paid generation.
5. Continue contractor subscriptions, seven-day trials, lead credits, and separate AI credits without changing active subscriber terms or creating live prices without approval.

## Working boundaries

- Continue on `integration/release-1-homepage-security-preview`; preserve the existing staging worktree and all unrelated platform features.
- Branch commit/push and Vercel Preview are complete. Production deployment, merge, production environment changes, database migrations, and billing changes remain unauthorized.
