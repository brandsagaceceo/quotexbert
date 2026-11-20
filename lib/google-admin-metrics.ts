import { createSign } from "node:crypto";
import { getVercelOidcToken } from "@vercel/oidc";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

type GoogleAccessToken = {
  value: string;
  expiresAt: number;
};

let cachedToken: GoogleAccessToken | null = null;

export interface GoogleConnectionStatus {
  serviceAccountConfigured: boolean;
  searchConsolePropertyConfigured: boolean;
  analyticsPropertyConfigured: boolean;
}

export interface GoogleAdminMetrics {
  status: GoogleConnectionStatus;
  searchConsole: {
    connected: boolean;
    error: string | null;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    queries: Array<{
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
  };
  analytics: {
    connected: boolean;
    error: string | null;
    activeUsers: number;
    sessions: number;
    pageViews: number;
    conversions: number;
    trafficSources: Array<{
      sourceMedium: string;
      sessions: number;
      activeUsers: number;
      conversions: number;
    }>;
    landingPages: Array<{
      path: string;
      sessions: number;
      activeUsers: number;
      conversions: number;
    }>;
    blogPages: Array<{
      path: string;
      pageViews: number;
      activeUsers: number;
      conversions: number;
    }>;
  };
}

export function getGoogleConnectionStatus(): GoogleConnectionStatus {
  return {
    serviceAccountConfigured: Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() &&
        (process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER?.trim() ||
          process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.trim()),
    ),
    searchConsolePropertyConfigured: Boolean(
      process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY_URL?.trim(),
    ),
    analyticsPropertyConfigured: Boolean(
      process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim(),
    ),
  };
}

export async function fetchGoogleAdminMetrics(
  days: number,
): Promise<GoogleAdminMetrics> {
  const status = getGoogleConnectionStatus();
  const result: GoogleAdminMetrics = {
    status,
    searchConsole: {
      connected: false,
      error: null,
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0,
      queries: [],
    },
    analytics: {
      connected: false,
      error: null,
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      conversions: 0,
      trafficSources: [],
      landingPages: [],
      blogPages: [],
    },
  };

  if (!status.serviceAccountConfigured) return result;

  let token: string;
  try {
    token = await getGoogleAccessToken();
  } catch (error) {
    const message = googleErrorMessage(error);
    if (status.searchConsolePropertyConfigured) {
      result.searchConsole.error = message;
    }
    if (status.analyticsPropertyConfigured) {
      result.analytics.error = message;
    }
    return result;
  }

  if (status.searchConsolePropertyConfigured) {
    try {
      result.searchConsole = await fetchSearchConsoleMetrics(token, days);
    } catch (error) {
      result.searchConsole.error = googleErrorMessage(error);
    }
  }

  if (status.analyticsPropertyConfigured) {
    try {
      result.analytics = await fetchAnalyticsMetrics(token, days);
    } catch (error) {
      result.analytics.error = googleErrorMessage(error);
    }
  }

  return result;
}

async function getGoogleAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const provider = process.env.GOOGLE_WORKLOAD_IDENTITY_PROVIDER?.trim();
  if (provider) {
    if (!email || process.env.VERCEL_ENV !== "preview") {
      throw new Error(
        "Google federation requires the reporting service account and a Vercel Preview deployment.",
      );
    }
    cachedToken = await getFederatedGoogleAccessToken(email, provider);
    return cachedToken.value;
  }

  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  ).trim();
  if (!email || !privateKey) {
    throw new Error("Google service account credentials are not configured");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = encodeJwtPart({ alg: "RS256", typ: "JWT" });
  const claims = encodeJwtPart({
    iss: email,
    scope: GOOGLE_SCOPES.join(" "),
    aud: GOOGLE_TOKEN_URL,
    iat: now,
    exp: now + 3600,
  });
  const unsignedToken = `${header}.${claims}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const assertion = `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;

  const response = await fetchWithTimeout(
    GOOGLE_TOKEN_URL,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }),
      cache: "no-store",
    },
    10_000,
  );
  if (!response.ok) {
    throw new GoogleApiError("Google authorization failed", response.status);
  }
  const body = (await response.json()) as {
    access_token?: unknown;
    expires_in?: unknown;
  };
  if (typeof body.access_token !== "string") {
    throw new Error("Google authorization returned no access token");
  }
  const expiresIn =
    typeof body.expires_in === "number" ? body.expires_in : 3600;
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  return cachedToken.value;
}

