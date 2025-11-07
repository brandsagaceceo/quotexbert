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
    const { userId, sessionClaims } = await auth.protect()
    
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Check session role first, then fallback to database
    let role = (sessionClaims?.publicMetadata as any)?.role as string
    
    // If no role in session, check database
    if (!role) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      })
      role = user?.role || ''
    }
    
    if (isAdminRoute(req) && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (isContractorRoute(req) && role !== 'contractor' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (isHomeownerRoute(req) && role !== 'homeowner' && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    if (!role && !req.nextUrl.pathname.startsWith('/onboarding')) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }
  
  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
