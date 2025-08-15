import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              quotexbert
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get instant quotes for your home improvement projects. Connect with verified contractors and get the job done right.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/jobs"
                className="rounded-md bg-[color:var(--brand)] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[color:var(--brand)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] transition-colors duration-200"
              >
                Get a Quote
              </Link>
              <Link
                href="/contractors"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-[color:var(--brand)] transition-colors duration-200"
              >
                Join as Contractor <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-[color:var(--brand)]">Get Started</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for your project
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--brand)]">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Instant Estimates
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Get preliminary pricing for your project in seconds, not days.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--brand)]">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Verified Contractors
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Work with pre-screened, licensed contractors in your area.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