async function getFederatedGoogleAccessToken(
  email: string,
  provider: string,
): Promise<GoogleAccessToken> {
  if (
    !/^projects\/\d+\/locations\/global\/workloadIdentityPools\/[\w-]+\/providers\/[\w-]+$/.test(
      provider,
    )
  ) {
    throw new Error("The Google workload identity provider resource is invalid.");
  }

  let subjectToken: string;
  try {
    subjectToken = await getVercelOidcToken({
      audience: `https://iam.googleapis.com/${provider}`,
    });
  } catch {
    throw new Error(
      "Vercel OIDC authorization failed. Check the Preview project's OIDC configuration.",
    );
  }

  const exchange = await fetchWithTimeout(
    "https://sts.googleapis.com/v1/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        audience: `//iam.googleapis.com/${provider}`,
        grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
        requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
        subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
        subject_token: subjectToken,
        scope: "https://www.googleapis.com/auth/cloud-platform",
      }),
      cache: "no-store",
    },
    10_000,
  );
  if (!exchange.ok) {
    throw new Error(
      `Google federation exchange failed (${exchange.status}). Check the provider audience and Preview identity condition.`,
    );
  }
  const exchanged: { access_token?: unknown } = await exchange.json();
  if (
    typeof exchanged.access_token !== "string" ||
    !exchanged.access_token.trim()
  ) {
    throw new Error("Google federation returned no access token.");
  }

  const response = await fetchWithTimeout(
    `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${encodeURIComponent(email)}:generateAccessToken`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${exchanged.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scope: GOOGLE_SCOPES, lifetime: "600s" }),
      cache: "no-store",
    },
    10_000,
  );
  if (!response.ok) {
    throw new Error(
      `Google service-account impersonation failed (${response.status}). Check Workload Identity User permission and the IAM Service Account Credentials API.`,
    );
  }
  const body: { accessToken?: unknown; expireTime?: unknown } =
    await response.json();
  const expiresAt =
    typeof body.expireTime === "string" ? Date.parse(body.expireTime) : NaN;
  if (
    typeof body.accessToken !== "string" ||
    !body.accessToken.trim() ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now() + 60_000
  ) {
    throw new Error("Google impersonation returned invalid token credentials.");
  }
  return { value: body.accessToken, expiresAt };
}

