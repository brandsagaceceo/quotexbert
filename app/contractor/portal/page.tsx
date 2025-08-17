import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProBadge from "@/app/_components/pro-badge";

export default async function ContractorPortalPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  if (user.role !== "contractor") {
    redirect("/dashboard");
  }

  const isPro = false; // TODO: Check Pro status from database

  return (
    <div className="min-h-screen bg-ink-100 py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <h1 className="text-4xl font-bold text-ink-900">
                  Contractor Portal
                </h1>
                {isPro && (
                  <div className="ml-4">
                    <ProBadge size="lg" />
                  </div>
                )}
              </div>
              <p className="text-xl text-ink-600">
                Manage your leads and grow your business with quotexbert
              </p>
            </div>
            {!isPro && (
              <Link
                href="/contractors?upgrade=true"
                className="bg-brand hover:bg-brand-dark text-white px-6 py-3 rounded-xl font-bold transition-colors duration-200 flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
                Upgrade to Pro
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Management */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-ink-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-ink-900 mb-6">
                Recent Leads
              </h3>
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-ink-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h4 className="mt-4 text-lg font-medium text-ink-900">
                  No leads yet
                </h4>
                <p className="mt-2 text-ink-600">
                  When homeowners request quotes in your area, they&apos;ll
                  appear here.
                </p>
                {!isPro && (
                  <div className="mt-4">
                    <Link
                      href="/contractors?upgrade=true"
                      className="text-brand hover:text-brand-dark font-medium"
                    >
                      Upgrade to Pro for priority leads →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pro Benefits */}
            {!isPro && (
              <div className="bg-gradient-to-br from-brand/5 to-brand/10 border border-brand/20 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <ProBadge size="md" />
                  <h3 className="text-lg font-bold text-ink-900 ml-2">
                    Upgrade to Pro
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-ink-700 mb-4">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-brand mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Priority lead placement
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-brand mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Verified contractor badge
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-brand mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Advanced analytics
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-brand mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <Link
                  href="/contractors?upgrade=true"
                  className="w-full bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-xl font-bold transition-colors duration-200 block text-center"
                >
                  Start Free Trial
                </Link>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white border border-ink-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-ink-900 mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-600">New Leads</span>
                    <span className="font-semibold text-ink-900">0</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-600">Quotes Sent</span>
                    <span className="font-semibold text-ink-900">0</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-ink-600">Projects Won</span>
                    <span className="font-semibold text-ink-900">0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-ink-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-4 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200">
                  Update Profile
                </button>
                <button className="w-full text-left bg-white hover:bg-ink-50 text-ink-900 border border-ink-300 px-4 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200">
                  View Service Areas
                </button>
                <button className="w-full text-left bg-white hover:bg-ink-50 text-ink-900 border border-ink-300 px-4 py-2 rounded-[var(--radius-button)] font-medium transition-colors duration-200">
                  Billing & Payments
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
