import Link from "next/link";

export default function DashboardPage() {
  // For demo purposes, we'll show the homeowner dashboard directly
  // In production, this would check authentication and user role

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Homeowner Dashboard
          </h1>
          <p className="text-neutral-600">
            Manage your home improvement projects and connect with contractors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                href="/"
                className="block w-full bg-[#800020] text-white text-center py-2 rounded-lg hover:bg-[#600018] transition-colors"
              >
                Get AI Estimate
              </Link>
              <button className="block w-full border border-neutral-300 text-neutral-700 text-center py-2 rounded-lg hover:bg-neutral-50 transition-colors">
                Post New Project
              </button>
              <Link
                href="/contractor/jobs"
                className="block w-full border border-neutral-300 text-neutral-700 text-center py-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Browse Contractors
              </Link>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Recent Projects
            </h3>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 text-neutral-400">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect
                    x="30"
                    y="30"
                    width="40"
                    height="40"
                    fill="currentColor"
                    rx="4"
                  />
                  <circle cx="40" cy="40" r="3" fill="#ff6b35" />
                  <circle cx="60" cy="40" r="3" fill="#ff6b35" />
                  <rect
                    x="45"
                    y="50"
                    width="10"
                    height="4"
                    fill="#ff6b35"
                    rx="2"
                  />
                </svg>
              </div>
              <p className="text-neutral-500 text-sm">No projects yet</p>
              <button className="mt-2 text-[#800020] hover:underline text-sm font-medium">
                Start your first project
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Messages
            </h3>
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 text-neutral-400">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-full h-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <p className="text-neutral-500 text-sm">No messages</p>
            </div>
          </div>
        </div>

        {/* Project Ideas */}
        <div className="bg-white rounded-xl p-8 border shadow-sm mb-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">
            Popular Home Improvement Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border border-neutral-200 rounded-lg hover:border-[#800020] transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium text-neutral-900 mb-1">Painting</h4>
              <p className="text-sm text-neutral-600">
                Interior & exterior painting
              </p>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg hover:border-[#800020] transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🚿</div>
              <h4 className="font-medium text-neutral-900 mb-1">Bathroom</h4>
              <p className="text-sm text-neutral-600">Renovation & repairs</p>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg hover:border-[#800020] transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🍳</div>
              <h4 className="font-medium text-neutral-900 mb-1">Kitchen</h4>
              <p className="text-sm text-neutral-600">Upgrades & remodeling</p>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg hover:border-[#800020] transition-colors cursor-pointer">
              <div className="text-2xl mb-2">🏠</div>
              <h4 className="font-medium text-neutral-900 mb-1">Roofing</h4>
              <p className="text-sm text-neutral-600">Repair & replacement</p>
            </div>
          </div>
        </div>

        {/* Features Coming Soon */}
        <div className="bg-white rounded-xl p-8 border shadow-sm">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">
            Features Coming Soon
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">
                Project Management
              </h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Track project progress
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Schedule milestones
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Payment processing
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-neutral-900">Communication</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Direct messaging with contractors
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Photo sharing and updates
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 text-green-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Real-time notifications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
