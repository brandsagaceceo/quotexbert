// Temporary: Middleware disabled while building core features
// Enable after setting up proper Clerk keys

export default function middleware() {
  // No-op middleware for development
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

/* 
// Full Clerk middleware - enable when keys are configured
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/contractor(.*)',
  '/admin(.*)',
  '/onboarding(.*)',
  '/api/protected(.*)'
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isContractorRoute = createRouteMatcher(['/contractor(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId, sessionClaims } = await auth.protect()
    const role = (sessionClaims?.publicMetadata as any)?.role as string
    
    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (isContractorRoute(req) && role !== 'contractor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (!role && !req.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
})
*/
