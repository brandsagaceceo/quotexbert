import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-3">
            QuoteXbert
          </h1>
          <p className="text-lg text-slate-700 font-medium">
            Welcome back!
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Sign in with your email to continue
          </p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-2xl border-2 border-rose-100",
              headerTitle: "text-2xl font-bold text-slate-900",
              headerSubtitle: "text-slate-600",
              socialButtonsBlockButton: "hidden",
              formButtonPrimary: "bg-gradient-to-r from-rose-700 to-orange-600 hover:from-rose-800 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all",
              formFieldInput: "border-2 border-slate-300 focus:border-rose-500 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-rose-200",
              footerActionLink: "text-rose-700 hover:text-orange-600 font-semibold"
            }
          }}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/onboarding"
        />
      </div>
    </div>
  );
}
