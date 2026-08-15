import assert from 'node:assert/strict';
import {
  CONTRACTOR_PROFILE_OPTIMIZATION_PREHEADER,
  CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT,
  buildContractorProfileOptimizationHtml,
  planContractorProfileOptimizationRecipients,
  sendContractorProfileOptimizationTestEmail,
  type ContractorProfileOptimizationRecipient,
} from '../lib/email';

const future = new Date('2026-09-15T00:00:00.000Z');
const past = new Date('2026-07-15T00:00:00.000Z');
const now = new Date('2026-08-15T00:00:00.000Z').getTime();

function contractor(overrides: Partial<ContractorProfileOptimizationRecipient> = {}): ContractorProfileOptimizationRecipient {
  return {
    id: 'contractor-1',
    email: 'paid@example.ca',
    name: 'Alex Contractor',
    role: 'contractor',
    isActive: true,
    notifyMarketingEmail: true,
    subscriptionStatus: null,
    subscriptionCurrentPeriodEnd: null,
    subscriptions: [{ status: 'active', monthlyPrice: 49, currentPeriodEnd: future }],
    ...overrides,
  };
}

const plan = planContractorProfileOptimizationRecipients([
  contractor(),
  contractor({ id: 'trial', email: 'trial@example.ca', subscriptions: [{ status: 'trialing', monthlyPrice: 49, currentPeriodEnd: future }] }),
  contractor({ id: 'free', email: 'free@example.ca', subscriptions: [] }),
  contractor({ id: 'expired', email: 'expired@example.ca', subscriptions: [{ status: 'active', monthlyPrice: 49, currentPeriodEnd: past }] }),
  contractor({ id: 'inactive', email: 'inactive@example.ca', isActive: false }),
  contractor({ id: 'optout', email: 'optout@example.ca', notifyMarketingEmail: false }),
  contractor({ id: 'invalid', email: 'seed@example.com' }),
  contractor({ id: 'sent', email: 'sent@example.ca' }),
  contractor({ id: 'duplicate', email: 'PAID@example.ca' }),
], new Set(['sent']), now);

assert.equal(plan.counts.contractorsScanned, 9);
assert.equal(plan.counts.payingActive, 7);
assert.equal(plan.counts.eligibleRecipients, 2);
assert.equal(plan.counts.excludedFree, 1);
assert.equal(plan.counts.excludedCanceledInactive, 2);
assert.equal(plan.counts.excludedPreferenceUnsubscribed, 1);
assert.equal(plan.counts.excludedInvalidEmail, 1);
assert.equal(plan.counts.alreadyReceivedCampaign, 1);
assert.equal(plan.counts.excludedDuplicateEmail, 1);

const html = buildContractorProfileOptimizationHtml({ firstName: 'Alex' });
assert.match(html, new RegExp(CONTRACTOR_PROFILE_OPTIMIZATION_SUBJECT));
assert.match(html, new RegExp(CONTRACTOR_PROFILE_OPTIMIZATION_PREHEADER));
assert.match(html, /Hi Alex,/);
assert.match(html, /https:\/\/www\.quotexbert\.com\/contractor\/profile\/edit/);
assert.match(html, /https:\/\/www\.quotexbert\.com\/contractor\/jobs/);
assert.match(html, /905-242-9460/);
assert.match(html, /Turn off marketing emails/);

async function testResendResponseHandling() {
  const returnedError = await sendContractorProfileOptimizationTestEmail('quotexbert@gmail.com', async () => ({
    data: null,
    error: { statusCode: 422, name: 'validation_error', message: 'Rejected' },
  }));
  assert.equal(returnedError.success, false);
  assert.equal(returnedError.apiAccepted, false);
  assert.equal(returnedError.messageId, null);

  const accepted = await sendContractorProfileOptimizationTestEmail('quotexbert@gmail.com', async () => ({
    data: { id: 'test-message-id' },
    error: null,
  }));
  assert.equal(accepted.success, true);
  assert.equal(accepted.apiAccepted, true);
  assert.equal(accepted.messageId, 'test-message-id');
}

testResendResponseHandling()
  .then(() => console.log('contractor profile optimization campaign tests passed'))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });