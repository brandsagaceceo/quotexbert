import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'// Temporary: Middleware disabled while building core features

import { NextResponse } from 'next/server'

import { NextResponse } from 'next/server'// Enable after setting up proper Clerk keys

// Define protected routes that require authentication

const isProtectedRoute = createRouteMatcher([

  '/dashboard(.*)',

  '/contractor(.*)',// Define protected routes that require authenticationexport default function middleware() {

  '/homeowner(.*)',

  '/admin(.*)',const isProtectedRoute = createRouteMatcher([  // No-op middleware for development

  '/profile(.*)',

  '/messages(.*)',  '/dashboard(.*)',}

  '/create-lead(.*)',

  '/onboarding(.*)',  '/contractor(.*)',

  '/billing(.*)',

  '/notifications(.*)',  '/homeowner(.*)',export const config = {

])

  '/admin(.*)',  matcher: [

const isPublicRoute = createRouteMatcher([

  '/',  '/profile(.*)',    // Skip Next.js internals and all static files, unless found in search params

  '/about',

  '/contact',  '/messages(.*)',    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

  '/sign-in(.*)',

  '/sign-up(.*)',  '/create-lead(.*)',    // Always run for API routes

  '/api/webhooks(.*)',

  '/api/estimate',  '/onboarding(.*)',    "/(api|trpc)(.*)",

  '/api/health',

])  '/billing(.*)',  ],



const isAdminRoute = createRouteMatcher(['/admin(.*)'])  '/notifications(.*)',};

const isContractorRoute = createRouteMatcher(['/contractor(.*)'])

const isHomeownerRoute = createRouteMatcher(['/homeowner(.*)'])])



export default clerkMiddleware(async (auth, req) => {/* 

  // Allow public routes without authentication

  if (isPublicRoute(req)) {const isPublicRoute = createRouteMatcher([// Full Clerk middleware - enable when keys are configured

    return NextResponse.next()

  }  '/',import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'



  // Protect all other routes  '/about',import { NextResponse } from 'next/server'

  if (isProtectedRoute(req)) {

    const { userId, sessionClaims } = await auth.protect()  '/contact',

    

    if (!userId) {  '/sign-in(.*)',const isProtectedRoute = createRouteMatcher([

      // Redirect to sign-in if not authenticated

      const signInUrl = new URL('/sign-in', req.url)  '/sign-up(.*)',  '/dashboard(.*)',

      signInUrl.searchParams.set('redirect_url', req.url)

      return NextResponse.redirect(signInUrl)  '/api/webhooks(.*)',  '/contractor(.*)',

    }

  '/api/estimate',  '/admin(.*)',

    // Get user role from session metadata

    const role = (sessionClaims?.publicMetadata as any)?.role as string  '/api/health',  '/onboarding(.*)',

    

    // Role-based access control])  '/api/protected(.*)'

    if (isAdminRoute(req) && role !== 'admin') {

      return NextResponse.redirect(new URL('/unauthorized', req.url))])

    }

    const isAdminRoute = createRouteMatcher(['/admin(.*)'])

    if (isContractorRoute(req) && role !== 'contractor' && role !== 'admin') {

      return NextResponse.redirect(new URL('/unauthorized', req.url))const isContractorRoute = createRouteMatcher(['/contractor(.*)'])const isAdminRoute = createRouteMatcher(['/admin(.*)'])

    }

    const isHomeownerRoute = createRouteMatcher(['/homeowner(.*)'])const isContractorRoute = createRouteMatcher(['/contractor(.*)'])

    if (isHomeownerRoute(req) && role !== 'homeowner' && role !== 'admin') {

      return NextResponse.redirect(new URL('/unauthorized', req.url))

    }

    export default clerkMiddleware(async (auth, req) => {export default clerkMiddleware(async (auth, req) => {

    // Redirect to onboarding if no role is set

    if (!role && !req.nextUrl.pathname.startsWith('/onboarding')) {  const { userId } = await auth()  if (isProtectedRoute(req)) {

      return NextResponse.redirect(new URL('/onboarding', req.url))

    }      const { userId, sessionClaims } = await auth.protect()

  }

    // Allow public routes without authentication    const role = (sessionClaims?.publicMetadata as any)?.role as string

  return NextResponse.next()

})  if (isPublicRoute(req)) {    



export const config = {    return NextResponse.next()    if (isAdminRoute(req) && role !== 'admin') {

  matcher: [

    // Skip Next.js internals and all static files  }      return NextResponse.redirect(new URL('/unauthorized', req.url))

    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',

    // Always run for API routes      }

    '/(api|trpc)(.*)',

  ],  // Protect all other routes    

}

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
