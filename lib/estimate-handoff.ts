const PENDING_ESTIMATE_KEY = "pending_save_estimate";

let inFlight: {
  homeownerId: string;
  raw: string;
  promise: Promise<boolean>;
} | null = null;

export function queueEstimateForSignIn(payload: Record<string, unknown>) {
  localStorage.setItem(
    PENDING_ESTIMATE_KEY,
    JSON.stringify({ ...payload, clientRequestId: crypto.randomUUID() }),
  );
}

export async function resumePendingEstimate(
  homeownerId: string,
): Promise<boolean> {
  let raw = localStorage.getItem(PENDING_ESTIMATE_KEY);
  if (!raw) return false;
  if (inFlight?.homeownerId === homeownerId && inFlight.raw === raw) {
    return inFlight.promise;
  }

  let pending: unknown;
  try {
    pending = JSON.parse(raw);
  } catch {
    throw new Error(
      "Your saved estimate could not be read. It has not been removed.",
    );
  }
  if (!pending || typeof pending !== "object" || Array.isArray(pending)) {
    throw new Error("Your saved estimate is invalid. It has not been removed.");
  }
  const requestId =
    "clientRequestId" in pending ? pending.clientRequestId : undefined;
  if (requestId !== undefined && typeof requestId !== "string") {
    throw new Error(
      "Your saved estimate has an invalid save identifier. It has not been removed.",
    );
  }
  const payload = {
    ...pending,
    clientRequestId: requestId ?? crypto.randomUUID(),
  };
  const serialized = JSON.stringify(payload);
  if (serialized !== raw) {
    localStorage.setItem(PENDING_ESTIMATE_KEY, serialized);
    raw = serialized;
  }
  const savedRaw = raw;

  const promise = Promise.resolve()
    .then(async () => {
      const response = await fetch("/api/ai-estimates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, homeownerId }),
      }).catch(() => {
        throw new Error(
          "The save service could not be reached. Your estimate remains in this browser. Refresh to retry.",
        );
      });
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The save response could not be confirmed. Your estimate remains in this browser. Refresh to retry.",
        );
      }
      const record = result && typeof result === "object" ? result : null;
      const estimate = record && "estimate" in record ? record.estimate : null;
      if (
        !response.ok ||
        !record ||
        !("success" in record) ||
        record.success !== true ||
        !estimate ||
        typeof estimate !== "object" ||
        !("id" in estimate) ||
        typeof estimate.id !== "string" ||
        !estimate.id
      ) {
        const reason =
          record && "error" in record && typeof record.error === "string"
            ? record.error
            : "The estimate save was not confirmed.";
        throw new Error(
          `${reason} Your estimate remains in this browser. Refresh to retry.`,
        );
      }
      if (localStorage.getItem(PENDING_ESTIMATE_KEY) === savedRaw) {
        localStorage.removeItem(PENDING_ESTIMATE_KEY);
      }
      return true;
    })
    .finally(() => {
      if (inFlight?.promise === promise) inFlight = null;
    });
  inFlight = { homeownerId, raw: savedRaw, promise };
  return promise;
}
