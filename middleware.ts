import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/contractor(.*)',
  '/homeowner(.*)',
  '/admin(.*)',
  '/profile(.*)',
  '/messages(.*)',
  '/create-lead(.*)',
  '/onboarding(.*)',
  '/billing(.*)',
  '/notifications(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/about',
  '/contact',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks(.*)',
  '/api/estimate',
  '/api/health',
  '/privacy',
  '/terms',
])

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isContractorRoute = createRouteMatcher(['/contractor(.*)'])
const isHomeownerRoute = createRouteMatcher(['/homeowner(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  if (isProtectedRoute(req)) {
    const { userId } = await auth.protect()
    
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // TEMPORARY: Role checks disabled to allow access while fixing auth flow
    // TODO: Re-enable after fixing Clerk session refresh issues
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
// Force deployment v2
