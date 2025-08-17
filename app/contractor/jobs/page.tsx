import { createApiUrl } from "@/lib/api-utils";
import { Metadata } from "next";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contractor Jobs - Browse Home Repair Leads | QuotexBert",
  description: "Browse verified home repair jobs in your area. Pay-per-lead system. Claim jobs that match your skills. Start earning more with QuotexBert today.",
  openGraph: {
    title: "Contractor Jobs - Browse Home Repair Leads",
    description: "Browse verified home repair jobs and claim leads that match your expertise.",
    images: ["/og-contractor-jobs.jpg"],
  },
};

export default async function ContractorJobsPage() {
  // Fetch jobs from API
  let jobs = [];

  try {
    const response = await fetch(createApiUrl("/api/jobs"), {
      cache: "no-store",
    });

    if (response.ok) {
      jobs = await response.json();
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Browse Jobs Posted by Homeowners in Your Area
          </h1>
          <p className="text-neutral-600 mb-6">
            Discover quality home repair projects from verified homeowners ready to hire. Our AI-powered system matches you with jobs that fit your skills, location, and availability.
          </p>
          
          {/* SEO Content Block */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">How QuotexBert Job Matching Works</h2>
            <p className="text-blue-800 mb-4">
              Homeowners post detailed repair needs including photos, descriptions, and budget ranges. Our AI system categorizes projects by trade, complexity, and location. Contractors browse available jobs, view project details, and claim leads that match their expertise.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <h3 className="font-medium text-blue-900 text-sm mb-1">Pre-qualified Homeowners</h3>
                <p className="text-blue-700 text-xs">Real budgets and serious intent</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <h3 className="font-medium text-blue-900 text-sm mb-1">Detailed Specifications</h3>
                <p className="text-blue-700 text-xs">Full project details before claiming</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <h3 className="font-medium text-blue-900 text-sm mb-1">Location-based Matching</h3>
                <p className="text-blue-700 text-xs">Efficient scheduling in your area</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-blue-200">
                <h3 className="font-medium text-blue-900 text-sm mb-1">Transparent Pricing</h3>
                <p className="text-blue-700 text-xs">No hidden fees, clear lead costs</p>
              </div>
            </div>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border">
            <div className="w-16 h-16 mx-auto mb-4 text-neutral-400">
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
                <circle cx="60" cy="60" r="3" fill="#ff6b35" />
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
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No jobs available right now
            </h3>
            <p className="text-neutral-600 mb-6">
              New home improvement projects are posted regularly. Check back
              soon or get notified when new jobs are available!
            </p>
            <div className="space-y-3">
              <button className="bg-[#800020] text-white px-6 py-2 rounded-lg hover:bg-[#600018] transition-colors">
                Set up job alerts
              </button>
              <p className="text-sm text-neutral-500">
                💡 <strong>Developers:</strong> Run{" "}
                <code className="bg-neutral-100 px-1 rounded">
                  npm run db:push
                </code>{" "}
                then use seed scripts to add demo jobs
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <div
                key={job.id}
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mb-2">
                    {job.trade && (
                      <span className="bg-[#800020]/10 text-[#800020] px-2 py-1 rounded-full">
                        {job.trade}
                      </span>
                    )}
                    <span>{job.city}</span>
                  </div>
                </div>

                <p className="text-neutral-700 mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  {job.budgetMin && job.budgetMax && (
                    <div className="text-sm">
                      <span className="text-neutral-600">Budget: </span>
                      <span className="font-semibold text-green-600">
                        ${job.budgetMin.toLocaleString()} - $
                        {job.budgetMax.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-500">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <a
                    href={`/contractor/jobs/${job.id}`}
                    className="bg-[#800020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#600018] transition-colors"
                  >
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
