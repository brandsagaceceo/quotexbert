import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  const userRole = user.role || 'No role assigned'
  const isContractor = user.role === 'contractor'
  const isPro = false // TODO: Check Pro status from database

  return (
    <div className="min-h-screen bg-ink-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <h1 className="text-4xl font-bold text-ink-900">
              Welcome to your Dashboard
            </h1>
            {isContractor && isPro && (
              <div className="ml-4 flex items-center">
                <div className="relative">
                  <Image
                    src="/logo.svg"
                    alt="Pro Badge"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-brand"></div>
                </div>
                <span className="ml-2 text-sm font-bold text-brand">PRO</span>
              </div>
            )}
          </div>
          <p className="text-xl text-ink-600">
            Role: <span className="capitalize font-medium">{userRole}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-white border border-ink-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-ink-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/jobs" 
                className="block text-brand hover:text-brand-dark font-medium transition-colors"
              >
                → Get a Quote
              </Link>
              {isContractor && (
                <Link 
                  href="/contractor/portal" 
                  className="block text-brand hover:text-brand-dark font-medium transition-colors"
                >
                  → Contractor Portal
                </Link>
              )}
              <Link 
                href="/affiliates" 
                className="block text-brand hover:text-brand-dark font-medium transition-colors"
              >
                → Affiliate Program
              </Link>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Account Info</h3>
            <div className="space-y-2 text-sm text-ink-600">
              <p>User ID: {user.id}</p>
              <p>Email: {user.email || 'Not provided'}</p>
              <p>Role: {userRole}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-ink-900 mb-4">Recent Activity</h3>
            <p className="text-ink-600 text-sm">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
