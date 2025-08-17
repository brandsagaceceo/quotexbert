import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          {/* Robot logo */}
          <div className="w-16 h-16 mx-auto mb-4 text-[#800020]">
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
              <rect x="45" y="50" width="10" height="4" fill="#ff6b35" rx="2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Access Denied
          </h1>
          <p className="text-neutral-600">
            You don't have permission to access this page.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-[#800020] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#600018] transition-colors"
          >
            Return Home
          </Link>

          <Link
            href="/dashboard"
            className="block w-full border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
