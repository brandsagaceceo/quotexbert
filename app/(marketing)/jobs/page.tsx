"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { submitLead } from "@/app/actions/submitLead";

declare global {
  interface Window {
    clarity?: (action: string, event: string, data?: any) => void;
  }
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ink-50 flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <JobsPageContent />
    </Suspense>
  );
}

function JobsPageContent() {
  const [estimate, setEstimate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [leadData, setLeadData] = useState<any>(null);
  const searchParams = useSearchParams();
  const affiliateCode = searchParams.get("ref");

  const projectTypes = [
    "Kitchen Renovation",
    "Bathroom Renovation",
    "Flooring",
    "Painting",
    "Roofing",
    "Plumbing",
    "Electrical",
    "HVAC",
    "Landscaping",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    // Add affiliate code if present
    if (affiliateCode) {
      formData.set("affiliateCode", affiliateCode);
    }

    try {
      const result = await submitLead(formData);

      if (result.blocked) {
        // Fire Clarity event for blocked submissions
        if (typeof window !== "undefined" && window.clarity) {
          window.clarity("event", "lead_blocked", { reason: result.reason });
        }

        setErrors({ general: result.error || "Submission blocked" });
        return;
      }

      if (!result.success) {
        setErrors({ general: result.error || "An error occurred" });
        return;
      }

      // Success - fire Clarity event
      if (typeof window !== "undefined" && window.clarity) {
        const projectType = formData.get("projectType") as string;
        window.clarity("event", "lead_submitted", {
          projectType,
          hasAffiliate: !!affiliateCode,
        });
      }

      setEstimate(result.estimate || "");
      setLeadData({
        postalCode: formData.get("postalCode"),
        projectType: formData.get("projectType"),
        description: formData.get("description"),
      });
    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (estimate && leadData) {
    return (
      <div className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white border border-green-200 rounded-[var(--radius-card)] p-8 text-center shadow-sm">
            <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              Quote Request Submitted!
            </h2>
            <div className="bg-green-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Estimated Project Cost
              </h3>
              <div className="text-3xl font-bold text-green-900 mb-2">
                {estimate}
              </div>
              <p className="text-sm text-green-700">
                This is a preliminary estimate based on your project details
              </p>
            </div>
            <div className="text-left bg-white border border-green-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-green-800 mb-2">
                Your Project Details:
              </h4>
              <div className="space-y-1 text-sm text-green-700">
                <p>
                  <strong>Location:</strong> {leadData.postalCode}
                </p>
                <p>
                  <strong>Project:</strong> {leadData.projectType}
                </p>
                <p>
                  <strong>Description:</strong> {leadData.description}
                </p>
              </div>
            </div>
            <p className="text-green-700 mb-6">
              Contractors in your area will review your request and reach out
              with detailed quotes.
            </p>
            <button
              onClick={() => {
                setEstimate(null);
                setLeadData(null);
                setErrors({});
              }}
              className="bg-[var(--brand)] hover:bg-[var(--brand-dark)] text-white px-6 py-3 rounded-[var(--radius-button)] font-semibold transition-colors duration-200"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-ink-900 mb-4">
            Get Your Quote
          </h1>
          <p className="text-xl text-ink-600 leading-relaxed">
            Tell us about your project and get instant estimates from trusted
            contractors.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] p-8 shadow-sm">
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="website"
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Postal Code */}
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-semibold text-ink-900 mb-2"
              >
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="postalCode"
                id="postalCode"
                required
                className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                placeholder="e.g., K1A 0A6"
              />
              {errors.postalCode && (
                <p className="text-red-600 text-sm mt-1">{errors.postalCode}</p>
              )}
            </div>

            {/* Project Type */}
            <div>
              <label
                htmlFor="projectType"
                className="block text-sm font-semibold text-ink-900 mb-2"
              >
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                name="projectType"
                id="projectType"
                required
                className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
              >
                <option value="">Select your project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.projectType && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.projectType}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-ink-900 mb-2"
              >
                Project Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={4}
                className="block w-full rounded-lg border-0 py-3 px-4 text-ink-900 shadow-sm ring-1 ring-inset ring-ink-300 placeholder:text-ink-500 focus:ring-2 focus:ring-inset focus:ring-[var(--brand)] sm:text-sm transition-colors duration-200"
                placeholder="Describe your project in detail. Include dimensions, materials, timeline, and any specific requirements..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[var(--brand)] hover:bg-[var(--brand-dark)] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-[var(--radius-button)] text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Getting Your Quote...
                  </span>
                ) : (
                  "Get Instant Quote"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <p className="text-ink-600 text-sm mb-4">
            Trusted by thousands of homeowners across Canada
          </p>
          <div className="flex justify-center items-center space-x-6 text-ink-400">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Verified Contractors</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">Free Quotes</span>
            </div>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">No Obligation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
