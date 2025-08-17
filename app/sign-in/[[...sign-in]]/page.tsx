"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Demo authentication - you can replace this with real auth later
    if (email === "admin@quotexbert.com" && password === "admin123") {
      alert("Welcome Admin! Redirecting to dashboard...");
      router.push("/admin/leads");
    } else if (email === "contractor@demo.com" && password === "demo123") {
      alert("Welcome Contractor! Redirecting to job board...");
      router.push("/contractor/jobs");
    } else if (email === "homeowner@demo.com" && password === "demo123") {
      alert("Welcome Homeowner! Redirecting to dashboard...");
      router.push("/dashboard");
    } else {
      alert(
        "Invalid credentials. Try:\n- admin@quotexbert.com / admin123\n- contractor@demo.com / demo123\n- homeowner@demo.com / demo123",
      );
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="text-center mb-8">
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Sign In
            </h1>
            <p className="text-neutral-600">Access your quotexbert account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800020] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#800020] text-white py-3 rounded-lg font-medium hover:bg-[#600018] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600 mb-2 font-medium">
              Demo Accounts:
            </p>
            <div className="text-xs text-neutral-500 space-y-1">
              <div>👨‍💼 Admin: admin@quotexbert.com / admin123</div>
              <div>🔨 Contractor: contractor@demo.com / demo123</div>
              <div>🏠 Homeowner: homeowner@demo.com / demo123</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-neutral-600">Don't have an account? </span>
            <Link
              href="/sign-up"
              className="text-[#800020] hover:underline font-medium"
            >
              Sign up
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="text-neutral-500 hover:text-neutral-700 text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
