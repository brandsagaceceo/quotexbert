"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { authUser: user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Access Restricted</h1>
          <p className="text-center mb-6">You need to sign in as a contractor to view jobs.</p>
          <div className="text-center">
            <Link href="/sign-in" className="bg-gradient-to-r from-red-800 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "contractor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Contractor Access Only</h1>
          <p className="text-center mb-6">This page is only accessible to contractors.</p>
          <div className="text-center">
            <Link href="/" className="bg-gradient-to-r from-red-800 to-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-slate-50 to-red-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-800 to-teal-600 bg-clip-text text-transparent mb-4">
            Available Jobs
          </h1>
          <p className="text-xl text-slate-600">
            Browse home improvement projects in your area
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Jobs Available</h3>
            <p className="text-slate-500">Check back later for new opportunities.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title || "Home Improvement Project"}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span>{job.location || "Location TBD"}</span>
                      <span>{job.budget || "Budget TBD"}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Open
                  </span>
                </div>
                <p className="text-slate-700 mb-4">{job.description || "Project description not available."}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">
                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : "recently"}
                  </span>
                  <button className="bg-gradient-to-r from-red-800 to-teal-600 hover:from-red-900 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-semibold">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
