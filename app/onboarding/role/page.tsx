"use client";

// import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function RoleOnboardingPage() {
  // const { user } = useUser()
  const user = null // Mock for demo
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const selectRole = async (role: 'homeowner' | 'contractor') => {
    // if (!user) return
    
    setIsLoading(true)
    try {
      // await user.update({
      //   unsafeMetadata: {
      //     ...user.unsafeMetadata,
      //     role: role
      //   }
      // })
      
      // Track role selection
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'role_selected', { role })
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to update role:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink-100 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/logo.svg"
              alt="quotexbert logo"
              width={48}
              height={48}
              className="w-12 h-12"
            />
          </div>
          <h1 className="text-4xl font-bold text-ink-900 mb-4">
            Welcome to quotexbert!
          </h1>
          <p className="text-xl text-ink-600">
            Let us know how you&apos;d like to use quotexbert
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Homeowner Option */}
          <button
            onClick={() => selectRole('homeowner')}
            disabled={isLoading}
            className="bg-white border-2 border-ink-200 rounded-xl p-8 text-left hover:border-brand hover:bg-brand/5 transition-all duration-200 disabled:opacity-50 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-xl group-hover:bg-brand/20">
                  <svg className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-ink-900 mb-2">I&apos;m a Homeowner</h3>
                <p className="text-ink-600">
                  Get instant quotes for home improvement projects from trusted contractors in your area.
                </p>
              </div>
            </div>
          </button>

          {/* Contractor Option */}
          <button
            onClick={() => selectRole('contractor')}
            disabled={isLoading}
            className="bg-white border-2 border-ink-200 rounded-xl p-8 text-left hover:border-brand hover:bg-brand/5 transition-all duration-200 disabled:opacity-50 group"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-brand/10 rounded-xl group-hover:bg-brand/20">
                  <svg className="h-6 w-6 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-ink-900 mb-2">I&apos;m a Contractor</h3>
                <p className="text-ink-600">
                  Connect with homeowners, manage leads, and grow your business through our platform.
                </p>
              </div>
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[var(--brand)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Setting up your account...
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
