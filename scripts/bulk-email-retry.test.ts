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

async function main() {
  // 1. First request returns 429, second succeeds → retried once, all recipients sent.
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
  }

  // 2. Permanent (non rate-limit) error → no retry, marked failed once.
  {
    let calls = 0;
    const result = await sendBulkEmails(messages, {
      baseRetryDelayMs: 0,
      maxRetries: 4,
      jobId: "lead_permanent",
      batchSend: async () => {
        calls += 1;
        return { data: null, error: { statusCode: 422, name: "validation_error", message: "Invalid `to` field: a@example.com" } };
      },
    });
    assert.equal(calls, 1, "permanent errors are not retried");
    assert.equal(result.sent, 0, "permanent error sends nothing");
    assert.equal(result.failed, 2, "permanent error marks every recipient failed");
    assert.equal(result.failedTo.size, 2, "both recipients recorded in failedTo once");
  }

  // 3. Single successful request → recipients marked sent exactly once.
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
  }

  // 4. Exhausted retries (429 thrown every time) → marked failed once, sent stays zero.
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
  }

  console.log("bulk-email-retry tests passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
