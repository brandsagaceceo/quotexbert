import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  // Profile & user API (original)
  "/profile(.*)",
  "/api/user(.*)",

  // Contractor authenticated area.
  // NOTE: /contractor/[id]/portfolio is intentionally excluded (public portfolio view).
  "/contractor/dashboard(.*)",
  "/contractor/jobs(.*)",
  "/contractor/leads-map(.*)",
  "/contractor/portfolio(.*)",
  "/contractor/quotes(.*)",
  "/contractor/settings(.*)",
  "/contractor/subscriptions(.*)",
  "/contractor/subscription(.*)",

  // All homeowner routes require auth
  "/homeowner(.*)",

  // Other authenticated routes
  "/messages(.*)",
  "/dashboard",
  "/notifications(.*)",
  "/create-lead(.*)",
  "/project/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Construct absolute URL for redirect
    const signInUrl = new URL('/sign-in', req.url);
    await auth.protect({
      unauthenticatedUrl: signInUrl.toString(),
    });
  }
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
