"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import LoadingState from "@/components/ui/LoadingState";
import { MapPin, DollarSign, Briefcase, Eye, CheckCircle } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hotOnly, setHotOnly] = useState(false);

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

  const getJobsByCity = (jobList: Job[]) => {
    const cityMap: { [key: string]: Job[] } = {};
    jobList.forEach((job) => {
      const city = job.city || job.location || job.zipCode;
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(job);
    });
    return cityMap;
  };

  const isHotLead = (job: Job) =>
    new Date().getTime() - new Date(job.createdAt).getTime() < 1800000;

  const allCategories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean))).sort();

  const filteredJobs = jobs.filter((job) => {
    if (hotOnly && !isHotLead(job)) return false;
    if (activeCategory && job.category !== activeCategory) return false;
    if (selectedCity) {
      const city = job.city || job.location || job.zipCode;
      if (city !== selectedCity) return false;
    }
    return true;
  });

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  if (!isSignedIn || authUser?.role !== "contractor") {
    return null;
  }

  const jobsByCity = getJobsByCity(filteredJobs);
  const cities = Object.keys(jobsByCity).sort();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            Jobs Near You
          </h1>
          <p className="text-slate-500 text-sm">
            Browse renovation leads in your service area
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="stat-card">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Available Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Object.keys(getJobsByCity(jobs)).length}</div>
            <div className="stat-label">Cities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 3600000).length}
            </div>
            <div className="stat-label">New (Last Hour)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {jobs.filter((j) => isHotLead(j)).length}
            </div>
            <div className="stat-label">🔥 Hot Leads</div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-4">
          <div className="chip-scroll-row">
            <button
              onClick={() => setHotOnly((v) => !v)}
              className={`stage-chip whitespace-nowrap ${hotOnly ? "active" : ""}`}
            >
              🔥 Hot Leads Only
            </button>
            <button
              onClick={() => setActiveCategory(null)}
              className={`stage-chip whitespace-nowrap ${!activeCategory ? "active" : ""}`}
            >
              All Categories
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`stage-chip whitespace-nowrap ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-5 flex items-center justify-end gap-3">
          {(selectedCity || activeCategory || hotOnly) && (
            <button
              onClick={() => { setSelectedCity(null); setActiveCategory(null); setHotOnly(false); }}
              className="text-xs text-rose-600 hover:text-rose-700 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-8">
          {cities.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
              <Briefcase size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Jobs Found</h3>
              <p className="text-slate-500 text-sm mb-4">
                {hotOnly || activeCategory || selectedCity
                  ? "Try clearing your filters to see all available leads."
                  : "Check back soon for new renovation leads in your area."}
              </p>
              {(hotOnly || activeCategory || selectedCity) && (
                <button
                  onClick={() => { setSelectedCity(null); setActiveCategory(null); setHotOnly(false); }}
                  className="text-rose-600 underline text-sm hover:text-rose-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            cities.map((city) => (
                <div key={city} className="space-y-4">
                  {/* City Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin size={20} className="text-rose-500" />
                    <h2 className="text-lg font-bold text-slate-900">{city}</h2>
                    <span className="bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      {jobsByCity[city] ? jobsByCity[city].length : 0} {jobsByCity[city] && jobsByCity[city].length === 1 ? "job" : "jobs"}
                    </span>
                  </div>

                  {/* Job Cards */}
                  <div className="grid gap-3">
                    {jobsByCity[city] && jobsByCity[city].map((job) => (
                      <div
                        key={job.id}
                        className="job-card-compact"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          {/* Left Side - Job Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="text-base font-bold text-slate-900">
                                    {job.title}
                                  </h3>
                                  {isHotLead(job) && (
                                    <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-semibold">🔥 Hot</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                                  <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded">
                                    {job.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {job.location || job.zipCode}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-1 text-green-700 text-sm font-semibold">
                                <DollarSign size={14} className="text-green-600" />
                                {job.budget}
                              </div>
                              <UrgencyBadge createdAt={job.createdAt} />
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Eye size={15} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <CheckCircle size={15} />
                              <span>Accept</span>
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
      </div>
    </div>
  );
}
