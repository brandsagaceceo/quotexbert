import { createApiUrl } from "@/lib/api-utils";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface JobPageProps {
  params: { id: string };
}

export default async function JobPage({ params }: JobPageProps) {
  let job = null;

  try {
    const response = await fetch(createApiUrl(`/api/jobs/${params.id}`), {
      cache: "no-store",
    });

    if (response.ok) {
      job = await response.json();
    }
  } catch (error) {
    console.error("Error fetching job:", error);
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-xl p-12 text-center border">
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Job Not Found
            </h1>
            <p className="text-neutral-600 mb-6">
              This job may have been claimed or is no longer available.
            </p>
            <Link
              href="/contractor/jobs"
              className="bg-[#800020] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#600018] transition-colors"
            >
              Back to Jobs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/contractor/jobs"
            className="text-[#800020] hover:underline text-sm font-medium"
          >
            ← Back to Jobs
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 border shadow-sm">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">
              {job.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              {job.trade && (
                <span className="bg-[#800020]/10 text-[#800020] px-3 py-1 rounded-full text-sm font-medium">
                  {job.trade}
                </span>
              )}
              <span className="text-neutral-600">📍 {job.city}</span>
              <span className="text-neutral-500 text-sm">
                Posted {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            {job.budgetMin && job.budgetMax && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-green-800 mb-1">
                  Project Budget
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  ${job.budgetMin.toLocaleString()} - $
                  {job.budgetMax.toLocaleString()}
                </p>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">
              Project Description
            </h3>
            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-4">
              <button
                className="bg-[#800020] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#600018] transition-colors"
                onClick={() => alert("Claim functionality coming soon!")}
              >
                Claim This Job
              </button>

              <button
                className="border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                onClick={() => alert("Save functionality coming soon!")}
              >
                Save for Later
              </button>

              <button
                className="border border-neutral-300 text-neutral-700 px-6 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                onClick={() => alert("Contact functionality coming soon!")}
              >
                Contact Homeowner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
