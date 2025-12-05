"use client";

import { useState } from "react";
// import { useUser } from '@clerk/nextjs'
import { useRouter } from "next/navigation";

const roles = [
  {
    id: "homeowner",
    title: "Homeowner",
    description: "I need home repair estimates and want to hire contractors",
    icon: "🏠",
    features: [
      "Get instant AI estimates",
      "Post repair jobs",
      "Find qualified contractors",
    ],
  },
  {
    id: "contractor",
    title: "Contractor",
    description: "I provide home repair services and want to find clients",
    icon: "🔨",
    features: [
      "Browse available jobs",
      "Connect with homeowners",
      "Grow your business",
    ],
  },
];

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Force redeploy v2
  const router = useRouter();

  const handleRoleSelection = async (roleId: string) => {
    setIsLoading(true);

    try {
      // Update user metadata with selected role via API
      console.log('Submitting role selection:', roleId);
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleId }),
      });

      console.log('API response status:', response.status);
      const data = await response.json();
      console.log('API response data:', data);

      if (!response.ok) {
        throw new Error(`Failed to update role: ${data.error || response.statusText}`);
      }

      // Use window.location for a full page reload which refreshes the Clerk session
      console.log('Redirecting to /profile');
      setTimeout(() => {
        window.location.href = "/profile";
      }, 500);
    } catch (error) {
      console.error("Error updating user role:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 text-[#800020]">
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
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Welcome to quotexbert
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Tell us how you'll be using quotexbert so we can customize your
            experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === role.id
                  ? "border-[#800020] bg-[#800020]/5"
                  : "border-neutral-200 hover:border-[#800020]/50 bg-white"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-neutral-600">{role.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {role.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-neutral-700"
                  >
                    <svg
                      className="w-5 h-5 text-[#800020] mr-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {selectedRole === role.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection(role.id);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#800020] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600018] transition-colors disabled:opacity-50"
                >
                  {isLoading
                    ? "Setting up your account..."
                    : `Continue as ${role.title}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
