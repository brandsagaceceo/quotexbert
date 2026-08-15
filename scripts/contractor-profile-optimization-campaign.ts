import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

const APPROVED_TEST_EMAILS = new Set([
  'brandsagaceo@gmail.com',
  'quotexbert@gmail.com',
]);
const LIVE_CONFIRMATION = 'SEND_CONTRACTOR_PROFILE_OPTIMIZATION_AUG_2026';

async function loadPlan() {
  const { prisma } = await import('../lib/prisma');
  const email = await import('../lib/email');
  const [contractors, sentRecords, campaignEventCount] = await Promise.all([
    prisma.user.findMany({
      where: { role: 'contractor' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        notifyMarketingEmail: true,
        subscriptionStatus: true,
        subscriptionCurrentPeriodEnd: true,
        subscriptions: {
          select: { status: true, monthlyPrice: true, currentPeriodEnd: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.emailEvent.findMany({
      where: { type: email.CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN, status: 'sent' },
      select: { userId: true, to: true },
    }),
    prisma.emailEvent.count({
      where: { type: email.CONTRACTOR_PROFILE_OPTIMIZATION_CAMPAIGN },
    }),
  ]);

  const sentKeys = new Set<string>();
  for (const record of sentRecords) {
    if (record.userId) sentKeys.add(record.userId.toLowerCase());
    if (record.to) sentKeys.add(record.to.toLowerCase());
  }

  return {
    email,
    campaignEventCount,
    plan: email.planContractorProfileOptimizationRecipients(contractors, sentKeys),
  };
}

function printCounts(counts: Awaited<ReturnType<typeof loadPlan>>['plan']['counts']) {
  console.log(`Contractors scanned: ${counts.contractorsScanned}`);
  console.log(`Paying/active: ${counts.payingActive}`);
  console.log(`Eligible recipients: ${counts.eligibleRecipients}`);
  console.log(`Excluded free: ${counts.excludedFree}`);
  console.log(`Excluded canceled/inactive: ${counts.excludedCanceledInactive}`);
  console.log(`Excluded preference/unsubscribed: ${counts.excludedPreferenceUnsubscribed}`);
  console.log(`Excluded invalid email: ${counts.excludedInvalidEmail}`);
  console.log(`Excluded internal/test: ${counts.excludedInternalAccount}`);
  console.log(`Excluded duplicate email: ${counts.excludedDuplicateEmail}`);
  console.log(`Already received campaign: ${counts.alreadyReceivedCampaign}`);
  console.log(`Would send: ${counts.wouldSend}`);
}

async function main() {
  const args = new Map(process.argv.slice(2).map((argument) => {
    const [key, ...value] = argument.split('=');
    return [key, value.join('=')];
  }));
  const testEmail = args.get('--test')?.trim().toLowerCase();
  const statusMessageId = args.get('--status')?.trim();
  const live = args.has('--live');

  if (statusMessageId) {
    const { email } = await loadPlan();
    const delivery = await email.getContractorProfileOptimizationTestEmailStatus(statusMessageId);
    console.log(JSON.stringify({
      messageId: statusMessageId,
      deliveryStatus: delivery.status,
      statusLookupSuccess: delivery.success,
      statusLookupError: delivery.error,
    }, null, 2));
    return;
  }

  if (testEmail) {
    if (!APPROVED_TEST_EMAILS.has(testEmail)) throw new Error('Test recipient is not on the approved internal allowlist.');
    const { email } = await loadPlan();
    const result = await email.sendContractorProfileOptimizationTestEmail(testEmail);
    console.log(JSON.stringify({
      test: true,
      recipient: result.payload.to,
      subject: result.payload.subject,
      from: result.payload.from,
      replyTo: result.payload.replyTo,
      success: result.success,
      apiAccepted: result.apiAccepted,
      messageId: result.messageId,
      error: result.error,
    }, null, 2));
    if (!result.success || !result.messageId) throw new Error('Resend did not accept the test email.');

    const delivery = await email.getContractorProfileOptimizationTestEmailStatus(result.messageId);
    console.log(JSON.stringify({
      messageId: result.messageId,
      deliveryStatus: delivery.status,
      statusLookupSuccess: delivery.success,
      statusLookupError: delivery.error,
    }, null, 2));
    console.log('[TEST] One internal test email accepted. No campaign EmailEvent was created.');
    return;
  }

  const { email, campaignEventCount, plan } = await loadPlan();
  printCounts(plan.counts);
  console.log(`Campaign EmailEvents: ${campaignEventCount}`);

  if (!live) {
    console.log('DRY RUN complete. No emails sent.');
    return;
  }

  if (args.get('--confirm') !== LIVE_CONFIRMATION) {
    throw new Error(`Live send requires --confirm=${LIVE_CONFIRMATION}`);
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  for (const recipient of plan.recipients) {
    const result = await email.sendContractorProfileOptimizationEmail(recipient.id);
    if (result.success) sent++;
    else if ('skipped' in result && result.skipped) skipped++;
    else failed++;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log(`Production complete: sent=${sent} failed=${failed} skipped=${skipped}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});