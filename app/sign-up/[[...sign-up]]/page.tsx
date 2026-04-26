import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-6 sm:py-12 px-4 overflow-y-auto safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-2 sm:mb-3">
            QuoteXbert
          </h1>
          <p className="text-base sm:text-lg text-slate-700 font-medium">
            Get started in seconds
          </p>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2">
            Enter your email to receive a verification code
          </p>
        </div>
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
