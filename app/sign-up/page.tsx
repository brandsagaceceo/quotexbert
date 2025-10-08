"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default function SignUpPage() {
  const router = useRouter();
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        // Redirect to role selection for new users
        router.push("/select-role");
      } else {
        setError(result.error || "Sign up failed");
      }
    } catch (error) {
      setError("An error occurred during sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">QuoteXpert</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Join Our Platform</h2>
          <p className="mt-2 text-gray-600">
            Connect with trusted professionals or find your next project
          </p>
        </div>

        <Card variant="elevated" className="mt-8">
          <CardHeader className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Create your account</h3>
            <p className="text-sm text-gray-600 mt-1">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in here
              </Link>
            </p>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={handleGoogleSignUp}
                isLoading={isLoading}
                className="w-full border-2 border-gray-300 hover:border-gray-400"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
              </Button>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">What's next?</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Sign up with Google</li>
                  <li>2. Choose your role (Homeowner or Contractor)</li>
                  <li>3. Complete your profile</li>
                  <li>4. Start using QuoteXpert!</li>
                </ol>
              </div>

              <div className="text-sm text-gray-500 text-center">
                <p className="mb-2">🏠 <strong>Homeowners:</strong> Get instant AI estimates and hire trusted contractors</p>
                <p>🔧 <strong>Contractors:</strong> Find quality leads and grow your business</p>
              </div>

              <div className="text-xs text-gray-400 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}