async function fetchSearchConsoleMetrics(
  token: string,
  days: number,
): Promise<GoogleAdminMetrics["searchConsole"]> {
  const property = process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY_URL?.trim();
  if (!property) throw new Error("Search Console property is not configured");
  const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`;
  const dates = googleDateRange(days);
  const totals = await googleJsonRequest<{
    rows?: Array<{
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }>;
  }>(endpoint, token, dates);
  const queryRows = await googleJsonRequest<{
    rows?: Array<{
      keys?: string[];
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }>;
  }>(endpoint, token, {
    ...dates,
    dimensions: ["query"],
    rowLimit: 25,
  });
  const total = totals.rows?.[0];

  return {
    connected: true,
    error: null,
    clicks: total?.clicks || 0,
    impressions: total?.impressions || 0,
    ctr: total?.ctr || 0,
    position: total?.position || 0,
    queries: (queryRows.rows || []).map((row) => ({
      query: row.keys?.[0] || "(unknown query)",
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    })),
  };
}

async function fetchAnalyticsMetrics(
  token: string,
  days: number,
): Promise<GoogleAdminMetrics["analytics"]> {
  const rawProperty = process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim();
  if (!rawProperty) throw new Error("Analytics property is not configured");
  const property = rawProperty.replace(/^properties\//, "");
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(property)}:runReport`;
  const [body, traffic, landingPages, blogPages] = await Promise.all([
    googleJsonRequest<{
      rows?: Array<{ metricValues?: Array<{ value?: string }> }>;
    }>(endpoint, token, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      metrics: [
        { name: "activeUsers" },
        { name: "sessions" },
        { name: "screenPageViews" },
        { name: "keyEvents" },
      ],
      limit: 1,
    }),
    googleJsonRequest<GaDimensionReport>(endpoint, token, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "keyEvents" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    googleJsonRequest<GaDimensionReport>(endpoint, token, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "landingPagePlusQueryString" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "keyEvents" },
      ],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 20,
    }),
    googleJsonRequest<GaDimensionReport>(endpoint, token, {
      dateRanges: [{ startDate: `${days}daysAgo`, endDate: "today" }],
      dimensions: [{ name: "pagePath" }],
      dimensionFilter: {
        filter: {
          fieldName: "pagePath",
          stringFilter: {
            matchType: "BEGINS_WITH",
            value: "/blog/",
            caseSensitive: false,
          },
        },
      },
      metrics: [
        { name: "screenPageViews" },
        { name: "activeUsers" },
        { name: "keyEvents" },
      ],
      orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
      limit: 20,
    }),
  ]);
  const values = body.rows?.[0]?.metricValues || [];

  return {
    connected: true,
    error: null,
    activeUsers: numericMetric(values[0]?.value),
    sessions: numericMetric(values[1]?.value),
    pageViews: numericMetric(values[2]?.value),
    conversions: numericMetric(values[3]?.value),
    trafficSources: mapGaRows(traffic).map((row) => ({
      sourceMedium: row.dimension,
      sessions: row.metrics[0] || 0,
      activeUsers: row.metrics[1] || 0,
      conversions: row.metrics[2] || 0,
    })),
    landingPages: mapGaRows(landingPages).map((row) => ({
      path: row.dimension,
      sessions: row.metrics[0] || 0,
      activeUsers: row.metrics[1] || 0,
      conversions: row.metrics[2] || 0,
    })),
    blogPages: mapGaRows(blogPages).map((row) => ({
      path: row.dimension,
      pageViews: row.metrics[0] || 0,
      activeUsers: row.metrics[1] || 0,
      conversions: row.metrics[2] || 0,
    })),
  };
}

interface GaDimensionReport {
  rows?: Array<{
    dimensionValues?: Array<{ value?: string }>;
    metricValues?: Array<{ value?: string }>;
  }>;
}

function mapGaRows(report: GaDimensionReport) {
  return (report.rows || []).map((row) => ({
    dimension: row.dimensionValues?.[0]?.value || "(not set)",
    metrics: (row.metricValues || []).map((value) =>
      numericMetric(value.value),
    ),
  }));
}

async function googleJsonRequest<T>(
  endpoint: string,
  token: string,
  body: object,
) {
  const response = await fetchWithTimeout(
    endpoint,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    },
    12_000,
  );
  if (!response.ok) {
    throw new GoogleApiError("Google metrics request failed", response.status);
  }
  return (await response.json()) as T;
}

function googleDateRange(days: number) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 2);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Math.max(1, days - 1));
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

async function fetchWithTimeout(
  input: string,
  init: RequestInit,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function encodeJwtPart(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function numericMetric(value: string | undefined) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

class GoogleApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "GoogleApiError";
  }
}

function googleErrorMessage(error: unknown) {
  if (error instanceof GoogleApiError) {
    if (error.status === 401) {
      return "Google rejected the service account credentials.";
    }
    if (error.status === 403) {
      return "Google access is forbidden. Add the service account to the configured Search Console or Analytics property.";
    }
    if (error.status === 404) {
      return "The configured Google property was not found.";
    }
    return `Google API request failed (${error.status}).`;
  }
  if (error instanceof Error && error.name === "AbortError") {
    return "Google API request timed out.";
  }
  return error instanceof Error ? error.message : "Google API request failed.";
}
