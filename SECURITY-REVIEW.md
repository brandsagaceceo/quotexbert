# QuoteXbert Security Review and Audit Closeout

Date: 2026-11-03

## Scope and outcome

Reviewed the security-fix history on `security/quotexbert-hardening` through
`5d017c1897096a3f1e1895869e1b08ce8f74bede` and security-sensitive authorization
paths for accounts, admin role assignment, homeowner data and photos, leads,
quotes, messaging, subscriptions, and payments.

No remaining **critical or high** vulnerability was confirmed. No application
code or security-fix commits were made during closeout. This findings summary is
being committed separately. The security-fix branch tip matches
`origin/security/quotexbert-hardening`; the existing worktree contains unrelated
local modifications, which were preserved.

## Completed security-fix history

The following security-fix commits are present in order after `origin/main`:

| Commit | Change |
|---|---|
| `420e362` | Authorize homeowner jobs by session |
| `69587bd` | Prevent admin role self-assignment |
| `5204ad7` | Protect private account profile data |
| `dbbcb77` | Protect contractor portfolio items |
| `77048f0` | Protect public profile and review privacy |
| `13abeab` | Authorize messaging participants |
| `8241ff0` | Secure contractor lead claiming |
| `de13989` | Restrict legacy billing pause changes |
| `e362b95` | Authorize Stripe payment methods |
| `2488862` | Authorize subscription entitlements |
| `3478d09` | Authorize quote lifecycle actions |
| `5811312` | Protect quote price suggestions |
| `52d0631` | Secure homeowner estimates and project publishing (08A) |
| `5d017c1` | Contain homeowner draft photos (08B) |

All listed security-fix commits are pushed; the latest security-fix commit is
`5d017c1897096a3f1e1895869e1b08ce8f74bede`. Findings-summary commits created
for this closeout are local and have not been pushed.

## Remaining finding

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | ⚪ MEDIUM | `app/api/payments/setup/route.ts` | 136-163 | A caller-supplied, unattached Stripe PaymentMethod ID is accepted and attached to the authenticated caller's customer. Require server-verifiable SetupIntent provenance or reject unattached methods before attaching. | 8/10 |

The helper in `lib/stripe-customer-ownership.ts:14-20` considers an unattached
method acceptable, and the route attaches it at lines 162-165. This requires an
attacker to obtain a valid unattached PaymentMethod ID; no critical/high payment
exploit was confirmed. The existing payment authorization test currently
asserts that unattached methods are allowed. Defer this medium-priority issue to
a separately scoped payment follow-up with tests for unattached, caller-owned,
and other-customer methods.

No additional low-priority vulnerability was confirmed in this scoped review.

## Verification

- Focused security regression tests: **15/15 passed** using the repository's
  local test scripts. No production data or infrastructure was used.
- TypeScript: `npm run typecheck` exits nonzero with **26 diagnostics**, matching
  the provided existing baseline. No files were changed by this closeout.
- The private-photo unit/ownership checks pass. Live Preview HTTP tests for
  owner upload/read, signed-out denial, and other-homeowner denial were **not
  run**: no verified Preview URL or isolated disposable owner/other-homeowner
  sessions were available. No live upload, account, database, or Blob operation
  was attempted.
- No merge, push, production operation, or deploy was performed during
  closeout.

## Deferred release requirements and readiness

- Before releasing Security Fix 08B to a Preview or production deployment,
  provision and verify the private Blob token in that environment. The
  workspace reports that `PRIVATE_BLOB_READ_WRITE_TOKEN` exists for Preview
  only; actual upload/read and denial HTTP outcomes remain unverified.
- Run the deferred isolated Preview HTTP checks using only disposable
  non-production fixtures before release.
- Address the medium Stripe PaymentMethod ownership finding in a separate
  follow-up; it is not a critical/high blocker for returning to feature
  development.
- The existing 26 TypeScript diagnostics remain a build/typecheck concern and
  are not attributed to this security closeout.

**Readiness:** Security closeout is complete. Returning to feature development
is reasonable; do not treat private Blob or live Preview validation as complete
release verification.
