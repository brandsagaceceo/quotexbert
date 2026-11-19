/**
 * LIVE end-to-end proof of the batch send path against the real Resend API.
 *
 * Sends through the exact production helper (sendBulkEmails) to:
 *   - delivered@resend.dev  -> Resend's official always-delivered test sink
 *   - poison@example.com    -> an undeliverable address that triggers Resend's 422
 *
 * Proves, against the real API, that:
 *   1. A real/deliverable recipient IS delivered (sent >= 1).
 *   2. A poison address no longer blocks it (split isolates the bad one).
 *
 * No real contractor is emailed. Run: npx tsx scripts/live-send-test.ts
 */
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

async function main() {
  // Dynamic import AFTER env load so lib/email's module-level Resend client picks up RESEND_API_KEY.
  const { sendBulkEmails, isSendableEmail } = await import("../lib/email");

  console.log("isSendableEmail('delivered@resend.dev') =", isSendableEmail("delivered@resend.dev"));
  console.log("isSendableEmail('poison@example.com')    =", isSendableEmail("poison@example.com"));
  console.log("isSendableEmail('bad@clerk.user')        =", isSendableEmail("bad@clerk.user"));
  console.log("isSendableEmail('')                       =", isSendableEmail(""));
  console.log("isSendableEmail('real@gmail.com')         =", isSendableEmail("real@gmail.com"));

  const messages = [
    { to: "delivered@resend.dev", subject: "[QX TEST] batch delivery proof", html: "<p>Deliverable recipient — should arrive.</p>" },
    { to: "poison@example.com", subject: "[QX TEST] batch delivery proof", html: "<p>Undeliverable — should be isolated.</p>" },
  ];

  console.log("\nLIVE sendBulkEmails to [delivered@resend.dev, poison@example.com]...");
  const result = await sendBulkEmails(messages, { jobId: "live_proof" });
  console.log("  sent    :", result.sent);
  console.log("  failed  :", result.failed);
  console.log("  failedTo:", [...result.failedTo]);
  for (const [to, err] of result.errorByRecipient) console.log(`  error[${to}]:`, err);

  const okDelivered = !result.failedTo.has("delivered@resend.dev") && result.sent >= 1;
  console.log(`\nRESULT: deliverable recipient delivered = ${okDelivered ? "YES ✅" : "NO ❌"}`);
}
main().catch((e) => { console.error(e); process.exit(1); });
