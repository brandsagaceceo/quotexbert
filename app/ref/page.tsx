'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

function AffiliateRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const ref = searchParams.get('ref')

  useEffect(() => {
    // Track the click and redirect to jobs page
    if (ref) {
      // Track Clarity event for affiliate click
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'affiliate_click', { 
          affiliateCode: ref 
        })
      }

      // Store affiliate code in session storage for form submission
      sessionStorage.setItem('affiliateCode', ref)
      
      // Redirect to jobs page with ref parameter
      router.push(`/jobs?ref=${ref}`)
    } else {
      // No ref code, redirect to home
      router.push('/')
    }
  }, [ref, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)] mx-auto mb-4"></div>
        <p className="text-ink-600">Redirecting...</p>
      </div>
    </div>
  )
}

export default function AffiliateRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-ink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--brand)] mx-auto mb-4"></div>
          <p className="text-ink-600">Loading...</p>
        </div>
      </div>
    }>
      <AffiliateRedirectContent />
    </Suspense>
  )
}
