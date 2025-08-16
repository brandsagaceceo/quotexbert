import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Join quotexbert
          </h1>
          <p className="text-ink-600">
            Create your account to get started with instant contractor quotes
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-sm border border-ink-200 rounded-[var(--radius-card)]",
            }
          }}
          forceRedirectUrl="/onboarding/role"
        />
      </div>
    </div>
  )
}
