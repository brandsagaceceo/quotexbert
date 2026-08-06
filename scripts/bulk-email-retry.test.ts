import assert from "node:assert/strict";
import { sendBulkEmails } from "../lib/email";

const messages = [
  { to: "a@example.com", subject: "New job", html: "<p>one</p>" },
  { to: "b@example.com", subject: "New job", html: "<p>two</p>" },
];

const rateLimitErrorResponse = {
  data: null,
  error: { statusCode: 429, name: "rate_limit_exceeded", message: "Too many requests" },
};
const successResponse = { data: { data: [{ id: "1" }, { id: "2" }] }, error: null };

function parseErr(result: { errorByRecipient: Map<string, string> }, to: string) {
  const raw = result.errorByRecipient.get(to);
  assert.ok(raw, `expected a stored error for ${to}`);
  return JSON.parse(raw as string);
}

async function main() {
  // 1. First request returns 429, second succeeds → retried once, all recipients sent, no stored errors.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      maxRetries: 4,
      jobId: "lead_retry",
      batchSend: async () => {
        calls += 1;
        return calls === 1 ? rateLimitErrorResponse : successResponse;
      },
    });
    assert.equal(calls, 2, "429 is retried exactly once before success");
    assert.equal(result.sent, 2, "all recipients counted sent after successful retry");
    assert.equal(result.failed, 0, "no failures after a successful retry");
    assert.equal(result.failedTo.size, 0, "no recipient left in failedTo after success");
    assert.equal(result.errorByRecipient.size, 0, "successful send stores no error (error: null)");
  }

  // 2. Permanent returned { error } → no retry, error persisted once per recipient.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      maxRetries: 4,
      jobId: "lead_permanent",
      batchSend: async () => {
        calls += 1;
        return { data: null, error: { statusCode: 422, name: "validation_error", message: "Invalid `to` field" } };
      },
    });
    // Validation failures are not rate-limit retried, but the all-or-nothing batch is split
    // to isolate the bad address: batch(2) fails -> [1] + [1], so 1 + 2 = 3 requests.
    assert.equal(calls, 3, "validation failure splits the batch to isolate the bad address");
    assert.equal(result.sent, 0, "permanent error sends nothing");
    assert.equal(result.failed, 2, "permanent error marks every recipient failed");
    assert.equal(result.failedTo.size, 2, "both recipients recorded in failedTo once");
    assert.equal(result.errorByRecipient.size, 2, "each failed recipient has a stored error");
    const errA = parseErr(result, "a@example.com");
    assert.equal(errA.status, 422, "persisted status");
    assert.equal(errA.name, "validation_error", "persisted error name");
    assert.equal(errA.thrown, false, "returned { error } marked thrown:false");
    assert.equal(errA.attempts, 1, "permanent error records a single attempt");
    // All recipients from the same rejected batch share the identical sanitized error.
    assert.equal(
      result.errorByRecipient.get("a@example.com"),
      result.errorByRecipient.get("b@example.com"),
      "same batch error stored for all recipients",
    );
  }

  // 3. Thrown error → details (thrown:true) persisted.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      maxRetries: 4,
      jobId: "lead_thrown",
      batchSend: async () => {
        calls += 1;
        throw Object.assign(new Error("Something broke"), { statusCode: 500, name: "application_error" });
      },
    });
    // Permanent thrown errors also split the batch to isolate the failing recipient: 1 + 2 = 3.
    assert.equal(calls, 3, "permanent thrown error splits the batch to isolate the failing recipient");
    const err = parseErr(result, "a@example.com");
    assert.equal(err.status, 500, "persisted thrown status");
    assert.equal(err.name, "application_error", "persisted thrown name");
    assert.equal(err.thrown, true, "thrown error marked thrown:true");
    assert.equal(err.attempts, 1, "single attempt for permanent thrown error");
  }

  // 4. Email addresses inside error messages are redacted before persistence.
  {
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      jobId: "lead_redact",
      batchSend: async () => ({
        data: null,
        error: { statusCode: 422, name: "validation_error", message: "Invalid recipient real.person@contractor.com is not allowed" },
      }),
    });
    const err = parseErr(result, "a@example.com");
    assert.ok(!/real\.person@contractor\.com/.test(err.message), "raw email must not appear in stored message");
    assert.match(err.message, /\[redacted-email\]/, "email is redacted in stored message");
  }

  // 5. Single successful request → recipients sent once, no stored errors.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      jobId: "lead_success",
      batchSend: async () => {
        calls += 1;
        return successResponse;
      },
    });
    assert.equal(calls, 1, "success takes a single request");
    assert.equal(result.sent, 2, "recipients counted sent once");
    assert.equal(result.failed, 0, "no failures on success");
    assert.equal(result.failedTo.size, 0, "failedTo empty on success");
    assert.equal(result.errorByRecipient.size, 0, "no error stored on success (error: null)");
  }

  // 6. Exhausted 429 retries → final error stored once per recipient, sent stays zero.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      maxRetries: 3,
      jobId: "lead_exhausted",
      batchSend: async () => {
        calls += 1;
        throw Object.assign(new Error("Too many requests"), { statusCode: 429, name: "rate_limit_exceeded" });
      },
    });
    assert.equal(calls, 4, "initial attempt plus three retries");
    assert.equal(result.sent, 0, "nothing sent when every attempt is throttled");
    assert.equal(result.failed, 2, "recipients marked failed only after retries are exhausted");
    assert.equal(result.failedTo.size, 2, "each recipient recorded in failedTo once");
    assert.equal(result.errorByRecipient.size, 2, "final error stored once per recipient");
    const err = parseErr(result, "a@example.com");
    assert.equal(err.status, 429, "persisted final rate-limit status");
    assert.equal(err.thrown, true, "final thrown flag preserved");
    assert.equal(err.attempts, 4, "records total attempts after exhaustion");
  }

  // 7. All-or-nothing batch poisoning: one undeliverable address rejects the whole batch
  //    (Resend's real 422 behavior), but splitting must still deliver to the good recipient.
  {
    const batch = [
      { to: "real.contractor@gmail.com", subject: "New job", html: "<p>good</p>" },
      { to: "seed_account@example.com", subject: "New job", html: "<p>bad</p>" },
    ];
    let calls = 0;
    const result = await sendBulkEmails(batch, {
      baseRetryDelayMs: 0,
      jobId: "lead_poison",
      // Simulate Resend: reject the ENTIRE batch if any recipient is undeliverable.
      batchSend: async (payload) => {
        calls += 1;
        const hasBad = payload.some((p) => p.to.endsWith("@example.com"));
        return hasBad
          ? { data: null, error: { statusCode: 422, name: "validation_error", message: "Invalid `to` field" } }
          : { data: { data: payload.map((_, i) => ({ id: String(i) })) }, error: null };
      },
    });
    assert.equal(calls, 3, "batch(2) fails -> splits into [good] + [bad]");
    assert.equal(result.sent, 1, "the deliverable recipient still receives the email");
    assert.equal(result.failed, 1, "only the undeliverable recipient is marked failed");
    assert.ok(!result.failedTo.has("real.contractor@gmail.com"), "good recipient is NOT in failedTo");
    assert.ok(result.failedTo.has("seed_account@example.com"), "bad recipient IS in failedTo");
    assert.equal(result.errorByRecipient.size, 1, "only the bad recipient has a stored error");
  }

  console.log("bulk-email-retry tests passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
