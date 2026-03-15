"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SelectRolePage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"contractor" | "homeowner" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelection = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to set role. Please try again.");
      }

      // Mark first login so the profile page shows the onboarding tour
      localStorage.setItem("show_onboarding_tour", "1");

      // Always send to profile after first role selection
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to QuoteXbert!</h1>
          <h2 className="text-2xl font-semibold text-gray-700">Choose your role</h2>
          <p className="mt-2 text-gray-600">
            Select how you'd like to use our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {/* Homeowner Card */}
          <Card 
            variant={selectedRole === "homeowner" ? "elevated" : "default"}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRole === "homeowner" 
                ? "ring-2 ring-orange-500 border-orange-500" 
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole("homeowner")}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-gray-900">Homeowner</h3>
              <p className="text-orange-600 font-semibold">I need work done</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-gray-700">
                  <h4 className="font-semibold mb-2">Perfect for you if you:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      Need home improvement or repair work
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      Want instant AI-powered estimates
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      Want to find trusted contractors
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      Compare quotes and reviews
                    </li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Get started:</strong> Upload photos, describe your project, 
                    and get instant estimates from qualified contractors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contractor Card */}
          <Card 
            variant={selectedRole === "contractor" ? "elevated" : "default"}
            className={`cursor-pointer transition-all duration-200 ${
              selectedRole === "contractor" 
                ? "ring-2 ring-green-500 border-green-500" 
                : "hover:shadow-lg"
            }`}
            onClick={() => setSelectedRole("contractor")}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold text-gray-900">Contractor</h3>
              <p className="text-green-600 font-semibold">I provide services</p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="text-gray-700">
                  <h4 className="font-semibold mb-2">Perfect for you if you:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Offer home improvement services
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Want to find new customers
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Have licenses and insurance
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      Want to grow your business
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Get started:</strong> Complete your profile, set your 
                    service areas, and start bidding on projects.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          {error && (
            <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          <Button
            variant="primary"
            size="lg"
            onClick={handleRoleSelection}
            disabled={!selectedRole || isLoading}
            isLoading={isLoading}
            className="px-8 py-3"
          >
            {isLoading ? "Setting up your account..." : "Continue"}
          </Button>
          
          <p className="mt-4 text-sm text-gray-500">
            You can change your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
}