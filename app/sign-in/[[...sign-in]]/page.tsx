import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Welcome back to quotexbert
          </h1>
          <p className="text-ink-600">
            Sign in to access your dashboard and manage your projects
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-sm border border-ink-200 rounded-[var(--radius-card)]",
            }
          }}
        />
      </div>
    </div>
  )
}
