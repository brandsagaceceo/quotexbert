import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'// Temporary: Middleware disabled while building core features

import { NextResponse } from 'next/server'// Enable after setting up proper Clerk keys



// Define protected routes that require authenticationexport default function middleware() {

const isProtectedRoute = createRouteMatcher([  // No-op middleware for development

  '/dashboard(.*)',}

  '/contractor(.*)',

  '/homeowner(.*)',export const config = {

  '/admin(.*)',  matcher: [

  '/profile(.*)',    // Skip Next.js internals and all static files, unless found in search params

  '/messages(.*)',    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

  '/create-lead(.*)',    // Always run for API routes

  '/onboarding(.*)',    "/(api|trpc)(.*)",

  '/billing(.*)',  ],

  '/notifications(.*)',};

])

/* 

const isPublicRoute = createRouteMatcher([// Full Clerk middleware - enable when keys are configured

  '/',import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

  '/about',import { NextResponse } from 'next/server'

  '/contact',

  '/sign-in(.*)',const isProtectedRoute = createRouteMatcher([

  '/sign-up(.*)',  '/dashboard(.*)',

  '/api/webhooks(.*)',  '/contractor(.*)',

  '/api/estimate',  '/admin(.*)',

  '/api/health',  '/onboarding(.*)',

])  '/api/protected(.*)'

])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])

const isContractorRoute = createRouteMatcher(['/contractor(.*)'])const isAdminRoute = createRouteMatcher(['/admin(.*)'])

const isHomeownerRoute = createRouteMatcher(['/homeowner(.*)'])const isContractorRoute = createRouteMatcher(['/contractor(.*)'])



export default clerkMiddleware(async (auth, req) => {export default clerkMiddleware(async (auth, req) => {

  const { userId } = await auth()  if (isProtectedRoute(req)) {

      const { userId, sessionClaims } = await auth.protect()

  // Allow public routes without authentication    const role = (sessionClaims?.publicMetadata as any)?.role as string

  if (isPublicRoute(req)) {    

    return NextResponse.next()    if (isAdminRoute(req) && role !== 'admin') {

  }      return NextResponse.redirect(new URL('/unauthorized', req.url))

      }

  // Protect all other routes    

  if (isProtectedRoute(req)) {    if (isContractorRoute(req) && role !== 'contractor' && role !== 'admin') {

    if (!userId) {      return NextResponse.redirect(new URL('/unauthorized', req.url))

      // Redirect to sign-in if not authenticated    }

      const signInUrl = new URL('/sign-in', req.url)    

      signInUrl.searchParams.set('redirect_url', req.url)    if (!role && !req.nextUrl.pathname.startsWith('/onboarding')) {

      return NextResponse.redirect(signInUrl)      return NextResponse.redirect(new URL('/onboarding', req.url))

    }    }

      }

    // Get user session with metadata})

    const { sessionClaims } = await auth()*/

    const role = (sessionClaims?.publicMetadata as any)?.role as string
    
    // Role-based access control
    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (isContractorRoute(req) && role !== 'contractor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (isHomeownerRoute(req) && role !== 'homeowner' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    // Redirect to onboarding if no role is set
    if (!role && !req.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
