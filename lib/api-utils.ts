/**
 * Get the base URL for API calls in server components
 * Uses environment variable or defaults to localhost in development
 */
export function getBaseUrl(): string {
  // In production, use the deployed URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Custom base URL from environment
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // Development fallback
  return "http://localhost:3000";
}

/**
 * Create a relative API URL for server-side fetching
 * @param path - API path (e.g., '/api/jobs')
 */
export function createApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
