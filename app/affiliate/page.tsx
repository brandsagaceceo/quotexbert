import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'
import { notFound, redirect } from 'next/navigation'

export default async function AffiliatePage() {
  const user = await currentUser()
  
  if (!user) {
    redirect('/sign-in')
  }

  // Get or create affiliate record
  let affiliate = await prisma.affiliate.findUnique({
    where: { email: user.emailAddresses[0]?.emailAddress || '' }
  })
  
  if (!affiliate) {
    affiliate = await prisma.affiliate.create({
      data: {
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.firstName + ' ' + user.lastName,
        referralCode: nanoid(8)
      }
    })
  }

  // Get affiliate stats
  const stats = await prisma.referral.aggregate({
    where: { 
      affiliateId: affiliate.id,
      leadId: { not: null }
    },
    _count: { id: true }
  })

  const recentReferrals = await prisma.referral.findMany({
    where: { affiliateId: affiliate.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  })

  const totalCommission = 0 // TODO: Implement commission calculation 
  const totalReferrals = stats._count.id || 0
  
  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://quotexbert.com'}/?ref=${affiliate.referralCode}`

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">
            Affiliate Dashboard
          </h1>
          <p className="text-xl text-ink-600">
            Earn 50% commission on every lead you refer
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-2">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600">${totalCommission.toFixed(2)}</p>
          </div>
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-2">Total Referrals</h3>
            <p className="text-3xl font-bold text-[var(--brand)]">{totalReferrals}</p>
          </div>
          <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6">
            <h3 className="text-lg font-semibold text-ink-900 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-ink-700">
              {totalReferrals > 0 ? '100' : '0'}%
            </p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6 mb-8">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">Your Referral Link</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              value={referralUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-ink-200 rounded-[var(--radius-input)] bg-ink-50 text-ink-700"
            />
            <button 
              onClick={() => navigator.clipboard.writeText(referralUrl)}
              className="px-6 py-2 bg-[var(--brand)] text-white rounded-[var(--radius-button)] hover:opacity-90 transition-opacity"
            >
              Copy Link
            </button>
          </div>
          <p className="text-sm text-ink-600 mt-2">
            Share this link to earn 50% commission on every lead that converts
          </p>
        </div>

        {/* Calling Script */}
        <div className="bg-gradient-to-r from-[var(--brand)]/5 to-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-[var(--radius-card)] p-6 mb-8">
          <h3 className="text-lg font-semibold text-ink-900 mb-4">💰 Affiliate Calling Script</h3>
          <div className="prose max-w-none text-ink-700">
            <p className="mb-4"><strong>Hi [Name],</strong></p>
            <p className="mb-4">
              I wanted to share something that could save you thousands on your next roofing project. 
              Have you been thinking about getting your roof inspected or repaired lately?
            </p>
            <p className="mb-4">
              I found this amazing tool called QuoteXbert that gets you instant roof estimates 
              from verified contractors in your area. The best part? It&apos;s completely free and 
              takes less than 2 minutes.
            </p>
            <p className="mb-4">
              <strong>Here&apos;s your personal link:</strong><br />
              <code className="bg-white px-2 py-1 rounded text-sm">{referralUrl}</code>
            </p>
            <p className="mb-4">
              They&apos;ll ask a few quick questions about your roof and instantly show you what 
              it should cost in your area. No pushy salespeople, no obligation - just honest 
              pricing so you know if you&apos;re getting a fair deal.
            </p>
            <p className="mb-0">
              <strong>Worth checking out if you&apos;re planning any roof work!</strong>
            </p>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-ink-200">
            <h3 className="text-lg font-semibold text-ink-900">Recent Referrals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                    Estimate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                    Commission
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-ink-200">
                {recentReferrals.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-ink-500">
                      No referrals yet. Start sharing your link to earn commissions!
                    </td>
                  </tr>
                ) : (
                  recentReferrals.map((referral: any) => (
                    <tr key={referral.id} className="hover:bg-ink-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {referral.lead ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Converted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Clicked
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                        {referral.lead?.estimate || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${(referral.commissionAmount || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
