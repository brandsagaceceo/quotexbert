"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const roles = [
    {
      id: "homeowner",
      title: "Homeowner",
      description: "I need home repair estimates and want to hire contractors",
      icon: "🏠",
    },
    {
      id: "contractor",
      title: "Contractor",
      description: "I provide home repair services and want to find clients",
      icon: "🔨",
    },
  ];

  const handleRoleSelection = async (roleId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: roleId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Redirect to profile
      window.location.href = "/profile";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to QuoteXbert</h1>
          <p className="text-xl text-gray-600">Choose your account type</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-lg">
            Error: {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <div
              key={role.id}
              className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRole === role.id
                  ? "border-[#800020] bg-[#800020]/5"
                  : "border-neutral-200 hover:border-[#800020]/50"
              }`}
              onClick={() => setSelectedRole(role.id)}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{role.icon}</div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">{role.title}</h3>
                <p className="text-neutral-600">{role.description}</p>
              </div>

              {selectedRole === role.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelection(role.id);
                  }}
                  disabled={isLoading}
                  className="w-full bg-[#800020] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600018] transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Setting up..." : `Continue as ${role.title}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
