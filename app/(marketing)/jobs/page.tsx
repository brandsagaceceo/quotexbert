"use client";

import { useState } from "react";

export default function JobsPage() {
  const [formData, setFormData] = useState({
    postalCode: "",
    projectType: "",
    description: "",
  });
  const [estimate, setEstimate] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate a random estimate range
    const basePrice = Math.floor(Math.random() * 3000) + 500;
    const upperPrice = basePrice + Math.floor(Math.random() * 800) + 200;
    
    setEstimate(`$${basePrice.toLocaleString()} – $${upperPrice.toLocaleString()}`);
    setIsSubmitting(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get an Instant Quote
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            Tell us about your project and get a preliminary estimate in seconds.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Postal Code */}
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium leading-6 text-gray-900">
                Postal Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="postalCode"
                  id="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  placeholder="e.g., 12345"
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[color:var(--brand)] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Project Type */}
            <div>
              <label htmlFor="projectType" className="block text-sm font-medium leading-6 text-gray-900">
                Project Type
              </label>
              <div className="mt-2">
                <select
                  name="projectType"
                  id="projectType"
                  required
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-[color:var(--brand)] sm:text-sm sm:leading-6"
                >
                  <option value="">Select a project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                Job Description
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your project in detail..."
                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[color:var(--brand)] sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-md bg-[color:var(--brand)] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[color:var(--brand)]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--brand)] disabled:opacity-50 transition-colors duration-200"
              >
                {isSubmitting ? "Getting Estimate..." : "Get Instant Estimate"}
              </button>
            </div>
          </form>

          {/* Estimate Result */}
          {estimate && (
            <div className="mt-8 rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Your Estimated Project Cost
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p className="text-lg font-semibold">{estimate}</p>
                    <p className="mt-1">This is a preliminary estimate. Final pricing may vary based on specific requirements and contractor quotes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
