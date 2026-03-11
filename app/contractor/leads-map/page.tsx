"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import LoadingState from "@/components/ui/LoadingState";
import { MapPin, DollarSign, Clock, Briefcase, Eye, CheckCircle } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;
  location?: string;
  zipCode: string;
  city?: string;
  description: string;
  status: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export default function ContractorLeadsMapPage() {
  const { authUser, isSignedIn, authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn || authUser?.role !== "contractor") {
      router.push("/sign-in");
      return;
    }
    fetchJobs();
  }, [isSignedIn, authUser, authLoading]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/jobs");
      if (response.ok) {
        const data = await response.json();
        // Filter for open jobs
        const openJobs = data.jobs.filter((job: Job) => job.status === "open");
        setJobs(openJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/contractor/jobs#job-${jobId}`);
  };

  const handleAcceptJob = (jobId: string) => {
    router.push(`/contractor/jobs#job-${jobId}`);
  };

  const getJobsByCity = () => {
    const cityMap: { [key: string]: Job[] } = {};
    jobs.forEach((job) => {
      const city = job.city || job.location || job.zipCode;
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(job);
    });
    return cityMap;
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  if (!isSignedIn || authUser?.role !== "contractor") {
    return null;
  }

  const jobsByCity = getJobsByCity();
  const cities = Object.keys(jobsByCity).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Jobs Near You
          </h1>
          <p className="text-gray-300 text-lg">
            Browse renovation leads in your service area
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">{jobs.length}</div>
            <div className="text-gray-300 text-sm">Available Jobs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">{cities.length}</div>
            <div className="text-gray-300 text-sm">Cities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 3600000).length}
            </div>
            <div className="text-gray-300 text-sm">New (Last Hour)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 1800000).length}
            </div>
            <div className="text-gray-300 text-sm">🔥 Hot Leads</div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "list"
                ? "bg-rose-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "map"
                ? "bg-rose-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Map View (Coming Soon)
          </button>
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="space-y-8">
            {cities.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
                <Briefcase size={64} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Jobs Available</h3>
                <p className="text-gray-300">
                  Check back soon for new renovation leads in your area.
                </p>
              </div>
            ) : (
              cities.map((city) => (
                <div key={city} className="space-y-4">
                  {/* City Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={24} className="text-rose-500" />
                    <h2 className="text-2xl font-bold text-white">{city}</h2>
                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {jobsByCity[city] ? jobsByCity[city].length : 0} {jobsByCity[city] && jobsByCity[city].length === 1 ? "job" : "jobs"}
                    </span>
                  </div>

                  {/* Job Cards */}
                  <div className="grid gap-4">
                    {jobsByCity[city] && jobsByCity[city].map((job) => (
                      <div
                        key={job.id}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Left Side - Job Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-rose-100 rounded-lg p-3">
                                <Briefcase size={24} className="text-rose-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                  <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded">
                                    {job.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {job.location || job.zipCode}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 mb-4 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign size={18} className="text-green-600" />
                                <span className="font-semibold">{job.budget}</span>
                              </div>
                              <UrgencyBadge createdAt={job.createdAt} />
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              <Eye size={18} />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                              <CheckCircle size={18} />
                              <span>Accept Job</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
            <MapPin size={64} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Interactive Map Coming Soon</h3>
            <p className="text-gray-300 mb-6">
              We're building an interactive map feature to help you visualize leads in your area.
            </p>
            <p className="text-gray-400 text-sm">
              For now, use the list view to browse all available jobs by city.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
